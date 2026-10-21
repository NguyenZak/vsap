import { handle, json } from "@/lib/cms/api";
import { listAudit } from "@/lib/cms/users";

export async function GET(req: Request) {
  return handle(req, "audit", async () => {
    const q = new URL(req.url).searchParams;
    const entries = await listAudit({
      before: Number(q.get("before")) || undefined,
      username: q.get("user") || undefined,
      action: q.get("action") || undefined,
    });
    return json({ entries });
  });
}
