// Edit forms for the non-page content: products, retail packs, partners, settings and news posts.
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
  {
    key: "seo",
    label: "SEO",
    type: "group",
    help: "Để trống để dùng tên và mô tả ngắn của sản phẩm.",
    fields: [
      { key: "title", label: "Tiêu đề trên Google", type: "text" },
      { key: "description", label: "Mô tả trên Google", type: "textarea", rows: 2 },
    ],
  },
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
  seo: { title: l(""), description: l("") },
});

export const retailFields: FieldDef[] = [
  { key: "product", label: "Thuộc sản phẩm (slug)", type: "string", help: "Slug của sản phẩm chính, ví dụ: macadamia. Gói này hiện ở trang chi tiết sản phẩm đó." },
  { key: "name", label: "Tên", type: "text" },
  { key: "flavor", label: "Hương vị", type: "text" },
  { key: "pack", label: "Loại bao bì (chỉ dùng nội bộ, không hiện trên website)", type: "text" },
  { key: "price", label: "Giá bán (VNĐ)", type: "number", min: 0, step: 1000, help: "Để trống = hiện “Liên hệ” và nút “Hỏi giá”, sản phẩm không bán qua giỏ hàng." },
  { key: "oldPrice", label: "Giá cũ (VNĐ)", type: "number", min: 0, step: 1000, help: "Giá trước khi giảm, hiện gạch ngang cạnh giá bán kèm nhãn “-%”. Để trống nếu không giảm giá." },
  { key: "soldOut", label: "Tạm hết hàng (ẩn nút mua)", type: "boolean" },
  { key: "description", label: "Mô tả sản phẩm", type: "textarea", rows: 6, help: "Hiện ở trang riêng của sản phẩm. Để một dòng trống để tách đoạn." },
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
  price: null,
  oldPrice: null,
  soldOut: false,
  description: l(""),
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

export const policyFields: FieldDef[] = [
  { key: "slug", label: "Đường dẫn (slug)", type: "string", help: "Ví dụ: privacy → /vi/policies/privacy. Đổi slug sẽ đổi URL trang." },
  { key: "title", label: "Tiêu đề", type: "text" },
  { key: "updated", label: "Ngày cập nhật", type: "date" },
  {
    key: "body",
    label: "Nội dung",
    type: "markdown",
    help: "Mã {company} {taxId} {address} {phone} {email} {website} tự lấy từ mục Công ty. Để trống một ngôn ngữ thì trang đó hiện bản tiếng Anh.",
  },
];

export const newPolicy = () => ({ slug: "chinh-sach-moi", title: l("Chính sách mới", "New policy"), body: l(""), updated: new Date().toISOString().slice(0, 10) });

export const partnerFields: FieldDef[] = [
  { key: "name", label: "Tên đối tác", type: "string" },
  { key: "logo", label: "Logo", type: "media", help: "Ưu tiên SVG hoặc PNG nền trong suốt. Để trống thì hiện tên dạng chữ." },
  { key: "url", label: "Website", type: "link" },
];

export const settingsFields: FieldDef[] = [
  { key: "name", label: "Tên thương hiệu", type: "string" },
  { key: "legalName", label: "Tên công ty", type: "string" },
  { key: "legalNameEn", label: "Tên công ty bằng tiếng Anh", type: "string", help: "Theo giấy chứng nhận đăng ký doanh nghiệp; hiện ở các trang không phải tiếng Việt." },
  { key: "taxId", label: "Mã số doanh nghiệp (MST)", type: "string" },
  { key: "registeredAt", label: "Ngày đăng ký lần đầu", type: "date" },
  {
    key: "representative",
    label: "Người đại diện theo pháp luật",
    type: "group",
    help: "Chỉ hiện họ tên và chức danh. Không nhập số định danh, ngày sinh hay địa chỉ riêng.",
    fields: [
      { key: "name", label: "Họ và tên", type: "string" },
      { key: "title", label: "Chức danh", type: "text" },
    ],
  },
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
      { key: "title", label: "Tiêu đề trang chủ trên Google", type: "text" },
      { key: "description", label: "Mô tả mặc định", type: "textarea", rows: 2 },
      { key: "image", label: "Ảnh chia sẻ mặc định (1200×630)", type: "media", help: "Dùng khi trang không có ảnh riêng." },
    ],
  },
  {
    key: "social",
    label: "Mạng xã hội",
    type: "list",
    itemLabel: "mạng xã hội",
    titleKey: "name",
    help: "Hiện ở chân trang và giúp Google liên kết các trang của công ty.",
    fields: [
      { key: "name", label: "Tên (Facebook, YouTube, LinkedIn, Zalo OA…)", type: "string" },
      { key: "url", label: "Đường dẫn", type: "link" },
    ],
    newItem: () => ({ name: "Facebook", url: "https://www.facebook.com/" }),
  },
  {
    key: "verification",
    label: "Xác minh công cụ tìm kiếm",
    type: "group",
    help: "Dán mã trong thẻ meta xác minh (chỉ phần content).",
    fields: [
      { key: "google", label: "Google Search Console", type: "string" },
      { key: "bing", label: "Bing Webmaster", type: "string" },
    ],
  },
  {
    key: "analytics",
    label: "Thống kê truy cập",
    type: "group",
    fields: [{ key: "ga4", label: "Google Analytics 4 (G-XXXXXXX)", type: "string", help: "Để trống để không tải Google Analytics." }],
  },
];

