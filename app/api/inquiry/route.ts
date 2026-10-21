import { env } from "cloudflare:workers";

type Inquiry = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  product?: string;
  quantity?: string;
  message: string;
};

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

  // Chuyển tiếp yêu cầu tới webhook (Slack, Google Apps Script, CRM…) nếu đã cấu hình.
  // Đặt bằng: npx cf workers secrets update INQUIRY_WEBHOOK_URL
  const webhook = (env as Record<string, unknown>).INQUIRY_WEBHOOK_URL;
  if (typeof webhook === "string" && webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...inquiry, receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) {
      console.error("Inquiry webhook failed", res.status);
      return Response.json({ ok: false }, { status: 502 });
    }
  } else {
    console.log("New inquiry (no INQUIRY_WEBHOOK_URL configured)", inquiry);
  }

  return Response.json({ ok: true });
}
