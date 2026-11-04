"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Eye, EyeOff, Loader2, Type } from "lucide-react";
import { api, type Visibility } from "./api";

const formatTime = (ms: number) => new Date(ms).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });

const options = [
  {
    value: true,
    icon: Eye,
    title: "Công khai",
    body: "Ai cũng xem được toàn bộ website.",
  },
  {
    value: false,
    icon: EyeOff,
    title: "Không công khai",
    body: "Khách chỉ thấy trang Sắp ra mắt. Tài khoản Studio đã đăng nhập vẫn xem được toàn bộ website. Form đặt hàng và báo giá tạm đóng.",
  },
];

/** Studio › Cài đặt: open the website to everyone, or show visitors "Coming soon". Takes effect at once. */
export function SiteVisibility({ onChange, onEditText }: { onChange?: (v: Visibility) => void; onEditText?: () => void }) {
  const [state, setState] = useState<Visibility | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .visibility()
      .then(setState)
      .catch((e: Error) => setError(e.message));
  }, []);

  const choose = async (isPublic: boolean) => {
    if (!state || state.public === isPublic || busy) return;
    const question = isPublic
      ? "Công khai website? Mọi người sẽ xem được toàn bộ website ngay lập tức."
      : "Ẩn website? Khách sẽ chỉ thấy trang Sắp ra mắt ngay lập tức, form đặt hàng và báo giá tạm đóng.";
    if (!confirm(question)) return;
    setBusy(true);
    setError("");
    try {
      const next = await api.setVisibility(isPublic);
      setState(next);
      onChange?.(next);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-mist-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-ink-900">Hiển thị website</h3>
          <p className="mt-1 text-sm text-ink-600">Có hiệu lực ngay, không cần bấm Xuất bản. Xuất bản hay khôi phục phiên bản cũ không làm đổi lựa chọn này.</p>
        </div>
        {state && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${state.public ? "bg-sun-400 text-forest-950" : "bg-chili-600 text-white"}`}>
            {state.public ? "Đang công khai" : "Đang ẩn"}
          </span>
        )}
      </div>

      {!state && !error && <Loader2 className="mx-auto my-8 size-6 animate-spin text-ink-400" />}
      {state && (
        <div role="radiogroup" aria-label="Hiển thị website" className="mt-5 grid gap-3 sm:grid-cols-2">
          {options.map((o) => {
            const active = state.public === o.value;
            return (
              <button
                key={String(o.value)}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={busy}
                onClick={() => choose(o.value)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition disabled:opacity-60 ${active ? "border-forest-600 bg-sun-400/15 ring-1 ring-forest-600" : "border-mist-200 hover:bg-mist-50"}`}
              >
                <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${active ? "bg-forest-900 text-sun-400" : "bg-mist-100 text-ink-600"}`}>
                  {busy && !active ? <Loader2 className="size-4 animate-spin" /> : <o.icon className="size-4" />}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink-900">{o.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-600">{o.body}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {state?.updatedAt && (
        <p className="mt-3 text-xs text-ink-400">
          Đổi lần cuối: {formatTime(state.updatedAt)}
          {state.updatedBy && <> · {state.updatedBy}</>}
        </p>
      )}
      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-chili-600">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-mist-200 pt-4">
        <a
          href="/coming-soon/vi"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-mist-200 px-3 py-1.5 text-sm text-ink-900 hover:bg-mist-50"
        >
          <ExternalLink className="size-4" /> Xem trang Sắp ra mắt
        </a>
        {onEditText && (
          <button type="button" onClick={onEditText} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-600 hover:bg-mist-100">
            <Type className="size-4" /> Sửa chữ (Chữ giao diện › Trang Sắp ra mắt)
          </button>
        )}
      </div>
    </section>
  );
}
