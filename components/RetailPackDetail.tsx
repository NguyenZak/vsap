"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import type { UiStrings } from "@/lib/cms/types";

/** A retail pack with every text already in the page language. */
export type PackView = {
  name: string;
  flavor: string;
  pack: string;
  weights: string[];
  images: string[];
  ingredients: string;
  highlight: string;
  shelfLife: string;
  serving: string;
  storage: string;
  packer: string;
  packerAddress: string;
  nutrition: { energy: string; fat: string; carbs: string; protein: string };
};

type Props = { pack: PackView; t: UiStrings["retail"]; photoLabel: string; flip?: boolean };

/** One retail pack: switchable packshots on one side, label facts on the other. */
export function RetailPackDetail({ pack, t, photoLabel, flip = false }: Props) {
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

  const n = pack.nutrition;
  const hasNutrition = Boolean(n.energy || n.fat || n.carbs || n.protein);
  const alt = [pack.name, pack.flavor].filter(Boolean).join(" – ");

  return (
    <article className="grid gap-6 rounded-3xl bg-mist-50 p-3 lg:grid-cols-2 lg:gap-10 lg:p-4">
      <div className={flip ? "lg:order-2" : ""}>
        <div ref={stage} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white">
          {pack.images[shot] && (
            <img key={shot} data-shot src={pack.images[shot]} alt={alt} className="absolute inset-0 size-full object-contain" />
          )}
        </div>
        {pack.images.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {pack.images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setShot(i)}
                aria-label={`${photoLabel} ${i + 1}`}
                aria-pressed={i === shot}
                className="size-16 overflow-hidden rounded-xl border-2 border-transparent bg-white transition hover:border-mist-200 aria-pressed:border-forest-600 sm:size-20"
              >
                <img src={src} alt="" loading="lazy" className="size-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col p-3 lg:p-6">
        <p className="text-sm text-forest-600">{pack.pack}</p>
        <h3 className="heading mt-1 text-3xl text-forest-900 sm:text-4xl">
          {pack.name}
          {pack.flavor && <span className="accent block text-[1.05em] leading-tight text-ink-600">{pack.flavor}</span>}
        </h3>
        {pack.highlight && (
          <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-lime-300 px-3 py-1 text-xs font-medium text-forest-950">
            {pack.highlight}
          </p>
        )}

        <dl className="mt-6 divide-y divide-mist-200 border-y border-mist-200 text-sm">
          {pack.weights.length > 0 && (
            <Row label={t.sizes}>
              <span className="flex flex-wrap gap-1.5">
                {pack.weights.map((w) => (
                  <span key={w} className="rounded-full bg-white px-2.5 py-0.5 font-medium text-ink-900">
                    {w}
                  </span>
                ))}
              </span>
            </Row>
          )}
          {pack.ingredients && <Row label={t.ingredients}>{pack.ingredients}</Row>}
          {pack.shelfLife && <Row label={t.shelfLife}>{pack.shelfLife}</Row>}
          {pack.serving && <Row label={t.serving}>{pack.serving}</Row>}
          {pack.packer && (
            <Row label={t.packedBy}>
              {pack.packer}
              {pack.packerAddress && <span className="block text-ink-400">{pack.packerAddress}</span>}
            </Row>
          )}
        </dl>

        {hasNutrition && (
          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{t.nutrition}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                [t.energy, n.energy],
                [t.fat, n.fat],
                [t.carbs, n.carbs],
                [t.protein, n.protein],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white px-3 py-3 text-center">
                    <dd className="text-lg font-medium tracking-tight text-ink-900">{value}</dd>
                    <dt className="text-xs text-ink-600">{label}</dt>
                  </div>
                ))}
            </dl>
          </div>
        )}

        {pack.storage && (
          <p className="mt-auto pt-6 text-xs leading-relaxed text-ink-400">
            {t.storage}: {pack.storage}
          </p>
        )}
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
