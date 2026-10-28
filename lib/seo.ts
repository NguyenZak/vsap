// Metadata and structured data shared by every page. Next.js replaces (not merges)
// nested objects like openGraph between layout and page, so pages build the full
// set here instead of relying on the layout's defaults.
import type { Metadata } from "next";
import { pick } from "./cms/links";
import type { CmsImage, Page, SiteContent } from "./cms/types";
import { defaultLocale, localeInfo, locales, type Locale } from "./locales";

export const ogLocale = Object.fromEntries(locales.map((l) => [l, localeInfo[l].og])) as Record<Locale, string>;

type SeoInput = {
  content: SiteContent;
  locale: Locale;
  /** Path without the locale prefix, e.g. "/products/cashew" ("" for home). */
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  /** Use the title as-is instead of the "%s | VSAP" template. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  /** Languages this page exists in (default: all); drives hreflang. */
  available?: Locale[];
  /** For articles: YYYY-MM-DD publication date. */
  publishedTime?: string;
};

export function seoMetadata({ content, locale, path, title, description, image, imageAlt, noindex, absoluteTitle, type = "website", available = [...locales], publishedTime }: SeoInput): Metadata {
  const { settings } = content;
  const shareImage = image || settings.seo.image;
  const fullTitle = absoluteTitle || !title ? title || pick(settings.seo.title, locale) : `${title} | ${settings.name}`;
  const images = shareImage ? [{ url: shareImage, alt: imageAlt || fullTitle }] : undefined;
  return {
    title: absoluteTitle || !title ? { absolute: fullTitle } : title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ...Object.fromEntries(available.map((l) => [l, `/${l}${path}`])),
        "x-default": `/${available.includes(defaultLocale) ? defaultLocale : available[0] ?? locale}${path}`,
      },
    },
    openGraph: {
      type,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      siteName: settings.name,
      title: fullTitle,
      description,
      url: `/${locale}${path}`,
      locale: ogLocale[locale],
      alternateLocale: available.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title: fullTitle, description, images: images?.map((i) => i.url) },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/** First photo of a page (hero slide or page banner), used as its share image. */
export function pageImage(page: Page, locale: Locale = defaultLocale): { src: string; alt: string } | undefined {
  for (const s of page.sections) {
    if (s.hidden) continue;
    const p = s.props as Record<string, unknown>;
    const fromSlides = Array.isArray(p.slides) ? (p.slides[0] as { image?: CmsImage })?.image : undefined;
    const img = (fromSlides ?? p.image) as Partial<CmsImage> | undefined;
    if (img?.src) return { src: img.src, alt: pick(img.alt, locale) };
  }
  return undefined;
}

const abs = (base: string, path: string) => new URL(path, base).toString();

/** Organization + WebSite graph, emitted once per page from the layout. */
export function siteJsonLd(content: SiteContent, locale: Locale) {
  const s = content.settings;
  const org = `${s.url}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: s.name,
        legalName: s.legalName,
        ...(s.legalNameEn ? { alternateName: s.legalNameEn } : {}),
        ...(s.taxId ? { taxID: s.taxId } : {}),
        ...(s.registeredAt ? { foundingDate: s.registeredAt } : {}),
        url: s.url,
        logo: { "@type": "ImageObject", url: abs(s.url, "/logo.svg") },
        slogan: s.tagline,
        description: pick(s.about, locale),
        email: s.email,
        telephone: s.phoneE164,
        address: s.offices.map((o) => ({
          "@type": "PostalAddress",
          name: pick(o.label, locale),
          streetAddress: o.street,
          addressLocality: o.locality,
          addressRegion: o.region,
          addressCountry: "VN",
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: s.phoneE164,
            email: s.email,
            availableLanguage: ["Vietnamese", "English"],
          },
        ],
        sameAs: s.social.map((x) => x.url).filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${s.url}/#website`,
        url: s.url,
        name: s.name,
        inLanguage: locales,
        publisher: { "@id": org },
      },
    ],
  };
}

export function breadcrumbJsonLd(content: SiteContent, locale: Locale, trail: { name: string; path: string }[]) {
  const base = content.settings.url;
  const home = { name: content.ui[locale].nav.home, path: "" };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [home, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${base}/${locale}${t.path}`,
    })),
  };
}

export function articleJsonLd(
  content: SiteContent,
  locale: Locale,
  a: { path: string; headline: string; description: string; image?: string; date: string; author: string; section?: string },
) {
  const base = content.settings.url;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.headline.slice(0, 110),
    description: a.description,
    image: a.image ? [abs(base, a.image)] : undefined,
    datePublished: a.date,
    inLanguage: locale,
    articleSection: a.section || undefined,
    author: a.author && a.author !== content.settings.name ? { "@type": "Person", name: a.author } : { "@id": `${base}/#organization` },
    publisher: { "@id": `${base}/#organization` },
    mainEntityOfPage: `${base}/${locale}${a.path}`,
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Renders one or more JSON-LD objects. `<` is escaped so content can't close the script tag. */
export function jsonLdHtml(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
