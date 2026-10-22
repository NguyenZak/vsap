"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { locales } from "@/lib/locales";
import { ExternalLink, Monitor, RotateCw, Smartphone, Tablet } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const devices = [
  { id: "desktop", label: "Máy tính", width: 1440, icon: Monitor },
  { id: "tablet", label: "Máy tính bảng", width: 820, icon: Tablet },
  { id: "mobile", label: "Điện thoại", width: 390, icon: Smartphone },
] as const;

export type PreviewHandle = { reload: () => void; focus: (id: string, scroll: boolean) => void };

type Props = {
  /** Site path without locale, e.g. "/products/cashew". */
  path: string;
  locale: Locale;
  onLocale: (l: Locale) => void;
  onSelect?: (sectionId: string) => void;
  activeSection?: string;
};

/**
 * The real page in an iframe, rendering the draft (?__preview=1). Desktop width is
 * scaled down to fit the panel so editors see the true layout, not a squeezed one.
 */
export const Preview = forwardRef<PreviewHandle, Props>(function Preview({ path, locale, onLocale, onSelect, activeSection }, ref) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<(typeof devices)[number]["id"]>("desktop");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [loading, setLoading] = useState(true);
  const ready = useRef(false);
  const active = useRef(activeSection);
  active.current = activeSection;

  // The preview flag must go in the query string, before any #anchor.
  const [pathOnly, hash = ""] = path.split("#");
  const src = `/${locale}${pathOnly === "/" ? "" : pathOnly}${pathOnly.includes("?") ? "&" : "?"}__preview=1${hash ? `#${hash}` : ""}`;
  const post = (msg: Record<string, unknown>) => frame.current?.contentWindow?.postMessage({ source: "vsap-editor", ...msg }, window.location.origin);

  useImperativeHandle(ref, () => ({
    reload() {
      setLoading(true);
      ready.current = false;
      frame.current?.contentWindow?.location.reload();
    },
    focus(id, scroll) {
      post({ type: "focus", id, scroll });
    },
  }));

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.source !== "vsap-preview") return;
      if (e.data.type === "ready") {
        ready.current = true;
        setLoading(false);
        if (active.current) post({ type: "focus", id: active.current, scroll: false });
      }
      if (e.data.type === "select" && onSelect) onSelect(String(e.data.id));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onSelect]);

  const width = devices.find((d) => d.id === device)!.width;
  const scale = size.w ? Math.min(1, (size.w - 32) / width) : 1;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-mist-100">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-mist-200 bg-white px-3">
        <div className="flex rounded-lg bg-mist-100 p-0.5">
          {locales.map((l) => (
            <button key={l} type="button" onClick={() => onLocale(l)} className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase ${locale === l ? "bg-white shadow-sm" : "text-ink-600"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg bg-mist-100 p-0.5">
          {devices.map((d) => (
            <button key={d.id} type="button" title={d.label} onClick={() => setDevice(d.id)} className={`rounded-md p-1.5 ${device === d.id ? "bg-white shadow-sm" : "text-ink-600"}`}>
              <d.icon className="size-4" />
            </button>
          ))}
        </div>
        <p className="ml-1 truncate font-mono text-xs text-ink-400">
          /{locale}
          {path === "/" ? "" : path}
        </p>
        <div className="ml-auto flex items-center gap-1">
          {loading && <span className="mr-1 text-xs text-ink-400">Đang tải…</span>}
          <button
            type="button"
            title="Tải lại"
            onClick={() => {
              setLoading(true);
              frame.current?.contentWindow?.location.reload();
            }}
            className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100"
          >
            <RotateCw className="size-4" />
          </button>
          <a href={src} target="_blank" rel="noreferrer" title="Mở bản nháp trong tab mới" className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100">
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
      <div ref={box} className="relative min-h-0 flex-1 overflow-hidden">
        {size.w > 0 && (
          <div
            className="absolute top-4 left-1/2 origin-top overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5"
            style={{ width, height: (size.h - 32) / scale, transform: `translateX(-50%) scale(${scale})` }}
          >
            <iframe ref={frame} key={src} src={src} title="Xem trước" className="size-full" onLoad={() => setLoading(false)} />
          </div>
        )}
      </div>
    </div>
  );
});
