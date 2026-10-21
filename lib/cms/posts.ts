// News posts in D1 (cms_posts). Each row holds the editors' draft and, once
// published, the copy visitors see, so a post can be revised without the live
// version changing until someone with publish rights approves it.
import { cache } from "react";
import type { Locale } from "../locales";
import { newPost } from "./collections";
import { db } from "./db";
import { isObject, withDefaults } from "./normalize";
import { inLocale, isScheduled, postProblem, todayVN } from "./post-format";
import type { Post } from "./types";

const MAX_POST_BYTES = 400_000;

type Row = { id: string; slug: string; draft: string; published: string | null; published_at: number | null; created_at: number; updated_at: number; updated_by: string | null };

export type PostStatus = "draft" | "published" | "changed";

export type PostSummary = {
  id: string;
  slug: string;
  title: Post["title"];
  cover: string;
  date: string;
  status: PostStatus;
  scheduled: boolean;
  published_at: number | null;
  updated_at: number;
  updated_by: string | null;
};

export type PostRecord = { id: string; draft: Post; published: Post | null; published_at: number | null; updated_at: number; updated_by: string | null };

export function normalizePost(raw: unknown): Post {
  if (!isObject(raw)) throw new Error("Invalid post");
  return withDefaults(raw, newPost(todayVN()));
}

const parse = (s: string | null) => (s ? normalizePost(JSON.parse(s)) : null);

function statusOf(r: Row): PostStatus {
  if (!r.published) return "draft";
  return r.published === r.draft ? "published" : "changed";
}

function summary(r: Row): PostSummary {
  const d = parse(r.draft)!;
  return {
    id: r.id,
    slug: d.slug,
    title: d.title,
    cover: d.cover?.src ?? "",
    date: d.date,
    status: statusOf(r),
    scheduled: isScheduled(d),
    published_at: r.published_at,
    updated_at: r.updated_at,
    updated_by: r.updated_by,
  };
}

async function row(id: string) {
  const r = await (await db()).prepare("SELECT * FROM cms_posts WHERE id = ?").bind(id).first<Row>();
  if (!r) throw new Error("Không tìm thấy bài viết.");
  return r;
}

const record = (r: Row): PostRecord => ({ id: r.id, draft: parse(r.draft)!, published: parse(r.published), published_at: r.published_at, updated_at: r.updated_at, updated_by: r.updated_by });

// ---- Studio -------------------------------------------------------------------

export async function listPostsAdmin(): Promise<PostSummary[]> {
  const { results } = await (await db()).prepare("SELECT * FROM cms_posts ORDER BY created_at DESC").all<Row>();
  return results.map(summary).sort((a, b) => b.date.localeCompare(a.date));
}

export const getPostAdmin = async (id: string) => record(await row(id));

/** Slug free for this post: not used by another post's draft or live copy. */
async function assertSlugFree(slug: string, id: string) {
  const clash = await (await db())
    .prepare("SELECT id FROM cms_posts WHERE id != ? AND (slug = ? OR json_extract(published, '$.slug') = ?) LIMIT 1")
    .bind(id, slug, slug)
    .first<{ id: string }>();
  if (clash) throw new Error(`Slug “${slug}” đang được bài khác dùng.`);
}

function serialize(post: Post) {
  const problem = postProblem(post);
  if (problem) throw new Error(problem);
  const data = JSON.stringify(post);
  if (data.length > MAX_POST_BYTES) throw new Error("Bài viết quá dài.");
  return data;
}

export async function createPost(input: unknown, by: string) {
  const post = normalizePost(input ?? newPost(todayVN()));
  // Give new posts a unique placeholder slug the editor can change.
  const base = post.slug || `bai-viet-${todayVN()}`;
  let slug = base;
  for (let n = 2; ; n++) {
    const taken = await (await db()).prepare("SELECT 1 AS x FROM cms_posts WHERE slug = ? OR json_extract(published, '$.slug') = ?").bind(slug, slug).first();
    if (!taken) break;
    slug = `${base}-${n}`;
  }
  const full = { ...post, slug };
  const id = crypto.randomUUID();
  const now = Date.now();
  await (await db())
    .prepare("INSERT INTO cms_posts (id, slug, draft, published, published_at, created_at, updated_at, updated_by) VALUES (?, ?, ?, NULL, NULL, ?, ?, ?)")
    .bind(id, slug, serialize(full), now, now, by)
    .run();
  return getPostAdmin(id);
}

