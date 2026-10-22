import type { MetadataRoute } from "next";
import { getContent } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings } = await getContent();
  return {
    name: `${settings.name} – ${settings.tagline}`,
    short_name: settings.name,
    description: settings.seo.description.vi,
    start_url: "/vi",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#115931",
    lang: "vi",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
