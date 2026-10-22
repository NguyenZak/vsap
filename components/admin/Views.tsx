"use client";

import { useEffect, useState } from "react";
import { Check, Copy, History, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { api, formatTime, type Revision } from "./api";
import { DropZone, useMedia } from "./MediaPicker";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/** Uploaded files: drop to upload, copy a link, delete. */
export function MediaView({ canDelete }: { canDelete: boolean }) {
  const media = useMedia();
  const [copied, setCopied] = useState("");
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-xl font-medium text-ink-900">Thư viện ảnh</h2>
        <p className="mt-1 text-sm text-ink-600">Ảnh tải lên được lưu trên Cloudflare R2 và dùng được ở mọi trường ảnh trong CMS.</p>
        <div className="mt-5">
          <DropZone uploading={media.uploading} onFiles={media.upload} />
          {media.error && <p className="mt-2 text-sm text-chili-600">{media.error}</p>}
        </div>
        {!media.items ? (
          <Loader2 className="mx-auto mt-16 size-6 animate-spin text-ink-400" />
        ) : media.items.length === 0 ? (
          <p className="mt-16 text-center text-sm text-ink-400">Chưa có ảnh nào được tải lên.</p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {media.items.map((m) => (
              <li key={m.key} className="group overflow-hidden rounded-xl border border-mist-200">
                <img src={m.url} alt="" loading="lazy" className="aspect-[4/3] w-full bg-mist-50 object-cover" />
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-ink-900" title={m.name}>
                    {m.name}
                  </p>
                  <p className="text-[11px] text-ink-400">
                    {kb(m.size)} · {formatTime(m.created_at)}
                  </p>
                  <div className="mt-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(m.url);
                        setCopied(m.key);
                        setTimeout(() => setCopied(""), 1500);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-mist-100 py-1 text-xs text-ink-900 hover:bg-mist-200"
                    >
                      {copied === m.key ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied === m.key ? "Đã chép" : "Chép link"}
                    </button>
                    {canDelete && (
                      <button
                        type="button"
                        title="Xoá"
                        onClick={() => confirm(`Xoá ảnh “${m.name}”? Các chỗ đang dùng ảnh này sẽ bị trống.`) && media.remove(m.key)}
                        className="rounded-md px-2 text-ink-400 hover:bg-red-50 hover:text-chili-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Published versions; restoring one loads it into the draft for review. */
export function HistoryView({ onRestored, canRestore }: { onRestored: () => void; canRestore: boolean }) {
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  useEffect(() => {
    api
      .revisions()
      .then((r) => setRevisions(r.revisions))
      .catch((e: Error) => setError(e.message));
  }, []);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-medium text-ink-900">Lịch sử xuất bản</h2>
        <p className="mt-1 text-sm text-ink-600">
          Mỗi lần xuất bản được lưu lại (50 bản gần nhất). Khôi phục sẽ nạp phiên bản đó vào bản nháp để bạn xem lại, rồi bấm Xuất bản nếu muốn dùng.
        </p>
        {error && <p className="mt-4 text-sm text-chili-600">{error}</p>}
        {!revisions && !error && <Loader2 className="mx-auto mt-16 size-6 animate-spin text-ink-400" />}
        {revisions?.length === 0 && <p className="mt-16 text-center text-sm text-ink-400">Chưa có lần xuất bản nào.</p>}
        <ol className="mt-6 divide-y divide-mist-200 rounded-xl border border-mist-200">
          {revisions?.map((r, i) => (
            <li key={r.id} className="flex items-center gap-4 px-4 py-3">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-mist-100 text-ink-600">
                <History className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-900">
                  {formatTime(r.created_at)} {i === 0 && <span className="ml-1 rounded-full bg-sun-400 px-2 py-0.5 text-[11px] font-medium text-forest-950">Đang chạy</span>}
                </p>
                <p className="truncate text-xs text-ink-400">
                  {r.author && <span className="text-ink-600">{r.author} · </span>}
                  {r.note || "Không có ghi chú"}
                </p>
              </div>
              {canRestore && (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={async () => {
                    if (!confirm("Nạp phiên bản này vào bản nháp? Bản nháp hiện tại sẽ bị thay thế.")) return;
                    setBusy(r.id);
                    try {
                      await api.restore(r.id);
                      onRestored();
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(null);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-mist-200 px-3 py-1.5 text-sm text-ink-900 hover:bg-mist-50 disabled:opacity-50"
                >
                  {busy === r.id ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />} Khôi phục
                </button>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
