// Pure helpers for news posts, shared by the server and Studio.
import { localeInfo, type Locale } from "../locales";
import type { Post, PostChannel } from "./types";

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Today in Vietnam (UTC+7), as YYYY-MM-DD: scheduled posts go live at local midnight. */
export const todayVN = (now = Date.now()) => new Date(now + 7 * 3600_000).toISOString().slice(0, 10);

/** A post shows in a language only when it has a title in that language. */
export const inLocale = (post: Pick<Post, "title">, locale: Locale) => Boolean(post.title?.[locale]?.trim());

export const isScheduled = (post: Pick<Post, "date">, now = Date.now()) => Boolean(post.date) && post.date > todayVN(now);

/** URL-safe slug from a title: "Mùa điều 2026" → "mua-dieu-2026". */
export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Problems that block saving or publishing, in Vietnamese for the editor. */
export function postProblem(post: Post): string | null {
  if (!SLUG_RE.test(post.slug ?? "")) return "Slug chỉ gồm chữ thường không dấu, số và gạch ngang.";
  if (!post.title?.vi?.trim() && !post.title?.en?.trim()) return "Bài cần có tiêu đề.";
  if (post.date && !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) return "Ngày đăng không hợp lệ.";
  return null;
}

export function formatDate(date: string, locale: Locale) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : localeInfo[locale].intl, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

/**
 * Category slug a post belongs to. Posts saved before categories existed are news;
 * given the site's categories, a post whose category was deleted falls back to the first one.
 */
export function channelOf(post: Partial<Pick<Post, "channel">>, categories?: { slug: string }[]): PostChannel {
  const own = post.channel || "news";
  if (!categories?.length || categories.some((c) => c.slug === own)) return own;
  return categories[0].slug;
}

/** Site path of a post without the language prefix, e.g. /health/an-hat-moi-ngay. */
export const postPath = (post: Pick<Post, "slug"> & Partial<Pick<Post, "channel">>, categories?: { slug: string }[]) =>
  `/${channelOf(post, categories)}/${post.slug}`;

/** Posts with their category resolved against the site's categories (see channelOf). */
export const withCategories = <P extends Partial<Pick<Post, "channel">>>(posts: P[], categories: { slug: string }[]) =>
  posts.map((p) => ({ ...p, channel: channelOf(p, categories) }));

/**
 * Top-level paths a category slug may not take: a category's list lives at /{slug},
 * so these would be shadowed by the site's own pages.
 */
export const RESERVED_SLUGS = ["about", "products", "quality", "contact", "cart", "policies", "admin", "api", "media", "_next"];

/** Why a category slug can't be used, in Vietnamese for the editor (null when fine). */
export function categoryProblem(slug: string, others: string[]): string | null {
  if (!SLUG_RE.test(slug)) return "Slug chỉ gồm chữ thường không dấu, số và gạch ngang.";
  if (RESERVED_SLUGS.includes(slug)) return `“${slug}” trùng đường dẫn có sẵn của website.`;
  if (others.includes(slug)) return "Đã có chuyên mục khác dùng slug này.";
  return null;
}
