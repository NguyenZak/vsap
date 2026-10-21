import { handle, json } from "@/lib/cms/api";
import { deleteMedia, listMedia, uploadMedia } from "@/lib/cms/store";

export async function GET(req: Request) {
  return handle(req, async () => json({ items: await listMedia() }));
}

export async function POST(req: Request) {
  return handle(req, async () => {
    const form = await req.formData();
    const files = form.getAll("file").filter((f): f is File => f instanceof File);
    if (files.length === 0) throw new Error("No file");
    const items = [];
    for (const f of files) items.push(await uploadMedia(f));
    return json({ items });
  });
}

export async function DELETE(req: Request) {
  return handle(req, async () => {
    const key = new URL(req.url).searchParams.get("key");
    if (!key) throw new Error("Missing key");
    await deleteMedia(key);
    return json({ ok: true });
  });
}
