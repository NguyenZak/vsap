"use client";

import { useId, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CmsIcon } from "./cms/Icon";

export type ShowcaseItem = { icon: string; title: string; body: string; image: { src: string; alt: string } };

/**
 * Core values as an accordion driving a photo slider: the open item picks the
 * photo, which wipes in with GSAP. Autoplay walks through the items while the
 * block is on screen and pauses on keyboard focus.
 */
export function ValuesShowcase({ items: values, autoplay: AUTOPLAY }: { items: ShowcaseItem[]; autoplay: number }) {
  const root = useRef<HTMLDivElement>(null);
  const goTo = useRef<(i: number) => void>(() => {});
  const [active, setActive] = useState(0);
  const n = values.length;
  const uid = useId();

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const slides = q<HTMLElement>("[data-vs-slide]");
      const bar = q<HTMLElement>("[data-vs-bar]")[0];
      const reduce = prefersReducedMotion();
      let current = 0;
      let timer: gsap.core.Tween | null = null;
      let visible = false;
      let held = false;

      const sync = () => (visible && !held ? timer?.resume() : timer?.pause());

      const show = contextSafe!((to: number) => {
        const from = current;
        current = to;
        setActive(to);
        if (from !== to) {
          gsap.set(slides[from], { zIndex: 1 });
          gsap.set(slides[to], { zIndex: 2, autoAlpha: 1 });
          if (reduce) {
            gsap.set(slides[from], { autoAlpha: 0 });
          } else {
            gsap.fromTo(
              slides[to],
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.inOut", onComplete: () => gsap.set(slides[from], { autoAlpha: 0 }) },
            );
            gsap.fromTo(slides[to].querySelector("img"), { scale: 1.2 }, { scale: 1, duration: 1.4, ease: "power3.out" });
          }
        }
        timer?.kill();
        if (reduce || n < 2) return;
        timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: AUTOPLAY, ease: "none", onComplete: () => show((current + 1) % n) });
        sync();
      });

      gsap.set(slides.slice(1), { autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => {
          visible = self.isActive;
          sync();
        },
      });
      show(0);

      const el = root.current!;
      const hold = (v: boolean) => () => {
        held = v;
        sync();
      };
      const onFocusIn = (e: FocusEvent) => (e.target as Element).matches(":focus-visible") && hold(true)();
      const onLeave = hold(false);
      el.addEventListener("focusin", onFocusIn);
      el.addEventListener("focusout", onLeave);
      goTo.current = show;
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid gap-4 lg:grid-cols-2">
      <ul className="space-y-2.5">
        {values.map((v, i) => {
                    const open = i === active;
          return (
            <li key={i} data-reveal className={`rounded-2xl p-2 transition-colors ${open ? "bg-mist-100" : "bg-mist-50 hover:bg-mist-100"}`}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${uid}-value-${i}`}
                onClick={() => goTo.current(i)}
                className="flex w-full items-center gap-3 rounded-xl p-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-forest-600"
              >
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition ${
                    open ? "bg-lime-300 text-forest-950" : "bg-white text-ink-600"
                  }`}
                >
                  <CmsIcon name={v.icon} className="size-[18px]" />
                </span>
                <h3 className="flex-1 text-base text-ink-900">{v.title}</h3>
                {open ? <Minus className="size-5 text-ink-900" /> : <Plus className="size-5 text-ink-600" />}
              </button>
              {/* grid-rows 0fr → 1fr animates the panel to its natural height. */}
              <div
                id={`${uid}-value-${i}`}
                className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="mt-2 rounded-xl bg-white px-5 py-4 text-sm leading-relaxed text-ink-600 sm:pl-[3.75rem]">{v.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div data-reveal="clip" className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist-100 lg:aspect-auto lg:min-h-[28rem]">
        {values.map((v, i) => (
          <div key={i} data-vs-slide className="absolute inset-0 overflow-hidden" aria-hidden={i !== active}>
            <img src={v.image.src} alt={v.image.alt} loading="lazy" decoding="async" className="size-full object-cover will-change-transform" />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 z-10 flex items-center gap-4 text-white">
          <p className="text-sm tabular-nums" aria-hidden="true">
            <span className="font-medium">{String(active + 1).padStart(2, "0")}</span>
            <span className="text-white/60"> / {String(n).padStart(2, "0")}</span>
          </p>
          <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
            <span data-vs-bar className="absolute inset-0 origin-left scale-x-0 rounded-full bg-lime-300" />
          </span>
          <p className="max-w-[50%] truncate text-sm">{values[active].title}</p>
        </div>
      </div>
    </div>
  );
}
