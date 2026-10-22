// Thông tin doanh nghiệp dùng chung toàn site (footer, trang Liên hệ, dữ liệu có cấu trúc cho Google).
import type { Locale } from "./i18n";

type Office = {
  label: Record<Locale, string>;
  address: Record<Locale, string>;
  /** schema.org PostalAddress fields */
  postal: { streetAddress: string; addressLocality: string; addressRegion: string };
};

const offices: Office[] = [
  {
    label: { vi: "Trụ sở", en: "Head office", zh: "总部", ja: "本社", ko: "본사" },
    address: {
      vi: "Thôn 3, xã Ea Súp, tỉnh Đắk Lắk",
      en: "Hamlet 3, Ea Sup Commune, Dak Lak Province, Vietnam",
      zh: "越南多乐省 Ea Súp 乡第3村",
      ja: "ベトナム ダクラク省 Ea Súp 社 第3村",
      ko: "베트남 닥락성 Ea Súp 사 제3마을",
    },
    postal: { streetAddress: "Thôn 3", addressLocality: "Xã Ea Súp", addressRegion: "Đắk Lắk" },
  },
  {
    label: { vi: "Văn phòng Hà Nội", en: "Hanoi office", zh: "河内办事处", ja: "ハノイ事務所", ko: "하노이 사무소" },
    address: {
      vi: "Tầng 1, Tòa nhà An Sinh B, số 106 Lưu Hữu Phước, phường Từ Liêm, TP Hà Nội",
      en: "1st Floor, An Sinh B Building, 106 Luu Huu Phuoc, Tu Liem Ward, Hanoi, Vietnam",
      zh: "越南河内市 Từ Liêm 坊 Lưu Hữu Phước 街106号 An Sinh B 大厦1楼",
      ja: "ベトナム ハノイ市 Từ Liêm 坊 Lưu Hữu Phước 通り106番地 An Sinh B ビル1階",
      ko: "베트남 하노이시 Từ Liêm 동 Lưu Hữu Phước 거리 106번지 An Sinh B 빌딩 1층",
    },
    postal: {
      streetAddress: "Tầng 1, Tòa nhà An Sinh B, số 106 Lưu Hữu Phước",
      addressLocality: "Phường Từ Liêm",
      addressRegion: "Hà Nội",
    },
  },
];

export const site = {
  name: "VSAP",
  /** VSAP là thương hiệu (sản phẩm) của công ty này. */
  legalName: "Công ty Cổ phần Nông sản Tinh Hoa Việt",
  /** Theo Giấy chứng nhận đăng ký doanh nghiệp (đăng ký lần đầu 11/05/2026). */
  legalNameEn: "Vietnamese Essence Agricultural Products Joint Stock Company",
  taxId: "6001835108",
  registeredAt: "2026-05-11",
  representative: {
    name: "Đỗ Quý Tín",
    title: { vi: "Giám đốc", en: "Director", zh: "总经理", ja: "代表取締役", ko: "대표이사" },
  },
  tagline: "Good Food – Good Health",
  url: "https://vsap.com.vn",
  email: "acc.vsap@gmail.com",
  phone: "(+84) 962 874 111",
  /** E.164 form for tel: links and structured data. */
  phoneE164: "+84962874111",
  /** Chat links for the floating buttons. Assumed to use the same number as the phone line. */
  zalo: "https://zalo.me/0962874111",
  whatsapp: "https://wa.me/84962874111",
  offices,
} as const;
