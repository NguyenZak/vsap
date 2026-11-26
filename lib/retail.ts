// Sản phẩm bán lẻ mang thương hiệu VSAP. Mọi thông tin chép từ thiết kế bao bì thật
// (ảnh ở public/images/products). Khi đổi bao bì, cập nhật lại cả ảnh và số liệu ở đây.
import type { Locale } from "./i18n";
import type { Product } from "./products";

type L<T = string> = Record<Locale, T>;

export type RetailPack = {
  id: string;
  /** Raw product this pack belongs to; links to /products/[slug]. Seed packs exist for the nut lines only. */
  slug: Extract<Product["slug"], "cashew" | "macadamia">;
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
  /** Text for the product page (Vietnamese and English; the other languages show English). */
  description?: Pick<L, "vi" | "en">;
};

const img = (name: string) => `/images/products/${name}.webp`;

/** Cracked in-shell macadamia SKUs from VSAP's retail price list (bảng giá lẻ sản phẩm, 11/2026). */
type MaccaSku = {
  code: string;
  kind: "box" | "inshell";
  grams: number;
  grade: "A" | "B";
  /** Kernel size printed on the price list, when given. */
  size?: string;
  gift?: boolean;
  /** Optional custom highlight badge. */
  highlight?: L;
  /** Packing line and carton for the description. */
  packing: { vi: string; en: string };
  carton: { vi: string; en: string };
  images: string[];
  nutrition?: RetailPack["nutrition"];
  /** The printed label lists 98% macadamia, 2% salt (the price list says 100% macadamia). */
  salted?: boolean;
  /** Flavour printed on the label, when the same code comes in two. */
  taste?: "plain" | "salt";
  /** Page id when it differs from the code (two flavours share one price-list code). */
  id?: string;
};

