// Site languages. Kept free of framework imports so any module (and tests) can use it.
export const locales = ["vi", "en", "zh", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Per-language details: `name` and `choose` are written in the language itself
 * (language menu), `vn` is the Vietnamese name used in Studio and Telegram alerts.
 */
export const localeInfo: Record<Locale, { name: string; choose: string; vn: string; html: string; intl: string; og: string }> = {
  vi: { name: "Tiếng Việt", choose: "Chọn ngôn ngữ", vn: "Tiếng Việt", html: "vi", intl: "vi-VN", og: "vi_VN" },
  en: { name: "English", choose: "Choose language", vn: "Tiếng Anh", html: "en", intl: "en-US", og: "en_US" },
  zh: { name: "简体中文", choose: "选择语言", vn: "Tiếng Trung", html: "zh-CN", intl: "zh-CN", og: "zh_CN" },
  ja: { name: "日本語", choose: "言語を選択", vn: "Tiếng Nhật", html: "ja", intl: "ja-JP", og: "ja_JP" },
  ko: { name: "한국어", choose: "언어 선택", vn: "Tiếng Hàn", html: "ko", intl: "ko-KR", og: "ko_KR" },
};

/** An empty text in every language. */
export const emptyL = () => Object.fromEntries(locales.map((l) => [l, ""])) as Record<Locale, string>;

/**
 * Which stored text to show: Vietnamese and English are always written; the
 * languages added later fall back to English (read more widely than
 * Vietnamese abroad), then Vietnamese, while untranslated.
 */
export function pickText(value: Partial<Record<Locale, string>> | undefined | null, locale: Locale): string {
  if (!value) return "";
  if (locale === "vi" || locale === "en") return value[locale] ?? value.vi ?? "";
  return value[locale] || value.en || value.vi || "";
}

/** Cookie set by the language menu: an explicit choice wins over the device language. */
export const LOCALE_COOKIE = "vsap-locale";

/**
 * Site language for a visitor: their saved choice, else the first language in the
 * device's Accept-Language list (by q-value) that the site has — "ja-JP" or
 * "zh-TW" match ja / zh. No header at all (most crawlers) → Vietnamese; a list
 * with none of ours → English.
 */
export function preferredLocale(acceptLanguage: string | null | undefined, saved?: string | null): Locale {
  if (saved && isLocale(saved)) return saved;
  const header = (acceptLanguage ?? "").trim();
  if (!header || header === "*") return defaultLocale;
  const ranked = header
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(";");
      const q = Number(params.find((p) => p.trim().startsWith("q="))?.trim().slice(2) ?? 1);
      return { lang: tag.trim().toLowerCase().split("-")[0], q: Number.isFinite(q) ? q : 0, i };
    })
    .filter((x) => x.lang && x.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i);
  return ranked.find((x) => isLocale(x.lang))?.lang as Locale | undefined ?? "en";
}
