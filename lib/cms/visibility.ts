// Whether the website is open to the public. When it is not, visitors get the
// "Coming soon" page (proxy.ts rewrites every page to /coming-soon/{locale},
// with a 503) while anyone signed in to Studio still sees the whole site.
//
// Stored on its own (not in the content draft), so it takes effect at once and
// publishing, discarding or restoring an old content version never flips it.
import { sessionUser } from "./auth";
import { db } from "./db";
import { parseVisibility, type Visibility } from "./visibility-format";

export type { Visibility };

const KEY = "site:visibility";

export async function getVisibility(): Promise<Visibility> {
  const row = await (await db()).prepare("SELECT data, updated_at FROM cms_documents WHERE key = ?").bind(KEY).first<{ data: string; updated_at: number }>();
  return row ? parseVisibility(JSON.parse(row.data), row.updated_at) : parseVisibility(null);
}

/**
 * For the proxy and the public APIs. Fails open: if the database can't be read
 * the site stays public (it renders the built-in content then, as it always has).
 */
export async function isSitePublic(): Promise<boolean> {
  try {
    return (await getVisibility()).public;
  } catch {
    return true;
  }
}

export async function setVisibility(isPublic: boolean, by: string): Promise<Visibility> {
  const now = Date.now();
  await (await db())
    .prepare("INSERT INTO cms_documents (key, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
    .bind(KEY, JSON.stringify({ public: isPublic, updatedBy: by }), now)
    .run();
  return { public: isPublic, updatedAt: now, updatedBy: by };
}

/**
 * The website's own forms (orders, quote requests) are closed with the site, so
 * nothing arrives from a page visitors can't see. Studio accounts can still test them.
 */
export async function closedToVisitors(req: Request): Promise<boolean> {
  if (await isSitePublic()) return false;
  return !(await sessionUser(req.headers.get("cookie")));
}
