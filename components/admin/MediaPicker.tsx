"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Search, Trash2, Upload, X } from "lucide-react";
import { builtInImages } from "@/lib/cms/library";
import type { MediaItem } from "@/lib/cms/store";
import { api } from "./api";

export type Picked = { src: string; alt?: { vi: string; en: string } };

/** Upload drop zone + grid of uploaded files. Used by the picker and the Media view. */
export function useMedia() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const refresh = useCallback(() => {
    api
      .media()
      .then((r) => setItems(r.items))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(refresh, [refresh]);
  const upload = async (files: File[]) => {
    if (!files.length) return [];
    setUploading(true);
    setError("");
    try {
      const r = await api.upload(files);
      setItems((cur) => [...r.items, ...(cur ?? [])]);
      return r.items;
    } catch (e) {
      setError((e as Error).message);
      return [];
    } finally {
      setUploading(false);
    }
  };
  const remove = async (key: string) => {
    await api.deleteMedia(key);
    setItems((cur) => cur?.filter((i) => i.key !== key) ?? null);
  };
  return { items, error, uploading, upload, remove, refresh };
}

export function DropZone({ onFiles, uploading, compact = false }: { onFiles: (f: File[]) => void; uploading: boolean; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles([...e.dataTransfer.files]);
      }}
      className={`flex items-center justify-center gap-3 rounded-xl border-2 border-dashed text-sm transition ${
        over ? "border-forest-600 bg-sun-400/20" : "border-mist-200 bg-mist-50"
      } ${compact ? "px-4 py-3" : "px-6 py-8"}`}
    >
      {uploading ? <Loader2 className="size-5 animate-spin text-forest-600" /> : <Upload className="size-5 text-ink-400" />}
      <span className="text-ink-600">
        Kéo thả ảnh vào đây hoặc{" "}
        <button type="button" onClick={() => input.current?.click()} className="font-medium text-forest-600 underline-offset-2 hover:underline">
          chọn từ máy
        </button>
        <span className="block text-xs text-ink-400">JPG, PNG, WebP, AVIF, SVG · tối đa 10 MB</span>
      </span>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
        multiple
        className="hidden"
        onChange={(e) => {
          onFiles([...(e.target.files ?? [])]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** Modal for choosing an image: built-in library, uploaded files, or a pasted URL. */
export function MediaPicker({ current, onPick, onClose }: { current?: string; onPick: (p: Picked) => void; onClose: () => void }) {
  const [tab, setTab] = useState<"library" | "uploads">("library");
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");
  const media = useMedia();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const library = builtInImages.filter((i) => !q || i.label.toLowerCase().includes(q) || i.src.includes(q));
  const uploads = (media.items ?? []).filter((i) => !q || i.name.toLowerCase().includes(q));

  const tile = (src: string, label: string, onClick: () => void, extra?: React.ReactNode) => (
    <div key={src} className="group relative">
      <button
        type="button"
        onClick={onClick}
        className={`block w-full overflow-hidden rounded-xl border-2 bg-mist-50 text-left transition hover:border-forest-600 ${
          current === src ? "border-forest-600" : "border-transparent"
        }`}
      >
        <img src={src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
        <span className="block truncate px-2 py-1.5 text-xs text-ink-600">{label}</span>
        {current === src && (
          <span className="absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded-full bg-forest-600 text-white">
            <Check className="size-3.5" />
          </span>
        )}
      </button>
      {extra}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Chọn ảnh" className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-mist-200 px-5 py-3">
          <ImagePlus className="size-5 text-forest-600" />
          <h2 className="text-base font-medium text-ink-900">Chọn ảnh</h2>
          <div className="ml-4 flex rounded-lg bg-mist-100 p-0.5 text-sm">
            {(
              [
                ["library", "Ảnh có sẵn"],
                ["uploads", "Đã tải lên"],
              ] as const
            ).map(([k, label]) => (
              <button key={k} type="button" onClick={() => setTab(k)} className={`rounded-md px-3 py-1 ${tab === k ? "bg-white shadow-sm" : "text-ink-600"}`}>
                {label}
              </button>
            ))}
          </div>
          <label className="relative ml-auto">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm ảnh…" className="w-48 rounded-lg border border-mist-200 py-1.5 pr-3 pl-8 text-sm outline-none focus:border-forest-600" />
          </label>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "uploads" && (
            <div className="mb-5">
              <DropZone
                uploading={media.uploading}
                onFiles={async (files) => {
                  const added = await media.upload(files);
                  if (added.length === 1) onPick({ src: added[0].url });
                }}
              />
              {media.error && <p className="mt-2 text-sm text-chili-600">{media.error}</p>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {tab === "library"
              ? library.map((i) => tile(i.src, i.label, () => onPick({ src: i.src, alt: i.alt })))
              : uploads.map((i) =>
                  tile(
                    i.url,
                    i.name,
                    () => onPick({ src: i.url }),
                    <button
                      type="button"
                      onClick={() => confirm(`Xoá ảnh “${i.name}”? Các chỗ đang dùng ảnh này sẽ bị trống.`) && media.remove(i.key)}
                      aria-label="Xoá ảnh"
                      className="absolute top-2 left-2 hidden rounded-full bg-white/90 p-1.5 text-chili-600 shadow group-hover:block"
                    >
                      <Trash2 className="size-3.5" />
                    </button>,
                  ),
                )}
          </div>
          {tab === "uploads" && media.items && uploads.length === 0 && <p className="py-10 text-center text-sm text-ink-400">Chưa có ảnh nào được tải lên.</p>}
          {tab === "uploads" && !media.items && <Loader2 className="mx-auto my-10 size-6 animate-spin text-ink-400" />}
        </div>

        <form
          className="flex items-center gap-2 border-t border-mist-200 px-5 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (url.trim()) onPick({ src: url.trim() });
          }}
        >
          <span className="text-sm text-ink-600">Hoặc dán đường dẫn ảnh:</span>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… hoặc /images/…" className="flex-1 rounded-lg border border-mist-200 px-3 py-1.5 text-sm outline-none focus:border-forest-600" />
          <button type="submit" className="rounded-lg bg-forest-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-forest-800">
            Dùng ảnh này
          </button>
        </form>
      </div>
    </div>
  );
}
