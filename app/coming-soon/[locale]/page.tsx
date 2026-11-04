import { Mail, MessageCircle, Phone } from "lucide-react";
import { Tag } from "@/components/ui";
import { getContent } from "@/lib/cms/store";
import { resolveLocale } from "@/lib/i18n";
import { localeInfo, locales } from "@/lib/locales";

type Props = { params: Promise<{ locale: string }> };

/** What visitors see while the website is not public. Copy: Studio › Chữ giao diện › Trang Sắp ra mắt. */
export default async function ComingSoonPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  const { settings: site, ui } = await getContent();
  const t = ui[locale].comingSoon;
  const legalName = locale === "vi" || !site.legalNameEn ? site.legalName : site.legalNameEn;

  const contacts = [
    site.phone && { href: `tel:${site.phoneE164 || site.phone}`, label: site.phone, icon: <Phone className="size-4" /> },
    site.email && { href: `mailto:${site.email}`, label: site.email, icon: <Mail className="size-4" /> },
    site.zalo && { href: site.zalo, label: ui[locale].chat.zalo, icon: <img src="/images/zalo.png" alt="" width={16} height={16} className="size-4 rounded" />, external: true },
    site.whatsapp && { href: site.whatsapp, label: ui[locale].chat.whatsapp, icon: <MessageCircle className="size-4" />, external: true },
  ].filter((c): c is { href: string; label: string; icon: React.ReactElement; external?: boolean } => Boolean(c));

  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden text-white">
      <img src="/images/highlands.webp" alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-35" />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-forest-950/50 via-forest-950/70 to-forest-950" />

      <header className="container-page flex flex-wrap items-center justify-between gap-4 pt-6">
        <img src="/logo-light.svg" alt={`${site.name} – ${site.tagline}`} width={136} height={68} className="h-12 w-auto sm:h-14" />
        {/* Each link goes back through the proxy, which shows this page again in that language. */}
        <nav aria-label={localeInfo[locale].choose} className="flex flex-wrap gap-1 text-xs">
          {locales.map((l) => (
            <a
              key={l}
              href={`/${l}`}
              hrefLang={localeInfo[l].html}
              aria-current={l === locale ? "true" : undefined}
              className={`rounded-full px-3 py-1.5 transition ${l === locale ? "bg-white/15 text-white" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
            >
              {localeInfo[l].name}
            </a>
          ))}
        </nav>
      </header>

      <section className="container-page flex flex-1 flex-col justify-center py-16">
        <div className="max-w-2xl">
          <Tag tone="glass">{t.tag}</Tag>
          <h1 className="heading mt-5 text-4xl sm:text-5xl lg:text-6xl">
            {t.title}
            {t.accent && <span className="accent block text-[1.1em] leading-[1] text-white/85">{t.accent}</span>}
          </h1>
          {t.body && <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{t.body}</p>}

          {contacts.length > 0 && (
            <div className="mt-10">
              {t.contact && <p className="text-xs font-medium tracking-[0.18em] text-white/55 uppercase">{t.contact}</p>}
              <ul className="mt-3 flex flex-wrap gap-2">
                {contacts.map((c) => (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2.5 text-sm text-white backdrop-blur-sm transition hover:bg-white/15"
                    >
                      <span className="text-sun-400">{c.icon}</span>
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <footer className="container-page pb-6 text-xs text-white/45">
        © {new Date().getFullYear()} {legalName}
      </footer>
    </main>
  );
}
