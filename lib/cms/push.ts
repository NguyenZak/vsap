// Push notifications (Web Push) for Studio staff and for website visitors.
//
// One row per browser subscription (endpoint). `topics` is a space-padded token list:
//   staff:    "orders" "inquiries" "drafts"   (+ user_id, re-checked against the role when sending)
//   visitors: "news" "broadcast" "order:<id>" (order tokens only after proving the order's push token)
// The same browser can hold staff and visitor tokens at once.
//
// The VAPID key pair is created on first use and kept in cms_documents, so nothing
// has to be configured on Cloudflare. Sends go out right away (a handful of devices);
// subscriptions the push service reports as gone are deleted.
import { can, type Permission, type Role } from "./roles";
import { db } from "./db";
import { findUser } from "./users";
import { generateVapidKeys, sendPush, type PushMessage, type PushSubscriptionJSON, type VapidKeys } from "../push/webpush";

const KEY = "push:vapid";
/** Who VAPID says is sending (push services may contact this address/site). */
const SUBJECT = "https://vsap.com.vn";

export const STAFF_TOPICS = ["orders", "inquiries", "drafts"] as const;
export type StaffTopic = (typeof STAFF_TOPICS)[number];
export const PUBLIC_TOPICS = ["news", "broadcast"] as const;
export type PublicTopic = (typeof PUBLIC_TOPICS)[number];

/** Permission a staff member needs to receive each topic. */
export const topicPermission: Record<StaffTopic, Permission> = { orders: "inquiries", inquiries: "inquiries", drafts: "content.publish" };

type Row = { id: number; endpoint: string; p256dh: string; auth: string; user_id: string | null; topics: string; locale: string | null };

const tokens = (topics: string) => topics.trim().split(/\s+/).filter(Boolean);
const pack = (list: Iterable<string>) => ` ${[...new Set(list)].join(" ")} `;

let keysCache: Promise<VapidKeys> | null = null;

async function loadKeys(): Promise<VapidKeys> {
  const d = await db();
  const row = await d.prepare("SELECT data FROM cms_documents WHERE key = ?").bind(KEY).first<{ data: string }>();
  if (row) return JSON.parse(row.data) as VapidKeys;
  const keys = await generateVapidKeys();
  // INSERT OR IGNORE: if two requests race, both then read the one that won.
  await d.prepare("INSERT OR IGNORE INTO cms_documents (key, data, updated_at) VALUES (?, ?, ?)").bind(KEY, JSON.stringify(keys), Date.now()).run();
  const saved = await d.prepare("SELECT data FROM cms_documents WHERE key = ?").bind(KEY).first<{ data: string }>();
  return JSON.parse(saved!.data) as VapidKeys;
}

function vapid() {
  keysCache ??= loadKeys().catch((e) => {
    keysCache = null;
    throw e;
  });
  return keysCache;
}

export const publicKey = async () => (await vapid()).publicKey;

/** A subscription object from the browser, checked before it is stored. */
export function parseSubscription(raw: unknown): PushSubscriptionJSON | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } };
  if (typeof r.endpoint !== "string" || r.endpoint.length > 1000) return null;
  try {
    if (new URL(r.endpoint).protocol !== "https:") return null;
  } catch {
    return null;
  }
  const { p256dh, auth } = r.keys ?? {};
  const b64 = /^[A-Za-z0-9_-]+$/;
  if (typeof p256dh !== "string" || typeof auth !== "string" || !b64.test(p256dh) || !b64.test(auth) || p256dh.length > 120 || auth.length > 40) return null;
  return { endpoint: r.endpoint, keys: { p256dh, auth } };
}

async function findRow(endpoint: string) {
  return (await db()).prepare("SELECT * FROM cms_push WHERE endpoint = ?").bind(endpoint).first<Row>();
}

