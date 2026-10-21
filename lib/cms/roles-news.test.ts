import { describe, expect, it } from "vitest";
import { faqFromMarkdown, parseMarkdown, parseInline, plainText, readingMinutes, safeHref } from "../markdown";
import { newPost } from "./collections";
import { defaultContent } from "./defaults";
import { inquiriesCsv, type Inquiry } from "./inquiry-format";
import { generatePassword, hashPassword, verifyPassword } from "./password";
import { formatDate, inLocale, isScheduled, postProblem, slugify, todayVN } from "./post-format";
import { can, permissionsOf, roles, USERNAME_RE } from "./roles";

describe("roles", () => {
  it("only admins manage accounts and read the audit log", () => {
    for (const r of roles) {
      expect(can(r, "users")).toBe(r === "admin");
      expect(can(r, "audit")).toBe(r === "admin");
    }
  });

  it("editors write drafts but cannot publish", () => {
    expect(can("editor", "content.write")).toBe(true);
    expect(can("editor", "content.publish")).toBe(false);
    expect(can("editor", "media.delete")).toBe(false);
    expect(can("editor", "inquiries")).toBe(false);
  });

  it("sales only sees quote requests", () => {
    expect(permissionsOf("sales")).toEqual(["inquiries"]);
  });

  it("publishing implies being able to write", () => {
    for (const r of roles) if (can(r, "content.publish")) expect(can(r, "content.write")).toBe(true);
  });

  it("rejects unknown roles and odd usernames", () => {
    expect(can(undefined, "content.read")).toBe(false);
    expect(can("root" as never, "content.read")).toBe(false);
    expect(USERNAME_RE.test("nguyen.van-a")).toBe(true);
    expect(USERNAME_RE.test("Nguyen")).toBe(false);
    expect(USERNAME_RE.test("ab")).toBe(false);
    expect(USERNAME_RE.test("a b c")).toBe(false);
  });
});

describe("passwords", () => {
  it("hashes with a random salt and verifies", async () => {
    const a = await hashPassword("correct horse battery");
    const b = await hashPassword("correct horse battery");
    expect(a).not.toBe(b);
    expect(a.startsWith("pbkdf2$100000$")).toBe(true);
    expect(await verifyPassword("correct horse battery", a)).toBe(true);
    expect(await verifyPassword("correct horse batterY", a)).toBe(false);
  });

  it("refuses malformed or over-expensive hashes", async () => {
    expect(await verifyPassword("x", "plain")).toBe(false);
    expect(await verifyPassword("x", "pbkdf2$99999999$AAAA$AAAA")).toBe(false);
  });

  it("generates readable random passwords", () => {
    const p = generatePassword(20);
    expect(p).toHaveLength(20);
    expect(p).not.toMatch(/[0O1l]/);
    expect(generatePassword()).not.toBe(generatePassword());
  });
});

describe("markdown", () => {
  it("parses headings, lists, quotes, images and rules", () => {
    const blocks = parseMarkdown("# Title\n\nPara one\nline two\n\n- a\n- b\n\n1. x\n\n> quoted\n\n![Alt](/media/x.webp \"Cap\")\n\n---");
    expect(blocks.map((b) => b.t)).toEqual(["h", "p", "ul", "ol", "quote", "img", "hr"]);
    expect(blocks[0]).toMatchObject({ t: "h", level: 2 });
    expect(blocks[1]).toMatchObject({ t: "p", c: [{ t: "text", v: "Para one" }, { t: "br" }, { t: "text", v: "line two" }] });
    expect(blocks[5]).toEqual({ t: "img", src: "/media/x.webp", alt: "Alt", caption: "Cap" });
  });

  it("parses inline marks and nested links", () => {
    expect(parseInline("a **b** *c* `d` [**e**](/contact)")).toEqual([
      { t: "text", v: "a " },
      { t: "strong", c: [{ t: "text", v: "b" }] },
      { t: "text", v: " " },
      { t: "em", c: [{ t: "text", v: "c" }] },
      { t: "text", v: " " },
      { t: "code", v: "d" },
      { t: "text", v: " " },
      { t: "link", href: "/contact", c: [{ t: "strong", c: [{ t: "text", v: "e" }] }] },
    ]);
  });

  it("drops unsafe links and images", () => {
    expect(safeHref("javascript:alert(1)")).toBeNull();
    expect(safeHref("//evil.example")).toBeNull();
    expect(safeHref("https://vsap.com.vn")).toBe("https://vsap.com.vn");
    expect(parseInline("[x](javascript:alert(1))")).toEqual([{ t: "text", v: "x" }, { t: "text", v: ")" }]);
    expect(parseMarkdown("![x](javascript:alert)")).toEqual([]);
    expect(JSON.stringify(parseMarkdown("![x](javascript:alert(1))"))).not.toMatch(/"t":"(img|link)"/);
    expect(parseMarkdown("<script>alert(1)</script>")).toEqual([{ t: "p", c: [{ t: "text", v: "<script>alert(1)</script>" }] }]);
  });

  it("gives plain text and reading time", () => {
    expect(plainText("## Hi\n\n**Bold** and [link](/x)\n\n- item")).toBe("Hi Bold and link item");
    expect(readingMinutes("word ".repeat(660))).toBe(3);
    expect(readingMinutes("")).toBe(1);
  });
});

