import { handle, json } from "@/lib/cms/api";
import { listRevisions, restoreRevision } from "@/lib/cms/store";
import { audit } from "@/lib/cms/users";

export async function GET(req: Request) {
  return handle(req, "content.read", async () => json({ revisions: await listRevisions() }));
}

/** Copy an old published version into the draft. */
export async function POST(req: Request) {
  return handle(req, "content.publish", async (user) => {
    const { id } = (await req.json()) as { id: number };
    const savedAt = await restoreRevision(Number(id));
    await audit(user, "site.restore", `revision #${Number(id)}`);
    return json({ savedAt });
  });
}
