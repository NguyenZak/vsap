// Chính sách bắt buộc cho website bán hàng (điều khoản, bảo mật, thanh toán, vận chuyển,
// đổi trả). BẢN NHÁP do VSAP rà soát: các cam kết cụ thể (thời hạn đổi trả, kiểm hàng,
// thời gian hoàn tiền…) cần ban giám đốc xác nhận, tốt nhất có luật sư đọc trước khi dùng.
// Nội dung là Markdown (lib/markdown.ts). Mã {company} {taxId} {address} {phone} {email}
// {website} được thay bằng thông tin trong Studio › Công ty khi hiển thị.
// Chỉ có tiếng Việt và tiếng Anh; các ngôn ngữ khác hiện bản tiếng Anh.

type Seed = { slug: string; title: Record<"vi" | "en" | "zh" | "ja" | "ko", string>; body: { vi: string; en: string } };

export const UPDATED = "2026-10-22";

export const policies: Seed[] = [
  {
    slug: "terms",
    title: { vi: "Điều khoản dịch vụ", en: "Terms of service", zh: "服务条款", ja: "サービス利用規約", ko: "서비스 이용약관" },
    body: {
      vi: `Website {website} do **{company}** (mã số doanh nghiệp {taxId}) sở hữu và vận hành, giới thiệu và bán các sản phẩm mang thương hiệu VSAP: hạt điều, hạt macca và yến sào. Khi truy cập website hoặc đặt hàng, quý khách đồng ý với các điều khoản dưới đây.

## 1. Thông tin sản phẩm và giá
- Hình ảnh sản phẩm mang tính minh họa; bao bì thực tế có thể thay đổi theo lô sản xuất.
- Giá niêm yết bằng Việt Nam đồng (VNĐ) và **chưa bao gồm phí giao hàng**. VSAP thông báo phí giao hàng khi gọi điện xác nhận đơn.
- Giá có thể thay đổi; đơn hàng được tính theo giá hiển thị tại thời điểm đặt.

## 2. Đặt hàng và xác nhận đơn
- Đơn hàng chỉ được xác lập sau khi VSAP gọi điện xác nhận với quý khách.
- VSAP có thể từ chối hoặc hủy đơn khi không liên lạc được với quý khách, thông tin nhận hàng không chính xác, sản phẩm tạm hết hàng hoặc đơn có dấu hiệu gian lận. VSAP sẽ thông báo cho quý khách trong các trường hợp này.

## 3. Đơn hàng xuất khẩu và số lượng lớn
Giá, quy cách đóng gói, điều kiện giao hàng (FOB, CIF…) và phương thức thanh toán của đơn hàng xuất khẩu hoặc số lượng lớn được thỏa thuận riêng qua báo giá và hợp đồng. Các điều khoản trên website không thay thế hợp đồng đó.

## 4. Sở hữu trí tuệ
Nội dung, logo, hình ảnh và thiết kế bao bì VSAP thuộc quyền của {company}. Không sao chép, sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.

## 5. Trách nhiệm
VSAP nỗ lực bảo đảm thông tin trên website chính xác và cập nhật. Quý khách vui lòng đọc kỹ nhãn sản phẩm (thành phần, hạn sử dụng, hướng dẫn bảo quản), đặc biệt nếu có tiền sử dị ứng với các loại hạt.

## 6. Giải quyết khiếu nại
Mọi thắc mắc, khiếu nại xin liên hệ {phone} hoặc {email}. Tranh chấp (nếu có) được ưu tiên giải quyết bằng thương lượng; nếu không đạt được thỏa thuận, các bên giải quyết theo quy định của pháp luật Việt Nam.

## 7. Thông tin doanh nghiệp
- {company}
- Mã số doanh nghiệp: {taxId}
- Trụ sở: {address}
- Điện thoại: {phone} · Email: {email}`,
      en: `The website {website} is owned and operated by **{company}** (business registration no. {taxId}). It presents and sells VSAP-branded products: cashew nuts, macadamia nuts and edible bird’s nest. By using the website or placing an order you agree to these terms.

## 1. Product information and prices
- Product photos are illustrative; actual packaging may vary between production batches.
- Prices are in Vietnamese dong (VND) and **exclude delivery fees**. VSAP tells you the delivery fee when calling to confirm your order.
- Prices may change; an order is charged at the price shown when it was placed.

## 2. Ordering and confirmation
- An order is only confirmed once VSAP has called you to confirm it.
- VSAP may decline or cancel an order if we cannot reach you, the delivery details are incorrect, the product is out of stock or the order appears fraudulent. We will let you know in these cases.

## 3. Export and bulk orders
Prices, packing, delivery terms (FOB, CIF…) and payment for export or bulk orders are agreed separately in a quotation and contract. These website terms do not replace that contract.

## 4. Intellectual property
Content, logos, photos and VSAP packaging designs belong to {company}. They may not be copied or used commercially without written permission.

## 5. Responsibility
VSAP does its best to keep the information on this website accurate and up to date. Please read the product label (ingredients, best-before date, storage instructions), especially if you are allergic to nuts.

## 6. Complaints
Please contact {phone} or {email} with any question or complaint. Disputes are first settled by negotiation; failing agreement, they are resolved under the laws of Vietnam.

## 7. Company details
- {company}
- Business registration no.: {taxId}
- Head office: {address}
- Phone: {phone} · Email: {email}`,
    },
  },
  {
    slug: "privacy",
    title: { vi: "Chính sách bảo mật", en: "Privacy policy", zh: "隐私政策", ja: "プライバシーポリシー", ko: "개인정보 처리방침" },
    body: {
      vi: `{company} ("VSAP") tôn trọng và bảo vệ thông tin cá nhân của quý khách theo quy định pháp luật Việt Nam về bảo vệ dữ liệu cá nhân.

## 1. Thông tin chúng tôi thu thập
- **Khi đặt hàng:** họ tên, số điện thoại, email (không bắt buộc), địa chỉ nhận hàng và ghi chú.
- **Khi gửi yêu cầu báo giá:** họ tên, công ty, email, số điện thoại, quốc gia và nội dung yêu cầu.
- **Thông tin kỹ thuật:** địa chỉ IP được mã hóa một chiều để chống gửi đơn rác; VSAP không lưu địa chỉ IP gốc.
- **Trên trình duyệt của quý khách:** giỏ hàng, sản phẩm đã xem và ngôn ngữ đã chọn được lưu ngay trong trình duyệt (localStorage, cookie) để website ghi nhớ; các thông tin này không gửi về VSAP.

## 2. Mục đích sử dụng
- Xác nhận, xử lý và giao đơn hàng; liên hệ khi cần.
- Phản hồi yêu cầu báo giá và tư vấn.
- Thống kê lượt truy cập ẩn danh để cải thiện website (khi có sử dụng công cụ phân tích).

## 3. Chia sẻ thông tin
VSAP **không bán hay cho thuê** thông tin của quý khách. Thông tin chỉ được chia sẻ:
- Với đơn vị vận chuyển: phần thông tin cần cho việc giao hàng (họ tên, số điện thoại, địa chỉ).
- Với cơ quan nhà nước có thẩm quyền khi có yêu cầu theo quy định pháp luật.

## 4. Lưu trữ và bảo mật
- Dữ liệu được lưu trên hạ tầng máy chủ của Cloudflare; chỉ nhân sự VSAP được phân quyền mới truy cập được.
- Thông báo đơn hàng và yêu cầu báo giá được gửi tới nhóm làm việc nội bộ của bộ phận kinh doanh để xử lý kịp thời.
- Thông tin được lưu trong thời gian cần thiết để xử lý đơn hàng và thực hiện nghĩa vụ kế toán, thuế, hoặc đến khi quý khách yêu cầu xóa (nếu pháp luật cho phép).

## 5. Quyền của quý khách
Quý khách có quyền yêu cầu xem, chỉnh sửa, xóa thông tin cá nhân hoặc rút lại sự đồng ý bằng cách liên hệ {email} hoặc {phone}. VSAP phản hồi trong thời gian sớm nhất.

## 6. Liên hệ
{company} · {address} · {phone} · {email}`,
      en: `{company} ("VSAP") respects and protects your personal data in line with Vietnamese personal data protection law.

## 1. What we collect
- **When you order:** name, phone number, email (optional), delivery address and notes.
- **When you request a quote:** name, company, email, phone number, country and your message.
- **Technical data:** your IP address is stored only as a one-way hash, to block spam; VSAP does not keep the original IP address.
- **In your browser:** your cart, recently viewed products and chosen language are kept in your own browser (localStorage, cookie) so the website can remember them; they are not sent to VSAP.

## 2. Why we use it
- To confirm, process and deliver orders, and to contact you when needed.
- To answer quote requests and enquiries.
- To count visits anonymously and improve the website (when an analytics tool is in use).

## 3. Sharing
VSAP **does not sell or rent** your data. It is shared only:
- With the delivery company: the details needed to deliver (name, phone, address).
- With competent authorities when required by law.

## 4. Storage and security
- Data is stored on Cloudflare’s server infrastructure and only authorised VSAP staff can access it.
- Order and quote notifications go to the sales team’s internal work group so they can respond quickly.
- Data is kept as long as needed to fulfil orders and meet accounting and tax obligations, or until you ask us to delete it (where the law allows).

## 5. Your rights
You may ask to see, correct or delete your personal data, or withdraw consent, by contacting {email} or {phone}. We will reply as soon as possible.

## 6. Contact
{company} · {address} · {phone} · {email}`,
    },
  },
  {
    slug: "payment",
    title: { vi: "Chính sách thanh toán", en: "Payment policy", zh: "付款政策", ja: "お支払いについて", ko: "결제 정책" },
    body: {
      vi: `## 1. Đơn hàng bán lẻ trên website
- **Thanh toán khi nhận hàng (COD):** quý khách thanh toán bằng tiền mặt cho nhân viên giao hàng khi nhận hàng.
- Tổng tiền gồm giá sản phẩm và phí giao hàng; phí giao hàng được VSAP thông báo khi gọi xác nhận đơn.

## 2. Chuyển khoản
Trường hợp cần chuyển khoản (ví dụ đơn số lượng lớn), VSAP chỉ cung cấp **tài khoản ngân hàng đứng tên {company}** qua số điện thoại hoặc email chính thức trên website. Quý khách vui lòng không chuyển tiền vào tài khoản cá nhân hay tài khoản do người lạ cung cấp.

## 3. Hóa đơn
VSAP xuất hóa đơn điện tử theo quy định. Nếu cần hóa đơn đứng tên công ty, quý khách vui lòng ghi thông tin xuất hóa đơn trong phần ghi chú khi đặt hàng.

## 4. Đơn hàng xuất khẩu
Phương thức thanh toán (T/T, L/C…) và tỷ lệ đặt cọc được thỏa thuận trong báo giá và hợp đồng.

## 5. Lưu ý an toàn
VSAP **không bao giờ** yêu cầu quý khách cung cấp mật khẩu, mã OTP hay thông tin thẻ ngân hàng. Mọi yêu cầu như vậy đều không phải từ VSAP; vui lòng báo cho chúng tôi qua {phone}.`,
      en: `## 1. Retail orders on the website
- **Cash on delivery (COD):** you pay the delivery driver in cash when you receive your order.
- The total is the product price plus the delivery fee, which VSAP tells you when calling to confirm the order.

## 2. Bank transfer
If a bank transfer is needed (for example on a large order), VSAP only gives a **bank account in the name of {company}**, from the official phone number or email on this website. Please never pay into a personal account or one given by someone you don’t know.

## 3. Invoices
VSAP issues e-invoices as required by law. If you need an invoice in your company’s name, please add the invoice details in the order notes.

## 4. Export orders
Payment terms (T/T, L/C…) and deposits are agreed in the quotation and contract.

## 5. Stay safe
VSAP **never** asks for passwords, OTP codes or bank card details. Any such request is not from VSAP; please report it to us at {phone}.`,
    },
  },
  {
    slug: "shipping",
    title: { vi: "Chính sách vận chuyển và kiểm hàng", en: "Shipping & inspection policy", zh: "配送与验货政策", ja: "配送・検品について", ko: "배송 및 검수 정책" },
    body: {
      vi: `## 1. Phạm vi giao hàng
VSAP giao hàng toàn quốc, đến 34 tỉnh, thành phố, thông qua các đơn vị vận chuyển và chuyển phát.

## 2. Phí và thời gian giao hàng
Phí và thời gian giao hàng phụ thuộc vào địa chỉ nhận và khối lượng đơn hàng. VSAP thông báo cụ thể khi gọi điện xác nhận đơn, trước khi gửi hàng.

## 3. Kiểm tra khi nhận hàng
- Quý khách vui lòng kiểm tra tình trạng kiện hàng, số lượng và bao bì sản phẩm trước khi thanh toán.
- Nếu kiện hàng móp méo, rách hoặc sản phẩm không đúng đơn, quý khách có thể từ chối nhận hoặc chụp ảnh và báo ngay cho VSAP qua {phone}.

## 4. Không giao được hàng
Nếu đơn vị vận chuyển không liên lạc được với quý khách sau nhiều lần, đơn hàng có thể được hoàn về và VSAP sẽ liên hệ để sắp xếp giao lại.

## 5. Đơn hàng xuất khẩu
Giao hàng theo điều kiện FOB hoặc CIF đã thỏa thuận. VSAP hỗ trợ chuẩn bị chứng từ xuất khẩu, thông quan và đặt chỗ vận chuyển.`,
      en: `## 1. Where we deliver
VSAP delivers nationwide, to all 34 provinces and cities of Vietnam, through delivery and courier companies.

## 2. Delivery fee and time
The fee and delivery time depend on the address and the weight of the order. VSAP tells you both when calling to confirm the order, before it is shipped.

## 3. Checking on delivery
- Please check the parcel, the quantities and the product packaging before paying.
- If the parcel is dented or torn, or the products don’t match your order, you may refuse it, or take photos and tell VSAP straight away at {phone}.

## 4. Failed delivery
If the courier cannot reach you after several attempts, the parcel may be returned and VSAP will contact you to arrange delivery again.

## 5. Export orders
Delivered on the agreed FOB or CIF terms. VSAP helps prepare export documents, customs clearance and freight booking.`,
    },
  },
  {
    slug: "returns",
    title: { vi: "Chính sách đổi trả", en: "Returns & refunds policy", zh: "退换货与退款政策", ja: "返品・返金について", ko: "교환·환불 정책" },
    body: {
      vi: `## 1. Trường hợp được đổi trả
- Sản phẩm có lỗi chất lượng: ẩm mốc, có mùi lạ, có côn trùng hoặc dị vật.
- Bao bì bị hư hỏng trong quá trình vận chuyển.
- Giao sai sản phẩm hoặc thiếu số lượng so với đơn hàng.
- Sản phẩm đã quá hạn sử dụng khi nhận.

## 2. Trường hợp không áp dụng
- Sản phẩm đã mở và sử dụng một phần, trừ khi có lỗi chất lượng nêu trên.
- Đổi trả vì không hợp khẩu vị, vì đây là thực phẩm.
- Sản phẩm hư hỏng do bảo quản không đúng hướng dẫn trên nhãn sau khi nhận.

## 3. Thời hạn và cách thức
- Quý khách vui lòng báo cho VSAP **trong vòng 7 ngày kể từ ngày nhận hàng**, qua {phone} hoặc {email}, kèm ảnh hoặc video sản phẩm và bao bì.
- VSAP xác nhận và hướng dẫn gửi lại sản phẩm. Với lỗi từ phía VSAP, chúng tôi chịu toàn bộ phí vận chuyển đổi trả.

## 4. Hình thức xử lý
Tùy mong muốn của quý khách, VSAP đổi sản phẩm mới cùng loại hoặc hoàn tiền. Tiền được hoàn bằng chuyển khoản trong vòng 7 ngày làm việc kể từ khi VSAP nhận lại sản phẩm.`,
      en: `## 1. When you can return or exchange
- Quality defects: mould, an unusual smell, insects or foreign matter.
- Packaging damaged in transit.
- Wrong product, or fewer items than ordered.
- Product past its best-before date on arrival.

## 2. When returns don’t apply
- Opened and partly used products, unless they have one of the defects above.
- Returns because of taste preference, as these are food products.
- Damage caused by storage that doesn’t follow the label after delivery.

## 3. Time limit and how to return
- Please tell VSAP **within 7 days of delivery**, at {phone} or {email}, with photos or a video of the product and packaging.
- VSAP confirms and explains how to send the product back. When the fault is ours, we pay all return shipping costs.

## 4. Exchange or refund
As you prefer, VSAP sends a new product of the same kind or refunds you. Refunds are made by bank transfer within 7 working days after VSAP receives the product back.`,
    },
  },
];
