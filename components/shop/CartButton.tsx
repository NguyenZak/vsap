"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "./CartProvider";
import { setCartTarget } from "./fly";

/** Header bag icon with the number of items; opens the cart drawer. */
export function CartButton() {
  const { t, count, setCartOpen } = useShop();
  return (
    <button
      ref={setCartTarget}
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label={count ? `${t.cart} (${count})` : t.cart}
      className="relative inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 group-data-solid/header:border-mist-200 group-data-solid/header:bg-mist-50 group-data-solid/header:text-ink-900 group-data-solid/header:hover:bg-white"
    >
      <ShoppingBag className="size-[18px]" />
      <AnimatePresence>
        {count > 0 && (
          // Keyed by count so every change pops the badge.
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-chili-600 px-1 text-[0.7rem] font-semibold text-white tabular-nums"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
