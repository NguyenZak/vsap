import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FloatingContact } from "@/components/FloatingContact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionMain } from "@/components/MotionMain";
import { PreviewBridge } from "@/components/cms/PreviewBridge";
import { pick } from "@/lib/cms/links";
import { getContent, isPreview } from "@/lib/cms/store";
import { alternates, localeParams, resolveLocale, metadataLocale } from "@/lib/i18n";
import "../globals.css";

const font = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;
export const generateStaticParams = localeParams;
// Content comes from the CMS on every request (see lib/cms/store.ts).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const { settings } = await getContent();
  const title = pick(settings.seo.title, locale);
  const description = pick(settings.seo.description, locale);
  return {
    metadataBase: new URL(settings.url),
    title: { default: title, template: `%s | ${settings.name}` },
    description,
    alternates: alternates(locale),
    openGraph: {
      type: "website",
      siteName: settings.name,
      title,
      description,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      images: settings.seo.image ? [{ url: settings.seo.image }] : undefined,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const locale = resolveLocale((await params).locale);
  const [content, preview] = await Promise.all([getContent(), isPreview()]);
  const { settings: site } = content;
  const ui = content.ui[locale];

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/logo.svg`,
    slogan: site.tagline,
    email: site.email,
    telephone: site.phoneE164,
    address: site.offices.map((o) => ({
      "@type": "PostalAddress",
      streetAddress: o.street,
      addressLocality: o.locality,
      addressRegion: o.region,
      addressCountry: "VN",
    })),
  };

  return (
    // suppressHydrationWarning: the inline script below adds the `js` class before React hydrates.
    <html lang={locale} className={font.variable} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide intro elements before first paint, only when JS will animate them in. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header locale={locale} nav={ui.nav} contact={site} logoAlt={`${site.name} – ${site.tagline}`} />
        <MotionMain>{children}</MotionMain>
        <Footer locale={locale} content={content} ui={ui} />
        {!preview && <FloatingContact t={ui.chat} links={site} />}
        {preview && <PreviewBridge />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
