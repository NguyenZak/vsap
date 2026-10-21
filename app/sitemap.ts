import type { MetadataRoute } from "next";
import { getContent, getPublishedAt } from "@/lib/cms/store";
import { locales } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ settings, pages, products }, publishedAt] = await Promise.all([getContent(), getPublishedAt()]);
  const lastModified = publishedAt ? new Date(publishedAt) : undefined;
  const entries = [
    // Pages hidden from search (noindex) stay out of the sitemap.
    ...Object.values(pages)
      .filter((p) => !p.seo.noindex)
      .map((p) => ({ path: p.path, priority: p.path === "" ? 1 : 0.8 })),
    ...products.map((p) => ({ path: `/products/${p.slug}`, priority: 0.9 })),
  ];
  return entries.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: `${settings.url}/${locale}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${settings.url}/${l}${path}`])) },
    })),
  );
}
