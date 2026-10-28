"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, ChevronDown, House, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import type { NavItem } from "@/lib/cms/menu";
import type { UiStrings } from "@/lib/cms/types";
import type { Locale } from "@/lib/i18n";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CartButton } from "./shop/CartButton";

type Props = {
  locale: Locale;
  nav: UiStrings["nav"];
  /** Studio › Menu, resolved for this language (lib/cms/menu.ts). */
  items: NavItem[];
  /** Theme › menu type and colours as CSS variables (lib/cms/theme.ts). */
  menuStyle?: CSSProperties;
  contact: { phone: string; phoneE164: string; email: string };
  logoAlt: string;
};

export function Header({ locale, nav, items: links, menuStyle, contact: site, logoAlt }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // True from the moment the menu opens until its close animation has finished,
  // so the header keeps its solid background while the panel folds away.
  const [menuShown, setMenuShown] = useState(false);
  // Desktop nav link under the pointer, for the sliding hover pill.
  const [hovered, setHovered] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => setOpen(false), [pathname]);

  // One timeline for the whole mobile menu, played forward to open and reversed
  // (a bit faster) to close: burger lines fold into an X, the panel drops like a
  // curtain, links rise out of their masks one by one, then the footer fades in.
  useGSAP(
    () => {
      const instant = prefersReducedMotion();
      menu.current = gsap
        .timeline({
          paused: true,
          defaults: { duration: instant ? 0 : 0.6, ease: "power3.inOut" },
          onReverseComplete: () => setMenuShown(false),
        })
        .to("[data-burger-top]", { y: 7, rotate: 45, duration: instant ? 0 : 0.4 }, 0)
        .to("[data-burger-bottom]", { y: -7, rotate: -45, duration: instant ? 0 : 0.4 }, 0)
        .to("[data-burger-mid]", { scaleX: 0, autoAlpha: 0, duration: instant ? 0 : 0.25 }, 0)
        .set("#mobile-nav", { visibility: "visible" }, 0)
        .fromTo("#mobile-nav", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: instant ? 0 : 0.7, ease: "power4.inOut" }, 0)
        .fromTo("[data-menu-link]", { yPercent: 110 }, { yPercent: 0, stagger: instant ? 0 : 0.06, ease: "power4.out" }, instant ? 0 : 0.3)
        .fromTo("[data-menu-fade]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: instant ? 0 : 0.07, duration: instant ? 0 : 0.5, ease: "power3.out" }, instant ? 0 : 0.5);
    },
    { scope: root },
  );

  useEffect(() => {
    const tl = menu.current;
    if (!tl) return;
    if (open) {
      setMenuShown(true);
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.6).reverse();
    }

    // Lock page scroll behind the open menu; Esc or growing past the mobile layout closes it.
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    // The panel only becomes visible on the timeline's first tick, so focus just after it.
    const focusFirst = gsap.delayedCall(0.05, () =>
      document.querySelector<HTMLElement>("#mobile-nav a")?.focus({ preventScroll: true }),
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      focusFirst.kill();
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Every page opens on a photo hero, so the header floats over it in white
  // and switches to a solid light bar once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const solid = scrolled || open || menuShown;

  return (
    <header
      ref={root}
      style={menuStyle}
      data-solid={solid || undefined}
      className={`group/header fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "bg-white/90 shadow-sm shadow-black/5 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-18 items-center justify-between gap-4 lg:h-22">
        <Link href={`/${locale}`} className="-ml-2 shrink-0" aria-label="VSAP">
          <img
            src={solid ? "/logo.svg" : "/logo-light.svg"}
            alt={logoAlt}
            width={136}
            height={68}
            className="h-10 w-auto sm:h-12 lg:h-14"
          />
        </Link>

        <nav
          aria-label="Main"
          onPointerLeave={() => setHovered(null)}
          className="hidden items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md group-data-solid/header:border-mist-200 group-data-solid/header:bg-mist-50 lg:flex"
        >
          {links.map((l, i) => {
            const active = isActive(l.href) || l.children.some((c) => isActive(c.href));
            const key = `${i}-${l.href}`;
            return (
              // Long labels can be kept to wide screens (they stay in the mobile menu).
              <div key={key} onPointerEnter={() => setHovered(key)} className={`group/item relative ${l.wide ? "hidden xl:block" : ""}`}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className="menu-link relative isolate inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm whitespace-nowrap text-white/90 transition-colors group-data-solid/header:bg-transparent group-data-solid/header:text-ink-600 aria-[current=page]:text-ink-900 group-data-solid/header:aria-[current=page]:text-ink-900"
              >
                {/* Motion: the white "current page" pill slides to the new link, and a soft pill follows the pointer. */}
                {active && (
                  <motion.span
                    layoutId="nav-current"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-full bg-white group-data-solid/header:shadow-sm"
                  />
                )}
                {hovered === key && !active && (
                  <motion.span
                    layoutId="nav-hover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    className="absolute inset-0 -z-10 rounded-full bg-white/25 group-data-solid/header:bg-white"
                  />
                )}
                {i === 0 && <House className="size-3.5 text-forest-600" />}
                {l.label}
                {l.children.length > 0 && <ChevronDown aria-hidden="true" className="size-3.5 opacity-60 transition group-hover/item:rotate-180" />}
              </Link>
              {l.children.length > 0 && (
                // Sub-menu: opens on hover and when a link inside has keyboard focus.
                <div className="invisible absolute top-full left-0 z-50 pt-3 opacity-0 transition duration-200 group-focus-within/item:visible group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:opacity-100">
                  <ul className="min-w-60 rounded-2xl bg-white p-2 shadow-xl shadow-black/10 ring-1 ring-black/5">
                    {l.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          aria-current={isActive(c.href) ? "page" : undefined}
                          className="menu-sublink block rounded-xl px-3.5 py-2.5 text-sm whitespace-nowrap text-ink-600 transition hover:bg-mist-50 hover:text-ink-900 aria-[current=page]:bg-mist-50 aria-[current=page]:text-ink-900"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LocaleSwitcher locale={locale} />
          <CartButton />
          <Link
            href={`/${locale}/contact`}
            className="hidden rounded-full bg-white px-3.5 py-2 text-sm font-medium whitespace-nowrap min-[420px]:inline-flex text-ink-900 transition hover:bg-mist-100 group-data-solid/header:bg-forest-900 group-data-solid/header:text-white sm:px-5 sm:py-2.5"
          >
            {nav.quote}
          </Link>
          <button
            ref={button}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? nav.close : nav.menu}
            className={`relative -mr-2 inline-flex size-10 items-center justify-center rounded-full text-white transition-colors duration-300 group-data-solid/header:text-ink-900 lg:hidden ${
              open ? "bg-mist-100" : "active:bg-white/15"
            }`}
          >
            <span aria-hidden="true" className="flex w-5 flex-col gap-[5.5px]">
              <span data-burger-top className="block h-[1.5px] rounded-full bg-current" />
              <span data-burger-mid className="block h-[1.5px] origin-left rounded-full bg-current" />
              <span data-burger-bottom className="block h-[1.5px] rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        inert={!open}
        className="invisible absolute inset-x-0 top-full flex h-[calc(100dvh-4.5rem)] flex-col overflow-y-auto border-t border-mist-200 bg-white lg:hidden"
      >
        <ul className="container-page pt-4">
          {links.map((l, i) => {
            const active = isActive(l.href);
            return (
              <li key={`${i}-${l.href}`} className="border-b border-mist-200">
                <div className="overflow-hidden">
                  <Link
                    data-menu-link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-center gap-4 py-4"
                  >
                    <span className="w-6 text-xs text-ink-400 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`heading flex-1 text-3xl ${active ? "accent text-[2.1rem] text-forest-600" : "text-forest-900"}`}>
                      {l.label}
                    </span>
                    <ArrowUpRight className="size-5 text-ink-400 transition group-hover:rotate-45 group-hover:text-forest-600" />
                  </Link>
                </div>
                {l.children.length > 0 && (
                  <ul className="-mt-1 grid gap-0.5 pb-4 pl-10">
                    {l.children.map((c) => (
                      <li key={c.href} className="overflow-hidden">
                        <Link
                          data-menu-link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(c.href) ? "page" : undefined}
                          className="block py-1.5 text-base text-ink-600 aria-[current=page]:font-medium aria-[current=page]:text-forest-600"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="container-page mt-auto space-y-5 pt-8 pb-8">
          <div data-menu-fade>
            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-sun-400 px-5 py-3.5 font-medium text-forest-950"
            >
              {nav.quote}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <ul data-menu-fade className="space-y-2 text-sm text-ink-600">
            <li>
              <a href={`tel:${site.phoneE164}`} className="inline-flex items-center gap-2.5 hover:text-forest-600">
                <Phone className="size-4 text-forest-600" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 hover:text-forest-600">
                <Mail className="size-4 text-forest-600" />
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
