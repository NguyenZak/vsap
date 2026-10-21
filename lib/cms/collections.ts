// Edit forms for the non-page content: products, retail packs, partners and settings.
import { img, l, type FieldDef } from "./fields";

export const productFields: FieldDef[] = [
  { key: "slug", label: "Đường dẫn (slug)", type: "string", help: "Chỉ chữ thường không dấu và gạch ngang, ví dụ: hat-dieu. Đổi slug sẽ đổi URL trang." },
  { key: "name", label: "Tên sản phẩm", type: "text" },
  { key: "latin", label: "Tên khoa học", type: "string" },
  { key: "short", label: "Mô tả ngắn", type: "textarea", rows: 2 },
  { key: "description", label: "Mô tả chi tiết", type: "textarea", rows: 5 },
  { key: "origin", label: "Vùng nguyên liệu", type: "text" },
  { key: "image", label: "Ảnh chính", type: "image" },
  { key: "gallery", label: "Ảnh phụ", type: "list", itemLabel: "ảnh", fields: [{ key: "src", label: "Ảnh", type: "media" }, { key: "alt", label: "Mô tả ảnh", type: "text" }], newItem: () => img("/images/cashew.webp") },
  {
    key: "grades",
    label: "Phân loại",
    type: "list",
    itemLabel: "phân loại",
    titleKey: "code",
    fields: [
      { key: "code", label: "Mã", type: "string" },
      { key: "label", label: "Mô tả", type: "text" },
    ],
    newItem: () => ({ code: "W240", label: l("Mô tả", "Description") }),
  },
  { key: "packaging", label: "Quy cách đóng gói", type: "list", itemLabel: "quy cách", titleKey: "text", fields: [{ key: "text", label: "Nội dung", type: "text" }], newItem: () => ({ text: l("Quy cách", "Packing") }) },
  {
    key: "specs",
    label: "Chỉ tiêu",
    type: "list",
    itemLabel: "chỉ tiêu",
    titleKey: "value",
    fields: [
      { key: "label", label: "Tên chỉ tiêu", type: "text" },
      { key: "value", label: "Giá trị", type: "string" },
    ],
    newItem: () => ({ label: l("Độ ẩm", "Moisture"), value: "≤ 5%" }),
  },
  { key: "applications", label: "Ứng dụng", type: "list", itemLabel: "ứng dụng", titleKey: "text", fields: [{ key: "text", label: "Nội dung", type: "text" }], newItem: () => ({ text: l("Ứng dụng", "Use") }) },
];

export const newProduct = () => ({
  slug: "san-pham-moi",
  name: l("Sản phẩm mới", "New product"),
  latin: "",
  short: l("Mô tả ngắn.", "Short description."),
  description: l("Mô tả chi tiết.", "Full description."),
  origin: l("Việt Nam", "Vietnam"),
  image: img("/images/cashew.webp"),
  gallery: [],
  grades: [],
  packaging: [],
  specs: [],
  applications: [],
});

export const retailFields: FieldDef[] = [
  { key: "product", label: "Thuộc sản phẩm (slug)", type: "string", help: "Slug của sản phẩm chính, ví dụ: macadamia. Gói này hiện ở trang chi tiết sản phẩm đó." },
  { key: "name", label: "Tên", type: "text" },
  { key: "flavor", label: "Hương vị", type: "text" },
  { key: "pack", label: "Loại bao bì", type: "text" },
  { key: "weights", label: "Khối lượng", type: "string", help: "Cách nhau bằng dấu phẩy, ví dụ: 250 g, 500 g" },
  { key: "images", label: "Ảnh bao bì", type: "list", itemLabel: "ảnh", fields: [{ key: "src", label: "Ảnh", type: "media" }], newItem: () => ({ src: "" }), help: "Ảnh đầu tiên là ảnh mặt trước." },
  { key: "highlight", label: "Nhãn nổi bật", type: "text", help: "Để trống để ẩn." },
  { key: "ingredients", label: "Thành phần", type: "text" },
  { key: "shelfLife", label: "Hạn sử dụng", type: "text" },
  { key: "serving", label: "Khuyên dùng", type: "text", help: "Để trống để ẩn." },
  { key: "storage", label: "Bảo quản", type: "textarea", rows: 2 },
  { key: "packer", label: "Đơn vị đóng gói", type: "string" },
  { key: "packerAddress", label: "Địa chỉ đơn vị đóng gói", type: "text" },
  {
    key: "nutrition",
    label: "Dinh dưỡng trong 100 g",
    type: "group",
    help: "Để trống cả 4 ô để ẩn bảng dinh dưỡng.",
    fields: [
      { key: "energy", label: "Năng lượng", type: "string" },
      { key: "fat", label: "Chất béo", type: "string" },
      { key: "carbs", label: "Carbohydrate", type: "string" },
      { key: "protein", label: "Chất đạm", type: "string" },
    ],
  },
];

