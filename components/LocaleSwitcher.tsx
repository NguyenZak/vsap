"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

/** Sits inside the header's `group/header`, so it follows the header's solid state. */
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  // Swap only the leading locale segment so the visitor stays on the same page.
  const hrefFor = (target: Locale) => pathname.replace(/^\/[^/]+/, `/${target}`) || `/${target}`;

  return (
    <div className="flex items-center rounded-full border border-white/25 bg-white/10 p-0.5 text-xs font-medium backdrop-blur-md group-data-solid/header:border-mist-200 group-data-solid/header:bg-mist-50">
      {locales.map((l) => (
        <Link
          key={l}
          href={hrefFor(l)}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          className="rounded-full px-2.5 py-1.5 uppercase text-white/80 transition hover:text-white group-data-solid/header:text-ink-600 aria-[current=true]:bg-white aria-[current=true]:text-ink-900 group-data-solid/header:aria-[current=true]:text-ink-900"
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
