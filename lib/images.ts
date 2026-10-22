// Ảnh minh họa dùng trên site, lưu ở public/images (ảnh bao bì thật nằm riêng ở public/images/products).
// Nguồn: Pexels (giấy phép Pexels — dùng miễn phí, kể cả thương mại, không bắt buộc ghi nguồn);
// riêng ảnh yến sào từ Wikimedia Commons (public domain / CC0, cũng không bắt buộc ghi nguồn).
// Link gốc ở `source` của từng ảnh.
// TODO: thay dần bằng ảnh chụp thật vùng trồng, nhà máy của VSAP — giữ nguyên key, chỉ đổi file.

import type { Locale } from "./locales";

type Img = { src: string; alt: Record<Locale, string>; source: string };

const pexels = (id: number) => `https://www.pexels.com/photo/${id}/`;

export const images = {
  highlands: {
    src: "/images/highlands.webp",
    alt: { vi: "Núi đồi và dòng sông vùng Tây Nguyên", en: "Hills and river in Vietnam's Central Highlands", zh: "越南西原地区的山丘与河流", ja: "ベトナム中部高原の丘陵と川", ko: "베트남 중부 고원의 언덕과 강" },
    source: pexels(34978294),
  },
  highlandFarmers: {
    src: "/images/highland-farmers.webp",
    alt: { vi: "Nông dân Tây Nguyên thu hoạch nông sản tại Buôn Ma Thuột", en: "Central Highlands farmers harvesting in Buon Ma Thuot", zh: "西原地区农民在邦美蜀收获农产品", ja: "バンメトートで収穫する中部高原の農家", ko: "부온마투옷에서 농작물을 수확하는 중부 고원 농민" },
    source: pexels(27777801),
  },
  cashewOrchard: {
    src: "/images/cashew-orchard.webp",
    alt: { vi: "Trái điều chín đỏ giữa tán lá xanh", en: "Ripe red cashew apple among green leaves", zh: "绿叶间熟透的红色腰果梨", ja: "緑の葉の間で赤く熟したカシューアップル", ko: "푸른 잎 사이에 붉게 익은 캐슈 애플" },
    source: pexels(10615955),
  },
  cashewGrove: {
    src: "/images/cashew-grove.webp",
    alt: { vi: "Cây điều sai quả trong vườn", en: "Cashew tree bearing fruit in the orchard", zh: "果园中果实累累的腰果树", ja: "果樹園でたわわに実るカシューの木", ko: "과수원에서 열매가 주렁주렁 달린 캐슈나무" },
    source: pexels(10615952),
  },
  cashewTreeSky: {
    src: "/images/cashew-tree-sky.webp",
    alt: { vi: "Trái điều chín và non trên cành", en: "Ripe and young cashew fruits on the branch", zh: "枝头上成熟与未成熟的腰果果实", ja: "枝についた熟したカシューの実と若い実", ko: "가지에 달린 익은 캐슈 열매와 어린 열매" },
    source: pexels(10615965),
  },
  cashewApple: {
    src: "/images/cashew-apple.webp",
    alt: { vi: "Trái điều chín cùng hạt", en: "Ripe cashew apples with their nuts", zh: "成熟的腰果梨及其果实", ja: "ナッツの付いた熟したカシューアップル", ko: "견과가 달린 잘 익은 캐슈 애플" },
    source: pexels(7245665),
  },
  cashewHarvest: {
    src: "/images/cashew-harvest.webp",
    alt: { vi: "Hạt điều thô vừa thu hoạch", en: "Freshly harvested raw cashew nuts", zh: "刚收获的生腰果", ja: "収穫したばかりの殻付きカシューナッツ", ko: "갓 수확한 원물 캐슈넛" },
    source: pexels(34449058),
  },
  cashewProcessing: {
    src: "/images/cashew-processing.webp",
    alt: { vi: "Dây chuyền băng tải chế biến và phân loại hạt", en: "Conveyor line processing and sorting nuts", zh: "坚果加工与分拣输送线", ja: "ナッツを加工・選別するコンベヤーライン", ko: "견과를 가공·선별하는 컨베이어 라인" },
    source: pexels(11679685),
  },
  qualityInspection: {
    src: "/images/quality-inspection.webp",
    alt: { vi: "Bàn tay đeo găng kiểm tra, so sánh nhân điều đã bóc lụa và còn lụa", en: "Gloved hand inspecting peeled and unpeeled cashew kernels", zh: "戴手套的手检查并比较已去红衣与未去红衣的腰果仁", ja: "手袋をはめた手で、薄皮をむいたカシューナッツと薄皮付きのものを比べて検品する様子", ko: "장갑 낀 손으로 속껍질을 벗긴 캐슈넛과 벗기지 않은 캐슈넛을 비교·검사하는 모습" },
    source: pexels(36631826),
  },
  cashew: {
    src: "/images/cashew.webp",
    alt: { vi: "Nhân hạt điều nguyên hạt", en: "Whole cashew kernels", zh: "腰果整仁", ja: "カシューナッツのホール", ko: "통 캐슈넛 알맹이" },
    source: pexels(4663476),
  },
  cashewKernels: {
    src: "/images/cashew-kernels.webp",
    alt: { vi: "Nhân điều trắng sau phân loại", en: "Graded white cashew kernels", zh: "分级后的白腰果仁", ja: "等級分けされた白カシューナッツ", ko: "등급별로 선별된 백색 캐슈넛" },
    source: pexels(9811624),
  },
  cashewRoasted: {
    src: "/images/cashew-roasted.webp",
    alt: { vi: "Hạt điều rang vàng", en: "Golden roasted cashews", zh: "烘烤至金黄的腰果", ja: "こんがりきつね色にローストしたカシューナッツ", ko: "노릇하게 로스팅한 캐슈넛" },
    source: pexels(18876240),
  },
  macadamia: {
    src: "/images/macadamia.webp",
    alt: { vi: "Hạt macca nguyên vỏ và đã tách vỏ", en: "Macadamia nuts in and out of the shell", zh: "带壳与去壳的夏威夷果", ja: "殻付きと殻をむいたマカダミアナッツ", ko: "껍질째인 마카다미아와 껍질을 깐 마카다미아" },
    source: pexels(8162043),
  },
  macadamiaSpoon: {
    src: "/images/macadamia-spoon.webp",
    alt: { vi: "Hạt macca nguyên vỏ trong muỗng xúc", en: "In-shell macadamias in a scoop", zh: "量勺中的带壳夏威夷果", ja: "スコップに入った殻付きマカダミアナッツ", ko: "스쿱에 담긴 껍질째 마카다미아" },
    source: pexels(33793908),
  },
  macadamiaTree: {
    src: "/images/macadamia-tree.webp",
    alt: { vi: "Quả macca tươi còn vỏ xanh", en: "Fresh macadamias in their green husks", zh: "带青皮的新鲜夏威夷果", ja: "緑の外皮に包まれた新鮮なマカダミア", ko: "초록 겉껍질에 싸인 신선한 마카다미아" },
    source: pexels(8162041),
  },
  shipping: {
    src: "/images/shipping.webp",
    alt: { vi: "Tàu container cập cảng lúc hoàng hôn", en: "Container ship berthed at port at sunset", zh: "日落时分停靠港口的集装箱船", ja: "夕暮れの港に停泊するコンテナ船", ko: "해 질 녘 항구에 정박한 컨테이너선" },
    source: pexels(3856440),
  },
  farmerWatering: {
    src: "/images/farmer-watering.webp",
    alt: { vi: "Nông dân Việt Nam đội nón lá sàng nông sản dưới nắng", en: "Vietnamese farmer in a conical hat winnowing crops in the sun", zh: "头戴斗笠的越南农民在阳光下簸扬农产品", ja: "日差しの下、笠をかぶって農作物をふるうベトナムの農家", ko: "햇볕 아래 논라(베트남 삿갓)를 쓰고 곡물을 키질하는 베트남 농부" },
    source: pexels(29677339),
  },
  farmerHoe: {
    src: "/images/farmer-hoe.webp",
    alt: { vi: "Người nông dân đội nón lá trên đồi xanh", en: "Farmer in a conical hat on green hills", zh: "绿色山丘上头戴斗笠的农民", ja: "緑の丘に立つ笠をかぶった農家", ko: "푸른 언덕 위 논라를 쓴 농부" },
    source: pexels(25749202),
  },
  paddyWork: {
    src: "/images/paddy-work.webp",
    alt: { vi: "Nông dân chăm sóc cánh đồng xanh", en: "Farmer tending green fields", zh: "农民照料绿色田野", ja: "緑の田畑の手入れをする農家", ko: "푸른 들판을 가꾸는 농부" },
    source: pexels(32954652),
  },
  // Yến sào: Wikimedia Commons (public domain / CC0). Thay bằng ảnh thật của VSAP khi có, giữ nguyên tên file.
  birdNest: {
    src: "/images/bird-nest.webp",
    alt: { vi: "Tổ yến sào Khánh Hòa", en: "Khanh Hoa edible bird’s nests", zh: "庆和燕窝燕盏", ja: "カインホア産のツバメの巣", ko: "카인호아산 제비집" },
    source: "https://commons.wikimedia.org/wiki/File:Ediblebirdsnest.jpeg",
  },
  birdNestRaw: {
    src: "/images/bird-nest-raw.webp",
    alt: { vi: "Yến thô và yến tinh chế", en: "Raw and cleaned bird’s nests", zh: "毛燕与净燕", ja: "原巣と毛取り済みの巣", ko: "원물 제비집과 세척·손질 제비집" },
    source: "https://commons.wikimedia.org/wiki/File:Y%E1%BA%BFn_s%C3%A0o_th%C3%B4.jpg",
  },
} satisfies Record<string, Img>;

export type ImageKey = keyof typeof images;
