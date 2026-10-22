// D1 access shared by every CMS module. Tables are created on first use, so a
// fresh database needs no migration step; new tables are simply added here.
import { env } from "cloudflare:workers";

type Bindings = { DB?: D1Database; MEDIA?: R2Bucket };
export const bindings = () => env as unknown as Bindings;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS cms_documents (key TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS cms_revisions (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT NOT NULL, created_at INTEGER NOT NULL, note TEXT)`,
  `CREATE TABLE IF NOT EXISTS cms_media (key TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL, created_at INTEGER NOT NULL)`,
  // Studio accounts. `version` is bumped to sign a user out everywhere (password change, disable, role change).
  `CREATE TABLE IF NOT EXISTS cms_users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL, role TEXT NOT NULL, password TEXT NOT NULL, disabled INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, last_login_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS cms_audit (id INTEGER PRIMARY KEY AUTOINCREMENT, at INTEGER NOT NULL, user_id TEXT, username TEXT, action TEXT NOT NULL, target TEXT, detail TEXT)`,
  `CREATE INDEX IF NOT EXISTS cms_audit_user_action ON cms_audit (username, action, at)`,
  `CREATE TABLE IF NOT EXISTS cms_inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'new', data TEXT NOT NULL, locale TEXT, source TEXT, country TEXT, ip_hash TEXT, note TEXT, updated_at INTEGER, updated_by TEXT)`,
  `CREATE INDEX IF NOT EXISTS cms_inquiries_ip ON cms_inquiries (ip_hash, created_at)`,
  // Retail orders from the website cart (cash on delivery); `data` holds the customer and the priced items.
  `CREATE TABLE IF NOT EXISTS cms_orders (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'new', data TEXT NOT NULL, locale TEXT, source TEXT, ip_hash TEXT, note TEXT, updated_at INTEGER, updated_by TEXT)`,
  `CREATE INDEX IF NOT EXISTS cms_orders_ip ON cms_orders (ip_hash, created_at)`,
  // News posts: `draft` is what editors change, `published` is what visitors see (null = not live).
  `CREATE TABLE IF NOT EXISTS cms_posts (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, draft TEXT NOT NULL, published TEXT, published_at INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, updated_by TEXT)`,
];

/** Columns added after a table first shipped: [table, column, definition]. */
const COLUMNS: [string, string, string][] = [["cms_revisions", "author", "TEXT"]];

async function migrate(d: D1Database) {
  await d.batch(SCHEMA.map((q) => d.prepare(q)));
  for (const [table, column, def] of COLUMNS) {
    const { results } = await d.prepare(`PRAGMA table_info(${table})`).all<{ name: string }>();
    if (!results.some((c) => c.name === column)) await d.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`).run();
  }
}

let ready: Promise<unknown> | null = null;

export class CmsUnavailableError extends Error {
  constructor() {
    super("CMS storage (D1 binding DB) is not configured.");
  }
}

export async function db(): Promise<D1Database> {
  const d = bindings().DB;
  if (!d) throw new CmsUnavailableError();
  ready ??= migrate(d).catch((e) => {
    ready = null;
    throw e;
  });
  await ready;
  return d;
}
