"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CalendarClock, Check, Loader2, Newspaper, Plus, Rocket, RotateCcw, Trash2, Undo2 } from "lucide-react";
import { postFields } from "@/lib/cms/collections";
import { setIn } from "@/lib/cms/fields";
import { isScheduled, postProblem, slugify } from "@/lib/cms/post-format";
import { pick } from "@/lib/cms/links";
import type { L, Post, Settings } from "@/lib/cms/types";
import type { Locale } from "@/lib/i18n";
import { plainText } from "@/lib/markdown";
import { api, formatTime, type PostRecord, type PostSummary } from "./api";
import { FieldForm } from "./fields";
import { Panel } from "./PageEditor";
import { Preview, type PreviewHandle } from "./Preview";
import { SeoPreview } from "./SeoPreview";

type Path = (string | number)[];
type Save = "idle" | "pending" | "saving" | "saved" | "error";

const AUTOSAVE_MS = 900;

function StatusChip({ p }: { p: Pick<PostSummary, "status" | "scheduled"> }) {
  if (p.status === "draft") return <span className="rounded-full bg-mist-100 px-2 py-0.5 text-[11px] text-ink-600">Bản nháp</span>;
  if (p.scheduled) return <span className="rounded-full bg-sun-500/15 px-2 py-0.5 text-[11px] text-ink-900">Hẹn giờ</span>;
  if (p.status === "changed") return <span className="rounded-full bg-sun-500/15 px-2 py-0.5 text-[11px] text-ink-900">Có thay đổi chưa đăng</span>;
  return <span className="rounded-full bg-sun-400 px-2 py-0.5 text-[11px] font-medium text-forest-950">Đang hiển thị</span>;
}

