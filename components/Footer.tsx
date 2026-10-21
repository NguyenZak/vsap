import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { pick } from "@/lib/cms/links";
import type { SiteContent, UiStrings } from "@/lib/cms/types";
import type { Locale } from "@/lib/i18n";
import { Button } from "./ui";

type Props = { locale: Locale; content: SiteContent; ui: UiStrings };

export function Footer({ locale, content, ui }: Props) {
  const { nav, footer } = ui;
  const site = content.settings;
  const products = content.products;
  const heading = "text-xs font-medium uppercase tracking-[0.18em] text-white/50";
  const link = "text-white/80 transition hover:text-lime-300";

  return (
    <footer className="bg-forest-950 text-white">
      <div className="container-page pt-16 sm:pt-20">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <img src="/logo-light.svg" alt={site.name} width={136} height={68} className="-ml-3 h-16 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{pick(site.about, locale)}</p>
            <p className="mt-5 text-xs text-white/50">
              {footer.brandOf}
              <span className="mt-1 block text-sm font-semibold tracking-wide text-white uppercase">{site.legalName}</span>
            </p>
          </div>
          <Button href={`/${locale}/contact`}>{nav.quote}</Button>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 className={heading}>{footer.explore}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                [`/${locale}/about`, nav.about],
                [`/${locale}/quality`, nav.quality],
                [`/${locale}/contact`, nav.contact],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className={heading}>{footer.products}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${locale}/products/${p.slug}`} className={link}>
                    {p.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-6">
            <h2 className={heading}>{footer.contact}</h2>
            <ul className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-lime-300" />
                <a href={`tel:${site.phoneE164}`} className={link}>
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-lime-300" />
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </li>
              {site.offices.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-lime-300" />
                  <span className="text-white/80">
                    <span className="block text-white">{o.label[locale]}</span>
                    {o.address[locale]}
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
          <p>
            {footer.brandOf} {site.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
