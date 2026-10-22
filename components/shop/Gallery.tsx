"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShop } from "./CartProvider";

/** Packshots: thumbnails down the side (along the bottom on phones) and one large image with arrows. */
export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const labels = useShop().common;
  const [i, setI] = useState(0);
  const n = images.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  if (n === 0) return <div className="aspect-square rounded-2xl bg-mist-50" />;

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {n > 1 && (
        <ul className="no-scrollbar flex gap-2 overflow-x-auto sm:max-h-[34rem] sm:flex-col sm:overflow-y-auto">
          {images.map((src, k) => (
            <li key={`${src}-${k}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={`${labels.photo} ${k + 1}`}
                aria-pressed={k === i}
                className="block size-16 overflow-hidden rounded-xl border-2 border-transparent bg-mist-50 transition hover:border-mist-200 aria-pressed:border-forest-600 sm:size-20"
              >
                <img src={src} alt="" loading="lazy" className="size-full object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="group relative aspect-square flex-1 overflow-hidden rounded-2xl bg-mist-50">
        <img key={i} src={images[i]} alt={alt} className="absolute inset-0 size-full object-contain p-4 motion-safe:animate-[shop-fade-in_0.4s_ease-out] sm:p-8" />
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={labels.prev}
              className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={labels.next}
              className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
