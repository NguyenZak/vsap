// Ảnh minh họa dùng trên site, lưu ở public/images (ảnh bao bì thật nằm riêng ở public/images/products).
// Nguồn: Pexels (giấy phép Pexels — dùng miễn phí, kể cả thương mại, không bắt buộc ghi nguồn).
// Link gốc ở `source` của từng ảnh.
// TODO: thay dần bằng ảnh chụp thật vùng trồng, nhà máy của VSAP — giữ nguyên key, chỉ đổi file.

type Img = { src: string; alt: { vi: string; en: string }; source: string };

const pexels = (id: number) => `https://www.pexels.com/photo/${id}/`;

export const images = {
  highlands: {
    src: "/images/highlands.webp",
    alt: { vi: "Núi đồi và dòng sông vùng Tây Nguyên", en: "Hills and river in Vietnam's Central Highlands" },
    source: pexels(34978294),
  },
  highlandFarmers: {
    src: "/images/highland-farmers.webp",
    alt: { vi: "Nông dân Tây Nguyên thu hoạch nông sản tại Buôn Ma Thuột", en: "Central Highlands farmers harvesting in Buon Ma Thuot" },
    source: pexels(27777801),
  },
  cashewOrchard: {
    src: "/images/cashew-orchard.webp",
    alt: { vi: "Trái điều chín đỏ giữa tán lá xanh", en: "Ripe red cashew apple among green leaves" },
    source: pexels(10615955),
  },
  cashewGrove: {
    src: "/images/cashew-grove.webp",
    alt: { vi: "Cây điều sai quả trong vườn", en: "Cashew tree bearing fruit in the orchard" },
    source: pexels(10615952),
  },
  cashewTreeSky: {
    src: "/images/cashew-tree-sky.webp",
    alt: { vi: "Trái điều chín và non trên cành", en: "Ripe and young cashew fruits on the branch" },
    source: pexels(10615965),
  },
  cashewApple: {
    src: "/images/cashew-apple.webp",
    alt: { vi: "Trái điều chín cùng hạt", en: "Ripe cashew apples with their nuts" },
    source: pexels(7245665),
  },
  cashewHarvest: {
    src: "/images/cashew-harvest.webp",
    alt: { vi: "Hạt điều thô vừa thu hoạch", en: "Freshly harvested raw cashew nuts" },
    source: pexels(34449058),
  },
  cashewProcessing: {
    src: "/images/cashew-processing.webp",
    alt: { vi: "Dây chuyền băng tải chế biến và phân loại hạt", en: "Conveyor line processing and sorting nuts" },
    source: pexels(11679685),
  },
  qualityInspection: {
    src: "/images/quality-inspection.webp",
    alt: { vi: "Bàn tay đeo găng kiểm tra, so sánh nhân điều đã bóc lụa và còn lụa", en: "Gloved hand inspecting peeled and unpeeled cashew kernels" },
    source: pexels(36631826),
  },
  cashew: {
    src: "/images/cashew.webp",
    alt: { vi: "Nhân hạt điều nguyên hạt", en: "Whole cashew kernels" },
    source: pexels(4663476),
  },
  cashewKernels: {
    src: "/images/cashew-kernels.webp",
    alt: { vi: "Nhân điều trắng sau phân loại", en: "Graded white cashew kernels" },
    source: pexels(9811624),
  },
  cashewRoasted: {
    src: "/images/cashew-roasted.webp",
    alt: { vi: "Hạt điều rang vàng", en: "Golden roasted cashews" },
    source: pexels(18876240),
  },
  macadamia: {
    src: "/images/macadamia.webp",
    alt: { vi: "Hạt macca nguyên vỏ và đã tách vỏ", en: "Macadamia nuts in and out of the shell" },
    source: pexels(8162043),
  },
  macadamiaSpoon: {
    src: "/images/macadamia-spoon.webp",
    alt: { vi: "Hạt macca nguyên vỏ trong muỗng xúc", en: "In-shell macadamias in a scoop" },
    source: pexels(33793908),
  },
  macadamiaTree: {
    src: "/images/macadamia-tree.webp",
    alt: { vi: "Quả macca tươi còn vỏ xanh", en: "Fresh macadamias in their green husks" },
    source: pexels(8162041),
  },
  shipping: {
    src: "/images/shipping.webp",
    alt: { vi: "Tàu container cập cảng lúc hoàng hôn", en: "Container ship berthed at port at sunset" },
    source: pexels(3856440),
  },
  farmerWatering: {
    src: "/images/farmer-watering.webp",
    alt: { vi: "Nông dân Việt Nam đội nón lá sàng nông sản dưới nắng", en: "Vietnamese farmer in a conical hat winnowing crops in the sun" },
    source: pexels(29677339),
  },
  farmerHoe: {
    src: "/images/farmer-hoe.webp",
    alt: { vi: "Người nông dân đội nón lá trên đồi xanh", en: "Farmer in a conical hat on green hills" },
    source: pexels(25749202),
  },
  paddyWork: {
    src: "/images/paddy-work.webp",
    alt: { vi: "Nông dân chăm sóc cánh đồng xanh", en: "Farmer tending green fields" },
    source: pexels(32954652),
  },
} satisfies Record<string, Img>;

export type ImageKey = keyof typeof images;
