// Site languages. Kept free of framework imports so any module (and tests) can use it.
export const locales = ["vi", "en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
