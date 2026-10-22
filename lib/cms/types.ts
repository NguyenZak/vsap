// Shape of everything the CMS can edit. One SiteContent document is stored as JSON
// (a draft and a published copy); the site renders entirely from it.
import type { Locale } from "../i18n";

/** A string in both site languages. */
export type L = Record<Locale, string>;

/** Image reference: a path under /images (built-in) or /media (uploaded to R2). */
export type CmsImage = { src: string; alt: L };

export type Office = { label: L; address: L; street: string; locality: string; region: string };

export type Settings = {
  name: string;
  legalName: string;
  /** Registered English name, shown instead of legalName on the non-Vietnamese pages. */
  legalNameEn: string;
  /** Mã số doanh nghiệp (also the tax code). */
  taxId: string;
  /** First registration date, YYYY-MM-DD. */
  registeredAt: string;
  /** Legal representative named on the business registration. */
  representative: { name: string; title: L };
  tagline: string;
  url: string;
  email: string;
  phone: string;
  phoneE164: string;
  zalo: string;
  whatsapp: string;
  offices: Office[];
  /** Short blurb under the footer logo. */
  about: L;
  /** Default SEO title/description and social share image. */
  seo: { title: L; description: L; image: string };
  /** Profiles linked from the footer and listed as sameAs for Google. */
  social: { name: string; url: string }[];
  /** Search engine ownership codes (content of the verification meta tag). */
  verification: { google: string; bing: string };
  /** Optional GA4 measurement ID (G-XXXXXXX); analytics loads only when set. */
  analytics: { ga4: string };
  /** Decorative overlay (transparent PNG) laid over every product card photo; empty = no frame. */
  productFrame: string;
};

/** Interface strings that are not part of any one section (nav, buttons, form labels…). */
export type UiStrings = {
  nav: { home: string; about: string; products: string; quality: string; news: string; health: string; contact: string; quote: string; menu: string; close: string };
  common: { viewProduct: string; requestQuote: string; allProducts: string; prev: string; next: string; pause: string; play: string; slide: string; step: string; photo: string };
  footer: { explore: string; products: string; contact: string; rights: string; brandOf: string; taxId: string; registered: string; representative: string; policies: string; policyUpdated: string };
  chat: { label: string; zalo: string; whatsapp: string; call: string; close: string };
  contactInfo: { email: string; phone: string; website: string };
  form: {
    name: string; company: string; email: string; phone: string; country: string; product: string;
    productOptions: { cashew: string; macadamia: string; birdNest: string; other: string };
    quantity: string; quantityPlaceholder: string; message: string; messagePlaceholder: string;
    submit: string; sending: string; success: string; error: string; required: string;
  };
  productDetail: {
    origin: string; grades: string; packaging: string; specs: string; applications: string; back: string;
    inquireTitle: string; inquireBody: string; specsNote: string; packsEyebrow: string; packsTitle: string; packsAccent: string;
  };
  news: { readMore: string; back: string; published: string; minutes: string; more: string; empty: string; ctaTitle: string; ctaBody: string; share: string };
  retail: {
    sizes: string; ingredients: string; nutrition: string; energy: string; fat: string; carbs: string; protein: string;
    shelfLife: string; serving: string; storage: string; packedBy: string; view: string;
  };
  /** Retail shop: product cards, quick view, product page, cart and checkout. */
  shop: {
    addToCart: string; buyNow: string; quickView: string; askPrice: string; contactPrice: string; from: string;
    inStock: string; soldOut: string; status: string; brand: string; size: string; quantity: string; price: string;
    description: string; showMore: string; showLess: string; related: string; recent: string; details: string;
    perk1: string; perk2: string; perk3: string; perk4: string;
    cart: string; cartEmpty: string; continueShopping: string; subtotal: string; shippingNote: string; checkout: string;
    remove: string; decrease: string; increase: string;
    checkoutTitle: string; checkoutLead: string; yourOrder: string; name: string; phone: string; email: string; address: string;
    note: string; notePlaceholder: string; payment: string; placeOrder: string; placing: string;
    successTitle: string; successBody: string; error: string; required: string;
    oldPrice: string;
    perk5: string; perk6: string; share: string; copyLink: string; copied: string;
    /** Checkout note; {terms} and {privacy} become links to those policies. */
    agree: string;
    province: string; ward: string; street: string; streetPlaceholder: string; selectProvince: string; selectWard: string;
  };
};

export type Section = {
  id: string;
  type: string;
  hidden?: boolean;
  // Shape depends on `type`; see lib/cms/registry.ts.
  props: Record<string, unknown>;
};

export type Page = {
  /** Shown in the admin only. */
  label: string;
  path: string;
  seo: { title: L; description: L; image: string; noindex: boolean };
  sections: Section[];
};

export type Product = {
  slug: string;
  name: L;
  latin: string;
  short: L;
  description: L;
  origin: L;
  image: CmsImage;
  gallery: CmsImage[];
  grades: { code: string; label: L }[];
  packaging: { text: L }[];
  specs: { label: L; value: string }[];
  applications: { text: L }[];
  /** Overrides for the product page's title/description in search results. */
  seo: { title: L; description: L };
};

export type RetailPack = {
  id: string;
  /** Product slug this pack belongs to. */
  product: string;
  name: L;
  flavor: L;
  pack: L;
  /** Retail price in VND; null = sold on request ("Liên hệ"), not through the cart. */
  price: number | null;
  /** Price before the discount (VND), shown struck through when higher than `price`; null = no discount. */
  oldPrice: number | null;
  /** Hides the buy buttons and shows "sold out". */
  soldOut: boolean;
  /** Kept in Studio but not shown or sold on the website. */
  hidden: boolean;
  /** Longer text for the pack's own page; blank lines start new paragraphs. */
  description: L;
  images: { src: string }[];
  ingredients: L;
  highlight: L;
  shelfLife: L;
  serving: L;
  storage: L;
  packer: string;
  packerAddress: L;
  /** Per 100 g; leave all empty to hide the nutrition table. */
  nutrition: { energy: string; fat: string; carbs: string; protein: string };
};

export type Partner = { name: string; logo: string; url: string };

/** A legal page (terms, privacy, payment, shipping, returns) at /[locale]/policies/[slug]. */
export type Policy = {
  slug: string;
  title: L;
  /** Markdown (lib/markdown.ts); {company} {taxId} {address} {phone} {email} {website} are filled from Settings. */
  body: L;
  /** Last updated, YYYY-MM-DD. */
  updated: string;
};

export type PageId = "home" | "about" | "products" | "quality" | "news" | "health" | "contact";

export type SiteContent = {
  schema: 1;
  settings: Settings;
  ui: Record<Locale, UiStrings>;
  pages: Record<PageId, Page>;
  products: Product[];
  retailPacks: RetailPack[];
  partners: Partner[];
  policies: Policy[];
};

/** A news post. Stored in its own D1 row (cms_posts), with a draft and a published copy. */
/** Where a post is listed and lives: Tin tức (/news/…) or Sức khỏe và đời sống (/health/…). */
export type PostChannel = "news" | "health";

export type Post = {
  slug: string;
  channel: PostChannel;
  title: L;
  excerpt: L;
  cover: CmsImage;
  /** Markdown subset, see lib/markdown.ts. */
  body: L;
  category: L;
  /** Display date, YYYY-MM-DD. A future date keeps a published post hidden until that day. */
  date: string;
  author: string;
  seo: { title: L; description: L };
};
