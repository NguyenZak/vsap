"use client";

import { formatPrice, type ShopItem } from "@/lib/shop";
import { useShop } from "./CartProvider";

/** New price in red with the old one struck through beside it, plus an optional wholesale price line. */
export function Price({ item, size }: { item: Pick<ShopItem, "price" | "oldPrice" | "wholesalePrice">; size: "card" | "large" }) {
  const { t, locale } = useShop();
  const hasWholesale = item.wholesalePrice !== null;

  if (size === "card" && hasWholesale) {
    return (
      <div className="space-y-1 tabular-nums">
        <p className="flex items-baseline justify-between gap-1.5">
          <span className="truncate text-[11px] text-ink-600 sm:text-xs">{t.retailPrice}</span>
          <span className="flex shrink-0 items-baseline gap-1">
            {item.price === null ? (
              <span className="text-sm font-semibold text-heading sm:text-base">{t.contactPrice}</span>
            ) : (
              <>
                <span className="text-sm font-semibold text-chili-600 sm:text-base">{formatPrice(item.price, locale)}</span>
                {item.oldPrice !== null && (
                  <del className="text-[11px] text-ink-400 sm:text-xs">
                    <span className="sr-only">{t.oldPrice}: </span>
                    {formatPrice(item.oldPrice, locale)}
                  </del>
                )}
              </>
            )}
          </span>
        </p>
        <p className="flex items-baseline justify-between gap-1.5">
          <span className="truncate text-[11px] text-ink-600 sm:text-xs">{t.wholesalePrice}</span>
          <span className="shrink-0 text-xs font-semibold text-forest-600 sm:text-sm">{formatPrice(item.wholesalePrice!, locale)}</span>
        </p>
      </div>
    );
  }

  const retailLine =
    item.price === null ? (
      <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        {hasWholesale && <span className="text-sm text-ink-600">{t.retailPrice}:</span>}
        <span className={`font-semibold text-heading ${size === "large" ? "text-3xl tracking-tight" : "text-base"}`}>{t.contactPrice}</span>
      </p>
    ) : (
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums">
        {hasWholesale && <span className="text-sm text-ink-600">{t.retailPrice}:</span>}
        <span className={`font-semibold text-chili-600 ${size === "large" ? "text-3xl tracking-tight" : "text-base"}`}>{formatPrice(item.price, locale)}</span>
        {item.oldPrice !== null && (
          <del className={`text-ink-400 ${size === "large" ? "text-lg" : "text-xs sm:text-sm"}`}>
            <span className="sr-only">{t.oldPrice}: </span>
            {formatPrice(item.oldPrice, locale)}
          </del>
        )}
      </p>
    );

  if (!hasWholesale) return retailLine;

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 tabular-nums">
        <span className="text-sm text-ink-600">{t.retailPrice}:</span>
        <span className="flex items-baseline gap-2">
          {item.price === null ? (
            <span className="text-2xl font-semibold tracking-tight text-heading sm:text-3xl">{t.contactPrice}</span>
          ) : (
            <>
              <span className="text-2xl font-semibold tracking-tight text-chili-600 sm:text-3xl">{formatPrice(item.price, locale)}</span>
              {item.oldPrice !== null && (
                <del className="text-base text-ink-400 sm:text-lg">
                  <span className="sr-only">{t.oldPrice}: </span>
                  {formatPrice(item.oldPrice, locale)}
                </del>
              )}
            </>
          )}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 tabular-nums">
        <span className="text-sm text-ink-600">{t.wholesalePrice}:</span>
        <span className="text-base font-semibold text-forest-600">{formatPrice(item.wholesalePrice!, locale)}</span>
      </div>
    </div>
  );
}
