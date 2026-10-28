import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { pick } from "@/lib/cms/links";
import type { SiteContent, UiStrings } from "@/lib/cms/types";
import type { Locale } from "@/lib/i18n";
import { localeInfo } from "@/lib/locales";
import { Button } from "./ui";

type Props = { locale: Locale; content: SiteContent; ui: UiStrings };

const rank = (order: string[], slug: string) => (order.includes(slug) ? order.indexOf(slug) : order.length);

export function Footer({ locale, content, ui }: Props) {
  const { nav, footer } = ui;
  const site = content.settings;
  const products = content.products;
  const heading = "text-xs font-medium uppercase tracking-[0.18em] text-white/50";
  // The registered English name everywhere except the Vietnamese pages.
  const legalName = locale === "vi" || !site.legalNameEn ? site.legalName : site.legalNameEn;
  const registered = /^\d{4}-\d{2}-\d{2}$/.test(site.registeredAt ?? "")
    ? new Intl.DateTimeFormat(localeInfo[locale].intl, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${site.registeredAt}T00:00:00Z`))
    : "";
  const link = "text-white/80 transition hover:text-sun-400";

  // Policies in the order customers look for them, then any others added in Studio.
  const policyOrder = ["returns", "privacy", "shipping", "payment", "terms"];
  const policies = [...content.policies].sort((a, b) => rank(policyOrder, a.slug) - rank(policyOrder, b.slug));
  const policyHref = (slug: string) => `/${locale}/policies/${slug}`;
  const terms = content.policies.find((p) => p.slug === "terms");
  const policyLinks: [string, string][] = [...policies.map((p): [string, string] => [policyHref(p.slug), pick(p.title, locale)]), [`/${locale}/about`, nav.about]];
  const explore: [string, string][] = [
    [`/${locale}`, nav.home],
    [`/${locale}/products`, nav.products],
    [`/${locale}/health`, nav.health],
    [`/${locale}/news`, nav.news],
    ...(terms ? [[policyHref(terms.slug), pick(terms.title, locale)] as [string, string]] : []),
    [`/${locale}/contact`, nav.contact],
  ];

  return (
    <footer className="bg-forest-950 bg-dark-glow text-white">
      {/* The logo's green → yellow → red sweep. */}
      <div aria-hidden className="bg-brand-gradient h-1" />
      <div className="container-page pt-16 sm:pt-20">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <img src="/logo-light.svg" alt={site.name} width={136} height={68} className="-ml-3 h-16 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{pick(site.about, locale)}</p>
            <p className="mt-5 text-xs text-white/50">
              {footer.brandOf}
              <span className="mt-1 block text-sm font-semibold tracking-wide text-white uppercase">{legalName}</span>
            </p>
            {/* Business registration details, as Vietnamese e-commerce rules require on selling sites. */}
            <dl className="mt-3 space-y-1 text-xs text-white/60">
              {site.taxId && (
                <div>
                  <dt className="inline">{footer.taxId}: </dt>
                  <dd className="inline font-medium text-white/85 tabular-nums">{site.taxId}</dd>
                  {registered && (
                    <span>
                      {" · "}
                      {footer.registered} {registered}
                    </span>
                  )}
                </div>
              )}
              {site.representative?.name && (
                <div>
                  <dt className="inline">{footer.representative}: </dt>
                  <dd className="inline text-white/85">
                    {site.representative.name}
                    {pick(site.representative.title, locale) && ` – ${pick(site.representative.title, locale)}`}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <Button href={`/${locale}/contact`}>{nav.quote}</Button>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 className={heading}>{footer.explore}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {explore.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className={heading}>{footer.policies}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {policyLinks.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className={heading}>{footer.products}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${locale}/products/${p.slug}`} className={link}>
                    {pick(p.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <h2 className={heading}>{footer.contact}</h2>
            <ul className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1">
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-sun-400" />
                <a href={`tel:${site.phoneE164}`} className={link}>
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-sun-400" />
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </li>
              {site.offices.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-sun-400" />
                  <span className="text-white/80">
                    <span className="block text-white">{pick(o.label, locale)}</span>
                    {pick(o.address, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="accent container-page select-none overflow-hidden pb-4 text-[8.5vw] leading-none whitespace-nowrap text-white/[0.08] xl:text-[7rem]"
      >
        {site.tagline}
      </p>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {footer.rights}
          </p>
          {site.social.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {site.social
                .filter((x) => x.url)
                .map((x) => (
                  <li key={x.url}>
                    <a href={x.url} target="_blank" rel="noopener noreferrer me" className="text-white/70 transition hover:text-sun-400">
                      {x.name}
                    </a>
                  </li>
                ))}
            </ul>
          )}
          <p>
            {footer.brandOf} {legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
