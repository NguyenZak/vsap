import type { Locale } from "@/lib/i18n";
import { images, type ImageKey } from "@/lib/images";

/** Site photo from lib/images, with the alt text in the page language. */
export function Photo({
  name,
  locale,
  className = "",
  priority = false,
  decorative = false,
  parallax = false,
}: {
  name: ImageKey;
  locale: Locale;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
  /** Drift against the scroll (see MotionMain); the parent must clip overflow. */
  parallax?: boolean;
}) {
  const img = images[name];
  return (
    <img
      src={img.src}
      alt={decorative ? "" : img.alt[locale]}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      data-parallax={parallax || undefined}
      className={`object-cover ${className}`}
    />
  );
}