const maccaSkuList: MaccaSku[] = [
  { code: "HV400", kind: "box", grams: 400, grade: "B", size: "H450: 22 – 24 mm ±1", gift: true, highlight: { vi: "Hàng cao cấp · Dùng làm quà tặng; đóng hộp quà", en: "Premium gift box · Made for gifting", zh: "高端礼盒 · 送礼佳品", ja: "高級ギフト · 贈り物に最適", ko: "프리미엄 선물용" }, packing: { vi: "Hộp giấy, kích thước 140 × 220 × 50 mm", en: "Paper box, 140 × 220 × 50 mm" }, carton: { vi: "40 – 80 hộp/thùng", en: "40 – 80 boxes per carton" }, images: [img("macca-hv400"), img("macca-box-450-angle"), img("macca-box-450-back")], nutrition: { energy: "759 kcal", fat: "74 g", carbs: "14 g", protein: "9 g" } },
  { code: "HV200", kind: "box", grams: 200, grade: "B", size: "HV250: 22 – 24 mm ±1", gift: true, salted: true, highlight: { vi: "Best choice! · Dùng làm quà tặng; đóng hộp quà", en: "Best choice! · Made for gifting", zh: "人气精选 · 送礼佳品", ja: "ベストチョイス · 贈り物に最適", ko: "베스트 초이스 · 선물용" }, packing: { vi: "Hộp giấy hình lục giác, kích thước 70 × 70 × 200 mm", en: "Hexagonal paper box, 70 × 70 × 200 mm" }, carton: { vi: "40 – 100 hộp/thùng", en: "40 – 100 boxes per carton" }, images: [img("macca-hv200"), img("macca-hex-250b-top"), img("macca-hex-250b-nutrition"), img("macca-hex-250b-info"), img("macca-hex-250b-back"), img("macca-hex-250b-left")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "HV160", kind: "box", grams: 160, grade: "B", size: "HV160: 22 – 24 mm ±1", gift: true, salted: true, highlight: { vi: "Chuyên dùng đóng hộp quà tặng", en: "Made for gift hampers", zh: "礼盒专用", ja: "ギフトボックス専用", ko: "선물 세트 전용" }, packing: { vi: "Hộp giấy hình lục giác", en: "Hexagonal paper box" }, carton: { vi: "40 – 120 hộp/thùng", en: "40 – 120 boxes per carton" }, images: [img("macca-hv160"), img("macca-hex-160b-top"), img("macca-hex-160b-nutrition"), img("macca-hex-160b-info"), img("macca-hex-160b-back"), img("macca-hex-160b-left")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "ZV450", taste: "plain", salted: true, kind: "inshell", grams: 450, grade: "B", size: "Z500B: 22 – 24 mm ±1", packing: { vi: "Túi zipper", en: "Zipper pouch" }, carton: { vi: "20 – 80 túi/thùng", en: "20 – 80 pouches per carton" }, images: [img("macca-zv450"), img("macca-zip-500b-right"), img("macca-zip-500b-left"), img("macca-zip-500b-top"), img("macca-zip-500b-back"), img("macca-zip-500b-back-angle")], nutrition: { energy: "759 kcal", fat: "74 g", carbs: "14 g", protein: "9 g" } },
  { code: "ZV250", taste: "plain", salted: true, kind: "inshell", grams: 250, grade: "B", size: "Z250: 22 – 24 mm ±1", packing: { vi: "Túi zipper", en: "Zipper pouch" }, carton: { vi: "40 – 120 túi/thùng", en: "40 – 120 pouches per carton" }, images: [img("macca-zv250"), img("macca-inshell-250-back")], nutrition: { energy: "759 kcal", fat: "74 g", carbs: "14 g", protein: "9 g" } },
  { code: "PV500B", taste: "plain", salted: true, kind: "inshell", grams: 500, grade: "B", size: "22 – 24 mm ±1", packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-pv500b"), img("macca-jar-500b-left"), img("macca-jar-500b-right"), img("macca-jar-500b-back")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "PV500B", id: "pv500b-rm", taste: "salt", salted: true, kind: "inshell", grams: 500, grade: "B", size: "22 – 24 mm ±1", packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-jar-500b-salt-front"), img("macca-jar-500b-salt-left"), img("macca-jar-500b-salt-right"), img("macca-jar-500b-salt-back")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "PV500A", taste: "plain", salted: true, kind: "inshell", grams: 500, grade: "A", size: "25 – 32 mm ±1", packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-pv500a"), img("macca-jar-500a-left"), img("macca-jar-500a-right"), img("macca-jar-500a-back")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "PV500A", id: "pv500a-rm", taste: "salt", salted: true, kind: "inshell", grams: 500, grade: "A", size: "25 – 32 mm ±1", packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-jar-500a-salt-front"), img("macca-jar-500a-salt-left"), img("macca-jar-500a-salt-right"), img("macca-jar-500a-salt-back")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "PV250A", taste: "plain", salted: true, kind: "inshell", grams: 250, grade: "A", size: "25 – 32 mm ±1", gift: true, highlight: { vi: "Chuyên dùng đóng hộp quà tặng", en: "Made for gift hampers", zh: "礼盒专用", ja: "ギフトボックス専用", ko: "선물 세트 전용" }, packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-pv250a"), img("macca-jar-250a-left"), img("macca-jar-250a-right"), img("macca-jar-250a-back")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "PV250A", id: "pv250a-rm", taste: "salt", salted: true, kind: "inshell", grams: 250, grade: "A", size: "25 – 32 mm ±1", gift: true, packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-jar-250a-salt-front"), img("macca-jar-250a-salt-left"), img("macca-jar-250a-salt-right"), img("macca-jar-250a-salt-back")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "PV250B", taste: "plain", salted: true, kind: "inshell", grams: 250, grade: "B", size: "22 – 24 mm ±1", gift: true, highlight: { vi: "Chuyên dùng đóng hộp quà tặng Tết", en: "Made for Tet gift hampers", zh: "春节礼盒专用", ja: "テトギフト専用", ko: "설 선물 세트 전용" }, packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-pv250b"), img("macca-jar-250b-left"), img("macca-jar-250b-right"), img("macca-jar-250b-back")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
  { code: "PV250B", id: "pv250b-rm", taste: "salt", salted: true, kind: "inshell", grams: 250, grade: "B", size: "22 – 24 mm ±1", gift: true, packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-jar-250b-salt-front"), img("macca-jar-250b-salt-left"), img("macca-jar-250b-salt-right"), img("macca-jar-250b-salt-back")], nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" } },
];

