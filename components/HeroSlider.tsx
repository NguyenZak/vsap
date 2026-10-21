"use client";

import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { ImageKey } from "@/lib/images";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Photo } from "./Photo";
import { Button, Tag } from "./ui";

// Photo and link for each slide, in the same order as `hero.slides` in lib/content.
const media: { image: ImageKey; href: string; /** Tailwind object-position class */ focus?: string }[] = [
  { image: "cashewOrchard", href: "/products", focus: "object-[60%_center]" },
  { image: "cashew", href: "/products/cashew" },
  { image: "macadamia", href: "/products/macadamia" },
  { image: "shipping", href: "/contact" },
];

/** Seconds each slide stays before autoplay moves on. */
const AUTOPLAY = 7;

const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  locale: Locale;
  hero: Dictionary["home"]["hero"];
  /** Already-formatted "13 export grades" text for the proof pill. */
  grades: string;
  thumbs: ImageKey[];
};

type Controls = { go: (to: number, dir: number) => void; sync: () => void };

/**
 * Full-screen hero carousel. GSAP drives everything: a clip-path wipe between
 * photos with a slow Ken Burns zoom, masked line-by-line title reveals, and a
 * progress bar per slide that doubles as the autoplay timer. Autoplay pauses on
 * keyboard focus, a hidden tab or the pause button (not on mouse hover: the hero
 * fills the screen, so the pointer is almost always over it), and is off entirely
 * for visitors who prefer reduced motion.
 */