describe("posts", () => {
  it("validates slugs and titles", () => {
    const p = { ...newPost("2026-01-01"), slug: "mua-dieu-2026" };
    expect(postProblem(p)).toBeNull();
    expect(postProblem({ ...p, slug: "Mua Dieu" })).toMatch(/Slug/);
    expect(postProblem({ ...p, title: { vi: "", en: "" } })).toMatch(/tiêu đề/);
  });

  it("slugifies Vietnamese titles", () => {
    expect(slugify("Mùa điều Bình Phước 2026: được giá!")).toBe("mua-dieu-binh-phuoc-2026-duoc-gia");
  });

  it("shows a post only in languages it has a title in", () => {
    const p = newPost("2026-01-01");
    expect(inLocale(p, "vi")).toBe(true);
    expect(inLocale(p, "en")).toBe(false);
  });

  it("schedules by Vietnam date", () => {
    // 2026-03-01 18:00 UTC is already 2 March in Vietnam.
    const now = Date.UTC(2026, 2, 1, 18);
    expect(todayVN(now)).toBe("2026-03-02");
    expect(isScheduled({ date: "2026-03-02" }, now)).toBe(false);
    expect(isScheduled({ date: "2026-03-03" }, now)).toBe(true);
  });

  it("formats dates per language", () => {
    expect(formatDate("2026-10-22", "en")).toBe("22 October 2026");
    expect(formatDate("2026-10-22", "vi")).toMatch(/22.*10.*2026/);
  });

  it("ships a News page and a news strip on the home page", () => {
    const c = defaultContent();
    expect(c.pages.news.path).toBe("/news");
    expect(c.pages.news.sections.some((s) => s.type === "posts")).toBe(true);
    expect(c.pages.home.sections.some((s) => s.type === "posts")).toBe(true);
    expect(c.ui.vi.nav.news).toBe("Tin tức");
    expect(c.ui.en.news.readMore).toBe("Read more");
  });
});

