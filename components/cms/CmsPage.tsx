import type { Metadata } from "next";
import { RenderSections } from "@/components/blocks";
import { pick } from "@/lib/cms/links";
import { getPosts } from "@/lib/cms/posts";
import { getContent, isPreview } from "@/lib/cms/store";
import type { L, PageId } from "@/lib/cms/types";
import { metadataLocale, resolveLocale } from "@/lib/i18n";
import { breadcrumbJsonLd, faqJsonLd, jsonLdHtml, pageImage, seoMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

/** A page built from its CMS sections, plus its breadcrumb / FAQ structured data. */
export async function CmsPage({ id, params }: { id: PageId; params: Params }) {
  const locale = resolveLocale((await params).locale);
  const [content, preview] = await Promise.all([getContent(), isPreview()]);
  const page = content.pages[id];
  const ui = content.ui[locale];
  const posts = page.sections.some((s) => s.type === "posts" && !s.hidden) ? await getPosts(locale, preview) : undefined;

  const jsonLd: unknown[] = [];
  if (id !== "home") jsonLd.push(breadcrumbJsonLd(content, locale, [{ name: ui.nav[id], path: page.path }]));
  const faq = page.sections.find((s) => s.type === "faq" && !s.hidden);
  const faqItems = ((faq?.props.items as { q: L; a: L }[] | undefined) ?? [])
    .map((f) => ({ q: pick(f.q, locale), a: pick(f.a, locale) }))
    .filter((f) => f.q && f.a);
  if (faqItems.length) jsonLd.push(faqJsonLd(faqItems));

  return (
    <>
      <RenderSections sections={page.sections} ctx={{ locale, content, ui, posts, preview }} preview={preview} />
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(d)} />
      ))}
    </>
  );
}

/** Title/description/share image from the page's SEO fields. */
export async function cmsMetadata(id: PageId, params: Params): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const content = await getContent();
  const page = content.pages[id];
  const hero = pageImage(page);
  return seoMetadata({
    content,
    locale,
    path: page.path,
    title: pick(page.seo.title, locale) || (id === "home" ? "" : content.ui[locale].nav[id]),
    description: pick(page.seo.description, locale) || pick(content.settings.seo.description, locale),
    image: page.seo.image || hero?.src,
    imageAlt: hero?.alt,
    noindex: page.seo.noindex,
    // The home page shows the full site title, not "Title | VSAP".
    absoluteTitle: id === "home",
  });
}
