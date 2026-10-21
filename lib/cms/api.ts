// Small helpers shared by the /api/admin route handlers.
import { sessionUser, type SessionUser } from "./auth";
import { CmsUnavailableError } from "./db";
import { can, roleInfo, type Permission } from "./roles";

/** Reject cross-site writes: the browser always sends Origin on POST/PUT/DELETE. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  return !origin || origin === new URL(req.url).origin;
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, { ...init, headers: { "Cache-Control": "no-store", ...init?.headers } });
}

const permissionText: Record<Permission, string> = {
  "content.read": "xem nội dung",
  "content.write": "sửa nội dung",
  "content.publish": "xuất bản",
  "media.delete": "xoá ảnh",
  inquiries: "xem yêu cầu báo giá",
  users: "quản lý tài khoản",
  audit: "xem nhật ký",
};

/**
 * Run a handler for a signed-in user who holds `perm` ("user" = any signed-in
 * user, null = public, e.g. login). Thrown errors become JSON error responses.
 */
export async function handle(req: Request, perm: Permission | "user" | null, fn: (user: SessionUser) => Promise<Response>) {
  // Read and drop the body of a refused request so the connection can be reused cleanly.
  const refuse = async (body: unknown, status: number) => {
    await req.arrayBuffer().catch(() => {});
    return json(body, { status });
  };
  if (req.method !== "GET" && req.method !== "HEAD" && !sameOrigin(req)) return refuse({ error: "Forbidden" }, 403);
  try {
    const user = perm === null ? null : await sessionUser(req.headers.get("cookie"));
    if (perm !== null && !user) return refuse({ error: "Unauthorized" }, 401);
    if (user && perm !== null && perm !== "user" && !can(user.role, perm)) {
      return refuse({ error: `Vai trò ${roleInfo[user.role].label} không có quyền ${permissionText[perm]}.` }, 403);
    }
    return await fn(user as SessionUser);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const status = e instanceof CmsUnavailableError ? 503 : 400;
    if (status === 503) console.error("[cms]", message);
    return json({ error: message }, { status });
  }
}

/** Client address for rate limits, hashed so the raw IP is never stored. */
export async function clientHash(req: Request, salt: string) {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
  return [...new Uint8Array(digest)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}