/** Wood-fire roasted salted cashew SKUs from VSAP's retail price list (bảng giá lẻ sản phẩm, 11/2026). */
type CashewSku = {
  id: string;
  code: string;
  grams: number;
  size: { vi: string; en: string };
  damaged?: string;
  packing: { vi: string; en: string; zh: string; ja: string; ko: string };
  carton: { vi: string; en: string };
  highlight?: L;
  images: string[];
};

const cashewSkuList: CashewSku[] = [
  {
    id: "dhv380-w180",
    code: "ĐHV380 – W180",
    grams: 450,
    size: { vi: "A cồ - W180 – tuyển chọn", en: "Jumbo A - W180 – selected" },
    damaged: "≤ 3%",
    packing: { vi: "Hộp giấy, kích thước 140 × 220 × 50 mm", en: "Paper box, 140 × 220 × 50 mm", zh: "纸盒装", ja: "紙箱", ko: "종이 상자" },
    carton: { vi: "40 – 80 hộp/thùng", en: "40 – 80 boxes per carton" },
    highlight: { vi: "Hàng cao cấp: biếu tặng", en: "Premium grade: made for gifting", zh: "高端送礼佳品", ja: "高級ギフト用", ko: "프리미엄 선물용" },
    images: [img("cashew-dhv380"), img("cashew-box-450-back-angle"), img("cashew-box-450-back")],
  },
  {
    id: "dhlgv205-w180",
    code: "ĐHLGV 205- W180",
    grams: 205,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hộp giấy hình lục giác, kích thước 70 × 70 × 200 mm", en: "Hexagonal paper box, 70 × 70 × 200 mm", zh: "六角纸盒装", ja: "六角形の紙箱", ko: "육각 종이 상자" },
    carton: { vi: "40 – 100 hộp/thùng", en: "40 – 100 boxes per carton" },
    highlight: { vi: "Dùng làm quà tặng; đóng hộp quà", en: "Made for gifting", zh: "送礼佳品", ja: "ギフトに最適", ko: "선물용" },
    images: [img("cashew-dhlgv205"), img("cashew-hex-160-nutrition"), img("cashew-hex-160-info")],
  },
  {
    id: "dhlgv150-w180",
    code: "ĐHLGV 150- W180",
    grams: 150,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hộp giấy hình lục giác, kích thước 70 × 70 × 200 mm", en: "Hexagonal paper box, 70 × 70 × 200 mm", zh: "六角纸盒装", ja: "六角形の紙箱", ko: "육각 종이 상자" },
    carton: { vi: "40 – 120 hộp/thùng", en: "40 – 120 boxes per carton" },
    highlight: { vi: "Chuyên dùng đóng hộp quà tặng", en: "Made for gift hampers", zh: "礼盒专用", ja: "ギフトボックス専用", ko: "선물 세트 전용" },
    images: [img("cashew-dhlgv150"), img("cashew-hex-160-nutrition"), img("cashew-hex-160-info")],
  },
  {
    id: "dzv430-w180",
    code: "ĐZV430 – W180",
    grams: 430,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Túi zipper", en: "Zipper pouch", zh: "拉链袋", ja: "チャック袋", ko: "지퍼백" },
    carton: { vi: "20 – 80 túi/thùng", en: "20 – 80 pouches per carton" },
    highlight: { vi: "Xuất khẩu · Rang bằng củi, còn nguyên vỏ lụa", en: "Export grade · Wood-fire roasted, skin on", zh: "出口级 · 柴火烘焙，保留完整红衣", ja: "輸出品質 · 薪火焙煎、薄皮付き", ko: "수출용 · 장작불 로스팅, 속껍질째" },
    images: [img("cashew-dzv430"), img("cashew-roasted-250-angle"), img("cashew-roasted-250-back")],
  },
  {
    id: "dzv220-w180",
    code: "ĐZV220 – W180",
    grams: 220,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Túi zipper", en: "Zipper pouch", zh: "拉链袋", ja: "チャック袋", ko: "지퍼백" },
    carton: { vi: "20 – 80 túi/thùng", en: "20 – 80 pouches per carton" },
    images: [img("cashew-dzv220"), img("cashew-pouch-250-angle"), img("cashew-pouch-250-angle-2"), img("cashew-pouch-250-back")],
  },
  {
    id: "dpv400-w180",
    code: "ĐPV400 – W180",
    grams: 400,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hũ nhựa PET", en: "PET jar", zh: "PET塑料罐", ja: "PETジャー", ko: "PET 병" },
    carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" },
    images: [img("cashew-dpv400"), img("cashew-tub-500-back")],
  },
  {
    id: "dpv250-w180",
    code: "ĐPV250 – W180",
    grams: 250,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hũ nhựa PET", en: "PET jar", zh: "PET塑料罐", ja: "PETジャー", ko: "PET 병" },
    carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" },
    images: [img("cashew-dpv250"), img("cashew-tub-500-back")],
  },
  {
    id: "dpv200-w180",
    code: "ĐPV200 – W180",
    grams: 200,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hũ nhựa PET", en: "PET jar", zh: "PET塑料罐", ja: "PETジャー", ko: "PET 병" },
    carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" },
    highlight: { vi: "Chuyên dùng đóng hộp quà tặng", en: "Made for gift hampers", zh: "礼盒专用", ja: "ギフトボックス専用", ko: "선물 세트 전용" },
    images: [img("cashew-dpv200"), img("cashew-tub-500-back")],
  },
  {
    id: "dpv300-w180",
    code: "ĐPV300 – W180",
    grams: 300,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hộp nhựa tròn", en: "Round plastic tub", zh: "圆形塑料盒", ja: "丸型プラスチック容器", ko: "원형 플라스틱 통" },
    carton: { vi: "40 – 100 hộp/thùng", en: "40 – 100 tubs per carton" },
    images: [img("cashew-dpv300"), img("cashew-tub-500-back")],
  },
  {
    id: "dpovv200-w180",
    code: "ĐPOVV200 – W180",
    grams: 200,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hộp nhựa Ovan", en: "Oval plastic tub", zh: "椭圆形塑料盒", ja: "楕円形プラスチック容器", ko: "타원형 플라스틱 통" },
    carton: { vi: "40 – 100 hộp/thùng", en: "40 – 100 tubs per carton" },
    highlight: { vi: "Chuyên đóng quà Tết", en: "Made for Tet gift hampers", zh: "春节礼盒专用", ja: "テトギフト専用", ko: "설 선물 세트 전용" },
    images: [img("cashew-dpovv200"), img("cashew-tub-500-back")],
  },
  {
    id: "dptv500-w180",
    code: "ĐPTV500 – W180",
    grams: 500,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hộp nhựa trụ", en: "Cylinder plastic jar", zh: "圆柱形塑料罐", ja: "円筒形プラスチック容器", ko: "원통형 플라스틱 통" },
    carton: { vi: "40 – 100 hộp/thùng", en: "40 – 100 jars per carton" },
    images: [img("cashew-dptv500"), img("cashew-tub-500-back")],
  },
  {
    id: "dhckv430-w180",
    code: "ĐHCKV430 – W180",
    grams: 430,
    size: { vi: "A cồ - W180", en: "Jumbo A - W180" },
    packing: { vi: "Hút chân không", en: "Vacuum pack", zh: "真空包装", ja: "真空パック", ko: "진공 포장" },
    carton: { vi: "40 – 100 gói/thùng", en: "40 – 100 packs per carton" },
    images: [img("cashew-dhckv430"), img("cashew-roasted-250-angle"), img("cashew-roasted-250-back")],
  },
];

