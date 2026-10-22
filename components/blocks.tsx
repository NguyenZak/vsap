// One renderer per section type in lib/cms/registry.ts. Each takes the stored
// section props and the page context, resolves the current language, and renders.
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localHref, pick } from "@/lib/cms/links";
import type { CmsImage, L, Post, Section, SiteContent, UiStrings } from "@/lib/cms/types";
import { HeroSlider } from "./HeroSlider";
import { InquiryForm } from "./InquiryForm";
import { FeaturedPost, PostGrid } from "./PostCards";
import { ProcessTabs } from "./ProcessTabs";
import { ProductGrid } from "./shop/ProductGrid";
import { toShopItem } from "@/lib/shop";
import { StatementSlider } from "./StatementSlider";
import { ValuesShowcase } from "./ValuesShowcase";
import {
  AccordionCards,
  CmsImg,
  LogoWall,
  Paragraphs,
  ProductCard,
  SectionHeading,
  StatCards,
  toneBg,
  type Tone,
} from "./sections";
import { SIZES } from "@/lib/responsive";
import { CmsIcon } from "./cms/Icon";
import { Button, Tag, Title } from "./ui";

export type BlockCtx = {
  locale: Locale;
  content: SiteContent;
  ui: UiStrings;
  /** Live news posts for this language, loaded only when the page has a "posts" section. */
  posts?: Post[];
  preview?: boolean;
};

// Section props are free-form JSON from the CMS; these readers keep the renderers tolerant
// of missing or half-filled fields instead of crashing the page.
type P = Record<string, unknown>;
const list = (v: unknown): P[] => (Array.isArray(v) ? (v as P[]) : []);
const str = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : fallback);

function makeT(ctx: BlockCtx) {
  const t = (v: unknown) => pick(v as L | string | undefined, ctx.locale);
  const img = (v: unknown) => {
    const i = v as CmsImage | undefined;
    return i?.src ? { src: i.src, alt: pick(i.alt, ctx.locale) } : undefined;
  };
  const href = (v: unknown) => localHref(str(v), ctx.locale);
  return { t, img, href };
}

const gradeCount = (c: SiteContent) => c.products.reduce((n, p) => n + (p.grades?.length ?? 0), 0);
const withGrades = (s: string, c: SiteContent) => s.replace("{grades}", String(gradeCount(c)));

export function toneOf(section: Section): Tone | "none" {
  const fixed: Record<string, Tone | "none"> = {
    hero: "none",
    pageHero: "none",
    strip: "muted",
    statement: "muted",
    values: "white",
    process: "white",
    stats: "white",
    productCards: "white",
    partners: "white",
    faq: "white",
    cta: "none",
    contact: "white",
  };
  if (section.type in fixed) return fixed[section.type];
  const tone = str(section.props.tone);
  return tone === "muted" || tone === "dark" ? tone : "white";
}

function heading(p: P, ctx: BlockCtx, tone: Tone = "white") {
  const { t } = makeT(ctx);
  return <SectionHeading eyebrow={t(p.eyebrow)} title={t(p.title)} accent={t(p.accent)} lead={t(p.lead)} tone={tone} />;
}

const hasHeading = (p: P, ctx: BlockCtx) => ["eyebrow", "title", "accent", "lead"].some((k) => pick(p[k] as L, ctx.locale));

type Renderer = (p: P, ctx: BlockCtx, section: Section) => React.ReactNode;

