// Retail shop helpers shared by the site, the order API and tests (no framework imports).
import { localeInfo, pickText, type Locale } from "./locales";
import type { L, RetailPack } from "./cms/types";

/** A retail pack with every text in the page language, as the shop components need it. */
export type ShopItem = {
  id: string;
  product: string;
  href: string;
  name: string;
  flavor: string;
  highlight: string;
  images: string[];
  /** VND; null = sold on request. */
  price: number | null;
  /** Higher pre-discount price to show struck through, else null. */
  oldPrice: number | null;
  soldOut: boolean;
};

/** What the browser keeps in the cart: prices are always looked up again. */
export type CartLine = { id: string; qty: number };

export const MAX_QTY = 99;
export const MAX_LINES = 30;

const pick = (v: Partial<L> | undefined, locale: Locale) => pickText(v, locale);

/** Packs shown and sold on the website (Studio can hide a pack without deleting it). */
export const visiblePacks = <P extends Pick<RetailPack, "hidden">>(packs: P[]) => packs.filter((p) => !p.hidden);

export const packHref = (pack: Pick<RetailPack, "id" | "product">, locale: Locale) => `/${locale}/products/${pack.product}/${pack.id}`;

export function toShopItem(pack: RetailPack, locale: Locale): ShopItem {
  return {
    id: pack.id,
    product: pack.product,
    href: packHref(pack, locale),
    name: pick(pack.name, locale),
    flavor: pick(pack.flavor, locale),
    highlight: pick(pack.highlight, locale),
    images: pack.images.map((i) => i.src).filter(Boolean),
    price: pack.price ?? null,
    oldPrice: pack.price && pack.oldPrice && pack.oldPrice > pack.price ? pack.oldPrice : null,
    soldOut: pack.soldOut,
  };
}

/** "330.000 ₫" (vi), "₫330,000" (en)… in each language's number format. */
export function formatPrice(vnd: number, locale: Locale) {
  return new Intl.NumberFormat(localeInfo[locale].intl, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(vnd);
}

/** Whole-percent discount for the "-20%" badge, or null without an old price. */
export const discountPercent = (item: Pick<ShopItem, "price" | "oldPrice">) =>
  item.price && item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : null;

export const canBuy = (item: Pick<ShopItem, "price" | "soldOut">) => !item.soldOut && item.price !== null;

/** The cart line's pack, if it can still be bought at a price. */
export function resolveLine(line: CartLine, items: ShopItem[]) {
  const item = items.find((i) => i.id === line.id);
  if (!item || item.soldOut || item.price === null) return null;
  return { item, price: item.price, qty: clampQty(line.qty) };
}

export const clampQty = (n: unknown) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n)) || 1));

/** `weight` only appears on orders placed while packs still had sizes. */
export type OrderItem = { id: string; name: string; weight?: string; price: number; qty: number };

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
    const { id, qty } = raw as Record<string, unknown>;
    if (typeof id !== "string" || typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return null;
    const pack = packs.find((p) => p.id === id);
    if (!pack || pack.hidden || pack.soldOut || !pack.price) return null;
    const name = [pack.name.vi, pack.flavor.vi].filter(Boolean).join(" – ");
    const same = items.find((i) => i.id === id);
    if (same) same.qty = Math.min(MAX_QTY, same.qty + qty);
    else items.push({ id, name, price: pack.price, qty });
  }
  return { items, total: items.reduce((sum, i) => sum + i.price * i.qty, 0) };
}