export function PostsView({ settings, canWrite, canPublish, locale, onLocale }: { settings: Settings; canWrite: boolean; canPublish: boolean; locale: Locale; onLocale: (l: Locale) => void }) {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [record, setRecord] = useState<PostRecord | null>(null);
  const [draft, setDraft] = useState<Post | null>(null);
  const [save, setSave] = useState<Save>("idle");
  const [saveError, setSaveError] = useState("");
  const [busy, setBusy] = useState("");
  const preview = useRef<PreviewHandle>(null);
  const latest = useRef<{ id: string; post: Post } | null>(null);
  const dirty = useRef(false);

  const refreshList = useCallback(async () => {
    try {
      setPosts((await api.posts()).posts);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const saveNow = useCallback(async () => {
    const cur = latest.current;
    if (!cur || !dirty.current) return true;
    const problem = postProblem(cur.post);
    if (problem) {
      setSave("error");
      setSaveError(problem);
      return false;
    }
    dirty.current = false;
    setSave("saving");
    try {
      await api.savePost(cur.id, cur.post);
      setSave(dirty.current ? "pending" : "saved");
      setSaveError("");
      preview.current?.reload();
      refreshList();
      return true;
    } catch (e) {
      dirty.current = true;
      setSave("error");
      setSaveError((e as Error).message);
      return false;
    }
  }, [refreshList]);

  useEffect(() => {
    if (save !== "pending") return;
    const t = setTimeout(saveNow, AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [draft, save, saveNow]);

  const open = async (id: string) => {
    if (!(await saveNow())) {
      if (!confirm("Bài đang sửa chưa lưu được. Vẫn chuyển bài khác và bỏ thay đổi đó?")) return;
    }
    setSelected(id);
    setRecord(null);
    setDraft(null);
    try {
      const { post } = await api.post(id);
      setRecord(post);
      setDraft(post.draft);
      latest.current = { id, post: post.draft };
      dirty.current = false;
      setSave("idle");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const onField = (path: Path, value: unknown) => {
    if (!draft || !selected || !canWrite) return;
    let next = setIn(draft, path, value);
    // Until the post has been published, the slug follows the Vietnamese title.
    if (path[0] === "title" && !record?.published && (draft.slug === slugify(draft.title.vi) || /^bai-viet-\d{4}/.test(draft.slug))) {
      next = { ...next, slug: slugify(next.title.vi) || draft.slug };
    }
    if (path[0] === "slug") next = { ...next, slug: String(value).toLowerCase().replace(/\s+/g, "-") };
    setDraft(next);
    latest.current = { id: selected, post: next };
    dirty.current = true;
    setSave("pending");
  };

  const act = async (action: "publish" | "unpublish" | "revert") => {
    if (!selected) return;
    if (action === "unpublish" && !confirm("Gỡ bài khỏi website? Bài vẫn được giữ ở dạng bản nháp.")) return;
    if (action === "revert" && !confirm("Bỏ mọi thay đổi chưa đăng và quay về bản đang hiển thị?")) return;
    setBusy(action);
    try {
      if (action === "publish" && !(await saveNow())) return;
      const { post } = await api.postAction(selected, action);
      setRecord(post);
      setDraft(post.draft);
      latest.current = { id: selected, post: post.draft };
      preview.current?.reload();
      refreshList();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  const create = async () => {
    if (!(await saveNow())) return;
    setBusy("create");
    try {
      const { post } = await api.createPost();
      await refreshList();
      await open(post.id);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  const remove = async () => {
    if (!selected || !draft) return;
    if (!confirm(`Xoá vĩnh viễn bài “${draft.title.vi || draft.title.en}”? Thao tác này không hoàn tác được. Muốn ẩn tạm thời, hãy dùng “Gỡ khỏi website”.`)) return;
    setBusy("delete");
    try {
      await api.deletePost(selected);
      setSelected(null);
      setRecord(null);
      setDraft(null);
      latest.current = null;
      refreshList();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  // Save before leaving the page.
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("beforeunload", onLeave);
      saveNow();
    };
  }, [saveNow]);

  const summary = posts?.find((p) => p.id === selected);
  const live = Boolean(record?.published);
  const changed = live && summary?.status === "changed";
  const t = (v: Partial<L> | undefined) => pick(v, locale);

  return (
    <>
      <aside className="flex w-72 shrink-0 flex-col border-r border-mist-200 bg-white">
        <div className="border-b border-mist-200 px-4 py-4">
          <h2 className="text-base font-medium text-ink-900">Tin tức</h2>
          <p className="mt-0.5 text-xs leading-snug text-ink-600">Mỗi bài có bản nháp riêng; chỉ hiện trên website sau khi được xuất bản.</p>
        </div>
        <ol className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {error && <li className="px-2 text-sm text-chili-600">{error}</li>}
          {!posts && !error && <Loader2 className="mx-auto mt-10 size-5 animate-spin text-ink-400" />}
          {posts?.length === 0 && (
            <li className="px-2 py-10 text-center text-sm text-ink-400">
              <Newspaper className="mx-auto mb-2 size-7" />
              Chưa có bài viết nào.
            </li>
          )}
          {posts?.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => p.id !== selected && open(p.id)}
                className={`flex w-full gap-2.5 rounded-lg border p-1.5 text-left transition ${p.id === selected ? "border-forest-600 bg-sun-400/15" : "border-transparent hover:border-mist-200"}`}
              >
                <span className="size-12 shrink-0 overflow-hidden rounded-md bg-mist-100">{p.cover && <img src={p.cover} alt="" className="size-full object-cover" />}</span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm leading-snug text-ink-900">{p.title.vi || p.title.en || "(chưa có tiêu đề)"}</span>
                  <span className="mt-1 flex items-center gap-1.5">
                    <StatusChip p={p} />
                    <span className="text-[11px] text-ink-400">{p.date}</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        {canWrite && (
          <div className="border-t border-mist-200 p-3">
            <button type="button" onClick={create} disabled={busy === "create"} className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-60">
              {busy === "create" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Bài viết mới
            </button>
          </div>
        )}
      </aside>

      <section className="flex w-[30rem] shrink-0 flex-col border-r border-mist-200 bg-white">
        {draft && record ? (
          <Panel
            title={draft.title.vi || draft.title.en || "(chưa có tiêu đề)"}
            subtitle={`/news/${draft.slug}`}
            actions={
              canPublish ? (
                <button type="button" title="Xoá bài" onClick={remove} disabled={busy === "delete"} className="rounded-lg p-1.5 text-ink-600 hover:bg-red-50 hover:text-chili-600">
                  <Trash2 className="size-4" />
                </button>
              ) : undefined
            }
          >
            <div className="-mt-1 mb-5 rounded-xl border border-mist-200 bg-mist-50 p-3">
              <div className="flex flex-wrap items-center gap-2">
                {summary && <StatusChip p={summary} />}
                <SaveText state={save} error={saveError} />
                {record.updated_by && save === "idle" && (
                  <span className="text-[11px] text-ink-400">
                    Sửa lần cuối: {record.updated_by} · {formatTime(record.updated_at)}
                  </span>
                )}
              </div>
              {isScheduled(draft) && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-900">
                  <CalendarClock className="size-3.5 text-sun-500" /> Ngày đăng {draft.date} ở tương lai: sau khi xuất bản, bài sẽ tự hiện từ ngày đó.
                </p>
              )}
              {canPublish ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(!live || changed) && (
                    <button type="button" onClick={() => act("publish")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-lg bg-sun-400 px-3 py-1.5 text-sm font-medium text-forest-950 hover:bg-sun-500 disabled:opacity-60">
                      {busy === "publish" ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />} {live ? "Cập nhật bài đang hiển thị" : "Xuất bản"}
                    </button>
                  )}
                  {changed && (
                    <button type="button" onClick={() => act("revert")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm text-ink-900 hover:bg-mist-50">
                      <Undo2 className="size-4" /> Bỏ thay đổi
                    </button>
                  )}
                  {live && (
                    <button type="button" onClick={() => act("unpublish")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm text-ink-900 hover:bg-mist-50">
                      <RotateCcw className="size-4" /> Gỡ khỏi website
                    </button>
                  )}
                  {live && !changed && (
                    <a href={`/${locale}/news/${record.published?.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-1 py-1.5 text-sm text-forest-600 hover:underline">
                      <Check className="size-4" /> Xem trên website
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-xs text-ink-600">Bản nháp được lưu tự động. Người có vai trò Biên tập chính hoặc Quản trị sẽ xuất bản bài.</p>
              )}
            </div>

            <SeoPreview
              siteName={settings.name}
              title={`${t(draft.seo.title) || t(draft.title)} | ${settings.name}`}
              description={t(draft.seo.description) || t(draft.excerpt) || plainText(t(draft.body)).slice(0, 160)}
              url={`${settings.url}/${locale}/news/${draft.slug}`}
              image={draft.cover?.src}
            />
            <fieldset disabled={!canWrite} className="disabled:opacity-70">
              <FieldForm fields={postFields} value={draft} onChange={onField} />
            </fieldset>
          </Panel>
        ) : (
          <Panel title={selected ? "Đang mở…" : "Chưa chọn bài nào"}>
            {selected ? <Loader2 className="size-5 animate-spin text-ink-400" /> : <p className="text-sm text-ink-600">Chọn một bài bên trái{canWrite ? " hoặc bấm “Bài viết mới”" : ""}.</p>}
          </Panel>
        )}
      </section>

      <Preview ref={preview} path={draft ? `/news/${draft.slug}` : "/news"} locale={locale} onLocale={onLocale} />
    </>
  );
}

function SaveText({ state, error }: { state: Save; error: string }) {
  if (state === "error")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-chili-600">
        <AlertTriangle className="size-3.5" /> {error}
      </span>
    );
  if (state === "pending" || state === "saving")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-ink-600">
        <Loader2 className="size-3.5 animate-spin" /> Đang lưu…
      </span>
    );
  if (state === "saved")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-forest-600">
        <Check className="size-3.5" /> Đã lưu nháp
      </span>
    );
  return null;
}