/**
 * The 23 packs on VSAP's retail price list (giá bán lẻ, 24/11/2026): 11 macadamia + 12 cashew.
 * Extra seed packs (roasted & salted macadamia jar variants, macadamia kernels) start hidden; Studio can show them again.
 */
export const priceListIds = new Set([
  ...maccaSkuList.filter((k) => !k.id).map((k) => k.code.toLowerCase()),
  // Roasted & salted jars priced on the 24/11/2026 list.
  "pv500a-rm",
  "pv250b-rm",
  ...cashewSkuList.map((k) => k.id),
]);

/** Pack ids used before the current price-list SKUs, redirected to their closest SKU (old links and search results). */
export const legacyPackIds: Record<string, string> = {
  "macca-box": "hv400",
  hv450b: "hv400",
  hv250a: "hv200",
  hv250b: "hv200",
  hv160b: "hv160",
  zv500a: "zv450",
  zv500b: "zv450",
  "macca-inshell-jar": "pv250a",
  "cashew-box": "dhv380-w180",
  "cashew-hex": "dhlgv150-w180",
  "cashew-pouch": "dzv220-w180",
  "cashew-roasted": "dzv430-w180",
  "cashew-tub": "dptv500-w180",
};

/** Retail prices (VNĐ) from VSAP's retail price list (Giá bán lẻ sản phẩm VSAP, 24/11/2026). */
// The list prices the roasted & salted jars PV500A-RM and PV250B-RM on their own; PV500B-RM and
// PV250A-RM are not on it and keep their plain jar's price. ZV250 is not on it either: last listed price.
const maccaPrices: Record<string, number> = {
  HV400: 168000,
  HV200: 105000,
  HV160: 82000,
  ZV450: 165000,
  ZV250: 89000,
  PV500B: 174000,
  "PV500B-RM": 174000,
  PV500A: 185000,
  "PV500A-RM": 183000,
  PV250A: 107000,
  "PV250A-RM": 107000,
  PV250B: 101000,
  "PV250B-RM": 108000,
};

