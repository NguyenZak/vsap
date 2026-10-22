import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { PostGrid } from "@/components/PostCards";
import { CmsImg } from "@/components/sections";
import { Button } from "@/components/ui";
import { pick } from "@/lib/cms/links";
import { channelOf, formatDate, inLocale, postChannels, postPath } from "@/lib/cms/post-format";
import { getPosts } from "@/lib/cms/posts";
import { getContent, isPreview } from "@/lib/cms/store";
import type { PostChannel } from "@/lib/cms/types";
import { locales, metadataLocale, resolveLocale, type Locale } from "@/lib/i18n";
import { faqFromMarkdown, plainText, readingMinutes } from "@/lib/markdown";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, jsonLdHtml, seoMetadata } from "@/lib/seo";

// The page of one post, shared by /news/[slug] (Tin tức) and /health/[slug]
// (Sức khỏe và đời sống). A post opened under the other channel's path is
// redirected to its own, so each post has a single address.

export type PostParams = Promise<{ locale: string; slug: string }>;

async function load(locale: Locale, slug: string) {
  const preview = await isPreview();
  const [content, posts] = await Promise.all([getContent(), getPosts(locale, preview)]);
  const post = posts.find((p) => p.slug === slug) ?? null;
  // Languages the same post exists in, for hreflang.
  const available = post ? (await Promise.all(locales.map(async (l) => ((await getPosts(l, preview)).some((p) => p.slug === slug) ? l : null)))).filter((l): l is Locale => Boolean(l)) : [];
  return { content, post, posts, available };
}

export async function postMetadata(params: PostParams): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = metadataLocale(raw);
  const { content, post, available } = await load(locale, slug);
  if (!post) return {};
  const description = pick(post.seo.description, locale) || pick(post.excerpt, locale) || plainText(pick(post.body, locale)).slice(0, 160);
  return seoMetadata({
    content,
    locale,
    path: postPath(post),
    title: pick(post.seo.title, locale) || pick(post.title, locale),
    description,
    image: post.cover?.src,
    imageAlt: pick(post.cover?.alt, locale),
    type: "article",
    publishedTime: post.date,
    available,
  });
}

export async function PostPage({ params, channel }: { params: PostParams; channel: PostChannel }) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const { content, post, posts } = await load(locale, slug);
  if (!post || !inLocale(post, locale)) notFound();
  if (channelOf(post) !== channel) permanentRedirect(`/${locale}${postPath(post)}`);
  const list = postChannels.find((c) => c.value === channel)!.path;
  const ui = content.ui[locale];
  const t = ui.news;
  const tr = (v: Parameters<typeof pick>[0]) => pick(v, locale);
  const body = tr(post.body);
  // "More stories" stay in the same channel when it has enough of them.
  const others = posts.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => channelOf(p) === channel);
  const more = (same.length >= 3 ? same : [...same, ...others.filter((p) => channelOf(p) !== channel)]).slice(0, 3);
  const path = postPath(post);

  const faq = faqFromMarkdown(body);
  const jsonLd: unknown[] = [
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
      { name: ui.nav[channel], path: list },
      { name: tr(post.title), path },
    ]),
  ];
  if (faq.length) jsonLd.push(faqJsonLd(faq));

  return (
    <>
      <section className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-forest-900 lg:min-h-[40rem]">
        <CmsImg image={post.cover?.src ? { src: post.cover.src, alt: tr(post.cover.alt) } : undefined} priority parallax className="absolute inset-0 -z-10 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/35 to-black/30" />
        <div className="container-page pb-14 pt-36 sm:pb-20">
          <Link href={`/${locale}${list}`} data-intro className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="size-4" />
            {channel === "news" ? t.back : ui.nav[channel]}
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
