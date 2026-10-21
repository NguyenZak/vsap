// Ảnh minh họa dùng trên site, lưu ở public/images.
// Tất cả lấy từ Wikimedia Commons với giấy phép CC0 / Public Domain (không bắt buộc ghi nguồn).
// TODO: thay dần bằng ảnh chụp thật vùng trồng, nhà máy và sản phẩm của VSAP — giữ nguyên key, chỉ đổi file.

type Img = { src: string; alt: { vi: string; en: string }; source: string };

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const images = {
  cashew: {
    src: "/images/cashew.webp",
    alt: { vi: "Nhân hạt điều nguyên hạt", en: "Whole cashew kernels" },
    source: commons("Pile_of_cashews.jpg"),
  },
  cashewKernels: {
    src: "/images/cashew-kernels.webp",
    alt: { vi: "Nhân điều trắng sau phân loại", en: "Graded white cashew kernels" },
    source: commons("Close-up_of_Vengurla_Cashews.jpg"),
  },
  cashewRoasted: {
    src: "/images/cashew-roasted.webp",
    alt: { vi: "Hạt điều rang", en: "Roasted cashews" },
    source: commons("Charcoal_roasted_cashews.jpg"),
  },
  cashewHarvest: {
    src: "/images/cashew-harvest.webp",
    alt: { vi: "Trái điều chín rụng dưới gốc, sẵn sàng thu nhặt", en: "Ripe cashew apples and nuts ready to be gathered" },
    source: commons("Ripened_cashew_fruits_and_nuts_that_have_fallen_from_the_trees.jpg"),
  },
  cashewProcessing: {
    src: "/images/cashew-processing.webp",
    alt: { vi: "Công nhân tách vỏ và phân loại nhân điều", en: "Workers shelling and separating cashew kernels" },
    source: commons("Factory_workers_engaged_in_deshelling,_scooping,_and_kernel_separation_of_cashew_nuts.jpg"),
  },
  cashewApple: {
    src: "/images/cashew-apple.webp",
    alt: { vi: "Trái điều chín cùng hạt", en: "Ripe cashew apple with its nut" },
    source: commons("Close-up_of_ripe_Vengurla_Cashew_fruit_with_nut.jpg"),
  },
  macadamia: {
    src: "/images/macadamia.webp",
    alt: { vi: "Hạt macca nguyên vỏ và vỏ đã tách", en: "Macadamia nuts in and out of the shell" },
    source: commons("Nuts_of_Macadamia_1152861.jpg"),
  },
  macadamiaSpoon: {
    src: "/images/macadamia-spoon.webp",
    alt: { vi: "Hạt macca sấy nứt vỏ", en: "Cracked in-shell macadamia nuts" },
    source: commons("Macadamia_nuts,_with_one_cracked_and_exposing_the_nut.jpg"),
  },
  macadamiaTree: {
    src: "/images/macadamia-tree.webp",
    alt: { vi: "Chùm hạt macca trên cây", en: "Macadamia nuts on the tree" },
    source: commons("MacadamiasN701.jpg"),
  },
  shipping: {
    src: "/images/shipping.webp",
    alt: { vi: "Tàu container trên sông Sài Gòn", en: "Container ships on the Saigon River" },
    source: commons("Container_ships_on_Saigon_River_2.jpg"),
  },
  cashewOrchard: {
    src: "/images/cashew-orchard.webp",
    alt: { vi: "Vườn điều xanh dưới bầu trời", en: "Cashew orchard under a blue sky" },
    source: commons("Cashew_Plantations_in_Dodamarg,_Sindhudurg,_Maharashtra,_India.jpg"),
  },
  cashewGrove: {
    src: "/images/cashew-grove.webp",
    alt: { vi: "Hàng cây điều trong vườn", en: "Rows of cashew trees" },
    source: commons("Cashew_plantation_at_Oke_onigbin.jpg"),
  },
  cashewTreeSky: {
    src: "/images/cashew-tree-sky.webp",
    alt: { vi: "Cây điều trưởng thành", en: "A mature cashew tree" },
    source: commons("Cashew_tree_(Anacardium_occidentale).jpg"),
  },
  farmerWatering: {
    src: "/images/farmer-watering.webp",
    alt: { vi: "Nông dân Việt Nam đội nón lá tưới rau", en: "Vietnamese farmer in a conical hat watering crops" },
    source: commons("Arrosage_des_cultures.JPG"),
  },
  farmerHoe: {
    src: "/images/farmer-hoe.webp",
    alt: { vi: "Nông dân làm đất trên ruộng rau", en: "Farmer tilling a vegetable plot" },
    source: commons("Peasant_in_the_vegetable_garden.JPG"),
  },
  paddyWork: {
    src: "/images/paddy-work.webp",
    alt: { vi: "Nông dân làm việc bên cánh đồng", en: "Farmers at work beside the fields" },
    source: commons("Rizière_dans_la_baie_d'Halong_intérieure.JPG"),
  },
} satisfies Record<string, Img>;

export type ImageKey = keyof typeof images;
