import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { RetailPackDetail } from "@/components/RetailPackDetail";
import { CmsImg, SectionHeading } from "@/components/sections";
import { Button, Title } from "@/components/ui";
import { pick } from "@/lib/cms/links";
import { getContent } from "@/lib/cms/store";
import { metadataLocale, resolveLocale } from "@/lib/i18n";
import { breadcrumbJsonLd, jsonLdHtml, seoMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Products come from the CMS, so any slug added there gets a page.
export const dynamicParams = true;

async function load(params: Props["params"]) {
  const { locale: raw, slug } = await params;
  const content = await getContent();
  const product = content.products.find((p) => p.slug === slug);
  return { raw, content, product };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { raw, content, product } = await load(params);
  const locale = metadataLocale(raw);
  if (!product) return {};
  return seoMetadata({
    content,
    locale,
    path: `/products/${product.slug}`,
    title: pick(product.seo?.title, locale) || pick(product.name, locale),
    description: pick(product.seo?.description, locale) || pick(product.short, locale),
    image: product.image?.src,
    imageAlt: pick(product.image?.alt, locale),
  });
}

export default async function ProductPage({ params }: Props) {
  const { raw, content, product } = await load(params);
  const locale = resolveLocale(raw);
  if (!product) notFound();
  const ui = content.ui[locale];
  const t = ui.productDetail;
  const tr = (v: Parameters<typeof pick>[0]) => pick(v, locale);
  const site = content.settings;
  const packs = content.retailPacks.filter((p) => p.product === product.slug);
  const gallery = product.gallery.filter((g) => g.src);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tr(product.name),
    description: tr(product.description),
    image: [product.image?.src, ...gallery.map((g) => g.src), ...packs.flatMap((p) => (p.images[0]?.src ? [p.images[0].src] : []))]
      .filter(Boolean)
      .map((src) => new URL(src!, site.url).toString()),
    brand: { "@type": "Brand", name: site.name },
    manufacturer: { "@id": `${site.url}/#organization` },
    category: ui.footer.products,
    countryOfOrigin: { "@type": "Country", name: "Vietnam" },
    url: `${site.url}/${locale}/products/${product.slug}`,
    additionalProperty: [
      ...product.grades.map((g) => ({ "@type": "PropertyValue", name: g.code, value: tr(g.label) })),
      ...product.specs.map((s) => ({ "@type": "PropertyValue", name: tr(s.label), value: s.value })),
    ],
  };
  const crumbs = breadcrumbJsonLd(content, locale, [
    { name: ui.nav.products, path: "/products" },
    { name: tr(product.name), path: `/products/${product.slug}` },
  ]);


  return (
    <>
      <section className="relative isolate flex min-h-[36rem] items-end overflow-hidden bg-forest-900 lg:min-h-[42rem]">
        <CmsImg image={product.image?.src ? { src: product.image.src, alt: tr(product.image.alt) } : undefined} priority parallax className="absolute inset-0 -z-10 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/30" />
        <div className="container-page pb-14 pt-36 sm:pb-20">
          <Link href={`/${locale}/products`} data-intro className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="size-4" />
            {t.back}
          </Link>
          <h1 data-intro className="heading mt-6 text-5xl text-white sm:text-6xl lg:text-7xl">
            {tr(product.name)}
            {product.latin && <span className="accent block text-[0.6em] leading-tight text-white/85">{product.latin}</span>}
          </h1>
          <p data-intro className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {tr(product.short)}
          </p>
          <div data-intro className="mt-8 flex flex-wrap gap-3">
            <Button href="#inquiry">{ui.common.requestQuote}</Button>
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center">
          <div data-reveal className={gallery.length ? "lg:col-span-7" : "lg:col-span-12"}>
            <p className="heading text-2xl text-forest-900 sm:text-3xl">{tr(product.description)}</p>
            {tr(product.origin) && (
              <p className="mt-8 inline-flex items-start gap-3 rounded-2xl bg-white p-2 pr-5 text-sm text-ink-600">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime-300 text-forest-950">
                  <MapPin className="size-[18px]" />
                </span>
                <span className="py-1">
                  <span className="block font-medium text-ink-900">{t.origin}</span>
                  {tr(product.origin)}
                </span>
              </p>
            )}
          </div>
          {gallery.length > 0 && (
            <div className={`grid gap-3 lg:col-span-5 ${gallery.length > 2 ? "grid-cols-3 lg:grid-cols-2" : "grid-cols-2"}`}>
              {gallery.map((g, i) => (
                <div
                  key={`${g.src}-${i}`}
                  data-reveal="clip"
                  className={`relative aspect-square overflow-hidden rounded-2xl ${gallery.length > 2 && i === 0 ? "lg:col-span-2 lg:aspect-[2/1]" : ""}`}
                >
                  <CmsImg image={{ src: g.src, alt: tr(g.alt) }} className="absolute inset-0 size-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {product.grades.length > 0 && (
            <>
              <Title title={t.grades} className="text-4xl text-forest-900" />
              <ul className="mt-8 space-y-2">
                {product.grades.map((g, i) => (
                  <li key={i} data-reveal className="flex items-center gap-4 rounded-2xl bg-mist-50 p-2 pr-5 text-sm">
                    <span className="inline-flex h-10 min-w-24 shrink-0 items-center justify-center rounded-xl bg-white px-3 font-semibold text-forest-900">
                      {g.code}
                    </span>
                    <span className="text-ink-600">{tr(g.label)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {product.packaging.length > 0 && (
            <>
              <Title title={t.packaging} className="mt-16 text-4xl text-forest-900" />
              <ul className="mt-8 space-y-2">
                {product.packaging.map((p, i) => (
                  <li key={i} data-reveal className="flex items-center gap-4 rounded-2xl bg-mist-50 p-2 pr-5 text-sm text-ink-600">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-forest-600">
                      <Package className="size-[18px]" />
                    </span>
                    {tr(p.text)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="space-y-10 lg:col-span-5">
          {product.specs.length > 0 && (
            <div>
              <h2 className="heading text-2xl text-forest-900">{t.specs}</h2>
              <dl className="mt-6 grid grid-cols-2 gap-2.5">
                {product.specs.map((s, i) => (
                  <div key={i} data-reveal className="rounded-2xl bg-mist-50 px-4 py-6 text-center">
                    <dd className="text-3xl font-medium tracking-tight text-ink-900">{s.value}</dd>
                    <dt className="mt-1.5 text-xs text-ink-600">{tr(s.label)}</dt>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-ink-400">{t.specsNote}</p>
            </div>
          )}

          {product.applications.length > 0 && (
            <div>
              <h2 className="heading text-2xl text-forest-900">{t.applications}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.applications.map((a, i) => (
                  <li key={i} className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 px-4 py-2 text-sm text-ink-900">
                    <span className="size-1.5 rounded-full bg-forest-600" />
                    {tr(a.text)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      {packs.length > 0 && (
        <section id="packs" className="scroll-mt-24 pb-16 sm:pb-24">
          <div className="container-page">
            <SectionHeading eyebrow={t.packsEyebrow} title={t.packsTitle} accent={t.packsAccent} />
            <div className="mt-10 space-y-4">
              {packs.map((pack, i) => (
                <div key={pack.id} data-reveal>
                  <RetailPackDetail
                    pack={{
                      name: tr(pack.name),
                      flavor: tr(pack.flavor),
                      pack: tr(pack.pack),
                      weights: pack.weights.split(",").map((w) => w.trim()).filter(Boolean),
                      images: pack.images.map((im) => im.src).filter(Boolean),
                      ingredients: tr(pack.ingredients),
                      highlight: tr(pack.highlight),
                      shelfLife: tr(pack.shelfLife),
                      serving: tr(pack.serving),
                      storage: tr(pack.storage),
                      packer: pack.packer,
                      packerAddress: tr(pack.packerAddress),
                      nutrition: pack.nutrition,
                    }}
                    t={ui.retail}
                    photoLabel={ui.common.photo}
                    flip={i % 2 === 1}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="inquiry" className="scroll-mt-24 bg-mist-50 py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Title title={t.inquireTitle} className="text-4xl text-forest-900" />
            <p className="mt-5 text-sm leading-relaxed text-ink-600">{t.inquireBody}</p>
          </div>
          <div data-reveal className="rounded-3xl bg-white p-6 sm:p-10 lg:col-span-8">
            <InquiryForm t={ui.form} defaultProduct={product.slug} />
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(productJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(crumbs)} />
    </>
  );
}
