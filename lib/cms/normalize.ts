// Pure helpers for stored CMS documents (no Cloudflare imports, so they are unit-testable).
import { defaultContent } from "./defaults";
import type { SiteContent } from "./types";

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
  return withDefaults(raw, defaultContent());
}

