import { handle, json } from "@/lib/cms/api";
import { publish } from "@/lib/cms/store";
import { audit } from "@/lib/cms/users";

export async function POST(req: Request) {
  return handle(req, "content.publish", async (user) => {
    const { note } = (await req.json().catch(() => ({}))) as { note?: string };
    const publishedAt = await publish(note ?? "", user.username);
    await audit(user, "site.publish", "site", note ?? "");
    return json({ publishedAt });
  });
}
