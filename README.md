# VSAP – Website

Website song ngữ (Tiếng Việt / English) cho thương hiệu nông sản VSAP. Chạy Next.js App Router trên Cloudflare Workers qua [vinext](https://github.com/cloudflare/vinext).

## Yêu cầu

- Node.js **≥ 22.18** (xem `.nvmrc`)
- Tài khoản Cloudflare (để deploy)

## Lệnh

```sh
npm install
npm run dev        # dev server (http://localhost:5173)
npm run build      # build + prerender toàn bộ trang tĩnh
npm run start      # chạy thử bản build trong workerd
npm run typecheck
npm test           # unit test phần lõi CMS
npm run deploy     # deploy lên Cloudflare Workers
```

## Cấu trúc

```
app/
  [locale]/            # /vi và /en
    page.tsx           # Trang chủ
    about/             # Về VSAP
    products/          # Danh sách + chi tiết sản phẩm ([slug])
    quality/           # Chất lượng & quy trình
    contact/           # Liên hệ / form báo giá
  api/inquiry/         # Nhận form báo giá
  sitemap.ts, robots.ts, icon.svg
components/            # Header, Footer, form, các section
lib/
  content/vi.ts, en.ts # Toàn bộ nội dung chữ
  products.ts          # Dữ liệu sản phẩm (phân loại, quy cách, chỉ tiêu)
  site.ts              # Email, điện thoại, địa chỉ, domain
```

## Sửa nội dung

- Chữ trên site: `lib/content/vi.ts` và `lib/content/en.ts` (file `en.ts` bắt buộc có đủ khóa như `vi.ts`).
- Sản phẩm: `lib/products.ts`. Thêm sản phẩm mới thì thêm vào mảng `products`, kèm `image` / `gallery` là key ảnh trong `lib/images.ts`.
- Sản phẩm bán lẻ (hộp, hũ, túi): `lib/retail.ts`, ảnh bao bì thật ở `public/images/products/`. Đối tác: `lib/partners.ts` (có logo thì thêm vào `public/images/partners/`).
- Nút liên hệ nổi Zalo/WhatsApp/điện thoại: `components/FloatingContact.tsx`, link ở `lib/site.ts`.
- Ảnh: file nằm ở `public/images/`, khai báo (alt song ngữ + nguồn) trong `lib/images.ts`. Ảnh hiện tại là ảnh minh họa CC0/Public Domain từ Wikimedia Commons — thay bằng ảnh thật của VSAP bằng cách ghi đè file cùng tên.
- Thông tin liên hệ + domain: `lib/site.ts`.
- Màu & typography: `app/globals.css` (khối `@theme`). Chữ chính Inter; phần nghiêng của tiêu đề dùng Noto Serif Display bản nén ngang, tự host ở `public/fonts` (có đủ dấu tiếng Việt). Tiêu đề gồm `title` + `accent` (dòng serif nghiêng) trong `lib/content/*.ts`.
- Logo trên nền ảnh/nền tối dùng `public/logo-light.svg`.

## Chuyển động (GSAP)

- Hero trang chủ là slider: `components/HeroSlider.tsx`. Nội dung từng slide ở `home.hero.slides` trong `lib/content/*.ts`; ảnh và link của slide khai báo ở mảng `media` đầu file (cùng thứ tự). Thời gian mỗi slide: hằng `AUTOPLAY`.
- Câu tuyên bố gõ chữ dạng slider: `components/StatementSlider.tsx`; nội dung ở `home.statement.items`, ảnh tròn từng câu ở mảng `pills`, thời gian giữ câu: hằng `HOLD`.
- Hiệu ứng khi cuộn do `components/MotionMain.tsx` điều khiển, bật bằng thuộc tính trên phần tử: `data-reveal`, `data-reveal="clip"`, `data-parallax` (hoặc `<Photo parallax />`), `data-count`, `data-intro`.
- Plugin GSAP đăng ký ở `lib/gsap.ts`. Người dùng bật "giảm chuyển động" trong hệ điều hành sẽ thấy trang tĩnh, slider không tự chạy.

## CMS (VSAP Studio)

Toàn bộ nội dung website (các trang, section, sản phẩm, bao bì bán lẻ, đối tác, thông tin công ty, chữ giao diện, ảnh) sửa được tại **`/admin`**.

- **Trang** — page builder: thêm / kéo thả / nhân bản / ẩn / xoá section, sửa từng trường song ngữ VI–EN. Khung xem trước bên phải là trang thật (bản nháp), có chế độ máy tính / máy tính bảng / điện thoại; bấm lên một section trong khung xem trước để sửa nó.
- **Sản phẩm, Bán lẻ, Đối tác** — danh sách + form. Sản phẩm mới tự có trang `/products/<slug>`.
- **Công ty** — tên, liên hệ, văn phòng, link Zalo/WhatsApp, SEO mặc định. **Chữ giao diện** — nhãn nút, menu, form.
- **Thư viện ảnh** — tải ảnh lên (lưu trên R2), dùng ở mọi trường ảnh.
- **Tin tức** — bài viết song ngữ (`/news`, `/news/<slug>`), soạn bằng Markdown có thanh công cụ (tiêu đề, đậm, liên kết, ảnh, danh sách, trích dẫn). Mỗi bài có bản nháp riêng và chỉ hiện khi được xuất bản; ngày đăng ở tương lai = hẹn giờ. Bài thiếu tiêu đề tiếng Anh chỉ hiện ở `/vi`. Section *Tin tức* đặt được trên bất kỳ trang nào. 10 bài mẫu song ngữ (`lib/content/posts*.ts`, viết theo hướng SEO/GEO: trả lời ngắn đầu bài, mục *Câu hỏi thường gặp* tự sinh FAQPage) được nạp một lần dưới dạng **bản nháp** khi mở Studio › Tin tức lần đầu; duyệt rồi bấm *Xuất bản* từng bài.
- **Báo giá** — hộp thư các yêu cầu gửi từ form: lọc theo trạng thái (Mới / Đang xử lý / Đã xong / Spam), tìm kiếm, ghi chú nội bộ, trả lời email/WhatsApp, xuất CSV mở bằng Excel. Huy hiệu đỏ báo số yêu cầu mới.
- **Tài khoản** và **Nhật ký** — xem mục *Đăng nhập & phân quyền* bên dưới.
- **Bản nháp → Xuất bản.** Mọi thay đổi tự lưu vào bản nháp (khách không thấy); bấm *Xuất bản* để đưa lên website. *Lịch sử* giữ 50 lần xuất bản gần nhất để khôi phục. Hoàn tác/làm lại: Ctrl/Cmd + Z / Shift + Z.

Kỹ thuật: nội dung là một tài liệu JSON (`lib/cms/types.ts`) lưu trong D1 (bản nháp + bản đang chạy + lịch sử), ảnh tải lên lưu trong R2 và phục vụ ở `/media/...`. Lần đầu chưa có gì trong D1, site dùng nội dung mặc định dựng từ `lib/content/*`, `lib/products.ts`, `lib/retail.ts`… (`lib/cms/defaults.ts`). Bảng D1 tự tạo khi dùng lần đầu.

| Thêm gì | Sửa ở đâu |
|---|---|
| Loại section mới | Khai báo trường trong `lib/cms/registry.ts`, viết renderer cùng tên trong `components/blocks.tsx` (test sẽ báo nếu thiếu) |
| Trường mới cho sản phẩm/cài đặt | `lib/cms/types.ts` + `lib/cms/collections.ts` + giá trị mặc định trong `lib/cms/defaults.ts` |
| Biểu tượng chọn được | `lib/cms/icons.ts` + `components/cms/Icon.tsx` |

### Đăng nhập & phân quyền

- Tài khoản chủ sở hữu **`admin`**: mật khẩu là secret `ADMIN_PASSWORD` của Worker. Luôn đăng nhập được (kể cả khi D1 trống) để không ai bị khoá ngoài. Đổi secret này sẽ đăng xuất mọi phiên của `admin`.
  - Local: file `.dev.vars` (không commit; mẫu ở `.dev.vars.example`) gồm `ADMIN_PASSWORD` và `ADMIN_SESSION_SECRET`.
  - Production: `npx cf workers secrets update ADMIN_PASSWORD` và `npx cf workers secrets update ADMIN_SESSION_SECRET` (chuỗi ngẫu nhiên dài).
- Studio › **Tài khoản**: Quản trị tạo tài khoản riêng cho từng người, mật khẩu băm PBKDF2-SHA256 trong D1. Đổi vai trò, khoá hay đặt lại mật khẩu sẽ đăng xuất người đó ngay.

| Vai trò | Được làm |
|---|---|
| Quản trị | Mọi thứ, kể cả quản lý tài khoản và xem nhật ký |
| Biên tập chính | Sửa và xuất bản nội dung, tin tức; khôi phục phiên bản; xoá ảnh; xử lý báo giá |
| Biên tập viên | Sửa bản nháp, viết bài, tải ảnh; không xuất bản |
| Kinh doanh | Chỉ hộp thư báo giá |

Quyền được kiểm tra ở từng API (`lib/cms/roles.ts`, `lib/cms/api.ts`); giao diện chỉ ẩn những nút không dùng được. Studio › **Nhật ký** ghi lại đăng nhập (cả sai mật khẩu), xuất bản, sửa, xoá, đổi trạng thái báo giá, thay đổi tài khoản. Sai mật khẩu 8 lần trong 15 phút sẽ khoá tạm tên đăng nhập đó.

### Deploy lần đầu

Binding `DB` (D1 `vsap-cms`) và `MEDIA` (R2 `vsap-media`) khai báo trong `cloudflare.config.ts`; theo tài liệu Cloudflare chúng được tạo tự động ở lần deploy đầu. Nếu tài khoản không tự tạo, tạo thủ công D1 và R2 với đúng tên trên trong Cloudflare dashboard rồi deploy lại.

### Test

```sh
npm test   # nội dung mặc định, registry section, đường dẫn ảnh, gộp dữ liệu cũ, phân quyền, mật khẩu, Markdown, CSV
```

## SEO

- Mỗi trang: tiêu đề, mô tả, ảnh chia sẻ, ẩn khỏi Google (noindex) — sửa trong Studio › Trang › *Cài đặt trang (SEO)*, có xem trước kết quả Google / thẻ chia sẻ và đo độ dài. Sản phẩm có trường SEO riêng.
- Tự sinh: canonical, hreflang vi/en + `x-default`, Open Graph + Twitter card (ảnh lớn), `sitemap.xml` (bỏ trang noindex, có `lastmod` từ lần xuất bản), `robots.txt`, `manifest.webmanifest`, icon iPhone, trang 404 song ngữ.
- Dữ liệu có cấu trúc (JSON-LD): Organization + WebSite (mọi trang), BreadcrumbList (trang con, sản phẩm, bài viết), Product (trang sản phẩm), BlogPosting (bài viết), FAQPage (khi trang có section câu hỏi). Code ở `lib/seo.ts`.
- Studio › Công ty: mạng xã hội (hiện ở chân trang + `sameAs`), mã xác minh Google Search Console / Bing, Google Analytics 4 (chỉ tải khi có mã).
- `/` chuyển tới `/vi` hoặc `/en` theo ngôn ngữ trình duyệt (`proxy.ts`).
- Ảnh có sẵn có thêm bản 640/1280px cho `srcset`: sau khi thêm/đổi ảnh trong `public/images`, chạy `python3 scripts/responsive-images.py`.

## Form báo giá

`POST /api/inquiry` kiểm tra dữ liệu, lưu vào D1 (Studio › Báo giá; tối đa 5 yêu cầu / 10 phút / địa chỉ, IP chỉ lưu dạng băm) và chuyển tiếp JSON tới webhook nếu có biến `INQUIRY_WEBHOOK_URL` (Slack, Google Apps Script → Google Sheet, CRM…):

```sh
npx cf workers secrets update INQUIRY_WEBHOOK_URL
```

Chưa cấu hình thì yêu cầu chỉ được ghi log trong Worker.
