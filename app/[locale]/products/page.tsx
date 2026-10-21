import type { Metadata } from "next";
import { CtaBanner, PageHero, ProductCard, ProductLines, SectionHeading } from "@/components/sections";
import { alternates, getDictionary, resolveLocale, metadataLocale } from "@/lib/i18n";
import { products } from "@/lib/products";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const { productsPage } = getDictionary(locale);
  return {
    title: productsPage.metaTitle,
    description: productsPage.metaDescription,
    alternates: alternates(locale, "/products"),
  };
}

export default async function ProductsPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const { productsPage } = dict;

  return (
    <>
      <PageHero
        eyebrow={productsPage.eyebrow}
        title={productsPage.title}
        accent={productsPage.accent}
        lead={productsPage.lead}
        image="cashewTreeSky"
        locale={locale}
      />
      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} cta={dict.common.viewProduct} />
          ))}
        </div>
      </section>
      <section className="bg-mist-50 py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading {...dict.home.retail} />
        </div>
        <div className="mt-12">
          <ProductLines locale={locale} t={dict.home.retail} />
        </div>
      </section>
      <CtaBanner locale={locale} cta={dict.home.cta} />
    </>
  );
}
