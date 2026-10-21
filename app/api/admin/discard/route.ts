import { handle, json } from "@/lib/cms/api";
import { discardDraft } from "@/lib/cms/store";
import { audit } from "@/lib/cms/users";

export async function POST(req: Request) {
  return handle(req, "content.publish", async (user) => {
    await discardDraft();
    await audit(user, "draft.discard", "site");
    return json({ ok: true });
  });
}
