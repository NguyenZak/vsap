import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderSections } from "@/components/blocks";
import { pick } from "@/lib/cms/links";
import { getPosts } from "@/lib/cms/posts";
import { getContent, isPreview } from "@/lib/cms/store";
import { mergePageStyle, pageStyleVars } from "@/lib/cms/theme";
import type { Section } from "@/lib/cms/types";
import type { Locale } from "@/lib/i18n";
import { breadcrumbJsonLd, jsonLdHtml, seoMetadata } from "@/lib/seo";

// The list page of a news category that has no page of its own in Studio › Trang
// (news and health do). Built from the same sections as the News page, so it
// looks like it: a banner with the category's name, intro and photo, the
// category's posts, and the News page's contact strip.

async function categoryOf(slug: string) {
  const content = await getContent();
  const category = content.categories.find((c) => c.slug === slug);
  // A category that has a Studio page is served there (/news, /health).
  if (!category || Object.values(content.pages).some((p) => p.path === `/${slug}`)) return null;
  return { content, category };
}

export async function categoryMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const found = await categoryOf(slug);
  if (!found) return {};
  const { content, category } = found;
  return seoMetadata({
    content,
    locale,
    path: `/${slug}`,
    title: pick(category.seo.title, locale) || pick(category.name, locale),
    description: pick(category.seo.description, locale) || pick(category.intro, locale) || pick(content.settings.seo.description, locale),
    image: category.image.src || undefined,
    imageAlt: pick(category.image.alt, locale),
  });
}

export async function CategoryPage({ slug, locale }: { slug: string; locale: Locale }) {
  const found = await categoryOf(slug);
  if (!found) notFound();
  const { content, category } = found;
  const preview = await isPreview();
  const ui = content.ui[locale];
  const cta = content.pages.news.sections.find((s) => s.type === "cta" && !s.hidden);
  const sections: Section[] = [
    { id: `cat-${slug}-hero`, type: "pageHero", props: { eyebrow: {}, title: category.name, accent: {}, lead: category.intro, image: category.image } },
    { id: `cat-${slug}-list`, type: "posts", props: { channel: slug, limit: 0, featured: true, tone: "white" } },
    ...(cta ? [cta] : []),
  ];
  const style = mergePageStyle(content.theme.page, content.pages.news.style);
  return (
    <div style={pageStyleVars(style)}>
      <RenderSections sections={sections} ctx={{ locale, content, ui, posts: await getPosts(locale, preview), preview, pageStyle: style }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(breadcrumbJsonLd(content, locale, [{ name: pick(category.name, locale), path: `/${slug}` }]))} />
    </div>
  );
}
