import { handle, json } from "@/lib/cms/api";
import { listRevisions, restoreRevision } from "@/lib/cms/store";

export async function GET(req: Request) {
  return handle(req, async () => json({ revisions: await listRevisions() }));
}

/** Copy an old published version into the draft. */
export async function POST(req: Request) {
  return handle(req, async () => {
    const { id } = (await req.json()) as { id: number };
    return json({ savedAt: await restoreRevision(Number(id)) });
  });
}
