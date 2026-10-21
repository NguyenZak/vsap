import { handle, json } from "@/lib/cms/api";
import { verifyPassword } from "@/lib/cms/password";
import { permissionsOf } from "@/lib/cms/roles";
import { audit, findUser, updateUser } from "@/lib/cms/users";

/** The signed-in user and what they may do; the Studio shapes itself from this. */
export async function GET(req: Request) {
  return handle(req, "user", async (user) => json({ user, permissions: permissionsOf(user.role) }));
}

/** Change your own password (the owner's is the ADMIN_PASSWORD secret, changed in Cloudflare). */
export async function PUT(req: Request) {
  return handle(req, "user", async (user) => {
    if (user.owner) throw new Error("Mật khẩu tài khoản admin là secret ADMIN_PASSWORD, đổi trong Cloudflare.");
    const { current, next } = (await req.json()) as { current?: string; next?: string };
    const row = await findUser(user.id);
    if (!row || !current || !(await verifyPassword(current, row.password))) throw new Error("Mật khẩu hiện tại không đúng.");
    await updateUser(user.id, { password: next });
    await audit(user, "user.password", user.username);
    return json({ ok: true });
  });
}