const renderers: Record<string, Renderer> = {
  hero(p, ctx) {
    const { t, img, href } = makeT(ctx);
    const slides = list(p.slides).map((s) => ({
      label: t(s.label),
      eyebrow: t(s.eyebrow),
      title: t(s.title),
      accent: t(s.accent),
      lead: t(s.lead),
      image: img(s.image) ?? { src: "", alt: "" },
      buttonLabel: t(s.buttonLabel),
      buttonHref: href(s.buttonHref),
      secondaryLabel: t(s.secondaryLabel),
      secondaryHref: href(s.secondaryHref),
    }));
    if (slides.length === 0) return null;
    const c = ctx.ui.common;
    return (
      <HeroSlider
        slides={slides}
        autoplay={num(p.autoplay, 7)}
        scrollLabel={t(p.scrollLabel)}
        rankValue={str(p.rankValue)}
        rankLabel={t(p.rankLabel)}
        proofLabel={withGrades(t(p.proofLabel), ctx.content)}
        proofImages={list(p.proofImages).flatMap((x) => img(x.image) ?? [])}
        labels={{ prev: c.prev, next: c.next, pause: c.pause, play: c.play, slide: c.slide }}
      />
    );
  },

  pageHero(p, ctx) {
    const { t, img } = makeT(ctx);
    return (
      <div className="relative isolate flex min-h-[34rem] items-end overflow-hidden bg-forest-900 lg:min-h-[40rem]">
        <CmsImg image={img(p.image)} priority parallax className="absolute inset-0 -z-10 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/20 to-black/25" />
        <div className="container-page pb-14 pt-36 sm:pb-20">
          {t(p.eyebrow) && (
            <div data-intro>
              <Tag tone="glass">{t(p.eyebrow)}</Tag>
            </div>
          )}
          <div data-intro>
            <Title as="h1" title={t(p.title)} accent={t(p.accent)} className="mt-5 max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl" />
          </div>
          {t(p.lead) && (
            <p data-intro className="mt-5 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
              {t(p.lead)}
            </p>
          )}
        </div>
      </div>
    );
  },

  strip(p, ctx) {
    const { t } = makeT(ctx);
    return (
      <div className="container-page flex items-center gap-10 overflow-hidden border-b border-mist-200 py-8 sm:gap-14">
        {(t(p.lead) || t(p.strong)) && (
          <p className="shrink-0 text-sm leading-snug text-ink-600">
            {t(p.lead)}
            <br />
            <span className="font-medium text-ink-900">{t(p.strong)}</span>
          </p>
        )}
        <ul className="flex flex-1 items-center justify-between gap-10 sm:gap-14">
          {list(p.codes).map((c, i) => (
            <li key={i} className="shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap text-ink-400 uppercase sm:text-2xl">
              {str(c.code)}
            </li>
          ))}
        </ul>
      </div>
    );
  },

  statement(p, ctx) {
    const { t, img } = makeT(ctx);
    const items = list(p.items).map((s) => ({ strong: t(s.strong), muted: t(s.muted), tail: t(s.tail), image: img(s.image) ?? { src: "", alt: "" } }));
    if (items.length === 0) return null;
    const c = ctx.ui.common;
    return (
      <div className="block-pad container-page">
        <StatementSlider eyebrow={t(p.eyebrow)} items={items} hold={num(p.hold, 3.5)} labels={{ prev: c.prev, next: c.next, slide: c.slide }} />
      </div>
    );
  },

  values(p, ctx) {
    const { t, img } = makeT(ctx);
    const items = list(p.items).map((v) => ({ icon: str(v.icon), title: t(v.title), body: t(v.body), image: img(v.image) ?? { src: "", alt: "" } }));
    return (
      <div className="block-pad container-page">
        {heading(p, ctx)}
        {items.length > 0 && (
          <div className={hasHeading(p, ctx) ? "mt-12" : ""}>
            <ValuesShowcase items={items} autoplay={num(p.autoplay, 4)} />
          </div>
        )}
      </div>
    );
  },

  process(p, ctx) {
    const { t, img } = makeT(ctx);
    const steps = list(p.steps).map((s) => ({ icon: str(s.icon), title: t(s.title), body: t(s.body), image: img(s.image) ?? { src: "", alt: "" } }));
    return (
      <div className="block-pad container-page">
        {heading(p, ctx)}
        {steps.length > 0 && (
          <div className={hasHeading(p, ctx) ? "mt-10" : ""}>
            <ProcessTabs steps={steps} autoplay={num(p.autoplay, 1.5)} stepLabel={ctx.ui.common.step} location={t(p.location)} />
          </div>
        )}
      </div>
    );
  },

  stats(p, ctx) {
    const { t } = makeT(ctx);
    const stats = list(p.items).map((s) => ({ value: withGrades(str(s.value), ctx.content), label: t(s.label) }));
    return (
      <div className="block-pad container-page">
        <StatCards stats={stats} />
      </div>
    );
  },

  retail(p, ctx) {
    const { t, href } = makeT(ctx);
    const tone = toneOf({ id: "", type: "retail", props: p }) as Tone;
    const items = ctx.content.retailPacks.map((r) => toShopItem(r, ctx.locale));
    // Nut photos at both edges, beside a centred heading (on unless switched off in Studio).
    const decor = p.decor !== false;
    return (
      <div className="block-pad relative overflow-x-clip">
        {decor && (
          <>
            <img
              src="/images/bg/home_coll_1_banner.webp"
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute top-6 left-0 hidden w-[clamp(10rem,16vw,16rem)] -translate-x-1/4 -rotate-6 select-none motion-safe:animate-[decor-float_9s_ease-in-out_infinite] lg:block"
            />
            <img
              src="/images/bg/home_coll_2_banner.webp"
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute top-2 right-0 hidden w-[clamp(11rem,18vw,18rem)] translate-x-1/4 select-none motion-safe:animate-[decor-float_11s_ease-in-out_-4s_infinite] lg:block"
            />
          </>
        )}
        <div className="container-page relative">
          {decor ? <SectionHeading eyebrow={t(p.eyebrow)} title={t(p.title)} accent={t(p.accent)} lead={t(p.lead)} tone={tone} align="center" /> : heading(p, ctx, tone)}
          {items.length > 0 && (
            <div className={hasHeading(p, ctx) ? "mt-12" : ""}>
              <ProductGrid items={items} />
            </div>
          )}
          {t(p.buttonLabel) && str(p.buttonHref) && (
            <div data-reveal className={`mt-10 ${decor ? "text-center" : ""}`}>
              <Button href={href(p.buttonHref)} variant={tone === "dark" ? "lime" : "dark"}>
                {t(p.buttonLabel)}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },

  productCards(p, ctx) {
    const { t, img } = makeT(ctx);
    const cards = ctx.content.products.map((pr) => ({
      href: localHref(`/products/${pr.slug}`, ctx.locale),
      name: t(pr.name),
      latin: pr.latin,
      short: t(pr.short),
      image: img(pr.image),
      grades: pr.grades.map((g) => g.code),
      cta: t(p.ctaLabel) || ctx.ui.common.viewProduct,
    }));
    return (
      <div className="block-pad container-page">
        {heading(p, ctx)}
        <div className={`grid gap-4 md:grid-cols-2 ${hasHeading(p, ctx) ? "mt-12" : ""}`}>
          {cards.map((c, i) => (
            <ProductCard key={i} card={c} />
          ))}
        </div>
      </div>
    );
  },

  partners(p, ctx) {
    const { t, href } = makeT(ctx);
    const join = t(p.joinLabel) ? { label: t(p.joinLabel), href: href(p.joinHref) || localHref("/contact", ctx.locale) } : undefined;
    return (
      <div className="block-pad container-page">
        {heading(p, ctx)}
        <div className={hasHeading(p, ctx) ? "mt-12" : ""}>
          <LogoWall partners={ctx.content.partners} join={join} />
        </div>
      </div>
    );
  },

  faq(p, ctx, section) {
    const { t } = makeT(ctx);
    const items = list(p.items).map((f) => ({ icon: "message-question", title: t(f.q), body: t(f.a) }));
    const half = Math.ceil(items.length / 2);
    return (
      <div className="block-pad container-page">
        {heading(p, ctx)}
        <div className={`grid gap-x-4 lg:grid-cols-2 ${hasHeading(p, ctx) ? "mt-12" : ""}`}>
          <AccordionCards name={`faq-a-${section.id}`} items={items.slice(0, half)} />
          <div className="mt-2.5 lg:mt-0">
            <AccordionCards name={`faq-b-${section.id}`} items={items.slice(half)} openFirst={false} />
          </div>
        </div>
      </div>
    );
  },

  cta(p, ctx) {
    const { t, img, href } = makeT(ctx);
    return (
      <div className="container-page py-16 sm:py-24">
        <div data-reveal="clip" className="relative isolate overflow-hidden rounded-3xl bg-forest-900 px-6 py-14 sm:px-12 sm:py-20">
          <CmsImg image={img(p.image)} decorative parallax className="absolute inset-0 -z-10 size-full" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
          <div data-reveal className="max-w-xl">
            <Title title={t(p.title)} accent={t(p.accent)} className="text-4xl text-white sm:text-5xl" />
            {t(p.lead) && <p className="mt-5 text-sm leading-relaxed text-white/85 sm:text-base">{t(p.lead)}</p>}
            {t(p.buttonLabel) && str(p.buttonHref) && (
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={href(p.buttonHref)}>{t(p.buttonLabel)}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },

  story(p, ctx) {
    const { t, img } = makeT(ctx);
    return (
      <div className="block-pad container-page grid gap-10 lg:grid-cols-12 lg:items-center">
        <div data-reveal className="lg:col-span-6">
          {t(p.tag) && <Tag>{t(p.tag)}</Tag>}
          <div className="mt-6 space-y-5">
            {t(p.lead) && <p className="heading text-2xl text-forest-900 sm:text-3xl">{t(p.lead)}</p>}
            <Paragraphs text={t(p.body)} className="text-base leading-relaxed text-ink-600" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-6">
          <div data-reveal="clip" className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <CmsImg image={img(p.imageA)} parallax sizes={SIZES.thumb} className="absolute inset-0 size-full" />
          </div>
          <div data-reveal="clip" className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl">
            <CmsImg image={img(p.imageB)} parallax sizes={SIZES.thumb} className="absolute inset-0 size-full" />
          </div>
        </div>
      </div>
    );
  },

  pillars(p, ctx) {
    const { t } = makeT(ctx);
    const tone = toneOf({ id: "", type: "pillars", props: p }) as Tone;
    const items = list(p.items);
    const cols = items.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
    return (
      <div className="block-pad container-page">
        {heading(p, ctx, tone)}
        <ul className={`grid gap-3 ${cols} ${hasHeading(p, ctx) ? "mt-12" : ""}`}>
          {items.map((it, i) => (
            <li key={i} data-reveal className={`rounded-2xl p-7 ${tone === "dark" ? "bg-white/5" : tone === "muted" ? "bg-white" : "bg-mist-50"}`}>
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-lime-300 text-forest-950">
                <CmsIcon name={str(it.icon)} className="size-5" />
              </span>
              <h3 className={`heading mt-8 text-2xl ${tone === "dark" ? "text-white" : "text-forest-900"}`}>{t(it.title)}</h3>
              <p className={`mt-3 text-sm leading-relaxed whitespace-pre-line ${tone === "dark" ? "text-white/70" : "text-ink-600"}`}>{t(it.body)}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  },

  accordionImage(p, ctx, section) {
    const { t, img } = makeT(ctx);
    const items = list(p.items).map((it) => ({ icon: str(it.icon), title: t(it.title), body: t(it.body) }));
    return (
      <div className="block-pad container-page grid gap-4 lg:grid-cols-2">
        <div>
          {hasHeading(p, ctx) && (
            <div data-reveal className="mb-10">
              {t(p.eyebrow) && <Tag>{t(p.eyebrow)}</Tag>}
              <Title title={t(p.title)} accent={t(p.accent)} className="mt-4 text-4xl text-forest-900 sm:text-5xl" />
              {t(p.lead) && <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-600">{t(p.lead)}</p>}
            </div>
          )}
          <AccordionCards name={`acc-${section.id}`} items={items} />
        </div>
        <div data-reveal="clip" className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto">
          <CmsImg image={img(p.image)} parallax sizes={SIZES.half} className="absolute inset-0 size-full" />
        </div>
      </div>
    );
  },

  checklist(p, ctx) {
    const { t } = makeT(ctx);
    return (
      <div className="block-pad container-page grid gap-10 lg:grid-cols-2">
        <div data-reveal>
          {t(p.eyebrow) && <Tag>{t(p.eyebrow)}</Tag>}
          <Title title={t(p.title)} accent={t(p.accent)} className="mt-4 text-4xl text-forest-900 sm:text-5xl" />
          {t(p.lead) && <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-600">{t(p.lead)}</p>}
        </div>
        <ul className="space-y-2.5">
          {list(p.items).map((it, i) => (
            <li key={i} data-reveal className="flex items-center gap-3 rounded-2xl bg-mist-50 p-2 pr-5 text-sm text-ink-900">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-forest-600">
                <CmsIcon name="file-check" className="size-[18px]" />
              </span>
              {t(it.text)}
            </li>
          ))}
        </ul>
      </div>
    );
  },

  contact(p, ctx) {
    const s = ctx.content.settings;
    const ui = ctx.ui;
    const info = [
      { icon: Phone, label: ui.contactInfo.phone, value: s.phone, href: `tel:${s.phoneE164}` },
      { icon: Mail, label: ui.contactInfo.email, value: s.email, href: `mailto:${s.email}` },
      { icon: Globe, label: ui.contactInfo.website, value: s.url.replace(/^https?:\/\//, ""), href: s.url },
      ...s.offices.map((o) => ({ icon: MapPin, label: pick(o.label, ctx.locale), value: pick(o.address, ctx.locale), href: undefined as string | undefined })),
    ].filter((i) => i.value);
    const showForm = p.showForm !== false;
    return (
      <div className={`block-pad container-page grid gap-4 ${showForm ? "lg:grid-cols-12" : ""}`}>
        <ul className={`space-y-2.5 ${showForm ? "lg:col-span-4" : "grid gap-2.5 space-y-0 sm:grid-cols-2"}`}>
          <li data-reveal className="rounded-2xl bg-forest-900 p-5 text-white">
            <p className="text-xs text-white/60">{ui.footer.brandOf}</p>
            <p className="mt-1 text-sm font-semibold tracking-wide uppercase">{s.legalName}</p>
          </li>
          {info.map(({ icon: Icon, label, value, href }, i) => (
            <li key={i} data-reveal className="flex items-center gap-3 rounded-2xl bg-mist-50 p-2 pr-5">
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
        {showForm && (
          <div data-reveal className="rounded-3xl bg-mist-50 p-6 sm:p-10 lg:col-span-8">
            <InquiryForm t={ui.form} />
          </div>
        )}
      </div>
    );
  },

  textBlock(p, ctx) {
    const { t } = makeT(ctx);
    const tone = toneOf({ id: "", type: "textBlock", props: p }) as Tone;
    const center = str(p.align) === "center";
    return (
      <div className={`block-pad container-page ${center ? "text-center" : ""}`}>
        <SectionHeading eyebrow={t(p.eyebrow)} title={t(p.title)} accent={t(p.accent)} lead={t(p.lead)} tone={tone} align={center ? "center" : "left"} />
        <div data-reveal className={`mt-8 max-w-3xl space-y-5 text-base leading-relaxed ${center ? "mx-auto" : ""} ${tone === "dark" ? "text-white/80" : "text-ink-600"}`}>
          <Paragraphs text={t(p.body)} />
        </div>
      </div>
    );
  },

  imageText(p, ctx) {
    const { t, img, href } = makeT(ctx);
    const tone = toneOf({ id: "", type: "imageText", props: p }) as Tone;
    const imageLeft = str(p.imageSide) === "left";
    const dark = tone === "dark";
    return (
      <div className="block-pad container-page grid gap-10 lg:grid-cols-2 lg:items-center">
        <div data-reveal="clip" className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${imageLeft ? "" : "lg:order-2"}`}>
          <CmsImg image={img(p.image)} parallax sizes={SIZES.half} className="absolute inset-0 size-full" />
        </div>
        <div data-reveal>
          {t(p.eyebrow) && <Tag tone={dark ? "glass" : "light"}>{t(p.eyebrow)}</Tag>}
          <Title title={t(p.title)} accent={t(p.accent)} className={`mt-4 text-4xl sm:text-5xl ${dark ? "text-white" : "text-forest-900"}`} />
          {t(p.lead) && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/85" : "text-ink-900"}`}>{t(p.lead)}</p>}
          <div className={`mt-5 space-y-4 text-sm leading-relaxed ${dark ? "text-white/70" : "text-ink-600"}`}>
            <Paragraphs text={t(p.body)} />
          </div>
          {t(p.buttonLabel) && str(p.buttonHref) && (
            <div className="mt-8">
              <Button href={href(p.buttonHref)}>{t(p.buttonLabel)}</Button>
            </div>
          )}
        </div>
      </div>
    );
  },

  posts(p, ctx) {
    const { t, href } = makeT(ctx);
    const tone = toneOf({ id: "", type: "posts", props: p }) as Tone;
    const limit = num(p.limit, 0);
    const posts = limit ? (ctx.posts ?? []).slice(0, limit) : (ctx.posts ?? []);
    const labels = { readMore: ctx.ui.news.readMore, minutes: ctx.ui.news.minutes };
    // A "latest news" strip disappears until there is something to show; the
    // full list (limit 0, the News page) says so instead.
    if (posts.length === 0 && limit) return null;
    const [first, ...rest] = p.featured === true ? posts : [undefined, ...posts];
    return (
      <div className="block-pad container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          {heading(p, ctx, tone)}
          {t(p.buttonLabel) && str(p.buttonHref) && <Button href={href(p.buttonHref)} variant={tone === "dark" ? "lime" : "dark"}>{t(p.buttonLabel)}</Button>}
        </div>
        <div className={`space-y-4 ${hasHeading(p, ctx) || t(p.buttonLabel) ? "mt-12" : ""}`}>
          {posts.length === 0 && <p className={`rounded-3xl px-6 py-16 text-center text-ink-600 ${tone === "white" ? "bg-mist-50" : "bg-white"}`}>{ctx.ui.news.empty}</p>}
          {first && <FeaturedPost post={first} locale={ctx.locale} labels={labels} />}
          {rest.length > 0 && <PostGrid posts={rest as Post[]} locale={ctx.locale} labels={labels} onMuted={tone !== "white"} />}
        </div>
      </div>
    );
  },

  gallery(p, ctx) {
    const { img } = makeT(ctx);
    const tone = toneOf({ id: "", type: "gallery", props: p }) as Tone;
    const cols = { "2": "sm:grid-cols-2", "3": "sm:grid-cols-2 lg:grid-cols-3", "4": "sm:grid-cols-2 lg:grid-cols-4" }[str(p.columns)] ?? "sm:grid-cols-2 lg:grid-cols-3";
    return (
      <div className="block-pad container-page">
        {heading(p, ctx, tone)}
        <ul className={`grid gap-3 ${cols} ${hasHeading(p, ctx) ? "mt-12" : ""}`}>
          {list(p.images).map((it, i) => (
            <li key={i} data-reveal="clip" className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <CmsImg image={img(it.image)} sizes={SIZES.third} className="absolute inset-0 size-full transition duration-700 hover:scale-105" />
            </li>
          ))}
        </ul>
      </div>
    );
  },
};

/** Renders a page's visible sections in order. Preview mode tags each one for click-to-edit. */
export function RenderSections({ sections, ctx, preview = false }: { sections: Section[]; ctx: BlockCtx; preview?: boolean }) {
  return (
    <>
      {sections
        .filter((s) => !s.hidden)
        .map((s) => {
          const render = renderers[s.type];
          if (!render) return null;
          const tone = toneOf(s);
          return (
            <section
              key={s.id}
              id={`s-${s.id}`}
              data-cms-section={preview ? s.id : undefined}
              data-type={s.type}
              data-tone={tone}
              className={tone === "none" ? "" : toneBg[tone]}
            >
              {render(s.props ?? {}, ctx, s)}
            </section>
          );
        })}
    </>
  );
}
