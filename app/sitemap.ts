import type { MetadataRoute } from "next";
import { allLivePosts } from "@/lib/cms/posts";
import { getContent, getPublishedAt } from "@/lib/cms/store";
import { locales } from "@/lib/i18n";
import { visiblePacks } from "@/lib/shop";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ settings, pages, products, retailPacks, policies }, publishedAt, posts] = await Promise.all([getContent(), getPublishedAt(), allLivePosts()]);
  const lastModified = publishedAt ? new Date(publishedAt) : undefined;
  const entries = [
    // Pages hidden from search (noindex) stay out of the sitemap.
    ...Object.values(pages)
      .filter((p) => !p.seo.noindex)
      .map((p) => ({ path: p.path, priority: p.path === "" ? 1 : 0.8 })),
    ...products.map((p) => ({ path: `/products/${p.slug}`, priority: 0.9 })),
    ...visiblePacks(retailPacks).map((p) => ({ path: `/products/${p.product}/${p.id}`, priority: 0.7 })),
    ...policies.map((p) => ({ path: `/policies/${p.slug}`, priority: 0.3 })),
  ];
  const pageUrls = entries.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: `${settings.url}/${locale}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${settings.url}/${l}${path}`])) },
    })),
  );

  // Posts are listed only in the languages they were written in.
  const postUrls = posts.flatMap((p) => {
    const langs = locales.filter((l) => p.title[l]?.trim());
    return langs.map((locale) => ({
      url: `${settings.url}/${locale}/news/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: Object.fromEntries(langs.map((l) => [l, `${settings.url}/${l}/news/${p.slug}`])) },
    }));
  });
  return [...pageUrls, ...postUrls];
}
