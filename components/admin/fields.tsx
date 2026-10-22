"use client";

import { useRef, useState } from "react";
import { locales, type Locale } from "@/lib/locales";
import { Bold, ChevronDown, ChevronUp, Copy, GripVertical, Heading2, Heading3, ImageIcon, Italic, Link2, List, ListOrdered, Minus, Plus, Quote, Trash2 } from "lucide-react";
import { getIn, type FieldDef } from "@/lib/cms/fields";
import { iconNames } from "@/lib/cms/icons";
import { CmsIcon } from "@/components/cms/Icon";
import { MediaPicker } from "./MediaPicker";

type Path = (string | number)[];
type OnChange = (path: Path, value: unknown) => void;
type L = Record<Locale, string>;

const inputCls =
  "w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-forest-600 focus:ring-2 focus:ring-sun-400/50";

/** Site paths offered as suggestions in link fields. */
export const LINK_SUGGESTIONS = ["/", "/about", "/products", "/products/cashew", "/products/macadamia", "/quality", "/news", "/contact", "#inquiry"];

const asL = (v: unknown): L =>
  Object.fromEntries(locales.map((l, i) => [l, v && typeof v === "object" ? String((v as Partial<L>)[l] ?? "") : i === 0 ? String(v ?? "") : ""])) as L;

function Label({ field, children }: { field: FieldDef; children?: React.ReactNode }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <span className="text-xs font-medium text-ink-900">{field.label}</span>
      {children}
    </div>
  );
}

function Help({ text }: { text?: string }) {
  return text ? <p className="mt-1 text-xs leading-snug text-ink-400">{text}</p> : null;
}

/** One input per site language for a localized value, labelled VI / EN / ZH. */
function Bilingual({ value, onChange, multiline, rows = 3 }: { value: L; onChange: (v: L) => void; multiline?: boolean; rows?: number }) {
  return (
    <div className="space-y-1.5">
      {locales.map((lang) => (
        <div key={lang} className="relative">
          <span className="pointer-events-none absolute top-2 left-2.5 rounded bg-mist-100 px-1 text-[10px] font-semibold text-ink-600 uppercase">{lang}</span>
          {multiline ? (
            <textarea
              value={value[lang]}
              rows={rows}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              className={`${inputCls} resize-y pl-10 leading-relaxed`}
            />
          ) : (
            <input value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} className={`${inputCls} pl-10`} />
          )}
        </div>
      ))}
    </div>
  );
}

