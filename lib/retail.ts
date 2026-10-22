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
};

const img = (name: string) => `/images/products/${name}.webp`;

export const retailPacks: RetailPack[] = [
  {
    id: "macca-box",
    slug: "macadamia",
    name: { vi: "Hạt macca nứt vỏ", en: "Cracked in-shell macadamias", zh: "开口带壳夏威夷果", ja: "割れ目入り殻付きマカダミアナッツ", ko: "금 낸 껍질째 마카다미아" },
    flavor: { vi: "Vị nguyên bản", en: "Original", zh: "原味", ja: "プレーン", ko: "오리지널" },
    pack: { vi: "Hộp giấy", en: "Gift box", zh: "纸盒装", ja: "紙箱", ko: "종이 상자" },
    weights: ["450 g"],
    images: [img("macca-box-450-front"), img("macca-box-450-angle"), img("macca-box-450-back")],
    ingredients: { vi: "100% hạt macca", en: "100% macadamia nuts", zh: "100%夏威夷果", ja: "マカダミアナッツ100%", ko: "마카다미아 100%" },
    nutrition: { energy: "759 kcal", fat: "74 g", carbs: "14 g", protein: "9 g" },
    highlight: { vi: "100% hạt macca từ Tây Nguyên", en: "100% Central Highlands macadamias", zh: "100%西原地区夏威夷果", ja: "中部高原産マカダミアナッツ100%", ko: "중부 고원산 마카다미아 100%" },
  },
  {
    id: "macca-inshell-jar",
    slug: "macadamia",
    name: { vi: "Hạt macca nứt vỏ", en: "Cracked in-shell macadamias", zh: "开口带壳夏威夷果", ja: "割れ目入り殻付きマカダミアナッツ", ko: "금 낸 껍질째 마카다미아" },
    flavor: { vi: "Rang muối hồng Himalaya", en: "Himalayan pink salt roasted", zh: "喜马拉雅粉盐烘烤", ja: "ヒマラヤピンクソルトでロースト", ko: "히말라야 핑크 솔트 로스팅" },
    pack: { vi: "Hũ nhựa", en: "Jar", zh: "塑料罐装", ja: "プラスチックジャー", ko: "플라스틱 병" },
    weights: ["250 g", "500 g"],
    images: [img("macca-inshell-250"), img("macca-inshell-500"), img("macca-inshell-250-back")],
    ingredients: { vi: "98% hạt macca, 2% muối", en: "98% macadamia nuts, 2% salt", zh: "98%夏威夷果，2%食盐", ja: "マカダミアナッツ98%、食塩2%", ko: "마카다미아 98%, 소금 2%" },
    nutrition: { energy: "750 kcal", fat: "72 g", carbs: "15 g", protein: "10 g" },
    highlight: { vi: "100% hạt macca từ Tây Nguyên", en: "100% Central Highlands macadamias", zh: "100%西原地区夏威夷果", ja: "中部高原産マカダミアナッツ100%", ko: "중부 고원산 마카다미아 100%" },
  },
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
 * GIÁ TẠM (VNĐ), đặt theo mặt bằng giá bán lẻ trên thị trường để chạy thử cửa hàng.
 * Chưa phải giá VSAP công bố: thay bằng giá thật trong Studio › Bán lẻ rồi xuất bản.
 */
export const tempPrices: Record<string, number> = {
  "macca-box": 165000,
  "macca-inshell-jar": 185000,
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
