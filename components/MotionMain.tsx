"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * The page's <main>. Server components opt into motion with data attributes,
 * and this wires them up with GSAP + ScrollTrigger on every route:
 *
 * - `data-intro`            fades up on page load (inner-page heroes)
 * - `data-reveal`           fades up when scrolled into view, batched + staggered
 * - `data-reveal="clip"`    wipes open from the bottom (photos, banners)
 * - `data-parallax`         drifts against the scroll inside its parent
 * - `data-count`            counts up to its leading number ("100%", "13")
 *
 * Everything sits behind prefers-reduced-motion: no-preference, so with reduced
 * motion the page simply renders static.
 */
export function MotionMain({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Take over from the CSS failsafe that hides intro elements until JS runs.
      const intro = q<HTMLElement>("[data-intro]");
      intro.forEach((el) => el.removeAttribute("data-intro"));

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (intro.length) {
          gsap.fromTo(
            intro,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.15 },
          );
        }

        const fadeUps = q<HTMLElement>("[data-reveal]:not([data-reveal='clip'])");
        gsap.set(fadeUps, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(fadeUps, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true }),
        });

        const clips = q<HTMLElement>("[data-reveal='clip']");
        gsap.set(clips, { clipPath: "inset(100% 0% 0% 0%)" });
        ScrollTrigger.batch(clips, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.3,
              stagger: 0.12,
              ease: "power4.inOut",
              clearProps: "clipPath",
            }),
        });

        q<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6, scale: 1.14 },
            {
              yPercent: 6,
              scale: 1.14,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });


        const counters = q<HTMLElement>("[data-count]").flatMap((el) => {
          const match = el.textContent?.match(/^(\d+)([^]*)$/);
          if (!match) return [];
          const [original, digits, suffix] = match;
          const value = { n: 0 };
          el.textContent = `0${suffix}`;
          gsap.to(value, {
            n: Number(digits),
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => {
              el.textContent = `${Math.round(value.n)}${suffix}`;
            },
          });
          return [{ el, original }];
        });

        // Put the server-rendered numbers back when the media query or route changes.
        return () => counters.forEach(({ el, original }) => (el.textContent = original));
      });

      // Web fonts change line heights; re-measure trigger positions once they land.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <main ref={root} className="flex-1">
      {children}
    </main>
  );
}
