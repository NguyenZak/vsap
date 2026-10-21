import { adminConfigured, createSession, login, sessionCookie } from "@/lib/cms/auth";
import { handle, json } from "@/lib/cms/api";
import { OWNER_USERNAME } from "@/lib/cms/roles";
import { audit, countSince } from "@/lib/cms/users";

/** Failed attempts per username before it is locked for the window below. */
const MAX_FAILS = 8;
const WINDOW_MS = 15 * 60_000;

export async function POST(req: Request) {
  return handle(req, null, async () => {
    if (!adminConfigured()) return json({ error: "ADMIN_PASSWORD chưa được cấu hình." }, { status: 503 });
    const body = (await req.json().catch(() => ({}))) as { username?: unknown; password?: unknown };
    const username = (typeof body.username === "string" ? body.username.trim().toLowerCase() : "").slice(0, 64) || OWNER_USERNAME;
    const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";

    const fails = await countSince(username, "login.fail", WINDOW_MS).catch(() => 0);
    if (fails >= MAX_FAILS) return json({ error: "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút." }, { status: 429 });

    const result = password ? await login(username, password) : null;
    if (!result) {
      await audit({ username }, "login.fail", username);
      // Slow down guessing.
      await new Promise((r) => setTimeout(r, 800));
      return json({ error: "Sai tên đăng nhập hoặc mật khẩu." }, { status: 401 });
    }
    await audit(result.user, "login", result.user.username);
    const secure = new URL(req.url).protocol === "https:";
    return json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(await createSession(result.user, result.version), secure) } });
  });
}
