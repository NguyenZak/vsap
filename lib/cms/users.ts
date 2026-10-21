// Studio accounts (cms_users) and the audit log (cms_audit).
import { db } from "./db";
import { hashPassword } from "./password";
import { isRole, MIN_PASSWORD, OWNER_USERNAME, USERNAME_RE, type Role } from "./roles";

export type UserRow = {
  id: string;
  username: string;
  name: string;
  role: Role;
  password: string;
  disabled: number;
  version: number;
  created_at: number;
  last_login_at: number | null;
};

/** What the admin UI gets: never the password hash. */
export type PublicUser = Omit<UserRow, "password" | "version" | "disabled"> & { disabled: boolean };

const toPublic = ({ password: _p, version: _v, ...u }: UserRow): PublicUser => ({ ...u, disabled: Boolean(u.disabled) });

export async function findUser(id: string) {
  return (await db()).prepare("SELECT * FROM cms_users WHERE id = ?").bind(id).first<UserRow>();
}

export async function findUserByName(username: string) {
  return (await db()).prepare("SELECT * FROM cms_users WHERE username = ?").bind(username.toLowerCase()).first<UserRow>();
}

export async function touchLogin(id: string) {
  await (await db()).prepare("UPDATE cms_users SET last_login_at = ? WHERE id = ?").bind(Date.now(), id).run();
}

export async function listUsers(): Promise<PublicUser[]> {
  const { results } = await (await db()).prepare("SELECT * FROM cms_users ORDER BY created_at").all<UserRow>();
  return results.map(toPublic);
}

function checkPassword(password: unknown): string {
  if (typeof password !== "string" || [...password].length < MIN_PASSWORD) throw new Error(`Mật khẩu cần ít nhất ${MIN_PASSWORD} ký tự.`);
  if (password.length > 200) throw new Error("Mật khẩu quá dài.");
  return password;
}

function checkName(name: unknown) {
  const n = typeof name === "string" ? name.trim() : "";
  if (!n || n.length > 80) throw new Error("Tên hiển thị cần từ 1 đến 80 ký tự.");
  return n;
}

export async function createUser(input: { username?: unknown; name?: unknown; role?: unknown; password?: unknown }): Promise<PublicUser> {
  const username = typeof input.username === "string" ? input.username.trim().toLowerCase() : "";
  if (!USERNAME_RE.test(username)) throw new Error("Tên đăng nhập 3–32 ký tự: chữ thường không dấu, số, dấu chấm, gạch ngang hoặc gạch dưới.");
  if (username === OWNER_USERNAME) throw new Error(`“${OWNER_USERNAME}” là tài khoản hệ thống, hãy chọn tên khác.`);
  if (!isRole(input.role)) throw new Error("Vai trò không hợp lệ.");
  const row: UserRow = {
    id: crypto.randomUUID(),
    username,
    name: checkName(input.name),
    role: input.role,
    password: await hashPassword(checkPassword(input.password)),
    disabled: 0,
    version: 1,
    created_at: Date.now(),
    last_login_at: null,
  };
  if (await findUserByName(username)) throw new Error("Tên đăng nhập này đã có người dùng.");
  await (await db())
    .prepare("INSERT INTO cms_users (id, username, name, role, password, disabled, version, created_at) VALUES (?, ?, ?, ?, ?, 0, 1, ?)")
    .bind(row.id, row.username, row.name, row.role, row.password, row.created_at)
    .run();
  return toPublic(row);
}

/** Change name/role/disabled/password. Anything that affects access signs the user out. */
export async function updateUser(id: string, patch: { name?: unknown; role?: unknown; disabled?: unknown; password?: unknown }) {
  const row = await findUser(id);
  if (!row) throw new Error("Không tìm thấy tài khoản.");
  const next = { ...row };
  if (patch.name !== undefined) next.name = checkName(patch.name);
  if (patch.role !== undefined) {
    if (!isRole(patch.role)) throw new Error("Vai trò không hợp lệ.");
    next.role = patch.role;
  }
  if (patch.disabled !== undefined) next.disabled = patch.disabled ? 1 : 0;
  if (patch.password !== undefined) next.password = await hashPassword(checkPassword(patch.password));
  const revoke = next.role !== row.role || next.disabled !== row.disabled || next.password !== row.password;
  if (revoke) next.version = row.version + 1;
  await (await db())
    .prepare("UPDATE cms_users SET name = ?, role = ?, disabled = ?, password = ?, version = ? WHERE id = ?")
    .bind(next.name, next.role, next.disabled, next.password, next.version, id)
    .run();
  return { user: toPublic(next), before: toPublic(row) };
}

export async function deleteUser(id: string) {
  const row = await findUser(id);
  if (!row) throw new Error("Không tìm thấy tài khoản.");
  await (await db()).prepare("DELETE FROM cms_users WHERE id = ?").bind(id).run();
  return toPublic(row);
}

// ---- Audit log ----------------------------------------------------------------

export type AuditEntry = { id: number; at: number; user_id: string | null; username: string | null; action: string; target: string | null; detail: string | null };

/** Keep the log bounded; older entries are dropped. */
const KEEP_AUDIT = 5000;

type Actor = { id?: string; username: string } | null;

/** Record who did what. Never throws: losing a log line must not fail the action itself. */
export async function audit(actor: Actor, action: string, target = "", detail = "") {
  try {
    const d = await db();
    await d.batch([
      d
        .prepare("INSERT INTO cms_audit (at, user_id, username, action, target, detail) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(Date.now(), actor?.id || null, actor?.username ?? null, action, target.slice(0, 200), detail.slice(0, 500)),
      d.prepare("DELETE FROM cms_audit WHERE id <= (SELECT MAX(id) FROM cms_audit) - ?").bind(KEEP_AUDIT),
    ]);
  } catch (e) {
    console.error("[audit]", e);
  }
}

/** True when this user already logged `action` (on `target`, if given) within the last `ms`; keeps autosaves from flooding the log. */
export async function recentlyLogged(username: string, action: string, ms: number, target?: string) {
  const row = await (await db())
    .prepare(`SELECT 1 AS hit FROM cms_audit WHERE username = ? AND action = ? AND at > ?${target === undefined ? "" : " AND target = ?"} LIMIT 1`)
    .bind(username, action, Date.now() - ms, ...(target === undefined ? [] : [target]))
    .first<{ hit: number }>();
  return Boolean(row);
}

export async function countSince(username: string, action: string, ms: number) {
  const row = await (await db())
    .prepare("SELECT COUNT(*) AS n FROM cms_audit WHERE username = ? AND action = ? AND at > ?")
    .bind(username, action, Date.now() - ms)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function listAudit({ before, limit = 100, username, action }: { before?: number; limit?: number; username?: string; action?: string }) {
  const filters: [string, unknown][] = [];
  if (before) filters.push(["id < ?", before]);
  if (username) filters.push(["username = ?", username]);
  if (action) filters.push(["action LIKE ?", `${action}%`]);
  const where = filters.map(([sql]) => sql);
  const args = filters.map(([, v]) => v);
  const { results } = await (await db())
    .prepare(`SELECT * FROM cms_audit ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY id DESC LIMIT ?`)
    .bind(...args, Math.min(200, limit))
    .all<AuditEntry>();
  return results;
}
