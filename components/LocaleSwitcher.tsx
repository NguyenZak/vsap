"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALE_COOKIE, localeInfo, locales, type Locale } from "@/lib/locales";

/** Each language is named in itself, so visitors can find theirs whatever page they are on. */
const names = Object.fromEntries(locales.map((l) => [l, localeInfo[l].name])) as Record<Locale, string>;
const label = Object.fromEntries(locales.map((l) => [l, localeInfo[l].choose])) as Record<Locale, string>;

/**
 * Language dropdown. Sits inside the header's `group/header`, so the button
 * follows the header's transparent / solid state; the menu is always a white card.
 */
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // Swap only the leading locale segment so the visitor stays on the same page.
  const hrefFor = (target: Locale) => pathname.replace(/^\/[^/]+/, `/${target}`) || `/${target}`;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="locale-menu"
        aria-label={`${label[locale]}: ${names[locale]}`}
        className="flex h-9 items-center gap-1 rounded-full border border-white/25 bg-white/10 pr-2 pl-2.5 text-xs font-medium text-white uppercase backdrop-blur-md transition hover:bg-white/20 group-data-solid/header:border-mist-200 group-data-solid/header:bg-mist-50 group-data-solid/header:text-ink-900 group-data-solid/header:hover:bg-white"
      >
        <Globe className="size-3.5 opacity-80" aria-hidden="true" />
        {locale}
        <ChevronDown className={`size-3.5 opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      <ul
        id="locale-menu"
        aria-label={label[locale]}
        inert={!open}
        className={`absolute top-full right-0 z-50 mt-2 w-40 origin-top-right rounded-2xl border border-mist-200 bg-white p-1.5 shadow-xl shadow-black/10 transition duration-200 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={hrefFor(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              onClick={() => {
                // Remember the choice for later visits to "/" (proxy.ts prefers it over the device language).
                document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
                setOpen(false);
              }}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-900 transition hover:bg-mist-50 aria-[current=true]:font-medium aria-[current=true]:text-forest-600"
            >
              <span>
                {names[l]}
                <span className="ml-1.5 text-[11px] text-ink-400 uppercase">{l}</span>
              </span>
              {l === locale && <Check className="size-4" aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
