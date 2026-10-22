import type { Metadata } from "next";
import { Checkout } from "@/components/shop/Checkout";
import { pick } from "@/lib/cms/links";
import { getContent } from "@/lib/cms/store";
import { metadataLocale, resolveLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const { ui } = await getContent();
  return { title: ui[locale].shop.checkoutTitle, robots: { index: false, follow: true } };
}

export default async function CartPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  const content = await getContent();
  const t = content.ui[locale].shop;
  // Links for the "you agree to the terms and privacy policy" note; missing policies are left out.
  const link = (slug: string) => {
    const p = content.policies.find((x) => x.slug === slug);
    return p ? { href: `/${locale}/policies/${p.slug}`, label: pick(p.title, locale) } : null;
  };

  return (
    <>
      <div className="bg-forest-950 pt-28 pb-10 text-white lg:pt-32 lg:pb-14">
        <div className="container-page">
          <h1 className="heading text-4xl sm:text-5xl">{t.checkoutTitle}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">{t.checkoutLead}</p>
        </div>
      </div>
      <section className="container-page py-10 sm:py-14">
        <Checkout terms={link("terms")} privacy={link("privacy")} />
      </section>
    </>
  );
}
