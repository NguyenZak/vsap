import { sessionCookie } from "@/lib/cms/auth";
import { handle, json } from "@/lib/cms/api";

export async function POST(req: Request) {
  return handle(req, async () => json({ ok: true }, { headers: { "Set-Cookie": sessionCookie("", new URL(req.url).protocol === "https:", 0) } }));
}
