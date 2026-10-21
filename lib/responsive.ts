// srcset for built-in photos that have smaller copies (scripts/responsive-images.py).
// Uploaded /media files and other URLs are served as-is.
import manifest from "./responsive-manifest.json";

const sizesByPath = manifest as Record<string, { width: number; sizes: number[] }>;

export function srcSetFor(src: string | undefined): string | undefined {
  const entry = src ? sizesByPath[src] : undefined;
  if (!entry || entry.sizes.length === 0) return undefined;
  const stem = src!.replace(/^\/images\//, "").replace(/\.webp$/, "");
  return [...entry.sizes.map((w) => `/images/_w/${stem}-${w}.webp ${w}w`), `${src} ${entry.width}w`].join(", ");
}

/** Common `sizes` hints for the layouts used on the site. */
export const SIZES = {
  full: "100vw",
  half: "(min-width: 1024px) 50vw, 100vw",
  third: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  card: "(min-width: 1024px) 26rem, 80vw",
  thumb: "(min-width: 1024px) 20vw, 50vw",
} as const;
