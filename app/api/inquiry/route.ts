import { env } from "cloudflare:workers";
import { clientHash } from "@/lib/cms/api";
import type { InquiryData as Inquiry } from "@/lib/cms/inquiry-format";
import { recentFrom, saveInquiry } from "@/lib/cms/inquiries";

/** Submissions allowed per visitor address in the window below. */
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60_000;

const LIMITS: Record<keyof Inquiry, number> = {
  name: 120,
  company: 160,
  email: 160,
  phone: 40,
  country: 80,
  product: 20,
  quantity: 120,
  message: 4000,
};

function parse(body: unknown): Inquiry | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = raw[key];
    if (value === undefined || value === "") continue;
    if (typeof value !== "string" || value.length > max) return null;
    out[key] = value.trim();
  }
  if (!out.name || !out.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email ?? "")) return null;
  return out as Inquiry;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Honeypot filled → pretend success so bots don't retry.
  if ((body as Record<string, unknown>)?.website) return Response.json({ ok: true });

  const inquiry = parse(body);
  if (!inquiry) return Response.json({ ok: false }, { status: 422 });

  const raw = body as Record<string, unknown>;
  const locale = raw.locale === "en" ? "en" : raw.locale === "vi" ? "vi" : undefined;
  const source = typeof raw.page === "string" && raw.page.startsWith("/") ? raw.page.slice(0, 300) : undefined;
  const country = (request as Request & { cf?: { country?: string } }).cf?.country ?? request.headers.get("cf-ipcountry") ?? undefined;

  // 1) Keep it in the Studio inbox (Yêu cầu báo giá).
  let stored = false;
  try {
    // Daily salt: the same visitor can be rate-limited today, but hashes can't be linked across days.
    const ipHash = await clientHash(request, `inquiry:${new Date().toISOString().slice(0, 10)}`);
    if ((await recentFrom(ipHash, WINDOW_MS)) >= MAX_PER_WINDOW) return Response.json({ ok: false }, { status: 429 });
    await saveInquiry(inquiry, { locale, source, country, ipHash });
    stored = true;
  } catch (e) {
    console.error("Inquiry could not be stored", e);
  }

  // 2) Also forward to a webhook (Slack, Google Apps Script, CRM…) if one is configured.
  // Đặt bằng: npx cf workers secrets update INQUIRY_WEBHOOK_URL
  const webhook = (env as Record<string, unknown>).INQUIRY_WEBHOOK_URL;
  let forwarded = false;
  if (typeof webhook === "string" && webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...inquiry, locale, page: source, receivedAt: new Date().toISOString() }),
      });
      forwarded = res.ok;
      if (!res.ok) console.error("Inquiry webhook failed", res.status);
    } catch (e) {
      console.error("Inquiry webhook failed", e);
    }
  }

  // Only report failure when the request was neither stored nor forwarded.
  if (!stored && !forwarded) return Response.json({ ok: false }, { status: 502 });
  return Response.json({ ok: true });
}
