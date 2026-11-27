import { json, sameOrigin } from "@/lib/cms/api";
import { parseSubscription, publicKey, subscribeVisitor, visitorTopicsOf } from "@/lib/cms/push";
import { isLocale } from "@/lib/locales";

/** The VAPID public key browsers subscribe with. */
export async function GET() {
  try {
    return json({ publicKey: await publicKey() });
  } catch (e) {
    console.error("[push]", e);
    return json({ error: "unavailable" }, { status: 503 });
  }
}

type Body = { action?: string; subscription?: unknown; endpoint?: unknown; topics?: unknown; order?: { id?: unknown; token?: unknown }; locale?: unknown };

/**
 * Visitors: { action: "subscribe", subscription, topics: ["news", "broadcast"] | order: { id, token }, locale }
 *           { action: "unsubscribe", subscription }   (news + offers only; order updates stay)
 *           { action: "status", endpoint }
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, { status: 403 });
  try {
    const body = (await req.json()) as Body;
    const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : undefined;
    if (body.action === "status") {
      return json({ topics: typeof body.endpoint === "string" ? await visitorTopicsOf(body.endpoint) : [] });
    }
    const sub = parseSubscription(body.subscription);
    if (!sub) return json({ error: "invalid" }, { status: 422 });
    if (body.action === "subscribe") return json({ topics: await subscribeVisitor(sub, { topics: body.topics, order: body.order, locale }) });
    if (body.action === "unsubscribe") return json({ topics: await subscribeVisitor(sub, { topics: [], locale }) });
    return json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
