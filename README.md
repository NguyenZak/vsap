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

## Form báo giá

`POST /api/inquiry` kiểm tra dữ liệu và chuyển tiếp JSON tới webhook nếu có biến `INQUIRY_WEBHOOK_URL` (Slack, Google Apps Script → Google Sheet, CRM…):

```sh
npx cf workers secrets update INQUIRY_WEBHOOK_URL
```

Chưa cấu hình thì yêu cầu chỉ được ghi log trong Worker.