export async function savePostDraft(id: string, input: unknown, by: string) {
  await row(id);
  const post = normalizePost(input);
  const data = serialize(post);
  await assertSlugFree(post.slug, id);
  const now = Date.now();
  await (await db()).prepare("UPDATE cms_posts SET slug = ?, draft = ?, updated_at = ?, updated_by = ? WHERE id = ?").bind(post.slug, data, now, by, id).run();
  return now;
}

export async function publishPost(id: string, by: string) {
  const r = await row(id);
  const draft = parse(r.draft)!;
  serialize(draft);
  await assertSlugFree(draft.slug, id);
  const now = Date.now();
  await (await db())
    .prepare("UPDATE cms_posts SET published = draft, published_at = COALESCE(published_at, ?), updated_at = ?, updated_by = ? WHERE id = ?")
    .bind(now, now, by, id)
    .run();
  return getPostAdmin(id);
}

export async function unpublishPost(id: string, by: string) {
  await row(id);
  await (await db()).prepare("UPDATE cms_posts SET published = NULL, updated_at = ?, updated_by = ? WHERE id = ?").bind(Date.now(), by, id).run();
  return getPostAdmin(id);
}

/** Throw away unpublished edits: the draft goes back to the live copy. */
export async function revertPost(id: string, by: string) {
  const r = await row(id);
  if (!r.published) throw new Error("Bài chưa từng xuất bản.");
  await (await db()).prepare("UPDATE cms_posts SET draft = published, slug = json_extract(published, '$.slug'), updated_at = ?, updated_by = ? WHERE id = ?").bind(Date.now(), by, id).run();
  return getPostAdmin(id);
}

export async function deletePost(id: string) {
  const r = await row(id);
  await (await db()).prepare("DELETE FROM cms_posts WHERE id = ?").bind(id).run();
  return parse(r.draft)!;
}

// ---- Website ------------------------------------------------------------------

export type LivePost = Post & { publishedAt: number; updatedAt: number };

/**
 * Posts visitors can see in a language, newest first. In the Studio preview the
 * drafts are shown instead (including unpublished and scheduled posts), so
 * editors can check a post before it goes live.
 */
export const getPosts = cache(async (locale: Locale, preview = false): Promise<LivePost[]> => {
  try {
    const { results } = await (await db())
      .prepare(preview ? "SELECT * FROM cms_posts" : "SELECT * FROM cms_posts WHERE published IS NOT NULL")
      .all<Row>();
    return results
      .map((r) => ({ ...parse(preview ? r.draft : r.published)!, publishedAt: r.published_at ?? r.created_at, updatedAt: r.updated_at }))
      .filter((p) => inLocale(p, locale) && (preview || !isScheduled(p)))
      .sort((a, b) => b.date.localeCompare(a.date) || b.publishedAt - a.publishedAt);
  } catch (e) {
    console.error("[cms] posts unavailable", e);
    return [];
  }
});

export async function getPost(slug: string, locale: Locale, preview = false) {
  return (await getPosts(locale, preview)).find((p) => p.slug === slug) ?? null;
}

/** Every live post in any language, for the sitemap. */
export async function allLivePosts(): Promise<LivePost[]> {
  try {
    const { results } = await (await db()).prepare("SELECT * FROM cms_posts WHERE published IS NOT NULL").all<Row>();
    return results.map((r) => ({ ...parse(r.published)!, publishedAt: r.published_at ?? r.created_at, updatedAt: r.updated_at })).filter((p) => !isScheduled(p));
  } catch {
    return [];
  }
}
