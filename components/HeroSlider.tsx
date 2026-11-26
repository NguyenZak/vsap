"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { srcSetFor } from "@/lib/responsive";
import { Button, Tag } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");

/** Viewports that get a slide's mobile image (below Tailwind's md). */
const MOBILE = "(max-width: 767px)";

type Img = { src: string; alt: string };

export type HeroSlide = {
  label: string;
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
  image: Img;
  /** Shown below 768px instead of `image` when set (a portrait crop for phones). */
  mobileImage?: Img;
  buttonLabel: string;
  buttonHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

/** Everything already resolved to the page language (see components/blocks). */
type Props = {
  slides: HeroSlide[];
  /** Seconds each slide stays before autoplay moves on. */
  autoplay: number;
  scrollLabel: string;
  rankValue: string;
  rankLabel: string;
  proofLabel: string;
  proofImages: Img[];
  labels: { prev: string; next: string; pause: string; play: string; slide: string };
};

type Controls = { go: (to: number) => void; sync: () => void };

/**
 * Full-screen hero carousel. The photos stay still (no zoom or slide, so banners
 * with text baked in are never cropped further); slides cross-fade, and a
 * progress bar per slide doubles as the autoplay timer. Autoplay pauses on
 * keyboard focus, a hidden tab or the pause button (not on mouse hover: the hero
 * fills the screen, so the pointer is almost always over it), and is off entirely
 * for visitors who prefer reduced motion.
 */
export function HeroSlider({ slides, autoplay: AUTOPLAY, scrollLabel, rankValue, rankLabel, proofLabel, proofImages, labels }: Props) {
  const root = useRef<HTMLElement>(null);
  const controls = useRef<Controls>({ go: () => {}, sync: () => {} });
  const flags = useRef({ focus: false, user: false });
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const [autoplay, setAutoplay] = useState(n > 1);
  // The hero takes the shape of the first slide's photo (whichever of desktop / mobile the
  // browser picked), so the whole image shows uncropped. Until it loads: 16:9, or 9:16 on phones.
  const firstImg = useRef<HTMLImageElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const measure = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth && img.naturalHeight) setRatio(img.naturalWidth / img.naturalHeight);
  };
  useEffect(() => measure(firstImg.current), []);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const medias = q<HTMLElement>("[data-media]");
      const texts = q<HTMLElement>("[data-text]");
      const bars = q<HTMLElement>("[data-bar]");
      const reduce = prefersReducedMotion();

      if (reduce || n < 2) setAutoplay(false);

      let current = 0;
      let busy: gsap.core.Timeline | null = null;
      let timer: gsap.core.Tween | null = null;

      const sync = () => {
        const f = flags.current;
        const hold = f.focus || f.user || document.hidden;
        if (hold) timer?.pause();
        else timer?.resume();
      };

      // No zoom, slide or text reveal: photos stay still at their full frame and slides just cross-fade.
      const go = contextSafe!((to: number) => {
        if (to === current) return;
        busy?.progress(1);
        const from = current;
        current = to;
        setIndex(to);

        const m = reduce ? 0 : 1;
        const [fromMedia, toMedia] = [medias[from], medias[to]];
        const [fromText, toText] = [texts[from], texts[to]];
        gsap.set(fromMedia, { zIndex: 1 });
        gsap.set(toMedia, { zIndex: 2 });

        busy = gsap
          .timeline({
            defaults: { ease: "power1.inOut" },
            onComplete: () => {
              gsap.set([fromMedia, fromText], { autoAlpha: 0 });
              busy = null;
            },
          })
          .fromTo(toMedia, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 * m }, 0)
          .to(fromText, { autoAlpha: 0, duration: 0.3 * m }, 0)
          .fromTo(toText, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 * m }, 0.3 * m);

        startTimer(to);
      });

      // One bar per slide: earlier ones full, the current one fills over AUTOPLAY seconds.
      const startTimer = (i: number) => {
        timer?.kill();
        bars.forEach((bar, j) => gsap.set(bar, { scaleX: j < i || (reduce && j === i) ? 1 : 0 }));
        if (reduce || n < 2) return;
        timer = gsap.fromTo(
          bars[i],
          { scaleX: 0 },
          { scaleX: 1, duration: AUTOPLAY, ease: "none", onComplete: () => go((i + 1) % n) },
        );
        sync();
      };

      gsap.set([...medias.slice(1), ...texts.slice(1)], { autoAlpha: 0 });
      startTimer(0);

      controls.current = { go, sync };
      document.addEventListener("visibilitychange", sync);
      return () => document.removeEventListener("visibilitychange", sync);
    },
    { scope: root },
  );

  const go = (to: number) => controls.current.go(((to % n) + n) % n);
  const hold = (key: "focus" | "user", value: boolean) => {
    flags.current[key] = value;
    controls.current.sync();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };
  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
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
      style={ratio ? { aspectRatio: ratio } : undefined}
      className="relative isolate flex aspect-[9/16] flex-col bg-forest-900 md:aspect-video"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={i}
            data-media
            aria-hidden={i !== index}
            className={`absolute inset-0 overflow-hidden ${i === 0 ? "" : "invisible"}`}
          >
            <picture className="contents">
              {s.mobileImage?.src && <source media={MOBILE} srcSet={srcSetFor(s.mobileImage.src) ?? s.mobileImage.src} sizes="100vw" />}
              <img
                ref={i === 0 ? firstImg : undefined}
                onLoad={i === 0 ? (e) => measure(e.currentTarget) : undefined}
                src={s.image.src}
                srcSet={srcSetFor(s.image.src)}
                sizes="100vw"
                alt={s.image.alt}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                decoding="async"
                className="size-full object-cover"
              />
            </picture>
          </div>
        ))}
      </div>

      <div className="container-page flex flex-1 flex-col justify-end pb-10 pt-32 lg:pb-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid">
            {slides.map((s, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <div
                  key={i}
                  data-text
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} / ${n}`}
                  aria-hidden={i !== index}
                  inert={i !== index}
                  className={`[grid-area:1/1] ${i === 0 ? "" : "invisible"}`}
                >
                  {s.eyebrow && (
                    <div className="mb-5">
                      <Tag tone="glass">{s.eyebrow}</Tag>
                    </div>
                  )}
                  {/* A banner with its text baked into the image leaves the fields empty: keep the heading for screen readers. */}
                  {!s.title && !s.accent && <Heading className="sr-only">{s.image.alt}</Heading>}
                  {(s.title || s.accent) && (
                  <Heading className="heading max-w-5xl text-[1.875rem] text-white sm:text-6xl lg:text-7xl">
                    <span className="-mt-[0.15em] block overflow-hidden pt-[0.15em] pb-[0.04em]">
                      <span className="block">
                        {s.title}
                      </span>
                    </span>
                    <span className="-mt-[0.15em] -mb-[0.1em] block overflow-hidden pt-[0.15em] pb-[0.14em]">
                      <span className="accent block text-[1.1em] leading-[1] text-sun-400">
                        {s.accent}
                      </span>
                    </span>
                  </Heading>
                  )}
                  {((s.buttonLabel && s.buttonHref) || (s.secondaryLabel && s.secondaryHref)) && (
                  <div className="mt-7 flex flex-wrap gap-3">
                    {s.buttonLabel && s.buttonHref && <Button href={s.buttonHref}>{s.buttonLabel}</Button>}
                    {s.secondaryLabel && s.secondaryHref && (
                      <Button href={s.secondaryHref} variant="glass">
                        {s.secondaryLabel}
                      </Button>
                    )}
                  </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`flex shrink-0 items-center gap-2.5 ${n < 2 ? "hidden" : ""}`}>
            <p className="mr-2 text-white tabular-nums" aria-hidden="true">
              <span className="text-3xl font-medium tracking-tight">{pad(index + 1)}</span>
              <span className="text-sm text-white/60"> / {pad(n)}</span>
            </p>
            {autoplay && (
              <button
                type="button"
                className={round}
                aria-label={paused ? labels.play : labels.pause}
                onClick={() => {
                  setPaused(!paused);
                  hold("user", !paused);
                }}
              >
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
            )}
            <button type="button" className={round} aria-label={labels.prev} onClick={() => go(index - 1)}>
              <ArrowLeft className="size-4" />
            </button>
            <button type="button" className={round} aria-label={labels.next} onClick={() => go(index + 1)}>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-page">
        <div className={`grid gap-2 ${n < 2 ? "hidden" : ""}`} style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`${labels.slide} ${i + 1}: ${s.label}`}
              aria-current={i === index || undefined}
              className="group pt-1 pb-3 text-left"
            >
              <span className="relative block h-0.5 overflow-hidden rounded-full bg-white/25">
                <span data-bar className="absolute inset-0 origin-left scale-x-0 rounded-full bg-brand-gradient" />
              </span>
              <span className="mt-2.5 hidden text-xs text-white/55 transition group-hover:text-white group-aria-[current=true]:text-white sm:block">
                {pad(i + 1)} · {s.label}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 pb-5 text-white">
          <button
            type="button"
            onClick={() => {
              // Scroll to whatever section follows the hero on this page.
              const next = root.current?.closest("[data-type]")?.nextElementSibling ?? root.current?.nextElementSibling;
              next?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
            }}
            className={`inline-flex shrink-0 items-center gap-2 text-xs whitespace-nowrap uppercase tracking-wider sm:text-sm ${scrollLabel ? "" : "invisible"}`}
          >
            {scrollLabel}
            <ArrowDown className="size-4" />
          </button>
          <div className="flex items-center gap-3 sm:gap-4">
            {(rankValue || rankLabel) && (
              <>
                <p className="hidden items-center gap-1.5 text-sm sm:flex">
                  <Star className="size-4 fill-sun-500 text-sun-500" />
                  <span className="font-medium">{rankValue}</span>
                  <span className="text-white/75">{rankLabel}</span>
                </p>
                {proofLabel && <span className="hidden h-5 w-px bg-white/30 sm:block" />}
              </>
            )}
            {proofLabel && (
              <p className="hidden items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3 text-xs whitespace-nowrap backdrop-blur-md sm:flex sm:text-sm">
                {proofImages.length > 0 && (
                  <span className="flex -space-x-2.5">
                    {proofImages.map((t, i) => (
                      <img key={i} src={t.src} alt="" loading="lazy" className="size-7 rounded-full object-cover ring-2 ring-white/70 sm:size-8" />
                    ))}
                  </span>
                )}
                {proofLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live={paused || !autoplay ? "polite" : "off"}>
        {`${labels.slide} ${index + 1} / ${n}: ${slides[index].label}`}
      </p>
    </section>
  );
}
