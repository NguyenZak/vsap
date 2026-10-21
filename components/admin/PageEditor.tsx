"use client";

import { useState } from "react";
import {
  BookOpen,
  ChartNoAxesColumn,
  ChevronDown,
  ChevronUp,
  Columns3,
  Copy,
  Eye,
  EyeOff,
  GalleryHorizontal,
  GripVertical,
  Handshake,
  Image,
  Images,
  LayoutGrid,
  LayoutPanelLeft,
  ListChecks,
  ListCollapse,
  Mail,
  Megaphone,
  MessageCircleQuestion,
  Package,
  PanelLeft,
  Plus,
  Rows3,
  Settings2,
  Square,
  Text,
  Trash2,
  Type,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { pageSeoFields } from "@/lib/cms/collections";
import { sectionDef, sectionDefs } from "@/lib/cms/registry";
import type { Page, Section } from "@/lib/cms/types";
import { FieldForm } from "./fields";

type Path = (string | number)[];

// Icons named in lib/cms/registry.ts for the section library.
const defIcons: Record<string, LucideIcon> = {
  "gallery-horizontal": GalleryHorizontal,
  image: Image,
  "rows-3": Rows3,
  type: Type,
  "list-collapse": ListCollapse,
  workflow: Workflow,
  "chart-no-axes-column": ChartNoAxesColumn,
  package: Package,
  "layout-grid": LayoutGrid,
  handshake: Handshake,
  "message-circle-question": MessageCircleQuestion,
  megaphone: Megaphone,
  "book-open": BookOpen,
  "columns-3": Columns3,
  "panel-left": PanelLeft,
  "list-checks": ListChecks,
  mail: Mail,
  text: Text,
  "layout-panel-left": LayoutPanelLeft,
  images: Images,
};

function DefIcon({ name, className }: { name: string; className?: string }) {
  const Icon = defIcons[name] ?? Square;
  return <Icon className={className} />;
}

/** Short subtitle for a section row: its heading, first slide, or first item. */
function sectionSummary(s: Section) {
  const p = s.props as Record<string, unknown>;
  const text = (v: unknown) => (v && typeof v === "object" && "vi" in (v as object) ? String((v as { vi: string }).vi) : typeof v === "string" ? v : "");
  const first = (k: string) => (Array.isArray(p[k]) ? (p[k] as Record<string, unknown>[])[0] : undefined);
  return (
    text(p.title) ||
    text(first("slides")?.title) ||
    text(first("items")?.strong) ||
    text(first("items")?.title) ||
    text(p.tag) ||
    text(p.lead) ||
    ""
  );
}

export const newSectionId = (type: string) => `${type}-${Math.random().toString(36).slice(2, 8)}`;

export function SectionList({
  page,
  selected,
  onSelect,
  onChange,
}: {
  page: Page;
  selected: string | null;
  onSelect: (id: string) => void;
  onChange: (sections: Section[]) => void;
}) {
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [library, setLibrary] = useState(false);
  const sections = page.sections;

  const move = (from: number, to: number) => {
    if (to < 0 || to >= sections.length || from === to) return;
    const next = [...sections];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };

  const insert = (type: string) => {
    const def = sectionDef(type)!;
    const s: Section = { id: newSectionId(type), type, props: def.create() };
    const at = selected ? sections.findIndex((x) => x.id === selected) + 1 : sections.length;
    onChange([...sections.slice(0, at), s, ...sections.slice(at)]);
    onSelect(s.id);
    setLibrary(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <button
        type="button"
        onClick={() => onSelect("seo")}
        className={`mx-3 mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${selected === "seo" ? "bg-forest-900 text-white" : "bg-mist-50 text-ink-900 hover:bg-mist-100"}`}
      >
        <Settings2 className="size-4" /> Cài đặt trang (SEO)
      </button>
      <p className="mt-4 px-4 text-[11px] font-medium tracking-wider text-ink-400 uppercase">Các section · kéo để sắp xếp</p>
      <ol className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {sections.map((s, i) => {
          const def = sectionDef(s.type);
          const active = s.id === selected;
          return (
            <li
              key={s.id}
              draggable
              onDragStart={(e) => {
                setDrag(i);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(i);
              }}
              onDrop={() => {
                if (drag !== null) move(drag, i);
                setDrag(null);
                setOver(null);
              }}
              onDragEnd={() => {
                setDrag(null);
                setOver(null);
              }}
              className={`group rounded-lg border transition ${active ? "border-forest-600 bg-lime-300/15" : "border-transparent bg-white hover:border-mist-200"} ${
                drag === i ? "opacity-40" : ""
              } ${over === i && drag !== null && drag !== i ? "ring-2 ring-forest-600/40" : ""}`}
            >
              <div className="flex items-center gap-1.5 py-1.5 pr-1.5 pl-1">
                <GripVertical className="size-4 shrink-0 cursor-grab text-ink-400" />
                <span className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md ${active ? "bg-forest-900 text-lime-300" : "bg-mist-100 text-ink-600"}`}>
                  <DefIcon name={def?.icon ?? "square"} className="size-3.5" />
                </span>
                <button type="button" onClick={() => onSelect(s.id)} className={`min-w-0 flex-1 text-left ${s.hidden ? "opacity-50" : ""}`}>
                  <span className="block truncate text-sm text-ink-900">{def?.label ?? s.type}</span>
                  <span className="block truncate text-xs text-ink-400">{sectionSummary(s) || " "}</span>
                </button>
                <div className={`flex items-center ${active ? "" : "opacity-0 group-hover:opacity-100"}`}>
                  <button
                    type="button"
                    title={s.hidden ? "Hiện section" : "Ẩn section"}
                    onClick={() => onChange(sections.map((x) => (x.id === s.id ? { ...x, hidden: !x.hidden } : x)))}
                    className="rounded p-1 text-ink-400 hover:bg-mist-100 hover:text-ink-900"
                  >
                    {s.hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                  <button type="button" title="Lên" onClick={() => move(i, i - 1)} disabled={i === 0} className="rounded p-1 text-ink-400 hover:bg-mist-100 disabled:opacity-30">
                    <ChevronUp className="size-3.5" />
                  </button>
                  <button type="button" title="Xuống" onClick={() => move(i, i + 1)} disabled={i === sections.length - 1} className="rounded p-1 text-ink-400 hover:bg-mist-100 disabled:opacity-30">
                    <ChevronDown className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="border-t border-mist-200 p-3">
        <button
          type="button"
          onClick={() => setLibrary(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-sm font-medium text-white hover:bg-forest-800"
        >
          <Plus className="size-4" /> Thêm section
        </button>
      </div>
      {library && <SectionLibrary onPick={insert} onClose={() => setLibrary(false)} />}
    </div>
  );
}

function SectionLibrary({ onPick, onClose }: { onPick: (type: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Thêm section" className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-ink-900">Thêm section</h2>
            <p className="text-sm text-ink-600">Section mới được chèn ngay sau section đang chọn.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100">
            <X className="size-5" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sectionDefs.map((d) => (
            <button
              key={d.type}
              type="button"
              onClick={() => onPick(d.type)}
              className="flex items-start gap-3 rounded-xl border border-mist-200 p-4 text-left transition hover:border-forest-600 hover:bg-lime-300/10"
            >
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-mist-100 text-forest-900">
                <DefIcon name={d.icon} className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink-900">{d.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-ink-600">{d.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Right-hand panel: fields of the selected section, or the page's SEO settings. */
export function SectionInspector({
  page,
  basePath,
  selected,
  onChange,
  onSections,
  onSelect,
  seoPreview,
}: {
  page: Page;
  basePath: Path;
  selected: string | null;
  onChange: (path: Path, value: unknown) => void;
  onSections: (sections: Section[]) => void;
  onSelect: (id: string | null) => void;
  /** Search/social preview shown above the page's SEO fields. */
  seoPreview?: React.ReactNode;
}) {
  if (selected === "seo") {
    return (
      <Panel title="Cài đặt trang" subtitle={page.label}>
        {seoPreview}
        <FieldForm fields={pageSeoFields} value={page.seo} path={[...basePath, "seo"]} onChange={onChange} />
      </Panel>
    );
  }
  const index = page.sections.findIndex((s) => s.id === selected);
  const section = page.sections[index];
  if (!section) {
    return (
      <Panel title="Chọn một section">
        <p className="text-sm leading-relaxed text-ink-600">Bấm vào một section trong danh sách bên trái, hoặc bấm trực tiếp lên trang ở khung xem trước để sửa nội dung.</p>
      </Panel>
    );
  }
  const def = sectionDef(section.type);
  const actions = (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title="Nhân bản"
        onClick={() => {
          const copy = { ...structuredClone(section), id: newSectionId(section.type) };
          onSections([...page.sections.slice(0, index + 1), copy, ...page.sections.slice(index + 1)]);
          onSelect(copy.id);
        }}
        className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100"
      >
        <Copy className="size-4" />
      </button>
      <button
        type="button"
        title="Xoá section"
        onClick={() => {
          if (!confirm(`Xoá section “${def?.label ?? section.type}”? Có thể hoàn tác bằng Ctrl/Cmd + Z.`)) return;
          onSections(page.sections.filter((s) => s.id !== section.id));
          onSelect(null);
        }}
        className="rounded-lg p-1.5 text-ink-600 hover:bg-red-50 hover:text-chili-600"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
  return (
    <Panel title={def?.label ?? section.type} subtitle={def?.description} actions={actions}>
      {section.hidden && <p className="mb-4 rounded-lg bg-sun-500/10 px-3 py-2 text-xs text-ink-900">Section này đang bị ẩn, khách truy cập sẽ không thấy.</p>}
      {def ? (
        <FieldForm fields={def.fields} value={section.props} path={[...basePath, "sections", index, "props"]} onChange={onChange} />
      ) : (
        <p className="text-sm text-chili-600">Loại section “{section.type}” không còn được hỗ trợ.</p>
      )}
    </Panel>
  );
}

export function Panel({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-mist-200 px-5 py-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-medium text-ink-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs leading-snug text-ink-600">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
    </div>
  );
}
