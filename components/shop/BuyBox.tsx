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

  const addToCart = (open: boolean, e?: React.MouseEvent) => {
    if (!buyable) return;
    // The photo to fly into the cart: the big gallery image beside this buy box.
    const scope = e?.currentTarget.closest("dialog, section");
    add(item.id, qty, open, scope?.querySelector<HTMLImageElement>("[data-main-photo]"));
    onAdded?.();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-1 rounded-xl bg-mist-50 px-5 py-4">
        <p className="w-20 shrink-0 text-sm text-ink-600">{t.price}:</p>
        <Price item={item} size="large" />
      </div>

      {buyable ? (
        <>
          <div className="mt-5 flex items-center gap-8 px-5">
            <span className="w-20 shrink-0 text-sm text-ink-600">{t.quantity}:</span>
            <QtyStepper value={qty} onChange={setQty} labels={t} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={(e) => addToCart(true, e)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-chili-600 px-3 py-3 text-sm font-semibold tracking-wide text-chili-600 uppercase transition hover:bg-chili-600/5"
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
              className="inline-flex items-center justify-center rounded-lg border-2 border-chili-600 bg-chili-600 px-3 py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-chili-600/90"
            >
              {t.buyNow}
            </button>
          </div>
        </>
      ) : (
        <Link
          href={`/${locale}/contact`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest-900 px-5 py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-forest-800"
        >
          <MessageCircle className="size-4" />
          {t.askPrice}
        </Link>
      )}
    </div>
  );
}
