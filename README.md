# VSAP – Website

Website song ngữ (Tiếng Việt / English) cho thương hiệu nông sản VSAP. Chạy Next.js App Router trên Cloudflare Workers qua [vinext](https://github.com/cloudflare/vinext).

## Yêu cầu

- Node.js **≥ 22.18** (xem `.nvmrc`)
- Tài khoản Cloudflare (để deploy)

## Lệnh

```sh
npm install
npm run dev        # dev server (http://localhost:5173)
npm run build      # build bản production (trang render theo từng request từ CMS)
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

Mọi nội dung (chữ, sản phẩm, bán lẻ, đối tác, liên hệ, ảnh) sửa trong Studio tại `/admin`, xem mục **CMS** bên dưới. Các file `lib/content/*.ts`, `lib/products.ts`, `lib/retail.ts`, `lib/partners.ts`, `lib/site.ts`, `lib/images.ts` chỉ là **nội dung khởi tạo** (dùng khi D1 còn trống) — sửa chúng không đổi website đã có dữ liệu CMS. Riêng `lib/site.ts` còn là số điện thoại/email dự phòng cho trang lỗi toàn cục (khi chính CMS lỗi).

Còn cố định trong code: logo (`public/logo*.svg`), 5 ảnh trang trí quanh lưới bán lẻ (`shopDecor` trong `components/blocks.tsx`), chữ của trang 404/lỗi (`components/ErrorScreen.tsx`).
- Màu & typography: `app/globals.css` (khối `@theme`). Chữ chính Inter; phần nghiêng của tiêu đề dùng Noto Serif Display bản nén ngang, tự host ở `public/fonts` (có đủ dấu tiếng Việt). Tiêu đề gồm `title` + `accent` (dòng serif nghiêng) trong `lib/content/*.ts`.
- Logo trên nền ảnh/nền tối dùng `public/logo-light.svg`.

## Chuyển động (GSAP)

- Hero trang chủ là slider: `components/HeroSlider.tsx`. Slide (chữ, ảnh, link) và thời gian mỗi slide sửa trong Studio › Trang › Trang chủ › section Hero.
- Câu tuyên bố gõ chữ dạng slider: `components/StatementSlider.tsx`; các câu, ảnh tròn và thời gian giữ mỗi câu sửa trong Studio (section Tuyên bố).
- Hiệu ứng khi cuộn do `components/MotionMain.tsx` điều khiển, bật bằng thuộc tính trên phần tử: `data-reveal`, `data-reveal="clip"`, `data-parallax` (hoặc `<Photo parallax />`), `data-count`, `data-intro`.
- Plugin GSAP đăng ký ở `lib/gsap.ts`. Người dùng bật "giảm chuyển động" trong hệ điều hành sẽ thấy trang tĩnh, slider không tự chạy.

## CMS (VSAP Studio)

Toàn bộ nội dung website (các trang, section, sản phẩm, bao bì bán lẻ, đối tác, thông tin công ty, chữ giao diện, ảnh) sửa được tại **`/admin`**.

- **Trang** — page builder: thêm / kéo thả / nhân bản / ẩn / xoá section, sửa từng trường song ngữ VI–EN. Khung xem trước bên phải là trang thật (bản nháp), có chế độ máy tính / máy tính bảng / điện thoại; bấm lên một section trong khung xem trước để sửa nó.
- **Sản phẩm, Bán lẻ, Đối tác** — danh sách + form. Sản phẩm mới tự có trang `/products/<slug>`.
- **Công ty** — tên, liên hệ, văn phòng, link Zalo/WhatsApp, SEO mặc định. **Chữ giao diện** — nhãn nút, menu, form.
- **Thư viện ảnh** — tải ảnh lên (lưu trên R2), dùng ở mọi trường ảnh.
- **Tin tức** — bài viết song ngữ (`/news`, `/news/<slug>`), soạn bằng Markdown có thanh công cụ (tiêu đề, đậm, liên kết, ảnh, danh sách, trích dẫn). Mỗi bài có bản nháp riêng và chỉ hiện khi được xuất bản; ngày đăng ở tương lai = hẹn giờ. Bài thiếu tiêu đề tiếng Anh chỉ hiện ở `/vi`. Section *Tin tức* đặt được trên bất kỳ trang nào. 10 bài mẫu song ngữ (`lib/content/posts*.ts`, viết theo hướng SEO/GEO: trả lời ngắn đầu bài, mục *Câu hỏi thường gặp* tự sinh FAQPage) được nạp một lần dưới dạng **bản nháp** khi mở Studio › Tin tức lần đầu; duyệt rồi bấm *Xuất bản* từng bài.
- **Chuyên mục** — thêm / sửa / xoá chuyên mục tin. Mỗi chuyên mục có trang riêng ở `/slug`, bài ở `/slug/ten-bai` (Tin tức `/news` và Sức khỏe `/health` là hai chuyên mục có sẵn, giữ link cũ). Bài của chuyên mục bị xoá tự chuyển về chuyên mục đầu tiên; link cũ chuyển hướng 308. Slug không được trùng đường dẫn có sẵn (`about`, `products`, `contact`…).
- **Menu** — thêm / bớt / sắp xếp mục menu và cấp con. Mục có thể tự lấy cấp con từ *các nhóm sản phẩm* hoặc *các chuyên mục tin* (thêm nhóm/chuyên mục là menu tự cập nhật). Trên máy tính cấp con là danh sách thả xuống, trên điện thoại là danh sách thụt vào.
- **Giao diện** — màu nền, màu tiêu đề, màu chữ, font, cỡ chữ (%) cho toàn site; font / cỡ / độ đậm / viết hoa / màu chữ cho menu. **Font tự thêm**: dán link Google Fonts / link CSS / link file `.woff2`, hoặc tải file `.woff2 .woff .ttf .otf` lên (lưu R2) — font thêm vào có trong mọi ô chọn font. Mặc định vẫn là Inter (chữ) và Phudu (tiêu đề).
  - Từng trang: *Cài đặt trang* có phần *Màu và chữ của trang* (ghi đè Giao diện).
  - Từng section: nhóm *Màu & khung* (màu nền riêng, màu tiêu đề/chữ, khung kẻ trên-dưới hoặc khung bao bo góc, màu/độ dày viền) — ghi đè màu của trang. Màu chung không áp vào section nền tối để chữ trắng vẫn đọc được.
  - **Viền & bóng chữ** (ở cả 3 cấp: Giao diện, Cài đặt trang, Màu & khung của section): viền chữ (màu, độ dày) và đổ bóng (màu, độ đậm %, độ nhoè, độ lệch) cho tiêu đề và chữ thường. Chọn màu là bật; mỗi thông số để trống thì lấy theo cấp trên. Dòng tiêu đề nghiêng màu gradient được đổ bóng bằng `drop-shadow` để giữ màu.
- **Chế độ tối (dark mode)** — chỉ admin bật/tắt, khách không có nút chuyển: Studio › Giao diện › *Chế độ tối*: *Sáng* (mặc định), *Tối* (cả website nền đen), hoặc *Theo máy người xem*. Nền đen, thẻ xám rất đậm; nút xanh/vàng, ảnh giữ nguyên. Màu chữ chung chọn trong Studio tạm bỏ ở chế độ tối; section có màu nền riêng giữ giao diện sáng. Kỹ thuật: class `dark` trên `<html>` (đặt từ server khi chọn *Tối*; script nhỏ trong `<head>` khi *Theo máy*), bảng màu tối ở cuối `app/globals.css`; màu `surface` (nền thẻ) và `heading` (tiêu đề) tự đổi theo chế độ — dùng `bg-surface` / `text-heading` thay cho `bg-white` / `text-forest-900` ở phần giao diện khách.
- **Trang Sản phẩm theo nhóm** — section *Nhóm sản phẩm*: mỗi nhóm (Studio › Sản phẩm) kèm các sản phẩm bán lẻ của nhóm (Studio › Bán lẻ, trường *Sản phẩm*). Thêm / sửa / sắp xếp nhóm ở Studio › Sản phẩm.
- **Báo giá** — hộp thư các yêu cầu gửi từ form: lọc theo trạng thái (Mới / Đang xử lý / Đã xong / Spam), tìm kiếm, ghi chú nội bộ, trả lời email/WhatsApp, xuất CSV mở bằng Excel. Huy hiệu đỏ báo số yêu cầu mới. **Cài đặt › Telegram** (chỉ Quản trị; nút Telegram trong hộp thư cũng dẫn tới đây): dán token bot từ @BotFather, bấm *Tìm nhóm* để chọn nhóm đã thêm bot, *Gửi tin thử*. Từ đó mỗi yêu cầu mới được báo ngay vào nhóm, kèm nút mở thẳng yêu cầu trong Studio, WhatsApp và Zalo. Token lưu ở máy chủ, không hiện lại; nếu đặt secret `TELEGRAM_BOT_TOKEN` thì secret được ưu tiên.
- **Tài khoản** và **Nhật ký** — xem mục *Đăng nhập & phân quyền* bên dưới.
- **Cột kéo giãn được** — trong Studio, kéo đường kẻ giữa các cột (thanh menu bên trái, danh sách, form, khung xem trước) để đổi độ rộng; thanh menu kéo rộng thì hiện biểu tượng và chữ trên một dòng; bấm đúp vào đường kẻ để trả về mặc định. Mỗi kiểu màn hình nhớ độ rộng riêng trong trình duyệt. Dùng `react-resizable-panels` (`components/admin/Panes.tsx`: `Panes` / `Pane` / `PaneHandle`); cột chỉ được là con trực tiếp của `Panes`.
- **Bản nháp → Xuất bản.** Mọi thay đổi tự lưu vào bản nháp (khách không thấy); bấm *Xuất bản* để đưa lên website. *Lịch sử* giữ 50 lần xuất bản gần nhất để khôi phục. Hoàn tác/làm lại: Ctrl/Cmd + Z / Shift + Z.

Kỹ thuật: nội dung là một tài liệu JSON (`lib/cms/types.ts`) lưu trong D1 (bản nháp + bản đang chạy + lịch sử), ảnh tải lên lưu trong R2 và phục vụ ở `/media/...`. Lần đầu chưa có gì trong D1, site dùng nội dung mặc định dựng từ `lib/content/*`, `lib/products.ts`, `lib/retail.ts`… (`lib/cms/defaults.ts`). Bảng D1 tự tạo khi dùng lần đầu.

| Thêm gì | Sửa ở đâu |
|---|---|
| Loại section mới | Khai báo trường trong `lib/cms/registry.ts`, viết renderer cùng tên trong `components/blocks.tsx` (test sẽ báo nếu thiếu) |
| Trường mới cho sản phẩm/cài đặt | `lib/cms/types.ts` + `lib/cms/collections.ts` + giá trị mặc định trong `lib/cms/defaults.ts` |
| Biểu tượng chọn được | `lib/cms/icons.ts` + `components/cms/Icon.tsx` |
| Font có sẵn trong danh sách chọn | mảng `fonts` trong `lib/cms/theme.ts` (cần có dấu tiếng Việt) |

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