export const pageSeoFields: FieldDef[] = [
  { key: "title", label: "Tiêu đề trên Google", type: "text", help: "Nên dài 30–60 ký tự." },
  { key: "description", label: "Mô tả trên Google", type: "textarea", rows: 3, help: "Nên dài 70–160 ký tự." },
  { key: "image", label: "Ảnh chia sẻ (Facebook, Zalo…)", type: "media", help: "Tỉ lệ 1200×630. Để trống thì dùng ảnh đầu trang." },
  { key: "noindex", label: "Ẩn trang khỏi Google (noindex)", type: "boolean" },
];

export const postFields: FieldDef[] = [
  { key: "title", label: "Tiêu đề", type: "text", help: "Để trống bản tiếng Anh nếu bài chỉ có tiếng Việt: bài sẽ không hiện ở trang /en." },
  { key: "slug", label: "Đường dẫn (slug)", type: "string", help: "Chữ thường không dấu và gạch ngang. Đổi slug sau khi đã đăng sẽ đổi URL bài." },
  { key: "date", label: "Ngày đăng", type: "date", help: "Chọn ngày trong tương lai để hẹn giờ: bài đã xuất bản chỉ hiện từ ngày đó." },
  { key: "category", label: "Chuyên mục", type: "text" },
  { key: "cover", label: "Ảnh bìa", type: "image" },
  { key: "excerpt", label: "Tóm tắt", type: "textarea", rows: 3, help: "Hiện trên thẻ bài và làm mô tả mặc định khi chia sẻ." },
  { key: "body", label: "Nội dung", type: "markdown" },
  { key: "author", label: "Tác giả", type: "string", placeholder: "VSAP" },
  {
    key: "seo",
    label: "SEO",
    type: "group",
    fields: [
      { key: "title", label: "Tiêu đề trên Google", type: "text", help: "Để trống để dùng tiêu đề bài." },
      { key: "description", label: "Mô tả trên Google", type: "textarea", rows: 2, help: "Để trống để dùng phần tóm tắt." },
    ],
  },
];

export const newPost = (date: string) => ({
  slug: "",
  title: l("Bài viết mới", ""),
  excerpt: l(""),
  cover: img("/images/cashew-harvest.webp", "Hạt điều thô vừa thu hoạch", "Freshly harvested raw cashew nuts"),
  body: l("Viết nội dung ở đây. Dùng thanh công cụ để thêm tiêu đề, ảnh, danh sách…", ""),
  category: l("Tin công ty", "Company news"),
  date,
  author: "VSAP",
  seo: { title: l(""), description: l("") },
});
