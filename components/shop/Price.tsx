"use client";

import { formatPrice, type ShopItem } from "@/lib/shop";
import { useShop } from "./CartProvider";

/** New price in red with the old one struck through beside it; "Liên hệ" when there is no price. */
export function Price({ item, size }: { item: Pick<ShopItem, "price" | "oldPrice">; size: "card" | "large" }) {
  const { t, locale } = useShop();
  if (item.price === null) {
    return <p className={`font-semibold text-heading ${size === "large" ? "text-3xl tracking-tight" : "text-base"}`}>{t.contactPrice}</p>;
  }
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums">
      <span className={`font-semibold text-chili-600 ${size === "large" ? "text-3xl tracking-tight" : "text-base"}`}>{formatPrice(item.price, locale)}</span>
      {item.oldPrice !== null && (
        <del className={`text-ink-400 ${size === "large" ? "text-lg" : "text-xs sm:text-sm"}`}>
          <span className="sr-only">{t.oldPrice}: </span>
          {formatPrice(item.oldPrice, locale)}
        </del>
      )}
    </p>
  );
}
