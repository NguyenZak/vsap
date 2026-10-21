"use client";

import { Fragment, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { ImageKey } from "@/lib/images";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Photo } from "./Photo";
import { Tag } from "./ui";

// Photo inside the rounded pill of each statement, same order as `statement.items`.
const pills: ImageKey[] = ["paddyWork", "cashewHarvest", "macadamiaTree", "cashewKernels"];

/** Seconds a fully typed statement stays on screen before it is erased. */
const HOLD = 3.5;

const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  locale: Locale;
  statement: Dictionary["home"]["statement"];
  labels: { prev: string; next: string; slide: string };
};

/**
 * Rotating statements written out by a typewriter: characters appear one at a
 * time behind a caret (with short beats after punctuation), the photo pill pops
 * in mid-sentence, the line holds, then backspaces and the next one starts.
 * Typing only runs while the block is on screen; reduced motion shows whole
 * statements and leaves switching to the arrows.
 */
export function StatementSlider({ locale, statement, labels }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const goTo = useRef<(i: number) => void>(() => {});
  const [index, setIndex] = useState(0);
  const items = statement.items;
  const n = items.length;

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const slides = q<HTMLElement>("[data-st-slide]");
      const bars = q<HTMLElement>("[data-st-bar]");
      // Typing order per slide: every character span, with the pill in its place.
      const steps = slides.map((s) => [...s.querySelectorAll<HTMLElement>("[data-ch], [data-pill]")]);
      const starts = slides.map((s) => s.querySelector<HTMLElement>("[data-st-start]"));
      const isPill = (node: HTMLElement) => node.hasAttribute("data-pill");

      const show = (i: number) => slides.forEach((s, j) => (s.style.visibility = j === i ? "visible" : "hidden"));
      const fill = (i: number, full: boolean) =>
        bars.forEach((b, j) => gsap.set(b, { scaleX: j < i || (full && j === i) ? 1 : 0 }));

      if (prefersReducedMotion()) {
        show(0);
        fill(0, true);
        goTo.current = (i) => {
          setIndex(i);
          show(i);
          fill(i, true);
        };
        return;
      }

      let tl: gsap.core.Timeline | null = null;
      let caretAt: HTMLElement | null = null;
      let started = false;

      const caret = (node: HTMLElement | null) => {
        caretAt?.removeAttribute("data-caret");
        caretAt = node;
        node?.setAttribute("data-caret", "");
      };
      const typing = (on: boolean) => el.toggleAttribute("data-typing", on);
      const clear = (i: number) =>
        steps[i].forEach((node) =>
          isPill(node) ? gsap.set(node, { scale: 0, autoAlpha: 0 }) : (node.style.visibility = "hidden"),
        );

      const type = contextSafe!((i: number) => {
        tl?.kill();
        setIndex(i);
        clear(i);
        show(i);
        fill(i, false);
        caret(starts[i]);
        typing(true);

        tl = gsap.timeline({ onComplete: () => erase(i) });
        let t = 0.35;
        for (const node of steps[i]) {
          if (isPill(node)) {
            tl.fromTo(
              node,
              { scale: 0, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2.2)", onStart: () => caret(node) },
              t,
            );
            t += 0.45;
            continue;
          }
          tl.call(() => {
            node.style.visibility = "inherit";
            caret(node);
          }, undefined, t);
          // Human rhythm: a little jitter per key, a beat after punctuation.
          t += /[,.;:–—]/.test(node.textContent ?? "") ? 0.24 : gsap.utils.random(0.018, 0.05);
        }
        tl.call(() => typing(false), undefined, t);
        tl.to({}, { duration: HOLD }, t);
        tl.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: t + HOLD, ease: "none" }, 0);
      });

      const erase = contextSafe!((i: number) => {
        const list = steps[i];
        const step = Math.min(0.012, 0.8 / list.length);
        typing(true);
        tl = gsap.timeline({ onComplete: () => type((i + 1) % n) });
        for (let k = list.length - 1, at = 0; k >= 0; k--, at += step) {
          const node = list[k];
          const before = list[k - 1] ?? starts[i];
          if (isPill(node)) {
            tl.to(node, { scale: 0, autoAlpha: 0, duration: 0.25, ease: "power2.in", onComplete: () => caret(before) }, at);
          } else {
            tl.call(() => {
              node.style.visibility = "hidden";
              caret(before);
            }, undefined, at);
          }
        }
        tl.to({}, { duration: 0.4 });
      });

      // Everything starts blank with a blinking caret, until the block scrolls into view.
      slides.forEach((_, i) => clear(i));
      show(0);
      fill(0, false);
      caret(starts[0]);

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        end: "bottom top",
        onToggle: (self) => {
          if (!self.isActive) return tl?.pause();
          if (started) return tl?.resume();
          started = true;
          type(0);
        },
      });

      goTo.current = (i) => {
        started = true;
        type(i);
      };
    },
    { scope: root },
  );

  const go = (i: number) => goTo.current(((i % n) + n) % n);
  const round =
    "inline-flex size-11 items-center justify-center rounded-full border border-mist-200 bg-white text-ink-900 transition hover:border-forest-900 hover:bg-forest-900 hover:text-white";

  return (
    <div ref={root}>
      <div className="flex items-center justify-between gap-6">
        <div data-reveal>
          <Tag>{statement.eyebrow}</Tag>
        </div>
        <div data-reveal className="flex items-center gap-2.5">
          <p className="mr-2 text-ink-900 tabular-nums" aria-hidden="true">
            <span className="text-2xl font-medium tracking-tight">{pad(index + 1)}</span>
            <span className="text-sm text-ink-400"> / {pad(n)}</span>
          </p>
          <button type="button" className={round} aria-label={labels.prev} onClick={() => go(index - 1)}>
            <ArrowLeft className="size-4" />
          </button>
          <button type="button" className={round} aria-label={labels.next} onClick={() => go(index + 1)}>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 grid">
        {items.map((item, i) => (
          <div
            key={item.strong}
            data-st-slide
            aria-hidden={i !== index}
            className={`[grid-area:1/1] ${i === 0 ? "" : "invisible"}`}
          >
            <p className="sr-only">{`${item.strong} ${item.muted} ${item.tail}`}</p>
            <p
              aria-hidden="true"
              className="heading max-w-[72rem] text-3xl text-forest-900 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.18]"
            >
              <span data-st-start className="inline-block h-[0.9em] w-0 align-[-0.1em]" />
              <Chars text={item.strong} />
              <Chars text=" " />
              <span className="text-sage-500">
                <Chars text={item.muted} />
              </span>
              <Chars text=" " />
              <span data-pill className="inline-block align-[-0.1em]">
                <Photo
                  name={pills[i % pills.length]}
                  locale={locale}
                  decorative
                  className="inline-block h-[0.85em] w-[2.1em] rounded-full"
                />
              </span>
              <Chars text=" " />
              <span className="text-sage-500">
                <Chars text={item.tail} />
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid max-w-md grid-cols-4 gap-2">
        {items.map((item, i) => (
          <button
            key={item.strong}
            type="button"
            onClick={() => go(i)}
            aria-label={`${labels.slide} ${i + 1}`}
            aria-current={i === index || undefined}
            className="py-2"
          >
            <span className="relative block h-0.5 overflow-hidden rounded-full bg-mist-200">
              <span data-st-bar className="absolute inset-0 origin-left scale-x-0 rounded-full bg-forest-600" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * One span per character so the typewriter can reveal them in place (hidden
 * characters keep their width, so nothing reflows). Words stay unbreakable.
 */
function Chars({ text }: { text: string }) {
  const words = text.normalize("NFC").split(" ");
  return words.map((word, w) => (
    <Fragment key={w}>
      {w > 0 && <span data-ch> </span>}
      {word && (
        <span className="whitespace-nowrap">
          {Array.from(word).map((ch, c) => (
            <span key={c} data-ch>
              {ch}
            </span>
          ))}
        </span>
      )}
    </Fragment>
  ));
}
