import type { MetadataRoute } from "next";
import { getContent } from "@/lib/cms/store";
import { locales } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings, pages, products } = await getContent();
  const paths = [...Object.values(pages).map((p) => p.path), ...products.map((p) => `/products/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${settings.url}/${locale}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${settings.url}/${l}${path}`])) },
    })),
  );
}
