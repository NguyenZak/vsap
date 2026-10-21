import type { Metadata } from "next";
import { FileCheck2, FlaskConical, QrCode, ScanEye, ShieldCheck } from "lucide-react";
import { ProcessTabs } from "@/components/ProcessTabs";
import { AccordionCards, CtaBanner, PageHero, Photo, SectionHeading } from "@/components/sections";
import { Tag, Title } from "@/components/ui";
import { alternates, getDictionary, resolveLocale, metadataLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const { quality } = getDictionary(locale);
  return { title: quality.metaTitle, description: quality.metaDescription, alternates: alternates(locale, "/quality") };
}

const controlIcons = [QrCode, ScanEye, FlaskConical, ShieldCheck];

export default async function QualityPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const { quality } = dict;
  const { process } = dict.home;

  return (
    <>
      <PageHero
        eyebrow={quality.eyebrow}
        title={quality.title}
        accent={quality.accent}
        lead={quality.lead}
        image="cashewProcessing"
        locale={locale}
      />

      <section className="py-16 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow={process.eyebrow} title={process.title} accent={process.accent} lead={process.lead} />
          <div className="mt-10">
            <ProcessTabs steps={dict.process} locale={locale} stepLabel={process.step} location={process.location} />
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-16 sm:py-24">
        <div className="container-page grid gap-4 lg:grid-cols-2">
          <div>
            <div data-reveal>
              <Tag>{quality.eyebrow}</Tag>
              <Title title={quality.controlsTitle} className="mt-4 mb-10 text-4xl text-forest-900 sm:text-5xl" />
            </div>
            <AccordionCards name="controls" items={quality.controls} icons={controlIcons} />
          </div>
          <div data-reveal="clip" className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto">
            <Photo name="cashewKernels" locale={locale} parallax className="absolute inset-0 size-full" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div data-reveal>
            <Title title={quality.documentsTitle} className="text-4xl text-forest-900 sm:text-5xl" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-600">{quality.documentsLead}</p>
          </div>
          <ul className="space-y-2.5">
            {quality.documents.map((d) => (
              <li key={d} data-reveal className="flex items-center gap-3 rounded-2xl bg-mist-50 p-2 pr-5 text-sm text-ink-900">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-forest-600">
                  <FileCheck2 className="size-[18px]" />
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner locale={locale} cta={dict.home.cta} />
    </>
  );
}
