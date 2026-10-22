// Retail order types, labels and the Telegram alert, shared by the API and Studio (no Cloudflare imports).
import type { OrderItem } from "../shop";
import { esc, type Button } from "./telegram-format";

export const orderStatuses = ["new", "confirmed", "shipping", "done", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const orderStatusInfo: Record<OrderStatus, { label: string }> = {
  new: { label: "Mới" },
  confirmed: { label: "Đã xác nhận" },
  shipping: { label: "Đang giao" },
  done: { label: "Hoàn tất" },
  cancelled: { label: "Đã huỷ" },
};

export type OrderCustomer = { name: string; phone: string; email?: string; address: string; note?: string };

export type OrderData = { customer: OrderCustomer; items: OrderItem[]; total: number };

export type Order = {
  id: number;
  created_at: number;
  status: OrderStatus;
  data: OrderData;
  locale: string | null;
  source: string | null;
  note: string | null;
  updated_at: number | null;
  updated_by: string | null;
};

const vnd = (n: number) => `${n.toLocaleString("vi-VN")}₫`;
const digits = (s = "") => s.replace(/[^\d]/g, "");

export function orderAlert(order: { id: number | null; data: OrderData; locale?: string }, origin: string): { text: string; buttons: Button[][] } {
  const { customer: c, items, total } = order.data;
  const lines: string[] = ([
    `🛒 <b>Đơn hàng mới${order.id ? ` #${order.id}` : ""}</b> · ${vnd(total)}`,
    "",
    `👤 <b>${esc(c.name)}</b>`,
    `📞 ${esc(c.phone)}`,
    c.email && `✉️ ${esc(c.email)}`,
    `📍 ${esc(c.address)}`,
    "",
    ...items.map((i) => `• ${i.qty} × ${esc(i.name)} (${esc(i.weight)}) — ${vnd(i.price * i.qty)}`),
    c.note && "",
    c.note && `💬 <i>${esc(c.note.length > 600 ? `${c.note.slice(0, 600)}…` : c.note)}</i>`,
    "",
    `🌐 ${order.locale === "en" ? "Tiếng Anh" : "Tiếng Việt"} · Thanh toán khi nhận hàng`,
  ] as (string | false | undefined)[]).filter((l): l is string => typeof l === "string");

  const phone = digits(c.phone);
  const vnPhone = /^(0|84)\d{8,10}$/.test(phone) ? (phone.startsWith("84") ? `0${phone.slice(2)}` : phone) : null;
  const buttons: Button[][] = [[{ text: "Mở trong Studio", url: `${origin}/admin?view=orders${order.id ? `&id=${order.id}` : ""}` }]];
  if (vnPhone) buttons.push([{ text: "Zalo", url: `https://zalo.me/${vnPhone}` }]);
  return { text: lines.join("\n"), buttons };
}
