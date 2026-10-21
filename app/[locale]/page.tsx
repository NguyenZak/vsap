import { MessageCircleQuestion } from "lucide-react";
import { AccordionCards, CtaBanner, PartnerGrid, ProductLines, SectionHeading, StatCards } from "@/components/sections";
import { HeroSlider } from "@/components/HeroSlider";
import { ProcessTabs } from "@/components/ProcessTabs";
import { ValuesShowcase } from "@/components/ValuesShowcase";
import { StatementSlider } from "@/components/StatementSlider";
import { Button } from "@/components/ui";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import type { ImageKey } from "@/lib/images";
import { products } from "@/lib/products";

const gradeCount = products.reduce((n, p) => n + p.grades.length, 0);
const withGrades = (s: string) => s.replace("{grades}", String(gradeCount));

// Grade codes shown in the strip under the hero, styled like partner wordmarks.
const stripCodes = ["W180", "W240", "W320", "Style 0", "NIS 22+"];
const heroThumbs: ImageKey[] = ["cashew", "macadamia", "cashewKernels"];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const { hero, strip, statement, intro, values, process, faq, partners: partnersT } = dict.home;

  return (
    <>
      <HeroSlider locale={locale} hero={hero} grades={withGrades(hero.grades)} thumbs={heroThumbs} />

      {/* Grade strip + statement */}
      <section className="bg-mist-50">
        <div className="container-page flex items-center gap-10 overflow-hidden border-b border-mist-200 py-8 sm:gap-14">
          <p className="shrink-0 text-sm leading-snug text-ink-600">
            {strip.lead}
            <br />
            <span className="font-medium text-ink-900">{strip.strong}</span>
          </p>
          <ul className="flex flex-1 items-center justify-between gap-10 sm:gap-14">
            {stripCodes.map((c) => (
              <li key={c} className="shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap text-ink-400 uppercase sm:text-2xl">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div id="about" className="container-page scroll-mt-20 py-16 sm:py-24">
          <StatementSlider locale={locale} statement={statement} labels={hero} />
        </div>
      </section>

      {/* Values accordion + photo */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow={values.eyebrow} title={values.title} accent={values.accent} lead={values.lead} />
          <div className="mt-12">
            <ValuesShowcase values={dict.values} locale={locale} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-16 sm:pb-24">
        <div className="container-page">
          <SectionHeading eyebrow={process.eyebrow} title={process.title} accent={process.accent} lead={process.lead} />
          <div className="mt-10">
            <ProcessTabs steps={dict.process} locale={locale} stepLabel={process.step} location={process.location} />
          </div>
          <div className="mt-3">
            <StatCards stats={intro.stats.map((s) => ({ ...s, value: withGrades(s.value) }))} />
          </div>
        </div>
      </section>

      {/* Product lines */}
      <section className="bg-mist-50 py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading {...dict.home.retail} />
        </div>
        <div className="mt-12">
          <ProductLines locale={locale} t={dict.home.retail} />
        </div>
        <div data-reveal className="container-page mt-10">
          <Button href={`/${locale}/products`} variant="dark">
            {dict.common.allProducts}
          </Button>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow={partnersT.eyebrow} title={partnersT.title} accent={partnersT.accent} lead={partnersT.lead} />
          <div className="mt-12">
            <PartnerGrid locale={locale} t={partnersT} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow={faq.eyebrow} title={faq.title} accent={faq.accent} lead={faq.lead} />
          <div className="mt-12 grid gap-x-4 lg:grid-cols-2">
            <AccordionCards
              name="faq"
              items={faq.items.slice(0, 3).map(({ q, a }) => ({ title: q, body: a }))}
              icons={[MessageCircleQuestion]}
            />
            <div className="mt-2.5 lg:mt-0">
              <AccordionCards
                name="faq-2"
                openFirst={false}
                items={faq.items.slice(3).map(({ q, a }) => ({ title: q, body: a }))}
                icons={[MessageCircleQuestion]}
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner locale={locale} cta={dict.home.cta} />
    </>
  );
}

