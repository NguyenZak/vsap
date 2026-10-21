"use client";

import { useEffect } from "react";

/**
 * Runs inside the admin's preview iframe. Outlines sections on hover, tells the
 * editor which one was clicked, scrolls to the one the editor selects, and keeps
 * the scroll position across the reloads that follow each save.
 */
export function PreviewBridge() {
  useEffect(() => {
    if (window.parent === window) return;
    const post = (msg: Record<string, unknown>) => window.parent.postMessage({ source: "vsap-preview", ...msg }, window.location.origin);

    const key = `vsap-preview-scroll:${location.pathname}`;
    const saved = Number(sessionStorage.getItem(key));
    if (saved) requestAnimationFrame(() => window.scrollTo(0, saved));
    let t: number | undefined;
    const onScroll = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => sessionStorage.setItem(key, String(window.scrollY)), 120);
    };

    const sectionOf = (el: EventTarget | null) => (el instanceof Element ? el.closest<HTMLElement>("[data-cms-section]") : null);
    const onClick = (e: MouseEvent) => {
      const s = sectionOf(e.target);
      if (!s) return;
      // Inside the editor, clicks select sections instead of navigating away.
      if ((e.target as Element).closest("a")) e.preventDefault();
      post({ type: "select", id: s.dataset.cmsSection });
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.source !== "vsap-editor") return;
      if (e.data.type === "focus") {
        document.querySelectorAll("[data-cms-active]").forEach((el) => el.removeAttribute("data-cms-active"));
        const el = document.querySelector<HTMLElement>(`[data-cms-section="${CSS.escape(String(e.data.id))}"]`);
        if (!el) return;
        el.setAttribute("data-cms-active", "");
        if (e.data.scroll) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    document.documentElement.setAttribute("data-cms-preview", "");
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    window.addEventListener("message", onMessage);
    post({ type: "ready", path: location.pathname });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <style>{`
      [data-cms-preview] [data-cms-section] { position: relative; cursor: pointer; }
      [data-cms-preview] [data-cms-section]::after {
        content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 35;
        outline: 2px solid transparent; outline-offset: -2px; transition: outline-color .15s, background-color .15s;
      }
      [data-cms-preview] [data-cms-section]:hover::after { outline-color: rgb(47 138 53 / .55); background: rgb(214 242 92 / .06); }
      [data-cms-preview] [data-cms-section][data-cms-active]::after { outline: 3px solid #2f8a35; }
    `}</style>
  );
}
