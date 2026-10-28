// The content the site ships with. Used until something is saved in the CMS, and
// as the base new fields fall back to. Built from the original hand-written
// sources (lib/content/*, products, retail, partners, images, site) so nothing
// is typed twice.
import { en } from "../content/en";
import { vi } from "../content/vi";
import { ja } from "../content/ja";
import { ko } from "../content/ko";
import { zh } from "../content/zh";
import { images, type ImageKey } from "../images";
import { partners } from "../partners";
import { policies, UPDATED as POLICIES_UPDATED } from "../content/policies";
import { products } from "../products";
import { packers, priceListIds, retailFacts, retailPacks, tempPrices } from "../retail";
import { site } from "../site";
import { emptyL, locales, type Locale } from "../locales";
import { emptyMenuStyle, emptyPageStyle } from "./theme";
import type { CmsImage, L, MenuItem, Page, PageId, PostCategory, Section, SiteContent, UiStrings } from "./types";

type Dict = typeof vi;

/** Every site language's dictionary (lib/content/*). */
const dicts: Record<Locale, Dict> = { vi, en: en as Dict, zh: zh as Dict, ja: ja as Dict, ko: ko as Dict };
const tr = (get: (d: Dict) => string): L => Object.fromEntries(locales.map((l) => [l, get(dicts[l])])) as L;
const blank = (): L => emptyL();
const pic = (key: ImageKey): CmsImage => ({ src: images[key].src, alt: { ...images[key].alt } });
const section = (id: string, type: string, props: Record<string, unknown>): Section => ({ id, type, props });

/** eyebrow/title/accent/lead for a dictionary block that has them. */
function heading(get: (d: Dict) => { eyebrow?: string; title: string; accent?: string; lead?: string }) {
  return {
    eyebrow: tr((d) => get(d).eyebrow ?? ""),
    title: tr((d) => get(d).title),
    accent: tr((d) => get(d).accent ?? ""),
    lead: tr((d) => get(d).lead ?? ""),
  };
}

const heroSlides: { image: ImageKey; href: string }[] = [
  { image: "highlands", href: "/products" },
  { image: "cashew", href: "/products/cashew" },
  { image: "macadamia", href: "/products/macadamia" },
  { image: "birdNest", href: "/products/bird-nest" },
  { image: "shipping", href: "/contact" },
];
const statementPills: ImageKey[] = ["birdNest", "cashewHarvest", "macadamiaTree", "cashewKernels"];
const valueIcons = ["badge-check", "leaf", "handshake", "globe", "factory", "sprout"];
// Only photos of VSAP's own lines (cashew, macadamia, bird's nest) and their regions: no rice or coffee.
const valuePhotos: ImageKey[] = ["cashewKernels", "cashewTreeSky", "highlands", "shipping", "cashewProcessing", "cashewGrove"];
const stepIcons = ["sprout", "wheat", "factory", "scan-search", "package-check", "ship"];
const stepPhotos: ImageKey[] = ["cashewGrove", "cashewHarvest", "cashewProcessing", "qualityInspection", "cashewRoasted", "shipping"];

const valuesSection = (id: string) =>
  section(id, "values", {
    ...heading((d) => d.home.values),
    autoplay: 4,
    items: vi.values.map((_, i) => ({
      icon: valueIcons[i % valueIcons.length],
      title: tr((d) => d.values[i].title),
      body: tr((d) => d.values[i].body),
      image: pic(valuePhotos[i % valuePhotos.length]),
    })),
  });

const processSection = (id: string) =>
  section(id, "process", {
    ...heading((d) => d.home.process),
    autoplay: 1.5,
    location: tr((d) => d.home.process.location),
    steps: vi.process.map((_, i) => ({
      icon: stepIcons[i % stepIcons.length],
      title: tr((d) => d.process[i].title),
      body: tr((d) => d.process[i].body),
      image: pic(stepPhotos[i % stepPhotos.length]),
    })),
  });

const ctaSection = (id: string) =>
  section(id, "cta", {
    title: tr((d) => d.home.cta.title),
    accent: tr((d) => d.home.cta.accent),
    lead: tr((d) => d.home.cta.lead),
    buttonLabel: tr((d) => d.home.cta.button),
    buttonHref: "/contact",
    image: pic("cashewGrove"),
  });

