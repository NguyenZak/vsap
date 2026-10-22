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
    alt: { vi: "Núi đồi và dòng sông vùng Tây Nguyên", en: "Hills and river in Vietnam's Central Highlands", zh: "越南西原地区的山丘与河流" },
    source: pexels(34978294),
  },
  highlandFarmers: {
    src: "/images/highland-farmers.webp",
    alt: { vi: "Nông dân Tây Nguyên thu hoạch nông sản tại Buôn Ma Thuột", en: "Central Highlands farmers harvesting in Buon Ma Thuot", zh: "西原地区农民在邦美蜀收获农产品" },
    source: pexels(27777801),
  },
  cashewOrchard: {
    src: "/images/cashew-orchard.webp",
    alt: { vi: "Trái điều chín đỏ giữa tán lá xanh", en: "Ripe red cashew apple among green leaves", zh: "绿叶间熟透的红色腰果梨" },
    source: pexels(10615955),
  },
  cashewGrove: {
    src: "/images/cashew-grove.webp",
    alt: { vi: "Cây điều sai quả trong vườn", en: "Cashew tree bearing fruit in the orchard", zh: "果园中果实累累的腰果树" },
    source: pexels(10615952),
  },
  cashewTreeSky: {
    src: "/images/cashew-tree-sky.webp",
    alt: { vi: "Trái điều chín và non trên cành", en: "Ripe and young cashew fruits on the branch", zh: "枝头上成熟与未成熟的腰果果实" },
    source: pexels(10615965),
  },
  cashewApple: {
    src: "/images/cashew-apple.webp",
    alt: { vi: "Trái điều chín cùng hạt", en: "Ripe cashew apples with their nuts", zh: "成熟的腰果梨及其果实" },
    source: pexels(7245665),
  },
  cashewHarvest: {
    src: "/images/cashew-harvest.webp",
    alt: { vi: "Hạt điều thô vừa thu hoạch", en: "Freshly harvested raw cashew nuts", zh: "刚收获的生腰果" },
    source: pexels(34449058),
  },
  cashewProcessing: {
    src: "/images/cashew-processing.webp",
    alt: { vi: "Dây chuyền băng tải chế biến và phân loại hạt", en: "Conveyor line processing and sorting nuts", zh: "坚果加工与分拣输送线" },
    source: pexels(11679685),
  },
  qualityInspection: {
    src: "/images/quality-inspection.webp",
    alt: { vi: "Bàn tay đeo găng kiểm tra, so sánh nhân điều đã bóc lụa và còn lụa", en: "Gloved hand inspecting peeled and unpeeled cashew kernels", zh: "戴手套的手检查并比较已去红衣与未去红衣的腰果仁" },
    source: pexels(36631826),
  },
  cashew: {
    src: "/images/cashew.webp",
    alt: { vi: "Nhân hạt điều nguyên hạt", en: "Whole cashew kernels", zh: "腰果整仁" },
    source: pexels(4663476),
  },
  cashewKernels: {
    src: "/images/cashew-kernels.webp",
    alt: { vi: "Nhân điều trắng sau phân loại", en: "Graded white cashew kernels", zh: "分级后的白腰果仁" },
    source: pexels(9811624),
  },
  cashewRoasted: {
    src: "/images/cashew-roasted.webp",
    alt: { vi: "Hạt điều rang vàng", en: "Golden roasted cashews", zh: "烘烤至金黄的腰果" },
    source: pexels(18876240),
  },
  macadamia: {
    src: "/images/macadamia.webp",
    alt: { vi: "Hạt macca nguyên vỏ và đã tách vỏ", en: "Macadamia nuts in and out of the shell", zh: "带壳与去壳的夏威夷果" },
    source: pexels(8162043),
  },
  macadamiaSpoon: {
    src: "/images/macadamia-spoon.webp",
    alt: { vi: "Hạt macca nguyên vỏ trong muỗng xúc", en: "In-shell macadamias in a scoop", zh: "量勺中的带壳夏威夷果" },
    source: pexels(33793908),
  },
  macadamiaTree: {
    src: "/images/macadamia-tree.webp",
    alt: { vi: "Quả macca tươi còn vỏ xanh", en: "Fresh macadamias in their green husks", zh: "带青皮的新鲜夏威夷果" },
    source: pexels(8162041),
  },
  shipping: {
    src: "/images/shipping.webp",
    alt: { vi: "Tàu container cập cảng lúc hoàng hôn", en: "Container ship berthed at port at sunset", zh: "日落时分停靠港口的集装箱船" },
    source: pexels(3856440),
  },
  farmerWatering: {
    src: "/images/farmer-watering.webp",
    alt: { vi: "Nông dân Việt Nam đội nón lá sàng nông sản dưới nắng", en: "Vietnamese farmer in a conical hat winnowing crops in the sun", zh: "头戴斗笠的越南农民在阳光下簸扬农产品" },
    source: pexels(29677339),
  },
  farmerHoe: {
    src: "/images/farmer-hoe.webp",
    alt: { vi: "Người nông dân đội nón lá trên đồi xanh", en: "Farmer in a conical hat on green hills", zh: "绿色山丘上头戴斗笠的农民" },
    source: pexels(25749202),
  },
  paddyWork: {
    src: "/images/paddy-work.webp",
    alt: { vi: "Nông dân chăm sóc cánh đồng xanh", en: "Farmer tending green fields", zh: "农民照料绿色田野" },
    source: pexels(32954652),
  },
  // Yến sào: Wikimedia Commons (public domain / CC0). Thay bằng ảnh thật của VSAP khi có, giữ nguyên tên file.
  birdNest: {
    src: "/images/bird-nest.webp",
    alt: { vi: "Tổ yến sào Khánh Hòa", en: "Khanh Hoa edible bird’s nests", zh: "庆和燕窝燕盏" },
    source: "https://commons.wikimedia.org/wiki/File:Ediblebirdsnest.jpeg",
  },
  birdNestRaw: {
    src: "/images/bird-nest-raw.webp",
    alt: { vi: "Yến thô và yến tinh chế", en: "Raw and cleaned bird’s nests", zh: "毛燕与净燕" },
    source: "https://commons.wikimedia.org/wiki/File:Y%E1%BA%BFn_s%C3%A0o_th%C3%B4.jpg",
  },
} satisfies Record<string, Img>;

export type ImageKey = keyof typeof images;
