import { handle, json } from "@/lib/cms/api";
import { publish } from "@/lib/cms/store";

export async function POST(req: Request) {
  return handle(req, async () => {
    const { note } = (await req.json().catch(() => ({}))) as { note?: string };
    return json({ publishedAt: await publish(note ?? "") });
  });
}