const retailSection = (id: string) =>
  section(id, "retail", {
    ...heading((d) => d.home.retail),
    buttonLabel: tr((d) => d.common.allProducts),
    buttonHref: "/products",
    tone: "muted",
  });

const pageHero = (id: string, get: (d: Dict) => { eyebrow: string; title: string; accent: string; lead: string }, image: ImageKey) =>
  section(id, "pageHero", { ...heading(get), image: pic(image) });

const pages: Record<PageId, Omit<Page, "style">> = {
  home: {
    label: "Trang chủ",
    path: "",
    seo: { title: tr((d) => d.meta.title), description: tr((d) => d.meta.description), image: "", noindex: false },
    sections: [
      section("home-hero", "hero", {
        slides: vi.home.hero.slides.map((_, i) => ({
          label: tr((d) => d.home.hero.slides[i].label),
          eyebrow: tr((d) => d.home.hero.slides[i].eyebrow),
          title: tr((d) => d.home.hero.slides[i].title),
          accent: tr((d) => d.home.hero.slides[i].accent),
          lead: tr((d) => d.home.hero.slides[i].lead),
          image: pic(heroSlides[i].image),
          buttonLabel: tr((d) => d.home.hero.slides[i].cta),
          buttonHref: heroSlides[i].href,
          secondaryLabel: heroSlides[i].href === "/contact" ? blank() : tr((d) => d.home.hero.secondaryCta),
          secondaryHref: "/contact",
        })),
        autoplay: 7,
        scrollLabel: tr((d) => d.home.hero.scroll),
        rankValue: "No.1",
        rankLabel: tr((d) => d.home.hero.rank),
        proofLabel: tr((d) => d.home.hero.grades),
        proofImages: (["cashew", "macadamia", "cashewKernels"] as ImageKey[]).map((k) => ({ image: pic(k) })),
      }),
      retailSection("home-retail"),
      section("home-strip", "strip", {
        lead: tr((d) => d.home.strip.lead),
        strong: tr((d) => d.home.strip.strong),
        codes: ["W180", "W240", "W320", "Style 0", "NIS 22+"].map((code) => ({ code })),
      }),
      section("home-statement", "statement", {
        eyebrow: tr((d) => d.home.statement.eyebrow),
        hold: 3.5,
        items: vi.home.statement.items.map((_, i) => ({
          strong: tr((d) => d.home.statement.items[i].strong),
          muted: tr((d) => d.home.statement.items[i].muted),
          tail: tr((d) => d.home.statement.items[i].tail),
          image: pic(statementPills[i % statementPills.length]),
        })),
      }),
      valuesSection("home-values"),
      processSection("home-process"),
      section("home-stats", "stats", {
        items: vi.home.intro.stats.map((s, i) => ({ value: s.value, label: tr((d) => d.home.intro.stats[i].label) })),
      }),
      section("home-partners", "partners", {
        ...heading((d) => d.home.partners),
        joinLabel: tr((d) => d.home.partners.join.cta),
        joinHref: "/contact",
      }),
      section("home-news", "posts", {
        eyebrow: tr((d) => d.news.latestEyebrow),
        title: tr((d) => d.news.latestTitle),
        accent: tr((d) => d.news.latestAccent),
        lead: blank(),
        channel: "all",
        limit: 3,
        featured: false,
        buttonLabel: tr((d) => d.news.all),
        buttonHref: "/news",
        tone: "muted",
      }),
      section("home-faq", "faq", {
        ...heading((d) => d.home.faq),
        items: vi.home.faq.items.map((_, i) => ({ q: tr((d) => d.home.faq.items[i].q), a: tr((d) => d.home.faq.items[i].a) })),
      }),
      ctaSection("home-cta"),
    ],
  },
  about: {
    label: "Về VSAP",
    path: "/about",
    seo: { title: tr((d) => d.about.metaTitle), description: tr((d) => d.about.metaDescription), image: "", noindex: false },
    sections: [
      pageHero("about-hero", (d) => d.about, "farmerHoe"),
      section("about-story", "story", {
        tag: tr((d) => d.about.story.title),
        lead: tr((d) => d.about.story.paragraphs[0]),
        body: tr((d) => d.about.story.paragraphs.slice(1).join("\n\n")),
        imageA: pic("cashewHarvest"),
        imageB: pic("macadamiaTree"),
        tone: "muted",
      }),
      section("about-pillars", "pillars", {
        eyebrow: blank(),
        title: blank(),
        accent: blank(),
        lead: blank(),
        tone: "white",
        items: (["mission", "vision", "slogan"] as const).map((k, i) => ({
          icon: ["target", "compass", "heart"][i],
          title: tr((d) => d.about[k].title),
          body: tr((d) => d.about[k].body),
        })),
      }),
      valuesSection("about-values"),
      ctaSection("about-cta"),
    ],
  },
  products: {
    label: "Sản phẩm",
    path: "/products",
    seo: { title: tr((d) => d.productsPage.metaTitle), description: tr((d) => d.productsPage.metaDescription), image: "", noindex: false },
    sections: [
      pageHero("products-hero", (d) => d.productsPage, "cashewTreeSky"),
      section("products-groups", "productGroups", {
        eyebrow: blank(),
        title: blank(),
        accent: blank(),
        lead: blank(),
        groupLabel: tr((d) => d.common.viewProduct),
        showEmpty: true,
        tone: "white",
      }),
      ctaSection("products-cta"),
    ],
  },
  quality: {
    label: "Chất lượng",
    path: "/quality",
    seo: { title: tr((d) => d.quality.metaTitle), description: tr((d) => d.quality.metaDescription), image: "", noindex: false },
    sections: [
      pageHero("quality-hero", (d) => d.quality, "qualityInspection"),
      processSection("quality-process"),
      section("quality-controls", "accordionImage", {
        eyebrow: tr((d) => d.quality.eyebrow),
        title: tr((d) => d.quality.controlsTitle),
        accent: blank(),
        lead: blank(),
        items: vi.quality.controls.map((_, i) => ({
          icon: ["qr-code", "scan-eye", "flask", "shield-check"][i % 4],
          title: tr((d) => d.quality.controls[i].title),
          body: tr((d) => d.quality.controls[i].body),
        })),
        image: pic("cashewKernels"),
        tone: "muted",
      }),
      section("quality-documents", "checklist", {
        eyebrow: blank(),
        title: tr((d) => d.quality.documentsTitle),
        accent: blank(),
        lead: tr((d) => d.quality.documentsLead),
        items: vi.quality.documents.map((_, i) => ({ text: tr((d) => d.quality.documents[i]) })),
        tone: "white",
      }),
      ctaSection("quality-cta"),
    ],
  },
  news: {
    label: "Tin tức",
    path: "/news",
    seo: { title: tr((d) => d.news.metaTitle), description: tr((d) => d.news.metaDescription), image: "", noindex: false },
    sections: [
      pageHero("news-hero", (d) => d.news, "cashewHarvest"),
      section("news-list", "posts", {
        eyebrow: blank(),
        title: blank(),
        accent: blank(),
        lead: blank(),
        channel: "news",
        limit: 0,
        featured: true,
        buttonLabel: blank(),
        buttonHref: "",
        tone: "white",
      }),
      ctaSection("news-cta"),
    ],
  },
  health: {
    label: "Sức khỏe và đời sống",
    path: "/health",
    seo: { title: tr((d) => d.health.metaTitle), description: tr((d) => d.health.metaDescription), image: "", noindex: false },
    sections: [
      pageHero("health-hero", (d) => d.health, "macadamiaSpoon"),
      section("health-list", "posts", {
        eyebrow: blank(),
        title: blank(),
        accent: blank(),
        lead: blank(),
        channel: "health",
        limit: 0,
        featured: true,
        buttonLabel: blank(),
        buttonHref: "",
        tone: "white",
      }),
      ctaSection("health-cta"),
    ],
  },
  contact: {
    label: "Liên hệ",
    path: "/contact",
    seo: { title: tr((d) => d.contact.metaTitle), description: tr((d) => d.contact.metaDescription), image: "", noindex: false },
    sections: [pageHero("contact-hero", (d) => d.contact, "shipping"), section("contact-main", "contact", { showForm: true })],
  },
};