export function HeroSlider({ locale, hero, grades, thumbs }: Props) {
  const root = useRef<HTMLElement>(null);
  const controls = useRef<Controls>({ go: () => {}, sync: () => {} });
  const flags = useRef({ focus: false, user: false });
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const slides = hero.slides;
  const n = slides.length;

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const medias = q<HTMLElement>("[data-media]");
      const texts = q<HTMLElement>("[data-text]");
      const bars = q<HTMLElement>("[data-bar]");
      const img = (el: HTMLElement) => el.querySelector("img");
      const lines = (el: HTMLElement) => el.querySelectorAll("[data-line]");
      const fades = (el: HTMLElement) => el.querySelectorAll("[data-fade]");
      const reduce = prefersReducedMotion();

      // Take over from the CSS failsafe that keeps intro elements hidden until JS runs.
      q("[data-intro]").forEach((el) => el.removeAttribute("data-intro"));
      if (reduce) setAutoplay(false);

      let current = 0;
      let busy: gsap.core.Timeline | null = null;
      let timer: gsap.core.Tween | null = null;
      let zoom: gsap.core.Tween | null = null;

      const sync = () => {
        const f = flags.current;
        const hold = f.focus || f.user || document.hidden;
        if (hold) {
          timer?.pause();
          zoom?.pause();
        } else {
          timer?.resume();
          zoom?.resume();
        }
      };

      const kenBurns = (el: HTMLElement, delay: number) => {
        zoom?.kill();
        if (!reduce) zoom = gsap.to(img(el), { scale: 1, duration: AUTOPLAY + 2, ease: "none", delay });
      };

      const go = contextSafe!((to: number, dir: number) => {
        if (to === current) return;
        busy?.progress(1);
        const from = current;
        current = to;
        setIndex(to);

        const m = reduce ? 0 : 1;
        const [fromMedia, toMedia] = [medias[from], medias[to]];
        const [fromText, toText] = [texts[from], texts[to]];
        gsap.set(fromMedia, { zIndex: 1 });
        gsap.set(toMedia, { zIndex: 2, visibility: "visible" });
        gsap.set(toText, { visibility: "visible" });

        busy = gsap
          .timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
              gsap.set([fromMedia, fromText], { visibility: "hidden" });
              busy = null;
            },
          })
          .fromTo(
            toMedia,
            { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3 * m },
            0,
          )
          .fromTo(img(toMedia), { scale: 1.3, xPercent: 6 * dir }, { scale: 1.12, xPercent: 0, duration: 1.3 * m }, 0)
          .to(img(fromMedia), { xPercent: -8 * dir, duration: 1.3 * m }, 0)
          .to(lines(fromText), { yPercent: -110, duration: 0.55 * m, stagger: 0.05, ease: "power2.in" }, 0)
          .to(fades(fromText), { autoAlpha: 0, y: -12, duration: 0.4 * m, stagger: 0.04, ease: "power2.in" }, 0)
          .fromTo(
            lines(toText),
            { yPercent: 110 },
            { yPercent: 0, duration: 1 * m, stagger: 0.09, ease: "power4.out" },
            0.55 * m,
          )
          .fromTo(
            fades(toText),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.8 * m, stagger: 0.08, ease: "power3.out" },
            0.7 * m,
          );

        kenBurns(toMedia, 1.3 * m);
        startTimer(to);
      });

      // One bar per slide: earlier ones full, the current one fills over AUTOPLAY seconds.
      const startTimer = (i: number) => {
        timer?.kill();
        bars.forEach((bar, j) => gsap.set(bar, { scaleX: j < i || (reduce && j === i) ? 1 : 0 }));
        if (reduce) return;
        timer = gsap.fromTo(
          bars[i],
          { scaleX: 0 },
          { scaleX: 1, duration: AUTOPLAY, ease: "none", onComplete: () => go((i + 1) % n, 1) },
        );
        sync();
      };

      gsap.set([...medias.slice(1), ...texts.slice(1)], { visibility: "hidden" });

      if (!reduce) {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .fromTo(img(medias[0]), { scale: 1.35 }, { scale: 1.12, duration: 2, ease: "power3.out" }, 0)
          .fromTo(lines(texts[0]), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0.25)
          .fromTo(
            fades(texts[0]),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
            0.5,
          )
          .fromTo(
            q("[data-chrome]"),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
            0.8,
          );
        kenBurns(medias[0], 2);
      }
      startTimer(0);

      controls.current = { go, sync };
      document.addEventListener("visibilitychange", sync);
      return () => document.removeEventListener("visibilitychange", sync);
    },
    { scope: root },
  );

  const go = (to: number, dir: number) => controls.current.go(((to % n) + n) % n, dir);
  const hold = (key: "focus" | "user", value: boolean) => {
    flags.current[key] = value;
    controls.current.sync();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1, 1);
    if (e.key === "ArrowLeft") go(index - 1, -1);
  };
  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };

  const round =
    "inline-flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-forest-950";

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label="VSAP"
      onKeyDown={onKeyDown}
      // Keyboard focus pauses autoplay; a mouse/touch click on the controls does not.
      onFocus={(e) => e.target.matches(":focus-visible") && hold("focus", true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && hold("focus", false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-900 lg:min-h-[46rem]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {media.map((m, i) => (
          <div
            key={m.image}
            data-media
            aria-hidden={i !== index}
            className={`absolute inset-0 overflow-hidden ${i === 0 ? "" : "invisible"}`}
          >
            <Photo
              name={m.image}
              locale={locale}
              priority={i === 0}
              className={`size-full will-change-transform ${m.focus ?? ""}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 z-[3] bg-gradient-to-t from-black/65 via-black/10 to-black/30" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      <div className="container-page flex flex-1 flex-col justify-end pb-10 pt-32 lg:pb-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid">
            {slides.map((s, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              const intro = i === 0 || undefined;
              return (
                <div
                  key={s.label}
                  data-text
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${n}`}
                  aria-hidden={i !== index}
                  inert={i !== index}
                  className={`[grid-area:1/1] ${i === 0 ? "" : "invisible"}`}
                >
                  <div data-fade data-intro={intro}>
                    <Tag tone="glass">{s.eyebrow}</Tag>
                  </div>
                  <Heading className="heading mt-5 max-w-5xl text-[2.6rem] text-white sm:text-6xl lg:text-7xl">
                    <span className="-mt-[0.15em] block overflow-hidden pt-[0.15em] pb-[0.04em]">
                      <span data-line data-intro={intro} className="block">
                        {s.title}
                      </span>
                    </span>
                    <span className="-mt-[0.15em] -mb-[0.1em] block overflow-hidden pt-[0.15em] pb-[0.14em]">
                      <span data-line data-intro={intro} className="accent block text-[1.1em] leading-[1]">
                        {s.accent}
                      </span>
                    </span>
                  </Heading>
                  <p data-fade data-intro={intro} className="mt-5 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
                    {s.lead}
                  </p>
                  <div data-fade data-intro={intro} className="mt-8 flex flex-wrap gap-3">
                    <Button href={`/${locale}${media[i].href}`}>{s.cta}</Button>
                    {media[i].href !== "/contact" && (
                      <Button href={`/${locale}/contact`} variant="glass">
                        {hero.secondaryCta}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div data-chrome data-intro className="flex shrink-0 items-center gap-2.5">
            <p className="mr-2 text-white tabular-nums" aria-hidden="true">
              <span className="text-3xl font-medium tracking-tight">{pad(index + 1)}</span>
              <span className="text-sm text-white/60"> / {pad(n)}</span>
            </p>
            {autoplay && (
              <button
                type="button"
                className={round}
                aria-label={paused ? hero.play : hero.pause}
                onClick={() => {
                  setPaused(!paused);
                  hold("user", !paused);
                }}
              >
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            )}
            <button type="button" className={round} aria-label={hero.prev} onClick={() => go(index - 1, -1)}>
              <ArrowLeft className="size-4" />
            </button>
            <button type="button" className={round} aria-label={hero.next} onClick={() => go(index + 1, 1)}>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-page" data-chrome data-intro>
        <div className="grid grid-cols-4 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`${hero.slide} ${i + 1}: ${s.label}`}
              aria-current={i === index || undefined}
              className="group pt-1 pb-3 text-left"
            >
              <span className="relative block h-0.5 overflow-hidden rounded-full bg-white/25">
                <span data-bar className="absolute inset-0 origin-left scale-x-0 rounded-full bg-lime-300" />
              </span>
              <span className="mt-2.5 hidden text-xs text-white/55 transition group-hover:text-white group-aria-[current=true]:text-white sm:block">
                {pad(i + 1)} · {s.label}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 pb-5 text-white">
          <a href="#about" className="inline-flex shrink-0 items-center gap-2 text-xs whitespace-nowrap uppercase tracking-wider sm:text-sm">
            {hero.scroll}
            <ArrowDown className="size-4 animate-bounce" />
          </a>
          <div className="flex items-center gap-3 sm:gap-4">
            <p className="hidden items-center gap-1.5 text-sm sm:flex">
              <Star className="size-4 fill-sun-500 text-sun-500" />
              <span className="font-medium">No.1</span>
              <span className="text-white/75">{hero.rank}</span>
            </p>
            <span className="hidden h-5 w-px bg-white/30 sm:block" />
            <p className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3 text-xs whitespace-nowrap backdrop-blur-md sm:text-sm">
              <span className="flex -space-x-2.5">
                {thumbs.map((t) => (
                  <Photo key={t} name={t} locale={locale} decorative className="size-7 rounded-full ring-2 ring-white/70 sm:size-8" />
                ))}
              </span>
              {grades}
            </p>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live={paused || !autoplay ? "polite" : "off"}>
        {`${hero.slide} ${index + 1} / ${n}: ${slides[index].label}`}
      </p>
    </section>
  );
}
