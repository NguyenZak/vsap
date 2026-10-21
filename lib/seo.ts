// Metadata and structured data shared by every page. Next.js replaces (not merges)
// nested objects like openGraph between layout and page, so pages build the full
// set here instead of relying on the layout's defaults.
import type { Metadata } from "next";
import { pick } from "./cms/links";
import type { Page, SiteContent } from "./cms/types";
import { defaultLocale, locales, type Locale } from "./locales";

const ogLocale: Record<Locale, string> = { vi: "vi_VN", en: "en_US" };

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
};

export function seoMetadata({ content, locale, path, title, description, image, imageAlt, noindex, absoluteTitle, type = "website" }: SeoInput): Metadata {
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
        ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
        "x-default": `/${defaultLocale}${path}`,
      },
    },
    openGraph: {
      type,
      siteName: settings.name,
      title: fullTitle,
      description,
      url: `/${locale}${path}`,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title: fullTitle, description, images: images?.map((i) => i.url) },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/** First photo of a page (hero slide or page banner), used as its share image. */
export function pageImage(page: Page): { src: string; alt: string } | undefined {
  for (const s of page.sections) {
    if (s.hidden) continue;
    const p = s.props as Record<string, unknown>;
    const fromSlides = Array.isArray(p.slides) ? (p.slides[0] as { image?: { src?: string; alt?: { vi?: string } } })?.image : undefined;
    const img = (fromSlides ?? p.image) as { src?: string; alt?: { vi?: string } } | undefined;
    if (img?.src) return { src: img.src, alt: img.alt?.vi ?? "" };
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
