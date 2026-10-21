import { handle, json } from "@/lib/cms/api";
import { discardDraft } from "@/lib/cms/store";

export async function POST(req: Request) {
  return handle(req, async () => {
    await discardDraft();
    return json({ ok: true });
  });
}
