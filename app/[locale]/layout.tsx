import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FloatingContact } from "@/components/FloatingContact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionMain } from "@/components/MotionMain";
import { alternates, getDictionary, localeParams, resolveLocale, metadataLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
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

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: meta.title, template: `%s | ${site.name}` },
    description: meta.description,
    alternates: alternates(locale),
    openGraph: {
      type: "website",
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      locale: locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);

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
    address: site.offices.map((o) => ({ "@type": "PostalAddress", ...o.postal, addressCountry: "VN" })),
  };

  return (
    // suppressHydrationWarning: the inline script below adds the `js` class before React hydrates.
    <html lang={locale} className={font.variable} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide intro elements before first paint, only when JS will animate them in. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header locale={locale} nav={dict.nav} />
        <MotionMain>{children}</MotionMain>
        <Footer locale={locale} dict={dict} />
        <FloatingContact t={dict.chat} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
