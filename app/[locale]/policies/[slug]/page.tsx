import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { pick } from "@/lib/cms/links";
import { getContent } from "@/lib/cms/store";
import type { SiteContent } from "@/lib/cms/types";
import { metadataLocale, resolveLocale } from "@/lib/i18n";
import { localeInfo, type Locale } from "@/lib/locales";
import { seoMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Policies come from the CMS, so any policy added there gets a page.
export const dynamicParams = true;

async function load(params: Props["params"]) {
  const { locale: raw, slug } = await params;
  const content = await getContent();
  return { raw, content, policy: content.policies.find((p) => p.slug === slug) };
}

/** Fills {company} {taxId} {address} {phone} {email} {website} from Studio › Công ty. */
function fillCompany(text: string, content: SiteContent, locale: Locale) {
  const s = content.settings;
  const values: Record<string, string> = {
    company: locale === "vi" || !s.legalNameEn ? s.legalName : s.legalNameEn,
    taxId: s.taxId,
    address: pick(s.offices[0]?.address, locale),
    phone: s.phone,
    email: s.email,
    website: s.url.replace(/^https?:\/\//, ""),
  };
  return text.replace(/\{(company|taxId|address|phone|email|website)\}/g, (_, key: string) => values[key] ?? "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { raw, content, policy } = await load(params);
  const locale = metadataLocale(raw);
  if (!policy) return {};
  const body = fillCompany(pick(policy.body, locale), content, locale);
  return seoMetadata({
    content,
    locale,
    path: `/policies/${policy.slug}`,
    title: pick(policy.title, locale),
    description: body.replace(/[#*_>`[\]()-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 155),
  });
}

export default async function PolicyPage({ params }: Props) {
  const { raw, content, policy } = await load(params);
  const locale = resolveLocale(raw);
  if (!policy) notFound();
  const ui = content.ui[locale];
  const updated = /^\d{4}-\d{2}-\d{2}$/.test(policy.updated)
    ? new Intl.DateTimeFormat(localeInfo[locale].intl, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${policy.updated}T00:00:00Z`))
    : "";

  return (
    <>
      <div className="bg-forest-950 bg-dark-glow pt-28 pb-10 text-white lg:pt-32 lg:pb-14">
        <div className="container-page">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              <li>
                <Link href={`/${locale}`} className="hover:text-sun-400">
                  {ui.nav.home}
                </Link>
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ChevronRight className="size-3.5 text-white/30" />
                <span>{ui.footer.policies}</span>
              </li>
            </ol>
          </nav>
          <h1 className="heading mt-5 text-4xl sm:text-5xl">{pick(policy.title, locale)}</h1>
          {updated && (
            <p className="mt-3 text-sm text-white/60">
              {ui.footer.policyUpdated}: {updated}
            </p>
          )}
        </div>
      </div>

      <section className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-3">
          <nav aria-label={ui.footer.policies} className="lg:sticky lg:top-28">
            <p className="text-xs font-medium tracking-[0.18em] text-ink-400 uppercase">{ui.footer.policies}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {content.policies.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${locale}/policies/${p.slug}`}
                    aria-current={p.slug === policy.slug ? "page" : undefined}
                    className="block rounded-lg px-3 py-2 text-ink-600 transition hover:bg-mist-50 hover:text-forest-900 aria-[current=page]:bg-mist-100 aria-[current=page]:font-medium aria-[current=page]:text-forest-900"
                  >
                    {pick(p.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="max-w-3xl lg:col-span-9">
          <Markdown source={fillCompany(pick(policy.body, locale), content, locale)} locale={locale} />
        </article>
      </section>
    </>
  );
}
