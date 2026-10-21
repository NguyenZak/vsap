import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { RetailPackDetail } from "@/components/RetailPackDetail";
import { Photo, SectionHeading } from "@/components/sections";
import { Button, Title } from "@/components/ui";
import { alternates, getDictionary, locales, resolveLocale, metadataLocale } from "@/lib/i18n";
import { images } from "@/lib/images";
import { getProduct, products } from "@/lib/products";
import { retailPacks } from "@/lib/retail";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

async function load(params: Props["params"]) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const product = getProduct(slug);
  if (!product) notFound();
  return { locale, product };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = metadataLocale(raw);
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name[locale],
    description: product.short[locale],
    alternates: alternates(locale, `/products/${product.slug}`),
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, product } = await load(params);
  const dict = getDictionary(locale);
  const t = dict.productDetail;
  const packs = retailPacks.filter((p) => p.slug === product.slug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    description: product.description[locale],
    image: [...packs.map((p) => `${site.url}${p.images[0]}`), `${site.url}${images[product.image].src}`],
    brand: { "@type": "Brand", name: site.name },
    url: `${site.url}/${locale}/products/${product.slug}`,
  };

  return (
    <>
      <section className="relative isolate flex min-h-[36rem] items-end overflow-hidden bg-forest-900 lg:min-h-[42rem]">
        <Photo name={product.image} locale={locale} priority parallax className="absolute inset-0 -z-10 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/30" />
        <div className="container-page pb-14 pt-36 sm:pb-20">
          <Link
            href={`/${locale}/products`}
            data-intro
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            {t.back}
          </Link>
          <h1 data-intro className="heading mt-6 text-5xl text-white sm:text-6xl lg:text-7xl">
            {product.name[locale]}
            <span className="accent block text-[0.6em] leading-tight text-white/85">{product.latin}</span>
          </h1>
          <p data-intro className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            {product.short[locale]}
          </p>
          <div data-intro className="mt-8 flex flex-wrap gap-3">
            <Button href="#inquiry">{dict.common.requestQuote}</Button>
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center">
          <div data-reveal className="lg:col-span-7">
            <p className="heading text-2xl text-forest-900 sm:text-3xl">{product.description[locale]}</p>
            <p className="mt-8 inline-flex items-start gap-3 rounded-2xl bg-white p-2 pr-5 text-sm text-ink-600">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime-300 text-forest-950">
                <MapPin className="size-[18px]" />
              </span>
              <span className="py-1">
                <span className="block font-medium text-ink-900">{t.origin}</span>
                {product.origin[locale]}
              </span>
            </p>
          </div>
          <div className={`grid gap-3 lg:col-span-5 ${product.gallery.length > 2 ? "grid-cols-3 lg:grid-cols-2" : "grid-cols-2"}`}>
            {product.gallery.map((key, i) => (
              <div
                key={key}
                data-reveal="clip"
                className={`relative aspect-square overflow-hidden rounded-2xl ${product.gallery.length > 2 && i === 0 ? "lg:col-span-2 lg:aspect-[2/1]" : ""}`}
              >
                <Photo name={key} locale={locale} className="absolute inset-0 size-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Title title={t.grades} className="text-4xl text-forest-900" />
          <ul className="mt-8 space-y-2">
            {product.grades.map((g) => (
              <li key={g.code} data-reveal className="flex items-center gap-4 rounded-2xl bg-mist-50 p-2 pr-5 text-sm">
                <span className="inline-flex h-10 min-w-24 shrink-0 items-center justify-center rounded-xl bg-white px-3 font-semibold text-forest-900">
                  {g.code}
                </span>
                <span className="text-ink-600">{g.label[locale]}</span>
              </li>
            ))}
          </ul>

          <Title title={t.packaging} className="mt-16 text-4xl text-forest-900" />
          <ul className="mt-8 space-y-2">
            {product.packaging[locale].map((p) => (
              <li key={p} data-reveal className="flex items-center gap-4 rounded-2xl bg-mist-50 p-2 pr-5 text-sm text-ink-600">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-forest-600">
                  <Package className="size-[18px]" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-10 lg:col-span-5">
          <div>
            <h2 className="heading text-2xl text-forest-900">{t.specs}</h2>
            <dl className="mt-6 grid grid-cols-2 gap-2.5">
              {product.specs.map((s) => (
                <div key={s.label.en} data-reveal className="rounded-2xl bg-mist-50 px-4 py-6 text-center">
                  <dd className="text-3xl font-medium tracking-tight text-ink-900">{s.value}</dd>
                  <dt className="mt-1.5 text-xs text-ink-600">{s.label[locale]}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-ink-400">{t.specsNote}</p>
          </div>

          <div>
            <h2 className="heading text-2xl text-forest-900">{t.applications}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {product.applications[locale].map((a) => (
                <li key={a} className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 px-4 py-2 text-sm text-ink-900">
                  <span className="size-1.5 rounded-full bg-forest-600" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section id="packs" className="scroll-mt-24 pb-16 sm:pb-24">
        <div className="container-page">
          <SectionHeading eyebrow={dict.home.retail.eyebrow} title={dict.home.retail.detailTitle} accent={dict.home.retail.detailAccent} />
          <div className="mt-10 space-y-4">
            {packs.map((pack, i) => (
              <div key={pack.id} data-reveal>
                <RetailPackDetail pack={pack} locale={locale} t={dict.home.retail} flip={i % 2 === 1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry" className="scroll-mt-24 bg-mist-50 py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Title title={t.inquireTitle} className="text-4xl text-forest-900" />
            <p className="mt-5 text-sm leading-relaxed text-ink-600">{t.inquireBody}</p>
          </div>
          <div data-reveal className="rounded-3xl bg-white p-6 sm:p-10 lg:col-span-8">
            <InquiryForm t={dict.contact.form} defaultProduct={product.slug} />
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    </>
  );
}