const cashewPrices: Record<string, number> = {
  "dhv380-w180": 185000,
  "dhlgv205-w180": 114000,
  "dhlgv150-w180": 91000,
  "dzv430-w180": 209000,
  "dzv220-w180": 117000,
  "dpv400-w180": 205000,
  "dpv250-w180": 141000,
  "dpv200-w180": 117000,
  "dpv300-w180": 174000,
  "dpovv200-w180": 142000,
  "dptv500-w180": 245000,
  "dhckv430-w180": 211000,
};

function maccaSkus(): RetailPack[] {
  return maccaSkuList.map((k) => {
    const g = `${k.grams} g`;
    const box = k.kind === "box";
    const size = k.size ? ` (${k.size})` : "";
    const taste = k.taste === "salt"
      ? { vi: " – Vị rang muối", en: " – Roasted & salted", zh: " – 盐焗味", ja: " – 塩ロースト", ko: " – 소금 로스팅" }
      : k.taste === "plain"
        ? { vi: " – Vị nguyên bản", en: " – Original", zh: " – 原味", ja: " – プレーン", ko: " – 오리지널" }
        : { vi: "", en: "", zh: "", ja: "", ko: "" };
    return {
      id: k.id ?? k.code.toLowerCase(),
      slug: "macadamia",
      name: box
        ? { vi: `Hộp hạt macca ${g}`, en: `Macadamia gift box ${g}`, zh: `夏威夷果礼盒 ${k.grams}克`, ja: `マカダミアナッツ ギフトボックス ${k.grams}g`, ko: `마카다미아 선물 상자 ${k.grams}g` }
        : { vi: `Hạt macca nứt vỏ ${g}${taste.vi}`, en: `Cracked in-shell macadamias ${g}${taste.en}`, zh: `开口带壳夏威夷果 ${k.grams}克${taste.zh}`, ja: `殻付きマカダミアナッツ ${k.grams}g${taste.ja}`, ko: `껍질째 마카다미아 ${k.grams}g${taste.ko}` },
      flavor: {
        vi: `Mã ${k.code} · Cỡ hạt ${k.grade}${size}`,
        en: `Code ${k.code} · Grade ${k.grade}${size}`,
        zh: `编号 ${k.code} · ${k.grade}级果${size}`,
        ja: `品番 ${k.code} · ${k.grade}サイズ${size}`,
        ko: `코드 ${k.code} · ${k.grade} 사이즈${size}`,
      },
      pack: { vi: k.packing.vi, en: k.packing.en, zh: "", ja: "", ko: "" },
      weights: [g],
      images: k.images,
      ingredients: k.salted
        ? { vi: "98% hạt macca, 2% muối", en: "98% macadamia nuts, 2% salt", zh: "98%夏威夷果，2%食盐", ja: "マカダミアナッツ98%、食塩2%", ko: "마카다미아 98%, 소금 2%" }
        : { vi: "100% hạt macca", en: "100% macadamia nuts", zh: "100%夏威夷果", ja: "マカダミアナッツ100%", ko: "마카다미아 100%" },
      nutrition: k.nutrition,
      highlight: k.highlight ?? (k.gift
        ? { vi: "Dùng làm quà tặng", en: "Made for gifting", zh: "送礼佳品", ja: "ギフトに最適", ko: "선물용" }
        : { vi: "100% hạt macca từ Tây Nguyên", en: "100% Central Highlands macadamias", zh: "100%西原地区夏威夷果", ja: "中部高原産マカダミアナッツ100%", ko: "중부 고원산 마카다미아 100%" }),
      description: {
        vi: `Hạt macca sấy nứt vỏ tự nhiên, kèm dụng cụ tách vỏ. Không chứa chất bảo quản và phẩm màu, an toàn cho sức khỏe của bạn và gia đình; có thể ăn trực tiếp hoặc dùng chế biến nhiều món.

Thông số
- Khối lượng tịnh: ${g}
- Cỡ hạt: ${k.grade}${size}
- Tỷ lệ hạt hư: ≤ 3%
- Đóng gói: ${k.packing.vi}
- Đóng thùng: ${k.carton.vi}

Cách dùng
1. Dùng dụng cụ tách vỏ có sẵn, đưa vào phần nứt trên vỏ hạt.
2. Xoay vuông góc để tách đôi vỏ, thưởng thức nhân macca thơm ngon bên trong.
3. Đóng kín sau mỗi lần sử dụng.

Lưu ý: không sử dụng sản phẩm đã quá hạn.`,
        en: `Naturally dried, cracked in-shell macadamias with a shell opener included. No preservatives or colourings, safe for you and your family; enjoy them as they are or cook with them.

Specifications
- Net weight: ${g}
- Grade: ${k.grade}${size}
- Damaged nuts: ≤ 3%
- Packing: ${k.packing.en}
- Carton: ${k.carton.en}

How to open
1. Put the included opener into the crack in the shell.
2. Twist it at a right angle to split the shell and enjoy the kernel inside.
3. Close the pack tightly after each use.

Do not eat after the expiry date.`,
      },
    };
  });
}

