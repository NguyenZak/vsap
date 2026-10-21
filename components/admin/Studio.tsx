"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  Building2,
  Check,
  CloudOff,
  ExternalLink,
  FileText,
  Handshake,
  History,
  ImageIcon,
  Inbox,
  KeyRound,
  Languages,
  LayoutTemplate,
  Loader2,
  LogOut,
  Newspaper,
  Redo2,
  Rocket,
  ScrollText,
  ShoppingBag,
  Undo2,
  Users,
  X,
} from "lucide-react";
import type { Permission } from "@/lib/cms/roles";
import { newProduct, newRetailPack, partnerFields, productFields, retailFields, settingsFields } from "@/lib/cms/collections";
import { setIn } from "@/lib/cms/fields";
import type { Locale } from "@/lib/i18n";
import type { PageId, Partner, Product, RetailPack, Section, SiteContent } from "@/lib/cms/types";
import { api, formatTime, type Me } from "./api";
import { CollectionEditor } from "./CollectionEditor";
import { FieldForm, LinkSuggestions } from "./fields";
import { Panel, SectionInspector, SectionList } from "./PageEditor";
import { Preview, type PreviewHandle } from "./Preview";
import { SeoPreview } from "./SeoPreview";
import { UiEditor } from "./UiEditor";
import { pageImage } from "@/lib/seo";
import { HistoryView, MediaView } from "./Views";
import { InboxView } from "./InboxView";
import { PostsView } from "./PostsView";
import { AuditView, ChangePassword, RoleBadge, UsersView } from "./TeamViews";

type Path = (string | number)[];
type View =
  | { kind: "page"; id: PageId }
  | { kind: "products" | "retail" | "partners" | "settings" | "ui" | "media" | "history" | "news" | "inbox" | "users" | "audit" };

type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

const PAGE_IDS: PageId[] = ["home", "about", "products", "quality", "news", "contact"];

const nav: { kind: View["kind"]; label: string; icon: typeof FileText; perm: Permission }[] = [
  { kind: "page", label: "Trang", icon: LayoutTemplate, perm: "content.read" },
  { kind: "news", label: "Tin tức", icon: Newspaper, perm: "content.read" },
  { kind: "products", label: "Sản phẩm", icon: Boxes, perm: "content.read" },
  { kind: "retail", label: "Bán lẻ", icon: ShoppingBag, perm: "content.read" },
  { kind: "partners", label: "Đối tác", icon: Handshake, perm: "content.read" },
  { kind: "settings", label: "Công ty", icon: Building2, perm: "content.read" },
  { kind: "ui", label: "Chữ giao diện", icon: Languages, perm: "content.read" },
  { kind: "media", label: "Thư viện ảnh", icon: ImageIcon, perm: "content.read" },
  { kind: "history", label: "Lịch sử", icon: History, perm: "content.read" },
  { kind: "inbox", label: "Báo giá", icon: Inbox, perm: "inquiries" },
  { kind: "users", label: "Tài khoản", icon: Users, perm: "users" },
  { kind: "audit", label: "Nhật ký", icon: ScrollText, perm: "audit" },
];

/** Views that don't use the site preview pane. */
const NO_PREVIEW: View["kind"][] = ["media", "history", "news", "inbox", "users", "audit"];

function viewFromUrl(): View {
  if (typeof window === "undefined") return { kind: "page", id: "home" };
  const q = new URLSearchParams(location.search);
  const kind = q.get("view") as View["kind"] | null;
  if (kind && kind !== "page" && nav.some((n) => n.kind === kind)) return { kind } as View;
  const id = q.get("page") as PageId | null;
  return { kind: "page", id: id && PAGE_IDS.includes(id) ? id : "home" };
}

/** How long typing pauses before the draft is saved. */
const AUTOSAVE_MS = 800;
const HISTORY_LIMIT = 80;

