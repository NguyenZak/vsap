import { handle, json } from "@/lib/cms/api";
import { deletePost, getPostAdmin, savePostDraft } from "@/lib/cms/posts";
import { audit, recentlyLogged } from "@/lib/cms/users";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  return handle(req, "content.read", async () => json({ post: await getPostAdmin((await params).id) }));
}

/** Autosave of the post's draft. */
export async function PUT(req: Request, { params }: Ctx) {
  return handle(req, "content.write", async (user) => {
    const { id } = await params;
    const body = (await req.json()) as { slug?: string };
    const savedAt = await savePostDraft(id, body, user.username);
    const slug = String(body.slug ?? "");
    if (!(await recentlyLogged(user.username, "post.save", 15 * 60_000, slug))) await audit(user, "post.save", slug);
    return json({ savedAt });
  });
}

export async function DELETE(req: Request, { params }: Ctx) {
  return handle(req, "content.publish", async (user) => {
    const post = await deletePost((await params).id);
    await audit(user, "post.delete", post.slug, post.title.vi || post.title.en);
    return json({ ok: true });
  });
}
