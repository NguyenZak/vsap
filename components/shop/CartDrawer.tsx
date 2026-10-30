"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { formatPrice } from "@/lib/shop";
import { useShop } from "./CartProvider";
import { CloseButton, Dialog, QtyStepper } from "./Dialog";

/** Slide-in cart, opened from the header or right after adding a product. */
export function CartDrawer() {
  const { t, locale, priced, subtotal, count, setQty, remove, cartOpen, setCartOpen } = useShop();
  const close = () => setCartOpen(false);

  return (
    <Dialog open={cartOpen} onClose={close} label={t.cart} variant="drawer">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-mist-200 px-5 py-4 sm:px-6">
          <h2 className="heading text-2xl text-heading">
            {t.cart}
            {count > 0 && <span className="ml-2 text-base text-ink-400 tabular-nums">({count})</span>}
          </h2>
          <CloseButton label={t.continueShopping} onClick={close} />
        </div>

        {priced.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-mist-100 text-forest-600">
              <ShoppingBag className="size-7" />
            </span>
            <p className="text-ink-600">{t.cartEmpty}</p>
            <Link href={`/${locale}/products`} onClick={close} className="rounded-full bg-forest-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-forest-800">
              {t.continueShopping}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-mist-200 overflow-y-auto px-5 sm:px-6">
              <AnimatePresence initial={false}>
              {priced.map(({ line, item, price, qty }) => (
                <motion.li
                  key={line.id}
                  layout
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="flex gap-4 overflow-hidden py-4"
                >
                  <Link href={item.href} onClick={close} className="size-20 shrink-0 overflow-hidden rounded-xl bg-mist-50">
                    {item.images[0] && <img src={item.images[0]} alt="" className="size-full object-contain p-1" />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={item.href} onClick={close} className="block text-sm font-medium text-ink-900 hover:text-forest-600">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-600">{item.flavor}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <QtyStepper size="sm" value={qty} onChange={(n) => setQty(line.id, n)} labels={t} />
                      <p className="text-sm font-medium tabular-nums">{formatPrice(price * qty, locale)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    aria-label={`${t.remove} ${item.name}`}
                    className="-mr-1 grid size-8 shrink-0 place-items-center self-start rounded-full text-ink-400 transition hover:bg-mist-100 hover:text-chili-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </motion.li>
              ))}
              </AnimatePresence>
            </ul>

            <div className="border-t border-mist-200 bg-mist-50 px-5 py-5 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-600">{t.subtotal}</span>
                <span className="text-xl font-medium tabular-nums">{formatPrice(subtotal, locale)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-400">{t.shippingNote}</p>
              <Link
                href={`/${locale}/cart`}
                onClick={close}
                className="btn btn-primary mt-4 flex items-center justify-center rounded-full bg-sun-400 px-5 py-3.5 font-medium text-forest-950 transition hover:bg-sun-500"
              >
                {t.checkout}
              </Link>
              <button type="button" onClick={close} className="mt-2 w-full py-2 text-sm text-ink-600 hover:text-heading">
                {t.continueShopping}
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
