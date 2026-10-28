"use client";

import { useState } from "react";
import type { UiStrings } from "@/lib/cms/types";
import { locales, type Locale } from "@/lib/locales";
import { Panel } from "./PageEditor";

type Path = (string | number)[];

const groups: Record<keyof UiStrings, string> = {
  nav: "Menu & nút đầu trang",
  common: "Nút & nhãn dùng chung",
  footer: "Chân trang",
  chat: "Nút liên hệ nổi (Zalo/WhatsApp)",
  contactInfo: "Thẻ liên hệ",
  form: "Form yêu cầu báo giá",
  productDetail: "Trang chi tiết sản phẩm",
  news: "Tin tức",
  retail: "Thông tin bao bì bán lẻ",
  shop: "Cửa hàng & giỏ hàng",
};

/** Vietnamese labels for the keys an editor is likely to puzzle over. */
const keyLabels: Record<string, string> = {
  home: "Trang chủ",
  about: "Về VSAP",
  products: "Sản phẩm",
  quality: "Chất lượng",
  contact: "Liên hệ",
  quote: "Nút báo giá",
  menu: "Mở menu (đọc màn hình)",
  close: "Đóng menu (đọc màn hình)",
  viewProduct: "Xem chi tiết",
  requestQuote: "Yêu cầu báo giá",
  allProducts: "Tất cả sản phẩm",
  prev: "Trước",
  next: "Sau",
  pause: "Tạm dừng",
  play: "Tự chạy",
  slide: "Slide",
  step: "Bước",
  photo: "Ảnh",
  explore: "Tiêu đề cột Khám phá",
  rights: "Bản quyền",
  brandOf: "“Sản phẩm của”",
  label: "Nhãn nhóm",
  call: "Gọi",
  email: "Email",
  phone: "Điện thoại",
  website: "Website",
  name: "Họ tên",
  company: "Công ty",
  country: "Quốc gia",
  product: "Sản phẩm quan tâm",
  productOptions: "Lựa chọn sản phẩm",
  other: "Lựa chọn “Khác”",
  quantity: "Số lượng",
  quantityPlaceholder: "Gợi ý số lượng",
  message: "Nội dung",
  messagePlaceholder: "Gợi ý nội dung",
  submit: "Nút gửi",
  sending: "Đang gửi",
  success: "Thông báo gửi thành công",
  error: "Thông báo lỗi",
  required: "Bắt buộc",
  origin: "Vùng nguyên liệu",
  grades: "Phân loại",
  packaging: "Quy cách đóng gói",
  specs: "Chỉ tiêu",
  applications: "Ứng dụng",
  back: "Quay lại",
  inquireTitle: "Tiêu đề khối báo giá",
  inquireBody: "Mô tả khối báo giá",
  specsNote: "Ghi chú chỉ tiêu",
  packsEyebrow: "Nhãn khối bao bì",
  packsTitle: "Tiêu đề khối bao bì",
  packsAccent: "Tiêu đề khối bao bì (nghiêng)",
  sizes: "Quy cách",
  ingredients: "Thành phần",
  nutrition: "Dinh dưỡng",
  energy: "Năng lượng",
  fat: "Chất béo",
  carbs: "Carbohydrate",
  protein: "Chất đạm",
  shelfLife: "Hạn sử dụng",
  serving: "Khuyên dùng",
  storage: "Bảo quản",
  packedBy: "Đóng gói tại",
  view: "Xem chi tiết",
  news: "Tin tức",
  health: "Sức khỏe và đời sống",
  readMore: "Đọc tiếp",
  published: "“Đăng ngày”",
  minutes: "“phút đọc”",
  more: "Tiêu đề “Bài viết khác”",
  empty: "Khi chưa có bài",
  ctaTitle: "Tiêu đề khối báo giá cuối bài",
  ctaBody: "Mô tả khối báo giá cuối bài",
  share: "Chia sẻ",
  zalo: "Zalo",
  whatsapp: "WhatsApp",
  addToCart: "Nút thêm vào giỏ",
  buyNow: "Nút mua ngay",
  quickView: "Nút xem nhanh",
  askPrice: "Nút hỏi giá (sản phẩm chưa có giá)",
  contactPrice: "Chữ thay giá khi chưa có giá",
  from: "“Từ” (trước giá thấp nhất)",
  inStock: "Còn hàng",
  soldOut: "Hết hàng",
  status: "Nhãn tình trạng",
  brand: "Nhãn thương hiệu",
  size: "Nhãn quy cách",
  price: "Nhãn giá",
  description: "Tiêu đề mô tả sản phẩm",
  showMore: "Nút xem thêm mô tả",
  showLess: "Nút thu gọn mô tả",
  related: "Tiêu đề sản phẩm liên quan",
  recent: "Tiêu đề sản phẩm đã xem",
  details: "Tiêu đề thông tin sản phẩm",
  perk1: "Cam kết 1",
  perk2: "Cam kết 2",
  perk3: "Cam kết 3",
  perk4: "Cam kết 4",
  perk5: "Cam kết 5",
  perk6: "Cam kết 6",
  copyLink: "Nút sao chép liên kết",
  copied: "Thông báo đã sao chép",
  cart: "Giỏ hàng",
  cartEmpty: "Khi giỏ hàng trống",
  continueShopping: "Nút tiếp tục mua",
  subtotal: "Tạm tính",
  shippingNote: "Ghi chú phí giao hàng",
  checkout: "Nút tiến hành đặt hàng",
  remove: "Nút xoá khỏi giỏ",
  decrease: "Giảm số lượng (đọc màn hình)",
  increase: "Tăng số lượng (đọc màn hình)",
  checkoutTitle: "Tiêu đề trang đặt hàng",
  checkoutLead: "Mô tả trang đặt hàng",
  yourOrder: "Tiêu đề tóm tắt đơn",
  address: "Địa chỉ nhận hàng",
  note: "Ghi chú của khách",
  notePlaceholder: "Gợi ý ghi chú",
  payment: "Hình thức thanh toán",
  placeOrder: "Nút đặt hàng",
  placing: "Đang gửi đơn",
  successTitle: "Tiêu đề khi đặt hàng xong",
  successBody: "Nội dung khi đặt hàng xong ({id} = mã đơn)",
  oldPrice: "Nhãn giá cũ (đọc màn hình)",
  taxId: "Nhãn mã số doanh nghiệp",
  registered: "Nhãn ngày đăng ký",
  representative: "Nhãn người đại diện",
  policies: "Tiêu đề cột Chính sách",
  policyUpdated: "Nhãn ngày cập nhật chính sách",
  agree: "Câu đồng ý khi đặt hàng ({terms}, {privacy} = liên kết)",
  province: "Ô tỉnh/thành phố",
  ward: "Ô phường/xã",
  street: "Ô số nhà, tên đường",
  streetPlaceholder: "Gợi ý số nhà, tên đường",
  selectProvince: "Chữ khi chưa chọn tỉnh",
  selectWard: "Chữ khi chưa chọn phường/xã",
};

