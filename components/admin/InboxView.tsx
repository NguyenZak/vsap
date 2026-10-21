"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BellRing, Building2, Download, Globe2, Inbox, Loader2, Mail, MessageCircle, Package, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { inquiryStatuses, inquiryStatusInfo, type Inquiry, type InquiryStatus } from "@/lib/cms/inquiry-format";
import { api, formatTime, type TelegramStatus } from "./api";

const productLabel: Record<string, string> = { cashew: "Hạt điều", macadamia: "Hạt macca", other: "Khác" };

const statusTone: Record<InquiryStatus, string> = {
  new: "bg-lime-300 text-forest-950",
  processing: "bg-sun-500/15 text-ink-900",
  done: "bg-mist-100 text-ink-600",
  spam: "bg-red-50 text-chili-600",
};

function StatusPill({ status }: { status: InquiryStatus }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone[status]}`}>{inquiryStatusInfo[status].label}</span>;
}

const digits = (s = "") => s.replace(/[^\d]/g, "");

/** Quote requests from the website: triage by status, reply, keep internal notes, export to CSV. */
/** `onConfigure`: open Studio › Cài đặt (admins only). */
export function InboxView({ onCounts, onConfigure }: { onCounts?: (c: Record<InquiryStatus, number>) => void; onConfigure?: () => void }) {
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Inquiry[] | null>(null);
  const [counts, setCounts] = useState<Record<InquiryStatus, number> | null>(null);
  // A Telegram alert links to /admin?view=inbox&id=… to open that request directly.
  const [selected, setSelected] = useState<number | null>(() => (typeof window === "undefined" ? null : Number(new URLSearchParams(location.search).get("id")) || null));
  const [telegram, setTelegram] = useState<TelegramStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedRef = useRef<number | null>(null);
  selectedRef.current = selected;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.inquiries({ status: status || undefined, q: query || undefined });
      // Keep the open request listed while it is being read, even if it no longer matches the filter.
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
    if (onConfigure) api.telegram().then(setTelegram).catch(() => {});
  }, [onConfigure]);

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
  const replace = (next: Inquiry) => setItems((cur) => cur?.map((i) => (i.id === next.id ? next : i)) ?? null);

  // Updated in place (no reload), so the open request stays on screen even if it no longer matches the tab.
  const setItemStatus = async (item: Inquiry, s: InquiryStatus) => {
    if (item.status === s) return;
    replace({ ...item, status: s });
    try {
      replace((await api.updateInquiry(item.id, { status: s })).inquiry);
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

  const open = (item: Inquiry) => {
    setSelected(item.id);
    // Opening a new request means someone is on it.
    if (item.status === "new") setItemStatus(item, "processing");
  };

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const tabs: { value: InquiryStatus | ""; label: string; n: number }[] = [
    { value: "", label: "Tất cả", n: total },
    ...inquiryStatuses.map((s) => ({ value: s, label: inquiryStatusInfo[s].label, n: counts?.[s] ?? 0 })),
  ];

  return (
    <>
      <aside className="flex w-[26rem] shrink-0 flex-col border-r border-mist-200 bg-white">
        <div className="border-b border-mist-200 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-medium text-ink-900">Yêu cầu báo giá</h2>
              <p className="mt-0.5 text-xs leading-snug text-ink-600">Gửi từ form trên website. Mở một yêu cầu mới sẽ chuyển nó sang “Đang xử lý”.</p>
            </div>
            <div className="flex shrink-0 gap-1">
              {onConfigure && (
                <button
                  type="button"
                  title={telegram?.chat ? `Đang báo về Telegram: ${telegram.chat.title}` : "Cài đặt thông báo Telegram"}
                  onClick={onConfigure}
                  className="relative inline-flex items-center gap-1 rounded-lg border border-mist-200 px-2 py-1.5 text-xs text-ink-900 hover:bg-mist-50"
                >
                  <BellRing className="size-3.5" /> Telegram
                  <span className={`size-1.5 rounded-full ${telegram?.chat && telegram.tokenSource ? "bg-forest-600" : "bg-mist-200"}`} aria-hidden="true" />
                </button>
              )}
              <button type="button" title="Tải lại" onClick={load} className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100">
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <a href={api.inquiriesCsvUrl({ status: status || undefined, q: query || undefined })} title="Xuất CSV (mở bằng Excel)" className="inline-flex items-center gap-1 rounded-lg border border-mist-200 px-2 py-1.5 text-xs text-ink-900 hover:bg-mist-50">
                <Download className="size-3.5" /> CSV
              </a>
            </div>
          </div>
          <label className="relative mt-3 block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên, công ty, email, nội dung…" className="w-full rounded-lg border border-mist-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-forest-600" />
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
              <Inbox className="mx-auto mb-2 size-7" />
              {query || status ? "Không có yêu cầu nào khớp bộ lọc." : "Chưa có yêu cầu nào. Yêu cầu gửi từ form Liên hệ và trang sản phẩm sẽ hiện ở đây."}
            </li>
          )}
          {items?.map((i) => (
            <li key={i.id} className="border-b border-mist-200">
              <button type="button" onClick={() => open(i)} className={`block w-full px-4 py-3 text-left transition ${selected === i.id ? "bg-lime-300/15" : "hover:bg-mist-50"}`}>
                <span className="flex items-center gap-2">
                  {i.status === "new" && <span className="size-2 shrink-0 rounded-full bg-forest-600" aria-label="Mới" />}
                  <span className={`min-w-0 flex-1 truncate text-sm ${i.status === "new" ? "font-semibold text-ink-900" : "text-ink-900"}`}>
                    {i.data.name}
                    {i.data.company && <span className="font-normal text-ink-600"> · {i.data.company}</span>}
                  </span>
                  <span className="shrink-0 text-[11px] text-ink-400">{formatTime(i.created_at)}</span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <StatusPill status={i.status} />
                  {i.data.product && <span className="text-[11px] text-ink-600">{productLabel[i.data.product] ?? i.data.product}</span>}
                  <span className="min-w-0 flex-1 truncate text-xs text-ink-400">{i.data.message}</span>
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
              <Mail className="mx-auto mb-2 size-8" />
              Chọn một yêu cầu bên trái để xem chi tiết.
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Detail({ item, onStatus, onSaved, onDeleted }: { item: Inquiry; onStatus: (s: InquiryStatus) => void; onSaved: (i: Inquiry) => void; onDeleted: () => void }) {
  const [note, setNote] = useState(item.note ?? "");
  const [saving, setSaving] = useState(false);
  const d = item.data;
  const subject = `VSAP – ${d.product ? `${productLabel[d.product] ?? d.product} – ` : ""}${item.locale === "en" ? "Quotation" : "Báo giá"}`;
  const quote = `\n\n---\n${d.name} (${formatTime(item.created_at)}):\n${d.message}`;
  const mailto = `mailto:${d.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(quote)}`;

  const rows: [typeof Mail, string, React.ReactNode][] = [
    [Mail, "Email", <a key="e" href={`mailto:${d.email}`} className="text-forest-600 hover:underline">{d.email}</a>],
    [Phone, "Điện thoại", d.phone ? <a key="p" href={`tel:${d.phone}`} className="text-forest-600 hover:underline">{d.phone}</a> : "—"],
    [Building2, "Công ty", d.company || "—"],
    [Globe2, "Quốc gia", [d.country, item.country && `IP: ${item.country}`].filter(Boolean).join(" · ") || "—"],
    [Package, "Sản phẩm", [d.product && (productLabel[d.product] ?? d.product), d.quantity].filter(Boolean).join(" · ") || "—"],
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
            <h2 className="mt-1 text-xl font-medium text-ink-900">{d.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={mailto} className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-3 py-2 text-sm font-medium text-white hover:bg-forest-800">
              <Mail className="size-4" /> Trả lời email
            </a>
            {d.phone && digits(d.phone).length >= 8 && (
              <a href={`https://wa.me/${digits(d.phone)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-mist-200 px-3 py-2 text-sm text-ink-900 hover:bg-mist-50">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-ink-600">Trạng thái:</span>
          {inquiryStatuses.map((s) => (
            <button key={s} type="button" onClick={() => onStatus(s)} className={`rounded-full px-3 py-1 text-xs transition ${item.status === s ? statusTone[s] + " ring-2 ring-forest-900/10" : "bg-mist-50 text-ink-600 hover:bg-mist-100"}`}>
              {inquiryStatusInfo[s].label}
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

        <div className="mt-6 rounded-xl bg-mist-50 p-4">
          <p className="text-[11px] font-medium tracking-wider text-ink-400 uppercase">Nội dung</p>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-ink-900">{d.message}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-mist-200 bg-white p-6">
        <label className="block">
          <span className="text-sm font-medium text-ink-900">Ghi chú nội bộ</span>
          <span className="mt-0.5 block text-xs text-ink-400">Chỉ người dùng Studio thấy. Ví dụ: đã gửi báo giá ngày…, giá chào…</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mt-2 w-full resize-y rounded-lg border border-mist-200 px-3 py-2 text-sm outline-none focus:border-forest-600" />
        </label>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-ink-400">{item.updated_by ? `Cập nhật bởi ${item.updated_by} · ${formatTime(item.updated_at)}` : ""}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                if (!confirm(`Xoá vĩnh viễn yêu cầu của “${d.name}”? Thao tác này không hoàn tác được. Nếu là tin rác, nên chọn trạng thái Spam thay vì xoá.`)) return;
                try {
                  await api.deleteInquiry(item.id);
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
                  onSaved((await api.updateInquiry(item.id, { note })).inquiry);
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
