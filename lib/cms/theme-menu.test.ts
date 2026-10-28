import { describe, expect, it } from "vitest";
import { defaultContent } from "./defaults";
import { resolveMenu } from "./menu";
import { normalize } from "./normalize";
import { categoryProblem, channelOf, postPath, withCategories } from "./post-format";
import { customFontKey, customFontName, emptyPageStyle, fontChoices, fontFaceCss, fontFileType, googleFontsHref, menuStyleVars, mergeEffects, mergePageStyle, pageStyleVars, sectionStyleVars, stylesheetUrl } from "./theme";

const content = defaultContent();

describe("page and section styles", () => {
  it("lets the page override the theme, and the theme fill what the page leaves empty", () => {
    const s = mergePageStyle({ ...emptyPageStyle(), text: "#111111", font: "lora", textScale: 110 }, { ...emptyPageStyle(), text: "#222222" });
    expect(s).toMatchObject({ text: "#222222", font: "lora", textScale: 110, heading: "" });
  });

  it("turns fonts and sizes into CSS variables, ignoring out-of-range scales", () => {
    const vars = pageStyleVars({ ...emptyPageStyle(), headingFont: "playfair-display", textScale: 120, background: "#fafafa" }) as Record<string, string>;
    expect(vars["--font-display"]).toContain("Playfair Display");
    expect(vars["--text-base"]).toBe("1.2rem");
    expect(vars["--page-bg"]).toBe("#fafafa");
    expect(Object.keys(pageStyleVars({ ...emptyPageStyle(), textScale: 900 }))).toHaveLength(0);
  });

  it("applies page text colours to light sections only, unless the section sets its own", () => {
    const page = { ...emptyPageStyle(), text: "#333333", heading: "#0a0a0a" };
    expect(sectionStyleVars(undefined, page, "white").attrs).toHaveProperty("data-cms-text");
    expect(sectionStyleVars(undefined, page, "dark").attrs).toEqual({});
    // A custom background means the page's colours were not chosen for it.
    expect(sectionStyleVars({ background: "#000000" }, page, "white").attrs).toEqual({});
    const own = sectionStyleVars({ background: "#000000", text: "#ffffff" }, page, "dark");
    expect(own.style).toMatchObject({ backgroundColor: "#000000", "--cms-text": "#ffffff" });
  });

  it("never puts anything but a #rrggbb colour into a style attribute", () => {
    const { style } = sectionStyleVars({ background: "red; position:fixed", text: "url(x)", frame: "box", border: "javascript:1", borderWidth: 999, radius: -5 }, emptyPageStyle(), "white");
    expect(style).not.toHaveProperty("backgroundColor");
    expect(style).not.toHaveProperty("--cms-text");
    expect(style).toMatchObject({ "--frame-color": "var(--color-mist-200)", "--frame-width": "12px", "--frame-radius": "0px" });
  });

  it("loads only the Google fonts in use, once each", () => {
    expect(googleFontsHref(["inter", "phudu", ""])).toBeNull();
    const href = googleFontsHref(["lora", "be-vietnam-pro", "lora"]);
    expect(href).toBe("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Lora:wght@400;500;600;700&display=swap");
  });

  it("maps the menu style to the variables the header reads", () => {
    expect(menuStyleVars({ font: "", size: 16, weight: "600", uppercase: true, color: "#ffffff", colorSolid: "nope" })).toEqual({
      "--menu-size": "16px",
      "--menu-weight": "600",
      "--menu-case": "uppercase",
      "--menu-color": "#ffffff",
    });
  });
});

