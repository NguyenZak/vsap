// Shared building blocks for the section renderers in components/blocks.tsx.
import Link from "next/link";
import { ArrowUpRight, Handshake, Minus, Plus } from "lucide-react";
import type { CmsImage } from "@/lib/cms/types";
import { SIZES, srcSetFor } from "@/lib/responsive";
import { CmsIcon } from "./cms/Icon";
import { Tag, Title } from "./ui";

export type Tone = "white" | "muted" | "dark";

/** Background classes for a section tone. */
export const toneBg: Record<Tone, string> = {
  white: "bg-white",
  muted: "bg-mist-50",
  dark: "bg-forest-950 bg-dark-glow text-white",
};

/** Tag + two-style title on the left, short lead aligned to its baseline on the right. */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  lead,
  tone = "white",
  align = "split",
}: {
  eyebrow?: string;
  title?: string;
  accent?: string;
  lead?: string;
  tone?: Tone;
  align?: "split" | "left" | "center";
}) {
  if (!eyebrow && !title && !accent && !lead) return null;
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <div
      className={
        center
          ? "mx-auto flex max-w-2xl flex-col items-center gap-5 text-center"
          : align === "left"
            ? "flex max-w-3xl flex-col gap-5"
            : "flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12"
      }
    >
      <div data-reveal className="max-w-2xl">
        {eyebrow && <Tag tone={dark ? "glass" : "light"}>{eyebrow}</Tag>}
        {(title || accent) && (
          <Title title={title ?? ""} accent={accent} className={`mt-4 text-4xl sm:text-5xl ${dark ? "text-white" : "text-forest-900"}`} />
        )}
      </div>
      {lead && (
        <p data-reveal className={`max-w-sm text-sm leading-relaxed md:pb-1 ${dark ? "text-white/70" : "text-ink-600"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/** Image from the CMS (built-in /images path or uploaded /media file). */
export function CmsImg({
  image,
  className = "",
  priority = false,
  parallax = false,
  decorative = false,
  sizes = SIZES.full,
}: {
  image: { src: string; alt: string } | undefined;
  className?: string;
  priority?: boolean;
  parallax?: boolean;
  decorative?: boolean;
  /** `sizes` hint for srcset; see lib/responsive.ts. */
  sizes?: string;
}) {
  if (!image?.src) return <div className={`bg-mist-100 ${className}`} aria-hidden="true" />;
  return (
    <img
      src={image.src}
      srcSet={srcSetFor(image.src)}
      sizes={srcSetFor(image.src) ? sizes : undefined}
      alt={decorative ? "" : image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      data-parallax={parallax || undefined}
      className={`object-cover ${className}`}
    />
  );
}

export const resolveImage = (image: CmsImage | undefined, pick: (v: CmsImage["alt"]) => string) =>
  image ? { src: image.src, alt: pick(image.alt) } : undefined;

/** Splits plain text on blank lines into paragraphs. */
export function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => (
      <p key={i} className={className}>
        {p}
      </p>
    ));
}

/**
 * Accordion of rounded cards; the open one gets a yellow icon and a white inner panel.
 * Uses <details name> so only one stays open, with no JavaScript.
 */
export function AccordionCards({
  name,
  items,
  openFirst = true,
}: {
  name: string;
  items: { icon: string; title: string; body: string }[];
  openFirst?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <details key={i} name={name} open={openFirst && i === 0} data-reveal className="group rounded-2xl bg-mist-50 p-2 transition-colors hover:bg-mist-100">
          <summary className="flex cursor-pointer list-none items-center gap-3 p-1.5 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-ink-600 transition group-open:bg-sun-400 group-open:text-forest-950">
              <CmsIcon name={item.icon} className="size-[18px]" />
            </span>
            <h3 className="flex-1 text-base text-ink-900">{item.title}</h3>
            <Plus className="size-5 text-ink-600 group-open:hidden" />
            <Minus className="hidden size-5 text-ink-900 group-open:block" />
          </summary>
          <p className="mt-2 rounded-xl bg-white px-5 py-4 text-sm leading-relaxed whitespace-pre-line text-ink-600 sm:pl-[3.75rem]">{item.body}</p>
        </details>
      ))}
    </div>
  );
}

/** Row of grey number cards; leading numbers count up (MotionMain data-count). */
/** One logo colour per stat card: yellow, leaf green, chili red, deep green. */
const statColors = [
  "bg-sun-400/25 text-forest-950",
  "bg-leaf-500/20 text-forest-900",
  "bg-chili-600/10 text-chili-600",
  "bg-forest-900 text-white",
];

export function StatCards({ stats }: { stats: { value: string; label: string }[] }) {
  const cols = stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : "";
  return (
    <ul className={`grid grid-cols-2 gap-3 ${cols}`}>
      {stats.map((s, i) => (
        <li key={i} data-reveal className={`rounded-2xl px-4 py-7 text-center ${statColors[i % statColors.length]}`}>
          <p data-count className="text-4xl font-medium tracking-tight tabular-nums sm:text-5xl">
            {s.value}
          </p>
          <p className="mt-2 text-xs opacity-80 sm:text-sm">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}

export type ProductCardView = { href: string; name: string; latin: string; short: string; image?: { src: string; alt: string }; grades: string[]; cta: string };

export function ProductCard({ card }: { card: ProductCardView }) {
  return (
    <Link href={card.href} data-reveal className="group block rounded-3xl bg-mist-50 p-2">
      <div className="overflow-hidden rounded-2xl">
        <CmsImg image={card.image} sizes={SIZES.half} className="aspect-[4/3] w-full transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-5 sm:p-6">
        {card.latin && <p className="accent text-lg text-ink-600">{card.latin}</p>}
        <h3 className="heading mt-1 text-3xl text-forest-900">{card.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{card.short}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <ul className="flex flex-wrap gap-1.5">
            {card.grades.slice(0, 4).map((g) => (
              <li key={g} className="rounded-full border border-mist-200 bg-white px-3 py-1 text-xs text-ink-900">
                {g}
              </li>
            ))}
          </ul>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sun-400 px-4 py-2 text-sm font-medium text-forest-950">
            {card.cta}
            <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Column count follows the number of tiles so no row is left half empty.
const wallCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3 lg:grid-cols-6",
};

/** Logo wall: logos only, greyscale until hovered; names stand in for missing logos. */
export function LogoWall({ partners, join }: { partners: { name: string; logo: string; url: string }[]; join?: { label: string; href: string } }) {
  const tiles = partners.length + (join ? 1 : 0);
  if (tiles === 0) return null;
  return (
    <ul className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-mist-200 bg-mist-200 ${wallCols[Math.min(tiles, 6)]}`}>
      {partners.map((p, i) => {
        const mark = p.logo ? (
          <img
            src={p.logo}
            alt={p.name}
            loading="lazy"
            className="max-h-12 w-auto max-w-[70%] object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <span className="text-center text-xl font-semibold tracking-tight text-ink-400 uppercase transition group-hover:text-forest-900 sm:text-2xl">{p.name}</span>
        );
        return (
          <li key={i} data-reveal className="group flex h-32 items-center justify-center bg-white px-6 sm:h-36">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name} className="flex size-full items-center justify-center">
                {mark}
              </a>
            ) : (
              mark
            )}
          </li>
        );
      })}
      {join && (
        <li data-reveal className="flex h-32 items-center justify-center bg-mist-50 px-6 sm:h-36">
          <Link href={join.href} className="group inline-flex items-center gap-2 text-sm font-medium text-forest-900">
            <Handshake className="size-5 text-forest-600" />
            {join.label}
            <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
          </Link>
        </li>
      )}
    </ul>
  );
}
