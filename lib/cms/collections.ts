// Edit forms for the non-page content: products, retail packs, partners, settings and news posts.
import { img, l, textEffectsField, type FieldDef } from "./fields";

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
  { key: "hidden", label: "Ẩn khỏi website (vẫn giữ dữ liệu)", type: "boolean" },
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
  hidden: false,
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
  {
    key: "productFrame",
    label: "Khung ảnh sản phẩm",
    type: "media",
    help: "Ảnh SVG hoặc PNG nền trong suốt, tỉ lệ 3:4 (dọc), phủ lên ảnh của mọi thẻ sản phẩm. Giữ phần giữa trống để không che sản phẩm. Để trống để bỏ khung.",
  },
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
  { key: "url", label: "Tên miền", type: "string", help: "Ví dụ: https://vsap.com.vn (thiếu https:// sẽ tự thêm khi lưu)." },
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
    help: "Chỉ dùng khi một trang chưa có SEO riêng. Tiêu đề, mô tả trang chủ trên Google sửa ở Trang › Trang chủ › Cài đặt trang (SEO).",
    fields: [
      { key: "title", label: "Tiêu đề mặc định", type: "text" },
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

/** Font picker (built-in fonts + Studio › Giao diện › Font tự thêm); "" keeps the design's font. */
const fontField = (key: string, label: string, fallback: string): FieldDef => ({ key, label, type: "font", fallback });

export const darkModeFields: FieldDef[] = [
  {
    key: "darkMode",
    label: "Chế độ tối (dark mode)",
    type: "select",
    options: [
      { value: "light", label: "Sáng" },
      { value: "dark", label: "Tối: nền đen cho toàn website" },
      { value: "system", label: "Theo máy người xem (sáng hoặc tối)" },
    ],
    help: "Chỉ admin chọn ở đây, khách không có nút chuyển. Ở chế độ tối, màu chữ chung chọn ở dưới tạm bỏ để chữ không tối trên nền đen; section có màu nền riêng giữ giao diện sáng. Bấm Xuất bản để áp dụng.",
  },
];

export const customFontFields: FieldDef[] = [
  {
    key: "fonts",
    label: "Font tự thêm",
    type: "list",
    itemLabel: "font",
    titleKey: "name",
    help: "Font thêm ở đây sẽ có trong mọi ô chọn font. Nên chọn font có đủ dấu tiếng Việt.",
    fields: [
      { key: "name", label: "Tên font (font-family)", type: "string", placeholder: "VD: Lexend", help: "Đúng tên trong file CSS của font. Để trống nếu dán link Google Fonts: tên lấy từ link." },
      {
        key: "link",
        label: "Dán link font",
        type: "string",
        placeholder: "https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&display=swap",
        help: "Link CSS (Google Fonts, Adobe Fonts…) hoặc link thẳng tới file .woff2 / .ttf. Chỉ nhận https://",
      },
      {
        key: "files",
        label: "Hoặc tải file font lên",
        type: "list",
        itemLabel: "file",
        titleKey: "weight",
        help: "Mỗi độ đậm / kiểu nghiêng là một file. Nên dùng .woff2 cho nhẹ.",
        fields: [
          { key: "src", label: "File font", type: "fontFile" },
          {
            key: "weight",
            label: "Độ đậm của file",
            type: "select",
            options: ["100", "200", "300", "400", "500", "600", "700", "800", "900"].map((w) => ({ value: w, label: w === "400" ? "400 (thường)" : w === "700" ? "700 (đậm)" : w })),
          },
          { key: "style", label: "Kiểu", type: "select", options: [{ value: "normal", label: "Thẳng" }, { value: "italic", label: "Nghiêng" }] },
        ],
        newItem: () => ({ src: "", weight: "400", style: "normal" }),
      },
    ],
    newItem: () => ({ name: "", link: "", files: [] }),
  },
];
const scaleField = (key: string, label: string): FieldDef => ({ key, label, type: "number", min: 50, max: 200, step: 5, zeroIsDefault: true, help: "Phần trăm so với cỡ thiết kế, ví dụ 110. Để trống = mặc định." });

/** Colours and type of a page (and, in Studio › Giao diện, of the whole site). */
export const pageStyleFields: FieldDef[] = [
  { key: "background", label: "Màu nền trang", type: "color", help: "Nền của các section để nền trắng." },
  { key: "heading", label: "Màu tiêu đề", type: "color" },
  { key: "text", label: "Màu chữ", type: "color", help: "Không áp vào section nền tối, để chữ trắng vẫn đọc được." },
  fontField("font", "Font chữ thường", "Inter"),
  fontField("headingFont", "Font tiêu đề", "Phudu"),
  scaleField("textScale", "Cỡ chữ thường (%)"),
  scaleField("headingScale", "Cỡ tiêu đề (%)"),
  textEffectsField,
];

export const menuStyleFields: FieldDef[] = [
  fontField("font", "Font menu", "theo font chữ thường"),
  { key: "size", label: "Cỡ chữ menu (px)", type: "number", min: 10, max: 24, zeroIsDefault: true, help: "Để trống = 14." },
  {
    key: "weight",
    label: "Độ đậm",
    type: "select",
    options: [
      { value: "", label: "Mặc định" },
      { value: "400", label: "Thường" },
      { value: "500", label: "Vừa" },
      { value: "600", label: "Đậm vừa" },
      { value: "700", label: "Đậm" },
    ],
  },
  { key: "uppercase", label: "Viết hoa toàn bộ", type: "boolean" },
  { key: "color", label: "Màu chữ menu trên ảnh đầu trang", type: "color", help: "Khi thanh menu còn trong suốt (mặc định trắng)." },
  { key: "colorSolid", label: "Màu chữ menu khi cuộn trang", type: "color", help: "Khi thanh menu chuyển nền trắng (mặc định xám đậm)." },
];

const menuLinkFields: FieldDef[] = [
  { key: "label", label: "Tên hiển thị", type: "text" },
  { key: "href", label: "Liên kết", type: "link" },
];

export const menuFields: FieldDef[] = [
  {
    key: "menu",
    label: "Các mục menu",
    type: "list",
    itemLabel: "mục menu",
    titleKey: "label",
    help: "Kéo để sắp xếp. Mục đầu tiên có biểu tượng ngôi nhà.",
    fields: [
      ...menuLinkFields,
      {
        key: "auto",
        label: "Cấp con tự động",
        type: "select",
        options: [
          { value: "", label: "Không" },
          { value: "productGroups", label: "Các nhóm sản phẩm (Studio › Sản phẩm)" },
          { value: "newsCategories", label: "Các chuyên mục tin (Studio › Chuyên mục)" },
        ],
        help: "Thêm nhóm hoặc chuyên mục mới là menu tự cập nhật.",
      },
      { key: "children", label: "Cấp con thêm tay", type: "list", itemLabel: "mục con", titleKey: "label", fields: menuLinkFields, newItem: () => ({ label: l("Mục con", "Sub-item"), href: "/" }) },
      { key: "wide", label: "Chỉ hiện trên màn hình rộng (tên dài)", type: "boolean", help: "Trên laptop nhỏ mục này chỉ còn trong menu điện thoại." },
    ],
    newItem: () => ({ label: l("Mục mới", "New item"), href: "/", children: [], auto: "", wide: false }),
  },
];

export const categoryFields: FieldDef[] = [
  { key: "name", label: "Tên chuyên mục", type: "text" },
  { key: "slug", label: "Đường dẫn (slug)", type: "string", help: "Trang chuyên mục ở /slug, bài ở /slug/ten-bai. Đổi slug sẽ đổi link của cả chuyên mục." },
  { key: "intro", label: "Giới thiệu ngắn", type: "textarea", rows: 3 },
  { key: "image", label: "Ảnh đầu trang chuyên mục", type: "image" },
  {
    key: "seo",
    label: "SEO",
    type: "group",
    fields: [
      { key: "title", label: "Tiêu đề trên Google", type: "text", help: "Để trống để dùng tên chuyên mục." },
      { key: "description", label: "Mô tả trên Google", type: "textarea", rows: 2, help: "Để trống để dùng phần giới thiệu." },
    ],
  },
];

export const newCategory = () => ({ slug: "chuyen-muc-moi", name: l("Chuyên mục mới", "New category"), intro: l(""), image: img("/images/cashew-harvest.webp"), seo: { title: l(""), description: l("") } });

export const pageSeoFields: FieldDef[] = [
  { key: "title", label: "Tiêu đề trên Google", type: "text", help: "Nên dài 30–60 ký tự." },
  { key: "description", label: "Mô tả trên Google", type: "textarea", rows: 3, help: "Nên dài 70–160 ký tự." },
  { key: "image", label: "Ảnh chia sẻ (Facebook, Zalo…)", type: "media", help: "Tỉ lệ 1200×630. Để trống thì dùng ảnh đầu trang." },
  { key: "noindex", label: "Ẩn trang khỏi Google (noindex)", type: "boolean" },
];

export const postFields: FieldDef[] = [
  { key: "title", label: "Tiêu đề", type: "text", help: "Để trống bản tiếng Anh nếu bài chỉ có tiếng Việt: bài sẽ không hiện ở trang /en." },
  { key: "slug", label: "Đường dẫn (slug)", type: "string", help: "Chữ thường không dấu và gạch ngang. Đổi slug sau khi đã đăng sẽ đổi URL bài." },
  {
    key: "channel",
    label: "Chuyên mục",
    type: "category",
    help: "Quyết định bài hiện ở trang nào và đường dẫn của bài (/chuyen-muc/ten-bai). Thêm/sửa chuyên mục ở Studio › Chuyên mục.",
  },
  { key: "date", label: "Ngày đăng", type: "date", help: "Chọn ngày trong tương lai để hẹn giờ: bài đã xuất bản chỉ hiện từ ngày đó." },
  { key: "category", label: "Nhãn trên thẻ bài (tuỳ chọn)", type: "text", help: "Chữ nhỏ hiện trên ảnh bìa, ví dụ “Mùa vụ”. Không ảnh hưởng tới chuyên mục." },
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

export const newPost = (date: string, channel: "news" | "health" = "news") => ({
  slug: "",
  channel,
  title: l("Bài viết mới", ""),
  excerpt: l(""),
  cover: img("/images/cashew-harvest.webp", "Hạt điều thô vừa thu hoạch", "Freshly harvested raw cashew nuts"),
  body: l("Viết nội dung ở đây. Dùng thanh công cụ để thêm tiêu đề, ảnh, danh sách…", ""),
  category: l("Tin công ty", "Company news"),
  date,
  author: "VSAP",
  seo: { title: l(""), description: l("") },
});
