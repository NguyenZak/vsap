import { handle, json } from "@/lib/cms/api";
import { deleteMedia, listMedia, uploadMedia } from "@/lib/cms/store";
import { audit } from "@/lib/cms/users";

export async function GET(req: Request) {
  return handle(req, "content.read", async () => json({ items: await listMedia() }));
}

export async function POST(req: Request) {
  return handle(req, "content.write", async (user) => {
    const form = await req.formData();
    const files = form.getAll("file").filter((f): f is File => f instanceof File);
    if (files.length === 0) throw new Error("No file");
    const items = [];
    for (const f of files) items.push(await uploadMedia(f));
    await audit(user, "media.upload", items.map((i) => i.name).join(", "));
    return json({ items });
  });
}

export async function DELETE(req: Request) {
  return handle(req, "media.delete", async (user) => {
    const key = new URL(req.url).searchParams.get("key");
    if (!key) throw new Error("Missing key");
    await deleteMedia(key);
    await audit(user, "media.delete", key);
    return json({ ok: true });
  });
}
