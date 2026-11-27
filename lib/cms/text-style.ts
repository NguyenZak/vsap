// Per-field text styling chosen in Studio and stored next to the text:
//   <key>Align: "left" | "center" | "right" | "justify" ("" = the section's own)
//   <key>Size:  whole px added to (or taken from) the design's size there, e.g. 2 or -1
import type { CSSProperties } from "react";

const CLASSES: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

/** Tailwind class for a stored alignment ("" when unset or unknown). */
export const alignClass = (v: unknown) => (typeof v === "string" ? (CLASSES[v] ?? "") : "");

export const SIZE_MIN = -12;
export const SIZE_MAX = 24;

/** A stored size offset as whole px within the allowed range (0 = design size). */
export function sizeOffset(v: unknown): number {
  if (typeof v !== "number" || !Number.isFinite(v)) return 0;
  return Math.max(SIZE_MIN, Math.min(SIZE_MAX, Math.round(v)));
}

/**
 * Inline style that moves an element's font size by the stored offset, relative to
 * the size it inherits (`base`, e.g. "1.1em" for an element that is already 1.1em).
 * Phones and desktops keep their own design sizes; both move by the same px.
 */
export function sizeStyle(v: unknown, base = "1em"): CSSProperties | undefined {
  const n = sizeOffset(v);
  return n ? { fontSize: `calc(${base} ${n > 0 ? "+" : "-"} ${Math.abs(n)}px)` } : undefined;
}