describe("menu", () => {
  it("starts as the old fixed menu, with the product groups under Products", () => {
    const menu = resolveMenu(content, "vi");
    expect(menu.map((m) => m.href)).toEqual(["/vi", "/vi/about", "/vi/products", "/vi/quality", "/vi/health", "/vi/news", "/vi/contact"]);
    const products = menu.find((m) => m.href === "/vi/products")!;
    expect(products.children.map((c) => c.href)).toEqual(content.products.map((p) => `/vi/products/${p.slug}`));
    expect(menu.find((m) => m.href === "/vi/health")?.wide).toBe(true);
  });

  it("follows groups and categories added in Studio, then the hand-made sub-items", () => {
    const c = structuredClone(content);
    c.products.push({ ...structuredClone(c.products[0]), slug: "hat-dua" });
    c.menu = [{ label: { ...c.menu[0].label, en: "News" }, href: "/news", auto: "newsCategories", wide: false, children: [{ label: { vi: "Tuyển dụng", en: "Jobs", zh: "", ja: "", ko: "" }, href: "/jobs" }] }];
    c.categories.push({ ...structuredClone(c.categories[0]), slug: "cong-thuc" });
    expect(resolveMenu(c, "en")[0].children.map((x) => x.href)).toEqual(["/en/news", "/en/health", "/en/cong-thuc", "/en/jobs"]);
    expect(resolveMenu({ ...c, menu: [{ ...c.menu[0], auto: "productGroups", children: [] }] }, "vi")[0].children.at(-1)?.href).toBe("/vi/products/hat-dua");
  });

  it("drops entries without a label in that language", () => {
    const c = structuredClone(content);
    c.menu[0].label = { vi: "", en: "", zh: "", ja: "", ko: "" };
    expect(resolveMenu(c, "vi")).toHaveLength(content.menu.length - 1);
  });
});

describe("older saved content", () => {
  it("gets the default menu, categories and theme, and fills half-saved menu entries", () => {
    const old = structuredClone(content) as unknown as Record<string, unknown>;
    delete old.menu;
    delete old.categories;
    delete old.theme;
    const n = normalize(old);
    expect(n.menu).toEqual(content.menu);
    expect(n.categories.map((c) => c.slug)).toEqual(["news", "health"]);
    expect(n.theme).toEqual(content.theme);
    expect(n.pages.home.style).toEqual(emptyPageStyle());

    const saved = { ...structuredClone(content), menu: [{ label: { vi: "Trang chủ" }, href: "/" }] };
    expect(normalize(saved).menu[0]).toMatchObject({ children: [], auto: "", wide: false, label: { vi: "Trang chủ", en: "" } });
  });

  it("shows the products page by group", () => {
    expect(content.pages.products.sections.map((s) => s.type)).toContain("productGroups");
  });
});

describe("news categories", () => {
  it("keep the old /news and /health addresses", () => {
    expect(content.categories.map((c) => c.slug)).toEqual(["news", "health"]);
    expect(postPath({ slug: "a", channel: "health" }, content.categories)).toBe("/health/a");
  });

  it("move posts of a deleted category to the first one", () => {
    const cats = [{ slug: "cong-thuc" }, { slug: "news" }];
    expect(channelOf({ channel: "health" }, cats)).toBe("cong-thuc");
    expect(channelOf({}, cats)).toBe("news");
    expect(withCategories([{ channel: "gone" }], cats)[0].channel).toBe("cong-thuc");
    // Without the list (older callers) a post keeps its own category.
    expect(postPath({ slug: "b", channel: "cong-thuc" })).toBe("/cong-thuc/b");
  });

  it("refuse slugs that clash with the site's own pages or each other", () => {
    expect(categoryProblem("cong-thuc", ["news"])).toBeNull();
    expect(categoryProblem("products", [])).toMatch(/trùng/);
    expect(categoryProblem("news", ["news"])).toMatch(/Đã có/);
    expect(categoryProblem("Công thức", [])).toMatch(/chữ thường/);
    for (const c of content.categories) expect(categoryProblem(c.slug, content.categories.filter((o) => o !== c).map((o) => o.slug)), c.slug).toBeNull();
  });
});

