import { locales, pickText, type Locale } from "../locales";

const LOCALE_PREFIX = new RegExp(`^/(${locales.join("|")})(/|$|\\?|#)`);
import type { L } from "./types";

/**
 * Editors write site links without the language prefix ("/products", "/contact").
 * Prefix them with the current locale; leave external, anchor, mailto/tel and
 * asset links alone.
 */
export function localHref(href: string | undefined, locale: Locale): string {
  const h = (href ?? "").trim();
  if (!h) return "";
  if (!h.startsWith("/") || h.startsWith("//")) return h;
  if (LOCALE_PREFIX.test(h) || /^\/(media|images|fonts)\//.test(h)) return h;
  return `/${locale}${h === "/" ? "" : h}`;
}

/** Pick the current language from a localized value, tolerating missing data (see pickText). */
export function pick(value: Partial<L> | string | undefined | null, locale: Locale): string {
  if (typeof value === "string") return value;
  return pickText(value, locale);
}
