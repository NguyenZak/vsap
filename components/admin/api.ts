// Browser-side calls to /api/admin. Throws with the server's message on failure.
import type { MediaItem } from "@/lib/cms/store";
import type { SiteContent } from "@/lib/cms/types";

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
export type Revision = { id: number; created_at: number; note: string | null; size: number };

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
  login: (password: string) => call<{ ok: true }>("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => call<{ ok: true }>("/api/admin/logout", { method: "POST" }),
};

export const formatTime = (ms: number | null) =>
  ms ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(ms)) : "—";
