import type { Locale } from "./i18n";
import type { ImageKey } from "./images";

type L<T = string> = Record<Locale, T>;

export type Product = {
  slug: "cashew" | "macadamia" | "bird-nest";
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
    name: { vi: "Hạt điều", en: "Cashew nuts", zh: "腰果" },
    latin: "Anacardium occidentale",
    image: "cashew",
    gallery: ["cashewApple", "cashewKernels", "cashewRoasted"],
    short: {
      vi: "Nhân điều trắng nguyên hạt và các phân loại vỡ, rang muối, theo tiêu chuẩn AFI.",
      en: "White whole and broken cashew kernels, plus roasted & salted, graded to AFI standards.",
      zh: "白腰果整仁及各类碎仁、盐焗腰果，按AFI标准分级。",
    },
    description: {
      vi: "Hạt điều Việt Nam nổi tiếng với nhân trắng ngà, vị béo ngọt và độ giòn đặc trưng. VSAP cung cấp nhân điều sơ chế đóng gói xuất khẩu cùng hạt điều rang muối cho thị trường bán lẻ, phân loại theo tiêu chuẩn của Hiệp hội Công nghiệp Thực phẩm Hoa Kỳ (AFI).",
      en: "Vietnamese cashews are known for their ivory-white kernels, rich buttery taste and distinctive crunch. VSAP supplies export-packed raw kernels as well as roasted & salted cashews for retail, graded to the Association of Food Industries (AFI) specification.",
      zh: "越南腰果以象牙白的果仁、香浓甘甜的口感和独特的酥脆感而闻名。VSAP供应出口包装的初加工腰果仁，以及面向零售市场的盐焗腰果，均按美国食品工业协会（AFI）标准分级。",
    },
    origin: {
      vi: "Bình Phước, Đồng Nai và các tỉnh Đông Nam Bộ – vùng điều lớn nhất Việt Nam.",
      en: "Binh Phuoc, Dong Nai and the South-East region – Vietnam’s largest cashew belt.",
      zh: "平福省、同奈省及东南部各省——越南最大的腰果产区。",
    },
    grades: [
      { code: "W180", label: { vi: "Nguyên hạt trắng, 180 hạt/lb", en: "White wholes, 180 kernels/lb", zh: "白色整仁，每磅180粒" } },
      { code: "W210", label: { vi: "Nguyên hạt trắng, 210 hạt/lb", en: "White wholes, 210 kernels/lb", zh: "白色整仁，每磅210粒" } },
      { code: "W240", label: { vi: "Nguyên hạt trắng, 240 hạt/lb", en: "White wholes, 240 kernels/lb", zh: "白色整仁，每磅240粒" } },
      { code: "W320", label: { vi: "Nguyên hạt trắng, 320 hạt/lb", en: "White wholes, 320 kernels/lb", zh: "白色整仁，每磅320粒" } },
      { code: "W450", label: { vi: "Nguyên hạt trắng, 450 hạt/lb", en: "White wholes, 450 kernels/lb", zh: "白色整仁，每磅450粒" } },
      { code: "WS / LP", label: { vi: "Vỡ đôi, mảnh lớn", en: "White splits, large pieces", zh: "白色对半仁、大块碎仁" } },
      { code: "RS", label: { vi: "Rang muối nguyên hạt", en: "Roasted & salted wholes", zh: "盐焗整仁" } },
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
      zh: [
        "真空/充CO₂袋装，每箱2 × 11.34 kg（50 lbs）",
        "可按要求采用铁罐包装，2 × 11.34 kg",
        "零售包装250 g – 1 kg，可贴牌（OEM）",
      ],
    },
    specs: [
      { label: { vi: "Độ ẩm", en: "Moisture", zh: "水分" }, value: "≤ 5%" },
      { label: { vi: "Hạt vỡ", en: "Broken kernels", zh: "碎仁率" }, value: "≤ 5%" },
      { label: { vi: "Tạp chất", en: "Foreign matter", zh: "杂质" }, value: "0%" },
      { label: { vi: "Hạn sử dụng", en: "Shelf life", zh: "保质期" }, value: "12 – 24 m" },
    ],
    applications: {
      vi: ["Ăn vặt, bán lẻ", "Bánh kẹo, socola", "Sữa hạt, bơ hạt", "Nhà hàng, chế biến thực phẩm"],
      en: ["Snacking & retail", "Bakery & confectionery", "Nut milks & butters", "Food service & manufacturing"],
      zh: ["休闲零食、零售", "烘焙、糖果、巧克力", "坚果奶、坚果酱", "餐饮、食品加工"],
    },
  },
  {
    slug: "macadamia",
    name: { vi: "Hạt macca", en: "Macadamia nuts", zh: "夏威夷果" },
    latin: "Macadamia integrifolia",
    image: "macadamia",
    gallery: ["macadamiaTree", "macadamiaSpoon"],
    short: {
      vi: "Macca nguyên vỏ sấy nứt và nhân macca theo các style quốc tế, béo thơm tự nhiên.",
      en: "Cracked in-shell macadamias and kernels in international styles, naturally rich and creamy.",
      zh: "烘干开口带壳夏威夷果及按国际Style标准分级的果仁，天然香浓。",
    },
    description: {
      vi: "Được trồng trên cao nguyên đất đỏ bazan, hạt macca Việt Nam có nhân to, màu kem sáng, vị béo bùi và thơm tự nhiên. VSAP cung cấp macca nguyên vỏ sấy nứt tiện dụng và nhân macca phân loại theo style quốc tế.",
      en: "Grown on the basalt highlands of Vietnam, Vietnamese macadamias have large, light-cream kernels with a rich, naturally aromatic flavour. VSAP supplies convenient cracked in-shell macadamias and kernels graded to international styles.",
      zh: "越南夏威夷果生长于红色玄武岩土高原，果仁饱满，呈浅奶油色，口感香浓绵密，带有天然香气。VSAP供应食用便捷的烘干开口带壳夏威夷果，以及按国际Style标准分级的夏威夷果仁。",
    },
    origin: {
      vi: "Tây Nguyên, tập trung tại Đắk Lắk.",
      en: "The Central Highlands, centred on Dak Lak province.",
      zh: "西原地区，主要集中在多乐省。",
    },
    grades: [
      { code: "NIS 22+", label: { vi: "Nguyên vỏ sấy nứt, cỡ ≥ 22 mm", en: "Cracked in-shell, ≥ 22 mm", zh: "烘干开口带壳，果径 ≥ 22 mm" } },
      { code: "NIS 18–22", label: { vi: "Nguyên vỏ sấy nứt, cỡ 18–22 mm", en: "Cracked in-shell, 18–22 mm", zh: "烘干开口带壳，果径 18–22 mm" } },
      { code: "Style 0", label: { vi: "Nhân nguyên hạt ≥ 20 mm", en: "Whole kernels ≥ 20 mm", zh: "整仁 ≥ 20 mm" } },
      { code: "Style 1", label: { vi: "Nhân nguyên hạt ≥ 17 mm", en: "Whole kernels ≥ 17 mm", zh: "整仁 ≥ 17 mm" } },
      { code: "Style 2", label: { vi: "Nhân nguyên & nửa hạt", en: "Wholes & halves mix", zh: "整仁与半仁混合" } },
      { code: "Style 4", label: { vi: "Nhân nửa hạt", en: "Halves", zh: "半仁" } },
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
      zh: [
        "果仁：真空/充N₂铝箔袋，每箱11.34 kg",
        "带壳果：网袋或PE袋，10 – 25 kg",
        "零售包装250 g – 1 kg，可贴牌（OEM）",
      ],
    },
    specs: [
      { label: { vi: "Độ ẩm nhân", en: "Kernel moisture", zh: "果仁水分" }, value: "≤ 1.5%" },
      { label: { vi: "Độ ẩm nguyên vỏ", en: "In-shell moisture", zh: "带壳果水分" }, value: "≤ 3.5%" },
      { label: { vi: "Tạp chất", en: "Foreign matter", zh: "杂质" }, value: "0%" },
      { label: { vi: "Hạn sử dụng", en: "Shelf life", zh: "保质期" }, value: "12 m" },
    ],
    applications: {
      vi: ["Quà tặng, bán lẻ cao cấp", "Bánh kẹo, kem", "Sữa hạt, dầu macca", "Granola, ngũ cốc"],
      en: ["Gifting & premium retail", "Confectionery & ice cream", "Nut milks & macadamia oil", "Granola & cereals"],
      zh: ["礼品、高端零售", "糖果、冰淇淋", "坚果奶、夏威夷果油", "格兰诺拉麦片、谷物早餐"],
    },
  },
  {
    slug: "bird-nest",
    name: { vi: "Yến sào", en: "Edible bird’s nest", zh: "燕窝" },
    latin: "Aerodramus fuciphagus",
    image: "birdNest",
    gallery: ["birdNestRaw"],
    short: {
      vi: "Yến thô nguyên tổ, yến tinh chế rút lông và yến chưng sẵn từ nguồn yến Khánh Hòa.",
      en: "Raw whole nests, hand-cleaned nests and ready-to-drink bird’s nest from Khanh Hoa.",
      zh: "毛燕整盏、人工挑毛净燕盏及即食炖燕窝，源自庆和省燕窝产区。",
    },
    description: {
      vi: "Yến sào Khánh Hòa từ lâu được xem là đặc sản quý của Việt Nam. VSAP cung cấp yến thô nguyên tổ, yến tinh chế đã làm sạch lông bằng tay và yến chưng sẵn tiện dùng, cho cả đơn hàng xuất khẩu lẫn bán lẻ.",
      en: "Khanh Hoa bird’s nest has long been one of Vietnam’s most prized delicacies. VSAP supplies raw whole nests, hand-cleaned nests and ready-to-drink bird’s nest, for export orders and retail alike.",
      zh: "庆和燕窝历来被视为越南的珍贵特产。VSAP供应毛燕整盏、人工挑毛的净燕盏以及方便即食的炖燕窝，可同时满足出口订单与零售需求。",
    },
    origin: {
      vi: "Khánh Hòa – Nha Trang, vùng yến sào nổi tiếng nhất Việt Nam.",
      en: "Khanh Hoa – Nha Trang, Vietnam’s best-known bird’s nest region.",
      zh: "庆和省芽庄——越南最负盛名的燕窝产区。",
    },
    grades: [
      { code: "Yến thô", label: { vi: "Tổ yến nguyên, chưa làm sạch lông", en: "Raw whole nests, not yet cleaned", zh: "整盏毛燕，未挑毛" } },
      { code: "Yến tinh chế", label: { vi: "Đã làm sạch lông, giữ dáng tổ", en: "Hand-cleaned nests, shape kept", zh: "已人工挑毛，保留盏形" } },
      { code: "Yến chưng sẵn", label: { vi: "Hũ yến chưng, dùng ngay", en: "Ready-to-drink bird’s nest in jars", zh: "瓶装炖燕窝，开盖即食" } },
    ],
    packaging: {
      vi: [
        "Yến thô, yến tinh chế: hộp theo trọng lượng yêu cầu",
        "Yến chưng sẵn: hũ, lốc và hộp quà",
        "Đóng gói nhãn riêng (OEM) cho nhà phân phối",
      ],
      en: [
        "Raw and cleaned nests: boxed to the weight you need",
        "Ready-to-drink: jars, multipacks and gift boxes",
        "Private-label (OEM) packing for distributors",
      ],
      zh: [
        "毛燕、净燕：按所需重量盒装",
        "即食燕窝：瓶装、组合装及礼盒装",
        "为经销商提供贴牌（OEM）包装",
      ],
    },
    specs: [],
    applications: {
      vi: ["Quà biếu cao cấp", "Bồi bổ sức khoẻ gia đình", "Nhà hàng, khách sạn", "Đồ uống, thực phẩm chức năng"],
      en: ["Premium gifting", "Family wellness", "Restaurants & hotels", "Drinks & health foods"],
      zh: ["高端礼品", "家庭滋补养生", "餐厅、酒店", "饮品、保健食品"],
    },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

