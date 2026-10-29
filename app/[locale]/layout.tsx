import type { Metadata, Viewport } from "next";
import { Inter, Phudu } from "next/font/google";
import { FloatingContact } from "@/components/FloatingContact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionMain } from "@/components/MotionMain";
import { SiteContactProvider } from "@/components/SiteContact";
import { PreviewBridge } from "@/components/cms/PreviewBridge";
import { CartProvider } from "@/components/shop/CartProvider";
import { pick } from "@/lib/cms/links";
import { resolveMenu } from "@/lib/cms/menu";
import { fontFaceCss, googleFontsHref, menuStyleVars, pageStyleVars, stylesheetUrl, systemDarkScript, usedFonts } from "@/lib/cms/theme";
import { getContent, isPreview } from "@/lib/cms/store";
import { localeParams, locales, resolveLocale, metadataLocale } from "@/lib/i18n";
import { localeInfo } from "@/lib/locales";
import { jsonLdHtml, ogLocale, seoMetadata, siteJsonLd } from "@/lib/seo";
import { toShopItem, visiblePacks } from "@/lib/shop";
import "../globals.css";

const font = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Titles (the .heading utility and product names): Phudu, a Vietnamese-made display sans (SIL OFL).
const display = Phudu({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-phudu",
  display: "swap",
});

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;
export const generateStaticParams = localeParams;
// Content comes from the CMS on every request (see lib/cms/store.ts).
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#115931",
  colorScheme: "light",
};

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const content = await getContent();
  const { settings } = content;
  const base = seoMetadata({
    content,
    locale,
    path: "",
    title: pick(settings.seo.title, locale),
    description: pick(settings.seo.description, locale),
    absoluteTitle: true,
  });
  return {
    ...base,
    metadataBase: new URL(settings.url),
    title: { default: pick(settings.seo.title, locale), template: `%s | ${settings.name}` },
    applicationName: settings.name,
    authors: [{ name: settings.legalName, url: settings.url }],
    publisher: settings.legalName,
    formatDetection: { telephone: true, email: true, address: false },
    manifest: "/manifest.webmanifest",
    icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: [{ url: "/apple-icon.png", sizes: "180x180" }] },
    verification: {
      google: settings.verification.google || undefined,
      other: settings.verification.bing ? { "msvalidate.01": settings.verification.bing } : undefined,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const locale = resolveLocale((await params).locale);
  const [content, preview] = await Promise.all([getContent(), isPreview()]);
  const { settings: site } = content;
  const ui = content.ui[locale];
  // Only a real GA4 id is ever interpolated into the inline script.
  const ga4 = /^G-[A-Z0-9]{4,16}$/.test(site.analytics.ga4.trim()) && !preview ? site.analytics.ga4.trim() : "";
  // Fonts picked in Studio (theme, menu, any page) that the layout doesn't already load.
  const { theme } = content;
  const fontsHref = googleFontsHref([...usedFonts([theme.page, ...Object.values(content.pages).map((p) => p.style)]), theme.menu.font]);
  // Fonts added in Studio › Giao diện: pasted stylesheet links, and @font-face for uploaded/linked files.
  const customLinks = [...new Set(theme.fonts.map((f) => stylesheetUrl(f.link)).filter((u): u is string => Boolean(u)))];
  const customFaces = fontFaceCss(theme.fonts);

  return (
    // suppressHydrationWarning: the inline script below adds the `js` class before React hydrates.
    // Studio › Giao diện › Chế độ tối: "dark" is rendered dark from the server, "system" follows the device.
    <html lang={localeInfo[locale].html} className={`${font.variable} ${display.variable}${theme.darkMode === "dark" ? " dark" : ""}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide intro elements before first paint, only when JS will animate them in. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {theme.darkMode === "system" && <script dangerouslySetInnerHTML={{ __html: systemDarkScript }} />}
        {fontsHref && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={fontsHref} />
          </>
        )}
        {customLinks.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        {customFaces && <style dangerouslySetInnerHTML={{ __html: customFaces }} />}
      </head>
      {/* Theme › fonts and text sizes apply everywhere, header and footer included. */}
      <body className="flex min-h-dvh flex-col" style={pageStyleVars(theme.page)}>
        <CartProvider
          locale={locale}
          t={ui.shop}
          common={{ prev: ui.common.prev, next: ui.common.next, photo: ui.common.photo }}
          frame={content.settings.productFrame}
          catalog={visiblePacks(content.retailPacks).map((p) => toShopItem(p, locale))}
        >
          <Header
            locale={locale}
            nav={ui.nav}
            items={resolveMenu(content, locale)}
            menuStyle={menuStyleVars(theme.menu)}
            contact={site}
            logoAlt={`${site.name} – ${site.tagline}`}
          />
          <SiteContactProvider value={{ phone: site.phone, phoneE164: site.phoneE164, email: site.email }}>
            <MotionMain>{children}</MotionMain>
          </SiteContactProvider>
          <Footer locale={locale} content={content} ui={ui} />
        </CartProvider>
        {!preview && <FloatingContact t={ui.chat} links={site} />}
        {preview && <PreviewBridge />}
        {/* vinext doesn't emit openGraph.alternateLocale; React 19 hoists this <meta> into <head>. */}
        {locales
          .filter((l) => l !== locale)
          .map((l) => (
            <meta key={l} property="og:locale:alternate" content={ogLocale[l]} />
          ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(siteJsonLd(content, locale))} />
        {ga4 && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${ga4}");`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
