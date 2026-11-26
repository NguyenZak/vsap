"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Eye, MessageCircle, ShoppingBag } from "lucide-react";
import { canBuy, discountPercent, type ShopItem } from "@/lib/shop";
import { BuyBox } from "./BuyBox";
import { useShop } from "./CartProvider";
import { CloseButton, Dialog } from "./Dialog";
import { Gallery } from "./Gallery";
import { Price } from "./Price";

/** Retail packs as shop cards (grid or horizontal slider), with a quick-view popup. */
export function ProductGrid({
  items,
  reveal = true,
  layout = "grid",
  heading,
}: {
  items: ShopItem[];
  reveal?: boolean;
  layout?: "grid" | "slider";
  heading?: string;
}) {
  const [quick, setQuick] = useState<ShopItem | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const { t, common } = useShop();

  const slideBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(260, el.clientWidth * 0.85), behavior: "smooth" });
  };

  const isSlider = layout === "slider";

  return (
    <>
      {isSlider && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {heading ? <h3 className="font-display text-xl font-semibold text-heading sm:text-2xl">{heading}</h3> : <span />}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => slideBy(-1)}
              aria-label={common.prev}
              className="grid size-9 place-items-center rounded-full bg-surface text-ink-900 shadow-sm ring-1 ring-mist-200 transition hover:bg-sun-400"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => slideBy(1)}
              aria-label={common.next}
              className="grid size-9 place-items-center rounded-full bg-surface text-ink-900 shadow-sm ring-1 ring-mist-200 transition hover:bg-sun-400"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <ul
        ref={trackRef}
        className={
          isSlider
            ? "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4"
            : "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        }
      >
        {items.map((item, i) => (
          // Cards rise in, staggered along the row, as they scroll into view (Motion).
          <motion.li
            key={item.id}
            initial={!isSlider && reveal ? { opacity: 0, y: 40 } : false}
            whileInView={!isSlider ? { opacity: 1, y: 0 } : undefined}
            viewport={!isSlider ? { once: true, margin: "0px 0px -10% 0px" } : undefined}
            transition={{ type: "spring", stiffness: 140, damping: 20, delay: (i % 4) * 0.08 }}
            className={
              isSlider
                ? "w-[calc((100%-0.75rem)/2)] shrink-0 snap-start md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
                : undefined
            }
          >
            <ProductCard
              item={item}
              onQuickView={(e) => {
                setOrigin(e ? { x: e.clientX, y: e.clientY } : null);
                setQuick(item);
              }}
            />
          </motion.li>
        ))}
      </ul>

      <Dialog open={quick !== null} onClose={() => setQuick(null)} label={quick?.name ?? t.quickView} variant="modal" origin={origin}>
        {quick && <QuickView item={quick} onClose={() => setQuick(null)} />}
      </Dialog>
    </>
  );
}

