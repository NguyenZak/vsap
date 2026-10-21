import type { Metadata } from "next";
import { Compass, Heart, Target } from "lucide-react";
import { CtaBanner, PageHero, Photo, SectionHeading } from "@/components/sections";
import { Tag } from "@/components/ui";
import { ValuesShowcase } from "@/components/ValuesShowcase";
import { alternates, getDictionary, resolveLocale, metadataLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const { about } = getDictionary(locale);
  return { title: about.metaTitle, description: about.metaDescription, alternates: alternates(locale, "/about") };
}


export default async function AboutPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const { about } = dict;

  const pillars = [
    { icon: Target, ...about.mission },
    { icon: Compass, ...about.vision },
    { icon: Heart, ...about.slogan },
  ];

  return (
    <>
      <PageHero
        eyebrow={about.eyebrow}
        title={about.title}
        accent={about.accent}
        lead={about.lead}
        image="farmerHoe"
        locale={locale}
      />

      <section className="bg-mist-50 py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center">
          <div data-reveal className="lg:col-span-6">
            <Tag>{about.story.title}</Tag>
            <div className="mt-6 space-y-5">
              {about.story.paragraphs.map((p, i) => (
                <p
                  key={p}
                  className={
                    i === 0
                      ? "heading text-2xl text-forest-900 sm:text-3xl"
                      : "text-base leading-relaxed text-ink-600"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-6">
            <div data-reveal="clip" className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Photo name="cashewHarvest" locale={locale} parallax className="absolute inset-0 size-full" />
            </div>
            <div data-reveal="clip" className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl">
              <Photo name="macadamiaTree" locale={locale} parallax className="absolute inset-0 size-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <ul className="container-page grid gap-3 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body }) => (
            <li key={title} data-reveal className="rounded-2xl bg-mist-50 p-7">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-lime-300 text-forest-950">
                <Icon className="size-5" />
              </span>
              <h3 className="heading mt-8 text-2xl text-forest-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-8">
        <div className="container-page">
          <SectionHeading
            eyebrow={dict.home.values.eyebrow}
            title={dict.home.values.title}
            accent={dict.home.values.accent}
            lead={dict.home.values.lead}
          />
          <div className="mt-12">
            <ValuesShowcase values={dict.values} locale={locale} />
          </div>
        </div>
      </section>

      <CtaBanner locale={locale} cta={dict.home.cta} />
    </>
  );
}
