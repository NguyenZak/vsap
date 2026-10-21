// Every section type the page builder offers: its admin label, editable fields and
// the content a freshly added section starts with. Renderers live in
// components/blocks (one per type, mapped in components/cms/RenderSections.tsx).
import { headingFields, img, l, toneField, type FieldDef } from "./fields";

export type SectionDef = {
  type: string;
  label: string;
  description: string;
  /** lucide icon name used in the admin's section library. */
  icon: string;
  fields: FieldDef[];
  create: () => Record<string, unknown>;
};

const iconItem = (titleLabel = "Tiêu đề"): FieldDef[] => [
  { key: "icon", label: "Biểu tượng", type: "icon" },
  { key: "title", label: titleLabel, type: "text" },
  { key: "body", label: "Nội dung", type: "textarea", rows: 3 },
];

const button = (prefix = ""): FieldDef[] => [
  { key: `${prefix}buttonLabel`, label: "Chữ trên nút", type: "text" },
  { key: `${prefix}buttonHref`, label: "Liên kết của nút", type: "link" },
];

const sampleHeading = () => ({
  eyebrow: l("Nhãn", "Label"),
  title: l("Tiêu đề section", "Section title"),
  accent: l("dòng nhấn nghiêng", "italic accent line"),
  lead: l("Mô tả ngắn cho section này.", "A short description for this section."),
});

