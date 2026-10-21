import { handle, json } from "@/lib/cms/api";
import { adminState, saveDraft } from "@/lib/cms/store";
import { audit, recentlyLogged } from "@/lib/cms/users";

export async function GET(req: Request) {
  return handle(req, "content.read", async () => json(await adminState()));
}

/** Autosave: replaces the draft with the editor's current content. */
export async function PUT(req: Request) {
  return handle(req, "content.write", async (user) => {
    const savedAt = await saveDraft(await req.json());
    // Autosave runs every few seconds; one log line per editing session is enough.
    if (!(await recentlyLogged(user.username, "draft.save", 15 * 60_000))) await audit(user, "draft.save", "site");
    return json({ savedAt });
  });
}
