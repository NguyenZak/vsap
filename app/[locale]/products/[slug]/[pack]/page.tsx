import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BadgeCheck, Boxes, ChevronRight, Headset, PackageOpen, RotateCcw, Wallet } from "lucide-react";
import { BuyBox } from "@/components/shop/BuyBox";
import { Gallery } from "@/components/shop/Gallery";
import { MoreText } from "@/components/shop/MoreText";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { RecentlyViewed } from "@/components/shop/RecentlyViewed";
import { ShareBar } from "@/components/shop/ShareBar";
import { pick } from "@/lib/cms/links";
import { getContent } from "@/lib/cms/store";
import { metadataLocale, resolveLocale } from "@/lib/i18n";
import { breadcrumbJsonLd, jsonLdHtml, seoMetadata } from "@/lib/seo";
import { legacyPackIds } from "@/lib/retail";
import { packHref, toShopItem, visiblePacks } from "@/lib/shop";

type Props = { params: Promise<{ locale: string; slug: string; pack: string }> };

// Packs come from the CMS, so any pack added there gets a page.
export const dynamicParams = true;

async function load(params: Props["params"]) {
  const { locale: raw, slug, pack: id } = await params;
  const content = await getContent();
  const pack = visiblePacks(content.retailPacks).find((p) => p.id === id && p.product === slug);
  const product = content.products.find((p) => p.slug === slug);
  return { raw, content, pack, product };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { raw, content, pack } = await load(params);
  const locale = metadataLocale(raw);
  if (!pack) return {};
  const name = [pick(pack.name, locale), pick(pack.flavor, locale)].filter(Boolean).join(" – ");
  return seoMetadata({
    content,
    locale,
    path: `/products/${pack.product}/${pack.id}`,
    title: name,
    description: pick(pack.description, locale).split(/\n\s*\n/)[0] || name,
    image: pack.images[0]?.src,
    imageAlt: name,
  });
}