/** The header menu as it was before it became editable; Products lists the product groups. */
function defaultMenu(): MenuItem[] {
  const item = (href: string, get: (d: Dict) => string, auto: MenuItem["auto"] = "", wide = false): MenuItem => ({ label: tr(get), href, children: [], auto, wide });
  return [
    item("/", (d) => d.nav.home),
    item("/about", (d) => d.nav.about),
    item("/products", (d) => d.nav.products, "productGroups"),
    item("/quality", (d) => d.nav.quality),
    item("/health", (d) => d.nav.health, "", true),
    item("/news", (d) => d.nav.news),
    item("/contact", (d) => d.nav.contact),
  ];
}

/** The two channels posts had before categories became editable; their slugs keep the old URLs. */
function defaultCategories(): PostCategory[] {
  const category = (slug: string, get: (d: Dict) => { title: string; lead?: string }, name: (d: Dict) => string, image: ImageKey): PostCategory => ({
    slug,
    name: tr(name),
    intro: tr((d) => get(d).lead ?? ""),
    image: pic(image),
    seo: { title: blank(), description: blank() },
  });
  return [
    category("news", (d) => d.news, (d) => d.nav.news, "cashewHarvest"),
    category("health", (d) => d.health, (d) => d.nav.health, "macadamiaSpoon"),
  ];
}

