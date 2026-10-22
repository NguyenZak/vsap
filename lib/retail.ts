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

/** Cracked in-shell macadamia SKUs from VSAP's retail price list (bảng giá sản phẩm, 10/2026). */
type MaccaSku = {
  code: string;
  kind: "box" | "inshell";
  grams: number;
  grade: "A" | "B";
  /** Kernel size printed on the price list, when given. */
  size?: string;
  gift?: boolean;
  /** Packing line and carton for the description. */
  packing: { vi: string; en: string };
  carton: { vi: string; en: string };
  images: string[];
  nutrition?: RetailPack["nutrition"];
};

const maccaSkuList: MaccaSku[] = [
  { code: "HV450B", kind: "box", grams: 450, grade: "B", gift: true, packing: { vi: "Hộp giấy, kích thước 140 × 220 × 50 mm", en: "Paper box, 140 × 220 × 50 mm" }, carton: { vi: "40 – 80 hộp/thùng", en: "40 – 80 boxes per carton" }, images: [img("macca-box-450-front"), img("macca-box-450-angle"), img("macca-box-450-back")], nutrition: { energy: "759 kcal", fat: "74 g", carbs: "14 g", protein: "9 g" } },
  { code: "HV250A", kind: "box", grams: 250, grade: "A", gift: true, packing: { vi: "Hộp giấy lục giác, kích thước 70 × 70 × 200 mm", en: "Hexagonal paper box, 70 × 70 × 200 mm" }, carton: { vi: "40 – 100 hộp/thùng", en: "40 – 100 boxes per carton" }, images: ["/images/macadamia.webp"] },
  { code: "HV250B", kind: "box", grams: 250, grade: "B", gift: true, packing: { vi: "Hộp giấy lục giác, kích thước 70 × 70 × 200 mm", en: "Hexagonal paper box, 70 × 70 × 200 mm" }, carton: { vi: "40 – 100 hộp/thùng", en: "40 – 100 boxes per carton" }, images: ["/images/macadamia.webp"] },
  { code: "HV160B", kind: "box", grams: 160, grade: "B", gift: true, packing: { vi: "Hộp giấy lục giác", en: "Hexagonal paper box" }, carton: { vi: "40 – 120 hộp/thùng", en: "40 – 120 boxes per carton" }, images: ["/images/macadamia.webp"] },
  { code: "ZV500A", kind: "inshell", grams: 500, grade: "A", size: "25 – 32 mm ±1", packing: { vi: "Túi zipper", en: "Zipper pouch" }, carton: { vi: "20 túi/thùng", en: "20 pouches per carton" }, images: ["/images/macadamia-spoon.webp"] },
  { code: "ZV500B", kind: "inshell", grams: 500, grade: "B", size: "22 – 24 mm ±1", packing: { vi: "Túi zipper", en: "Zipper pouch" }, carton: { vi: "20 túi/thùng", en: "20 pouches per carton" }, images: ["/images/macadamia-spoon.webp"] },
  { code: "PV500A", kind: "inshell", grams: 500, grade: "A", size: "25 – 32 mm ±1", packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-inshell-500"), img("macca-inshell-250-back")] },
  { code: "PV500B", kind: "inshell", grams: 500, grade: "B", size: "22 – 24 mm ±1", packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-inshell-500"), img("macca-inshell-250-back")] },
  { code: "PV250A", kind: "inshell", grams: 250, grade: "A", size: "25 – 32 mm ±1", gift: true, packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-inshell-250"), img("macca-inshell-250-back")] },
  { code: "PV250B", kind: "inshell", grams: 250, grade: "B", size: "22 – 24 mm ±1", gift: true, packing: { vi: "Hũ nhựa PET", en: "PET jar" }, carton: { vi: "40 – 100 hũ/thùng", en: "40 – 100 jars per carton" }, images: [img("macca-inshell-250"), img("macca-inshell-250-back")] },
];

/** Pack ids used before the price-list SKUs, redirected to their closest SKU (old links and search results). */
export const legacyPackIds: Record<string, string> = { "macca-box": "hv450b", "macca-inshell-jar": "pv250a" };

/** Retail prices (VND) from the price list. */
const maccaPrices: Record<string, number> = { HV450B: 155000, HV250A: 79000, HV250B: 74000, HV160B: 69000, ZV500A: 158000, ZV500B: 148000, PV500A: 168000, PV500B: 158000, PV250A: 93000, PV250B: 88000 };

function maccaSkus(): RetailPack[] {
  return maccaSkuList.map((k) => {
    const g = `${k.grams} g`;
    const box = k.kind === "box";
    const size = k.size ? ` (${k.size})` : "";
    return {
      id: k.code.toLowerCase(),
      slug: "macadamia",
      name: box
        ? { vi: `Hộp hạt macca ${g}`, en: `Macadamia gift box ${g}`, zh: `夏威夷果礼盒 ${k.grams}克`, ja: `マカダミアナッツ ギフトボックス ${k.grams}g`, ko: `마카다미아 선물 상자 ${k.grams}g` }
        : { vi: `Hạt macca nứt vỏ ${g}`, en: `Cracked in-shell macadamias ${g}`, zh: `开口带壳夏威夷果 ${k.grams}克`, ja: `殻付きマカダミアナッツ ${k.grams}g`, ko: `껍질째 마카다미아 ${k.grams}g` },
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
      ingredients: { vi: "100% hạt macca", en: "100% macadamia nuts", zh: "100%夏威夷果", ja: "マカダミアナッツ100%", ko: "마카다미아 100%" },
      nutrition: k.nutrition,
      highlight: k.gift
        ? { vi: "Dùng làm quà tặng", en: "Made for gifting", zh: "送礼佳品", ja: "ギフトに最適", ko: "선물용" }
        : { vi: "100% hạt macca từ Tây Nguyên", en: "100% Central Highlands macadamias", zh: "100%西原地区夏威夷果", ja: "中部高原産マカダミアナッツ100%", ko: "중부 고원산 마카다미아 100%" },
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

export const retailPacks: RetailPack[] = [
  ...maccaSkus(),
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
  {
    id: "cashew-roasted",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews", zh: "柴火烘焙腰果", ja: "薪火焙煎カシューナッツ", ko: "장작불 로스팅 캐슈넛" },
    flavor: { vi: "Vị rang muối", en: "Roasted & salted", zh: "盐焗味", ja: "塩ロースト", ko: "소금 로스팅" },
    pack: { vi: "Túi zip đáy đứng", en: "Stand-up zip pouch", zh: "自立拉链袋", ja: "スタンドチャック袋", ko: "스탠드 지퍼백" },
    weights: ["250 g", "500 g"],
    images: [img("cashew-roasted-250"), img("cashew-roasted-500"), img("cashew-roasted-250-angle"), img("cashew-roasted-250-back")],
    ingredients: { vi: "98% hạt điều, 2% muối", en: "98% cashews, 2% salt", zh: "98%腰果，2%食盐", ja: "カシューナッツ98%、食塩2%", ko: "캐슈넛 98%, 소금 2%" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on", zh: "柴火烘焙，保留完整红衣", ja: "薪火で焙煎、薄皮付きのまま", ko: "장작불 로스팅, 속껍질째" },
  },
  {
    id: "cashew-hex",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews", zh: "柴火烘焙腰果", ja: "薪火焙煎カシューナッツ", ko: "장작불 로스팅 캐슈넛" },
    flavor: { vi: "Vị rang muối", en: "Roasted & salted", zh: "盐焗味", ja: "塩ロースト", ko: "소금 로스팅" },
    pack: { vi: "Hộp giấy lục giác", en: "Hexagonal carton", zh: "六角纸盒装", ja: "六角形の紙箱", ko: "육각 종이 상자" },
    weights: ["160 g"],
    images: [img("cashew-hex-160-front"), img("cashew-hex-160-nutrition"), img("cashew-hex-160-info")],
    ingredients: { vi: "98% hạt điều, 2% muối", en: "98% cashews, 2% salt", zh: "98%腰果，2%食盐", ja: "カシューナッツ98%、食塩2%", ko: "캐슈넛 98%, 소금 2%" },
    nutrition: { energy: "583 kcal", fat: "46,6 g", carbs: "20,5 g", protein: "20,3 g" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on", zh: "柴火烘焙，保留完整红衣", ja: "薪火で焙煎、薄皮付きのまま", ko: "장작불 로스팅, 속껍질째" },
  },
  {
    id: "cashew-pouch",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews", zh: "柴火烘焙腰果", ja: "薪火焙煎カシューナッツ", ko: "장작불 로스팅 캐슈넛" },
    flavor: { vi: "", en: "", zh: "", ja: "", ko: "" },
    pack: { vi: "Túi zip đáy đứng", en: "Stand-up zip pouch", zh: "自立拉链袋", ja: "スタンドチャック袋", ko: "스탠드 지퍼백" },
    weights: ["250 g"],
    images: [img("cashew-pouch-250-front"), img("cashew-pouch-250-angle"), img("cashew-pouch-250-angle-2"), img("cashew-pouch-250-back")],
    ingredients: { vi: "99,9% hạt điều, 0,1% muối", en: "99.9% cashews, 0.1% salt", zh: "99.9%腰果，0.1%食盐", ja: "カシューナッツ99.9%、食塩0.1%", ko: "캐슈넛 99.9%, 소금 0.1%" },
    nutrition: { energy: "617 kcal", fat: "47,7 g", carbs: "26,8 g", protein: "20,1 g" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on", zh: "柴火烘焙，保留完整红衣", ja: "薪火で焙煎、薄皮付きのまま", ko: "장작불 로스팅, 속껍질째" },
    packer: "cashewDongPhu",
  },
  {
    id: "cashew-box",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews", zh: "柴火烘焙腰果", ja: "薪火焙煎カシューナッツ", ko: "장작불 로스팅 캐슈넛" },
    flavor: { vi: "Vị rang muối", en: "Roasted & salted", zh: "盐焗味", ja: "塩ロースト", ko: "소금 로스팅" },
    pack: { vi: "Hộp giấy", en: "Gift box", zh: "纸盒装", ja: "紙箱", ko: "종이 상자" },
    weights: ["450 g"],
    images: [img("cashew-box-450-front"), img("cashew-box-450-back-angle"), img("cashew-box-450-back")],
    ingredients: { vi: "98% hạt điều, 2% muối", en: "98% cashews, 2% salt", zh: "98%腰果，2%食盐", ja: "カシューナッツ98%、食塩2%", ko: "캐슈넛 98%, 소금 2%" },
    nutrition: { energy: "583 kcal", fat: "46,6 g", carbs: "20,5 g", protein: "20,3 g" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on", zh: "柴火烘焙，保留完整红衣", ja: "薪火で焙煎、薄皮付きのまま", ko: "장작불 로스팅, 속껍질째" },
  },
  {
    id: "cashew-tub",
    slug: "cashew",
    name: { vi: "Hạt điều rang củi", en: "Wood-fire roasted cashews", zh: "柴火烘焙腰果", ja: "薪火焙煎カシューナッツ", ko: "장작불 로스팅 캐슈넛" },
    flavor: { vi: "Vị rang muối", en: "Roasted & salted", zh: "盐焗味", ja: "塩ロースト", ko: "소금 로스팅" },
    pack: { vi: "Hộp nhựa", en: "Clear tub", zh: "塑料盒装", ja: "クリアケース", ko: "투명 플라스틱 통" },
    weights: ["500 g"],
    images: [img("cashew-tub-500-front"), img("cashew-tub-500-back")],
    ingredients: { vi: "98% hạt điều, 2% muối", en: "98% cashews, 2% salt", zh: "98%腰果，2%食盐", ja: "カシューナッツ98%、食塩2%", ko: "캐슈넛 98%, 소금 2%" },
    nutrition: { energy: "583 kcal", fat: "46,6 g", carbs: "20,5 g", protein: "20,3 g" },
    highlight: { vi: "Rang bằng củi, còn nguyên vỏ lụa", en: "Roasted over wood fire, skin on", zh: "柴火烘焙，保留完整红衣", ja: "薪火で焙煎、薄皮付きのまま", ko: "장작불 로스팅, 속껍질째" },
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
 * Giá bán lẻ (VNĐ). Macca nứt vỏ: theo bảng giá VSAP. Các mã còn lại là GIÁ TẠM theo
 * mặt bằng thị trường, chưa phải giá VSAP công bố: thay trong Studio › Bán lẻ rồi xuất bản.
 */
export const tempPrices: Record<string, number> = {
  ...Object.fromEntries(Object.entries(maccaPrices).map(([code, price]) => [code.toLowerCase(), price])),
  "macca-kernel-jar": 225000,
  "cashew-roasted": 195000,
  "cashew-hex": 75000,
  "cashew-pouch": 99000,
  "cashew-box": 185000,
  "cashew-tub": 205000,
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
