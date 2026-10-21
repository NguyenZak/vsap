import { handle, json } from "@/lib/cms/api";
import { adminState, saveDraft } from "@/lib/cms/store";

export async function GET(req: Request) {
  return handle(req, async () => json(await adminState()));
}

/** Autosave: replaces the draft with the editor's current content. */
export async function PUT(req: Request) {
  return handle(req, async () => json({ savedAt: await saveDraft(await req.json()) }));
}
