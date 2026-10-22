// Retail orders placed from the website's cart, kept in D1 so sales can confirm them in Studio.
import { db } from "./db";
import { orderStatuses, type Order, type OrderData, type OrderStatus } from "./order-format";

type Row = Omit<Order, "data"> & { data: string };
const fromRow = (r: Row): Order => ({ ...r, data: JSON.parse(r.data) as OrderData });

export async function saveOrder(data: OrderData, meta: { locale?: string; source?: string; ipHash: string }) {
  const res = await (await db())
    .prepare("INSERT INTO cms_orders (created_at, status, data, locale, source, ip_hash) VALUES (?, 'new', ?, ?, ?, ?)")
    .bind(Date.now(), JSON.stringify(data), meta.locale ?? null, meta.source?.slice(0, 300) ?? null, meta.ipHash)
    .run();
  return res.meta.last_row_id;
}

/** Orders from this (hashed) address within the window, for basic flood protection. */
export async function recentOrdersFrom(ipHash: string, ms: number) {
  const row = await (await db())
    .prepare("SELECT COUNT(*) AS n FROM cms_orders WHERE ip_hash = ? AND created_at > ?")
    .bind(ipHash, Date.now() - ms)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function listOrders({ status, q, limit = 500 }: { status?: string; q?: string; limit?: number }) {
  const filters: [string, unknown][] = [];
  if (status && (orderStatuses as readonly string[]).includes(status)) filters.push(["status = ?", status]);
  if (q) filters.push(["(data LIKE ? OR note LIKE ?)", `%${q.replace(/[%_]/g, "")}%`]);
  const where = filters.length ? `WHERE ${filters.map(([s]) => s).join(" AND ")}` : "";
  const args = filters.flatMap(([s, v]) => (s.includes("OR") ? [v, v] : [v]));
  const { results } = await (await db())
    .prepare(`SELECT id, created_at, status, data, locale, source, note, updated_at, updated_by FROM cms_orders ${where} ORDER BY id DESC LIMIT ?`)
    .bind(...args, Math.min(2000, limit))
    .all<Row>();
  return results.map(fromRow);
}

export async function orderCounts() {
  const { results } = await (await db()).prepare("SELECT status, COUNT(*) AS n FROM cms_orders GROUP BY status").all<{ status: OrderStatus; n: number }>();
  const counts = Object.fromEntries(orderStatuses.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const r of results) counts[r.status] = r.n;
  return counts;
}

export async function updateOrder(id: number, patch: { status?: unknown; note?: unknown }, by: string) {
  const row = await (await db()).prepare("SELECT * FROM cms_orders WHERE id = ?").bind(id).first<Row>();
  if (!row) throw new Error("Không tìm thấy đơn hàng.");
  const status = patch.status === undefined ? row.status : patch.status;
  if (!(orderStatuses as readonly unknown[]).includes(status)) throw new Error("Trạng thái không hợp lệ.");
  const note = patch.note === undefined ? row.note : String(patch.note ?? "").slice(0, 4000);
  const now = Date.now();
  await (await db())
    .prepare("UPDATE cms_orders SET status = ?, note = ?, updated_at = ?, updated_by = ? WHERE id = ?")
    .bind(status, note, now, by, id)
    .run();
  return { order: fromRow({ ...row, status: status as OrderStatus, note, updated_at: now, updated_by: by }), before: fromRow(row) };
}

export async function deleteOrder(id: number) {
  await (await db()).prepare("DELETE FROM cms_orders WHERE id = ?").bind(id).run();
}
