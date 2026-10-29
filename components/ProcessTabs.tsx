"use client";

import { useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { gsap, MOTION_OK, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { srcSetFor } from "@/lib/responsive";
import { CmsIcon } from "./cms/Icon";

export type ProcessStep = { icon: string; title: string; body: string; image: { src: string; alt: string } };

/**
 * "How it works" block: a row of step tabs above one large photo with a
 * floating detail card, like the tabbed dashboard in the mockup. Steps advance
 * on their own every AUTOPLAY seconds (the active tab's underline is the
 * timer) while the block is on screen and not keyboard-focused.
 */
export function ProcessTabs({
  steps,
  autoplay: AUTOPLAY,
  stepLabel,
  location,
}: {
  steps: ProcessStep[];
  /** Seconds each step stays before autoplay moves to the next one. */
  autoplay: number;
  stepLabel: string;
  location: string;
}) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const timer = useRef<gsap.core.Tween | null>(null);
  const state = useRef({ visible: false, held: false });

  const sync = () => {
    const { visible, held } = state.current;
    if (visible && !held) timer.current?.resume();
    else timer.current?.pause();
  };

  // Visibility + keyboard-focus tracking, set up once.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => {
          state.current.visible = self.isActive;
          sync();
        },
      });
      const hold = (v: boolean) => () => {
        state.current.held = v;
        sync();
      };
      const enter = hold(true);
      const leave = hold(false);
      const focusIn = (e: FocusEvent) => (e.target as Element).matches(":focus-visible") && enter();
      el.addEventListener("focusin", focusIn);
      el.addEventListener("focusout", leave);
      return () => {
        el.removeEventListener("focusin", focusIn);
        el.removeEventListener("focusout", leave);
      };
    },
    { scope: root },
  );

  // Restart the timer on the active tab whenever the step changes.
  useGSAP(
    (_, contextSafe) => {
      const bars = gsap.utils.toArray<HTMLElement>("[data-tab-bar]", tabs.current);
      gsap.set(bars, { scaleX: 0 });
      // Keep the active tab in view in the scrollable strip on small screens.
      const strip = tabs.current!;
      const tab = strip.children[active] as HTMLElement | undefined;
      if (tab && strip.scrollWidth > strip.clientWidth) {
        strip.scrollTo({ left: tab.offsetLeft - 20, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
      if (prefersReducedMotion() || steps.length < 2) return;
      timer.current = gsap.fromTo(
        bars[active],
        { scaleX: 0 },
        { scaleX: 1, duration: AUTOPLAY, ease: "none", onComplete: contextSafe!(() => setActive((a) => (a + 1) % steps.length)) },
      );
      sync();
    },
    { scope: tabs, dependencies: [active], revertOnUpdate: true },
  );

  // Cross-fade the new photo in with a slight zoom and lift the floating cards.
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-step-photo]", { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.7 })
          .fromTo("[data-step-card]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06 }, 0.1)
          .fromTo("[data-step-seg]", { scaleX: 0 }, { scaleX: 1, duration: 0.4, stagger: 0.03, ease: "power2.out" }, 0.2);
      });
    },
    { scope: panel, dependencies: [active], revertOnUpdate: true },
  );
  const step = steps[active];
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <div ref={root}>
      <div ref={tabs} role="tablist" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
        {steps.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              onClick={() => setActive(i)}
              className={`relative flex shrink-0 items-center gap-3 overflow-hidden rounded-xl border p-2 pr-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-forest-600 ${
                selected ? "border-mist-200 bg-surface shadow-sm" : "border-transparent bg-mist-50 hover:bg-mist-100"
              }`}
            >
              <span
                className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  selected ? "bg-sun-400 text-forest-950" : "bg-surface text-ink-600"
                }`}
              >
                <CmsIcon name={s.icon} className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium whitespace-nowrap text-ink-900">{s.title}</span>
                <span className="block text-xs text-ink-400">
                  {stepLabel} {num(i)}
                </span>
              </span>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5">
                <span data-tab-bar className="block size-full origin-left scale-x-0 bg-sun-500" />
              </span>
            </button>
          );
        })}
      </div>

      <div
        data-reveal="clip"
        ref={panel}
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        className="relative mt-3 overflow-hidden rounded-2xl bg-mist-100"
      >
        <div data-step-photo>
          <img
            key={active}
            src={step.image.src}
            srcSet={srcSetFor(step.image.src)}
            sizes="100vw"
            alt={step.image.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        <p className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs text-white backdrop-blur-md sm:bottom-6 sm:left-6">
          <MapPin className="size-3.5" />
          {location}
        </p>

        <div className="absolute inset-x-4 bottom-14 space-y-2 sm:inset-x-auto sm:right-6 sm:top-1/2 sm:bottom-auto sm:w-72 sm:-translate-y-1/2">
          <div data-step-card className="rounded-2xl bg-surface/95 p-5 text-center shadow-xl shadow-black/10 backdrop-blur-md">
            <span className="mx-auto inline-flex size-11 items-center justify-center rounded-full bg-sun-400 text-forest-950">
              <CmsIcon name={step.icon} className="size-5" />
            </span>
            <p className="mt-3 text-3xl font-medium tracking-tight text-ink-900">{num(active)}</p>
            <p className="text-sm font-medium text-ink-900">{step.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">{step.body}</p>
          </div>
          <div data-step-card className="rounded-2xl bg-surface/95 p-4 shadow-xl shadow-black/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink-900">
                {stepLabel} {active + 1}/{steps.length}
              </span>
              <span className="text-forest-600">{step.title}</span>
            </div>
            <div className="mt-2.5 flex gap-1" aria-hidden="true">
              {steps.map((s, i) => (
                <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist-200">
                  {i <= active && <span data-step-seg className="block size-full origin-left rounded-full bg-sun-500" />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
