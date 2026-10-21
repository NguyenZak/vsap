// Đối tác đang làm việc cùng VSAP, hiển thị ở section "Đối tác" trên trang chủ.
// Chỉ thêm đối tác thật, đã đồng ý xuất hiện trên website.
// Có logo thì đặt file vào public/images/partners/ và điền `logo` (ví dụ "/images/partners/fine-farm.svg").
import type { Locale } from "./i18n";

type L = Record<Locale, string>;

export type Partner = {
  name: string;
  role: L;
  location: L;
  logo?: string;
  url?: string;
};

export const partners: Partner[] = [
  {
    name: "Công ty TNHH Fine Farm",
    role: { vi: "Đối tác chế biến & đóng gói hạt macca", en: "Macadamia processing & packing partner" },
    location: { vi: "Tân An, Đắk Lắk", en: "Tan An, Dak Lak" },
  },
  {
    name: "Công ty TNHH MTV DV XNK Hoàng Khang",
    role: { vi: "Đối tác rang & đóng gói hạt điều", en: "Cashew roasting & packing partner" },
    location: { vi: "Phước Vĩnh, Đồng Nai", en: "Phuoc Vinh, Dong Nai" },
  },
];