function ImageField({ value, onChange, withAlt }: { value: { src: string; alt?: L }; onChange: (v: unknown) => void; withAlt: boolean }) {
  const [open, setOpen] = useState(false);
  const src = value?.src ?? "";
  return (
    <div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative size-24 shrink-0 overflow-hidden rounded-lg border border-mist-200 bg-mist-50"
          aria-label="Đổi ảnh"
        >
          {src ? <img src={src} alt="" className="size-full object-cover" /> : <ImageIcon className="m-auto size-6 text-ink-400" />}
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">Đổi ảnh</span>
        </button>
        <div className="min-w-0 flex-1 space-y-1.5">
          <input value={src} onChange={(e) => onChange(withAlt ? { ...value, src: e.target.value } : e.target.value)} placeholder="/images/… hoặc https://…" className={`${inputCls} font-mono text-xs`} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpen(true)} className="rounded-lg bg-mist-100 px-3 py-1.5 text-xs font-medium text-ink-900 hover:bg-mist-200">
              Chọn ảnh…
            </button>
            {src && (
              <button type="button" onClick={() => onChange(withAlt ? { ...value, src: "" } : "")} className="rounded-lg px-3 py-1.5 text-xs text-ink-600 hover:bg-mist-100">
                Bỏ ảnh
              </button>
            )}
          </div>
        </div>
      </div>
      {withAlt && (
        <div className="mt-2">
          <p className="mb-1 text-[11px] text-ink-400">Mô tả ảnh (cho người khiếm thị và Google)</p>
          <Bilingual value={asL(value?.alt)} onChange={(alt) => onChange({ ...value, alt })} />
        </div>
      )}
      {open && (
        <MediaPicker
          current={src}
          onClose={() => setOpen(false)}
          onPick={(p) => {
            if (withAlt) {
              const hasAlt = value?.alt && (value.alt.vi || value.alt.en);
              onChange({ src: p.src, alt: hasAlt ? value.alt : (p.alt ?? { vi: "", en: "" }) });
            } else onChange(p.src);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} className={`${inputCls} flex items-center gap-2 text-left`}>
        <span className="inline-flex size-7 items-center justify-center rounded-md bg-sun-400 text-forest-950">
          <CmsIcon name={value} className="size-4" />
        </span>
        <span className="flex-1 text-ink-600">{value || "Chọn biểu tượng"}</span>
        <ChevronDown className="size-4 text-ink-400" />
      </button>
      {open && (
        <div className="mt-1.5 grid grid-cols-8 gap-1 rounded-lg border border-mist-200 bg-white p-2 shadow-lg">
          {iconNames.map((name) => (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              className={`inline-flex aspect-square items-center justify-center rounded-md transition hover:bg-mist-100 ${value === name ? "bg-sun-400 text-forest-950" : "text-ink-600"}`}
            >
              <CmsIcon name={name} className="size-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const itemTitle = (item: unknown, field: Extract<FieldDef, { type: "list" }>, i: number) => {
  const raw = field.titleKey ? getIn(item, [field.titleKey]) : undefined;
  const text = typeof raw === "string" ? raw : raw && typeof raw === "object" ? (raw as L).vi || (raw as L).en : "";
  return text?.trim() || `${field.itemLabel[0].toUpperCase()}${field.itemLabel.slice(1)} ${i + 1}`;
};

function ListField({ field, value, path, onChange }: { field: Extract<FieldDef, { type: "list" }>; value: unknown[]; path: Path; onChange: OnChange }) {
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState<number | null>(items.length === 1 ? 0 : null);
  const [drag, setDrag] = useState<number | null>(null);
  const set = (next: unknown[]) => onChange(path, next);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    set(next);
    setOpen((o) => (o === from ? to : o));
  };
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div
          key={i}
          draggable
          onDragStart={(e) => {
            setDrag(i);
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => drag !== null && move(drag, i)}
          onDragEnd={() => setDrag(null)}
          className={`rounded-lg border bg-white ${open === i ? "border-forest-600/40 shadow-sm" : "border-mist-200"} ${drag === i ? "opacity-50" : ""}`}
        >
          <div className="flex items-center gap-1 px-1.5 py-1">
            <GripVertical className="size-4 shrink-0 cursor-grab text-ink-400" />
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="min-w-0 flex-1 truncate px-1 py-1 text-left text-sm text-ink-900">
              {itemTitle(item, field, i)}
            </button>
            <button type="button" title="Lên" onClick={() => move(i, i - 1)} disabled={i === 0} className="rounded p-1 text-ink-400 hover:bg-mist-100 disabled:opacity-30">
              <ChevronUp className="size-4" />
            </button>
            <button type="button" title="Xuống" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} className="rounded p-1 text-ink-400 hover:bg-mist-100 disabled:opacity-30">
              <ChevronDown className="size-4" />
            </button>
            <button type="button" title="Nhân bản" onClick={() => set([...items.slice(0, i + 1), structuredClone(item), ...items.slice(i + 1)])} className="rounded p-1 text-ink-400 hover:bg-mist-100">
              <Copy className="size-3.5" />
            </button>
            <button
              type="button"
              title="Xoá"
              onClick={() => confirm(`Xoá ${field.itemLabel} “${itemTitle(item, field, i)}”?`) && set(items.filter((_, j) => j !== i))}
              className="rounded p-1 text-ink-400 hover:bg-red-50 hover:text-chili-600"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
          {open === i && (
            <div className="border-t border-mist-200 p-3">
              <FieldForm fields={field.fields} value={item} path={[...path, i]} onChange={onChange} />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          set([...items, field.newItem()]);
          setOpen(items.length);
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-mist-200 py-2 text-sm text-forest-600 hover:border-forest-600 hover:bg-sun-400/10"
      >
        <Plus className="size-4" /> Thêm {field.itemLabel}
      </button>
    </div>
  );
}

type Edit = { before: string; after?: string; placeholder?: string; line?: boolean };

const tools: { label: string; icon: typeof Bold; edit: Edit }[] = [
  { label: "Tiêu đề lớn", icon: Heading2, edit: { before: "## ", placeholder: "Tiêu đề", line: true } },
  { label: "Tiêu đề nhỏ", icon: Heading3, edit: { before: "### ", placeholder: "Tiêu đề nhỏ", line: true } },
  { label: "Đậm", icon: Bold, edit: { before: "**", after: "**", placeholder: "chữ đậm" } },
  { label: "Nghiêng", icon: Italic, edit: { before: "*", after: "*", placeholder: "chữ nghiêng" } },
  { label: "Liên kết", icon: Link2, edit: { before: "[", after: "](/contact)", placeholder: "chữ liên kết" } },
  { label: "Danh sách", icon: List, edit: { before: "- ", placeholder: "Mục", line: true } },
  { label: "Danh sách số", icon: ListOrdered, edit: { before: "1. ", placeholder: "Mục", line: true } },
  { label: "Trích dẫn", icon: Quote, edit: { before: "> ", placeholder: "Trích dẫn", line: true } },
  { label: "Đường kẻ", icon: Minus, edit: { before: "---", line: true } },
];

/** Bilingual Markdown editor: a language switch, a formatting toolbar and a tall textarea. */
function MarkdownField({ value, onChange }: { value: L; onChange: (v: L) => void }) {
  const [lang, setLang] = useState<Locale>("vi");
  const [picking, setPicking] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const text = value[lang];

  const apply = ({ before, after = "", placeholder = "", line }: Edit) => {
    const el = area.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const picked = text.slice(start, end) || placeholder;
    // Block-level marks go on their own line.
    const pre = line && start > 0 && text[start - 1] !== "\n" ? "\n\n" : "";
    const post = line && text[end] !== undefined && text[end] !== "\n" ? "\n\n" : "";
    const next = `${text.slice(0, start)}${pre}${before}${picked}${after}${post}${text.slice(end)}`;
    onChange({ ...value, [lang]: next });
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const from = start + pre.length + before.length;
      el.setSelectionRange(from, from + picked.length);
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-mist-200 focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-sun-400/50">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-mist-200 bg-mist-50 px-1.5 py-1">
        <div className="mr-1 flex rounded-md bg-white p-0.5 shadow-sm">
          {locales.map((l) => (
            <button key={l} type="button" onClick={() => setLang(l)} className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${lang === l ? "bg-forest-900 text-white" : "text-ink-600"}`}>
              {l}
              {!value[l].trim() && <span className="ml-1 text-[9px] font-normal opacity-70">trống</span>}
            </button>
          ))}
        </div>
        {tools.map((t) => (
          <button key={t.label} type="button" title={t.label} aria-label={t.label} onClick={() => apply(t.edit)} className="rounded p-1.5 text-ink-600 hover:bg-white hover:text-ink-900">
            <t.icon className="size-4" />
          </button>
        ))}
        <button type="button" title="Chèn ảnh" aria-label="Chèn ảnh" onClick={() => setPicking(true)} className="rounded p-1.5 text-ink-600 hover:bg-white hover:text-ink-900">
          <ImageIcon className="size-4" />
        </button>
      </div>
      <textarea
        ref={area}
        value={text}
        rows={18}
        onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
        placeholder={lang === "en" ? "English version (optional). Leave empty to show the post only in Vietnamese." : "Nội dung bài viết…"}
        className="block w-full resize-y px-3 py-2.5 font-mono text-[13px] leading-relaxed text-ink-900 outline-none placeholder:text-ink-400"
      />
      <p className="border-t border-mist-200 bg-mist-50 px-3 py-1.5 text-[11px] text-ink-400">
        ## Tiêu đề · **đậm** · *nghiêng* · [chữ](/contact) · - danh sách · &gt; trích dẫn. Để một dòng trống giữa các đoạn.
      </p>
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(p) => {
            setPicking(false);
            const alt = ((p.alt as Partial<L> | undefined)?.[lang] || p.alt?.vi || "").replace(/[[\]]/g, "");
            apply({ before: `![${alt}](${p.src} "`, after: `")`, placeholder: "Chú thích ảnh", line: true });
          }}
        />
      )}
    </div>
  );
}

function Field({ field, value, path, onChange }: { field: FieldDef; value: unknown; path: Path; onChange: OnChange }) {
  const set = (v: unknown) => onChange(path, v);
  switch (field.type) {
    case "text":
    case "textarea":
      return (
        <div>
          <Label field={field} />
          <Bilingual value={asL(value)} onChange={set} multiline={field.type === "textarea"} rows={field.type === "textarea" ? field.rows : undefined} />
          <Help text={field.help} />
        </div>
      );
    case "string":
      return (
        <label className="block">
          <Label field={field} />
          <input value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => set(e.target.value)} className={inputCls} />
          <Help text={field.help} />
        </label>
      );
    case "number":
      return (
        <label className="block">
          <Label field={field} />
          <input
            type="number"
            value={typeof value === "number" ? value : ""}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => set(e.target.value === "" ? undefined : Number(e.target.value))}
            className={`${inputCls} w-32`}
          />
          <Help text={field.help} />
        </label>
      );
    case "boolean":
      return (
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-mist-50 px-3 py-2.5">
          <span className="text-sm text-ink-900">{field.label}</span>
          <input type="checkbox" checked={value !== false} onChange={(e) => set(e.target.checked)} className="peer sr-only" />
          <span className="relative h-5 w-9 rounded-full bg-mist-200 transition peer-checked:bg-forest-600 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
        </label>
      );
    case "date":
      return (
        <label className="block">
          <Label field={field} />
          <input type="date" value={String(value ?? "")} onChange={(e) => set(e.target.value)} className={`${inputCls} w-48`} />
          <Help text={field.help} />
        </label>
      );
    case "markdown":
      return (
        <div>
          <Label field={field} />
          <MarkdownField value={asL(value)} onChange={set} />
          <Help text={field.help} />
        </div>
      );
    case "select":
      return (
        <label className="block">
          <Label field={field} />
          <select value={String(value ?? field.options[0]?.value)} onChange={(e) => set(e.target.value)} className={inputCls}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help text={field.help} />
        </label>
      );
    case "link":
      return (
        <label className="block">
          <Label field={field} />
          <input value={String(value ?? "")} onChange={(e) => set(e.target.value)} list="cms-link-suggestions" placeholder="/contact hoặc https://…" className={`${inputCls} font-mono text-xs`} />
          <Help text={field.help ?? "Trang trong site viết dạng /contact (không cần /vi hay /en)."} />
        </label>
      );
    case "icon":
      return (
        <div>
          <Label field={field} />
          <IconField value={String(value ?? "")} onChange={set} />
        </div>
      );
    case "image":
    case "media":
      return (
        <div>
          <Label field={field} />
          <ImageField value={field.type === "image" ? (value as { src: string; alt?: L }) : { src: String(value ?? "") }} onChange={set} withAlt={field.type === "image"} />
          <Help text={field.help} />
        </div>
      );
    case "list":
      return (
        <div>
          <Label field={field}>
            <span className="text-[11px] text-ink-400">{Array.isArray(value) ? value.length : 0} mục</span>
          </Label>
          <ListField field={field} value={value as unknown[]} path={path} onChange={onChange} />
          <Help text={field.help} />
        </div>
      );
    case "group":
      return (
        <fieldset className="rounded-lg border border-mist-200 p-3">
          <legend className="px-1 text-xs font-medium text-ink-900">{field.label}</legend>
          <FieldForm fields={field.fields} value={value} path={path} onChange={onChange} />
          <Help text={field.help} />
        </fieldset>
      );
  }
}

/** Renders a form for `value` from field definitions; edits bubble up as (path, value). */
export function FieldForm({ fields, value, path = [], onChange }: { fields: FieldDef[]; value: unknown; path?: Path; onChange: OnChange }) {
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <Field key={f.key} field={f} value={getIn(value, [f.key])} path={[...path, f.key]} onChange={onChange} />
      ))}
    </div>
  );
}

/** Shared <datalist> for link inputs; render once in the admin shell. */
export function LinkSuggestions({ extra = [] }: { extra?: string[] }) {
  return (
    <datalist id="cms-link-suggestions">
      {[...new Set([...LINK_SUGGESTIONS, ...extra])].map((s) => (
        <option key={s} value={s} />
      ))}
    </datalist>
  );
}
