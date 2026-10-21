import { handle, json } from "@/lib/cms/api";
import { createPost, listPostsAdmin } from "@/lib/cms/posts";
import { audit } from "@/lib/cms/users";

export async function GET(req: Request) {
  return handle(req, "content.read", async () => json({ posts: await listPostsAdmin() }));
}

export async function POST(req: Request) {
  return handle(req, "content.write", async (user) => {
    const body = await req.json().catch(() => null);
    const post = await createPost(body, user.username);
    await audit(user, "post.create", post.draft.slug);
    return json({ post });
  });
}