export const sectionDefs: SectionDef[] = [
  {
    type: "hero",
    label: "Hero slider",
    description: "Ảnh toàn màn hình, nhiều slide tự chuyển.",
    icon: "gallery-horizontal",
    fields: [
      {
        key: "slides",
        label: "Slide",
        type: "list",
        itemLabel: "slide",
        titleKey: "label",
        fields: [
          { key: "label", label: "Tên ngắn (thanh tiến độ)", type: "text" },
          { key: "eyebrow", label: "Nhãn nhỏ", type: "text" },
          { key: "title", label: "Tiêu đề", type: "text" },
          { key: "accent", label: "Tiêu đề (dòng nghiêng)", type: "text" },
          { key: "lead", label: "Mô tả", type: "textarea", rows: 3 },
          { key: "image", label: "Ảnh nền", type: "image" },
          ...button(),
          { key: "secondaryLabel", label: "Chữ nút phụ", type: "text", help: "Để trống để ẩn nút phụ." },
          { key: "secondaryHref", label: "Liên kết nút phụ", type: "link" },
        ],
        newItem: () => ({
          label: l("Slide mới", "New slide"),
          eyebrow: l("Nhãn", "Label"),
          title: l("Tiêu đề slide", "Slide title"),
          accent: l("dòng nhấn", "accent line"),
          lead: l("Mô tả slide.", "Slide description."),
          image: img("/images/highlands.webp", "Ảnh slide", "Slide image"),
          buttonLabel: l("Xem sản phẩm", "Explore products"),
          buttonHref: "/products",
          secondaryLabel: l("Nhận báo giá", "Get a quote"),
          secondaryHref: "/contact",
        }),
      },
      { key: "autoplay", label: "Thời gian mỗi slide (giây)", type: "number", min: 2, max: 30, step: 0.5 },
      { key: "scrollLabel", label: "Chữ “Cuộn xuống”", type: "text" },
      { key: "rankValue", label: "Điểm nổi bật (số)", type: "string" },
      { key: "rankLabel", label: "Điểm nổi bật (chữ)", type: "text" },
      { key: "proofLabel", label: "Nhãn cụm ảnh tròn", type: "text", help: "{grades} = tổng số phân loại sản phẩm." },
      {
        key: "proofImages",
        label: "Ảnh tròn",
        type: "list",
        itemLabel: "ảnh",
        fields: [{ key: "image", label: "Ảnh", type: "image" }],
        newItem: () => ({ image: img("/images/cashew.webp") }),
      },
    ],
    create: () => ({
      slides: [
        {
          label: l("Slide 1"),
          eyebrow: l("Nhãn", "Label"),
          title: l("Tiêu đề slide", "Slide title"),
          accent: l("dòng nhấn", "accent line"),
          lead: l("Mô tả slide.", "Slide description."),
          image: img("/images/highlands.webp"),
          buttonLabel: l("Xem sản phẩm", "Explore products"),
          buttonHref: "/products",
          secondaryLabel: l(""),
          secondaryHref: "",
        },
      ],
      autoplay: 7,
      scrollLabel: l("Cuộn xuống", "Scroll"),
      rankValue: "",
      rankLabel: l(""),
      proofLabel: l(""),
      proofImages: [],
    }),
  },
  {
    type: "pageHero",
    label: "Banner đầu trang",
    description: "Ảnh nền lớn với tiêu đề, dùng cho trang con.",
    icon: "image",
    fields: [...headingFields(), { key: "image", label: "Ảnh nền", type: "image" }],
    create: () => ({ ...sampleHeading(), image: img("/images/highlands.webp") }),
  },
  {
    type: "strip",
    label: "Dải mã phân loại",
    description: "Dòng chữ nhỏ bên trái và các mã/thương hiệu chạy ngang.",
    icon: "rows-3",
    fields: [
      { key: "lead", label: "Dòng nhỏ", type: "text" },
      { key: "strong", label: "Dòng đậm", type: "text" },
      { key: "codes", label: "Mã", type: "list", itemLabel: "mã", titleKey: "code", fields: [{ key: "code", label: "Mã", type: "string" }], newItem: () => ({ code: "W240" }) },
    ],
    create: () => ({ lead: l("Phân loại theo", "Graded to"), strong: l("tiêu chuẩn quốc tế", "international standards"), codes: [{ code: "W180" }, { code: "W240" }] }),
  },
  {
    type: "statement",
    label: "Câu tuyên bố (gõ chữ)",
    description: "Các câu lớn được gõ ra lần lượt, có ảnh tròn chèn giữa câu.",
    icon: "type",
    fields: [
      { key: "eyebrow", label: "Nhãn nhỏ", type: "text" },
      { key: "hold", label: "Giữ mỗi câu (giây)", type: "number", min: 1, max: 20, step: 0.5 },
      {
        key: "items",
        label: "Câu",
        type: "list",
        itemLabel: "câu",
        titleKey: "strong",
        fields: [
          { key: "strong", label: "Phần đậm", type: "text" },
          { key: "muted", label: "Phần nhạt (trước ảnh)", type: "text" },
          { key: "tail", label: "Phần nhạt (sau ảnh)", type: "text" },
          { key: "image", label: "Ảnh tròn", type: "image" },
        ],
        newItem: () => ({ strong: l("Câu mới", "New statement"), muted: l("phần nhạt,", "muted part,"), tail: l("phần cuối.", "the ending."), image: img("/images/paddy-work.webp") }),
      },
    ],
    create: () => ({
      eyebrow: l("Câu chuyện", "Our story"),
      hold: 3.5,
      items: [{ strong: l("Câu tuyên bố", "A statement"), muted: l("phần nhạt,", "muted part,"), tail: l("phần cuối.", "the ending."), image: img("/images/paddy-work.webp") }],
    }),
  },
  {
    type: "values",
    label: "Danh sách mở rộng + ảnh",
    description: "Các mục bấm mở, mỗi mục đổi ảnh bên cạnh, tự chạy.",
    icon: "list-collapse",
    fields: [
      ...headingFields(),
      { key: "autoplay", label: "Thời gian mỗi mục (giây)", type: "number", min: 1, max: 30, step: 0.5 },
      {
        key: "items",
        label: "Mục",
        type: "list",
        itemLabel: "mục",
        titleKey: "title",
        fields: [...iconItem(), { key: "image", label: "Ảnh", type: "image" }],
        newItem: () => ({ icon: "leaf", title: l("Mục mới", "New item"), body: l("Nội dung.", "Content."), image: img("/images/cashew.webp") }),
      },
    ],
    create: () => ({
      ...sampleHeading(),
      autoplay: 4,
      items: [{ icon: "leaf", title: l("Mục 1", "Item 1"), body: l("Nội dung.", "Content."), image: img("/images/cashew.webp") }],
    }),
  },
  {
    type: "process",
    label: "Quy trình dạng tab",
    description: "Các bước dạng tab với ảnh lớn và thẻ nổi, tự chuyển.",
    icon: "workflow",
    fields: [
      ...headingFields(),
      { key: "autoplay", label: "Thời gian mỗi bước (giây)", type: "number", min: 0.5, max: 30, step: 0.5 },
      { key: "location", label: "Nhãn vị trí trên ảnh", type: "text" },
      {
        key: "steps",
        label: "Bước",
        type: "list",
        itemLabel: "bước",
        titleKey: "title",
        fields: [...iconItem("Tên bước"), { key: "image", label: "Ảnh", type: "image" }],
        newItem: () => ({ icon: "sprout", title: l("Bước mới", "New step"), body: l("Mô tả bước.", "Step description."), image: img("/images/cashew-grove.webp") }),
      },
    ],
    create: () => ({
      ...sampleHeading(),
      autoplay: 1.5,
      location: l("Việt Nam", "Vietnam"),
      steps: [{ icon: "sprout", title: l("Bước 1", "Step 1"), body: l("Mô tả.", "Description."), image: img("/images/cashew-grove.webp") }],
    }),
  },
  {
    type: "stats",
    label: "Thẻ số liệu",
    description: "Các số lớn kèm nhãn, đếm lên khi cuộn tới.",
    icon: "chart-no-axes-column",
    fields: [
      {
        key: "items",
        label: "Số liệu",
        type: "list",
        itemLabel: "số liệu",
        titleKey: "value",
        fields: [
          { key: "value", label: "Giá trị", type: "string", help: "{grades} = tổng số phân loại sản phẩm." },
          { key: "label", label: "Nhãn", type: "text" },
        ],
        newItem: () => ({ value: "100%", label: l("Nhãn", "Label") }),
      },
    ],
    create: () => ({ items: [{ value: "100%", label: l("Nhãn", "Label") }] }),
  },
  {
    type: "retail",
    label: "Sản phẩm bán lẻ (trượt ngang)",
    description: "Thẻ ảnh bao bì lấy từ mục Sản phẩm bán lẻ.",
    icon: "package",
    fields: [...headingFields(), ...button(), toneField],
    create: () => ({ ...sampleHeading(), buttonLabel: l("Tất cả sản phẩm", "All products"), buttonHref: "/products", tone: "muted" }),
  },
  {
    type: "productCards",
    label: "Thẻ sản phẩm chính",
    description: "Thẻ lớn cho từng dòng sản phẩm (hạt điều, macca…).",
    icon: "layout-grid",
    fields: [...headingFields(), { key: "ctaLabel", label: "Chữ trên thẻ", type: "text" }],
    create: () => ({ ...sampleHeading(), eyebrow: l(""), title: l(""), accent: l(""), lead: l(""), ctaLabel: l("Xem chi tiết", "View details") }),
  },
  {
    type: "partners",
    label: "Logo đối tác",
    description: "Tường logo lấy từ mục Đối tác.",
    icon: "handshake",
    fields: [...headingFields(), { key: "joinLabel", label: "Chữ ô “Trở thành đối tác”", type: "text", help: "Để trống để ẩn ô này." }, { key: "joinHref", label: "Liên kết", type: "link" }],
    create: () => ({ ...sampleHeading(), joinLabel: l("Liên hệ hợp tác", "Talk to us"), joinHref: "/contact" }),
  },
  {
    type: "faq",
    label: "Câu hỏi thường gặp",
    description: "Hai cột câu hỏi bấm mở.",
    icon: "message-circle-question",
    fields: [
      ...headingFields(),
      {
        key: "items",
        label: "Câu hỏi",
        type: "list",
        itemLabel: "câu hỏi",
        titleKey: "q",
        fields: [
          { key: "q", label: "Câu hỏi", type: "text" },
          { key: "a", label: "Trả lời", type: "textarea", rows: 4 },
        ],
        newItem: () => ({ q: l("Câu hỏi mới?", "New question?"), a: l("Câu trả lời.", "The answer.") }),
      },
    ],
    create: () => ({ ...sampleHeading(), items: [{ q: l("Câu hỏi?", "Question?"), a: l("Trả lời.", "Answer.") }] }),
  },
  {
    type: "cta",
    label: "Khung kêu gọi liên hệ",
    description: "Ảnh nền bo góc, tiêu đề và nút.",
    icon: "megaphone",
    fields: [
      { key: "title", label: "Tiêu đề", type: "text" },
      { key: "accent", label: "Tiêu đề (dòng nghiêng)", type: "text" },
      { key: "lead", label: "Mô tả", type: "textarea", rows: 3 },
      ...button(),
      { key: "image", label: "Ảnh nền", type: "image" },
    ],
    create: () => ({
      title: l("Sẵn sàng hợp tác", "Ready to work together"),
      accent: l("cùng VSAP?", "with VSAP?"),
      lead: l("Gửi yêu cầu để nhận báo giá.", "Send us your requirements for a quote."),
      buttonLabel: l("Liên hệ", "Contact us"),
      buttonHref: "/contact",
      image: img("/images/cashew-grove.webp"),
    }),
  },
  {
    type: "story",
    label: "Câu chuyện + 2 ảnh",
    description: "Đoạn văn lớn bên trái, hai ảnh so le bên phải.",
    icon: "book-open",
    fields: [
      { key: "tag", label: "Nhãn nhỏ", type: "text" },
      { key: "lead", label: "Đoạn mở đầu (chữ lớn)", type: "textarea", rows: 3 },
      { key: "body", label: "Đoạn tiếp theo", type: "textarea", rows: 4, help: "Xuống dòng hai lần để tách đoạn." },
      { key: "imageA", label: "Ảnh 1", type: "image" },
      { key: "imageB", label: "Ảnh 2", type: "image" },
      toneField,
    ],
    create: () => ({
      tag: l("Câu chuyện", "Story"),
      lead: l("Đoạn mở đầu.", "Opening paragraph."),
      body: l("Nội dung.", "Body text."),
      imageA: img("/images/cashew-harvest.webp"),
      imageB: img("/images/macadamia-tree.webp"),
      tone: "muted",
    }),
  },
  {
    type: "pillars",
    label: "Thẻ biểu tượng",
    description: "Các thẻ có biểu tượng, tiêu đề và mô tả (sứ mệnh, tầm nhìn…).",
    icon: "columns-3",
    fields: [
      ...headingFields(),
      {
        key: "items",
        label: "Thẻ",
        type: "list",
        itemLabel: "thẻ",
        titleKey: "title",
        fields: iconItem(),
        newItem: () => ({ icon: "target", title: l("Thẻ mới", "New card"), body: l("Nội dung.", "Content.") }),
      },
      toneField,
    ],
    create: () => ({ eyebrow: l(""), title: l(""), accent: l(""), lead: l(""), items: [{ icon: "target", title: l("Thẻ 1", "Card 1"), body: l("Nội dung.", "Content.") }], tone: "white" }),
  },
  {
    type: "accordionImage",
    label: "Danh sách mở rộng + ảnh cố định",
    description: "Các mục bấm mở bên trái, một ảnh bên phải.",
    icon: "panel-left",
    fields: [
      ...headingFields(),
      {
        key: "items",
        label: "Mục",
        type: "list",
        itemLabel: "mục",
        titleKey: "title",
        fields: iconItem(),
        newItem: () => ({ icon: "shield-check", title: l("Mục mới", "New item"), body: l("Nội dung.", "Content.") }),
      },
      { key: "image", label: "Ảnh", type: "image" },
      toneField,
    ],
    create: () => ({ ...sampleHeading(), items: [{ icon: "shield-check", title: l("Mục 1", "Item 1"), body: l("Nội dung.", "Content.") }], image: img("/images/cashew-kernels.webp"), tone: "muted" }),
  },
  {
    type: "checklist",
    label: "Danh sách có dấu tick",
    description: "Tiêu đề bên trái, danh sách thẻ bên phải.",
    icon: "list-checks",
    fields: [
      ...headingFields(),
      { key: "items", label: "Dòng", type: "list", itemLabel: "dòng", titleKey: "text", fields: [{ key: "text", label: "Nội dung", type: "text" }], newItem: () => ({ text: l("Dòng mới", "New line") }) },
      toneField,
    ],
    create: () => ({ ...sampleHeading(), items: [{ text: l("Dòng 1", "Line 1") }], tone: "white" }),
  },
  {
    type: "contact",
    label: "Thông tin liên hệ + form",
    description: "Thẻ liên hệ lấy từ Cài đặt và form gửi yêu cầu báo giá.",
    icon: "mail",
    fields: [{ key: "showForm", label: "Hiện form báo giá", type: "boolean" }],
    create: () => ({ showForm: true }),
  },
  {
    type: "textBlock",
    label: "Khối văn bản",
    description: "Tiêu đề và đoạn văn tự do.",
    icon: "text",
    fields: [
      ...headingFields(),
      { key: "body", label: "Nội dung", type: "textarea", rows: 8, help: "Xuống dòng hai lần để tách đoạn." },
      { key: "align", label: "Căn chỉnh", type: "select", options: [{ value: "left", label: "Trái" }, { value: "center", label: "Giữa" }] },
      toneField,
    ],
    create: () => ({ ...sampleHeading(), body: l("Nội dung đoạn văn.", "Paragraph text."), align: "left", tone: "white" }),
  },
  {
    type: "imageText",
    label: "Ảnh + văn bản",
    description: "Ảnh một bên, tiêu đề, nội dung và nút bên còn lại.",
    icon: "layout-panel-left",
    fields: [
      ...headingFields(),
      { key: "body", label: "Nội dung", type: "textarea", rows: 6 },
      { key: "image", label: "Ảnh", type: "image" },
      { key: "imageSide", label: "Vị trí ảnh", type: "select", options: [{ value: "left", label: "Trái" }, { value: "right", label: "Phải" }] },
      ...button(),
      toneField,
    ],
    create: () => ({ ...sampleHeading(), body: l("Nội dung.", "Content."), image: img("/images/highland-farmers.webp"), imageSide: "right", buttonLabel: l(""), buttonHref: "", tone: "white" }),
  },
  {
    type: "gallery",
    label: "Thư viện ảnh",
    description: "Lưới ảnh bo góc.",
    icon: "images",
    fields: [
      ...headingFields(),
      { key: "images", label: "Ảnh", type: "list", itemLabel: "ảnh", fields: [{ key: "image", label: "Ảnh", type: "image" }], newItem: () => ({ image: img("/images/cashew.webp") }) },
      { key: "columns", label: "Số cột", type: "select", options: [{ value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }] },
      toneField,
    ],
    create: () => ({ ...sampleHeading(), images: [{ image: img("/images/cashew.webp") }, { image: img("/images/macadamia.webp") }, { image: img("/images/highlands.webp") }], columns: "3", tone: "white" }),
  },
  {
    type: "posts",
    label: "Tin tức",
    description: "Bài viết mới nhất từ mục Tin tức.",
    icon: "newspaper",
    fields: [
      ...headingFields(),
      { key: "limit", label: "Số bài hiển thị", type: "number", min: 0, max: 60, help: "0 = tất cả bài (dùng cho trang Tin tức)." },
      { key: "featured", label: "Bài đầu tiên hiển thị lớn", type: "boolean" },
      ...button(),
      toneField,
    ],
    create: () => ({ ...sampleHeading(), title: l("Cập nhật mới", "Latest updates"), limit: 3, featured: false, buttonLabel: l("Xem tất cả tin", "See all news"), buttonHref: "/news", tone: "white" }),
  },
];

export const sectionDef = (type: string) => sectionDefs.find((d) => d.type === type);
