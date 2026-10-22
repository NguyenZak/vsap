"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mail, MapPin, MessageCircle, Phone, ReceiptText, RefreshCw, Search, ShoppingCart, Trash2, User } from "lucide-react";
import { orderStatuses, orderStatusInfo, type Order, type OrderStatus } from "@/lib/cms/order-format";
import { api, formatTime } from "./api";

const statusTone: Record<OrderStatus, string> = {
  new: "bg-sun-400 text-forest-950",
  confirmed: "bg-sun-500/15 text-ink-900",
  shipping: "bg-forest-600/15 text-forest-900",
  done: "bg-mist-100 text-ink-600",
  cancelled: "bg-red-50 text-chili-600",
};

function StatusPill({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone[status]}`}>{orderStatusInfo[status].label}</span>;
}

const vnd = (n: number) => `${n.toLocaleString("vi-VN")}₫`;
const digits = (s = "") => s.replace(/[^\d]/g, "");
const itemCount = (o: Order) => o.data.items.reduce((n, i) => n + i.qty, 0);

/** Retail orders from the website cart: confirm by phone, track delivery, keep internal notes. */
export function OrdersView({ onCounts }: { onCounts?: (c: Record<OrderStatus, number>) => void }) {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Order[] | null>(null);
  const [counts, setCounts] = useState<Record<OrderStatus, number> | null>(null);
  // A Telegram alert links to /admin?view=orders&id=… to open that order directly.
  const [selected, setSelected] = useState<number | null>(() => (typeof window === "undefined" ? null : Number(new URLSearchParams(location.search).get("id")) || null));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedRef = useRef<number | null>(null);
  selectedRef.current = selected;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.orders({ status: status || undefined, q: query || undefined });
      // Keep the open order listed while it is being read, even if it no longer matches the filter.
      setItems((prev) => {
        const open = prev?.find((i) => i.id === selectedRef.current);
        return open && !r.items.some((i) => i.id === open.id) ? [open, ...r.items] : r.items;
      });
      setCounts(r.counts);
      onCounts?.(r.counts);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [status, query, onCounts]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  // Search as you type, after a short pause.
  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  const current = items?.find((i) => i.id === selected) ?? null;
  const replace = (next: Order) => setItems((cur) => cur?.map((i) => (i.id === next.id ? next : i)) ?? null);

  // Updated in place (no reload), so the open order stays on screen even if it no longer matches the tab.
  const setItemStatus = async (item: Order, s: OrderStatus) => {
    if (item.status === s) return;
    replace({ ...item, status: s });
    try {
      replace((await api.updateOrder(item.id, { status: s })).order);
      if (counts) {
        const next = { ...counts, [item.status]: Math.max(0, counts[item.status] - 1), [s]: counts[s] + 1 };
        setCounts(next);
        onCounts?.(next);
      }
    } catch (e) {
      replace(item);
      alert((e as Error).message);
    }
  };

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const tabs: { value: OrderStatus | ""; label: string; n: number }[] = [
    { value: "", label: "Tất cả", n: total },
    ...orderStatuses.map((s) => ({ value: s, label: orderStatusInfo[s].label, n: counts?.[s] ?? 0 })),
  ];

  return (
    <>
      <aside className="flex w-[26rem] shrink-0 flex-col border-r border-mist-200 bg-white">
        <div className="border-b border-mist-200 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-medium text-ink-900">Đơn hàng</h2>
              <p className="mt-0.5 text-xs leading-snug text-ink-600">Đặt từ giỏ hàng trên website, thanh toán khi nhận hàng. Gọi khách xác nhận rồi chuyển sang “Đã xác nhận”.</p>
            </div>
            <button type="button" title="Tải lại" onClick={load} className="shrink-0 rounded-lg p-1.5 text-ink-600 hover:bg-mist-100">
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <label className="relative mt-3 block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên, số điện thoại, địa chỉ, sản phẩm…" className="w-full rounded-lg border border-mist-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-forest-600" />
          </label>
          <div className="mt-3 flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t.value || "all"}
                type="button"
                onClick={() => setStatus(t.value)}
                className={`rounded-full px-2.5 py-1 text-xs ${status === t.value ? "bg-forest-900 text-white" : "bg-mist-100 text-ink-600 hover:bg-mist-200"}`}
              >
                {t.label} <span className="opacity-70">{t.n}</span>
              </button>
            ))}
          </div>
        </div>
        <ol className="min-h-0 flex-1 overflow-y-auto">
          {error && <li className="p-4 text-sm text-chili-600">{error}</li>}
          {!items && !error && <Loader2 className="mx-auto mt-12 size-6 animate-spin text-ink-400" />}
          {items?.length === 0 && (
            <li className="px-6 py-16 text-center text-sm text-ink-400">
              <ShoppingCart className="mx-auto mb-2 size-7" />
              {query || status ? "Không có đơn nào khớp bộ lọc." : "Chưa có đơn hàng nào. Đơn đặt từ giỏ hàng trên website sẽ hiện ở đây."}
            </li>
          )}
          {items?.map((o) => (
            <li key={o.id} className="border-b border-mist-200">
              <button type="button" onClick={() => setSelected(o.id)} className={`block w-full px-4 py-3 text-left transition ${selected === o.id ? "bg-sun-400/15" : "hover:bg-mist-50"}`}>
                <span className="flex items-center gap-2">
                  {o.status === "new" && <span className="size-2 shrink-0 rounded-full bg-forest-600" aria-label="Mới" />}
                  <span className={`min-w-0 flex-1 truncate text-sm ${o.status === "new" ? "font-semibold text-ink-900" : "text-ink-900"}`}>
                    #{o.id} · {o.data.customer.name}
                    <span className="font-normal text-ink-600"> · {o.data.customer.phone}</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-400">{formatTime(o.created_at)}</span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <StatusPill status={o.status} />
                  <span className="text-xs font-medium text-ink-900 tabular-nums">{vnd(o.data.total)}</span>
                  <span className="min-w-0 flex-1 truncate text-xs text-ink-400">
                    {itemCount(o)} sản phẩm · {o.data.items.map((i) => i.name).join(", ")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <section className="min-h-0 flex-1 overflow-y-auto bg-mist-50">
        {current ? (
          <Detail key={current.id} item={current} onStatus={(s) => setItemStatus(current, s)} onSaved={replace} onDeleted={() => { setSelected(null); load(); }} />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-ink-400">
            <div>
              <ReceiptText className="mx-auto mb-2 size-8" />
              Chọn một đơn hàng bên trái để xem chi tiết.
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Detail({ item, onStatus, onSaved, onDeleted }: { item: Order; onStatus: (s: OrderStatus) => void; onSaved: (o: Order) => void; onDeleted: () => void }) {
  const [note, setNote] = useState(item.note ?? "");
  const [saving, setSaving] = useState(false);
  const { customer: c, items, total } = item.data;
  const phone = digits(c.phone);
  const vnPhone = /^(0|84)\d{8,10}$/.test(phone) ? (phone.startsWith("84") ? `0${phone.slice(2)}` : phone) : null;

  const rows: [typeof Mail, string, React.ReactNode][] = [
    [Phone, "Điện thoại", <a key="p" href={`tel:${c.phone}`} className="text-forest-600 hover:underline">{c.phone}</a>],
    [Mail, "Email", c.email ? <a key="e" href={`mailto:${c.email}`} className="text-forest-600 hover:underline">{c.email}</a> : "—"],
    [MapPin, "Địa chỉ nhận hàng", c.address],
    [User, "Khách hàng", c.name],
  ];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-2xl border border-mist-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-ink-400">
              #{item.id} · {formatTime(item.created_at)} · {item.locale === "en" ? "Tiếng Anh" : "Tiếng Việt"}
              {item.source && <> · từ trang <span className="font-mono">{item.source}</span></>}
            </p>
            <h2 className="mt-1 text-xl font-medium text-ink-900">{c.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-3 py-2 text-sm font-medium text-white hover:bg-forest-800">
              <Phone className="size-4" /> Gọi xác nhận
            </a>
            {vnPhone && (
              <a href={`https://zalo.me/${vnPhone}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-mist-200 px-3 py-2 text-sm text-ink-900 hover:bg-mist-50">
                <MessageCircle className="size-4" /> Zalo
              </a>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-ink-600">Trạng thái:</span>
          {orderStatuses.map((s) => (
            <button key={s} type="button" onClick={() => onStatus(s)} className={`rounded-full px-3 py-1 text-xs transition ${item.status === s ? statusTone[s] + " ring-2 ring-forest-900/10" : "bg-mist-50 text-ink-600 hover:bg-mist-100"}`}>
              {orderStatusInfo[s].label}
            </button>
          ))}
        </div>

        <dl className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {rows.map(([Icon, label, value]) => (
            <div key={label} className="flex gap-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-ink-400" />
              <div className="min-w-0">
                <dt className="text-[11px] text-ink-400">{label}</dt>
                <dd className="text-sm break-words text-ink-900">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-6 overflow-hidden rounded-xl border border-mist-200">
          <table className="w-full text-sm">
            <thead className="bg-mist-50 text-left text-[11px] tracking-wider text-ink-400 uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Sản phẩm</th>
                <th className="px-4 py-2 text-right font-medium">Đơn giá</th>
                <th className="px-4 py-2 text-right font-medium">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-200">
              {items.map((i) => (
                <tr key={`${i.id}-${i.weight ?? ""}`}>
                  <td className="px-4 py-2.5 text-ink-900">
                    <span className="font-medium tabular-nums">{i.qty} ×</span> {i.name}
                    {i.weight && <span className="text-ink-600"> ({i.weight})</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right text-ink-600 tabular-nums">{vnd(i.price)}</td>
                  <td className="px-4 py-2.5 text-right text-ink-900 tabular-nums">{vnd(i.price * i.qty)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-mist-50">
              <tr>
                <td className="px-4 py-2.5 text-xs text-ink-600">Thanh toán khi nhận hàng (COD) · chưa gồm phí giao hàng</td>
                <td className="px-4 py-2.5 text-right text-xs text-ink-600">Tổng</td>
                <td className="px-4 py-2.5 text-right font-semibold text-ink-900 tabular-nums">{vnd(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {c.note && (
          <div className="mt-4 rounded-xl bg-mist-50 p-4">
            <p className="text-[11px] font-medium tracking-wider text-ink-400 uppercase">Ghi chú của khách</p>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-ink-900">{c.note}</p>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-mist-200 bg-white p-6">
        <label className="block">
          <span className="text-sm font-medium text-ink-900">Ghi chú nội bộ</span>
          <span className="mt-0.5 block text-xs text-ink-400">Chỉ người dùng Studio thấy. Ví dụ: đã gọi xác nhận, phí ship…, mã vận đơn…</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mt-2 w-full resize-y rounded-lg border border-mist-200 px-3 py-2 text-sm outline-none focus:border-forest-600" />
        </label>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-ink-400">{item.updated_by ? `Cập nhật bởi ${item.updated_by} · ${formatTime(item.updated_at)}` : ""}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                if (!confirm(`Xoá vĩnh viễn đơn #${item.id} của “${c.name}”? Thao tác này không hoàn tác được. Nếu khách huỷ, nên chọn trạng thái Đã huỷ thay vì xoá.`)) return;
                try {
                  await api.deleteOrder(item.id);
                  onDeleted();
                } catch (e) {
                  alert((e as Error).message);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-red-50 hover:text-chili-600"
            >
              <Trash2 className="size-4" /> Xoá
            </button>
            <button
              type="button"
              disabled={saving || note === (item.note ?? "")}
              onClick={async () => {
                setSaving(true);
                try {
                  onSaved((await api.updateOrder(item.id, { note })).order);
                } catch (e) {
                  alert((e as Error).message);
                } finally {
                  setSaving(false);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-40"
            >
              {saving && <Loader2 className="size-4 animate-spin" />} Lưu ghi chú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
