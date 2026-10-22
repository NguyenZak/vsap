// Field definitions: the admin builds every edit form from these, so a section or
// collection only has to declare its fields once.

type Base = { key: string; label: string; help?: string };

export type FieldDef =
  /** One line in both languages. */
  | (Base & { type: "text" })
  /** Several lines in both languages. */
  | (Base & { type: "textarea"; rows?: number })
  /** Language-neutral single line (codes, numbers shown as text, names). */
  | (Base & { type: "string"; placeholder?: string })
  | (Base & { type: "number"; min?: number; max?: number; step?: number })
  | (Base & { type: "boolean" })
  /** Calendar date stored as YYYY-MM-DD. */
  | (Base & { type: "date" })
  /** Long bilingual text with a Markdown toolbar (news post bodies). */
  | (Base & { type: "markdown" })
  | (Base & { type: "select"; options: { value: string; label: string }[] })
  /** { src, alt } picked from the media library. */
  | (Base & { type: "image" })
  /** Bare image path (logos, packshots) picked from the media library. */
  | (Base & { type: "media" })
  /** Icon name from lib/cms/icons. */
  | (Base & { type: "icon" })
  /** URL or site path; the admin suggests the site's pages. */
  | (Base & { type: "link" })
  | (Base & { type: "list"; itemLabel: string; titleKey?: string; fields: FieldDef[]; newItem: () => Record<string, unknown> })
  /** Nested object rendered as an indented group. */
  | (Base & { type: "group"; fields: FieldDef[] });

export const l = (vi: string, en = vi, zh = "") => ({ vi, en, zh });

export const img = (src: string, vi = "", en = vi) => ({ src, alt: l(vi, en) });

/** Eyebrow + two-style title + lead, the heading used by most sections. */
export function headingFields(): FieldDef[] {
  return [
    { key: "eyebrow", label: "Nhãn nhỏ", type: "text" },
    { key: "title", label: "Tiêu đề", type: "text" },
    { key: "accent", label: "Tiêu đề (dòng nghiêng)", type: "text", help: "Dòng chữ serif nghiêng dưới tiêu đề." },
    { key: "lead", label: "Mô tả ngắn", type: "textarea", rows: 3 },
  ];
}

export const toneField: FieldDef = {
  key: "tone",
  label: "Nền",
  type: "select",
  options: [
    { value: "white", label: "Trắng" },
    { value: "muted", label: "Xám nhạt" },
    { value: "dark", label: "Xanh đậm" },
  ],
};

/** Field-path helpers shared by the form engine. */
export function getIn(obj: unknown, path: (string | number)[]): unknown {
  return path.reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string | number, unknown>)[k]), obj);
}

export function setIn<T>(obj: T, path: (string | number)[], value: unknown): T {
  if (path.length === 0) return value as T;
  const [k, ...rest] = path;
  const base = (Array.isArray(obj) ? [...obj] : { ...(obj as object) }) as Record<string | number, unknown>;
  base[k] = setIn(base[k], rest, value);
  return base as T;
}
