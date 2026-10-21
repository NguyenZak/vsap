// Quote requests sent from the website's form, kept in D1 so sales can follow up
// in Studio (the optional INQUIRY_WEBHOOK_URL forward still runs alongside).
import { db } from "./db";
import { inquiryStatuses, type Inquiry, type InquiryData, type InquiryStatus } from "./inquiry-format";

export { inquiriesCsv } from "./inquiry-format";

type Row = Omit<Inquiry, "data"> & { data: string };
const fromRow = (r: Row): Inquiry => ({ ...r, data: JSON.parse(r.data) as InquiryData });

export async function saveInquiry(data: InquiryData, meta: { locale?: string; source?: string; country?: string; ipHash: string }) {
  const res = await (await db())
    .prepare("INSERT INTO cms_inquiries (created_at, status, data, locale, source, country, ip_hash) VALUES (?, 'new', ?, ?, ?, ?, ?)")
    .bind(Date.now(), JSON.stringify(data), meta.locale ?? null, meta.source?.slice(0, 300) ?? null, meta.country ?? null, meta.ipHash)
    .run();
  return res.meta.last_row_id;
}

/** Submissions from this (hashed) address within the window, for basic flood protection. */
export async function recentFrom(ipHash: string, ms: number) {
  const row = await (await db())
    .prepare("SELECT COUNT(*) AS n FROM cms_inquiries WHERE ip_hash = ? AND created_at > ?")
    .bind(ipHash, Date.now() - ms)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function listInquiries({ status, q, limit = 500 }: { status?: string; q?: string; limit?: number }) {
  const filters: [string, unknown][] = [];
  if (status && (inquiryStatuses as readonly string[]).includes(status)) filters.push(["status = ?", status]);
  if (q) filters.push(["(data LIKE ? OR note LIKE ?)", `%${q.replace(/[%_]/g, "")}%`]);
  const where = filters.length ? `WHERE ${filters.map(([s]) => s).join(" AND ")}` : "";
  const args = filters.flatMap(([s, v]) => (s.includes("OR") ? [v, v] : [v]));
  const { results } = await (await db())
    .prepare(`SELECT id, created_at, status, data, locale, source, country, note, updated_at, updated_by FROM cms_inquiries ${where} ORDER BY id DESC LIMIT ?`)
    .bind(...args, Math.min(2000, limit))
    .all<Row>();
  return results.map(fromRow);
}

export async function inquiryCounts() {
  const { results } = await (await db()).prepare("SELECT status, COUNT(*) AS n FROM cms_inquiries GROUP BY status").all<{ status: InquiryStatus; n: number }>();
  const counts = Object.fromEntries(inquiryStatuses.map((s) => [s, 0])) as Record<InquiryStatus, number>;
  for (const r of results) counts[r.status] = r.n;
  return counts;
}

export async function updateInquiry(id: number, patch: { status?: unknown; note?: unknown }, by: string) {
  const row = await (await db()).prepare("SELECT * FROM cms_inquiries WHERE id = ?").bind(id).first<Row>();
  if (!row) throw new Error("Không tìm thấy yêu cầu.");
  const status = patch.status === undefined ? row.status : patch.status;
  if (!(inquiryStatuses as readonly unknown[]).includes(status)) throw new Error("Trạng thái không hợp lệ.");
  const note = patch.note === undefined ? row.note : String(patch.note ?? "").slice(0, 4000);
  const now = Date.now();
  await (await db())
    .prepare("UPDATE cms_inquiries SET status = ?, note = ?, updated_at = ?, updated_by = ? WHERE id = ?")
    .bind(status, note, now, by, id)
    .run();
  return { inquiry: fromRow({ ...row, status: status as InquiryStatus, note, updated_at: now, updated_by: by }), before: fromRow(row) };
}

export async function deleteInquiry(id: number) {
  await (await db()).prepare("DELETE FROM cms_inquiries WHERE id = ?").bind(id).run();
}
