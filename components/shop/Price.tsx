"use client";

import { formatPrice, type ShopItem } from "@/lib/shop";
import { useShop } from "./CartProvider";

/**
 * Retail price (new price in red, the old one struck through beside it) and a wholesale
 * line that always reads "Liên hệ": wholesale prices are quoted on request, never shown.
 */
export function Price({ item, size }: { item: Pick<ShopItem, "price" | "oldPrice">; size: "card" | "large" }) {
  const { t, locale } = useShop();

  if (size === "card") {
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
          <span className="shrink-0 text-xs font-semibold text-forest-600 sm:text-sm">{t.contactPrice}</span>
        </p>
      </div>
    );
  }

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
        <span className="text-base font-semibold text-forest-600">{t.contactPrice}</span>
      </div>
    </div>
  );
}
