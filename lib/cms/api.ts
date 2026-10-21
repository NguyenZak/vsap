// Small helpers shared by the /api/admin route handlers.
import { CmsUnavailableError } from "./store";

/** Reject cross-site writes: the browser always sends Origin on POST/PUT/DELETE. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  return !origin || origin === new URL(req.url).origin;
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, { ...init, headers: { "Cache-Control": "no-store", ...init?.headers } });
}

/** Run a handler, turning thrown errors into JSON error responses. */
export async function handle(req: Request, fn: () => Promise<Response>) {
  if (req.method !== "GET" && !sameOrigin(req)) return json({ error: "Forbidden" }, { status: 403 });
  try {
    return await fn();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const status = e instanceof CmsUnavailableError ? 503 : 400;
    if (status === 503) console.error("[cms]", message);
    return json({ error: message }, { status });
  }
}