/** Store this browser with `add` tokens; `replace` tokens matching it are dropped first. */
async function upsert(sub: PushSubscriptionJSON, change: { add: string[]; replace?: (t: string) => boolean; userId?: string | null; locale?: string }) {
  const d = await db();
  const row = await findRow(sub.endpoint);
  const kept = row ? tokens(row.topics).filter((t) => !change.replace?.(t)) : [];
  const topics = [...kept, ...change.add];
  if (!topics.length) {
    if (row) await d.prepare("DELETE FROM cms_push WHERE id = ?").bind(row.id).run();
    return [];
  }
  const userId = change.userId === undefined ? (row?.user_id ?? null) : change.userId;
  const locale = change.locale ?? row?.locale ?? null;
  await d
    .prepare(
      `INSERT INTO cms_push (endpoint, p256dh, auth, user_id, topics, locale, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth, user_id = excluded.user_id, topics = excluded.topics, locale = excluded.locale, fails = 0`,
    )
    .bind(sub.endpoint, sub.keys.p256dh, sub.keys.auth, userId, pack(topics), locale, Date.now())
    .run();
  return topics;
}

const isStaff = (t: string) => (STAFF_TOPICS as readonly string[]).includes(t);
const isPublic = (t: string) => (PUBLIC_TOPICS as readonly string[]).includes(t);

// ---- Staff -------------------------------------------------------------------

/** Turn this device's staff alerts on with exactly `topics` (those the role may receive). */
export async function subscribeStaff(sub: PushSubscriptionJSON, topics: unknown, user: { id: string; role: Role }) {
  const wanted = (Array.isArray(topics) ? topics : []).filter((t): t is StaffTopic => isStaff(String(t)) && can(user.role, topicPermission[t as StaffTopic]));
  return upsert(sub, { add: wanted, replace: isStaff, userId: wanted.length ? user.id : null });
}

/** Staff topics this device receives (for the settings dialog). */
export async function staffTopicsOf(endpoint: string, userId: string) {
  const row = await findRow(endpoint);
  return row && row.user_id === userId ? tokens(row.topics).filter(isStaff) : [];
}

// ---- Visitors ----------------------------------------------------------------

export async function subscribeVisitor(sub: PushSubscriptionJSON, input: { topics?: unknown; order?: { id?: unknown; token?: unknown }; locale?: string }) {
  if (input.order) {
    const id = Number(input.order.id);
    const token = String(input.order.token ?? "");
    const order = await (await db()).prepare("SELECT push_token FROM cms_orders WHERE id = ?").bind(id).first<{ push_token: string | null }>();
    if (!id || !token || !order?.push_token || order.push_token !== token) throw new Error("Không tìm thấy đơn hàng.");
    return upsert(sub, { add: [`order:${id}`], locale: input.locale });
  }
  const wanted = (Array.isArray(input.topics) ? input.topics : []).filter((t): t is PublicTopic => isPublic(String(t)));
  return upsert(sub, { add: wanted, replace: isPublic, locale: input.locale });
}

export async function visitorTopicsOf(endpoint: string) {
  const row = await findRow(endpoint);
  return row ? tokens(row.topics).filter((t) => !isStaff(t)) : [];
}

export async function subscriberCounts() {
  const { results } = await (await db()).prepare("SELECT topics FROM cms_push").all<{ topics: string }>();
  const count = (t: string) => results.filter((r) => r.topics.includes(` ${t} `)).length;
  return { news: count("news"), broadcast: count("broadcast"), staff: results.filter((r) => tokens(r.topics).some(isStaff)).length };
}

// ---- Sending -----------------------------------------------------------------

/** A message in each language a subscriber may have picked (falls back to Vietnamese). */
export type Localized = (locale: string) => PushMessage | null;