/** Search titles for the seed products (the page heading stays the short product name). */
const productSeoTitles: Record<string, L> = {
  cashew: { vi: "Nhân hạt điều Việt Nam xuất khẩu W180–W450", en: "Vietnamese cashew kernels W180–W450 for export", zh: "越南出口腰果仁 W180–W450", ja: "ベトナム産輸出用カシューナッツ W180–W450", ko: "베트남 수출용 캐슈넛 W180–W450" },
  macadamia: { vi: "Hạt macca Tây Nguyên xuất khẩu", en: "Vietnamese macadamia nuts from the Central Highlands", zh: "越南西原出口夏威夷果", ja: "ベトナム中部高原産 輸出用マカダミアナッツ", ko: "베트남 중부 고원 수출용 마카다미아" },
  "bird-nest": { vi: "Yến sào Khánh Hòa: yến thô, yến tinh chế, yến chưng", en: "Khanh Hoa edible bird’s nest: raw, cleaned and ready-to-drink", zh: "越南庆和燕窝：毛燕、净燕、即食燕窝", ja: "カインホア産ツバメの巣：原巣・毛取り済み・ドリンク", ko: "카인호아 제비집: 원물·손질·음료" },
};

function ui(d: Dict): UiStrings {
  const { home } = d;
  return {
    nav: { ...d.nav },
    common: {
      viewProduct: d.common.viewProduct,
      requestQuote: d.common.requestQuote,
      prev: home.hero.prev,
      next: home.hero.next,
      pause: home.hero.pause,
      play: home.hero.play,
      slide: home.hero.slide,
      step: home.process.step,
      photo: home.retail.photo,
    },
    footer: {
      explore: d.footer.explore,
      products: d.footer.products,
      contact: d.footer.contact,
      rights: d.footer.rights,
      brandOf: d.footer.brandOf,
      taxId: d.footer.taxId,
      registered: d.footer.registered,
      representative: d.footer.representative,
      policies: d.footer.policies,
      policyUpdated: d.footer.policyUpdated,
    },
    chat: { ...d.chat },
    contactInfo: { ...d.contact.info },
    form: { ...d.contact.form, productOptions: { other: d.contact.form.productOptions.other } },
    productDetail: {
      ...d.productDetail,
      packsEyebrow: home.retail.eyebrow,
      packsTitle: home.retail.detailTitle,
      packsAccent: home.retail.detailAccent,
    },
    news: {
      readMore: d.news.readMore,
      back: d.news.back,
      published: d.news.published,
      minutes: d.news.minutes,
      more: d.news.more,
      empty: d.news.empty,
      ctaTitle: d.news.ctaTitle,
      ctaBody: d.news.ctaBody,
    },
    retail: {
      ingredients: home.retail.ingredients,
      nutrition: home.retail.nutrition,
      energy: home.retail.energy,
      fat: home.retail.fat,
      carbs: home.retail.carbs,
      protein: home.retail.protein,
      shelfLife: home.retail.shelfLife,
      serving: home.retail.serving,
      storage: home.retail.storage,
      packedBy: home.retail.packedBy,
    },
    shop: (({ from: _from, size: _size, required: _required, ...shop }) => shop)(d.shop),
  };
}

