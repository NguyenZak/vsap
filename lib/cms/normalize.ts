// Pure helpers for stored CMS documents (no Cloudflare imports, so they are unit-testable).
import { emptyL } from "../locales";
import { defaultContent } from "./defaults";
import type { CustomFont, L, MenuItem, MenuLink, PostCategory, RetailPack, SiteContent } from "./types";

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Fill keys missing from `value` with `base`, recursively for plain objects. */
export function withDefaults<T>(value: unknown, base: T): T {
  if (!isObject(value) || !isObject(base)) return (value === undefined ? base : value) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(value)) out[k] = k in base ? withDefaults(v, (base as Record<string, unknown>)[k]) : v;
  return out as T;
}

/**
 * Stored content merged over the defaults: fields added to the site later get
 * their default value instead of breaking older saved documents. Arrays (lists
 * of sections, products…) are taken as stored.
 */
export function normalize(raw: unknown): SiteContent {
  const defaults = defaultContent();
  const content = withDefaults(raw, defaults);
  return {
    ...content,
    settings: { ...content.settings, url: siteUrl(content.settings.url, defaults.settings.url) },
    // UI strings are a fixed set of keys defined in code: drop ones the site no longer reads
    // so Studio doesn't offer fields that change nothing.
    ui: pruneTo(content.ui, defaults.ui),
    retailPacks: content.retailPacks.map(normalizePack),
    theme: { ...content.theme, fonts: (Array.isArray(content.theme.fonts) ? content.theme.fonts : []).filter(isObject).map(normalizeFont) },
    menu: content.menu.filter(isObject).map(normalizeMenuItem),
    categories: content.categories.filter(isObject).map(normalizeCategory),
  };
}

const text = (v: unknown): L => ({ ...emptyL(), ...(isObject(v) ? v : {}) }) as L;
const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Menu entries are list items, so withDefaults leaves them as stored: fill what an older or hand-edited entry lacks. */
function normalizeMenuItem(raw: Partial<MenuItem>): MenuItem {
  const link = (v: Partial<MenuLink>): MenuLink => ({ label: text(v.label), href: str(v.href) });
  return {
    ...link(raw),
    children: Array.isArray(raw.children) ? raw.children.filter(isObject).map(link) : [],
    auto: raw.auto === "productGroups" || raw.auto === "newsCategories" ? raw.auto : "",
    wide: raw.wide === true,
  };
}

function normalizeFont(raw: Partial<CustomFont>): CustomFont {
  return {
    name: str(raw.name),
    link: str(raw.link),
    files: (Array.isArray(raw.files) ? raw.files : []).filter(isObject).map((f) => ({ src: str(f.src), weight: str(f.weight) || "400", style: f.style === "italic" ? "italic" : "normal" })),
  };
}

function normalizeCategory(raw: Partial<PostCategory>): PostCategory {
  const image: Record<string, unknown> = isObject(raw.image) ? raw.image : {};
  const seo: Record<string, unknown> = isObject(raw.seo) ? raw.seo : {};
  return {
    slug: str(raw.slug),
    name: text(raw.name),
    intro: text(raw.intro),
    image: { src: str(image.src), alt: text(image.alt) },
    seo: { title: text(seo.title), description: text(seo.description) },
  };
}

/** `value` cut down to the keys of `base`, recursively for plain objects. */
export function pruneTo<T>(value: T, base: T): T {
  if (!isObject(value) || !isObject(base)) return value;
  return Object.fromEntries(Object.keys(base).map((k) => [k, pruneTo(value[k], base[k])])) as T;
}

/**
 * The site's origin as typed in Studio ("vsap.com.vn", "https://vsap.com.vn/")
 * → "https://vsap.com.vn". Every page builds URLs with `new URL(settings.url)`,
 * so anything unusable falls back rather than taking the whole site down.
 */
export function siteUrl(value: unknown, fallback: string): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return fallback;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
    // "mailto:a@b.co" would otherwise read as https://b.co with a user name.
    const ok = (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
    return ok ? url.origin : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Retail packs are list items, so withDefaults leaves them as stored. Packs saved
 * before they had a single price carried `weights` ("250 g, 500 g") or `variants`
 * ([{ weight, price }]); keep the first size's price and drop the sizes.
 */
export function normalizePack(raw: RetailPack): RetailPack {
  const legacy = raw as RetailPack & { weights?: unknown; variants?: unknown };
  const { weights: _weights, variants, ...pack } = legacy;
  const first = Array.isArray(variants) ? variants.find(isObject) : undefined;
  const price = validPrice(pack.price) ? pack.price : first && validPrice(first.price) ? first.price : undefined;
  return {
    ...pack,
    price: price ?? null,
    oldPrice: validPrice(pack.oldPrice) ? pack.oldPrice : null,
    soldOut: pack.soldOut === true,
    hidden: pack.hidden === true,
    description: { ...emptyL(), ...(isObject(pack.description) ? pack.description : {}) } as RetailPack["description"],
  };
}

const validPrice = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

