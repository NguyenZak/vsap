// Browser-side calls to /api/admin. Throws with the server's message on failure.
import type { SessionUser } from "@/lib/cms/auth";
import type { Inquiry, InquiryStatus } from "@/lib/cms/inquiry-format";
import type { PostRecord, PostSummary } from "@/lib/cms/posts";
import type { Permission, Role } from "@/lib/cms/roles";
import type { TelegramChat, TelegramStatus } from "@/lib/cms/notify";
import type { MediaItem } from "@/lib/cms/store";
import type { Post, SiteContent } from "@/lib/cms/types";
import type { AuditEntry, PublicUser } from "@/lib/cms/users";

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: init?.body instanceof FormData ? init?.headers : { "content-type": "application/json", ...init?.headers } });
  if (res.status === 401) {
    window.location.href = `/admin/login?next=${encodeURIComponent(location.pathname + location.search)}`;
    throw new Error("Phiên đăng nhập đã hết hạn.");
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
  return data;
}

export type AdminState = { content: SiteContent; hasDraft: boolean; draftUpdatedAt: number | null; publishedAt: number | null };
export type Revision = { id: number; created_at: number; note: string | null; author: string | null; size: number };
export type Me = { user: SessionUser; permissions: Permission[] };
export type { AuditEntry, Inquiry, InquiryStatus, PostRecord, PostSummary, PublicUser, TelegramChat, TelegramStatus };

const qs = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") q.set(k, String(v));
  const s = q.toString();
  return s ? `?${s}` : "";
};

export const api = {
  state: () => call<AdminState>("/api/admin/content"),
  saveDraft: (content: SiteContent) => call<{ savedAt: number }>("/api/admin/content", { method: "PUT", body: JSON.stringify(content) }),
  publish: (note: string) => call<{ publishedAt: number }>("/api/admin/publish", { method: "POST", body: JSON.stringify({ note }) }),
  discard: () => call<{ ok: true }>("/api/admin/discard", { method: "POST" }),
  revisions: () => call<{ revisions: Revision[] }>("/api/admin/revisions"),
  restore: (id: number) => call<{ savedAt: number }>("/api/admin/revisions", { method: "POST", body: JSON.stringify({ id }) }),
  media: () => call<{ items: MediaItem[] }>("/api/admin/media"),
  upload: (files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("file", f));
    return call<{ items: MediaItem[] }>("/api/admin/media", { method: "POST", body: form });
  },
  deleteMedia: (key: string) => call<{ ok: true }>(`/api/admin/media?key=${encodeURIComponent(key)}`, { method: "DELETE" }),
  login: (username: string, password: string) => call<{ ok: true }>("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  me: () => call<Me>("/api/admin/me"),
  changePassword: (current: string, next: string) => call<{ ok: true }>("/api/admin/me", { method: "PUT", body: JSON.stringify({ current, next }) }),

  users: () => call<{ users: PublicUser[] }>("/api/admin/users"),
  createUser: (u: { username: string; name: string; role: Role; password: string }) => call<{ user: PublicUser }>("/api/admin/users", { method: "POST", body: JSON.stringify(u) }),
  updateUser: (id: string, patch: { name?: string; role?: Role; disabled?: boolean; password?: string }) =>
    call<{ user: PublicUser }>("/api/admin/users", { method: "PATCH", body: JSON.stringify({ id, ...patch }) }),
  deleteUser: (id: string) => call<{ ok: true }>(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: "DELETE" }),
  audit: (params: { before?: number; user?: string; action?: string }) => call<{ entries: AuditEntry[] }>(`/api/admin/audit${qs(params)}`),

  inquiries: (params: { status?: string; q?: string }) => call<{ items: Inquiry[]; counts: Record<InquiryStatus, number> }>(`/api/admin/inquiries${qs(params)}`),
  inquiriesCsvUrl: (params: { status?: string; q?: string }) => `/api/admin/inquiries${qs({ ...params, format: "csv" })}`,
  updateInquiry: (id: number, patch: { status?: InquiryStatus; note?: string }) => call<{ inquiry: Inquiry }>("/api/admin/inquiries", { method: "PATCH", body: JSON.stringify({ id, ...patch }) }),
  deleteInquiry: (id: number) => call<{ ok: true }>(`/api/admin/inquiries?id=${id}`, { method: "DELETE" }),

  telegram: () => call<TelegramStatus>("/api/admin/notify"),
  telegramToken: (token: string) => call<TelegramStatus>("/api/admin/notify", { method: "POST", body: JSON.stringify({ action: "token", token }) }),
  telegramDiscover: () => call<{ chats: TelegramChat[] }>("/api/admin/notify", { method: "POST", body: JSON.stringify({ action: "discover" }) }),
  telegramChat: (chat: TelegramChat) => call<TelegramStatus>("/api/admin/notify", { method: "POST", body: JSON.stringify({ action: "chat", chatId: chat.id, title: chat.title }) }),
  telegramTest: () => call<{ ok: true }>("/api/admin/notify", { method: "POST", body: JSON.stringify({ action: "test" }) }),
  telegramDisconnect: () => call<TelegramStatus>("/api/admin/notify", { method: "POST", body: JSON.stringify({ action: "disconnect" }) }),

  posts: () => call<{ posts: PostSummary[] }>("/api/admin/posts"),
  createPost: (post?: Partial<Post>) => call<{ post: PostRecord }>("/api/admin/posts", { method: "POST", body: JSON.stringify(post ?? null) }),
  post: (id: string) => call<{ post: PostRecord }>(`/api/admin/posts/${id}`),
  savePost: (id: string, post: Post) => call<{ savedAt: number }>(`/api/admin/posts/${id}`, { method: "PUT", body: JSON.stringify(post) }),
  postAction: (id: string, action: "publish" | "unpublish" | "revert") => call<{ post: PostRecord }>(`/api/admin/posts/${id}/publish`, { method: "POST", body: JSON.stringify({ action }) }),
  deletePost: (id: string) => call<{ ok: true }>(`/api/admin/posts/${id}`, { method: "DELETE" }),
  logout: () => call<{ ok: true }>("/api/admin/logout", { method: "POST" }),
};

export const formatTime = (ms: number | null) =>
  ms ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(ms)) : "—";
