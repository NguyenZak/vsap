"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { UiStrings } from "@/lib/cms/types";
import type { Locale } from "@/lib/locales";
import { clampQty, MAX_LINES, resolveLine, type CartLine, type ShopItem } from "@/lib/shop";
import { CartDrawer } from "./CartDrawer";

type Shop = {
  locale: Locale;
  t: UiStrings["shop"];
  common: Pick<UiStrings["common"], "prev" | "next" | "photo">;
  /** Every retail pack, in the page language; cart lines are priced from this. */
  catalog: ShopItem[];
  lines: CartLine[];
  /** Lines that can still be bought, with their current price. */
  priced: { line: CartLine; item: ShopItem; price: number; qty: number }[];
  count: number;
  subtotal: number;
  add: (id: string, weight: string, qty?: number, open?: boolean) => void;
  setQty: (id: string, weight: string, qty: number) => void;
  remove: (id: string, weight: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  recent: string[];
  viewed: (id: string) => void;
  /** False until the cart and history have been read from the browser. */
  ready: boolean;
};

const ShopContext = createContext<Shop | null>(null);

export function useShop() {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error("useShop() outside <CartProvider>");
  return shop;
}

const CART_KEY = "vsap:cart";
const RECENT_KEY = "vsap:recent";
const MAX_RECENT = 12;

// Storage can be blocked (private mode, disabled cookies): the shop then works for this visit only.
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const same = (l: CartLine, id: string, weight: string) => l.id === id && l.weight === weight;

export function CartProvider({
  locale,
  t,
  common,
  catalog,
  children,
}: {
  locale: Locale;
  t: UiStrings["shop"];
  common: Shop["common"];
  catalog: ShopItem[];
  children: React.ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const stored = read<unknown>(CART_KEY, []);
    if (Array.isArray(stored)) {
      setLines(
        stored
          .filter((l): l is CartLine => typeof l?.id === "string" && typeof l?.weight === "string")
          .map((l) => ({ id: l.id, weight: l.weight, qty: clampQty(l.qty) }))
          .slice(0, MAX_LINES),
      );
    }
    const ids = read<unknown>(RECENT_KEY, []);
    if (Array.isArray(ids)) setRecent(ids.filter((id): id is string => typeof id === "string").slice(0, MAX_RECENT));
    setLoaded(true);
    // Keep tabs in step: adding to the cart in one tab updates the badge in the others.
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) setLines(read(CART_KEY, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (loaded) write(CART_KEY, lines);
  }, [lines, loaded]);

  const add = useCallback((id: string, weight: string, qty = 1, open = true) => {
    setLines((prev) => {
      const hit = prev.find((l) => same(l, id, weight));
      if (hit) return prev.map((l) => (l === hit ? { ...l, qty: clampQty(l.qty + qty) } : l));
      return [...prev, { id, weight, qty: clampQty(qty) }].slice(-MAX_LINES);
    });
    if (open) setCartOpen(true);
  }, []);

  const setQty = useCallback((id: string, weight: string, qty: number) => {
    setLines((prev) => prev.map((l) => (same(l, id, weight) ? { ...l, qty: clampQty(qty) } : l)));
  }, []);

  const remove = useCallback((id: string, weight: string) => setLines((prev) => prev.filter((l) => !same(l, id, weight))), []);
  const clear = useCallback(() => setLines([]), []);

  const viewed = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT);
      write(RECENT_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<Shop>(() => {
    const priced = lines.flatMap((line) => {
      const hit = resolveLine(line, catalog);
      return hit ? [{ line, ...hit }] : [];
    });
    return {
      locale,
      t,
      common,
      catalog,
      lines,
      priced,
      count: priced.reduce((n, p) => n + p.qty, 0),
      subtotal: priced.reduce((n, p) => n + p.price * p.qty, 0),
      add,
      setQty,
      remove,
      clear,
      cartOpen,
      setCartOpen,
      recent,
      viewed,
      ready: loaded,
    };
  }, [locale, t, common, catalog, lines, cartOpen, recent, loaded, add, setQty, remove, clear, viewed]);

  return (
    <ShopContext.Provider value={value}>
      {children}
      <CartDrawer />
    </ShopContext.Provider>
  );
}
