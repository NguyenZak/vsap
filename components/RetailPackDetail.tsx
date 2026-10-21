"use client";

import { useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { packers, retailFacts, type RetailPack } from "@/lib/retail";

type Props = { pack: RetailPack; locale: Locale; t: Dictionary["home"]["retail"]; flip?: boolean };

/** One retail pack: switchable packshots on one side, label facts on the other. */
export function RetailPackDetail({ pack, locale, t, flip = false }: Props) {
  const [shot, setShot] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo("[data-shot]", { autoAlpha: 0, scale: 0.94, y: 12 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out" });
      });
    },
    { scope: stage, dependencies: [shot], revertOnUpdate: true },
  );

  const packer = packers[pack.slug];
  const n = pack.nutrition;

  return (
    <article className="grid gap-6 rounded-3xl bg-mist-50 p-3 lg:grid-cols-2 lg:gap-10 lg:p-4">
      <div className={flip ? "lg:order-2" : ""}>
        <div ref={stage} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white">
          <img
            key={shot}
            data-shot
            src={pack.images[shot]}
            alt={`${pack.name[locale]} – ${pack.flavor[locale]}`}
            className="absolute inset-0 size-full object-contain"
          />
        </div>
        <div className="mt-3 flex gap-2">
          {pack.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setShot(i)}
              aria-label={`${t.photo} ${i + 1}`}
              aria-pressed={i === shot}
              className="size-16 overflow-hidden rounded-xl border-2 border-transparent bg-white transition hover:border-mist-200 aria-pressed:border-forest-600 sm:size-20"
            >
              <img src={src} alt="" loading="lazy" className="size-full object-contain" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col p-3 lg:p-6">
        <p className="text-sm text-forest-600">{pack.pack[locale]}</p>
        <h3 className="heading mt-1 text-3xl text-forest-900 sm:text-4xl">
          {pack.name[locale]}
          <span className="accent block text-[1.05em] leading-tight text-ink-600">{pack.flavor[locale]}</span>
        </h3>
        {pack.highlight && (
          <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-lime-300 px-3 py-1 text-xs font-medium text-forest-950">
            {pack.highlight[locale]}
          </p>
        )}

        <dl className="mt-6 divide-y divide-mist-200 border-y border-mist-200 text-sm">
          <Row label={t.sizes}>
            <span className="flex flex-wrap gap-1.5">
              {pack.weights.map((w) => (
                <span key={w} className="rounded-full bg-white px-2.5 py-0.5 font-medium text-ink-900">
                  {w}
                </span>
              ))}
            </span>
          </Row>
          <Row label={t.ingredients}>{pack.ingredients[locale]}</Row>
          <Row label={t.shelfLife}>{retailFacts.shelfLife[locale]}</Row>
          {pack.slug === "macadamia" && <Row label={t.serving}>{retailFacts.serving[locale]}</Row>}
          <Row label={t.packedBy}>
            {packer.name}
            <span className="block text-ink-400">{packer.address[locale]}</span>
          </Row>
        </dl>

        {n && (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{t.nutrition}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                [t.energy, n.energy],
                [t.fat, n.fat],
                [t.carbs, n.carbs],
                [t.protein, n.protein],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white px-3 py-3 text-center">
                  <dd className="text-lg font-medium tracking-tight text-ink-900">{value}</dd>
                  <dt className="text-xs text-ink-600">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        )}

        <p className="mt-auto pt-6 text-xs leading-relaxed text-ink-400">
          {t.storage}: {retailFacts.storage[locale]}
        </p>
      </div>
    </article>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-3">
      <dt className="text-ink-400">{label}</dt>
      <dd className="text-ink-900">{children}</dd>
    </div>
  );
}