function cashewSkus(): RetailPack[] {
  const defaultHighlight: L = {
    vi: "Rang bằng củi, còn nguyên vỏ lụa",
    en: "Roasted over wood fire, skin on",
    zh: "柴火烘焙，保留完整红衣",
    ja: "薪火で焙煎、薄皮付きのまま",
    ko: "장작불 로스팅, 속껍질째",
  };
  return cashewSkuList.map((k) => {
    const g = `${k.grams} g`;
    const damagedLineVi = k.damaged ? `\n- Tỷ lệ hạt hư: ${k.damaged}` : "";
    const damagedLineEn = k.damaged ? `\n- Damaged nuts: ${k.damaged}` : "";
    return {
      id: k.id,
      slug: "cashew",
      name: {
        vi: `Hạt điều rang củi ${g}`,
        en: `Wood-fire roasted cashews ${g}`,
        zh: `柴火烘焙腰果 ${k.grams}克`,
        ja: `薪火焙煎カシューナッツ ${k.grams}g`,
        ko: `장작불 로스팅 캐슈넛 ${k.grams}g`,
      },
      flavor: {
        vi: `Mã ${k.code} · Vị muối · Cỡ hạt ${k.size.vi}`,
        en: `Code ${k.code} · Salted · ${k.size.en}`,
        zh: `编号 ${k.code} · 盐焗味 · ${k.size.en}`,
        ja: `品番 ${k.code} · 塩味 · ${k.size.en}`,
        ko: `코드 ${k.code} · 소금맛 · ${k.size.en}`,
      },
      pack: k.packing,
      weights: [g],
      images: k.images,
      ingredients: {
        vi: "98% hạt điều, 2% muối",
        en: "98% cashews, 2% salt",
        zh: "98%腰果，2%食盐",
        ja: "カシューナッツ98%、食塩2%",
        ko: "캐슈넛 98%, 소금 2%",
      },
      nutrition: { energy: "583 kcal", fat: "46,6 g", carbs: "20,5 g", protein: "20,3 g" },
      highlight: k.highlight ?? defaultHighlight,
      description: {
        vi: `Hạt điều rang củi truyền thống vị muối, cỡ hạt ${k.size.vi}. Không chất bảo quản, giữ trọn hương vị giòn béo tự nhiên.

Thông số
- Khối lượng tịnh: ${g}
- Size hạt: ${k.size.vi}${damagedLineVi}
- Đóng gói: ${k.packing.vi}
- Đóng thùng: ${k.carton.vi}

Lưu ý: bảo quản nơi khô ráo, đóng kín sau mỗi lần sử dụng và không dùng sản phẩm đã quá hạn.`,
        en: `Traditional wood-fire roasted salted cashews (${k.size.en}). No preservatives, preserving the natural crunch and rich flavour.

Specifications
- Net weight: ${g}
- Size: ${k.size.en}${damagedLineEn}
- Packing: ${k.packing.en}
- Carton: ${k.carton.en}

Note: store in a cool, dry place, reseal tightly after each use, and do not eat after the expiry date.`,
      },
    };
  });
}

