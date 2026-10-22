"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { canBuy, type ShopItem } from "@/lib/shop";
import { useShop } from "./CartProvider";
import { QtyStepper } from "./Dialog";
import { Price } from "./Price";

/** Price, quantity and the two buy buttons (product page and quick view). */
export function BuyBox({ item, onAdded }: { item: ShopItem; onAdded?: () => void }) {
  const { t, locale, add } = useShop();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const buyable = canBuy(item);

  const addToCart = (open: boolean) => {
    if (!buyable) return;
    add(item.id, qty, open);
    onAdded?.();
  };

  return (
    <div>
      <div className="rounded-2xl bg-mist-50 px-5 py-4">
        <p className="text-xs text-ink-400">{t.price}</p>
        <div className="mt-0.5">
          <Price item={item} size="large" />
        </div>
      </div>

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
              className="inline-flex items-center justify-center rounded-full bg-sun-400 px-5 py-3.5 text-sm font-medium text-forest-950 transition hover:bg-sun-500"
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
