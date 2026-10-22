// Retail shop helpers shared by the site, the order API and tests (no framework imports).
import type { Locale } from "./locales";
import type { L, RetailPack } from "./cms/types";

/** A retail pack with every text in the page language, as the shop components need it. */
export type ShopItem = {
  id: string;
  product: string;
  href: string;
  name: string;
  flavor: string;
  pack: string;
  highlight: string;
  images: string[];
  variants: { weight: string; price: number | null }[];
  soldOut: boolean;
};

/** What the browser keeps in the cart: prices are always looked up again. */
export type CartLine = { id: string; weight: string; qty: number };

export const MAX_QTY = 99;
export const MAX_LINES = 30;

const pick = (v: L | undefined, locale: Locale) => v?.[locale] || v?.vi || "";

export const packHref = (pack: Pick<RetailPack, "id" | "product">, locale: Locale) => `/${locale}/products/${pack.product}/${pack.id}`;

export function toShopItem(pack: RetailPack, locale: Locale): ShopItem {
  return {
    id: pack.id,
    product: pack.product,
    href: packHref(pack, locale),
    name: pick(pack.name, locale),
    flavor: pick(pack.flavor, locale),
    pack: pick(pack.pack, locale),
    highlight: pick(pack.highlight, locale),
    images: pack.images.map((i) => i.src).filter(Boolean),
    variants: pack.variants.map((v) => ({ weight: v.weight, price: v.price ?? null })),
    soldOut: pack.soldOut,
  };
}

/** "330.000₫" (vi) or "₫330,000" (en). */
export function formatPrice(vnd: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(vnd);
}

/** Lowest price among the sizes that have one; null when the pack is sold on request only. */
export function minPrice(item: Pick<ShopItem, "variants">) {
  const prices = item.variants.map((v) => v.price).filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
}

export const canBuy = (item: Pick<ShopItem, "variants" | "soldOut">) => !item.soldOut && minPrice(item) !== null;

/** The cart line's pack and size, if it can still be bought at a price. */
export function resolveLine(line: CartLine, items: ShopItem[]) {
  const item = items.find((i) => i.id === line.id);
  const variant = item?.variants.find((v) => v.weight === line.weight);
  if (!item || item.soldOut || !variant || variant.price === null) return null;
  return { item, price: variant.price, qty: clampQty(line.qty) };
}

export const clampQty = (n: unknown) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n)) || 1));

export type OrderItem = { id: string; name: string; weight: string; price: number; qty: number };

/**
 * Prices an order from the published catalogue. Lines that can no longer be
 * bought make the whole order invalid, so the customer never pays a price they
 * did not see.
 */
export function priceOrder(lines: unknown, packs: RetailPack[]): { items: OrderItem[]; total: number } | null {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES) return null;
  const items: OrderItem[] = [];
  for (const raw of lines) {
    if (!raw || typeof raw !== "object") return null;
    const { id, weight, qty } = raw as Record<string, unknown>;
    if (typeof id !== "string" || typeof weight !== "string" || typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return null;
    const pack = packs.find((p) => p.id === id);
    const variant = pack?.variants.find((v) => v.weight === weight);
    if (!pack || pack.soldOut || !variant?.price) return null;
    const name = [pack.name.vi, pack.flavor.vi].filter(Boolean).join(" – ");
    const same = items.find((i) => i.id === id && i.weight === weight);
    if (same) same.qty = Math.min(MAX_QTY, same.qty + qty);
    else items.push({ id, name, weight, price: variant.price, qty });
  }
  return { items, total: items.reduce((sum, i) => sum + i.price * i.qty, 0) };
}