export const retailPacks: RetailPack[] = [
  ...maccaSkus(),
  ...cashewSkus(),
  {
    id: "macca-kernel-jar",
    slug: "macadamia",
    name: { vi: "Nhân hạt macca", en: "Macadamia kernels", zh: "夏威夷果仁", ja: "マカダミアナッツの実", ko: "마카다미아 알맹이" },
    flavor: { vi: "Đã tách vỏ", en: "Shelled", zh: "已去壳", ja: "殻むき", ko: "껍질 제거" },
    pack: { vi: "Hũ nhựa", en: "Jar", zh: "塑料罐装", ja: "プラスチックジャー", ko: "플라스틱 병" },
    weights: ["250 g", "500 g"],
    images: [img("macca-kernel-250"), img("macca-kernel-500"), img("macca-kernel-250-back")],
    ingredients: { vi: "98% hạt macca, 2% muối", en: "98% macadamia nuts, 2% salt", zh: "98%夏威夷果，2%食盐", ja: "マカダミアナッツ98%、食塩2%", ko: "마카다미아 98%, 소금 2%" },
    nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" },
  },
];

/** Label facts shared by every pack. */
export const retailFacts = {
  shelfLife: { vi: "12 tháng kể từ ngày sản xuất", en: "12 months from production date", zh: "自生产日期起12个月", ja: "製造日から12か月", ko: "제조일로부터 12개월" },
  serving: { vi: "Khuyên dùng 10 – 15 hạt mỗi ngày", en: "Recommended 10 – 15 nuts a day", zh: "建议每日食用10 – 15粒", ja: "1日10 – 15粒を目安にお召し上がりください", ko: "하루 10 – 15알 섭취를 권장합니다" },
  storage: {
    vi: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Đóng kín sau mỗi lần dùng.",
    en: "Store in a cool, dry place away from direct sunlight. Keep sealed after each use.",
    zh: "请存放于阴凉干燥处，避免阳光直射。每次食用后请密封保存。",
    ja: "直射日光を避け、涼しく乾燥した場所で保存してください。開封後はその都度しっかり密封してください。",
    ko: "직사광선을 피해 서늘하고 건조한 곳에 보관하십시오. 사용 후에는 매번 밀봉하여 보관하십시오.",
  },
  standard: "TCCS 04:2024/MACCA DAK LAK",
};