export default async function PackPage({ params }: Props) {
  const { raw, content, pack, product } = await load(params);
  const locale = resolveLocale(raw);
  if (!pack) {
    const { slug, pack: id } = await params;
    if (legacyPackIds[id]) permanentRedirect(`/${locale}/products/${slug}/${legacyPackIds[id]}`);
    notFound();
  }
  const ui = content.ui[locale];
  const t = ui.shop;
  const r = ui.retail;
  const tr = (v: Parameters<typeof pick>[0]) => pick(v, locale);
  const item = toShopItem(pack, locale);
  const site = content.settings;
  const productName = product ? tr(product.name) : "";

  // Same product line first, then the rest of the range.
  const shown = visiblePacks(content.retailPacks);
  const related = [...shown.filter((p) => p.product === pack.product), ...shown.filter((p) => p.product !== pack.product)]
    .filter((p) => p.id !== pack.id)
    .slice(0, 4)
    .map((p) => toShopItem(p, locale));

  const n = pack.nutrition;
  const nutrition = [
    [r.energy, n.energy],
    [r.fat, n.fat],
    [r.carbs, n.carbs],
    [r.protein, n.protein],
  ].filter(([, value]) => value);
  const facts = [
    [r.ingredients, tr(pack.ingredients)],
    [r.shelfLife, tr(pack.shelfLife)],
    [r.serving, tr(pack.serving)],
    [r.storage, tr(pack.storage)],
    [r.packedBy, [pack.packer, tr(pack.packerAddress)].filter(Boolean).join(" · ")],
  ].filter(([, value]) => value);
  const description = tr(pack.description).trim();
  const perks = [
    [Wallet, t.perk1],
    [BadgeCheck, t.perk2],
    [Headset, t.perk3],
    [Boxes, t.perk4],
    [PackageOpen, t.perk5],
    [RotateCcw, t.perk6],
  ] as const;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: [item.name, item.flavor].filter(Boolean).join(" – "),
    description: description || tr(pack.ingredients),
    image: item.images.map((src) => new URL(src, site.url).toString()),
    brand: { "@type": "Brand", name: site.name },
    sku: pack.id,
    url: `${site.url}${packHref(pack, locale)}`,
    ...(item.price !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "VND",
            price: item.price,
            availability: pack.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            seller: { "@id": `${site.url}/#organization` },
          },
        }
      : {}),
  };
  const trail = [
    { name: ui.nav.products, path: "/products" },
    ...(product ? [{ name: productName, path: `/products/${product.slug}` }] : []),
    { name: item.name, path: `/products/${pack.product}/${pack.id}` },
  ];

  return (
    <>
      {/* Dark band under the floating header, carrying the breadcrumb. */}
      <div className="bg-forest-950 pt-24 pb-5 lg:pt-28">
        <nav aria-label="Breadcrumb" className="container-page">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
            {[{ name: ui.nav.home, path: "" }, ...trail].map((c, i, all) => (
              <li key={c.path} className="inline-flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 text-white/30" />}
                {i === all.length - 1 ? (
                  <span aria-current="page" className="text-white">
                    {c.name}
                  </span>
                ) : (
                  <Link href={`/${locale}${c.path}`} className="hover:text-sun-400">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Kamina-style layout: white cards on the cream page, gallery left, buy box and description right. */}
      <div className="bg-mist-50">
        <section className="container-page grid gap-5 py-6 sm:py-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-5 rounded-2xl bg-surface p-3 sm:p-4 lg:sticky lg:top-24 lg:col-span-6">
            <Gallery images={item.images} alt={[item.name, item.flavor].filter(Boolean).join(" – ")} />
            <ShareBar title={item.name} />
          </div>

          <div className="space-y-5 lg:col-span-6">
            <div className="rounded-2xl bg-surface p-5 sm:p-6">
              <h1 className="heading text-2xl text-heading sm:text-3xl">{item.name}</h1>
              {item.flavor && <p className="mt-1 text-sm text-ink-600">{item.flavor}</p>}
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-600">
                <span>
                  {t.status}: <span className={`font-medium ${pack.soldOut ? "text-chili-600" : "text-forest-600"}`}>{pack.soldOut ? t.soldOut : t.inStock}</span>
                </span>
                <span className="h-3.5 w-px bg-mist-200" />
                <span>
                  {t.brand}: <span className="font-medium text-forest-600">{site.name}</span>
                </span>
              </p>
              {item.highlight && (
                <p className="mt-3 inline-flex w-fit rounded-full bg-sun-400 px-3 py-1 text-xs font-medium text-forest-950">{item.highlight}</p>
              )}

              <div className="mt-5">
                <BuyBox item={item} />
              </div>

              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-mist-200 pt-5 sm:grid-cols-3">
                {perks.map(([Icon, text]) =>
                  text ? (
                    <li key={text} className="flex items-center gap-2.5 text-xs leading-snug text-ink-600 sm:text-sm">
                      <Icon className="size-5 shrink-0 text-forest-600" strokeWidth={1.6} />
                      {text}
                    </li>
                  ) : null,
                )}
              </ul>
            </div>

            <div className="rounded-2xl bg-surface p-5 sm:p-6">
              <h2 className="inline-block border-b-2 border-forest-600 pb-2 text-sm font-semibold tracking-wider text-heading uppercase">{t.description}</h2>
              <div className="-mt-px border-t border-mist-200 pt-5">
                <MoreText more={t.showMore} less={t.showLess}>
                  <div className="space-y-4 text-sm leading-relaxed text-ink-600 sm:text-base">
                    {description ? (
                      description.split(/\n\s*\n/).map((para, i) => (
                        <p key={i} className="whitespace-pre-line">
                          {para}
                        </p>
                      ))
                    ) : (
                      <p>{[item.name, item.flavor].filter(Boolean).join(" · ")}</p>
                    )}
                    {facts.length > 0 && (
                      <dl className="divide-y divide-mist-200 border-y border-mist-200 text-sm">
                        {facts.map(([label, value]) => (
                          <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-2.5">
                            <dt className="text-ink-400">{label}</dt>
                            <dd className="text-ink-900">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {nutrition.length > 0 && (
                      <div>
                        <p className="text-xs font-medium tracking-wider text-ink-400 uppercase">{r.nutrition}</p>
                        <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {nutrition.map(([label, value]) => (
                            <div key={label} className="flex flex-col-reverse rounded-xl bg-mist-50 px-3 py-2.5 text-center">
                              <dt className="text-xs text-ink-600">{label}</dt>
                              <dd className="text-base font-medium tracking-tight text-ink-900">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                  </div>
                </MoreText>
              </div>
            </div>
          </div>
        </section>

      {related.length > 0 && (
        <section className="py-10 sm:py-14">
          <div className="container-page">
            <h2 className="heading text-3xl text-heading">{t.related}</h2>
            <div className="mt-8">
              <ProductGrid items={related} />
            </div>
          </div>
        </section>
      )}

      <RecentlyViewed key={pack.id} current={pack.id} />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(productJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(breadcrumbJsonLd(content, locale, trail))} />
    </>
  );
}
