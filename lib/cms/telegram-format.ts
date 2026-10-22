// Text and buttons of the Telegram alert for a new quote request. Pure, so it is unit-tested.
import type { InquiryData } from "./inquiry-format";

/** Telegram's HTML parse mode only needs &, < and > escaped. */
export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const productLabel: Record<string, string> = { cashew: "Hạt điều", macadamia: "Hạt macca", birdNest: "Yến sào", other: "Khác" };
const digits = (s = "") => s.replace(/[^\d]/g, "");

/** Site language of a submission, for the alert (Vietnamese when unknown). */
export const langLabel = (locale?: string | null) => ({ vi: "Tiếng Việt", en: "Tiếng Anh", zh: "Tiếng Trung" } as Record<string, string>)[locale ?? ""] ?? "Tiếng Việt";

export type InquiryAlert = { id: number | null; data: InquiryData; locale?: string; source?: string; country?: string };
export type Button = { text: string; url: string };

export function inquiryAlert(inq: InquiryAlert, origin: string): { text: string; buttons: Button[][] } {
  const d = inq.data;
  const lines: string[] = ([
    `🔔 <b>Yêu cầu báo giá mới${inq.id ? ` #${inq.id}` : ""}</b>`,
    "",
    `👤 <b>${esc(d.name)}</b>${d.company ? ` · ${esc(d.company)}` : ""}`,
    `✉️ ${esc(d.email)}`,
    d.phone && `📞 ${esc(d.phone)}`,
    (d.country || inq.country) && `🌍 ${esc([d.country, inq.country && `IP: ${inq.country}`].filter(Boolean).join(" · "))}`,
    (d.product || d.quantity) && `📦 ${esc([d.product && (productLabel[d.product] ?? d.product), d.quantity].filter(Boolean).join(" · "))}`,
    "",
    `💬 <i>${esc(d.message.length > 900 ? `${d.message.slice(0, 900)}…` : d.message)}</i>`,
    "",
    `🌐 ${langLabel(inq.locale)}${inq.source ? ` · ${esc(inq.source)}` : ""}`,
  ] as (string | false | undefined)[]).filter((l): l is string => typeof l === "string");

  const phone = digits(d.phone);
  const vnPhone = /^(0|84)\d{8,10}$/.test(phone) ? (phone.startsWith("84") ? `0${phone.slice(2)}` : phone) : null;
  const contact = [
    phone.length >= 8 && { text: "WhatsApp", url: `https://wa.me/${phone.startsWith("0") ? `84${phone.slice(1)}` : phone}` },
    vnPhone && { text: "Zalo", url: `https://zalo.me/${vnPhone}` },
  ].filter(Boolean) as Button[];
  const buttons = [[{ text: "Mở trong Studio", url: `${origin}/admin?view=inbox${inq.id ? `&id=${inq.id}` : ""}` }], ...(contact.length ? [contact] : [])];
  return { text: lines.join("\n"), buttons };
}
