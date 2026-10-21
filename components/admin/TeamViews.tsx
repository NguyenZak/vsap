"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, KeyRound, Loader2, Lock, LockOpen, Plus, RefreshCw, ShieldCheck, Trash2, X } from "lucide-react";
import { generatePassword } from "@/lib/cms/password";
import { MIN_PASSWORD, permissionsOf, roleInfo, roles, type Permission, type Role } from "@/lib/cms/roles";
import { api, formatTime, type AuditEntry, type Me, type PublicUser } from "./api";

const inputCls = "w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-lime-300/50";

const permissionLabel: Record<Permission, string> = {
  "content.read": "Xem nội dung",
  "content.write": "Sửa nháp, viết bài, tải ảnh",
  "content.publish": "Xuất bản",
  "media.delete": "Xoá ảnh",
  inquiries: "Yêu cầu báo giá",
  users: "Quản lý tài khoản",
  audit: "Xem nhật ký",
};

const roleTone: Record<Role, string> = {
  admin: "bg-forest-900 text-lime-300",
  publisher: "bg-lime-300 text-forest-950",
  editor: "bg-mist-100 text-ink-900",
  sales: "bg-sun-500/15 text-ink-900",
};

export function RoleBadge({ role }: { role: Role }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${roleTone[role]}`}>{roleInfo[role].label}</span>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-medium text-ink-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-1 text-ink-600 hover:bg-mist-100">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CopyButton({ text, label = "Chép" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1 rounded-md bg-mist-100 px-2.5 py-1.5 text-xs text-ink-900 hover:bg-mist-200"
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {done ? "Đã chép" : label}
    </button>
  );
}

/** Shown once after creating an account or resetting a password: the password is not stored in readable form. */
function Credentials({ username, password, onClose }: { username: string; password: string; onClose: () => void }) {
  const url = typeof window === "undefined" ? "/admin/login" : `${location.origin}/admin/login`;
  const text = `Đăng nhập VSAP Studio\n${url}\nTên đăng nhập: ${username}\nMật khẩu: ${password}\n(Hãy đổi mật khẩu sau khi đăng nhập lần đầu.)`;
  return (
    <Modal title="Thông tin đăng nhập" onClose={onClose}>
      <p className="mt-1 text-sm text-ink-600">Gửi riêng cho người dùng (Zalo, email…). Mật khẩu chỉ hiện một lần này; sau khi đóng sẽ không xem lại được.</p>
      <pre className="mt-4 rounded-xl bg-mist-50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-ink-900">{text}</pre>
      <div className="mt-4 flex justify-end gap-2">
        <CopyButton text={text} label="Chép tất cả" />
        <button type="button" onClick={onClose} className="rounded-lg bg-forest-900 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800">
          Xong
        </button>
      </div>
    </Modal>
  );
}

function CreateUser({ onClose, onCreated }: { onClose: () => void; onCreated: (u: PublicUser, password: string) => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [password, setPassword] = useState(() => generatePassword());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Modal title="Thêm tài khoản" onClose={onClose}>
      <form
        className="mt-4 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const { user } = await api.createUser({ name, username, role, password });
            onCreated(user, password);
          } catch (err) {
            setError((err as Error).message);
            setBusy(false);
          }
        }}
      >
        <label className="block">
          <span className="text-xs font-medium text-ink-900">Tên hiển thị</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus placeholder="Nguyễn Văn A" className={`mt-1 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-ink-900">Tên đăng nhập</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "."))}
            required
            autoCapitalize="none"
            spellCheck={false}
            placeholder="nguyenvana"
            className={`mt-1 font-mono ${inputCls}`}
          />
          <span className="mt-1 block text-[11px] text-ink-400">3–32 ký tự: chữ thường không dấu, số, dấu chấm, gạch ngang.</span>
        </label>
        <fieldset>
          <legend className="text-xs font-medium text-ink-900">Vai trò</legend>
          <div className="mt-1 space-y-1.5">
            {roles.map((r) => (
              <label key={r} className={`flex cursor-pointer gap-3 rounded-lg border p-2.5 ${role === r ? "border-forest-600 bg-lime-300/10" : "border-mist-200 hover:bg-mist-50"}`}>
                <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} className="mt-0.5 accent-forest-600" />
                <span>
                  <span className="block text-sm font-medium text-ink-900">{roleInfo[r].label}</span>
                  <span className="block text-xs text-ink-600">{roleInfo[r].description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="text-xs font-medium text-ink-900">Mật khẩu ban đầu</span>
          <span className="mt-1 flex gap-2">
            <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={MIN_PASSWORD} className={`font-mono ${inputCls}`} />
            <button type="button" title="Tạo mật khẩu khác" onClick={() => setPassword(generatePassword())} className="rounded-lg border border-mist-200 px-2.5 text-ink-600 hover:bg-mist-50">
              <RefreshCw className="size-4" />
            </button>
          </span>
        </label>
        {error && <p className="text-sm text-chili-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-ink-600 hover:bg-mist-100">
            Huỷ
          </button>
          <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-60">
            {busy && <Loader2 className="size-4 animate-spin" />} Tạo tài khoản
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** Accounts and roles. The built-in owner ("admin", password = ADMIN_PASSWORD) always exists and can't be edited here. */
export function UsersView({ me }: { me: Me }) {
  const [users, setUsers] = useState<PublicUser[] | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [shown, setShown] = useState<{ username: string; password: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .users()
      .then((r) => setUsers(r.users))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const patch = async (u: PublicUser, p: Parameters<typeof api.updateUser>[1]) => {
    setBusy(u.id);
    try {
      const { user } = await api.updateUser(u.id, p);
      setUsers((cur) => cur?.map((x) => (x.id === user.id ? user : x)) ?? null);
      return true;
    } catch (e) {
      alert((e as Error).message);
      return false;
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-ink-900">Tài khoản & phân quyền</h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-600">
              Mỗi người một tài khoản riêng để biết ai đã sửa gì (xem Nhật ký). Đổi vai trò, khoá hay đặt lại mật khẩu sẽ đăng xuất người đó khỏi mọi thiết bị.
            </p>
          </div>
          <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800">
            <Plus className="size-4" /> Thêm tài khoản
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div key={r} className="rounded-xl border border-mist-200 p-4">
              <RoleBadge role={r} />
              <p className="mt-2 text-xs leading-snug text-ink-600">{roleInfo[r].description}</p>
              <ul className="mt-3 space-y-1">
                {permissionsOf(r).map((p) => (
                  <li key={p} className="flex items-center gap-1.5 text-[11px] text-ink-900">
                    <Check className="size-3 text-forest-600" /> {permissionLabel[p]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {error && <p className="mt-6 text-sm text-chili-600">{error}</p>}
        <div className="mt-6 overflow-hidden rounded-xl border border-mist-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist-50 text-[11px] tracking-wider text-ink-400 uppercase">
              <tr>
                <th className="px-4 py-2.5 font-medium">Người dùng</th>
                <th className="px-4 py-2.5 font-medium">Vai trò</th>
                <th className="px-4 py-2.5 font-medium">Đăng nhập gần nhất</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-200">
              <tr>
                <td className="px-4 py-3">
                  <p className="flex items-center gap-1.5 text-ink-900">
                    <ShieldCheck className="size-4 text-forest-600" /> Chủ sở hữu
                  </p>
                  <p className="font-mono text-xs text-ink-400">admin</p>
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role="admin" />
                </td>
                <td className="px-4 py-3 text-xs text-ink-400" colSpan={2}>
                  Tài khoản hệ thống, mật khẩu là secret <code className="font-mono">ADMIN_PASSWORD</code> trên Cloudflare. Dùng để khôi phục khi cần.
                </td>
              </tr>
              {users?.map((u) => {
                const self = u.id === me.user.id;
                return (
                  <tr key={u.id} className={u.disabled ? "bg-mist-50/60" : ""}>
                    <td className="px-4 py-3">
                      <p className={`${u.disabled ? "text-ink-400 line-through" : "text-ink-900"}`}>
                        {u.name} {self && <span className="text-xs text-ink-400 no-underline">(bạn)</span>}
                      </p>
                      <p className="font-mono text-xs text-ink-400">{u.username}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={self || busy === u.id}
                        onChange={(e) => patch(u, { role: e.target.value as Role })}
                        className="rounded-lg border border-mist-200 bg-white px-2 py-1 text-xs outline-none focus:border-forest-600 disabled:opacity-60"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {roleInfo[r].label}
                          </option>
                        ))}
                      </select>
                      {u.disabled && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-chili-600">Đã khoá</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-600">{u.last_login_at ? formatTime(u.last_login_at) : "Chưa đăng nhập"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="Đặt lại mật khẩu"
                          disabled={busy === u.id}
                          onClick={async () => {
                            if (!confirm(`Tạo mật khẩu mới cho ${u.name}? Mật khẩu cũ sẽ không dùng được nữa.`)) return;
                            const password = generatePassword();
                            if (await patch(u, { password })) setShown({ username: u.username, password });
                          }}
                          className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100 disabled:opacity-40"
                        >
                          <KeyRound className="size-4" />
                        </button>
                        <button
                          type="button"
                          title={u.disabled ? "Mở khoá" : "Khoá tài khoản"}
                          disabled={self || busy === u.id}
                          onClick={() => patch(u, { disabled: !u.disabled })}
                          className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100 disabled:opacity-40"
                        >
                          {u.disabled ? <LockOpen className="size-4" /> : <Lock className="size-4" />}
                        </button>
                        <button
                          type="button"
                          title="Xoá tài khoản"
                          disabled={self || busy === u.id}
                          onClick={async () => {
                            if (!confirm(`Xoá tài khoản ${u.username}? Nhật ký hoạt động của người này vẫn được giữ.`)) return;
                            try {
                              await api.deleteUser(u.id);
                              setUsers((cur) => cur?.filter((x) => x.id !== u.id) ?? null);
                            } catch (e) {
                              alert((e as Error).message);
                            }
                          }}
                          className="rounded-lg p-1.5 text-ink-600 hover:bg-red-50 hover:text-chili-600 disabled:opacity-40"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!users && !error && <Loader2 className="mx-auto my-8 size-6 animate-spin text-ink-400" />}
          {users?.length === 0 && <p className="border-t border-mist-200 px-4 py-6 text-center text-sm text-ink-400">Chưa có tài khoản nào ngoài admin. Bấm “Thêm tài khoản” để mời người khác cùng quản lý.</p>}
        </div>
      </div>

      {creating && (
        <CreateUser
          onClose={() => setCreating(false)}
          onCreated={(u, password) => {
            setCreating(false);
            setUsers((cur) => [...(cur ?? []), u]);
            setShown({ username: u.username, password });
          }}
        />
      )}
      {shown && <Credentials {...shown} onClose={() => setShown(null)} />}
    </div>
  );
}

// ---- Audit log ----------------------------------------------------------------

const actionLabel: Record<string, string> = {
  login: "Đăng nhập",
  "login.fail": "Đăng nhập sai",
  "draft.save": "Sửa nội dung (bản nháp)",
  "draft.discard": "Bỏ bản nháp",
  "site.publish": "Xuất bản website",
  "site.restore": "Khôi phục phiên bản cũ",
  "media.upload": "Tải ảnh lên",
  "media.delete": "Xoá ảnh",
  "post.create": "Tạo bài viết",
  "post.save": "Sửa bài viết",
  "post.publish": "Xuất bản bài viết",
  "post.unpublish": "Gỡ bài viết",
  "post.revert": "Bỏ thay đổi bài viết",
  "post.delete": "Xoá bài viết",
  "inquiry.status": "Đổi trạng thái yêu cầu",
  "inquiry.delete": "Xoá yêu cầu báo giá",
  "inquiry.export": "Xuất CSV yêu cầu báo giá",
  "user.create": "Tạo tài khoản",
  "user.update": "Sửa tài khoản",
  "user.delete": "Xoá tài khoản",
  "user.password": "Đổi mật khẩu",
};

const actionTone = (a: string) =>
  a.endsWith(".publish") || a === "site.restore" ? "bg-lime-300 text-forest-950" : a.includes("delete") || a === "login.fail" ? "bg-red-50 text-chili-600" : a.startsWith("user.") ? "bg-forest-900 text-lime-300" : "bg-mist-100 text-ink-600";

const filters = [
  { value: "", label: "Tất cả" },
  { value: "site.", label: "Xuất bản" },
  { value: "post.", label: "Tin tức" },
  { value: "inquiry.", label: "Báo giá" },
  { value: "media.", label: "Ảnh" },
  { value: "user.", label: "Tài khoản" },
  { value: "login", label: "Đăng nhập" },
];

export function AuditView() {
  const [entries, setEntries] = useState<AuditEntry[] | null>(null);
  const [action, setAction] = useState("");
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (before?: number) => {
      setLoading(true);
      try {
        const { entries: page } = await api.audit({ action: action || undefined, before });
        setEntries((cur) => (before ? [...(cur ?? []), ...page] : page));
        setMore(page.length >= 100);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [action],
  );
  useEffect(() => {
    setEntries(null);
    load();
  }, [load]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-white p-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-xl font-medium text-ink-900">Nhật ký hoạt động</h2>
        <p className="mt-1 text-sm text-ink-600">Ai đã đăng nhập, sửa, xuất bản hay xoá gì, và khi nào. Việc sửa liên tục được gộp thành một dòng mỗi 15 phút.</p>
        <div className="mt-5 flex flex-wrap gap-1">
          {filters.map((f) => (
            <button key={f.value || "all"} type="button" onClick={() => setAction(f.value)} className={`rounded-full px-3 py-1 text-xs ${action === f.value ? "bg-forest-900 text-white" : "bg-mist-100 text-ink-600 hover:bg-mist-200"}`}>
              {f.label}
            </button>
          ))}
        </div>
        {error && <p className="mt-4 text-sm text-chili-600">{error}</p>}
        <ol className="mt-5 divide-y divide-mist-200 rounded-xl border border-mist-200">
          {entries?.map((e) => (
            <li key={e.id} className="flex items-start gap-4 px-4 py-3">
              <span className="w-28 shrink-0 pt-0.5 text-xs text-ink-400">{formatTime(e.at)}</span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm text-ink-900">
                  <span className="font-medium">{e.username ?? "—"}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${actionTone(e.action)}`}>{actionLabel[e.action] ?? e.action}</span>
                  {e.target && <span className="truncate font-mono text-xs text-ink-600">{e.target}</span>}
                </p>
                {e.detail && <p className="mt-0.5 text-xs text-ink-600">{e.detail}</p>}
              </div>
            </li>
          ))}
          {entries?.length === 0 && <li className="px-4 py-10 text-center text-sm text-ink-400">Chưa có hoạt động nào.</li>}
        </ol>
        {(!entries || loading) && <Loader2 className="mx-auto mt-6 size-6 animate-spin text-ink-400" />}
        {entries && more && !loading && entries.length > 0 && (
          <button type="button" onClick={() => load(entries[entries.length - 1].id)} className="mx-auto mt-4 block rounded-lg border border-mist-200 px-4 py-2 text-sm text-ink-900 hover:bg-mist-50">
            Xem thêm
          </button>
        )}
      </div>
    </div>
  );
}

// ---- Own password ---------------------------------------------------------------

export function ChangePassword({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  return (
    <Modal title="Đổi mật khẩu" onClose={onClose}>
      {done ? (
        <>
          <p className="mt-2 text-sm text-ink-600">Đã đổi mật khẩu. Các thiết bị khác đã bị đăng xuất; bạn cần đăng nhập lại.</p>
          <div className="mt-5 flex justify-end">
            <button type="button" onClick={() => (location.href = "/admin/login")} className="rounded-lg bg-forest-900 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800">
              Đăng nhập lại
            </button>
          </div>
        </>
      ) : (
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (next !== again) return setError("Hai lần nhập mật khẩu mới không khớp.");
            setBusy(true);
            setError("");
            try {
              await api.changePassword(current, next);
              setDone(true);
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {(
            [
              ["Mật khẩu hiện tại", current, setCurrent, "current-password"],
              [`Mật khẩu mới (ít nhất ${MIN_PASSWORD} ký tự)`, next, setNext, "new-password"],
              ["Nhập lại mật khẩu mới", again, setAgain, "new-password"],
            ] as const
          ).map(([label, value, set, auto], i) => (
            <label key={label} className="block">
              <span className="text-xs font-medium text-ink-900">{label}</span>
              <input type="password" value={value} onChange={(e) => set(e.target.value)} autoComplete={auto} autoFocus={i === 0} required minLength={i ? MIN_PASSWORD : undefined} className={`mt-1 ${inputCls}`} />
            </label>
          ))}
          {error && <p className="text-sm text-chili-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-ink-600 hover:bg-mist-100">
              Huỷ
            </button>
            <button type="submit" disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-forest-900 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-60">
              {busy && <Loader2 className="size-4 animate-spin" />} Đổi mật khẩu
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
