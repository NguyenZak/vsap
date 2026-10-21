import { handle, json } from "@/lib/cms/api";
import { publishPost, revertPost, unpublishPost } from "@/lib/cms/posts";
import { audit } from "@/lib/cms/users";

type Ctx = { params: Promise<{ id: string }> };

const actions = { publish: publishPost, unpublish: unpublishPost, revert: revertPost } as const;

/** { action: "publish" | "unpublish" | "revert" } */
export async function POST(req: Request, { params }: Ctx) {
  return handle(req, "content.publish", async (user) => {
    const { action } = (await req.json()) as { action?: keyof typeof actions };
    const run = action && actions[action];
    if (!run) throw new Error("Unknown action");
    const post = await run((await params).id, user.username);
    await audit(user, `post.${action}`, post.draft.slug, post.draft.title.vi || post.draft.title.en);
    return json({ post });
  });
}
