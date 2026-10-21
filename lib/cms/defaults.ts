// The content the site ships with. Used until something is saved in the CMS, and
// as the base new fields fall back to. Built from the original hand-written
// sources (lib/content/*, products, retail, partners, images, site) so nothing
// is typed twice.
import { en } from "../content/en";
import { vi } from "../content/vi";
import { images, type ImageKey } from "../images";
import { partners } from "../partners";
import { products } from "../products";
import { packers, retailFacts, retailPacks } from "../retail";
import { site } from "../site";
import type { CmsImage, L, Page, PageId, Section, SiteContent, UiStrings } from "./types";

type Dict = typeof vi;

const tr = (get: (d: Dict) => string): L => ({ vi: get(vi), en: get(en as Dict) });
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
  { image: "shipping", href: "/contact" },
];
const statementPills: ImageKey[] = ["paddyWork", "cashewHarvest", "macadamiaTree", "cashewKernels"];
const valueIcons = ["badge-check", "leaf", "handshake", "globe", "factory", "sprout"];
const valuePhotos: ImageKey[] = ["cashewKernels", "farmerWatering", "paddyWork", "shipping", "cashewProcessing", "highlandFarmers"];
const stepIcons = ["sprout", "wheat", "factory", "scan-search", "package-check", "ship"];
const stepPhotos: ImageKey[] = ["cashewGrove", "cashewHarvest", "cashewProcessing", "cashewKernels", "cashewRoasted", "shipping"];

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

const pages: Record<PageId, Page> = {
  home: {
    label: "Trang chủ",
    path: "",
    seo: { title: tr((d) => d.meta.title), description: tr((d) => d.meta.description) },
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
          secondaryLabel: heroSlides[i].href === "/contact" ? { vi: "", en: "" } : tr((d) => d.home.hero.secondaryCta),
          secondaryHref: "/contact",
        })),
        autoplay: 7,
        scrollLabel: tr((d) => d.home.hero.scroll),
        rankValue: "No.1",
        rankLabel: tr((d) => d.home.hero.rank),
        proofLabel: tr((d) => d.home.hero.grades),
        proofImages: (["cashew", "macadamia", "cashewKernels"] as ImageKey[]).map((k) => ({ image: pic(k) })),
      }),
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
      retailSection("home-retail"),
      section("home-partners", "partners", {
        ...heading((d) => d.home.partners),
        joinLabel: tr((d) => d.home.partners.join.cta),
        joinHref: "/contact",
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
    seo: { title: tr((d) => d.about.metaTitle), description: tr((d) => d.about.metaDescription) },
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
        eyebrow: { vi: "", en: "" },
        title: { vi: "", en: "" },
        accent: { vi: "", en: "" },
        lead: { vi: "", en: "" },
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
    seo: { title: tr((d) => d.productsPage.metaTitle), description: tr((d) => d.productsPage.metaDescription) },
    sections: [
      pageHero("products-hero", (d) => d.productsPage, "cashewTreeSky"),
      section("products-cards", "productCards", {
        eyebrow: { vi: "", en: "" },
        title: { vi: "", en: "" },
        accent: { vi: "", en: "" },
        lead: { vi: "", en: "" },
        ctaLabel: tr((d) => d.common.viewProduct),
      }),
      retailSection("products-retail"),
      ctaSection("products-cta"),
    ],
  },
  quality: {
    label: "Chất lượng",
    path: "/quality",
    seo: { title: tr((d) => d.quality.metaTitle), description: tr((d) => d.quality.metaDescription) },
    sections: [
      pageHero("quality-hero", (d) => d.quality, "cashewProcessing"),
      processSection("quality-process"),
      section("quality-controls", "accordionImage", {
        eyebrow: tr((d) => d.quality.eyebrow),
        title: tr((d) => d.quality.controlsTitle),
        accent: { vi: "", en: "" },
        lead: { vi: "", en: "" },
        items: vi.quality.controls.map((_, i) => ({
          icon: ["qr-code", "scan-eye", "flask", "shield-check"][i % 4],
          title: tr((d) => d.quality.controls[i].title),
          body: tr((d) => d.quality.controls[i].body),
        })),
        image: pic("cashewKernels"),
        tone: "muted",
      }),
      section("quality-documents", "checklist", {
        eyebrow: { vi: "", en: "" },
        title: tr((d) => d.quality.documentsTitle),
        accent: { vi: "", en: "" },
        lead: tr((d) => d.quality.documentsLead),
        items: vi.quality.documents.map((_, i) => ({ text: tr((d) => d.quality.documents[i]) })),
        tone: "white",
      }),
      ctaSection("quality-cta"),
    ],
  },
  contact: {
    label: "Liên hệ",
    path: "/contact",
    seo: { title: tr((d) => d.contact.metaTitle), description: tr((d) => d.contact.metaDescription) },
    sections: [pageHero("contact-hero", (d) => d.contact, "shipping"), section("contact-main", "contact", { showForm: true })],
  },
};

function ui(d: Dict): UiStrings {
  const { home } = d;
  return {
    nav: { ...d.nav },
    common: {
      viewProduct: d.common.viewProduct,
      requestQuote: d.common.requestQuote,
      allProducts: d.common.allProducts,
      prev: home.hero.prev,
      next: home.hero.next,
      pause: home.hero.pause,
      play: home.hero.play,
      slide: home.hero.slide,
      step: home.process.step,
      photo: home.retail.photo,
    },
    footer: { explore: d.footer.explore, products: d.footer.products, contact: d.footer.contact, rights: d.footer.rights, brandOf: d.footer.brandOf },
    chat: { ...d.chat },
    contactInfo: { ...d.contact.info },
    form: { ...d.contact.form, productOptions: { ...d.contact.form.productOptions } },
    productDetail: {
      ...d.productDetail,
      packsEyebrow: home.retail.eyebrow,
      packsTitle: home.retail.detailTitle,
      packsAccent: home.retail.detailAccent,
    },
    retail: {
      sizes: home.retail.sizes,
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
      view: home.retail.view,
    },
  };
}

export function defaultContent(): SiteContent {
  return {
    schema: 1,
    settings: {
      name: site.name,
      legalName: site.legalName,
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
    },
    ui: { vi: ui(vi), en: ui(en as Dict) },
    pages,
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
      packaging: p.packaging.vi.map((text, i) => ({ text: { vi: text, en: p.packaging.en[i] ?? text } })),
      specs: p.specs.map((s) => ({ label: { ...s.label }, value: s.value })),
      applications: p.applications.vi.map((text, i) => ({ text: { vi: text, en: p.applications.en[i] ?? text } })),
    })),
    retailPacks: retailPacks.map((r) => ({
      id: r.id,
      product: r.slug,
      name: { ...r.name },
      flavor: { ...r.flavor },
      pack: { ...r.pack },
      weights: r.weights.join(", "),
      images: r.images.map((src) => ({ src })),
      ingredients: { ...r.ingredients },
      highlight: r.highlight ? { ...r.highlight } : { vi: "", en: "" },
      shelfLife: { ...retailFacts.shelfLife },
      serving: r.slug === "macadamia" ? { ...retailFacts.serving } : { vi: "", en: "" },
      storage: { ...retailFacts.storage },
      packer: packers[r.slug].name,
      packerAddress: { ...packers[r.slug].address },
      nutrition: r.nutrition ? { ...r.nutrition } : { energy: "", fat: "", carbs: "", protein: "" },
    })),
    partners: partners.map((p) => ({ name: p.name, logo: p.logo ?? "", url: p.url ?? "" })),
  };
}