async function deliver(rows: Row[], message: Localized, urgency: "normal" | "high" = "normal") {
  if (!rows.length) return { sent: 0, failed: 0 };
  const keys = await vapid();
  const d = await db();
  let sent = 0;
  let failed = 0;
  await Promise.all(
    rows.map(async (r) => {
      const msg = message(r.locale ?? "vi");
      if (!msg) return;
      try {
        const res = await sendPush({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, msg, keys, SUBJECT, urgency);
        if (res.ok) {
          sent++;
          await d.prepare("UPDATE cms_push SET last_ok_at = ?, fails = 0 WHERE id = ?").bind(Date.now(), r.id).run();
        } else if (res.gone) {
          await d.prepare("DELETE FROM cms_push WHERE id = ?").bind(r.id).run();
        } else {
          failed++;
          console.error("[push]", res.status, new URL(r.endpoint).host);
          await d.prepare("UPDATE cms_push SET fails = fails + 1 WHERE id = ?").bind(r.id).run();
        }
      } catch (e) {
        failed++;
        console.error("[push]", e);
      }
    }),
  );
  // Endpoints that keep failing (expired keys, uninstalled browsers…) are dropped.
  await d.prepare("DELETE FROM cms_push WHERE fails >= 10").run();
  return { sent, failed };
}

async function rowsWith(token: string) {
  const { results } = await (await db()).prepare("SELECT * FROM cms_push WHERE topics LIKE ?").bind(`% ${token} %`).all<Row>();
  return results;
}

/** Alert staff devices subscribed to `topic` whose account may still receive it. */
export async function notifyStaff(topic: StaffTopic, message: PushMessage, opts: { exceptUserId?: string } = {}) {
  const rows = await rowsWith(topic);
  const allowed: Row[] = [];
  for (const r of rows) {
    if (!r.user_id || r.user_id === opts.exceptUserId) continue;
    const role: Role | null = r.user_id === "owner" ? "admin" : await findUser(r.user_id).then((u) => (u && !u.disabled ? (u.role as Role) : null));
    if (role && can(role, topicPermission[topic])) allowed.push(r);
  }
  return deliver(allowed, () => message, "high");
}

export async function notifyOrderSubscribers(orderId: number, message: Localized) {
  return deliver(await rowsWith(`order:${orderId}`), message, "high");
}

export async function notifyVisitors(topic: PublicTopic, message: Localized) {
  return deliver(await rowsWith(topic), message);
}

/** Test alert to every device of one staff member. */
export async function notifyUser(userId: string, message: PushMessage) {
  const { results } = await (await db()).prepare("SELECT * FROM cms_push WHERE user_id = ?").bind(userId).all<Row>();
  return deliver(results, () => message, "high");
}

/** Run alerts without letting a push failure break the request that triggered them. */
export async function safely(task: () => Promise<unknown>) {
  try {
    await task();
  } catch (e) {
    console.error("[push]", e);
  }
}

/** Random token handed to the customer with a new order; proves they may follow it. */
export const newOrderToken = () => [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");

const DRAFT_ALERT_EVERY = 60 * 60_000;

/**
 * An editor who can't publish saved something: tell publishers, at most once an hour
 * per editor (autosave runs every few seconds).
 */
export async function alertDraftWaiting(user: { id: string; name: string; role: Role }, what: string) {
  if (can(user.role, "content.publish")) return;
  const d = await db();
  const key = `push:drafts:${user.id}`;
  const now = Date.now();
  const last = await d.prepare("SELECT updated_at FROM cms_documents WHERE key = ?").bind(key).first<{ updated_at: number }>();
  if (last && now - last.updated_at < DRAFT_ALERT_EVERY) return;
  await d
    .prepare("INSERT INTO cms_documents (key, data, updated_at) VALUES (?, '{}', ?) ON CONFLICT(key) DO UPDATE SET updated_at = excluded.updated_at")
    .bind(key, now)
    .run();
  await notifyStaff("drafts", { title: "Bản nháp chờ xuất bản", body: `${user.name} vừa sửa ${what}.`, url: what.startsWith("bài") ? "/admin?view=news" : "/admin", tag: "drafts" }, { exceptUserId: user.id });
}

/** A deleted order: stop sending its updates (and drop browsers left with nothing). */
export async function forgetOrder(orderId: number) {
  const d = await db();
  await d.prepare("UPDATE cms_push SET topics = REPLACE(topics, ?, ' ') WHERE topics LIKE ?").bind(` order:${orderId} `, `% order:${orderId} %`).run();
  await d.prepare("DELETE FROM cms_push WHERE TRIM(topics) = ''").run();
}
