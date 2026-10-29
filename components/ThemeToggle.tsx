"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

/** localStorage key for the visitor's choice; absent = follow the device. */
export const THEME_KEY = "vsap-theme";

/**
 * Runs in <head> before first paint (see [locale]/layout.tsx), so a dark page never
 * flashes light. Kept as a string because it must not wait for React.
 */
export const themeBootScript = `(function(){try{var s=localStorage.getItem("${THEME_KEY}");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

/**
 * Light/dark switch for the header. Which icon and label show is decided by CSS
 * from the <html> class the boot script set, so server and client render the same.
 */
export function ThemeToggle({ labels }: { labels: { dark: string; light: string } }) {
  // Follow the device's setting live until the visitor picks one here.
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      try {
        if (localStorage.getItem(THEME_KEY)) return;
      } catch {}
      document.documentElement.classList.toggle("dark", media.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 group-data-solid/header:border-mist-200 group-data-solid/header:bg-mist-50 group-data-solid/header:text-ink-900 group-data-solid/header:hover:bg-surface"
    >
      <Moon aria-hidden="true" className="size-[18px] dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-[18px] dark:block" />
      <span className="sr-only dark:hidden">{labels.dark}</span>
      <span className="sr-only hidden dark:inline">{labels.light}</span>
    </button>
  );
}
