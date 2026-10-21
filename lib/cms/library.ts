// Images shipped with the site (public/images), offered in the admin's media picker
// next to the files uploaded to R2.
import { images } from "../images";

const packshots = [
  "macca-box-450-front",
  "macca-box-450-angle",
  "macca-box-450-back",
  "macca-inshell-250",
  "macca-inshell-500",
  "macca-inshell-250-back",
  "macca-kernel-250",
  "macca-kernel-500",
  "macca-kernel-250-back",
  "cashew-roasted-250",
  "cashew-roasted-500",
  "cashew-roasted-250-angle",
  "cashew-roasted-250-back",
];

export type LibraryImage = { src: string; label: string; alt: { vi: string; en: string } };

export const builtInImages: LibraryImage[] = [
  ...Object.values(images).map((i) => ({ src: i.src, label: i.alt.vi, alt: { ...i.alt } })),
  ...packshots.map((name) => ({ src: `/images/products/${name}.webp`, label: name.replace(/-/g, " "), alt: { vi: "", en: "" } })),
  { src: "/logo.svg", label: "Logo VSAP", alt: { vi: "Logo VSAP", en: "VSAP logo" } },
  { src: "/logo-light.svg", label: "Logo VSAP (nền tối)", alt: { vi: "Logo VSAP", en: "VSAP logo" } },
];
