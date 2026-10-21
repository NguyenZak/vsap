import { adminConfigured, checkPassword, createSession, sessionCookie } from "@/lib/cms/auth";
import { handle, json } from "@/lib/cms/api";

export async function POST(req: Request) {
  return handle(req, async () => {
    if (!adminConfigured()) return json({ error: "ADMIN_PASSWORD chưa được cấu hình." }, { status: 503 });
    const { password } = (await req.json().catch(() => ({}))) as { password?: string };
    if (!password || !(await checkPassword(password))) {
      // Slow down guessing.
      await new Promise((r) => setTimeout(r, 800));
      return json({ error: "Sai mật khẩu." }, { status: 401 });
    }
    const secure = new URL(req.url).protocol === "https:";
    return json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(await createSession(), secure) } });
  });
}
