"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { formatPrice, type ShopItem } from "@/lib/shop";
import { useShop } from "./CartProvider";
import { QtyStepper } from "./Dialog";

/** Size picker, price, quantity and the two buy buttons (product page and quick view). */
export function BuyBox({ item, onAdded }: { item: ShopItem; onAdded?: () => void }) {
  const { t, locale, add } = useShop();
  const router = useRouter();
  const firstPriced = item.variants.find((v) => v.price !== null) ?? item.variants[0];
  const [weight, setWeight] = useState(firstPriced?.weight ?? "");
  const [qty, setQty] = useState(1);
  const variant = item.variants.find((v) => v.weight === weight);
  const buyable = !item.soldOut && variant?.price != null;

  const addToCart = (open: boolean) => {
    if (!buyable) return;
    add(item.id, weight, qty, open);
    onAdded?.();
  };

  return (
    <div>
      <div className="rounded-2xl bg-mist-50 px-5 py-4">
        <p className="text-xs text-ink-400">{t.price}</p>
        <p className="mt-0.5 text-3xl font-medium tracking-tight text-forest-900 tabular-nums">
          {variant?.price != null ? formatPrice(variant.price, locale) : t.contactPrice}
        </p>
      </div>

      {item.variants.length > 0 && (
        <fieldset className="mt-5">
          <legend className="text-sm text-ink-600">{t.size}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.variants.map((v) => (
              <label key={v.weight} className="cursor-pointer">
                <input type="radio" name={`size-${item.id}`} value={v.weight} checked={v.weight === weight} onChange={() => setWeight(v.weight)} className="peer sr-only" />
                <span className="flex flex-col rounded-xl border border-mist-200 bg-white px-4 py-2 text-sm transition peer-checked:border-forest-600 peer-checked:ring-1 peer-checked:ring-forest-600 peer-focus-visible:outline-2 peer-focus-visible:outline-forest-600 hover:border-forest-600/50">
                  <span className="font-medium text-ink-900">{v.weight}</span>
                  <span className="text-xs text-ink-600 tabular-nums">{v.price != null ? formatPrice(v.price, locale) : t.contactPrice}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {buyable ? (
        <>
          <div className="mt-5 flex items-center gap-4">
            <span className="text-sm text-ink-600">{t.quantity}</span>
            <QtyStepper value={qty} onChange={setQty} labels={t} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => addToCart(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-forest-900 px-5 py-3.5 text-sm font-medium text-forest-900 transition hover:bg-forest-900 hover:text-white"
            >
              <ShoppingBag className="size-4" />
              {t.addToCart}
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(false);
                router.push(`/${locale}/cart`);
              }}
              className="inline-flex items-center justify-center rounded-full bg-lime-300 px-5 py-3.5 text-sm font-medium text-forest-950 transition hover:bg-lime-400"
            >
              {t.buyNow}
            </button>
          </div>
        </>
      ) : (
        <Link
          href={`/${locale}/contact`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-forest-800"
        >
          <MessageCircle className="size-4" />
          {t.askPrice}
        </Link>
      )}
    </div>
  );
}
