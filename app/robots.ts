import type { MetadataRoute } from "next";
import { getContent } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getContent();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/*?__preview", "/*&__preview"] },
    sitemap: `${settings.url}/sitemap.xml`,
    host: settings.url,
  };
}