export function defaultContent(): SiteContent {
  return {
    schema: 1,
    settings: {
      name: site.name,
      legalName: site.legalName,
      legalNameEn: site.legalNameEn,
      taxId: site.taxId,
      registeredAt: site.registeredAt,
      representative: { name: site.representative.name, title: { ...site.representative.title } },
      tagline: site.tagline,
      url: site.url,
      email: site.email,
      phone: site.phone,
      phoneE164: site.phoneE164,
      zalo: site.zalo,
      whatsapp: site.whatsapp,
      offices: site.offices.map((o) => ({
        label: { ...o.label },
        address: { ...o.address },
        street: o.postal.streetAddress,
        locality: o.postal.addressLocality,
        region: o.postal.addressRegion,
      })),
      about: tr((d) => d.footer.about),
      seo: { title: tr((d) => d.meta.title), description: tr((d) => d.meta.description), image: images.highlands.src },
      social: [],
      verification: { google: "", bing: "" },
      analytics: { ga4: "" },
      productFrame: "/images/frames/khung-chinh-hang.svg",
    },
    ui: Object.fromEntries(locales.map((l) => [l, ui(dicts[l])])) as Record<Locale, UiStrings>,
    pages: Object.fromEntries(Object.entries(pages).map(([id, p]) => [id, { ...p, style: emptyPageStyle() }])) as Record<PageId, Page>,
    theme: { page: emptyPageStyle(), menu: emptyMenuStyle(), fonts: [] },
    menu: defaultMenu(),
    categories: defaultCategories(),
    products: products.map((p) => ({
      slug: p.slug,
      name: { ...p.name },
      latin: p.latin,
      short: { ...p.short },
      description: { ...p.description },
      origin: { ...p.origin },
      image: pic(p.image),
      gallery: p.gallery.map(pic),
      grades: p.grades.map((g) => ({ code: g.code, label: { ...g.label } })),
      packaging: p.packaging.vi.map((_, i) => ({ text: Object.fromEntries(locales.map((l) => [l, p.packaging[l][i] ?? ""])) as L })),
      specs: p.specs.map((s) => ({ label: { ...s.label }, value: s.value })),
      applications: p.applications.vi.map((_, i) => ({ text: Object.fromEntries(locales.map((l) => [l, p.applications[l][i] ?? ""])) as L })),
      seo: { title: { ...(productSeoTitles[p.slug] ?? blank()) }, description: blank() },
    })),
    retailPacks: retailPacks.map((r) => ({
      id: r.id,
      product: r.slug,
      name: { ...r.name },
      flavor: { ...r.flavor },
      pack: { ...r.pack },
      price: tempPrices[r.id] ?? null,
      oldPrice: null,
      soldOut: false,
      hidden: !priceListIds.has(r.id),
      description: r.description ? { ...blank(), ...r.description } : blank(),
      images: r.images.map((src) => ({ src })),
      ingredients: { ...r.ingredients },
      highlight: r.highlight ? { ...r.highlight } : blank(),
      shelfLife: { ...retailFacts.shelfLife },
      serving: r.slug === "macadamia" ? { ...retailFacts.serving } : blank(),
      storage: { ...retailFacts.storage },
      packer: packers[r.packer ?? r.slug].name,
      packerAddress: { ...packers[r.packer ?? r.slug].address },
      nutrition: r.nutrition ? { ...r.nutrition } : { energy: "", fat: "", carbs: "", protein: "" },
    })),
    partners: partners.map((p) => ({ name: p.name, logo: p.logo ?? "", url: p.url ?? "" })),
    policies: policies.map((p) => ({ slug: p.slug, title: { ...p.title }, body: { ...emptyL(), ...p.body }, updated: POLICIES_UPDATED })),
  };
}
