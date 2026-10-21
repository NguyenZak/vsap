import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/products", "/quality", "/contact", ...products.map((p) => `/products/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])) },
    })),
  );
}
