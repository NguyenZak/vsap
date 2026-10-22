// Pure helpers for stored CMS documents (no Cloudflare imports, so they are unit-testable).
import { emptyL } from "../locales";
import { defaultContent } from "./defaults";
import type { RetailPack, SiteContent } from "./types";

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
  const content = withDefaults(raw, defaultContent());
  return { ...content, retailPacks: content.retailPacks.map(normalizePack) };
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