export const newRetailPack = () => ({
  id: `pack-${Date.now().toString(36)}`,
  product: "cashew",
  name: l("Sản phẩm mới", "New product"),
  flavor: l("Vị", "Flavour"),
  pack: l("Túi", "Pouch"),
  weights: "250 g",
  images: [],
  ingredients: l(""),
  highlight: l(""),
  shelfLife: l("12 tháng kể từ ngày sản xuất", "12 months from production date"),
  serving: l(""),
  storage: l("Bảo quản nơi khô ráo, thoáng mát.", "Store in a cool, dry place."),
  packer: "",
  packerAddress: l(""),
  nutrition: { energy: "", fat: "", carbs: "", protein: "" },
});

export const partnerFields: FieldDef[] = [
  { key: "name", label: "Tên đối tác", type: "string" },
  { key: "logo", label: "Logo", type: "media", help: "Ưu tiên SVG hoặc PNG nền trong suốt. Để trống thì hiện tên dạng chữ." },
  { key: "url", label: "Website", type: "link" },
];

export const settingsFields: FieldDef[] = [
  { key: "name", label: "Tên thương hiệu", type: "string" },
  { key: "legalName", label: "Tên công ty", type: "string" },
  { key: "tagline", label: "Slogan", type: "string" },
  { key: "about", label: "Giới thiệu ngắn (footer)", type: "textarea", rows: 2 },
  { key: "url", label: "Tên miền", type: "string" },
  { key: "email", label: "Email", type: "string" },
  { key: "phone", label: "Số điện thoại (hiển thị)", type: "string" },
  { key: "phoneE164", label: "Số điện thoại (quốc tế, để gọi)", type: "string", help: "Dạng +84962874111" },
  { key: "zalo", label: "Link Zalo", type: "link" },
  { key: "whatsapp", label: "Link WhatsApp", type: "link" },
  {
    key: "offices",
    label: "Văn phòng",
    type: "list",
    itemLabel: "văn phòng",
    titleKey: "label",
    fields: [
      { key: "label", label: "Tên", type: "text" },
      { key: "address", label: "Địa chỉ", type: "text" },
      { key: "street", label: "Số nhà, đường (cho Google)", type: "string" },
      { key: "locality", label: "Phường/xã (cho Google)", type: "string" },
      { key: "region", label: "Tỉnh/thành (cho Google)", type: "string" },
    ],
    newItem: () => ({ label: l("Văn phòng", "Office"), address: l(""), street: "", locality: "", region: "" }),
  },
  {
    key: "seo",
    label: "SEO mặc định",
    type: "group",
    fields: [
      { key: "title", label: "Tiêu đề trang", type: "text" },
      { key: "description", label: "Mô tả", type: "textarea", rows: 2 },
      { key: "image", label: "Ảnh chia sẻ mạng xã hội", type: "media" },
    ],
  },
];

export const pageSeoFields: FieldDef[] = [
  { key: "title", label: "Tiêu đề trang (SEO)", type: "text" },
  { key: "description", label: "Mô tả (SEO)", type: "textarea", rows: 2 },
];
