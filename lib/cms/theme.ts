// Theme helpers shared by the site and Studio (pure, unit-testable): the fonts an
// editor can pick, and how page / section / menu styles become CSS variables.
import type { CSSProperties } from "react";
import type { CustomFont, MenuStyle, PageStyle, SectionStyle, TextEffect, TextEffects } from "./types";

type Font = { key: string; label: string; stack: string; /** Google Fonts family; absent = already loaded by the layout. */ google?: string; serif?: boolean };

/** Every font has Vietnamese glyphs. */
export const fonts: Font[] = [
  { key: "inter", label: "Inter (chữ thường mặc định)", stack: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" },
  { key: "phudu", label: "Phudu (tiêu đề mặc định)", stack: "var(--font-phudu), var(--font-inter), ui-sans-serif, sans-serif" },
  { key: "be-vietnam-pro", label: "Be Vietnam Pro", stack: '"Be Vietnam Pro", ui-sans-serif, sans-serif', google: "Be Vietnam Pro" },
  { key: "montserrat", label: "Montserrat", stack: "Montserrat, ui-sans-serif, sans-serif", google: "Montserrat" },
  { key: "roboto", label: "Roboto", stack: "Roboto, ui-sans-serif, sans-serif", google: "Roboto" },
  { key: "open-sans", label: "Open Sans", stack: '"Open Sans", ui-sans-serif, sans-serif', google: "Open Sans" },
  { key: "nunito", label: "Nunito", stack: "Nunito, ui-sans-serif, sans-serif", google: "Nunito" },
  { key: "quicksand", label: "Quicksand", stack: "Quicksand, ui-sans-serif, sans-serif", google: "Quicksand" },
  { key: "lora", label: "Lora (có chân)", stack: "Lora, ui-serif, Georgia, serif", google: "Lora", serif: true },
  { key: "playfair-display", label: "Playfair Display (có chân)", stack: '"Playfair Display", ui-serif, Georgia, serif', google: "Playfair Display", serif: true },
  { key: "noto-serif", label: "Noto Serif (có chân)", stack: '"Noto Serif", ui-serif, Georgia, serif', google: "Noto Serif", serif: true },
  { key: "merriweather", label: "Merriweather (có chân)", stack: "Merriweather, ui-serif, Georgia, serif", google: "Merriweather", serif: true },
];

export const fontOptions = [{ value: "", label: "Mặc định" }, ...fonts.map((f) => ({ value: f.key, label: f.label }))];

// ---- Fonts added in Studio --------------------------------------------------

const CUSTOM = "custom:";

/** A font-family name safe to put inside CSS quotes and a style attribute. */
export const familyName = (name: string) => name.replace(/[^\p{L}\p{N} _-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 60);

/** "Be Vietnam Pro" from https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400 (else ""). */
export function familyFromLink(link: string): string {
  try {
    const u = new URL(link);
    if (u.hostname !== "fonts.googleapis.com") return "";
    return familyName((u.searchParams.get("family") ?? "").split(":")[0]);
  } catch {
    return "";
  }
}

export const customFontName = (f: Pick<CustomFont, "name" | "link">) => familyName(f.name) || familyFromLink(f.link);

/** The value stored in a font field for a Studio font. */
export const customFontKey = (f: Pick<CustomFont, "name" | "link">) => `${CUSTOM}${customFontName(f)}`;

const FONT_FILE = /\.(woff2|woff|ttf|otf)(\?[^\s"'()\\]*)?$/i;
const FORMAT: Record<string, string> = { woff2: "woff2", woff: "woff", ttf: "truetype", otf: "opentype" };

/** Uploaded fonts (/media/…) or https font files; nothing that could break out of url("…"). */
function fontFileUrl(src: string): string | null {
  const s = src.trim();
  if (!FONT_FILE.test(s) || /["'()\\\s<>]/.test(s)) return null;
  if (/^\/media\/[\w./-]+$/.test(s.split("?")[0])) return s;
  return /^https:\/\/[^/]+\//.test(s) ? s : null;
}

/** A pasted link usable as <link rel="stylesheet">: https, and not a font file itself. */
export function stylesheetUrl(link: string): string | null {
  const s = link.trim();
  if (!s || FONT_FILE.test(s) || /["'<>\s]/.test(s)) return null;
  try {
    return new URL(s).protocol === "https:" ? s : null;
  } catch {
    return null;
  }
}

/** @font-face rules for uploaded font files and pasted font-file links. */
export function fontFaceCss(custom: CustomFont[]): string {
  return custom
    .flatMap((f) => {
      const family = customFontName(f);
      if (!family) return [];
      const files = [...f.files, ...(f.link && !stylesheetUrl(f.link) ? [{ src: f.link, weight: "400", style: "normal" as const }] : [])];
      return files.flatMap((file) => {
        const url = fontFileUrl(file.src ?? "");
        if (!url) return [];
        const ext = url.split("?")[0].split(".").pop()!.toLowerCase();
        const weight = /^[1-9]00$/.test(file.weight) ? file.weight : "400";
        const style = file.style === "italic" ? "italic" : "normal";
        return [`@font-face{font-family:"${family}";src:url("${url}") format("${FORMAT[ext]}");font-weight:${weight};font-style:${style};font-display:swap}`];
      });
    })
    .join("\n");
}

/** Media types accepted for font uploads, by file extension (browsers often send none). */
export const FONT_FILE_TYPES: Record<string, string> = { woff2: "font/woff2", woff: "font/woff", ttf: "font/ttf", otf: "font/otf" };
export const fontFileType = (fileName: string) => FONT_FILE_TYPES[fileName.split(".").pop()?.toLowerCase() ?? ""] ?? null;

/** Font field choices: the built-in fonts, then the ones added in Studio. */
export const fontChoices = (custom: CustomFont[]) => [
  ...fonts.map((f) => ({ value: f.key, label: f.label })),
  ...custom.filter((f) => customFontName(f)).map((f) => ({ value: customFontKey(f), label: `${customFontName(f)} (tự thêm)` })),
];

function fontStack(key: string) {
  if (key.startsWith(CUSTOM)) {
    const family = familyName(key.slice(CUSTOM.length));
    return family ? `"${family}", ui-sans-serif, system-ui, sans-serif` : undefined;
  }
  return fonts.find((f) => f.key === key)?.stack;
}

/** One Google Fonts stylesheet for the fonts the content actually uses (null when none is needed). */
export function googleFontsHref(keys: Iterable<string>): string | null {
  const families = [...new Set([...keys].map((k) => fonts.find((f) => f.key === k)?.google).filter((g): g is string => Boolean(g)))].sort();
  if (!families.length) return null;
  const query = families.map((g) => `family=${g.replace(/ /g, "+")}:wght@400;500;600;700`).join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

const emptyEffect = (): TextEffect => ({ stroke: "", strokeWidth: 0, shadow: "", shadowBlur: 0, shadowOffset: 0, shadowOpacity: 0 });

/** "#1a2b3c" at 60% → "rgba(26, 43, 60, 0.6)". */
function rgba(hex: string, pct: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${+(pct / 100).toFixed(2)})`;
}
export const emptyEffects = (): TextEffects => ({ heading: emptyEffect(), text: emptyEffect() });
export const emptyPageStyle = (): PageStyle => ({ background: "", text: "", heading: "", font: "", headingFont: "", textScale: 0, headingScale: 0, effects: emptyEffects() });

type EffectsLayer = Partial<{ heading: Partial<TextEffect>; text: Partial<TextEffect> }> | undefined;

/** Text effects field by field: each later (more specific) layer wins where it sets something. */
export function mergeEffects(...layers: EffectsLayer[]): TextEffects {
  const out = emptyEffects();
  for (const layer of layers)
    for (const kind of ["heading", "text"] as const)
      for (const [k, v] of Object.entries(layer?.[kind] ?? {}) as [keyof TextEffect, unknown][]) {
        if (!(k in out[kind]) || !v) continue;
        if (typeof v === typeof out[kind][k]) (out[kind] as Record<string, unknown>)[k] = v;
      }
  return out;
}
export const emptyMenuStyle = (): MenuStyle => ({ font: "", size: 0, weight: "", uppercase: false, color: "", colorSolid: "" });

const HEX = /^#[0-9a-f]{6}$/i;
/** A colour value is used only when it is a full #rrggbb (it ends up in a style attribute). */
export const color = (v: unknown) => (typeof v === "string" && HEX.test(v.trim()) ? v.trim() : "");
const scale = (v: unknown) => (typeof v === "number" && v >= 50 && v <= 200 ? v : 0);

/** Theme → page: each empty page value falls back to the theme's. */
export function mergePageStyle(theme: Partial<PageStyle> | undefined, page: Partial<PageStyle> | undefined): PageStyle {
  const out = emptyPageStyle();
  for (const k of Object.keys(out) as (keyof PageStyle)[]) {
    if (k === "effects") continue;
    const own = page?.[k];
    (out as Record<string, unknown>)[k] = own ? own : (theme?.[k] ?? out[k]);
  }
  out.effects = mergeEffects(theme?.effects, page?.effects);
  return out;
}

// Tailwind's text-* sizes (rem); the scales multiply these.
const TEXT_SIZES: Record<string, number> = { xs: 0.75, sm: 0.875, base: 1, lg: 1.125, xl: 1.25 };
const HEADING_SIZES: Record<string, number> = { "2xl": 1.5, "3xl": 1.875, "4xl": 2.25, "5xl": 3, "6xl": 3.75, "7xl": 4.5, "8xl": 6, "9xl": 8 };

function sizeVars(sizes: Record<string, number>, pct: number) {
  return Object.fromEntries(Object.entries(sizes).map(([k, rem]) => [`--text-${k}`, `${+(rem * pct / 100).toFixed(4)}rem`]));
}

/**
 * Fonts and sizes of a page wrapper. Colours are left to sectionStyleVars, because
 * whether a page colour applies depends on each section's background.
 */
export function pageStyleVars(s: PageStyle): CSSProperties {
  const vars: Record<string, string> = {};
  const body = fontStack(s.font);
  const heading = fontStack(s.headingFont);
  if (body) vars.fontFamily = body;
  if (heading) vars["--font-display"] = heading;
  if (color(s.background)) vars["--page-bg"] = color(s.background);
  if (scale(s.textScale)) Object.assign(vars, sizeVars(TEXT_SIZES, s.textScale));
  if (scale(s.headingScale)) Object.assign(vars, sizeVars(HEADING_SIZES, s.headingScale));
  return vars as CSSProperties;
}

/**
 * Colours and frame of one section. The page/theme text colours apply only to
 * sections with a light background, so dark sections keep their white text unless
 * the section sets its own colours.
 */
export function sectionStyleVars(style: Partial<SectionStyle> | undefined, page: PageStyle, tone: "white" | "muted" | "dark" | "none") {
  const s = style ?? {};
  const bg = color(s.background);
  const light = !bg && tone !== "dark";
  const text = color(s.text) || (light ? color(page.text) : "");
  const heading = color(s.heading) || (light ? color(page.heading) : "");
  const vars: Record<string, string> = {};
  const attrs: Record<string, string> = {};
  if (bg) {
    vars.backgroundColor = bg;
    // Dark mode keeps such a section in its light palette (globals.css).
    attrs["data-cms-bg"] = "";
  }
  if (text) {
    vars["--cms-text"] = text;
    attrs["data-cms-text"] = "";
  }
  if (heading) {
    vars["--cms-heading"] = heading;
    attrs["data-cms-heading"] = "";
  }
  // Outline and shadow: page/theme effects merged with the section's own, field by field.
  const fx = mergeEffects(page.effects, s.effects);
  for (const [kind, p] of [["heading", "h"], ["text", "t"]] as const) {
    const e = fx[kind];
    const stroke = color(e.stroke);
    if (stroke) {
      vars[`--fx-${p}-stroke`] = `${clamp(e.strokeWidth || 1, 0.5, 6)}px ${stroke}`;
      attrs[`data-fx-${p}-stroke`] = "";
    }
    const hex = color(e.shadow);
    if (hex) {
      const shadow = rgba(hex, clamp(e.shadowOpacity || 60, 5, 100));
      const blur = clamp(e.shadowBlur || 6, 0, 40);
      const offset = clamp(e.shadowOffset || 2, -20, 20);
      vars[`--fx-${p}-shadow`] = `0 ${offset}px ${blur}px ${shadow}`;
      // Gradient title accents have transparent text: a text-shadow would cover the gradient.
      vars[`--fx-${p}-drop`] = `drop-shadow(0 ${offset}px ${blur / 2}px ${shadow})`;
      attrs[`data-fx-${p}-shadow`] = "";
    }
  }

  const frame = s.frame === "lines" || s.frame === "box" ? s.frame : "none";
  if (frame !== "none") {
    attrs["data-frame"] = frame;
    vars["--frame-color"] = color(s.border) || "var(--color-mist-200)";
    vars["--frame-width"] = `${Math.min(Math.max(Number(s.borderWidth) || 1, 1), 12)}px`;
    vars["--frame-radius"] = `${Math.min(Math.max(Number(s.radius) || 0, 0), 64)}px`;
  }
  return { style: vars as CSSProperties, attrs };
}

/** Dark mode "system": follow the visitor's device setting, live. Inline in <head>, so nothing flashes. */
export const systemDarkScript = `(function(){var m=matchMedia("(prefers-color-scheme: dark)");function a(){document.documentElement.classList.toggle("dark",m.matches)}a();m.addEventListener("change",a)})()`;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(Number(n) || 0, min), max);

/** CSS variables read by the header's links (components/Header.tsx + globals.css). */
export function menuStyleVars(m: MenuStyle): CSSProperties {
  const vars: Record<string, string> = {};
  const font = fontStack(m.font);
  if (font) vars["--menu-font"] = font;
  if (m.size >= 10 && m.size <= 24) vars["--menu-size"] = `${m.size}px`;
  if (m.weight) vars["--menu-weight"] = m.weight;
  if (m.uppercase) vars["--menu-case"] = "uppercase";
  if (color(m.color)) vars["--menu-color"] = color(m.color);
  if (color(m.colorSolid)) vars["--menu-color-solid"] = color(m.colorSolid);
  return vars as CSSProperties;
}

/** Font keys the content uses, for googleFontsHref. */
export function usedFonts(styles: (Partial<PageStyle> | Partial<MenuStyle> | undefined)[]): string[] {
  return styles.flatMap((s) => [(s as PageStyle | undefined)?.font, (s as PageStyle | undefined)?.headingFont].filter((k): k is string => Boolean(k)));
}
