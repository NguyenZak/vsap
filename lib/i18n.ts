import { notFound } from "next/navigation";

export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

/** Shape of the seed content in lib/content (used to build the CMS defaults). */
export type Dictionary = typeof import("./content/vi").vi;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Resolve the `[locale]` route param, 404-ing on anything unsupported. */
export function resolveLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

/**
 * Locale for `generateMetadata`. Never throws: vinext's prerender doesn't catch
 * `notFound()` raised from metadata, so the page/layout body does the 404 instead.
 */
export function metadataLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}


export function localeParams() {
  return locales.map((locale) => ({ locale }));
}

/** hreflang alternates for the Metadata API. `path` excludes the locale prefix. */
export function alternates(locale: Locale, path = "") {
  return {
    canonical: `/${locale}${path}`,
    languages: Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
  };
}
