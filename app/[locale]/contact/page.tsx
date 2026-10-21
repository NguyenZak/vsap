import type { Metadata } from "next";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/sections";
import { alternates, getDictionary, resolveLocale, metadataLocale } from "@/lib/i18n";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = metadataLocale((await params).locale);
  const { contact } = getDictionary(locale);
  return { title: contact.metaTitle, description: contact.metaDescription, alternates: alternates(locale, "/contact") };
}

export default async function ContactPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  const { contact, footer } = getDictionary(locale);

  const info = [
    { icon: Phone, label: contact.info.phone, value: site.phone, href: `tel:${site.phoneE164}` },
    { icon: Mail, label: contact.info.email, value: site.email, href: `mailto:${site.email}` },
    { icon: Globe, label: contact.info.website, value: site.url.replace("https://", ""), href: site.url },
    ...site.offices.map((o) => ({ icon: MapPin, label: o.label[locale], value: o.address[locale], href: undefined })),
  ];

  return (
    <>
      <PageHero
        eyebrow={contact.eyebrow}
        title={contact.title}
        accent={contact.accent}
        lead={contact.lead}
        image="shipping"
        locale={locale}
      />
      <section className="container-page grid gap-4 py-16 sm:py-24 lg:grid-cols-12">
        <ul className="space-y-2.5 lg:col-span-4">
          <li data-reveal className="rounded-2xl bg-forest-900 p-5 text-white">
            <p className="text-xs text-white/60">{footer.brandOf}</p>
            <p className="mt-1 text-sm font-semibold tracking-wide uppercase">{site.legalName}</p>
          </li>
          {info.map(({ icon: Icon, label, value, href }) => (
            <li key={label} data-reveal className="flex items-center gap-3 rounded-2xl bg-mist-50 p-2 pr-5">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime-300 text-forest-950">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xs text-ink-600">{label}</p>
                {href ? (
                  <a href={href} className="block text-sm font-medium text-ink-900 hover:text-forest-600">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-ink-900">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div data-reveal className="rounded-3xl bg-mist-50 p-6 sm:p-10 lg:col-span-8">
          <InquiryForm t={contact.form} />
        </div>
      </section>
    </>
  );
}
