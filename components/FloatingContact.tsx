"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import type { UiStrings } from "@/lib/cms/types";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Zalo / WhatsApp / call buttons pinned to the bottom-right corner on every page. */
type Links = { zalo: string; whatsapp: string; phone: string; phoneE164: string };

export function FloatingContact({ t, links: site }: { t: UiStrings["chat"]; links: Links }) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Close the phone menu on Escape or a tap anywhere else.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-fab]",
          { autoAlpha: 0, scale: 0.4, y: 16 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(2)", delay: 1.2 },
        );
      });
    },
    { scope: root },
  );

  const items = [
    { href: site.zalo, label: t.zalo, className: "bg-white ring-1 ring-black/5", ping: "bg-[#0068ff]", icon: <ZaloIcon /> },
    { href: site.whatsapp, label: t.whatsapp, className: "bg-[#25d366]", icon: <WhatsAppIcon /> },
    { href: site.phoneE164 ? `tel:${site.phoneE164}` : "", label: `${t.call} ${site.phone}`, className: "bg-forest-900", icon: <Phone className="size-5" /> },
  ].filter((item) => item.href);

  return (
    <div
      ref={root}
      role="complementary"
      aria-label={t.label}
      className="fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6"
    >
      {/* On phones the buttons sit behind one toggle so they don't cover the page; from sm up they're always shown. */}
      <ul id="floating-contact" className={`flex-col items-end gap-3 ${open ? "flex" : "hidden"} sm:flex`}>
        {items.map((item) => (
          <li key={item.label}>
            <a
              data-fab
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              onClick={() => setOpen(false)}
              className="group relative flex items-center"
            >
              {/* Label: always visible in the opened phone menu, slides out on hover / keyboard focus on larger screens. */}
              <span
                className={`pointer-events-none absolute right-full mr-3 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-lg transition sm:translate-x-2 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-x-0 sm:group-focus-visible:opacity-100`}
              >
                {item.label}
              </span>
              <span
                className={`relative inline-flex size-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 transition group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-forest-600 ${item.className}`}
              >
                {item.ping && <span aria-hidden="true" className={`absolute inset-0 rounded-full opacity-30 motion-safe:animate-ping ${item.ping}`} />}
                <span className="relative">{item.icon}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        data-fab
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="floating-contact"
        aria-label={open ? t.close : t.label}
        className="relative inline-flex size-12 items-center justify-center rounded-full bg-forest-900 text-lime-300 shadow-lg shadow-black/20 transition active:scale-95 sm:hidden"
      >
        {!open && <span aria-hidden="true" className="absolute inset-0 rounded-full bg-forest-900 opacity-30 motion-safe:animate-ping" />}
        {open ? <X className="relative size-5" /> : <MessageCircle className="relative size-5" />}
      </button>
    </div>
  );
}

/** Official Zalo app icon (public/images/zalo.png, 96×96 — sharp at 2× inside the 48px button). */
function ZaloIcon() {
  return <img src="/images/zalo.png" alt="" width={48} height={48} className="size-10" />;
}

// WhatsApp mark from Simple Icons (CC0-1.0), https://simpleicons.org.

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="#fff" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
