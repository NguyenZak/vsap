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
};

/** Interface strings that are not part of any one section (nav, buttons, form labels…). */
export type UiStrings = {
  nav: { home: string; about: string; products: string; quality: string; contact: string; quote: string; menu: string; close: string };
  common: { viewProduct: string; requestQuote: string; allProducts: string; prev: string; next: string; pause: string; play: string; slide: string; step: string; photo: string };
  footer: { explore: string; products: string; contact: string; rights: string; brandOf: string };
  chat: { label: string; zalo: string; whatsapp: string; call: string; close: string };
  contactInfo: { email: string; phone: string; website: string };
  form: {
    name: string; company: string; email: string; phone: string; country: string; product: string;
    productOptions: { cashew: string; macadamia: string; other: string };
    quantity: string; quantityPlaceholder: string; message: string; messagePlaceholder: string;
    submit: string; sending: string; success: string; error: string; required: string;
  };
  productDetail: {
    origin: string; grades: string; packaging: string; specs: string; applications: string; back: string;
    inquireTitle: string; inquireBody: string; specsNote: string; packsEyebrow: string; packsTitle: string; packsAccent: string;
  };
  retail: {
    sizes: string; ingredients: string; nutrition: string; energy: string; fat: string; carbs: string; protein: string;
    shelfLife: string; serving: string; storage: string; packedBy: string; view: string;
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
  weights: string;
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

export type PageId = "home" | "about" | "products" | "quality" | "contact";

export type SiteContent = {
  schema: 1;
  settings: Settings;
  ui: Record<Locale, UiStrings>;
  pages: Record<PageId, Page>;
  products: Product[];
  retailPacks: RetailPack[];
  partners: Partner[];
};
