import type { Metadata } from "next";
import { RenderSections } from "@/components/blocks";
import { pick } from "@/lib/cms/links";
import { getContent, isPreview } from "@/lib/cms/store";
import type { PageId } from "@/lib/cms/types";
import { alternates, metadataLocale, resolveLocale } from "@/lib/i18n";

type Params = Promise<{ locale: string }>;

/** A page built from its CMS sections. */
export async function CmsPage({ id, params }: { id: PageId; params: Params }) {
  const locale = resolveLocale((await params).locale);
  const [content, preview] = await Promise.all([getContent(), isPreview()]);
  return <RenderSections sections={content.pages[id].sections} ctx={{ locale, content, ui: content.ui[locale] }} preview={preview} />;
}

/** Title/description from the page's SEO fields, with hreflang alternates. */
export async function cmsMetadata(id: PageId, params: Params): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const content = await getContent();
  const page = content.pages[id];
  const title = pick(page.seo.title, locale);
  const description = pick(page.seo.description, locale) || pick(content.settings.seo.description, locale);
  return {
    // The home page title is the full site title; inner pages go through the layout's "%s | VSAP" template.
    title: id === "home" ? { absolute: title || pick(content.settings.seo.title, locale) } : title,
    description,
    alternates: alternates(locale, page.path),
    openGraph: { title: title || undefined, description },
  };
}
