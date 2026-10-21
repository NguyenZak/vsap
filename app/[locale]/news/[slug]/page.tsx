import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { PostGrid } from "@/components/PostCards";
import { CmsImg } from "@/components/sections";
import { Button } from "@/components/ui";
import { pick } from "@/lib/cms/links";
import { formatDate, inLocale } from "@/lib/cms/post-format";
import { getPosts } from "@/lib/cms/posts";
import { getContent, isPreview } from "@/lib/cms/store";
import { locales, metadataLocale, resolveLocale, type Locale } from "@/lib/i18n";
import { plainText, readingMinutes } from "@/lib/markdown";
import { articleJsonLd, breadcrumbJsonLd, jsonLdHtml, seoMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Posts come from the CMS, so any slug published there gets a page.
export const dynamicParams = true;

async function load(locale: Locale, slug: string) {
  const preview = await isPreview();
  const [content, posts] = await Promise.all([getContent(), getPosts(locale, preview)]);
  const post = posts.find((p) => p.slug === slug) ?? null;
  // Languages the same post exists in, for hreflang.
  const available = post ? (await Promise.all(locales.map(async (l) => ((await getPosts(l, preview)).some((p) => p.slug === slug) ? l : null)))).filter((l): l is Locale => Boolean(l)) : [];
  return { content, post, posts, available };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = metadataLocale(raw);
  const { content, post, available } = await load(locale, slug);
  if (!post) return {};
  const description = pick(post.seo.description, locale) || pick(post.excerpt, locale) || plainText(pick(post.body, locale)).slice(0, 160);
  return seoMetadata({
    content,
    locale,
    path: `/news/${post.slug}`,
    title: pick(post.seo.title, locale) || pick(post.title, locale),
    description,
    image: post.cover?.src,
    imageAlt: pick(post.cover?.alt, locale),
    type: "article",
    publishedTime: post.date,
    available,
  });
}

export default async function PostPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const { content, post, posts } = await load(locale, slug);
  if (!post || !inLocale(post, locale)) notFound();
  const ui = content.ui[locale];
  const t = ui.news;
  const tr = (v: Parameters<typeof pick>[0]) => pick(v, locale);
  const body = tr(post.body);
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const path = `/news/${post.slug}`;

  const jsonLd = [
    articleJsonLd(content, locale, {
      path,
      headline: tr(post.title),
      description: tr(post.excerpt) || plainText(body).slice(0, 160),
      image: post.cover?.src,
      date: post.date,
      author: post.author,
      section: tr(post.category),
    }),
    breadcrumbJsonLd(content, locale, [
      { name: ui.nav.news, path: "/news" },
      { name: tr(post.title), path },
    ]),
  ];

  return (
    <>
      <section className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-forest-900 lg:min-h-[40rem]">
        <CmsImg image={post.cover?.src ? { src: post.cover.src, alt: tr(post.cover.alt) } : undefined} priority parallax className="absolute inset-0 -z-10 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/30" />
        <div className="container-page pb-14 pt-36 sm:pb-20">
          <Link href={`/${locale}/news`} data-intro className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="size-4" />
            {t.back}
          </Link>
          <p data-intro className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/75">
            {tr(post.category) && <span className="rounded-full bg-white/15 px-3 py-1 font-medium text-white backdrop-blur-md">{tr(post.category)}</span>}
            {post.date && (
              <time dateTime={post.date}>
                {t.published} {formatDate(post.date, locale)}
              </time>
            )}
            <span aria-hidden="true">·</span>
            <span>
              {readingMinutes(body)} {t.minutes}
            </span>
          </p>
          <h1 data-intro className="heading mt-5 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">
            {tr(post.title)}
          </h1>
          {tr(post.excerpt) && (
            <p data-intro className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
              {tr(post.excerpt)}
            </p>
          )}
        </div>
      </section>

      <article className="bg-white py-16 sm:py-24">
        <div data-reveal className="container-page max-w-3xl">
          <Markdown source={body} locale={locale} />
          {post.author && <p className="mt-12 border-t border-mist-200 pt-6 text-sm text-ink-400">— {post.author}</p>}
        </div>
      </article>

      <section className="bg-white pb-16 sm:pb-24">
        <div data-reveal className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-forest-900 p-8 sm:flex-row sm:items-center sm:p-12">
            <div>
              <h2 className="heading text-3xl text-white sm:text-4xl">{t.ctaTitle}</h2>
              <p className="mt-2 text-sm text-white/75 sm:text-base">{t.ctaBody}</p>
            </div>
            <Button href={`/${locale}/contact`}>{ui.common.requestQuote}</Button>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-mist-50 py-16 sm:py-24">
          <div className="container-page">
            <h2 data-reveal className="heading text-3xl text-forest-900 sm:text-4xl">
              {t.more}
            </h2>
            <div className="mt-10">
              <PostGrid posts={more} locale={locale} labels={{ readMore: t.readMore, minutes: t.minutes }} onMuted />
            </div>
          </div>
        </section>
      )}

      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(d)} />
      ))}
    </>
  );
}
