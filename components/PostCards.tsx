import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pick } from "@/lib/cms/links";
import { formatDate, postPath } from "@/lib/cms/post-format";
import type { Post } from "@/lib/cms/types";
import type { Locale } from "@/lib/locales";
import { plainText, readingMinutes } from "@/lib/markdown";
import { SIZES } from "@/lib/responsive";
import { CmsImg } from "./sections";

type Labels = { readMore: string; minutes: string };

function Meta({ post, locale, labels, tone = "light" }: { post: Post; locale: Locale; labels: Labels; tone?: "light" | "dark" }) {
  const category = pick(post.category, locale);
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${tone === "dark" ? "text-white/70" : "text-ink-400"}`}>
      {category && (
        <span className={`rounded-full px-2.5 py-1 font-medium ${tone === "dark" ? "bg-white/15 text-white" : "bg-sun-400/50 text-heading"}`}>{category}</span>
      )}
      {post.date && <time dateTime={post.date}>{formatDate(post.date, locale)}</time>}
      <span aria-hidden="true">·</span>
      <span>
        {readingMinutes(pick(post.body, locale))} {labels.minutes}
      </span>
    </p>
  );
}

const excerptOf = (post: Post, locale: Locale) => pick(post.excerpt, locale) || plainText(pick(post.body, locale)).slice(0, 180);

/** `onMuted`: the card sits on a grey section, so it gets a white face instead. */
export function PostCard({ post, locale, labels, onMuted = false }: { post: Post; locale: Locale; labels: Labels; onMuted?: boolean }) {
  const cover = post.cover?.src ? { src: post.cover.src, alt: pick(post.cover.alt, locale) } : undefined;
  return (
    <Link href={`/${locale}${postPath(post)}`} data-reveal className={`group flex h-full flex-col rounded-3xl p-2 transition ${onMuted ? "bg-surface hover:bg-mist-100" : "bg-mist-50 hover:bg-mist-100"}`}>
      <div className="overflow-hidden rounded-2xl">
        <CmsImg image={cover} sizes={SIZES.third} className="aspect-[16/10] w-full transition duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Meta post={post} locale={locale} labels={labels} />
        <h3 className="heading mt-3 text-2xl text-heading">{pick(post.title, locale)}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{excerptOf(post, locale)}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-heading">
          {labels.readMore}
          <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  );
}

/** Large first post: photo with the headline over it. */
export function FeaturedPost({ post, locale, labels }: { post: Post; locale: Locale; labels: Labels }) {
  const cover = post.cover?.src ? { src: post.cover.src, alt: pick(post.cover.alt, locale) } : undefined;
  return (
    <Link href={`/${locale}${postPath(post)}`} data-reveal className="group relative isolate flex min-h-[26rem] items-end overflow-hidden rounded-3xl bg-forest-900 lg:min-h-[32rem]">
      <CmsImg image={cover} sizes={SIZES.full} className="absolute inset-0 -z-10 size-full transition duration-1000 group-hover:scale-105" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      <div className="max-w-3xl p-6 sm:p-10">
        <Meta post={post} locale={locale} labels={labels} tone="dark" />
        <h3 className="heading mt-4 text-3xl text-white sm:text-5xl">{pick(post.title, locale)}</h3>
        <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{excerptOf(post, locale)}</p>
        <span className="btn btn-primary mt-6 inline-flex items-center gap-1.5 rounded-full bg-sun-400 px-4 py-2 text-sm font-medium text-forest-950">
          {labels.readMore}
          <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  );
}

export function PostGrid({ posts, locale, labels, onMuted }: { posts: Post[]; locale: Locale; labels: Labels; onMuted?: boolean }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <li key={p.slug}>
          <PostCard post={p} locale={locale} labels={labels} onMuted={onMuted} />
        </li>
      ))}
    </ul>
  );
}
