"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import type { FieldDef } from "@/lib/cms/fields";
import { FieldForm } from "./fields";
import { Panel } from "./PageEditor";

type Path = (string | number)[];

/** List of items on the left, the selected item's form on the right. */
export function CollectionEditor<T extends object>({
  title,
  description,
  items,
  basePath,
  fields,
  selected,
  onSelect,
  label,
  sublabel,
  thumb,
  newItem,
  onItems,
  onChange,
  validate,
  header,
}: {
  title: string;
  description: string;
  items: T[];
  basePath: Path;
  fields: FieldDef[];
  selected: number;
  onSelect: (i: number) => void;
  label: (item: T) => string;
  sublabel?: (item: T) => string;
  thumb?: (item: T) => string | undefined;
  newItem: () => T;
  onItems: (items: T[]) => void;
  onChange: (path: Path, value: unknown) => void;
  validate?: (item: T, all: T[]) => string | null;
  /** Extra content above the selected item's form (e.g. SEO preview). */
  header?: (item: T) => React.ReactNode;
}) {
  const [drag, setDrag] = useState<number | null>(null);
  const current = items[selected];
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onItems(next);
    onSelect(to);
  };
  const problem = current && validate ? validate(current, items) : null;

  return (
    <>
      <aside className="flex w-72 shrink-0 flex-col border-r border-mist-200 bg-white">
        <div className="border-b border-mist-200 px-4 py-4">
          <h2 className="text-base font-medium text-ink-900">{title}</h2>
          <p className="mt-0.5 text-xs leading-snug text-ink-600">{description}</p>
        </div>
        <ol className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item, i) => (
            <li
              key={i}
              draggable
              onDragStart={() => setDrag(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drag !== null && move(drag, i)}
              onDragEnd={() => setDrag(null)}
              className={`group flex items-center gap-2 rounded-lg border p-1.5 transition ${
                i === selected ? "border-forest-600 bg-sun-400/15" : "border-transparent hover:border-mist-200"
              } ${drag === i ? "opacity-40" : ""}`}
            >
              <GripVertical className="size-4 shrink-0 cursor-grab text-ink-400" />
              {thumb && (
                <span className="size-9 shrink-0 overflow-hidden rounded-md bg-mist-100">
                  {thumb(item) && <img src={thumb(item)} alt="" className="size-full object-cover" />}
                </span>
              )}
              <button type="button" onClick={() => onSelect(i)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm text-ink-900">{label(item) || "(chưa đặt tên)"}</span>
                {sublabel && <span className="block truncate text-xs text-ink-400">{sublabel(item)}</span>}
              </button>
              <div className={`flex ${i === selected ? "" : "opacity-0 group-hover:opacity-100"}`}>
                <button type="button" title="Lên" onClick={() => move(i, i - 1)} disabled={i === 0} className="rounded p-1 text-ink-400 hover:bg-mist-100 disabled:opacity-30">
                  <ChevronUp className="size-3.5" />
                </button>
                <button type="button" title="Xuống" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} className="rounded p-1 text-ink-400 hover:bg-mist-100 disabled:opacity-30">
                  <ChevronDown className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && <li className="px-2 py-6 text-center text-sm text-ink-400">Chưa có mục nào.</li>}
        </ol>
        <div className="border-t border-mist-200 p-3">
          <button
            type="button"
            onClick={() => {
              onItems([...items, newItem()]);
              onSelect(items.length);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-900 py-2.5 text-sm font-medium text-white hover:bg-forest-800"
          >
            <Plus className="size-4" /> Thêm mới
          </button>
        </div>
      </aside>
      <section className="flex w-[30rem] shrink-0 flex-col border-r border-mist-200 bg-white">
        {current ? (
          <Panel
            title={label(current) || "(chưa đặt tên)"}
            subtitle={sublabel?.(current)}
            actions={
              <div className="flex gap-1">
                <button
                  type="button"
                  title="Nhân bản"
                  onClick={() => {
                    onItems([...items.slice(0, selected + 1), structuredClone(current), ...items.slice(selected + 1)]);
                    onSelect(selected + 1);
                  }}
                  className="rounded-lg p-1.5 text-ink-600 hover:bg-mist-100"
                >
                  <Copy className="size-4" />
                </button>
                <button
                  type="button"
                  title="Xoá"
                  onClick={() => {
                    if (!confirm(`Xoá “${label(current)}”? Có thể hoàn tác bằng Ctrl/Cmd + Z.`)) return;
                    onItems(items.filter((_, i) => i !== selected));
                    onSelect(Math.max(0, selected - 1));
                  }}
                  className="rounded-lg p-1.5 text-ink-600 hover:bg-red-50 hover:text-chili-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            }
          >
            {problem && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-chili-600">{problem}</p>}
            {header?.(current)}
            <FieldForm fields={fields} value={current} path={[...basePath, selected]} onChange={onChange} />
          </Panel>
        ) : (
          <Panel title="Chưa chọn mục nào">
            <p className="text-sm text-ink-600">Chọn một mục bên trái hoặc thêm mới.</p>
          </Panel>
        )}
      </section>
    </>
  );
}
