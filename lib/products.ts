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
    name: { vi: "Hạt điều", en: "Cashew nuts", zh: "腰果", ja: "カシューナッツ", ko: "캐슈넛" },
    latin: "Anacardium occidentale",
    image: "cashew",
    gallery: ["cashewApple", "cashewKernels", "cashewRoasted"],
    short: {
      vi: "Nhân điều trắng nguyên hạt và các phân loại vỡ, rang muối, theo tiêu chuẩn AFI.",
      en: "White whole and broken cashew kernels, plus roasted & salted, graded to AFI standards.",
      zh: "白腰果整仁及各类碎仁、盐焗腰果，按AFI标准分级。",
      ja: "白カシューナッツのホール・ブロークン各種と塩ローストを、AFI規格に基づき等級分けしてご提供します。",
      ko: "백색 캐슈넛 홀·브로큰 각 등급과 소금 로스팅 제품을 AFI 기준에 따라 등급별로 공급합니다.",
    },
    description: {
      vi: "## Hạt điều Việt Nam\n\nViệt Nam hiện là quốc gia dẫn đầu thế giới về chế biến và xuất khẩu nhân điều. Với các vùng trồng truyền thống tại Đông Nam Bộ và Tây Nguyên, cùng kinh nghiệm sản xuất và chế biến được tích lũy qua nhiều thập kỷ, ngành điều đã trở thành một phần quan trọng trong chuỗi cung ứng nông sản toàn cầu. Hạt điều có vị ngọt tự nhiên, béo bùi, giàu protein thực vật, chất béo không bão hòa và các khoáng chất thiết yếu. Sự đa dạng trong phương pháp chế biến và quy cách sản phẩm giúp hạt điều đáp ứng nhiều nhu cầu tiêu dùng, ẩm thực và thương mại trên thị trường quốc tế.",
      en: "## Vietnamese cashews\n\nVietnam is currently the world's leading processor and exporter of cashew kernels. With traditional growing regions in the South-East and the Central Highlands, and production and processing experience built up over decades, the cashew industry has become an important part of the global agricultural supply chain. Cashews have a natural sweetness and a rich, buttery taste, and are high in plant protein, unsaturated fats and essential minerals. A wide range of processing methods and product specifications lets cashews meet many consumer, culinary and trade needs on international markets.",
      zh: "## 越南腰果\n\n越南目前是全球领先的腰果仁加工和出口国。依托东南部和西原地区的传统种植区，以及数十年积累的生产与加工经验，腰果产业已成为全球农产品供应链的重要组成部分。腰果口感自然香甜、醇厚绵密，富含植物蛋白、不饱和脂肪和人体必需的矿物质。多样的加工方式和产品规格，使腰果能够满足国际市场在消费、烹饪和贸易方面的多种需求。",
      ja: "## ベトナムのカシューナッツ\n\nベトナムは現在、カシューナッツの加工・輸出で世界をリードする国です。東南部と中部高原の伝統的な産地、そして数十年にわたって培われた生産・加工の経験により、カシューナッツ産業は世界の農産物サプライチェーンの重要な一部となっています。カシューナッツは自然な甘みとコクのある味わいが特長で、植物性たんぱく質、不飽和脂肪酸、必須ミネラルを豊富に含みます。多様な加工方法と製品規格により、国際市場における消費・料理・取引のさまざまなニーズに応えています。",
      ko: "## 베트남 캐슈넛\n\n베트남은 현재 캐슈넛 가공 및 수출 분야에서 세계를 선도하는 국가입니다. 동남부와 중부 고원의 전통 재배 지역, 그리고 수십 년간 쌓아 온 생산·가공 경험을 바탕으로 캐슈넛 산업은 세계 농산물 공급망의 중요한 일부가 되었습니다. 캐슈넛은 자연스러운 단맛과 고소하고 풍부한 맛을 지니며, 식물성 단백질, 불포화 지방, 필수 미네랄이 풍부합니다. 다양한 가공 방법과 제품 규격 덕분에 국제 시장의 소비, 요리, 무역 수요를 폭넓게 충족합니다.",
    },
    origin: {
      vi: "Bình Phước, Đồng Nai và các tỉnh Đông Nam Bộ – vùng điều lớn nhất Việt Nam.",
      en: "Binh Phuoc, Dong Nai and the South-East region – Vietnam’s largest cashew belt.",
      zh: "平福省、同奈省及东南部各省——越南最大的腰果产区。",
      ja: "ビンフオック省、ドンナイ省をはじめとする東南部地方――ベトナム最大のカシューナッツ産地。",
      ko: "빈프억성, 동나이성 등 동남부 지역 – 베트남 최대의 캐슈넛 산지.",
    },
    grades: [
      { code: "W180", label: { vi: "Nguyên hạt trắng, 180 hạt/lb", en: "White wholes, 180 kernels/lb", zh: "白色整仁，每磅180粒", ja: "ホワイトホール、1ポンドあたり180粒", ko: "백색 홀, 파운드당 180알" } },
      { code: "W210", label: { vi: "Nguyên hạt trắng, 210 hạt/lb", en: "White wholes, 210 kernels/lb", zh: "白色整仁，每磅210粒", ja: "ホワイトホール、1ポンドあたり210粒", ko: "백색 홀, 파운드당 210알" } },
      { code: "W240", label: { vi: "Nguyên hạt trắng, 240 hạt/lb", en: "White wholes, 240 kernels/lb", zh: "白色整仁，每磅240粒", ja: "ホワイトホール、1ポンドあたり240粒", ko: "백색 홀, 파운드당 240알" } },
      { code: "W320", label: { vi: "Nguyên hạt trắng, 320 hạt/lb", en: "White wholes, 320 kernels/lb", zh: "白色整仁，每磅320粒", ja: "ホワイトホール、1ポンドあたり320粒", ko: "백색 홀, 파운드당 320알" } },
      { code: "W450", label: { vi: "Nguyên hạt trắng, 450 hạt/lb", en: "White wholes, 450 kernels/lb", zh: "白色整仁，每磅450粒", ja: "ホワイトホール、1ポンドあたり450粒", ko: "백색 홀, 파운드당 450알" } },
      { code: "WS / LP", label: { vi: "Vỡ đôi, mảnh lớn", en: "White splits, large pieces", zh: "白色对半仁、大块碎仁", ja: "ホワイトスプリット、ラージピース", ko: "백색 반쪽, 큰 조각" } },
      { code: "RS", label: { vi: "Rang muối nguyên hạt", en: "Roasted & salted wholes", zh: "盐焗整仁", ja: "塩ロースト・ホール", ko: "소금 로스팅 홀" } },
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
      ja: [
        "真空／CO₂充填袋、1カートンあたり2 × 11.34 kg（50 lbs）",
        "ご要望に応じて缶詰め 2 × 11.34 kg",
        "小売パック 250 g – 1 kg、プライベートブランド（OEM）対応",
      ],
      ko: [
        "진공/CO₂ 충전 포장, 카톤당 2 × 11.34 kg(50 lbs)",
        "요청 시 틴 캔 포장 2 × 11.34 kg",
        "소매 포장 250 g – 1 kg, 자체 브랜드(OEM) 가능",
      ],
    },
    specs: [
      { label: { vi: "Độ ẩm", en: "Moisture", zh: "水分", ja: "水分", ko: "수분" }, value: "≤ 5%" },
      { label: { vi: "Hạt vỡ", en: "Broken kernels", zh: "碎仁率", ja: "ブロークン率", ko: "파쇄율" }, value: "≤ 5%" },
      { label: { vi: "Tạp chất", en: "Foreign matter", zh: "杂质", ja: "異物", ko: "이물질" }, value: "0%" },
      { label: { vi: "Hạn sử dụng", en: "Shelf life", zh: "保质期", ja: "賞味期限", ko: "유통기한" }, value: "12 – 24 m" },
    ],
    applications: {
      vi: ["Ăn vặt, bán lẻ", "Bánh kẹo, socola", "Sữa hạt, bơ hạt", "Nhà hàng, chế biến thực phẩm"],
      en: ["Snacking & retail", "Bakery & confectionery", "Nut milks & butters", "Food service & manufacturing"],
      zh: ["休闲零食、零售", "烘焙、糖果、巧克力", "坚果奶、坚果酱", "餐饮、食品加工"],
      ja: ["スナック・小売", "製菓・チョコレート", "ナッツミルク・ナッツバター", "外食・食品加工"],
      ko: ["간식·소매", "제과·초콜릿", "견과 우유·견과 버터", "외식·식품 제조"],
    },
  },
  {
    slug: "macadamia",
    name: { vi: "Hạt macca", en: "Macadamia nuts", zh: "夏威夷果", ja: "マカダミアナッツ", ko: "마카다미아" },
    latin: "Macadamia integrifolia",
    image: "macadamia",
    gallery: ["macadamiaTree", "macadamiaSpoon"],
    short: {
      vi: "Macca nguyên vỏ sấy nứt và nhân macca theo các style quốc tế, béo thơm tự nhiên.",
      en: "Cracked in-shell macadamias and kernels in international styles, naturally rich and creamy.",
      zh: "烘干开口带壳夏威夷果及按国际Style标准分级的果仁，天然香浓。",
      ja: "殻に割れ目を入れた乾燥殻付きマカダミアナッツと、国際規格（Style）で等級分けした実。自然な濃厚さとまろやかな風味。",
      ko: "껍질에 금을 내어 건조한 껍질째 마카다미아와 국제 스타일 기준의 알맹이, 자연 그대로의 고소하고 진한 맛.",
    },
    description: {
      vi: "## Mắc ca Việt Nam\n\nCó nguồn gốc từ Australia, mắc ca được đưa vào trồng tại Việt Nam từ những năm 1990 và hiện được phát triển chủ yếu tại Tây Nguyên và Tây Bắc. Với điều kiện khí hậu, độ cao và thổ nhưỡng phù hợp, đặc biệt là vùng đất đỏ bazan Tây Nguyên, cây mắc ca có nhiều tiềm năng phát triển tại Việt Nam. Hạt mắc ca được ưa chuộng bởi vị béo thanh, giòn nhẹ, hương thơm tự nhiên và giá trị dinh dưỡng cao, giàu chất béo không bão hòa, chất xơ, vitamin và khoáng chất. Cùng với sự mở rộng vùng nguyên liệu và đầu tư vào kỹ thuật canh tác, chế biến, mắc ca Việt Nam đang từng bước tham gia vào chuỗi cung ứng nông sản quốc tế, đáp ứng nhu cầu ngày càng đa dạng của thị trường thực phẩm và dinh dưỡng!",
      en: "## Vietnamese macadamias\n\nNative to Australia, macadamia was introduced to Vietnam in the 1990s and is now grown mainly in the Central Highlands and the North-West. With a suitable climate, altitude and soil, especially the red basalt soil of the Central Highlands, macadamia has strong potential in Vietnam. Macadamia nuts are prized for their clean, rich taste, light crunch, natural aroma and high nutritional value, and are rich in unsaturated fats, fibre, vitamins and minerals. As growing areas expand and investment in cultivation and processing increases, Vietnamese macadamias are steadily entering the international agricultural supply chain, meeting the increasingly diverse needs of the food and nutrition market.",
      zh: "## 越南夏威夷果\n\n夏威夷果原产于澳大利亚，20世纪90年代引入越南种植，目前主要分布在西原和西北地区。凭借适宜的气候、海拔和土壤条件，尤其是西原的红色玄武岩土壤，夏威夷果在越南具有很大的发展潜力。夏威夷果口感醇香清爽、微脆，带有天然香气，营养价值高，富含不饱和脂肪、膳食纤维、维生素和矿物质。随着原料产区的扩大以及对种植和加工技术的投入，越南夏威夷果正逐步进入国际农产品供应链，满足食品与营养市场日益多样化的需求。",
      ja: "## ベトナムのマカダミアナッツ\n\nオーストラリア原産のマカダミアは、1990年代にベトナムへ導入され、現在は主に中部高原と西北部で栽培されています。気候、標高、土壌の条件が適しており、特に中部高原の赤色玄武岩土壌に恵まれ、ベトナムでのマカダミア栽培には大きな可能性があります。マカダミアナッツは、すっきりとしたコク、軽やかな食感、自然な香り、そして高い栄養価で好まれ、不飽和脂肪酸、食物繊維、ビタミン、ミネラルを豊富に含みます。原料産地の拡大と栽培・加工技術への投資により、ベトナム産マカダミアは国際的な農産物サプライチェーンに着実に参入し、食品・栄養市場の多様化するニーズに応えています。",
      ko: "## 베트남 마카다미아\n\n호주가 원산지인 마카다미아는 1990년대에 베트남에 도입되었으며, 현재 주로 중부 고원과 서북부 지역에서 재배되고 있습니다. 적합한 기후, 고도, 토양 조건, 특히 중부 고원의 붉은 현무암 토양 덕분에 마카다미아는 베트남에서 큰 성장 잠재력을 지니고 있습니다. 마카다미아는 담백하면서도 고소한 맛, 가벼운 바삭함, 자연스러운 향, 높은 영양가로 사랑받으며 불포화 지방, 식이섬유, 비타민, 미네랄이 풍부합니다. 원료 재배지의 확대와 재배·가공 기술에 대한 투자로 베트남 마카다미아는 국제 농산물 공급망에 점차 참여하며, 식품 및 영양 시장의 점점 다양해지는 수요에 부응하고 있습니다.",
    },
    origin: {
      vi: "Tây Nguyên, tập trung tại Đắk Lắk.",
      en: "The Central Highlands, centred on Dak Lak province.",
      zh: "西原地区，主要集中在多乐省。",
      ja: "中部高原、主にダクラク省。",
      ko: "중부 고원, 닥락성 중심.",
    },
    grades: [
      { code: "NIS 22+", label: { vi: "Nguyên vỏ sấy nứt, cỡ ≥ 22 mm", en: "Cracked in-shell, ≥ 22 mm", zh: "烘干开口带壳，果径 ≥ 22 mm", ja: "割れ目入り殻付き、粒径 ≥ 22 mm", ko: "금 낸 껍질째, 지름 ≥ 22 mm" } },
      { code: "NIS 18–22", label: { vi: "Nguyên vỏ sấy nứt, cỡ 18–22 mm", en: "Cracked in-shell, 18–22 mm", zh: "烘干开口带壳，果径 18–22 mm", ja: "割れ目入り殻付き、粒径 18–22 mm", ko: "금 낸 껍질째, 지름 18–22 mm" } },
      { code: "Style 0", label: { vi: "Nhân nguyên hạt ≥ 20 mm", en: "Whole kernels ≥ 20 mm", zh: "整仁 ≥ 20 mm", ja: "ホール ≥ 20 mm", ko: "홀 알맹이 ≥ 20 mm" } },
      { code: "Style 1", label: { vi: "Nhân nguyên hạt ≥ 17 mm", en: "Whole kernels ≥ 17 mm", zh: "整仁 ≥ 17 mm", ja: "ホール ≥ 17 mm", ko: "홀 알맹이 ≥ 17 mm" } },
      { code: "Style 2", label: { vi: "Nhân nguyên & nửa hạt", en: "Wholes & halves mix", zh: "整仁与半仁混合", ja: "ホールとハーフのミックス", ko: "홀·하프 혼합" } },
      { code: "Style 4", label: { vi: "Nhân nửa hạt", en: "Halves", zh: "半仁", ja: "ハーフ", ko: "하프(반쪽)" } },
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
      ja: [
        "実：真空／N₂充填アルミ袋、1カートンあたり11.34 kg",
        "殻付き：メッシュ袋またはPE袋、10 – 25 kg",
        "小売パック 250 g – 1 kg、プライベートブランド（OEM）対応",
      ],
      ko: [
        "알맹이: 진공/N₂ 충전 알루미늄 포장, 카톤당 11.34 kg",
        "껍질째: 망사 자루 또는 PE 포대, 10 – 25 kg",
        "소매 포장 250 g – 1 kg, 자체 브랜드(OEM) 가능",
      ],
    },
    specs: [
      { label: { vi: "Độ ẩm nhân", en: "Kernel moisture", zh: "果仁水分", ja: "実の水分", ko: "알맹이 수분" }, value: "≤ 1.5%" },
      { label: { vi: "Độ ẩm nguyên vỏ", en: "In-shell moisture", zh: "带壳果水分", ja: "殻付きの水分", ko: "껍질째 수분" }, value: "≤ 3.5%" },
      { label: { vi: "Tạp chất", en: "Foreign matter", zh: "杂质", ja: "異物", ko: "이물질" }, value: "0%" },
      { label: { vi: "Hạn sử dụng", en: "Shelf life", zh: "保质期", ja: "賞味期限", ko: "유통기한" }, value: "12 m" },
    ],
    applications: {
      vi: ["Quà tặng, bán lẻ cao cấp", "Bánh kẹo, kem", "Sữa hạt, dầu macca", "Granola, ngũ cốc"],
      en: ["Gifting & premium retail", "Confectionery & ice cream", "Nut milks & macadamia oil", "Granola & cereals"],
      zh: ["礼品、高端零售", "糖果、冰淇淋", "坚果奶、夏威夷果油", "格兰诺拉麦片、谷物早餐"],
      ja: ["ギフト・高級小売", "製菓・アイスクリーム", "ナッツミルク・マカダミアオイル", "グラノーラ・シリアル"],
      ko: ["선물·프리미엄 소매", "제과·아이스크림", "견과 우유·마카다미아 오일", "그래놀라·시리얼"],
    },
  },
  {
    slug: "bird-nest",
    name: { vi: "Yến sào", en: "Edible bird’s nest", zh: "燕窝", ja: "ツバメの巣", ko: "제비집" },
    latin: "Aerodramus fuciphagus",
    image: "birdNest",
    gallery: ["birdNestRaw"],
    short: {
      vi: "Yến thô nguyên tổ, yến tinh chế rút lông và yến chưng sẵn từ nguồn yến Khánh Hòa.",
      en: "Raw whole nests, hand-cleaned nests and ready-to-drink bird’s nest from Khanh Hoa.",
      zh: "毛燕整盏、人工挑毛净燕盏及即食炖燕窝，源自庆和省燕窝产区。",
      ja: "カインホア産の未処理の巣（原巣）、手作業による毛取り済みの巣、燕の巣ドリンク。",
      ko: "카인호아산 원물 제비집, 수작업 세척·손질 제비집, 바로 마시는 제비집 음료.",
    },
    description: {
      vi: "Yến sào Khánh Hòa từ lâu được xem là đặc sản quý của Việt Nam. VSAP cung cấp yến thô nguyên tổ, yến tinh chế đã làm sạch lông bằng tay và yến chưng sẵn tiện dùng, cho cả đơn hàng xuất khẩu lẫn bán lẻ.",
      en: "Khanh Hoa bird’s nest has long been one of Vietnam’s most prized delicacies. VSAP supplies raw whole nests, hand-cleaned nests and ready-to-drink bird’s nest, for export orders and retail alike.",
      zh: "庆和燕窝历来被视为越南的珍贵特产。VSAP供应毛燕整盏、人工挑毛的净燕盏以及方便即食的炖燕窝，可同时满足出口订单与零售需求。",
      ja: "カインホアのツバメの巣は、古くからベトナムで最も珍重される特産品のひとつです。VSAPは未処理の原巣、手作業で毛を取り除いた毛取り済みの巣、手軽に飲める燕の巣ドリンクを、輸出・小売の両方に向けてご提供しています。",
      ko: "카인호아 제비집은 예로부터 베트남의 귀한 특산품으로 여겨져 왔습니다. VSAP는 원물 제비집, 손으로 깃털을 제거한 세척·손질 제비집, 간편하게 마시는 제비집 음료를 수출 주문과 소매 모두에 공급합니다.",
    },
    origin: {
      vi: "Khánh Hòa – Nha Trang, vùng yến sào nổi tiếng nhất Việt Nam.",
      en: "Khanh Hoa – Nha Trang, Vietnam’s best-known bird’s nest region.",
      zh: "庆和省芽庄——越南最负盛名的燕窝产区。",
      ja: "カインホア省・ニャチャン――ベトナムで最も名高いツバメの巣の産地。",
      ko: "카인호아·나짱 – 베트남에서 가장 유명한 제비집 산지.",
    },
    grades: [
      { code: "Yến thô", label: { vi: "Tổ yến nguyên, chưa làm sạch lông", en: "Raw whole nests, not yet cleaned", zh: "整盏毛燕，未挑毛", ja: "巣の形のままの原巣、毛取り前", ko: "통째 원물 제비집, 깃털 제거 전" } },
      { code: "Yến tinh chế", label: { vi: "Đã làm sạch lông, giữ dáng tổ", en: "Hand-cleaned nests, shape kept", zh: "已人工挑毛，保留盏形", ja: "手作業で毛取り済み、巣の形を保持", ko: "수작업 깃털 제거, 둥지 모양 유지" } },
      { code: "Yến chưng sẵn", label: { vi: "Hũ yến chưng, dùng ngay", en: "Ready-to-drink bird’s nest in jars", zh: "瓶装炖燕窝，开盖即食", ja: "瓶入り燕の巣ドリンク、開けてすぐ飲用可", ko: "병입 제비집 음료, 바로 섭취 가능" } },
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
      ja: [
        "原巣・毛取り済みの巣：ご希望の重量で箱詰め",
        "燕の巣ドリンク：瓶、マルチパック、ギフトボックス",
        "販売代理店向けプライベートブランド（OEM）包装",
      ],
      ko: [
        "원물·세척 제비집: 원하시는 중량으로 박스 포장",
        "제비집 음료: 병, 멀티팩, 선물 세트",
        "유통업체를 위한 자체 브랜드(OEM) 포장",
      ],
    },
    specs: [],
    applications: {
      vi: ["Quà biếu cao cấp", "Bồi bổ sức khoẻ gia đình", "Nhà hàng, khách sạn", "Đồ uống, thực phẩm chức năng"],
      en: ["Premium gifting", "Family wellness", "Restaurants & hotels", "Drinks & health foods"],
      zh: ["高端礼品", "家庭滋补养生", "餐厅、酒店", "饮品、保健食品"],
      ja: ["高級ギフト", "ご家族の健康づくり", "レストラン・ホテル", "飲料・健康食品"],
      ko: ["고급 선물", "가족 건강 관리", "레스토랑·호텔", "음료·건강식품"],
    },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

