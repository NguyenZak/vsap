"use client";

import { ShoppingBag } from "lucide-react";
import { useShop } from "./CartProvider";

/** Header bag icon with the number of items; opens the cart drawer. */
export function CartButton() {
  const { t, count, setCartOpen } = useShop();
  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label={count ? `${t.cart} (${count})` : t.cart}
      className="relative inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 group-data-solid/header:border-mist-200 group-data-solid/header:bg-mist-50 group-data-solid/header:text-ink-900 group-data-solid/header:hover:bg-white"
    >
      <ShoppingBag className="size-[18px]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-chili-600 px-1 text-[0.7rem] font-semibold text-white tabular-nums">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