describe("inquiry CSV", () => {
  const base: Inquiry = {
    id: 7,
    created_at: Date.UTC(2026, 9, 22),
    status: "new",
    data: { name: "Lê, An", email: "an@example.com", message: 'Cần 2 container "W240"\nGiao tháng 12', product: "cashew" },
    locale: "vi",
    source: "/vi/contact",
    country: "VN",
    note: null,
    updated_at: null,
    updated_by: null,
  };

  it("quotes commas, quotes and newlines, with a BOM for Excel", () => {
    const csv = inquiriesCsv([base]);
    expect(csv.startsWith("﻿Mã,")).toBe(true);
    expect(csv).toContain('"Lê, An"');
    expect(csv).toContain('"Cần 2 container ""W240""\nGiao tháng 12"');
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("defuses spreadsheet formulas", () => {
    const csv = inquiriesCsv([{ ...base, data: { ...base.data, name: "=HYPERLINK(\"x\")" } }]);
    expect(csv).toContain(`"'=HYPERLINK(""x"")"`);
  });
});

describe("sample posts", async () => {
  const { existsSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { samplePosts } = await import("../content/posts");
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const slugs = new Set(samplePosts.map((p) => p.slug));
  const sitePaths = new Set(["/", "/products", "/products/cashew", "/products/macadamia", "/quality", "/about", "/contact", "/news"]);

  it("are ten valid, unique, bilingual posts", () => {
    expect(samplePosts).toHaveLength(10);
    expect(slugs.size).toBe(10);
    for (const p of samplePosts) {
      expect(postProblem(p), p.slug).toBeNull();
      expect(inLocale(p, "vi") && inLocale(p, "en"), p.slug).toBe(true);
      expect(isScheduled(p, Date.UTC(2026, 9, 22)), p.slug).toBe(false);
    }
  });

  it("keep SEO titles and descriptions within search-result lengths", () => {
    for (const p of samplePosts)
      for (const l of ["vi", "en"] as const) {
        const t = [...p.seo.title[l]].length;
        const d = [...p.seo.description[l]].length;
        expect(t, `${p.slug} ${l} title ${t}`).toBeGreaterThanOrEqual(30);
        expect(t, `${p.slug} ${l} title ${t}`).toBeLessThanOrEqual(60);
        expect(d, `${p.slug} ${l} description ${d}`).toBeGreaterThanOrEqual(70);
        expect(d, `${p.slug} ${l} description ${d}`).toBeLessThanOrEqual(160);
      }
  });

  it("each answer three or more FAQ questions in both languages", () => {
    for (const p of samplePosts) for (const l of ["vi", "en"] as const) expect(faqFromMarkdown(p.body[l]).length, `${p.slug} ${l}`).toBeGreaterThanOrEqual(3);
  });

  it("only link to pages and images that exist", () => {
    const links: string[] = [];
    const images: string[] = samplePosts.map((p) => p.cover.src);
    const walk = (nodes: unknown) => {
      for (const n of nodes as { t: string; href?: string; c?: unknown; items?: unknown[]; src?: string }[]) {
        if (n.t === "link" && n.href) links.push(n.href);
        if (n.t === "img" && n.src) images.push(n.src);
        if (n.c) walk(n.c);
        if (n.items) n.items.forEach(walk);
      }
    };
    for (const p of samplePosts) for (const l of ["vi", "en"] as const) walk(parseMarkdown(p.body[l]));
    for (const href of links.filter((h) => h.startsWith("/"))) {
      const ok = sitePaths.has(href) || (href.startsWith("/news/") && slugs.has(href.slice(6)));
      expect(ok, href).toBe(true);
    }
    for (const src of images) expect(existsSync(`${root}public${src}`), src).toBe(true);
  });
});

describe("faqFromMarkdown", () => {
  it("reads ### questions under the FAQ heading only", () => {
    const md = "## Intro\n\n### Not a question\n\ntext\n\n## Câu hỏi thường gặp\n\n### Một?\n\nTrả lời **một**.\n\n### Hai?\n\nHai.\n\n## Nguồn\n\n### Ignored?\n\nx";
    expect(faqFromMarkdown(md)).toEqual([
      { q: "Một?", a: "Trả lời một." },
      { q: "Hai?", a: "Hai." },
    ]);
  });
});

describe("telegram alert", async () => {
  const { inquiryAlert } = await import("./telegram-format");
  const base = { id: 12, data: { name: "Anna <Müller>", company: "Nuss & Co", email: "anna@example.com", phone: "+49 30 1234567", country: "Germany", product: "cashew", quantity: "1 FCL", message: "Need <b>W240</b>" }, locale: "en", source: "/en/contact", country: "DE" };

  it("escapes customer text for Telegram HTML", () => {
    const { text } = inquiryAlert(base, "https://vsap.com.vn");
    expect(text).toContain("<b>Anna &lt;Müller&gt;</b> · Nuss &amp; Co");
    expect(text).toContain("<i>Need &lt;b&gt;W240&lt;/b&gt;</i>");
    expect(text).toContain("📦 Hạt điều · 1 FCL");
    expect(text).toContain("🌍 Germany · IP: DE");
    expect(text).not.toMatch(/\n\n\n/);
  });

  it("links to the request in Studio and to WhatsApp", () => {
    const { buttons } = inquiryAlert(base, "https://vsap.com.vn");
    expect(buttons[0][0].url).toBe("https://vsap.com.vn/admin?view=inbox&id=12");
    expect(buttons[1]).toEqual([{ text: "WhatsApp", url: "https://wa.me/49301234567" }]);
  });

  it("adds Zalo for Vietnamese numbers and skips empty fields", () => {
    const { text, buttons } = inquiryAlert({ id: 3, data: { name: "Bình", email: "b@example.com", phone: "0901 234 567", message: "Báo giá" } }, "https://x.test");
    expect(buttons[1]).toEqual([
      { text: "WhatsApp", url: "https://wa.me/84901234567" },
      { text: "Zalo", url: "https://zalo.me/0901234567" },
    ]);
    expect(text).not.toContain("🌍");
    expect(text).not.toContain("📦");
  });

  it("truncates very long messages", () => {
    const { text } = inquiryAlert({ ...base, data: { ...base.data, message: "x".repeat(2000) } }, "https://x.test");
    expect(text.length).toBeLessThan(1400);
    expect(text).toContain("…");
  });
});
