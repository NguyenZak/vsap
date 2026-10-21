import Link from "next/link";
import { ArrowUpRight, Handshake, Minus, Plus, type LucideIcon } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { ImageKey } from "@/lib/images";
import type { Product } from "@/lib/products";
import { partners } from "@/lib/partners";
import { retailPacks, type RetailPack } from "@/lib/retail";
import { Photo } from "./Photo";
import { Button, Tag, Title } from "./ui";

export { Photo };

/** Tag + two-style title on the left, short lead aligned to its baseline on the right. */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  lead,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  lead?: string;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
      <div data-reveal className="max-w-2xl">
        {eyebrow && <Tag>{eyebrow}</Tag>}
        <Title title={title} accent={accent} className="mt-4 text-4xl text-forest-900 sm:text-5xl" />
      </div>
      {lead && (
        <p data-reveal className="max-w-sm text-sm leading-relaxed text-ink-600 md:pb-1">
          {lead}
        </p>
      )}
    </div>
  );
}

/** Photo banner at the top of inner pages; the fixed header floats over it. */
export function PageHero({
  eyebrow,
  title,
  accent,
  lead,
  image,
  locale,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lead: string;
  image: ImageKey;
  locale: Locale;
}) {
  return (
    <section className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-forest-900 lg:min-h-[40rem]">
      <Photo name={image} locale={locale} priority parallax className="absolute inset-0 -z-10 size-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/20 to-black/25" />
      <div className="container-page pb-14 pt-36 sm:pb-20">
        <div data-intro>
          <Tag tone="glass">{eyebrow}</Tag>
        </div>
        <div data-intro>
          <Title
            as="h1"
            title={title}
            accent={accent}
            className="mt-5 max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl"
          />
        </div>
        <p data-intro className="mt-5 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
          {lead}
        </p>
      </div>
    </section>
  );
}

/**
 * Accordion of rounded cards; the open one gets a lime icon and a white inner panel.
 * Uses <details name> so only one stays open, with no JavaScript.
 */
export function AccordionCards({
  name,
  items,
  icons,
  openFirst = true,
}: {
  name: string;
  items: { title: string; body: string }[];
  icons: LucideIcon[];
  openFirst?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const Icon = icons[i % icons.length];
        return (
          <details
            key={item.title}
            name={name}
            open={openFirst && i === 0}
            data-reveal
            className="group rounded-2xl bg-mist-50 p-2 transition-colors hover:bg-mist-100"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 p-1.5 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-ink-600 transition group-open:bg-lime-300 group-open:text-forest-950">
                <Icon className="size-[18px]" />
              </span>
              <h3 className="flex-1 text-base text-ink-900">{item.title}</h3>
              <Plus className="size-5 text-ink-600 group-open:hidden" />
              <Minus className="hidden size-5 text-ink-900 group-open:block" />
            </summary>
            <p className="mt-2 rounded-xl bg-white px-5 py-4 text-sm leading-relaxed text-ink-600 sm:pl-[3.75rem]">
              {item.body}
            </p>
          </details>
        );
      })}
    </div>
  );
}