describe("fonts added in Studio", () => {
  it("take their name from a Google Fonts link when none is typed", () => {
    expect(customFontName({ name: "", link: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap" })).toBe("Be Vietnam Pro");
    expect(customFontKey({ name: "Lexend", link: "" })).toBe("custom:Lexend");
  });

  it("are usable as a page font", () => {
    const vars = pageStyleVars({ ...emptyPageStyle(), headingFont: "custom:Lexend" }) as Record<string, string>;
    expect(vars["--font-display"]).toBe('"Lexend", ui-sans-serif, system-ui, sans-serif');
    // Anything that could leave the CSS string is stripped from the name.
    expect((pageStyleVars({ ...emptyPageStyle(), font: 'custom:A";}body{x' }) as Record<string, string>).fontFamily).toBe('"Abodyx", ui-sans-serif, system-ui, sans-serif');
  });

  it("only link https stylesheets", () => {
    expect(stylesheetUrl("https://fonts.googleapis.com/css2?family=Lexend")).toBe("https://fonts.googleapis.com/css2?family=Lexend");
    expect(stylesheetUrl("http://example.com/a.css")).toBeNull();
    expect(stylesheetUrl("javascript:alert(1)")).toBeNull();
    expect(stylesheetUrl("https://example.com/font.woff2")).toBeNull();
  });

  it("write @font-face only for uploaded or https font files", () => {
    const css = fontFaceCss([
      {
        name: "Lexend",
        link: "https://cdn.example.com/lexend-bold.woff2",
        files: [
          { src: "/media/2026/10/ab12cd34-lexend.woff2", weight: "400", style: "normal" },
          { src: "/media/2026/10/x.ttf", weight: "bold", style: "italic" },
          { src: '/media/x.woff2") ;}body{color:red', weight: "400", style: "normal" },
          { src: "http://insecure.example.com/a.woff2", weight: "400", style: "normal" },
        ],
      },
    ]);
    expect(css.split("\n")).toEqual([
      '@font-face{font-family:"Lexend";src:url("/media/2026/10/ab12cd34-lexend.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}',
      '@font-face{font-family:"Lexend";src:url("/media/2026/10/x.ttf") format("truetype");font-weight:400;font-style:italic;font-display:swap}',
      '@font-face{font-family:"Lexend";src:url("https://cdn.example.com/lexend-bold.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}',
    ]);
    expect(css).not.toContain("<");
  });

  it("recognise font uploads by extension", () => {
    expect(fontFileType("Lexend-Bold.TTF")).toBe("font/ttf");
    expect(fontFileType("photo.jpg")).toBeNull();
  });

  it("show up in every font picker", () => {
    const choices = fontChoices([{ name: "", link: "https://fonts.googleapis.com/css2?family=Lexend", files: [] }, { name: "", link: "", files: [] }]);
    expect(choices.at(-1)).toEqual({ value: "custom:Lexend", label: "Lexend (tự thêm)" });
    expect(choices.filter((c) => c.value.startsWith("custom:"))).toHaveLength(1);
  });
});

describe("text outline and shadow", () => {
  it("merge field by field: section over page over theme", () => {
    const fx = mergeEffects(
      { heading: { stroke: "#000000", strokeWidth: 2, shadow: "#111111" } },
      { heading: { stroke: "#ffffff" }, text: { shadow: "#222222", shadowBlur: 10 } },
      { heading: { strokeWidth: 3 } },
    );
    expect(fx.heading).toMatchObject({ stroke: "#ffffff", strokeWidth: 3, shadow: "#111111" });
    expect(fx.text).toMatchObject({ shadow: "#222222", shadowBlur: 10, stroke: "" });
  });

  it("become CSS variables, also on dark sections, with safe values only", () => {
    const page = mergePageStyle({ ...emptyPageStyle(), effects: { heading: { stroke: "#000000", strokeWidth: 99, shadow: "#ff0000", shadowBlur: 0, shadowOffset: 0, shadowOpacity: 50 }, text: { stroke: "red", strokeWidth: 1, shadow: "", shadowBlur: 0, shadowOffset: 0, shadowOpacity: 0 } } }, undefined);
    const { style, attrs } = sectionStyleVars(undefined, page, "dark");
    expect(style).toMatchObject({
      "--fx-h-stroke": "6px #000000",
      "--fx-h-shadow": "0 2px 6px rgba(255, 0, 0, 0.5)",
      "--fx-h-drop": "drop-shadow(0 2px 3px rgba(255, 0, 0, 0.5))",
    });
    expect(attrs).toEqual({ "data-fx-h-stroke": "", "data-fx-h-shadow": "" });
    // A section can add its own effect on top.
    expect(sectionStyleVars({ effects: { text: { shadow: "#000000", shadowOffset: -3 } } }, page, "white").style).toMatchObject({ "--fx-t-shadow": "0 -3px 6px rgba(0, 0, 0, 0.6)" });
  });

  it("are filled in for pages saved before they existed", () => {
    const old = structuredClone(content) as unknown as { pages: Record<string, { style: Record<string, unknown> }> };
    delete old.pages.home.style.effects;
    expect(normalize(old).pages.home.style.effects.heading.stroke).toBe("");
    expect(mergePageStyle(undefined, { text: "#123456" } as never).effects.text.stroke).toBe("");
  });
});
