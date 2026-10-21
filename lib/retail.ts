// Sản phẩm bán lẻ mang thương hiệu VSAP. Mọi thông tin chép từ thiết kế bao bì thật
// (ảnh ở public/images/products). Khi đổi bao bì, cập nhật lại cả ảnh và số liệu ở đây.
import type { Locale } from "./i18n";
import type { Product } from "./products";

type L<T = string> = Record<Locale, T>;

export type RetailPack = {
  id: string;
  /** Raw product this pack belongs to; links to /products/[slug]. */
  slug: Product["slug"];
  name: L;
  flavor: L;
  /** Kind of packaging, shown under the name. */
  pack: L;
  weights: string[];
  /** Front shot first, then other sides. Paths under /images/products. */
  images: string[];
  ingredients: L;
  /** Per 100 g, as printed on the label. Omitted when the label is not legible. */
  nutrition?: { energy: string; fat: string; carbs: string; protein: string };
  highlight?: L;
  /** Who packed it, when the label names someone other than the product's usual packer. */
  packer?: keyof typeof packers;
};

const img = (name: string) => `/images/products/${name}.webp`;

export const retailPacks: RetailPack[] = [
  {
    id: "macca-box",
    slug: "macadamia",
    name: { vi: "Hạt macca nứt vỏ", en: "Cracked in-shell macadamias" },
    flavor: { vi: "Vị nguyên bản", en: "Original" },
    pack: { vi: "Hộp giấy", en: "Gift box" },
    weights: ["450 g"],
    images: [img("macca-box-450-front"), img("macca-box-450-angle"), img("macca-box-450-back")],
    ingredients: { vi: "100% hạt macca", en: "100% macadamia nuts" },
    nutrition: { energy: "759 kcal", fat: "74 g", carbs: "14 g", protein: "9 g" },
    highlight: { vi: "100% hạt macca từ Tây Nguyên", en: "100% Central Highlands macadamias" },
  },
  {
    id: "macca-inshell-jar",
    slug: "macadamia",
    name: { vi: "Hạt macca nứt vỏ", en: "Cracked in-shell macadamias" },
    flavor: { vi: "Rang muối hồng Himalaya", en: "Himalayan pink salt roasted" },
    pack: { vi: "Hũ nhựa", en: "Jar" },
    weights: ["250 g", "500 g"],
    images: [img("macca-inshell-250"), img("macca-inshell-500"), img("macca-inshell-250-back")],
    ingredients: { vi: "98% hạt macca, 2% muối", en: "98% macadamia nuts, 2% salt" },
    nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" },
    highlight: { vi: "100% hạt macca từ Tây Nguyên", en: "100% Central Highlands macadamias" },
  },
  {
    id: "macca-kernel-jar",
    slug: "macadamia",
    name: { vi: "Nhân hạt macca", en: "Macadamia kernels" },
    flavor: { vi: "Đã tách vỏ", en: "Shelled" },
    pack: { vi: "Hũ nhựa", en: "Jar" },
    weights: ["250 g", "500 g"],
    images: [img("macca-kernel-250"), img("macca-kernel-500"), img("macca-kernel-250-back")],
    ingredients: { vi: "98% hạt macca, 2% muối", en: "98% macadamia nuts, 2% salt" },
    nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" },
  },
  {
    id: "cashew-hex",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews" },
    flavor: { vi: "Vị rang muối", en: "Roasted & salted" },
    pack: { vi: "Hộp giấy lục giác", en: "Hexagonal carton" },
    weights: ["160 g"],
    images: [img("cashew-hex-160-front"), img("cashew-hex-160-nutrition"), img("cashew-hex-160-info")],
    ingredients: { vi: "98% hạt điều, 2% muối", en: "98% cashews, 2% salt" },
    nutrition: { energy: "583 kcal", fat: "46,6 g", carbs: "20,5 g", protein: "20,3 g" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on" },
  },
  {
    id: "cashew-pouch",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews" },
    flavor: { vi: "", en: "" },
    pack: { vi: "Túi zip đáy đứng", en: "Stand-up zip pouch" },
    weights: ["250 g"],
    images: [img("cashew-pouch-250-front"), img("cashew-pouch-250-angle"), img("cashew-pouch-250-angle-2"), img("cashew-pouch-250-back")],
    ingredients: { vi: "99,9% hạt điều, 0,1% muối", en: "99.9% cashews, 0.1% salt" },
    nutrition: { energy: "617 kcal", fat: "47,7 g", carbs: "26,8 g", protein: "20,1 g" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on" },
    packer: "cashewDongPhu",
  },
  {
    id: "cashew-box",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews" },
    flavor: { vi: "Vị rang muối", en: "Roasted & salted" },
    pack: { vi: "Hộp giấy", en: "Gift box" },
    weights: ["450 g"],
    images: [img("cashew-box-450-front"), img("cashew-box-450-back-angle"), img("cashew-box-450-back")],
    ingredients: { vi: "98% hạt điều, 2% muối", en: "98% cashews, 2% salt" },
    nutrition: { energy: "583 kcal", fat: "46,6 g", carbs: "20,5 g", protein: "20,3 g" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on" },
  },
  {
    id: "cashew-tub",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews" },
    flavor: { vi: "Vị rang muối", en: "Roasted & salted" },
    pack: { vi: "Hộp nhựa", en: "Clear tub" },
    weights: ["500 g"],
    images: [img("cashew-tub-500-front"), img("cashew-tub-500-back")],
    ingredients: { vi: "98% hạt điều, 2% muối", en: "98% cashews, 2% salt" },
    nutrition: { energy: "583 kcal", fat: "46,6 g", carbs: "20,5 g", protein: "20,3 g" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on" },
  },
];

/** Label facts shared by every pack. */
export const retailFacts = {
  shelfLife: { vi: "12 tháng kể từ ngày sản xuất", en: "12 months from production date" },
  serving: { vi: "Khuyên dùng 10 – 15 hạt mỗi ngày", en: "Recommended 10 – 15 nuts a day" },
  storage: {
    vi: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Đóng kín sau mỗi lần dùng.",
    en: "Store in a cool, dry place away from direct sunlight. Keep sealed after each use.",
  },
  standard: "TCCS 04:2024/MACCA DAK LAK",
};

/** Contract packers printed on the labels. */
export const packers = {
  macadamia: {
    name: "Công ty TNHH Fine Farm",
    address: { vi: "02-D1 Buôn KoTam, phường Tân An, tỉnh Đắk Lắk", en: "02-D1 Buon KoTam, Tan An Ward, Dak Lak Province" },
  },
  cashew: {
    name: "Công ty TNHH MTV DV XNK Hoàng Khang",
    address: { vi: "Số 300, KP Phước Vĩnh, phường Phước Vĩnh, TP. Đồng Nai", en: "300 Phuoc Vinh Quarter, Phuoc Vinh Ward, Dong Nai" },
  },
  /** Printed as "Sản xuất tại" on the 250 g pouch. */
  cashewDongPhu: {
    name: "Chi nhánh Công ty TNHH Thực phẩm Đồng Phú",
    address: {
      vi: "Số 30 đường Nguyễn Chí Thanh, khu phố Phú Cường, phường Bình Phước, TP. Đồng Nai",
      en: "30 Nguyen Chi Thanh Street, Phu Cuong Quarter, Binh Phuoc Ward, Dong Nai",
    },
  },
} satisfies Record<Product["slug"] | "cashewDongPhu", { name: string; address: L }>;
