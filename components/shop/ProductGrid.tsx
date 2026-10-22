"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Eye, MessageCircle, ShoppingBag } from "lucide-react";
import { canBuy, discountPercent, type ShopItem } from "@/lib/shop";
import { BuyBox } from "./BuyBox";
import { useShop } from "./CartProvider";
import { CloseButton, Dialog } from "./Dialog";
import { Gallery } from "./Gallery";
import { Price } from "./Price";

/** Retail packs as shop cards, with a quick-view popup for picking a size without leaving the page. */
export function ProductGrid({ items, reveal = true }: { items: ShopItem[]; reveal?: boolean }) {
  const [quick, setQuick] = useState<ShopItem | null>(null);
  const { t } = useShop();

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.id} {...(reveal ? { "data-reveal": "" } : {})}>
            <ProductCard item={item} onQuickView={() => setQuick(item)} />
          </li>
        ))}
      </ul>

      <Dialog open={quick !== null} onClose={() => setQuick(null)} label={quick?.name ?? t.quickView} variant="modal">
        {quick && <QuickView item={quick} onClose={() => setQuick(null)} />}
      </Dialog>
    </>
  );
}

function ProductCard({ item, onQuickView }: { item: ShopItem; onQuickView: () => void }) {
  const { t, locale, add } = useShop();
  const [front, back] = item.images;
  const discount = discountPercent(item);

  return (
    <article className="group/card flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-mist-200 transition hover:shadow-lg hover:shadow-forest-950/5 hover:ring-forest-600/30">
      <div className="relative aspect-square overflow-hidden bg-white">
        <Link href={item.href} tabIndex={-1} aria-hidden className="absolute inset-0">
          {front && (
            <img
              src={front}
              alt=""
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 size-full object-contain p-3 transition duration-700 group-hover/card:scale-105 ${back ? "group-hover/card:opacity-0" : ""}`}
            />
          )}
          {back && (
            <img
              src={back}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full scale-95 object-contain p-3 opacity-0 transition duration-700 group-hover/card:scale-100 group-hover/card:opacity-100"
            />
          )}
        </Link>
        {discount !== null && !item.soldOut && (
          <span className="pointer-events-none absolute top-2.5 left-2.5 rounded-full bg-chili-600 px-2.5 py-1 text-xs font-semibold text-white tabular-nums">-{discount}%</span>
        )}
        {item.soldOut && (
          <span className="absolute right-2.5 bottom-2.5 rounded-full bg-chili-600 px-2.5 py-1 text-xs font-medium text-white">{t.soldOut}</span>
        )}
        <button
          type="button"
          onClick={onQuickView}
          aria-label={`${t.quickView}: ${item.name}`}
          className="absolute top-2 right-2 grid size-9 place-items-center rounded-full bg-white/90 text-ink-900 shadow-sm ring-1 ring-mist-200 transition hover:bg-sun-400 sm:translate-y-1 sm:opacity-0 sm:group-hover/card:translate-y-0 sm:group-hover/card:opacity-100 sm:focus-visible:opacity-100"
        >
          <Eye className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col border-t border-mist-100 p-3.5 sm:p-4">
        <h3 className="text-sm font-medium text-ink-900 sm:text-base">
          <Link href={item.href} className="hover:text-forest-600">
            {item.name}
          </Link>
        </h3>
        {item.flavor && <p className="mt-0.5 text-xs text-ink-600 sm:text-sm">{item.flavor}</p>}
        <div className="mt-2">
          <Price item={item} size="card" />
        </div>

        <div className="mt-auto pt-3">
          {canBuy(item) ? (
            <button
              type="button"
              onClick={() => add(item.id)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sun-400 px-3 py-2.5 text-xs font-medium text-forest-950 transition hover:bg-sun-500 sm:text-sm"
            >
              <ShoppingBag className="size-4" />
              {t.addToCart}
            </button>
          ) : (
            <Link
              href={item.soldOut ? item.href : `/${locale}/contact`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-mist-200 px-3 py-2.5 text-xs font-medium text-ink-900 transition hover:border-forest-900 sm:text-sm"
            >
              {item.soldOut ? <ArrowUpRight className="size-4" /> : <MessageCircle className="size-4" />}
              {item.soldOut ? t.details : t.askPrice}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function QuickView({ item, onClose }: { item: ShopItem; onClose: () => void }) {
  const { t } = useShop();
  return (
    <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-2 md:gap-8">
      <Gallery images={item.images} alt={[item.name, item.flavor].filter(Boolean).join(" – ")} />
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="heading text-3xl text-forest-900">
              {item.name}
              {item.flavor && <span className="accent block text-[1.05em] leading-tight text-ink-600">{item.flavor}</span>}
            </h2>
          </div>
          <CloseButton label={t.continueShopping} onClick={onClose} />
        </div>
        <p className="mt-3 text-sm text-ink-600">
          {t.status}: <span className={item.soldOut ? "font-medium text-chili-600" : "font-medium text-forest-600"}>{item.soldOut ? t.soldOut : t.inStock}</span>
        </p>
        <div className="mt-5">
          <BuyBox item={item} onAdded={onClose} />
        </div>
        <Link href={item.href} onClick={onClose} className="group mt-5 inline-flex items-center gap-1.5 self-start text-sm font-medium text-forest-900 hover:text-forest-600">
          {t.details}
          <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
        </Link>
      </div>
    </div>
  );
}
