// Server-side CMS storage. Content lives in D1 as two JSON documents ("draft" and
// "published") plus a revision history; uploaded files live in R2 with a row in
// cms_media. Tables are created on first use, so a fresh database needs no setup.
import { env } from "cloudflare:workers";
import { headers } from "next/headers";
import { cache } from "react";
import { defaultContent } from "./defaults";
import { isObject, normalize } from "./normalize";
import type { SiteContent } from "./types";

export { normalize };

type Bindings = { DB?: D1Database; MEDIA?: R2Bucket };
const bindings = () => env as unknown as Bindings;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS cms_documents (key TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS cms_revisions (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT NOT NULL, created_at INTEGER NOT NULL, note TEXT)`,
  `CREATE TABLE IF NOT EXISTS cms_media (key TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL, created_at INTEGER NOT NULL)`,
];

/** How many published versions to keep for restore. */
const KEEP_REVISIONS = 50;
/** Guard against runaway documents (D1 rows max out around 2 MB). */
const MAX_DOC_BYTES = 1_500_000;

let ready: Promise<unknown> | null = null;

export class CmsUnavailableError extends Error {
  constructor() {
    super("CMS storage (D1 binding DB) is not configured.");
  }
}

async function db(): Promise<D1Database> {
  const d = bindings().DB;
  if (!d) throw new CmsUnavailableError();
  ready ??= d.batch(SCHEMA.map((q) => d.prepare(q))).catch((e) => {
    ready = null;
    throw e;
  });
  await ready;
  return d;
}

async function readDoc(key: "draft" | "published"): Promise<{ content: SiteContent; updatedAt: number } | null> {
  const row = await (await db()).prepare("SELECT data, updated_at FROM cms_documents WHERE key = ?").bind(key).first<{ data: string; updated_at: number }>();
  return row ? { content: normalize(JSON.parse(row.data)), updatedAt: row.updated_at } : null;
}

/**
 * The content to render for this request: the draft when the admin preview
 * asked for it (proxy.ts sets x-vsap-preview after checking the session),
 * otherwise the published version, otherwise the built-in defaults.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const preview = (await headers()).get("x-vsap-preview") === "1";
  try {
    const doc = (preview && (await readDoc("draft"))) || (await readDoc("published"));
    return doc ? doc.content : defaultContent();
  } catch (e) {
    if (!(e instanceof CmsUnavailableError)) console.error("[cms] read failed, using defaults", e);
    return defaultContent();
  }
});

/** When the live content was last published (null before the first publish). */
export const getPublishedAt = cache(async (): Promise<number | null> => {
  try {
    const row = await (await db()).prepare("SELECT updated_at FROM cms_documents WHERE key = 'published'").first<{ updated_at: number }>();
    return row?.updated_at ?? null;
  } catch {
    return null;
  }
});

export const isPreview = cache(async () => (await headers()).get("x-vsap-preview") === "1");

// ---- Admin operations -------------------------------------------------------

export async function adminState() {
  const [draft, published] = await Promise.all([readDoc("draft"), readDoc("published")]);
  return {
    content: draft?.content ?? published?.content ?? defaultContent(),
    hasDraft: Boolean(draft),
    draftUpdatedAt: draft?.updatedAt ?? null,
    publishedAt: published?.updatedAt ?? null,
  };
}

function validate(content: unknown): SiteContent {
  if (!isObject(content) || content.schema !== 1 || !isObject(content.pages) || !isObject(content.settings)) {
    throw new Error("Invalid content document");
  }
  return normalize(content);
}

async function writeDoc(key: "draft" | "published", content: SiteContent) {
  const data = JSON.stringify(content);
  if (data.length > MAX_DOC_BYTES) throw new Error("Content is too large");
  const now = Date.now();
  await (await db())
    .prepare("INSERT INTO cms_documents (key, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
    .bind(key, data, now)
    .run();
  return now;
}

export async function saveDraft(content: unknown) {
  return writeDoc("draft", validate(content));
}

/** Publish the draft (or the given content): becomes live and is added to history. */
export async function publish(note = "") {
  const d = await db();
  const draft = await readDoc("draft");
  const content = draft?.content ?? (await readDoc("published"))?.content ?? defaultContent();
  const now = await writeDoc("published", content);
  await d.batch([
    d.prepare("INSERT INTO cms_revisions (data, created_at, note) VALUES (?, ?, ?)").bind(JSON.stringify(content), now, note.slice(0, 200)),
    d.prepare("DELETE FROM cms_documents WHERE key = 'draft'"),
    d.prepare("DELETE FROM cms_revisions WHERE id NOT IN (SELECT id FROM cms_revisions ORDER BY id DESC LIMIT ?)").bind(KEEP_REVISIONS),
  ]);
  return now;
}

export async function discardDraft() {
  await (await db()).prepare("DELETE FROM cms_documents WHERE key = 'draft'").run();
}

export async function listRevisions() {
  const { results } = await (await db())
    .prepare("SELECT id, created_at, note, length(data) AS size FROM cms_revisions ORDER BY id DESC LIMIT ?")
    .bind(KEEP_REVISIONS)
    .all<{ id: number; created_at: number; note: string | null; size: number }>();
  return results;
}

/** Load an old version into the draft so it can be reviewed, then published. */
export async function restoreRevision(id: number) {
  const row = await (await db()).prepare("SELECT data FROM cms_revisions WHERE id = ?").bind(id).first<{ data: string }>();
  if (!row) throw new Error("Revision not found");
  return writeDoc("draft", normalize(JSON.parse(row.data)));
}

// ---- Media ------------------------------------------------------------------

export type MediaItem = { key: string; name: string; type: string; size: number; created_at: number; url: string };

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"]);
const MAX_UPLOAD = 10 * 1024 * 1024;

function bucket(): R2Bucket {
  const b = bindings().MEDIA;
  if (!b) throw new Error("Media storage (R2 binding MEDIA) is not configured.");
  return b;
}

export const mediaUrl = (key: string) => `/media/${key}`;

export async function listMedia(): Promise<MediaItem[]> {
  const { results } = await (await db()).prepare("SELECT key, name, type, size, created_at FROM cms_media ORDER BY created_at DESC LIMIT 500").all<Omit<MediaItem, "url">>();
  return results.map((r) => ({ ...r, url: mediaUrl(r.key) }));
}

function slugify(name: string) {
  return (
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/gi, "d")
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "file"
  );
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  if (file.size > MAX_UPLOAD) throw new Error("File is larger than 10 MB");
  const date = new Date();
  const key = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID().slice(0, 8)}-${slugify(file.name)}`;
  await bucket().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  const item = { key, name: file.name.slice(0, 200), type: file.type, size: file.size, created_at: Date.now() };
  await (await db()).prepare("INSERT INTO cms_media (key, name, type, size, created_at) VALUES (?, ?, ?, ?, ?)").bind(item.key, item.name, item.type, item.size, item.created_at).run();
  return { ...item, url: mediaUrl(key) };
}

export async function deleteMedia(key: string) {
  await bucket().delete(key);
  await (await db()).prepare("DELETE FROM cms_media WHERE key = ?").bind(key).run();
}

export async function getMediaObject(key: string) {
  return bucket().get(key);
}
