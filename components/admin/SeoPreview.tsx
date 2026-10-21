"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
  /** Full URL shown under the title, e.g. https://vsap.com.vn/vi/products/cashew */
  url: string;
  image?: string;
  siteName: string;
  noindex?: boolean;
};

/** Advice ranges Google tends to display without cutting text off. */
const LIMITS = { title: [30, 60], description: [70, 160] } as const;

function Meter({ label, value, range }: { label: string; value: string; range: readonly [number, number] }) {
  const n = [...value].length;
  const ok = n >= range[0] && n <= range[1];
  const pct = Math.min(100, (n / range[1]) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-ink-600">{label}</span>
        <span className={ok ? "text-forest-600" : n === 0 ? "text-chili-600" : "text-sun-500"}>
          {n} / {range[0]}–{range[1]} ký tự
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-mist-100">
        <div className={`h-full rounded-full ${ok ? "bg-forest-600" : n === 0 ? "bg-chili-600" : "bg-sun-500"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Google result + social card previews with length checks, shown above SEO fields. */
export function SeoPreview({ title, description, url, image, siteName, noindex }: Props) {
  const issues: string[] = [];
  if (!title) issues.push("Chưa có tiêu đề: Google sẽ tự lấy chữ trên trang.");
  if (!description) issues.push("Chưa có mô tả: Google sẽ tự trích một đoạn trên trang.");
  if (!image) issues.push("Chưa có ảnh chia sẻ: link gửi qua Facebook/Zalo sẽ không có ảnh.");
  if (noindex) issues.push("Trang đang bị ẩn khỏi Google (noindex).");
  const short = (s: string, n: number) => ([...s].length > n ? `${[...s].slice(0, n - 1).join("")}…` : s);
  const host = url.replace(/^https?:\/\//, "");

  return (
    <div className="mb-6 space-y-4">
      <div className="rounded-xl border border-mist-200 bg-white p-4">
        <p className="mb-2 text-[11px] font-medium tracking-wider text-ink-400 uppercase">Xem trước trên Google</p>
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="" className="size-6 rounded-full border border-mist-200 bg-white p-0.5" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs text-ink-900">{siteName}</p>
            <p className="truncate text-[11px] text-ink-600">{host}</p>
          </div>
        </div>
        <p className="mt-2 text-lg leading-snug text-[#1a0dab]">{short(title || siteName, 62)}</p>
        <p className="mt-1 text-[13px] leading-snug text-[#4d5156]">{short(description || "—", 160)}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
        <p className="px-4 pt-3 text-[11px] font-medium tracking-wider text-ink-400 uppercase">Khi chia sẻ (Facebook, Zalo…)</p>
        <div className="m-3 overflow-hidden rounded-lg border border-mist-200">
          {image ? <img src={image} alt="" className="aspect-[1.91/1] w-full object-cover" /> : <div className="flex aspect-[1.91/1] items-center justify-center bg-mist-100 text-xs text-ink-400">Không có ảnh</div>}
          <div className="bg-mist-50 px-3 py-2">
            <p className="truncate text-[11px] text-ink-400 uppercase">{host.split("/")[0]}</p>
            <p className="truncate text-sm font-medium text-ink-900">{title || siteName}</p>
            <p className="line-clamp-1 text-xs text-ink-600">{description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <Meter label="Độ dài tiêu đề" value={title} range={LIMITS.title} />
        <Meter label="Độ dài mô tả" value={description} range={LIMITS.description} />
      </div>

      {issues.length > 0 ? (
        <ul className="space-y-1.5">
          {issues.map((i) => (
            <li key={i} className="flex gap-2 text-xs text-ink-900">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-sun-500" />
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 text-xs text-forest-600">
          <CheckCircle2 className="size-3.5" /> Đầy đủ thông tin SEO.
        </p>
      )}
    </div>
  );
}