/** Row of grey number cards under the process block. */
export function StatCards({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <li key={s.label} data-reveal className="rounded-2xl bg-mist-50 px-4 py-7 text-center">
          <p data-count className="text-4xl font-medium tracking-tight text-ink-900 tabular-nums sm:text-5xl">
            {s.value}
          </p>
          <p className="mt-2 text-xs text-ink-600 sm:text-sm">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}

/** Horizontally scrolling cards of the real VSAP retail packs, bleeding off the right edge. */
export function ProductLines({ locale, t }: { locale: Locale; t: Dictionary["home"]["retail"] }) {
  return (
    <ul className="no-scrollbar page-inset-left flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-[var(--page-gutter)]">
      {retailPacks.map((p) => (
        <li key={p.id} data-reveal className="w-[78%] shrink-0 snap-start sm:w-80 lg:w-[22rem] 2xl:w-[26rem]">
          <RetailCard pack={p} locale={locale} t={t} />
        </li>
      ))}
    </ul>
  );
}

/** Packshot card: front of pack, swapping to the next shot on hover. */
export function RetailCard({ pack, locale, t }: { pack: RetailPack; locale: Locale; t: Dictionary["home"]["retail"] }) {
  const [front, alt] = pack.images;
  return (
    <Link href={`/${locale}/products/${pack.slug}#packs`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white">
        <img
          src={front}
          alt={`${pack.name[locale]} – ${pack.flavor[locale]}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-contain transition duration-700 group-hover:scale-105 group-hover:opacity-0"
        />
        {alt && (
          <img
            src={alt}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full scale-95 object-contain opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        <ul className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {pack.weights.map((w) => (
            <li key={w} className="rounded-full bg-forest-900 px-2.5 py-1 text-xs font-medium text-white">
              {w}
            </li>
          ))}
        </ul>
      </div>
      <h3 className="mt-4 flex items-center justify-between gap-3 text-base font-medium text-ink-900">
        {pack.name[locale]}
        <ArrowUpRight className="size-4 shrink-0 text-ink-400 transition group-hover:rotate-45 group-hover:text-forest-600" />
      </h3>
      <p className="mt-1 text-sm text-ink-600">
        {pack.flavor[locale]} · {pack.pack[locale]}
      </p>
      <span className="sr-only">{t.view}</span>
    </Link>
  );
}

export function ProductCard({ product, locale, cta }: { product: Product; locale: Locale; cta: string }) {
  return (
    <Link href={`/${locale}/products/${product.slug}`} data-reveal className="group block rounded-3xl bg-mist-50 p-2">
      <div className="overflow-hidden rounded-2xl">
        <Photo name={product.image} locale={locale} className="aspect-[4/3] w-full transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-5 sm:p-6">
        <p className="accent text-lg text-ink-600">{product.latin}</p>
        <h3 className="heading mt-1 text-3xl text-forest-900">{product.name[locale]}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{product.short[locale]}</p>
        <div className="mt-5 flex items-end justify-between gap-4">
          <ul className="flex flex-wrap gap-1.5">
            {product.grades.slice(0, 4).map((g) => (
              <li key={g.code} className="rounded-full border border-mist-200 bg-white px-3 py-1 text-xs text-ink-900">
                {g.code}
              </li>
            ))}
          </ul>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-lime-300 px-4 py-2 text-sm font-medium text-forest-950">
            {cta}
            <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CtaBanner({ locale, cta }: { locale: Locale; cta: Dictionary["home"]["cta"] }) {
  return (
    <section className="container-page py-16 sm:py-24">
      <div data-reveal="clip" className="relative isolate overflow-hidden rounded-3xl px-6 py-14 sm:px-12 sm:py-20">
        <Photo name="cashewGrove" locale={locale} decorative parallax className="absolute inset-0 -z-10 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
        <div data-reveal className="max-w-xl">
          <Title title={cta.title} accent={cta.accent} className="text-4xl text-white sm:text-5xl" />
          <p className="mt-5 text-sm leading-relaxed text-white/85 sm:text-base">{cta.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/${locale}/contact`}>{cta.button}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Column count follows the number of tiles (partners + the "become a partner" tile) so no row is left half empty.
const wallCols: Record<number, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3 lg:grid-cols-6",
};

/** Logo wall of partners from lib/partners: logos only, greyscale until hovered. */
export function PartnerGrid({ locale, t }: { locale: Locale; t: Dictionary["home"]["partners"] }) {
  return (
    <div>
      <ul className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-mist-200 bg-mist-200 ${wallCols[Math.min(partners.length + 1, 6)]}`}>
        {partners.map((p) => {
          const mark = p.logo ? (
            <img
              src={p.logo}
              alt={p.name}
              loading="lazy"
              className="max-h-12 w-auto max-w-[70%] object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            />
          ) : (
            <span className="text-xl font-semibold tracking-tight text-ink-400 uppercase transition group-hover:text-forest-900 sm:text-2xl">
              {p.name}
            </span>
          );
          return (
            <li key={p.name} data-reveal className="group flex h-32 items-center justify-center bg-white px-6 sm:h-36">
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
        <li data-reveal className="flex h-32 items-center justify-center bg-mist-50 px-6 sm:h-36">
          <Link href={`/${locale}/contact`} className="group inline-flex items-center gap-2 text-sm font-medium text-forest-900">
            <Handshake className="size-5 text-forest-600" />
            {t.join.cta}
            <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
