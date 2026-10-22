import { clientHash } from "@/lib/cms/api";
import { notifyOrder } from "@/lib/cms/notify";
import type { OrderCustomer } from "@/lib/cms/order-format";
import { recentOrdersFrom, saveOrder } from "@/lib/cms/orders";
import { getPublishedContent } from "@/lib/cms/store";
import { priceOrder } from "@/lib/shop";

/** Orders allowed per visitor address in the window below. */
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60_000;

const LIMITS: Record<keyof OrderCustomer, number> = { name: 120, phone: 40, email: 160, address: 400, note: 2000 };

function parseCustomer(raw: unknown): OrderCustomer | null {
  if (!raw || typeof raw !== "object") return null;
  const out: Record<string, string> = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = (raw as Record<string, unknown>)[key];
    if (value === undefined || value === "") continue;
    if (typeof value !== "string" || value.length > max) return null;
    out[key] = value.trim();
  }
  if (!out.name || !out.address || out.phone?.replace(/[^\d]/g, "").length < 8) return null;
  if (out.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) return null;
  return out as OrderCustomer;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  // Honeypot filled → pretend success so bots don't retry.
  if (body?.website) return Response.json({ ok: true, id: null });

  const customer = parseCustomer(body.customer);
  if (!customer) return Response.json({ ok: false, reason: "invalid" }, { status: 422 });
  // Prices always come from the published catalogue, never from the browser.
  const priced = priceOrder(body.items, (await getPublishedContent()).retailPacks);
  if (!priced) return Response.json({ ok: false, reason: "items" }, { status: 409 });

  const locale = body.locale === "en" ? "en" : body.locale === "vi" ? "vi" : undefined;
  const source = typeof body.page === "string" && body.page.startsWith("/") ? body.page.slice(0, 300) : undefined;
  const data = { customer, ...priced };

  let id: number | null = null;
  try {
    const ipHash = await clientHash(request, `order:${new Date().toISOString().slice(0, 10)}`);
    if ((await recentOrdersFrom(ipHash, WINDOW_MS)) >= MAX_PER_WINDOW) return Response.json({ ok: false }, { status: 429 });
    id = await saveOrder(data, { locale, source, ipHash });
  } catch (e) {
    console.error("Order could not be stored", e);
  }

  let alerted = false;
  try {
    alerted = await notifyOrder({ id, data, locale }, new URL(request.url).origin);
  } catch (e) {
    console.error("Telegram alert failed", e);
  }

  // Only report failure when the order reached nobody.
  if (id === null && !alerted) return Response.json({ ok: false }, { status: 502 });
  return Response.json({ ok: true, id, total: priced.total });
}