const inputCls = "w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-sun-400/50";

type Strings = Record<string, unknown>;

function Rows({ byLang, path, onChange }: { byLang: Record<Locale, Strings>; path: Path; onChange: (path: Path, v: unknown) => void }) {
  // Keys come from the Vietnamese strings; the other languages are matched by key.
  const sub = (k: string) => Object.fromEntries(locales.map((l) => [l, (byLang[l]?.[k] ?? {}) as Strings])) as Record<Locale, Strings>;
  return (
    <div className="space-y-3">
      {Object.entries(byLang.vi).map(([k, v]) => {
        if (v && typeof v === "object") {
          return (
            <fieldset key={k} className="rounded-lg border border-mist-200 p-3">
              <legend className="px-1 text-xs font-medium text-ink-900">{keyLabels[k] ?? k}</legend>
              <Rows byLang={sub(k)} path={[...path, k]} onChange={onChange} />
            </fieldset>
          );
        }
        return (
          <div key={k}>
            <p className="mb-1 text-xs font-medium text-ink-900">
              {keyLabels[k] ?? k} <span className="font-mono font-normal text-ink-400">· {k}</span>
            </p>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {locales.map((lang) => (
                <label key={lang} className="relative block">
                  <span className="pointer-events-none absolute top-2 left-2.5 rounded bg-mist-100 px-1 text-[10px] font-semibold text-ink-600 uppercase">{lang}</span>
                  <input
                    value={String(byLang[lang]?.[k] ?? "")}
                    onChange={(e) => onChange(["ui", lang, ...path, k], e.target.value)}
                    className={`${inputCls} pl-10`}
                  />
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Every interface string, grouped, with the site languages side by side. */
export function UiEditor({ ui, onChange }: { ui: Record<Locale, UiStrings>; onChange: (path: Path, v: unknown) => void }) {
  const keys = Object.keys(groups) as (keyof UiStrings)[];
  const [group, setGroup] = useState<keyof UiStrings>("nav");
  return (
    <>
      <aside className="flex w-64 shrink-0 flex-col border-r border-mist-200 bg-white">
        <div className="border-b border-mist-200 px-4 py-4">
          <h2 className="text-base font-medium text-ink-900">Chữ giao diện</h2>
          <p className="mt-0.5 text-xs leading-snug text-ink-600">Nhãn nút, menu, form… dùng chung trên mọi trang.</p>
        </div>
        <nav className="space-y-0.5 p-3">
          {keys.map((k) => (
            <button key={k} type="button" onClick={() => setGroup(k)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${group === k ? "bg-forest-900 text-white" : "text-ink-900 hover:bg-mist-100"}`}>
              {groups[k]}
            </button>
          ))}
        </nav>
      </aside>
      <section className="flex w-[34rem] shrink-0 flex-col border-r border-mist-200 bg-white">
        <Panel title={groups[group]}>
          <Rows byLang={Object.fromEntries(locales.map((l) => [l, (ui[l]?.[group] ?? {}) as Strings])) as Record<Locale, Strings>} path={[group]} onChange={onChange} />
        </Panel>
      </section>
    </>
  );
}
