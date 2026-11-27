// Paragraph alignment chosen with the rich text toolbar's align buttons, stored
// next to the text as `<key>Align` ("" = the section's own alignment).
const CLASSES: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

/** Tailwind class for a stored alignment ("" when unset or unknown). */
export const alignClass = (v: unknown) => (typeof v === "string" ? (CLASSES[v] ?? "") : "");
