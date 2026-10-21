import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getIn, setIn, type FieldDef } from "./fields";
import { iconNames } from "./icons";
import { localHref, pick } from "./links";
import { defaultContent } from "./defaults";
import { normalize, withDefaults } from "./normalize";
import { sectionDefs } from "./registry";
import { newProduct, newRetailPack, productFields, retailFields, settingsFields } from "./collections";

const root = fileURLToPath(new URL("../../", import.meta.url));
const content = defaultContent();

/** Every string value that looks like a site asset path. */
function assetPaths(value: unknown, out = new Set<string>()) {
  if (typeof value === "string" && /^\/(images|logo)[^\s]*\.(webp|png|svg|jpe?g)$/.test(value)) out.add(value);
  else if (value && typeof value === "object") Object.values(value).forEach((v) => assetPaths(v, out));
  return out;
}

/** Keys a form would write: catches registry fields that create() forgot to initialise. */
function missingKeys(fields: FieldDef[], value: Record<string, unknown>, prefix = ""): string[] {
  return fields.flatMap((f) => {
    const v = value?.[f.key];
    if (v === undefined) return [`${prefix}${f.key}`];
    if (f.type === "group") return missingKeys(f.fields, v as Record<string, unknown>, `${prefix}${f.key}.`);
    if (f.type === "list") return missingKeys(f.fields, f.newItem(), `${prefix}${f.key}[new].`);
    return [];
  });
}

describe("default content", () => {
  it("only uses registered section types, with unique ids", () => {
    const types = new Set(sectionDefs.map((d) => d.type));
    const ids = new Set<string>();
    for (const page of Object.values(content.pages)) {
      for (const s of page.sections) {
        expect(types, `unknown section type ${s.type}`).toContain(s.type);
        expect(ids.has(s.id), `duplicate section id ${s.id}`).toBe(false);
        ids.add(s.id);
      }
    }
  });

  it("points only at images that exist in public/", () => {
    const paths = [...assetPaths(content)];
    expect(paths.length).toBeGreaterThan(20);
    expect(paths.filter((p) => !existsSync(`${root}public${p}`))).toEqual([]);
  });

  it("links every retail pack to a product", () => {
    const slugs = new Set(content.products.map((p) => p.slug));
    for (const r of content.retailPacks) expect(slugs, r.id).toContain(r.product);
  });

  it("has the same interface strings in both languages", () => {
    const keys = (o: unknown, p = ""): string[] =>
      o && typeof o === "object" ? Object.entries(o).flatMap(([k, v]) => keys(v, `${p}${k}.`)) : [p];
    expect(keys(content.ui.en).sort()).toEqual(keys(content.ui.vi).sort());
  });

  it("uses only known icons", () => {
    const used = JSON.stringify(content).match(/"icon":"([^"]+)"/g) ?? [];
    for (const m of used) expect(iconNames).toContain(m.slice(8, -1));
  });

  it("fills every field the edit forms expect", () => {
    expect(missingKeys(settingsFields, content.settings as unknown as Record<string, unknown>)).toEqual([]);
    for (const p of content.products) expect(missingKeys(productFields, p as unknown as Record<string, unknown>), p.slug).toEqual([]);
    for (const r of content.retailPacks) expect(missingKeys(retailFields, r as unknown as Record<string, unknown>), r.id).toEqual([]);
  });
});

describe("section registry", () => {
  it("has a renderer for every section type", () => {
    const blocks = readFileSync(`${root}components/blocks.tsx`, "utf8");
    for (const d of sectionDefs) expect(blocks, d.type).toMatch(new RegExp(`\\n  ${d.type}\\(p`));
  });

  it("creates new sections with every field initialised", () => {
    for (const d of sectionDefs) expect(missingKeys(d.fields, d.create()), d.type).toEqual([]);
  });

  it("creates new collection items with every field initialised", () => {
    expect(missingKeys(productFields, newProduct())).toEqual([]);
    expect(missingKeys(retailFields, newRetailPack())).toEqual([]);
  });
});

describe("normalize", () => {
  it("fills fields that older saved documents lack", () => {
    const old = structuredClone(content) as unknown as Record<string, unknown>;
    delete (old.ui as Record<string, Record<string, unknown>>).vi.chat;
    delete (old.settings as Record<string, unknown>).zalo;
    const n = normalize(old);
    expect(n.ui.vi.chat).toEqual(content.ui.vi.chat);
    expect(n.settings.zalo).toBe(content.settings.zalo);
  });

  it("keeps stored arrays as they are", () => {
    const saved = { ...structuredClone(content), partners: [{ name: "Only one", logo: "", url: "" }] };
    expect(normalize(saved).partners).toHaveLength(1);
  });

  it("does not let defaults override saved values", () => {
    expect(withDefaults({ a: { b: 2 } }, { a: { b: 1, c: 3 } })).toEqual({ a: { b: 2, c: 3 } });
  });
});

describe("field paths", () => {
  it("sets nested values without mutating the original", () => {
    const before = { a: [{ b: 1 }, { b: 2 }] };
    const after = setIn(before, ["a", 1, "b"], 9);
    expect(after.a[1].b).toBe(9);
    expect(before.a[1].b).toBe(2);
    expect(after.a[0]).toBe(before.a[0]);
    expect(getIn(after, ["a", 1, "b"])).toBe(9);
    expect(getIn(after, ["x", "y"])).toBeUndefined();
  });
});

describe("links", () => {
  it("prefixes site paths with the locale and leaves the rest alone", () => {
    expect(localHref("/contact", "en")).toBe("/en/contact");
    expect(localHref("/", "vi")).toBe("/vi");
    expect(localHref("/vi/about", "en")).toBe("/vi/about");
    expect(localHref("/media/2026/x.png", "vi")).toBe("/media/2026/x.png");
    expect(localHref("https://zalo.me/1", "vi")).toBe("https://zalo.me/1");
    expect(localHref("#inquiry", "vi")).toBe("#inquiry");
    expect(localHref("", "vi")).toBe("");
  });

  it("picks the right language and tolerates bad data", () => {
    expect(pick({ vi: "Xin chào", en: "Hello" }, "en")).toBe("Hello");
    expect(pick(undefined, "vi")).toBe("");
    expect(pick("plain", "en")).toBe("plain");
  });
});