export function Studio() {
  const [me, setMe] = useState<Me | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadError, setLoadError] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [publishedAt, setPublishedAt] = useState<number | null>(null);
  const [save, setSave] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const [view, setView] = useState<View>({ kind: "page", id: "home" });
  const [selected, setSelected] = useState<string | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [locale, setLocale] = useState<Locale>("vi");
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newInquiries, setNewInquiries] = useState(0);
  const preview = useRef<PreviewHandle>(null);

  // Undo / redo of whole-content snapshots; rapid edits (typing) collapse into one step.
  const past = useRef<SiteContent[]>([]);
  const future = useRef<SiteContent[]>([]);
  const lastPush = useRef(0);
  const [, force] = useState(0);
  const dirty = useRef(false);
  const latest = useRef<SiteContent | null>(null);
  latest.current = content;

  const load = useCallback(async () => {
    try {
      const s = await api.state();
      setContent(s.content);
      setHasDraft(s.hasDraft);
      setPublishedAt(s.publishedAt);
      past.current = [];
      future.current = [];
      dirty.current = false;
      setSave("idle");
      preview.current?.reload();
    } catch (e) {
      setLoadError((e as Error).message);
    }
  }, []);

  // Who is signed in decides which parts of the Studio exist.
  useEffect(() => {
    api
      .me()
      .then((m) => {
        setMe(m);
        const allowed = (k: View["kind"]) => nav.some((n) => n.kind === k && m.permissions.includes(n.perm));
        const wanted = viewFromUrl();
        const first = nav.find((n) => m.permissions.includes(n.perm))?.kind ?? "inbox";
        setView(allowed(wanted.kind) ? wanted : first === "page" ? { kind: "page", id: "home" } : ({ kind: first } as View));
        if (m.permissions.includes("content.read")) load();
      })
      .catch((e: Error) => setLoadError(e.message));
  }, [load]);

  const can = (p: Permission) => Boolean(me?.permissions.includes(p));
  const canInbox = can("inquiries");

  // Unread quote requests, for the badge on "Báo giá".
  useEffect(() => {
    if (!canInbox) return;
    const poll = () => api.inquiries({ status: "new" }).then((r) => setNewInquiries(r.counts.new)).catch(() => {});
    poll();
    const t = setInterval(poll, 120_000);
    return () => clearInterval(t);
  }, [canInbox]);
  const onInboxCounts = useCallback((c: { new: number }) => setNewInquiries(c.new), []);

  // Mirror the view in the URL, but only once the user is known: until then the
  // initial view is a placeholder and would overwrite a deep link like ?view=inbox.
  useEffect(() => {
    if (!me) return;
    const q = new URLSearchParams();
    if (view.kind === "page") q.set("page", view.id);
    else q.set("view", view.kind);
    history.replaceState(null, "", `/admin?${q}`);
  }, [view, me]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  // ---- Editing --------------------------------------------------------------

  const apply = useCallback((next: SiteContent) => {
    setContent(next);
    dirty.current = true;
    setSave("pending");
  }, []);

  const update = useCallback(
    (fn: (c: SiteContent) => SiteContent) => {
      const cur = latest.current;
      if (!cur) return;
      const now = Date.now();
      if (now - lastPush.current > 600) {
        past.current = [...past.current.slice(-HISTORY_LIMIT + 1), cur];
        future.current = [];
        lastPush.current = now;
      }
      apply(fn(cur));
    },
    [apply],
  );

  const onField = useCallback((path: Path, value: unknown) => update((c) => setIn(c, path, value)), [update]);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev || !latest.current) return;
    future.current.push(latest.current);
    lastPush.current = 0;
    apply(prev);
    force((n) => n + 1);
  }, [apply]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next || !latest.current) return;
    past.current.push(latest.current);
    lastPush.current = 0;
    apply(next);
    force((n) => n + 1);
  }, [apply]);

  // ---- Autosave -------------------------------------------------------------

  const saveNow = useCallback(async () => {
    const c = latest.current;
    if (!c || !dirty.current) return;
    dirty.current = false;
    setSave("saving");
    try {
      await api.saveDraft(c);
      setHasDraft(true);
      setSave(dirty.current ? "pending" : "saved");
      setSaveError("");
      preview.current?.reload();
    } catch (e) {
      dirty.current = true;
      setSave("error");
      setSaveError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    if (save !== "pending") return;
    const t = setTimeout(saveNow, AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [content, save, saveNow]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "s") {
        e.preventDefault();
        saveNow();
      } else if (k === "z" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (k === "y" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        redo();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [saveNow, undo, redo]);

  // ---- Publish / discard ----------------------------------------------------

  const [publishOpen, setPublishOpen] = useState(false);
  const [note, setNote] = useState("");
  const doPublish = async () => {
    setPublishing(true);
    try {
      await saveNow();
      const r = await api.publish(note);
      setHasDraft(false);
      setPublishedAt(r.publishedAt);
      setPublishOpen(false);
      setNote("");
      flash("Đã xuất bản. Website đã được cập nhật.");
    } catch (e) {
      alert(`Xuất bản thất bại: ${(e as Error).message}`);
    } finally {
      setPublishing(false);
    }
  };
  const doDiscard = async () => {
    if (!confirm("Bỏ toàn bộ thay đổi chưa xuất bản và quay về bản đang chạy trên website?")) return;
    await api.discard();
    await load();
    flash("Đã bỏ bản nháp.");
  };

  // ---- Render ---------------------------------------------------------------

  if (loadError) {
    return (
      <div className="flex h-dvh items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-mist-200 p-6 text-center">
          <CloudOff className="mx-auto size-8 text-chili-600" />
          <p className="mt-3 font-medium text-ink-900">Không tải được nội dung</p>
          <p className="mt-1 text-sm text-ink-600">{loadError}</p>
        </div>
      </div>
    );
  }
  if (!me || (can("content.read") && !content)) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2 className="size-7 animate-spin text-forest-600" />
      </div>
    );
  }

  const go = (v: View) => {
    setView(v);
    setSelected(null);
    setItemIndex(0);
  };

  // What the preview shows for the current view.
  let previewPath = "/";
  if (content) {
    if (view.kind === "page") previewPath = content.pages[view.id].path || "/";
    if (view.kind === "products" && content.products[itemIndex]) previewPath = `/products/${content.products[itemIndex].slug}`;
    if (view.kind === "retail" && content.retailPacks[itemIndex]) previewPath = `/products/${content.retailPacks[itemIndex].product}#packs`;
    if (view.kind === "settings") previewPath = "/contact";
  }

  const showPreview = Boolean(content) && !NO_PREVIEW.includes(view.kind);
  const canWrite = can("content.write");
  const canPublish = can("content.publish");
  const tr = (v: { vi: string } | undefined) => v?.vi ?? "";

  return (
    <div className="flex h-dvh flex-col bg-mist-50 text-ink-900">
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white p-8 text-center lg:hidden">
        <div>
          <img src="/logo.svg" alt="VSAP" className="mx-auto h-10 w-auto" />
          <p className="mt-5 font-medium text-ink-900">VSAP Studio cần màn hình rộng hơn</p>
          <p className="mt-1 text-sm text-ink-600">Vui lòng mở trên máy tính hoặc máy tính bảng xoay ngang (từ 1024px).</p>
        </div>
      </div>
      {content && <LinkSuggestions extra={content.products.map((p) => `/products/${p.slug}`)} />}

      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-mist-200 bg-white px-4">
        <img src="/logo.svg" alt="VSAP" className="h-8 w-auto" />
        <span className="rounded-md bg-forest-900 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-lime-300 uppercase">Studio</span>
        {content && <SaveBadge state={save} error={saveError} hasDraft={hasDraft} canPublish={canPublish} />}
        <div className="ml-auto flex items-center gap-1.5">
          {content && canWrite && (
            <>
              <button type="button" title="Hoàn tác (Ctrl/Cmd + Z)" onClick={undo} disabled={!past.current.length} className="rounded-lg p-2 text-ink-600 hover:bg-mist-100 disabled:opacity-30">
                <Undo2 className="size-4" />
              </button>
              <button type="button" title="Làm lại (Ctrl/Cmd + Shift + Z)" onClick={redo} disabled={!future.current.length} className="rounded-lg p-2 text-ink-600 hover:bg-mist-100 disabled:opacity-30">
                <Redo2 className="size-4" />
              </button>
              <span className="mx-1 h-6 w-px bg-mist-200" />
            </>
          )}
          {content && <span className="hidden text-xs text-ink-400 xl:inline">Xuất bản lần cuối: {formatTime(publishedAt)}</span>}
          {hasDraft && canPublish && (
            <button type="button" onClick={doDiscard} className="rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-mist-100">
              Bỏ thay đổi
            </button>
          )}
          <a href={`/${locale}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-mist-100">
            <ExternalLink className="size-4" /> Xem website
          </a>
          {content && canPublish && (
            <button
              type="button"
              onClick={() => setPublishOpen(true)}
              disabled={!hasDraft && save !== "pending"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-lime-300 px-4 py-2 text-sm font-medium text-forest-950 transition hover:bg-lime-400 disabled:bg-mist-100 disabled:text-ink-400"
            >
              <Rocket className="size-4" /> Xuất bản
            </button>
          )}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 hover:bg-mist-100"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-lime-300">
                {me.user.name.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? "?"}
              </span>
              <span className="hidden text-left leading-tight 2xl:block">
                <span className="block text-xs font-medium text-ink-900">{me.user.name}</span>
                <span className="block text-[11px] text-ink-400">{me.user.username}</span>
              </span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-[90]" onClick={() => setMenuOpen(false)} />
                <div role="menu" className="absolute top-full right-0 z-[95] mt-2 w-64 rounded-xl border border-mist-200 bg-white p-2 shadow-xl">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-ink-900">{me.user.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-400">
                      <span className="font-mono">{me.user.username}</span> <RoleBadge role={me.user.role} />
                    </p>
                  </div>
                  <div className="my-1 h-px bg-mist-200" />
                  {!me.user.owner && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        setPasswordOpen(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-900 hover:bg-mist-100"
                    >
                      <KeyRound className="size-4 text-ink-600" /> Đổi mật khẩu
                    </button>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={async () => {
                      await saveNow();
                      await api.logout();
                      location.href = "/admin/login";
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-900 hover:bg-mist-100"
                  >
                    <LogOut className="size-4 text-ink-600" /> Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Main nav */}
        <nav className="flex w-[4.5rem] shrink-0 flex-col items-stretch gap-1 overflow-y-auto border-r border-mist-200 bg-white py-3">
          {nav
            .filter((n) => can(n.perm))
            .map((n) => {
              const active = view.kind === n.kind;
              const badge = n.kind === "inbox" && newInquiries > 0 ? newInquiries : 0;
              return (
                <button
                  key={n.kind}
                  type="button"
                  onClick={() => go(n.kind === "page" ? { kind: "page", id: view.kind === "page" ? view.id : "home" } : ({ kind: n.kind } as View))}
                  className={`relative mx-2 flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] leading-tight transition ${active ? "bg-forest-900 text-white" : "text-ink-600 hover:bg-mist-100"}`}
                >
                  <n.icon className="size-[18px]" />
                  {n.label}
                  {badge > 0 && (
                    <span className="absolute top-1 right-1 min-w-4 rounded-full bg-chili-600 px-1 text-[10px] leading-4 font-semibold text-white" aria-label={`${badge} yêu cầu mới`}>
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>

        {/* Editors */}
        {view.kind === "page" && content && (
          <>
            <aside className="flex w-72 shrink-0 flex-col border-r border-mist-200 bg-white">
              <div className="border-b border-mist-200 p-3">
                <label className="text-[11px] font-medium tracking-wider text-ink-400 uppercase">Trang đang sửa</label>
                <select
                  value={view.id}
                  onChange={(e) => go({ kind: "page", id: e.target.value as PageId })}
                  className="mt-1 w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-600"
                >
                  {PAGE_IDS.map((id) => (
                    <option key={id} value={id}>
                      {content.pages[id].label} — /{content.pages[id].path.replace(/^\//, "")}
                    </option>
                  ))}
                </select>
              </div>
              <SectionList
                page={content.pages[view.id]}
                selected={selected}
                onSelect={(id) => {
                  setSelected(id);
                  if (id !== "seo") preview.current?.focus(id, true);
                }}
                onChange={(sections: Section[]) => onField(["pages", view.id, "sections"], sections)}
              />
            </aside>
            <section className="flex w-[26rem] shrink-0 flex-col border-r border-mist-200 bg-white">
              <SectionInspector
                page={content.pages[view.id]}
                basePath={["pages", view.id]}
                selected={selected}
                onChange={onField}
                onSections={(sections) => onField(["pages", view.id, "sections"], sections)}
                onSelect={setSelected}
                seoPreview={(() => {
                  const page = content.pages[view.id];
                  const t = (v: { vi: string; en: string }) => v[locale] || v.vi;
                  const title = t(page.seo.title) || (view.id === "home" ? t(content.settings.seo.title) : `${content.ui[locale].nav[view.id]}`);
                  return (
                    <SeoPreview
                      siteName={content.settings.name}
                      title={view.id === "home" ? title : `${title} | ${content.settings.name}`}
                      description={t(page.seo.description) || t(content.settings.seo.description)}
                      url={`${content.settings.url}/${locale}${page.path}`}
                      image={page.seo.image || pageImage(page)?.src || content.settings.seo.image}
                      noindex={page.seo.noindex}
                    />
                  );
                })()}
              />
            </section>
          </>
        )}

        {view.kind === "products" && content && (
          <CollectionEditor<Product>
            title="Sản phẩm chính"
            description="Mỗi sản phẩm có một trang chi tiết riêng (/products/slug)."
            items={content.products}
            basePath={["products"]}
            fields={productFields}
            selected={itemIndex}
            onSelect={setItemIndex}
            label={(p) => tr(p.name)}
            sublabel={(p) => `/products/${p.slug}`}
            thumb={(p) => p.image?.src}
            newItem={() => ({ ...newProduct(), slug: `san-pham-${content.products.length + 1}` }) as Product}
            onItems={(items) => onField(["products"], items)}
            onChange={onField}
            header={(p) => {
              const t = (v: { vi: string; en: string } | undefined) => (v ? v[locale] || v.vi : "");
              return (
                <SeoPreview
                  siteName={content.settings.name}
                  title={`${t(p.seo?.title) || t(p.name)} | ${content.settings.name}`}
                  description={t(p.seo?.description) || t(p.short)}
                  url={`${content.settings.url}/${locale}/products/${p.slug}`}
                  image={p.image?.src}
                />
              );
            }}
            validate={(p, all) =>
              !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)
                ? "Slug chỉ gồm chữ thường không dấu, số và gạch ngang."
                : all.filter((x) => x.slug === p.slug).length > 1
                  ? "Slug này đang trùng với sản phẩm khác."
                  : null
            }
          />
        )}

        {view.kind === "retail" && content && (
          <CollectionEditor<RetailPack>
            title="Sản phẩm bán lẻ"
            description="Hộp, hũ, túi mang thương hiệu VSAP; hiện ở băng trượt và trang chi tiết sản phẩm."
            items={content.retailPacks}
            basePath={["retailPacks"]}
            fields={retailFields}
            selected={itemIndex}
            onSelect={setItemIndex}
            label={(p) => tr(p.name)}
            sublabel={(p) => [tr(p.flavor), tr(p.pack), p.weights].filter(Boolean).join(" · ")}
            thumb={(p) => p.images[0]?.src}
            newItem={() => newRetailPack() as RetailPack}
            onItems={(items) => onField(["retailPacks"], items)}
            onChange={onField}
            validate={(p, all) =>
              !all.length || content.products.some((x) => x.slug === p.product) ? null : `Không có sản phẩm chính nào với slug “${p.product}”.`
            }
          />
        )}

        {view.kind === "partners" && content && (
          <CollectionEditor<Partner>
            title="Đối tác"
            description="Chỉ thêm đối tác thật đã đồng ý xuất hiện trên website."
            items={content.partners}
            basePath={["partners"]}
            fields={partnerFields}
            selected={itemIndex}
            onSelect={setItemIndex}
            label={(p) => p.name}
            sublabel={(p) => p.url}
            thumb={(p) => p.logo || undefined}
            newItem={() => ({ name: "Đối tác mới", logo: "", url: "" })}
            onItems={(items) => onField(["partners"], items)}
            onChange={onField}
          />
        )}

        {view.kind === "settings" && content && (
          <section className="flex w-[34rem] shrink-0 flex-col border-r border-mist-200 bg-white">
            <Panel title="Thông tin công ty" subtitle="Dùng ở chân trang, trang Liên hệ, nút liên hệ nổi và dữ liệu cho Google.">
              <SeoPreview
                siteName={content.settings.name}
                title={content.settings.seo.title[locale] || content.settings.seo.title.vi}
                description={content.settings.seo.description[locale] || content.settings.seo.description.vi}
                url={`${content.settings.url}/${locale}`}
                image={content.settings.seo.image}
              />
              <FieldForm fields={settingsFields} value={content.settings} path={["settings"]} onChange={onField} />
            </Panel>
          </section>
        )}

        {view.kind === "ui" && content && <UiEditor ui={content.ui} onChange={onField} />}
        {view.kind === "media" && <MediaView canDelete={can("media.delete")} />}
        {view.kind === "news" && content && (
          <PostsView settings={content.settings} canWrite={canWrite} canPublish={canPublish} locale={locale} onLocale={setLocale} />
        )}
        {view.kind === "inbox" && <InboxView onCounts={onInboxCounts} />}
        {view.kind === "users" && <UsersView me={me} />}
        {view.kind === "audit" && <AuditView />}
        {view.kind === "history" && (
          <HistoryView
            canRestore={canPublish}
            onRestored={async () => {
              await load();
              flash("Đã nạp phiên bản cũ vào bản nháp. Kiểm tra rồi bấm Xuất bản.");
              go({ kind: "page", id: "home" });
            }}
          />
        )}

        {showPreview && (
          <Preview
            ref={preview}
            path={previewPath}
            locale={locale}
            onLocale={setLocale}
            activeSection={view.kind === "page" && selected && selected !== "seo" ? selected : undefined}
            onSelect={
              view.kind === "page"
                ? (id) => {
                    setSelected(id);
                    preview.current?.focus(id, false);
                  }
                : undefined
            }
          />
        )}
      </div>

      {publishOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && setPublishOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Xuất bản" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-medium text-ink-900">Xuất bản thay đổi?</h2>
              <button type="button" onClick={() => setPublishOpen(false)} aria-label="Đóng" className="rounded-lg p-1 text-ink-600 hover:bg-mist-100">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-ink-600">Bản nháp sẽ thay thế nội dung đang chạy trên website. Phiên bản hiện tại vẫn được giữ trong Lịch sử.</p>
            <label className="mt-4 block">
              <span className="text-xs font-medium text-ink-900">Ghi chú (không bắt buộc)</span>
              <input
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doPublish()}
                placeholder="VD: Cập nhật ảnh sản phẩm macca"
                className="mt-1 w-full rounded-lg border border-mist-200 px-3 py-2 text-sm outline-none focus:border-forest-600"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setPublishOpen(false)} className="rounded-lg px-4 py-2 text-sm text-ink-600 hover:bg-mist-100">
                Huỷ
              </button>
              <button
                type="button"
                onClick={doPublish}
                disabled={publishing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-lime-300 px-4 py-2 text-sm font-medium text-forest-950 hover:bg-lime-400 disabled:opacity-60"
              >
                {publishing ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />} Xuất bản
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordOpen && <ChangePassword onClose={() => setPasswordOpen(false)} />}

      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-forest-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function SaveBadge({ state, error, hasDraft, canPublish }: { state: SaveState; error: string; hasDraft: boolean; canPublish: boolean }) {
  if (state === "error")
    return (
      <span title={error} className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs text-chili-600">
        <AlertTriangle className="size-3.5" /> Lưu thất bại — {error}
      </span>
    );
  if (state === "pending" || state === "saving")
    return (
      <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-2.5 py-1 text-xs text-ink-600">
        <Loader2 className="size-3.5 animate-spin" /> Đang lưu nháp…
      </span>
    );
  if (hasDraft)
    return (
      <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-sun-500/10 px-2.5 py-1 text-xs text-ink-900">
        <Check className="size-3.5 text-forest-600" /> Đã lưu nháp · {canPublish ? "chưa xuất bản" : "chờ Biên tập chính xuất bản"}
      </span>
    );
  return (
    <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-lime-300/30 px-2.5 py-1 text-xs text-forest-900">
      <Check className="size-3.5" /> Đang khớp với website
    </span>
  );
}
