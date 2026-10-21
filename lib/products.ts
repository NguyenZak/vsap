import type { Locale } from "./i18n";
import type { ImageKey } from "./images";

type L<T = string> = Record<Locale, T>;

export type Product = {
  slug: "cashew" | "macadamia";
  name: L;
  latin: string;
  /** Main photo, then supporting shots for the detail page. */
  image: ImageKey;
  gallery: ImageKey[];
  short: L;
  description: L;
  origin: L;
  grades: { code: string; label: L }[];
  packaging: L<string[]>;
  specs: { label: L; value: string }[];
  applications: L<string[]>;
};

// TODO: rà soát lại vùng nguyên liệu, phân loại và chỉ tiêu theo hồ sơ sản phẩm thực tế của VSAP.
export const products: Product[] = [
  {
    slug: "cashew",
    name: { vi: "Hạt điều", en: "Cashew nuts" },
    latin: "Anacardium occidentale",
    image: "cashew",
    gallery: ["cashewApple", "cashewKernels", "cashewRoasted"],
    short: {
      vi: "Nhân điều trắng nguyên hạt và các phân loại vỡ, rang muối, theo tiêu chuẩn AFI.",
      en: "White whole and broken cashew kernels, plus roasted & salted, graded to AFI standards.",
    },
    description: {
      vi: "Hạt điều Việt Nam nổi tiếng với nhân trắng ngà, vị béo ngọt và độ giòn đặc trưng. VSAP cung cấp nhân điều sơ chế đóng gói xuất khẩu cùng hạt điều rang muối cho thị trường bán lẻ, phân loại theo tiêu chuẩn của Hiệp hội Công nghiệp Thực phẩm Hoa Kỳ (AFI).",
      en: "Vietnamese cashews are known for their ivory-white kernels, rich buttery taste and distinctive crunch. VSAP supplies export-packed raw kernels as well as roasted & salted cashews for retail, graded to the Association of Food Industries (AFI) specification.",
    },
    origin: {
      vi: "Bình Phước, Đồng Nai và các tỉnh Đông Nam Bộ – vùng điều lớn nhất Việt Nam.",
      en: "Binh Phuoc, Dong Nai and the South-East region – Vietnam’s largest cashew belt.",
    },
    grades: [
      { code: "W180", label: { vi: "Nguyên hạt trắng, 180 hạt/lb", en: "White wholes, 180 kernels/lb" } },
      { code: "W210", label: { vi: "Nguyên hạt trắng, 210 hạt/lb", en: "White wholes, 210 kernels/lb" } },
      { code: "W240", label: { vi: "Nguyên hạt trắng, 240 hạt/lb", en: "White wholes, 240 kernels/lb" } },
      { code: "W320", label: { vi: "Nguyên hạt trắng, 320 hạt/lb", en: "White wholes, 320 kernels/lb" } },
      { code: "W450", label: { vi: "Nguyên hạt trắng, 450 hạt/lb", en: "White wholes, 450 kernels/lb" } },
      { code: "WS / LP", label: { vi: "Vỡ đôi, mảnh lớn", en: "White splits, large pieces" } },
      { code: "RS", label: { vi: "Rang muối nguyên hạt", en: "Roasted & salted wholes" } },
    ],
    packaging: {
      vi: [
        "Túi hút chân không / nạp CO₂, 2 × 11,34 kg (50 lbs) mỗi thùng carton",
        "Thùng thiếc 2 × 11,34 kg theo yêu cầu",
        "Bao bì bán lẻ 250 g – 1 kg, in nhãn riêng (OEM)",
      ],
      en: [
        "Vacuum / CO₂-flushed bags, 2 × 11.34 kg (50 lbs) per carton",
        "Tins 2 × 11.34 kg on request",
        "Retail packs 250 g – 1 kg, private label (OEM)",
      ],
    },
    specs: [
      { label: { vi: "Độ ẩm", en: "Moisture" }, value: "≤ 5%" },
      { label: { vi: "Hạt vỡ", en: "Broken kernels" }, value: "≤ 5%" },
      { label: { vi: "Tạp chất", en: "Foreign matter" }, value: "0%" },
      { label: { vi: "Hạn sử dụng", en: "Shelf life" }, value: "12 – 24 m" },
    ],
    applications: {
      vi: ["Ăn vặt, bán lẻ", "Bánh kẹo, socola", "Sữa hạt, bơ hạt", "Nhà hàng, chế biến thực phẩm"],
      en: ["Snacking & retail", "Bakery & confectionery", "Nut milks & butters", "Food service & manufacturing"],
    },
  },
  {
    slug: "macadamia",
    name: { vi: "Hạt macca", en: "Macadamia nuts" },
    latin: "Macadamia integrifolia",
    image: "macadamia",
    gallery: ["macadamiaTree", "macadamiaSpoon"],
    short: {
      vi: "Macca nguyên vỏ sấy nứt và nhân macca theo các style quốc tế, béo thơm tự nhiên.",
      en: "Cracked in-shell macadamias and kernels in international styles, naturally rich and creamy.",
    },
    description: {
      vi: "Được trồng trên cao nguyên đất đỏ bazan, hạt macca Việt Nam có nhân to, màu kem sáng, vị béo bùi và thơm tự nhiên. VSAP cung cấp macca nguyên vỏ sấy nứt tiện dụng và nhân macca phân loại theo style quốc tế.",
      en: "Grown on the basalt highlands of Vietnam, Vietnamese macadamias have large, light-cream kernels with a rich, naturally aromatic flavour. VSAP supplies convenient cracked in-shell macadamias and kernels graded to international styles.",
    },
    origin: {
      vi: "Tây Nguyên, tập trung tại Đắk Lắk.",
      en: "The Central Highlands, centred on Dak Lak province.",
    },
    grades: [
      { code: "NIS 22+", label: { vi: "Nguyên vỏ sấy nứt, cỡ ≥ 22 mm", en: "Cracked in-shell, ≥ 22 mm" } },
      { code: "NIS 18–22", label: { vi: "Nguyên vỏ sấy nứt, cỡ 18–22 mm", en: "Cracked in-shell, 18–22 mm" } },
      { code: "Style 0", label: { vi: "Nhân nguyên hạt ≥ 20 mm", en: "Whole kernels ≥ 20 mm" } },
      { code: "Style 1", label: { vi: "Nhân nguyên hạt ≥ 17 mm", en: "Whole kernels ≥ 17 mm" } },
      { code: "Style 2", label: { vi: "Nhân nguyên & nửa hạt", en: "Wholes & halves mix" } },
      { code: "Style 4", label: { vi: "Nhân nửa hạt", en: "Halves" } },
    ],
    packaging: {
      vi: [
        "Nhân: túi bạc hút chân không / nạp N₂, 11,34 kg trong thùng carton",
        "Nguyên vỏ: bao lưới hoặc túi PE 10 – 25 kg",
        "Bao bì bán lẻ 250 g – 1 kg, in nhãn riêng (OEM)",
      ],
      en: [
        "Kernels: vacuum / N₂-flushed foil bags, 11.34 kg per carton",
        "In-shell: mesh or PE bags, 10 – 25 kg",
        "Retail packs 250 g – 1 kg, private label (OEM)",
      ],
    },
    specs: [
      { label: { vi: "Độ ẩm nhân", en: "Kernel moisture" }, value: "≤ 1.5%" },
      { label: { vi: "Độ ẩm nguyên vỏ", en: "In-shell moisture" }, value: "≤ 3.5%" },
      { label: { vi: "Tạp chất", en: "Foreign matter" }, value: "0%" },
      { label: { vi: "Hạn sử dụng", en: "Shelf life" }, value: "12 m" },
    ],
    applications: {
      vi: ["Quà tặng, bán lẻ cao cấp", "Bánh kẹo, kem", "Sữa hạt, dầu macca", "Granola, ngũ cốc"],
      en: ["Gifting & premium retail", "Confectionery & ice cream", "Nut milks & macadamia oil", "Granola & cereals"],
    },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

