import type { Metadata, Viewport } from "next";
import { Inter, Phudu } from "next/font/google";
import { pick } from "@/lib/cms/links";
import { getContent } from "@/lib/cms/store";
import { localeParams, metadataLocale, resolveLocale } from "@/lib/i18n";
import { localeInfo } from "@/lib/locales";
import "../../globals.css";

const font = Inter({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });
const display = Phudu({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"], variable: "--font-phudu", display: "swap" });

/*
 * Root layout of the "Coming soon" page. proxy.ts rewrites every website page here
 * (status 503) while Studio › Cài đặt › Hiển thị website is off; it has its own
 * layout so nothing of the real pages (header, menu, page titles) is rendered.
 * Opening /coming-soon/{locale} directly shows the page whatever the setting.
 */

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;
export const generateStaticParams = localeParams;
export const dynamic = "force-dynamic";

export const viewport: Viewport = { themeColor: "#082a17", colorScheme: "dark" };

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const { settings, ui } = await getContent();
  return {
    title: `${settings.name} – ${ui[locale].comingSoon.tag}`,
    description: pick(settings.seo.description, locale),
    robots: { index: false, follow: false },
    icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: [{ url: "/apple-icon.png", sizes: "180x180" }] },
  };
}

export default async function ComingSoonLayout({ children, params }: Props) {
  const locale = resolveLocale((await params).locale);
  return (
    <html lang={localeInfo[locale].html} className={`${font.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-forest-950">{children}</body>
    </html>
  );
}
