import { handle, json } from "@/lib/cms/api";
import { roleInfo } from "@/lib/cms/roles";
import { audit, createUser, deleteUser, listUsers, updateUser } from "@/lib/cms/users";

export async function GET(req: Request) {
  return handle(req, "users", async () => json({ users: await listUsers() }));
}

export async function POST(req: Request) {
  return handle(req, "users", async (actor) => {
    const user = await createUser(await req.json());
    await audit(actor, "user.create", user.username, roleInfo[user.role].label);
    return json({ user });
  });
}

export async function PATCH(req: Request) {
  return handle(req, "users", async (actor) => {
    const { id, ...patch } = (await req.json()) as { id?: string; name?: unknown; role?: unknown; disabled?: unknown; password?: unknown };
    if (!id) throw new Error("Missing id");
    if (id === actor.id && (patch.role !== undefined || patch.disabled)) throw new Error("Không thể tự đổi vai trò hay khoá tài khoản của chính mình.");
    const { user, before } = await updateUser(id, patch);
    const changes = [
      before.role !== user.role && `vai trò: ${roleInfo[before.role].label} → ${roleInfo[user.role].label}`,
      before.disabled !== user.disabled && (user.disabled ? "khoá" : "mở khoá"),
      before.name !== user.name && `tên: ${user.name}`,
      patch.password !== undefined && "đặt lại mật khẩu",
    ].filter(Boolean);
    await audit(actor, "user.update", user.username, changes.join("; "));
    return json({ user });
  });
}

export async function DELETE(req: Request) {
  return handle(req, "users", async (actor) => {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) throw new Error("Missing id");
    if (id === actor.id) throw new Error("Không thể tự xoá tài khoản của chính mình.");
    const user = await deleteUser(id);
    await audit(actor, "user.delete", user.username);
    return json({ ok: true });
  });
}
