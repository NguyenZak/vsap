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

  const hasWholesale = item.wholesalePrice !== null;

  return (
    <div>
      {hasWholesale ? (
        <div className="rounded-xl border border-mist-200/60 bg-mist-50 px-4 py-3.5 sm:px-5 sm:py-4">
          <Price item={item} size="large" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-mist-200/60 bg-mist-50 px-4 py-3.5 sm:gap-x-8 sm:px-5 sm:py-4">
          <p className="w-20 shrink-0 text-sm text-ink-600">{t.price}:</p>
          <div className="min-w-0 flex-1">
            <Price item={item} size="large" />
          </div>
        </div>
      )}

      {buyable ? (
        <>
          <div className="mt-4 flex items-center justify-between gap-4 px-1 sm:mt-5 sm:justify-start sm:gap-8 sm:px-5">
            <span className="shrink-0 text-sm text-ink-600 sm:w-20">{t.quantity}:</span>
            <QtyStepper value={qty} onChange={setQty} labels={t} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-3">
            <button
              type="button"
              onClick={(e) => addToCart(true, e)}
              className="btn btn-buy-outline inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-chili-600 px-2.5 py-3 text-xs font-semibold tracking-wide text-chili-600 uppercase transition hover:bg-chili-600/5 sm:gap-2 sm:px-3 sm:text-sm"
            >
              <ShoppingBag className="size-4 shrink-0" />
              {t.addToCart}
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(false);
                router.push(`/${locale}/cart`);
              }}
              className="btn btn-buy inline-flex items-center justify-center rounded-lg border-2 border-chili-600 bg-chili-600 px-2.5 py-3 text-xs font-semibold tracking-wide text-white uppercase transition hover:bg-chili-600/90 sm:px-3 sm:text-sm"
            >
              {t.buyNow}
            </button>
          </div>
        </>
      ) : (
        <Link
          href={`/${locale}/contact`}
          className="btn btn-secondary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest-900 px-5 py-3.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-forest-800"
        >
          <MessageCircle className="size-4" />
          {t.askPrice}
        </Link>
      )}
    </div>
  );
}