function ProductCard({ item, onQuickView }: { item: ShopItem; onQuickView: (e?: React.MouseEvent) => void }) {
  const { t, locale, add, frame } = useShop();
  // Slight 3D tilt toward the pointer while hovering (off for reduced motion and touch).
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 220, damping: 18 });
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 220, damping: 18 });
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const untilt = () => {
    px.set(0.5);
    py.set(0.5);
  };
  // With a frame the photo shrinks into the frame's open area, clear of its bottom badges.
  // (an <img> ignores opposite insets, so the box needs an explicit width and height)
  const fit = frame ? "left-[9%] top-[5%] h-[75%] w-[82%]" : "inset-0 size-full p-3";
  const [front, back] = item.images;
  const discount = discountPercent(item);

  return (
    <motion.article
      onPointerMove={tilt}
      onPointerLeave={untilt}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group/card flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-mist-200 transition-[box-shadow] hover:shadow-xl hover:shadow-forest-950/10 hover:ring-forest-600/30"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <Link href={item.href} tabIndex={-1} aria-hidden className="absolute inset-0">
          {front && (
            <img
              src={front}
              alt=""
              loading="lazy"
              decoding="async"
              className={`absolute ${fit} object-contain transition duration-700 group-hover/card:scale-105 ${back ? "group-hover/card:opacity-0" : ""}`}
            />
          )}
          {back && (
            <img
              src={back}
              alt=""
              loading="lazy"
              decoding="async"
              className={`absolute ${fit} scale-95 object-contain opacity-0 transition duration-700 group-hover/card:scale-100 group-hover/card:opacity-100`}
            />
          )}
        </Link>
        {frame && <img src={frame} alt="" aria-hidden decoding="async" className="pointer-events-none absolute inset-0 size-full select-none" />}
        {discount !== null && !item.soldOut && (
          <span className="pointer-events-none absolute top-2.5 left-2.5 rounded-full bg-chili-600 px-2.5 py-1 text-xs font-semibold text-white tabular-nums">-{discount}%</span>
        )}
        {item.soldOut && (
          <span className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-chili-600 px-3 py-1.5 text-xs font-medium text-white shadow">{t.soldOut}</span>
        )}
        <button
          type="button"
          onClick={(e) => onQuickView(e)}
          aria-label={`${t.quickView}: ${item.name}`}
          className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-surface/90 text-ink-900 shadow-sm ring-1 ring-mist-200 transition hover:bg-sun-400 sm:translate-y-1 sm:opacity-0 sm:group-hover/card:translate-y-0 sm:group-hover/card:opacity-100 sm:focus-visible:opacity-100"
        >
          <Eye className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col border-t border-mist-100 p-3 sm:p-4">
        <h3 className="line-clamp-2 font-display text-[13px] leading-snug font-semibold text-ink-900 sm:text-base">
          <Link href={item.href} className="hover:text-forest-600">
            {item.name}
          </Link>
        </h3>
        {item.flavor && <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-600 sm:text-sm">{item.flavor}</p>}
        <div className="mt-2.5">
          <Price item={item} size="card" />
        </div>

        <div className="mt-auto pt-3">
          {canBuy(item) ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={(e) => add(item.id, 1, true, e.currentTarget.closest("article")?.querySelector("img"))}
              className="btn btn-primary inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-sun-400 px-2.5 py-2 text-xs font-medium whitespace-nowrap text-forest-950 transition hover:bg-sun-500 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              <ShoppingBag className="size-3.5 shrink-0 sm:size-4" />
              {t.addToCart}
            </motion.button>
          ) : (
            <Link
              href={item.soldOut ? item.href : `/${locale}/contact`}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-mist-200 px-2.5 py-2 text-xs font-medium whitespace-nowrap text-ink-900 transition hover:border-forest-900 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              {item.soldOut ? <ArrowUpRight className="size-3.5 shrink-0 sm:size-4" /> : <MessageCircle className="size-3.5 shrink-0 sm:size-4" />}
              {item.soldOut ? t.details : t.askPrice}
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function QuickView({ item, onClose }: { item: ShopItem; onClose: () => void }) {
  const { t } = useShop();
  return (
    <div className="relative grid items-start gap-5 p-4 sm:p-6 md:grid-cols-2 md:gap-8 md:p-8">
      <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
        <CloseButton label={t.continueShopping} onClick={onClose} />
      </div>
      <Gallery images={item.images} alt={[item.name, item.flavor].filter(Boolean).join(" – ")} />
      <div className="flex min-w-0 flex-col">
        <div className="md:pr-12">
          <h2 className="heading text-xl leading-snug text-heading sm:text-2xl">
            {item.name}
            {item.flavor && <span className="accent mt-0.5 block text-[0.95em] leading-tight text-ink-600">{item.flavor}</span>}
          </h2>
        </div>
        <p className="mt-2.5 text-sm text-ink-600">
          {t.status}: <span className={item.soldOut ? "font-medium text-chili-600" : "font-medium text-forest-600"}>{item.soldOut ? t.soldOut : t.inStock}</span>
        </p>
        <div className="mt-4">
          <BuyBox item={item} onAdded={onClose} />
        </div>
        <Link href={item.href} onClick={onClose} className="group mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-heading hover:text-forest-600">
          {t.details}
          <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
        </Link>
      </div>
    </div>
  );
}