/**
 * Giá bán lẻ (VNĐ) theo bảng giá lẻ VSAP (9 mã macca + 12 mã hạt điều rang củi).
 * Nhân macca tách vỏ là giá tạm, giữ ẩn cho tới khi công bố.
 */
export const tempPrices: Record<string, number> = {
  ...Object.fromEntries(Object.entries(maccaPrices).map(([code, price]) => [code.toLowerCase(), price])),
  ...cashewPrices,
  "macca-kernel-jar": 225000,
};

/** Giá sỉ từ 50kg (VNĐ, giao tại xưởng, chưa VAT) theo Bảng giá sỉ VSAP ngày 08/11/2026. */
export const wholesalePrices: Record<string, number> = {
  hv400: 119000,
  hv200: 77000,
  hv160: 49000,
  zv450: 117000,
  zv250: 69000,
  pv500b: 112000,
  "pv500b-rm": 112000,
  pv500a: 121000,
  "pv500a-rm": 121000,
  pv250a: 73000,
  "pv250a-rm": 73000,
  pv250b: 66000,
  "pv250b-rm": 66000,
  "dhv380-w180": 136000,
  "dhlgv205-w180": 87000,
  "dhlgv150-w180": 65000,
  "dzv430-w180": 131000,
  "dzv220-w180": 75000,
  "dpv400-w180": 126000,
  "dpv250-w180": 90000,
  "dpv200-w180": 75000,
  "dpv300-w180": 109000,
  "dpovv200-w180": 89000,
  "dptv500-w180": 152000,
  "dhckv430-w180": 132000,
};

/** Contract packers printed on the labels. */
export const packers = {
  macadamia: {
    name: "Công ty TNHH Fine Farm",
    address: { vi: "02-D1 Buôn KoTam, phường Tân An, tỉnh Đắk Lắk", en: "02-D1 Buon KoTam, Tan An Ward, Dak Lak Province", zh: "越南多乐省 Tân An 坊 Buôn KoTam 02-D1号", ja: "ベトナム ダクラク省 Tân An 坊 Buôn KoTam 02-D1", ko: "베트남 닥락성 Tân An 동 Buôn KoTam 02-D1" },
  },
  cashew: {
    name: "Công ty TNHH MTV DV XNK Hoàng Khang",
    address: { vi: "Số 300, KP Phước Vĩnh, phường Phước Vĩnh, TP. Đồng Nai", en: "300 Phuoc Vinh Quarter, Phuoc Vinh Ward, Dong Nai", zh: "越南同奈市 Phước Vĩnh 坊 Phước Vĩnh 街区300号", ja: "ベトナム ドンナイ市 Phước Vĩnh 坊 Phước Vĩnh 街区 300番地", ko: "베트남 동나이시 Phước Vĩnh 동 Phước Vĩnh 구역 300번지" },
  },
  /** Printed as "Sản xuất tại" on the 250 g pouch. */
  cashewDongPhu: {
    name: "Chi nhánh Công ty TNHH Thực phẩm Đồng Phú",
    address: {
      vi: "Số 30 đường Nguyễn Chí Thanh, khu phố Phú Cường, phường Bình Phước, TP. Đồng Nai",
      en: "30 Nguyen Chi Thanh Street, Phu Cuong Quarter, Binh Phuoc Ward, Dong Nai",
      zh: "越南同奈市 Bình Phước 坊 Phú Cường 街区 Nguyễn Chí Thanh 路30号",
      ja: "ベトナム ドンナイ市 Bình Phước 坊 Phú Cường 街区 Nguyễn Chí Thanh 通り30番地",
      ko: "베트남 동나이시 Bình Phước 동 Phú Cường 구역 Nguyễn Chí Thanh 거리 30번지",
    },
  },
} satisfies Record<RetailPack["slug"] | "cashewDongPhu", { name: string; address: L }>;
