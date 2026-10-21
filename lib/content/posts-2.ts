// Bài viết mẫu 6–10 (xem lib/content/posts.ts).
import type { Post } from "../cms/types";

export const posts2: Post[] = [
  {
    slug: "tieu-chuan-chat-luong-nhan-dieu-xuat-khau",
    date: "2026-09-16",
    author: "VSAP",
    category: { vi: "Chất lượng", en: "Quality" },
    cover: { src: "/images/quality-inspection.webp", alt: { vi: "Kiểm tra nhân điều bằng tay đeo găng", en: "Gloved hand inspecting cashew kernels" } },
    title: {
      vi: "Tiêu chuẩn chất lượng nhân điều xuất khẩu: độ ẩm, aflatoxin, vi sinh",
      en: "Export quality standards for cashew kernels: moisture, aflatoxin, microbiology",
    },
    excerpt: {
      vi: "Ngoài kích cỡ, một lô nhân điều xuất khẩu được đánh giá qua độ ẩm, tỷ lệ vỡ, màu sắc, aflatoxin và vi sinh. Bài viết tổng hợp các chỉ tiêu thường gặp và giới hạn tại EU, Mỹ.",
      en: "Beyond size, an export cashew lot is judged on moisture, broken ratio, colour, aflatoxin and microbiology. Here are the usual parameters and the limits in the EU and US.",
    },
    seo: {
      title: { vi: "Tiêu chuẩn chất lượng nhân điều xuất khẩu (EU, Mỹ)", en: "Cashew kernel quality standards for export" },
      description: {
        vi: "Chỉ tiêu chất lượng nhân điều xuất khẩu: độ ẩm tối đa 5%, tỷ lệ vỡ, aflatoxin theo Quy định (EU) 2023/915 và FDA, vi sinh, COA và kiểm định bên thứ ba.",
        en: "Export cashew kernel specs: max 5% moisture, broken ratio, aflatoxin limits (EU Regulation 2023/915, US FDA), microbiology, COA and third-party checks.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Nhân điều xuất khẩu thường phải đạt **độ ẩm không quá 5%**, đúng cỡ hạt và màu theo mã (ví dụ W320), tỷ lệ hạt vỡ và tạp chất trong giới hạn hợp đồng, không có côn trùng sống, và đạt giới hạn **aflatoxin** cùng các chỉ tiêu **vi sinh** của thị trường nhập khẩu. Kết quả được thể hiện trong phiếu phân tích chất lượng (COA) và có thể được kiểm định bởi bên thứ ba như SGS, Intertek.

## Nhóm chỉ tiêu cảm quan và vật lý

- **Kích cỡ**: số hạt mỗi pound đúng với mã (W180–W450). Xem [bảng phân loại nhân điều](/news/phan-loai-hat-dieu-w180-w240-w320).
- **Màu sắc**: nhân trắng (W) có màu trắng ngà, xám tro nhạt hoặc vàng nhạt đồng đều; nhân sậm được xếp vào SW.
- **Tỷ lệ hạt vỡ**: lô nhân nguyên hạt thường chỉ cho phép một tỷ lệ nhỏ hạt vỡ hoặc hạt cỡ thấp hơn, theo quy cách AFI và hợp đồng.
- **Độ ẩm**: tối đa 5% là mức phổ biến trong quy cách quốc tế. Độ ẩm cao làm nhân mềm, dễ mốc và giảm thời hạn sử dụng.
- **Tạp chất và lỗi**: không có vỏ, vỏ lụa sót quá mức, mảnh kim loại, côn trùng sống; hạn chế nhân bị đốm, teo, sâu.
- **Mùi vị**: thơm đặc trưng, không ôi dầu, không mùi lạ.

## Aflatoxin: giới hạn tại EU và Mỹ

Aflatoxin là độc tố do một số loại nấm mốc sinh ra khi hạt bị ẩm. Đây là chỉ tiêu bắt buộc với hầu hết thị trường:

- **Liên minh châu Âu**: theo Quy định (EU) 2023/915, với các loại hạt cây (ngoài hạnh nhân, hồ trăn, nhân mơ) dùng trực tiếp cho người, giới hạn là **2,0 µg/kg aflatoxin B1** và **4,0 µg/kg tổng aflatoxin**. Mức cao hơn áp dụng cho hạt sẽ qua chế biến phân loại tiếp.
- **Hoa Kỳ**: FDA áp dụng mức hành động **20 µg/kg (ppb) tổng aflatoxin** cho thực phẩm.
- **Các thị trường khác** (Trung Đông, Trung Quốc, Úc…) có giới hạn riêng; người mua nên ghi rõ trong hợp đồng.

## Chỉ tiêu vi sinh thường gặp

Người mua thường đưa vào hợp đồng các chỉ tiêu như: **Salmonella không phát hiện trong 25 g**, E. coli, tổng số vi khuẩn hiếu khí, nấm men – nấm mốc, Enterobacteriaceae. Giới hạn cụ thể tuỳ khách hàng và thị trường. Nhân điều thô (chưa rang) sẽ có mức vi sinh khác với nhân đã rang.

![Nhân điều trắng sau phân loại](/images/cashew-kernels.webp "Màu sắc đồng đều là một trong các chỉ tiêu cảm quan")

## Chứng từ chứng minh chất lượng

1. **COA (Certificate of Analysis)**: kết quả kiểm tra của nhà sản xuất cho từng lô.
2. **Phiếu kiểm nghiệm của phòng thí nghiệm độc lập**: aflatoxin, vi sinh, dư lượng thuốc bảo vệ thực vật nếu cần.
3. **Kiểm định bên thứ ba**: SGS, Intertek, Bureau Veritas… kiểm tra số lượng, chất lượng, đóng gói và giám sát đóng container theo yêu cầu của người mua.
4. **Kiểm dịch thực vật, xông trùng** (nếu thị trường yêu cầu).

## Câu hỏi thường gặp

### Độ ẩm tiêu chuẩn của nhân điều là bao nhiêu?

Quy cách quốc tế phổ biến yêu cầu độ ẩm nhân điều không quá 5%. Nhiều người mua đặt yêu cầu chặt hơn cho hàng bán lẻ cao cấp.

### Giới hạn aflatoxin cho hạt điều ở EU là bao nhiêu?

Với hạt điều dùng trực tiếp cho người, Quy định (EU) 2023/915 đặt giới hạn 2,0 µg/kg aflatoxin B1 và 4,0 µg/kg tổng aflatoxin.

### Có nên thuê kiểm định bên thứ ba không?

Nên, đặc biệt với đơn hàng đầu tiên hoặc lô lớn. Kiểm định độc lập giúp xác nhận chất lượng trước khi hàng rời cảng và hạn chế tranh chấp.

## Nguồn tham khảo

- Quy định (EU) 2023/915 về giới hạn tối đa chất ô nhiễm trong thực phẩm — [eur-lex.europa.eu](https://eur-lex.europa.eu/eli/reg/2023/915/oj)
- U.S. Food and Drug Administration (FDA), mức hành động với aflatoxin — [fda.gov](https://www.fda.gov)
- Association of Food Industries (AFI), *Specifications for Cashew Kernels* — [afius.org](https://www.afius.org)

---

Tại VSAP, độ ẩm, tạp chất và tỷ lệ vỡ được đo cho từng lô; kiểm nghiệm vi sinh, aflatoxin và kiểm định bên thứ ba thực hiện theo yêu cầu thị trường nhập khẩu. Xem [quy trình kiểm soát chất lượng](/quality).`,
      en: `**Quick answer:** Export cashew kernels are usually required to have **no more than 5% moisture**, the right size and colour for their grade (e.g. W320), broken kernels and foreign matter within contract limits, no live insects, and to meet the **aflatoxin** and **microbiological** limits of the destination market. Results are reported in a certificate of analysis (COA) and can be verified by third parties such as SGS or Intertek.

## Physical and sensory parameters

- **Size**: kernel count per pound matching the grade (W180–W450). See [cashew grades explained](/news/phan-loai-hat-dieu-w180-w240-w320).
- **Colour**: white kernels (W) are an even ivory, pale ash-grey or light yellow; darker kernels are graded SW.
- **Broken ratio**: whole-kernel lots allow only a small share of broken or lower-size kernels, per AFI specifications and the contract.
- **Moisture**: a maximum of 5% is the common international specification. Higher moisture softens kernels, invites mould and shortens shelf life.
- **Foreign matter and defects**: no shell, minimal skin, no metal, no live insects; limits on spotted, shrivelled or insect-damaged kernels.
- **Taste and smell**: characteristic, not rancid, no off-odours.

## Aflatoxin limits in the EU and US

Aflatoxins are toxins produced by certain moulds when nuts get damp. Nearly every market tests for them:

- **European Union**: under Regulation (EU) 2023/915, tree nuts (other than almonds, pistachios and apricot kernels) for direct human consumption are limited to **2.0 µg/kg aflatoxin B1** and **4.0 µg/kg total aflatoxins**. Higher limits apply to nuts that will be sorted or processed further.
- **United States**: the FDA applies an action level of **20 µg/kg (ppb) total aflatoxins** for food.
- **Other markets** (Middle East, China, Australia…) set their own limits; state them in the contract.

## Common microbiological parameters

Buyers usually specify parameters such as **Salmonella absent in 25 g**, E. coli, total aerobic plate count, yeasts and moulds and Enterobacteriaceae. Exact limits depend on the customer and market, and raw kernels have different expectations from roasted ones.

![Graded white cashew kernels](/images/cashew-kernels.webp "Even colour is one of the sensory parameters")

## Documents that prove quality

1. **COA (Certificate of Analysis)**: the producer's test results for each lot.
2. **Independent laboratory reports**: aflatoxin, microbiology and pesticide residues where needed.
3. **Third-party inspection**: SGS, Intertek, Bureau Veritas and others check quantity, quality and packing, and supervise container loading at the buyer's request.
4. **Phytosanitary and fumigation certificates** where the market requires them.

## Frequently asked questions

### What is the standard moisture for cashew kernels?

The common international specification is no more than 5% moisture. Many buyers set tighter limits for premium retail.

### What is the EU aflatoxin limit for cashews?

For cashews intended for direct human consumption, Regulation (EU) 2023/915 sets 2.0 µg/kg for aflatoxin B1 and 4.0 µg/kg for total aflatoxins.

### Should I use third-party inspection?

Yes, especially for a first order or a large lot. Independent inspection confirms quality before the goods leave port and reduces the risk of disputes.

## Sources

- Regulation (EU) 2023/915 on maximum levels for certain contaminants in food — [eur-lex.europa.eu](https://eur-lex.europa.eu/eli/reg/2023/915/oj)
- U.S. Food and Drug Administration (FDA), aflatoxin action levels — [fda.gov](https://www.fda.gov)
- Association of Food Industries (AFI), *Specifications for Cashew Kernels* — [afius.org](https://www.afius.org)

---

At VSAP, moisture, foreign matter and broken ratio are measured for every lot; microbiology, aflatoxin testing and third-party inspection are carried out as the destination market requires. See our [quality control process](/quality).`,
    },
  },
  {
    slug: "huong-dan-nhap-khau-hat-dieu-tu-viet-nam",
    date: "2026-09-30",
    author: "VSAP",
    category: { vi: "Xuất khẩu", en: "Export" },
    cover: { src: "/images/shipping.webp", alt: { vi: "Tàu container cập cảng", en: "Container ship at port" } },
    title: {
      vi: "Hướng dẫn nhập khẩu hạt điều từ Việt Nam: chứng từ, Incoterms, thanh toán",
      en: "How to import cashews from Vietnam: documents, Incoterms and payment",
    },
    excerpt: {
      vi: "Từ yêu cầu báo giá đến khi container cập cảng: các bước nhập khẩu nhân điều Việt Nam, bộ chứng từ cần có, điều kiện giao hàng FOB/CIF và các phương thức thanh toán thường dùng.",
      en: "From quote request to container arrival: the steps to import Vietnamese cashew kernels, the documents you need, FOB/CIF terms and common payment methods.",
    },
    seo: {
      title: { vi: "Nhập khẩu hạt điều Việt Nam: quy trình và chứng từ", en: "Importing cashews from Vietnam: a buyer's guide" },
      description: {
        vi: "Quy trình nhập khẩu nhân điều từ Việt Nam: mẫu thử, hợp đồng, FOB/CIF, chứng từ (C/O, B/L, COA, kiểm dịch), thanh toán T/T, L/C và đóng container 20ft.",
        en: "Importing cashew kernels from Vietnam: samples, contract, FOB/CIF, documents (C/O, B/L, COA, phytosanitary), T/T or L/C payment and 20ft container loads.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Nhập khẩu nhân điều từ Việt Nam thường đi qua 6 bước: gửi yêu cầu và nhận mẫu thử, thống nhất quy cách và giá, ký hợp đồng (điều kiện FOB hoặc CIF), thanh toán đặt cọc hoặc mở L/C, sản xuất – kiểm định – đóng container, và nhận bộ chứng từ để thông quan. Một container 20 feet chứa khoảng **700 thùng** nhân điều 50 lb, tương đương gần **16 tấn**.

## Các bước nhập khẩu nhân điều

1. **Gửi yêu cầu**: nêu rõ mã (W240, W320…), số lượng, quy cách đóng gói, cảng đến, thời gian giao hàng và yêu cầu chứng nhận của thị trường.
2. **Nhận báo giá và mẫu thử**: đánh giá mẫu theo kích cỡ, màu, độ ẩm, mùi vị. Lưu lại một phần mẫu làm *mẫu đối chứng*.
3. **Ký hợp đồng**: ghi rõ quy cách kỹ thuật, dung sai, điều kiện giao hàng (Incoterms), thời gian giao, phương thức thanh toán, kiểm định và cách xử lý khiếu nại.
4. **Thanh toán đợt đầu**: đặt cọc T/T hoặc mở L/C.
5. **Sản xuất, kiểm tra, đóng container**: nhà cung cấp kiểm tra chất lượng lô hàng; người mua có thể chỉ định bên thứ ba kiểm định và giám sát đóng hàng.
6. **Giao chứng từ và nhận hàng**: người mua nhận bộ chứng từ (bản scan trước, bản gốc sau) để làm thủ tục hải quan tại cảng đến.

## Bộ chứng từ xuất khẩu thường có

- Hợp đồng, **hóa đơn thương mại** (Commercial Invoice), **phiếu đóng gói** (Packing List).
- **Vận đơn** (Bill of Lading).
- **Giấy chứng nhận xuất xứ** (C/O). Tuỳ thị trường, C/O theo các hiệp định thương mại tự do có thể giúp giảm thuế nhập khẩu, ví dụ EVFTA với EU, RCEP, CPTPP.
- **Giấy chứng nhận kiểm dịch thực vật** (Phytosanitary Certificate), nếu nước nhập yêu cầu.
- **Phiếu phân tích chất lượng (COA)** và phiếu kiểm nghiệm độc lập.
- **Chứng thư kiểm định** của SGS, Intertek… nếu hợp đồng yêu cầu.
- Chứng nhận xông trùng, chứng nhận sức khoẻ… tuỳ thị trường.

## FOB hay CIF?

Theo Incoterms 2020 của Phòng Thương mại Quốc tế (ICC):

- **FOB (Free On Board)**: người bán giao hàng lên tàu tại cảng Việt Nam (thường là Cát Lái – TP.HCM). Người mua tự thuê tàu và mua bảo hiểm. Phù hợp khi người mua có hãng vận chuyển quen với giá tốt.
- **CIF (Cost, Insurance and Freight)**: người bán trả cước và bảo hiểm đến cảng đích. Phù hợp với người mua muốn đơn giản hoá khâu vận chuyển.
- **CFR**: giống CIF nhưng người mua tự mua bảo hiểm.

## Phương thức thanh toán thường dùng

- **T/T (chuyển khoản)**: thường đặt cọc một phần khi ký hợp đồng, phần còn lại thanh toán khi nhận bản sao vận đơn.
- **L/C (thư tín dụng)**: ngân hàng đứng ra bảo đảm; an toàn cho cả hai bên nhưng chi phí và thủ tục nhiều hơn.
- **CAD (nhờ thu kèm chứng từ)**: người mua thanh toán tại ngân hàng để nhận chứng từ.

Tỷ lệ đặt cọc và thời điểm thanh toán được thoả thuận cụ thể trong hợp đồng.

![Container hàng tại cảng](/images/shipping.webp "Nhân điều thường được vận chuyển bằng container 20 feet")

## Đóng gói và sức chứa container

Quy cách phổ biến là **thùng carton 50 lb (22,68 kg)** gồm 2 túi 25 lb hút chân không nạp CO₂ hoặc nitơ, hoặc thùng thiếc. Một container 20 feet chứa khoảng 700 thùng, tương đương khoảng 15,9 tấn. Đơn hàng nhỏ hơn có thể đi hàng lẻ (LCL) hoặc gộp nhiều mã trong một container. Xem thêm [cách đóng gói và bảo quản hạt điều, macca](/news/dong-goi-bao-quan-hat-dieu-macca).

## Câu hỏi thường gặp

### Đơn hàng tối thiểu khi nhập nhân điều là bao nhiêu?

Đơn hàng xuất khẩu thường tính theo container 20 feet (khoảng 16 tấn), nhưng có thể gộp nhiều mã trong một container hoặc đi hàng lẻ. Hãy trao đổi với nhà cung cấp về khối lượng cụ thể.

### Nhân điều Việt Nam vào EU có được giảm thuế không?

Hiệp định EVFTA giúp nhiều mặt hàng nông sản Việt Nam được ưu đãi thuế khi vào EU, với điều kiện đáp ứng quy tắc xuất xứ. Người mua nên kiểm tra mã HS và mức thuế hiện hành với cơ quan hải quan nước mình.

### Mã HS của nhân điều là gì?

Hạt điều thuộc nhóm HS 0801; nhân điều đã bóc vỏ thường khai báo mã 0801.32. Mã chi tiết có thể khác nhau theo biểu thuế từng nước.

## Nguồn tham khảo

- International Chamber of Commerce (ICC), *Incoterms® 2020* — [iccwbo.org](https://iccwbo.org)
- Hiệp định Thương mại Tự do Việt Nam – EU (EVFTA)
- Tổ chức Hải quan Thế giới, Hệ thống hài hoà (HS) chương 08

---

VSAP giao hàng theo điều kiện FOB hoặc CIF và chuẩn bị đầy đủ chứng từ theo yêu cầu từng thị trường. [Gửi yêu cầu báo giá](/contact): đội ngũ kinh doanh phản hồi trong vòng 1 ngày làm việc.`,
      en: `**Quick answer:** Importing cashew kernels from Vietnam usually takes six steps: send an enquiry and get samples, agree specifications and price, sign a contract (FOB or CIF), pay a deposit or open an L/C, production with inspection and container loading, and receive the documents for customs clearance. A 20-foot container holds about **700 cartons** of 50 lb kernels, close to **16 tonnes**.

## Step by step

1. **Enquiry**: state the grade (W240, W320…), quantity, packing, destination port, shipment period and any certification your market needs.
2. **Quote and samples**: assess samples for size, colour, moisture and taste. Keep part of each sample as a *reference sample*.
3. **Contract**: specify technical specs, tolerances, Incoterms, shipment date, payment terms, inspection and how claims are handled.
4. **First payment**: a T/T deposit or an L/C.
5. **Production, inspection, loading**: the supplier checks the lot; the buyer can appoint a third party to inspect and supervise loading.
6. **Documents and arrival**: the buyer receives the documents (scans first, originals after) to clear customs at destination.

## Typical export documents

- Contract, **Commercial Invoice** and **Packing List**.
- **Bill of Lading**.
- **Certificate of Origin** (C/O). Under free trade agreements such as EVFTA (EU), RCEP or CPTPP, the right C/O can reduce import duty.
- **Phytosanitary Certificate**, if the importing country requires it.
- **Certificate of Analysis (COA)** and independent lab reports.
- **Inspection certificate** from SGS, Intertek or similar, if the contract requires it.
- Fumigation, health or other certificates depending on the market.

## FOB or CIF?

Under the International Chamber of Commerce's Incoterms 2020:

- **FOB (Free On Board)**: the seller loads the goods on board at a Vietnamese port (usually Cat Lai, Ho Chi Minh City). The buyer books freight and insurance. Good if you have a forwarder with strong rates.
- **CIF (Cost, Insurance and Freight)**: the seller pays freight and insurance to the destination port. Simpler for the buyer.
- **CFR**: like CIF, but the buyer arranges insurance.

## Common payment methods

- **T/T (bank transfer)**: usually a deposit at contract signing and the balance against a copy of the bill of lading.
- **L/C (letter of credit)**: the bank guarantees payment; secure for both sides but with more cost and paperwork.
- **CAD (cash against documents)**: the buyer pays at the bank to release the documents.

Deposit size and payment timing are agreed in each contract.

![Containers at port](/images/shipping.webp "Cashew kernels usually ship in 20-foot containers")

## Packing and container capacity

The standard is a **50 lb (22.68 kg) carton** holding two 25 lb vacuum pouches flushed with CO₂ or nitrogen, or tins. A 20-foot container takes about 700 cartons, roughly 15.9 tonnes. Smaller orders can ship LCL or combine several grades in one container. See also [packing and storing cashews and macadamias](/news/dong-goi-bao-quan-hat-dieu-macca).

## Frequently asked questions

### What is the minimum order for cashew kernels?

Export orders are usually counted in 20-foot containers (about 16 tonnes), but grades can be combined in one container or shipped LCL. Discuss exact volumes with your supplier.

### Do Vietnamese cashews get lower duty in the EU?

EVFTA gives many Vietnamese agricultural products preferential duty in the EU, provided the rules of origin are met. Check the HS code and current rate with your customs authority.

### What is the HS code for cashew kernels?

Cashews fall under HS heading 0801; shelled cashew kernels are usually declared under 0801.32. National tariff lines may add further digits.

## Sources

- International Chamber of Commerce (ICC), *Incoterms® 2020* — [iccwbo.org](https://iccwbo.org)
- EU–Vietnam Free Trade Agreement (EVFTA)
- World Customs Organization, Harmonized System, chapter 08

---

VSAP ships FOB or CIF and prepares the full document set each market requires. [Request a quote](/contact): our sales team replies within one business day.`,
    },
  },
  {
    slug: "dong-goi-bao-quan-hat-dieu-macca",
    date: "2026-10-07",
    author: "VSAP",
    category: { vi: "Kiến thức sản phẩm", en: "Product guide" },
    cover: { src: "/images/cashew-roasted.webp", alt: { vi: "Hạt điều rang vàng", en: "Golden roasted cashews" } },
    title: {
      vi: "Đóng gói và bảo quản hạt điều, hạt macca: giữ hạt giòn thơm được bao lâu?",
      en: "Packing and storing cashews and macadamias: how long do they stay fresh?",
    },
    excerpt: {
      vi: "Hạt điều và macca giàu chất béo nên dễ hút ẩm và ôi dầu. Đóng gói hút chân không, nạp khí trơ và bảo quản mát giúp kéo dài thời hạn sử dụng. Hướng dẫn cho nhà nhập khẩu, nhà phân phối và người tiêu dùng.",
      en: "Cashews and macadamias are rich in fat, so they absorb moisture and go rancid easily. Vacuum packing, inert gas and cool storage extend shelf life. A guide for importers, distributors and consumers.",
    },
    seo: {
      title: { vi: "Cách đóng gói và bảo quản hạt điều, hạt macca", en: "How to pack and store cashews and macadamias" },
      description: {
        vi: "Đóng gói hút chân không, nạp CO₂/nitơ; bảo quản nơi khô mát, độ ẩm thấp. Thời hạn sử dụng nhân điều, macca và cách nhận biết hạt bị ôi dầu.",
        en: "Vacuum packing with CO₂ or nitrogen, cool and dry storage, typical shelf life for cashew and macadamia kernels, and how to spot rancid nuts.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Kẻ thù của hạt điều và hạt macca là **độ ẩm, oxy, nhiệt độ cao và ánh sáng**. Hàng xuất khẩu được đóng gói hút chân không và nạp khí CO₂ hoặc nitơ để hạn chế oxy hoá. Khi lưu kho, nên giữ hạt ở nơi khô ráo, thoáng mát, tránh nắng; kho lạnh giúp kéo dài thời hạn sử dụng. Sau khi mở bao, hãy đóng kín và dùng trong vài tuần.

## Vì sao hạt dễ bị hỏng?

- **Chất béo cao**: nhân điều chứa khoảng 44% chất béo, macca khoảng 76%. Chất béo tiếp xúc oxy và nhiệt sẽ bị oxy hoá, gây mùi ôi dầu.
- **Hút ẩm**: nhân khô dễ hút hơi nước từ không khí, làm mất độ giòn và tạo điều kiện cho nấm mốc.
- **Côn trùng**: kho bẩn hoặc bao bì hở có thể bị mọt, ngài tấn công.

## Quy cách đóng gói xuất khẩu

1. **Túi hút chân không nạp khí**: túi nhiều lớp (thường có lớp nhôm) hút hết không khí rồi nạp CO₂ hoặc nitơ, giảm oxy trong bao.
2. **Thùng carton 50 lb**: hai túi 25 lb mỗi thùng với nhân điều; macca thường đóng túi 11,34 kg hoặc theo yêu cầu.
3. **Thùng thiếc**: bảo vệ tốt trước va đập và côn trùng, dùng cho một số thị trường truyền thống.
4. **Bao bì bán lẻ**: hũ, hộp, túi zip có van hoặc lớp chắn ẩm, từ 250 g đến 1 kg.

## Điều kiện bảo quản khuyến nghị

- **Nhiệt độ**: càng mát càng tốt. Kho thường thoáng mát dùng được cho thời gian ngắn; lưu kho dài nên dùng kho lạnh (khoảng 5–10 °C).
- **Độ ẩm không khí**: thấp, tránh nơi nồm ẩm. Không đặt thùng trực tiếp xuống sàn; dùng pallet.
- **Ánh sáng và mùi**: tránh nắng trực tiếp; không để chung với hàng có mùi mạnh (cá khô, hoá chất, gia vị) vì hạt dễ ám mùi.
- **Luân chuyển kho**: nhập trước xuất trước (FIFO), theo dõi ngày sản xuất từng lô.

![Hạt macca nguyên vỏ](/images/macadamia-spoon.webp "Macca nguyên vỏ giữ được lâu hơn nhân đã tách")

## Thời hạn sử dụng tham khảo

- **Nhân điều đóng gói hút chân không, chưa mở**: thường khoảng 12 tháng trong điều kiện bảo quản phù hợp.
- **Nhân macca**: nhạy với ôi dầu hơn do hàm lượng chất béo cao; nên bảo quản mát và dùng sớm.
- **Macca nguyên vỏ (NIS)**: lớp vỏ cứng bảo vệ nhân, thường giữ được lâu hơn nhân đã tách.
- **Sau khi mở bao**: đóng kín, cất nơi mát hoặc ngăn mát tủ lạnh, dùng trong vài tuần.

Thời hạn cụ thể luôn được ghi trên bao bì của từng lô.

## Cách nhận biết hạt bị hỏng

- Mùi ôi, hắc giống dầu cũ, vị đắng.
- Hạt mềm, dai, mất độ giòn.
- Có đốm mốc, tơ trắng hoặc dấu vết côn trùng.

Không nên dùng hạt có dấu hiệu mốc vì có thể chứa độc tố aflatoxin.

## Câu hỏi thường gặp

### Hạt điều để được bao lâu?

Nhân điều đóng gói hút chân không, chưa mở thường dùng tốt trong khoảng 12 tháng nếu bảo quản nơi khô mát. Sau khi mở, nên dùng trong vài tuần.

### Có nên để hạt điều, macca trong tủ lạnh?

Có. Nhiệt độ thấp làm chậm quá trình ôi dầu. Hãy cho hạt vào hộp kín để không bị hút ẩm và ám mùi thực phẩm khác.

### Vì sao hàng xuất khẩu được nạp khí CO₂ hoặc nitơ?

Khí trơ thay thế oxy trong bao, giúp chậm oxy hoá chất béo và hạn chế côn trùng, nhờ đó hạt giữ được hương vị lâu hơn trong quá trình vận chuyển dài ngày.

## Nguồn tham khảo

- Association of Food Industries (AFI), quy cách đóng gói nhân điều — [afius.org](https://www.afius.org)
- USDA FoodData Central, thành phần dinh dưỡng hạt điều, hạt macca — [fdc.nal.usda.gov](https://fdc.nal.usda.gov)

---

VSAP đóng gói hút chân không nạp khí cho hàng xuất khẩu và nhận bao bì bán lẻ 250 g – 1 kg in nhãn riêng (OEM). [Liên hệ](/contact) để nhận quy cách đóng gói chi tiết.`,
      en: `**Quick answer:** Cashews and macadamias are spoiled by **moisture, oxygen, heat and light**. Export lots are vacuum packed and flushed with CO₂ or nitrogen to slow oxidation. In storage, keep nuts dry, cool and out of the sun; cold storage extends shelf life. After opening, reseal and use within a few weeks.

## Why do nuts spoil?

- **High fat content**: cashew kernels are about 44% fat and macadamias about 76%. Fat exposed to oxygen and heat oxidises and turns rancid.
- **Moisture uptake**: dry kernels absorb water from the air, losing crunch and inviting mould.
- **Insects**: dirty stores or open packs attract moths and weevils.

## Export packing

1. **Vacuum pouches with inert gas**: multilayer pouches (often with a foil layer) are evacuated and flushed with CO₂ or nitrogen to remove oxygen.
2. **50 lb cartons**: two 25 lb pouches per carton for cashews; macadamias often in 11.34 kg pouches or as agreed.
3. **Tins**: strong protection against impact and insects, still used in some traditional markets.
4. **Retail packs**: jars, boxes and zip pouches with moisture barriers, 250 g to 1 kg.

## Recommended storage

- **Temperature**: the cooler the better. A cool, ventilated store works for short periods; for long storage use cold rooms (about 5–10 °C).
- **Humidity**: keep it low and avoid damp areas. Store cartons on pallets, not on the floor.
- **Light and odours**: avoid direct sun; don't store next to strong-smelling goods (dried fish, chemicals, spices), as nuts pick up odours.
- **Stock rotation**: first in, first out (FIFO), tracking the production date of each lot.

![In-shell macadamias](/images/macadamia-spoon.webp "In-shell macadamias keep longer than kernels")

## Typical shelf life

- **Vacuum-packed cashew kernels, unopened**: typically around 12 months under proper storage.
- **Macadamia kernels**: more prone to rancidity because of their high fat content; keep them cool and use them sooner.
- **In-shell macadamias (NIS)**: the hard shell protects the kernel, so they usually keep longer than kernels.
- **After opening**: reseal, keep cool or refrigerated and use within a few weeks.

The exact best-before date is printed on every lot.

## How to spot spoiled nuts

- A rancid, paint-like or stale-oil smell, or a bitter taste.
- Soft, chewy nuts that have lost their crunch.
- Mould spots, white threads or signs of insects.

Don't eat nuts that show mould, as they may contain aflatoxins.

## Frequently asked questions

### How long do cashews last?

Vacuum-packed cashew kernels, unopened, usually keep well for around 12 months in a cool, dry place. Once opened, use them within a few weeks.

### Should cashews and macadamias go in the fridge?

Yes. Low temperatures slow rancidity. Use an airtight container so the nuts don't absorb moisture or other food odours.

### Why are export packs flushed with CO₂ or nitrogen?

The inert gas replaces oxygen in the pack, slowing fat oxidation and discouraging insects, so the nuts keep their flavour through long sea voyages.

## Sources

- Association of Food Industries (AFI), cashew kernel packing specifications — [afius.org](https://www.afius.org)
- USDA FoodData Central, cashew and macadamia composition — [fdc.nal.usda.gov](https://fdc.nal.usda.gov)

---

VSAP vacuum packs export lots with inert gas and offers private-label (OEM) retail packs from 250 g to 1 kg. [Contact us](/contact) for detailed packing specifications.`,
    },
  },
  {
    slug: "gia-tri-dinh-duong-hat-dieu-hat-macca",
    date: "2026-10-14",
    author: "VSAP",
    category: { vi: "Dinh dưỡng", en: "Nutrition" },
    cover: { src: "/images/cashew.webp", alt: { vi: "Nhân hạt điều nguyên hạt", en: "Whole cashew kernels" } },
    title: {
      vi: "Giá trị dinh dưỡng của hạt điều và hạt macca: so sánh và khẩu phần hợp lý",
      en: "Cashew and macadamia nutrition: how they compare and how much to eat",
    },
    excerpt: {
      vi: "Hạt điều giàu đạm, magie và đồng; hạt macca giàu chất béo không bão hoà đơn. So sánh thành phần dinh dưỡng trên 100 g theo dữ liệu USDA và gợi ý khẩu phần mỗi ngày.",
      en: "Cashews are rich in protein, magnesium and copper; macadamias in monounsaturated fat. A per-100 g comparison from USDA data, with a suggested daily serving.",
    },
    seo: {
      title: { vi: "Dinh dưỡng hạt điều và hạt macca: so sánh trên 100 g", en: "Cashew vs macadamia nutrition per 100 g" },
      description: {
        vi: "100 g hạt điều có khoảng 553 kcal và 18 g đạm; 100 g macca khoảng 718 kcal và 76 g chất béo, chủ yếu không bão hoà đơn. Khẩu phần khuyến nghị khoảng 30 g/ngày.",
        en: "100 g of cashews: about 553 kcal and 18 g protein. 100 g of macadamias: about 718 kcal and 76 g fat, mostly monounsaturated. Serving: about 30 g a day.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Theo dữ liệu USDA, 100 g hạt điều cung cấp khoảng **553 kcal, 18 g đạm, 44 g chất béo** và nhiều magie, đồng, kẽm. 100 g hạt macca cung cấp khoảng **718 kcal, 8 g đạm, 76 g chất béo**, trong đó phần lớn là chất béo không bão hoà đơn. Cả hai đều giàu năng lượng, vì vậy một khẩu phần hợp lý là khoảng **30 g mỗi ngày** (một nắm tay nhỏ).

## Bảng so sánh dinh dưỡng (trên 100 g, hạt thô)

**Hạt điều**

- Năng lượng: khoảng 553 kcal
- Chất đạm: khoảng 18 g
- Chất béo: khoảng 44 g (chủ yếu không bão hoà đơn và đa)
- Carbohydrate: khoảng 30 g, chất xơ khoảng 3 g
- Khoáng chất nổi bật: magie (khoảng 290 mg), đồng (khoảng 2,2 mg), kẽm, sắt

**Hạt macca**

- Năng lượng: khoảng 718 kcal
- Chất đạm: khoảng 8 g
- Chất béo: khoảng 76 g, trong đó khoảng 59 g là chất béo không bão hoà đơn
- Carbohydrate: khoảng 14 g, chất xơ khoảng 9 g
- Nổi bật: mangan, thiamin (vitamin B1); macca là một trong số ít thực phẩm có axit palmitoleic (omega-7)

Số liệu là giá trị trung bình, có thể thay đổi theo giống, vùng trồng và cách chế biến (rang, tẩm muối).

## Hạt điều phù hợp với ai?

- Người cần bổ sung **đạm thực vật**, ví dụ người ăn chay.
- Người muốn bổ sung **magie và đồng** từ thực phẩm tự nhiên.
- Dùng làm **sữa hạt, bơ hạt, sốt kem thuần chay** nhờ vị béo nhẹ, kết cấu mịn khi xay.

## Hạt macca phù hợp với ai?

- Người theo chế độ ăn **ít carbohydrate** hoặc keto, nhờ tỷ lệ chất béo cao và carbohydrate thấp.
- Người muốn thay một phần chất béo bão hoà bằng **chất béo không bão hoà đơn**.
- Dùng làm món ăn vặt, trộn salad, làm bánh hoặc ép dầu macca.

![Hạt macca nguyên vỏ và nhân](/images/macadamia.webp "Macca giàu chất béo không bão hoà đơn")

## Ăn bao nhiêu là đủ?

Nhiều khuyến nghị dinh dưỡng gợi ý khoảng **30 g hạt mỗi ngày**, tương đương khoảng 18 hạt điều hoặc 10–12 hạt macca. Nên chọn hạt rang mộc hoặc ít muối, và tính phần năng lượng này vào tổng năng lượng trong ngày.

**Lưu ý dị ứng:** hạt điều và macca thuộc nhóm hạt cây (tree nuts), một trong những nguyên nhân dị ứng thực phẩm phổ biến. Người có tiền sử dị ứng cần tham khảo ý kiến bác sĩ. Bài viết chỉ mang tính tham khảo, không thay thế tư vấn y tế.

## Câu hỏi thường gặp

### Hạt điều hay hạt macca tốt hơn?

Mỗi loại có thế mạnh riêng: hạt điều nhiều đạm và khoáng chất (magie, đồng), macca nhiều chất béo không bão hoà đơn và ít carbohydrate. Kết hợp nhiều loại hạt trong chế độ ăn là lựa chọn cân bằng.

### Ăn hạt điều có béo không?

Hạt điều giàu năng lượng nên ăn quá nhiều có thể làm dư calo. Với khẩu phần khoảng 30 g mỗi ngày trong một chế độ ăn cân đối, hạt điều là nguồn dinh dưỡng tốt.

### Một ngày nên ăn bao nhiêu hạt macca?

Khoảng 30 g, tương đương 10–12 hạt macca, là khẩu phần thường được gợi ý.

## Nguồn tham khảo

- U.S. Department of Agriculture, *FoodData Central* (Nuts, cashew nuts, raw; Nuts, macadamia nuts, raw) — [fdc.nal.usda.gov](https://fdc.nal.usda.gov)
- International Nut and Dried Fruit Council (INC), Nutrition Research — [inc.nutfruit.org](https://inc.nutfruit.org)

---

Hạt điều và hạt macca VSAP được chọn lọc từ vùng nguyên liệu Việt Nam, có bao bì bán lẻ ghi rõ thành phần và bảng dinh dưỡng. Xem [sản phẩm VSAP](/products).`,
      en: `**Quick answer:** According to USDA data, 100 g of cashews provides about **553 kcal, 18 g protein and 44 g fat**, plus plenty of magnesium, copper and zinc. 100 g of macadamias provides about **718 kcal, 8 g protein and 76 g fat**, most of it monounsaturated. Both are energy-dense, so a sensible serving is about **30 g a day** (a small handful).

## Nutrition compared (per 100 g, raw)

**Cashews**

- Energy: about 553 kcal
- Protein: about 18 g
- Fat: about 44 g (mostly mono- and polyunsaturated)
- Carbohydrate: about 30 g, fibre about 3 g
- Notable minerals: magnesium (about 290 mg), copper (about 2.2 mg), zinc, iron

**Macadamias**

- Energy: about 718 kcal
- Protein: about 8 g
- Fat: about 76 g, of which about 59 g is monounsaturated
- Carbohydrate: about 14 g, fibre about 9 g
- Notable: manganese and thiamin (vitamin B1); macadamias are one of the few foods containing palmitoleic acid (omega-7)

Figures are averages and vary with variety, origin and processing (roasting, salting).

## Who are cashews good for?

- People looking for **plant protein**, such as vegetarians.
- Anyone wanting more **magnesium and copper** from whole foods.
- Making **nut milk, cashew butter and vegan cream sauces**, thanks to their mild taste and smooth texture when blended.

## Who are macadamias good for?

- People on **low-carb** or keto diets, thanks to high fat and low carbohydrate.
- Anyone swapping some saturated fat for **monounsaturated fat**.
- Snacking, salads, baking and macadamia oil.

![Macadamias in and out of the shell](/images/macadamia.webp "Macadamias are rich in monounsaturated fat")

## How much is enough?

Many dietary guidelines suggest about **30 g of nuts a day**, roughly 18 cashews or 10–12 macadamias. Choose dry-roasted or lightly salted nuts and count the energy in your daily total.

**Allergy note:** cashews and macadamias are tree nuts, a common cause of food allergy. People with a history of allergy should consult a doctor. This article is for general information and is not medical advice.

## Frequently asked questions

### Are cashews or macadamias healthier?

Each has its strengths: cashews offer more protein and minerals (magnesium, copper), macadamias more monounsaturated fat and fewer carbohydrates. Eating a mix of nuts is a balanced choice.

### Do cashews make you gain weight?

Cashews are energy-dense, so eating a lot can add excess calories. About 30 g a day within a balanced diet makes them a good source of nutrients.

### How many macadamias should I eat per day?

About 30 g, or 10–12 macadamias, is the commonly suggested serving.

## Sources

- U.S. Department of Agriculture, *FoodData Central* (Nuts, cashew nuts, raw; Nuts, macadamia nuts, raw) — [fdc.nal.usda.gov](https://fdc.nal.usda.gov)
- International Nut and Dried Fruit Council (INC), Nutrition Research — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP cashews and macadamias are selected from Vietnamese growing regions, with retail packs that list ingredients and nutrition facts. See [VSAP products](/products).`,
    },
  },
  {
    slug: "chon-nha-cung-cap-hat-dieu-viet-nam",
    date: "2026-10-20",
    author: "VSAP",
    category: { vi: "Xuất khẩu", en: "Export" },
    cover: { src: "/images/farmer-watering.webp", alt: { vi: "Nông dân Việt Nam đội nón lá sàng nông sản dưới nắng", en: "Vietnamese farmer in a conical hat winnowing crops in the sun" } },
    title: {
      vi: "Cách chọn nhà cung cấp hạt điều Việt Nam uy tín: 10 điều cần kiểm tra",
      en: "How to choose a reliable Vietnamese cashew supplier: a 10-point checklist",
    },
    excerpt: {
      vi: "Giá tốt chưa đủ. Trước khi ký hợp đồng nhân điều, người mua nên kiểm tra pháp lý, mẫu thử, COA, khả năng truy xuất, kiểm định độc lập và điều khoản khiếu nại. Danh sách 10 điểm dễ áp dụng.",
      en: "A good price is not enough. Before signing a cashew contract, check legal status, samples, COA, traceability, independent inspection and claim terms. A practical 10-point checklist.",
    },
    seo: {
      title: { vi: "Chọn nhà cung cấp hạt điều Việt Nam: 10 điều cần kiểm tra", en: "Choosing a Vietnamese cashew supplier: 10 checks" },
      description: {
        vi: "Checklist chọn nhà cung cấp nhân điều Việt Nam: pháp lý, mẫu thử, COA, truy xuất nguồn gốc, kiểm định SGS, hợp đồng, thanh toán an toàn, dấu hiệu cảnh giác.",
        en: "Checklist for choosing a Vietnamese cashew supplier: company registration, samples, COA, traceability, SGS inspection, contract, safe payment and red flags.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Một nhà cung cấp hạt điều uy tín có pháp nhân rõ ràng, gửi mẫu thử và thông số kỹ thuật cụ thể, cung cấp phiếu phân tích (COA) cho từng lô, truy xuất được nguồn gốc, chấp nhận kiểm định bên thứ ba và ký hợp đồng có điều khoản chất lượng, khiếu nại rõ ràng. Hãy cảnh giác với giá thấp bất thường, yêu cầu thanh toán 100% trước, hoặc tài khoản nhận tiền không trùng tên công ty.

## Checklist 10 điểm

1. **Pháp lý doanh nghiệp**: kiểm tra tên công ty, mã số doanh nghiệp, địa chỉ trên Cổng thông tin quốc gia về đăng ký doanh nghiệp. Tên trên hợp đồng, hoá đơn và tài khoản ngân hàng phải trùng khớp.
2. **Kinh nghiệm và thị trường**: hỏi về thị trường đã xuất khẩu, chủng loại chính, năng lực cung ứng theo tháng.
3. **Mẫu thử**: yêu cầu mẫu đúng mã bạn định mua, kèm thông số kỹ thuật. Giữ lại mẫu đối chứng.
4. **Thông số kỹ thuật bằng văn bản**: cỡ hạt, màu, độ ẩm, tỷ lệ vỡ, tạp chất, aflatoxin, vi sinh, dung sai cho phép.
5. **COA và kiểm nghiệm**: COA theo lô; với thị trường khó tính, yêu cầu kết quả phòng thí nghiệm độc lập.
6. **Truy xuất nguồn gốc**: mỗi lô có mã liên kết với nguồn nguyên liệu và ngày chế biến.
7. **Kiểm định bên thứ ba**: nhà cung cấp chấp nhận để SGS, Intertek… kiểm tra chất lượng và giám sát đóng container.
8. **Năng lực chứng từ**: chuẩn bị đúng C/O, kiểm dịch, COA… theo thị trường của bạn. Xem [hướng dẫn nhập khẩu hạt điều từ Việt Nam](/news/huong-dan-nhap-khau-hat-dieu-tu-viet-nam).
9. **Hợp đồng rõ ràng**: Incoterms, thời gian giao hàng, phạt chậm giao, quy trình khiếu nại chất lượng, luật áp dụng và trọng tài.
10. **Thanh toán an toàn**: đặt cọc hợp lý, phần còn lại khi có chứng từ giao hàng, hoặc dùng L/C với đơn hàng lớn hay lần hợp tác đầu.

![Nhân điều được kiểm tra chất lượng](/images/quality-inspection.webp "Kiểm định độc lập giúp giảm rủi ro cho đơn hàng đầu tiên")

## Dấu hiệu cần cảnh giác

- Giá thấp hơn đáng kể so với mặt bằng thị trường cùng mã, cùng thời điểm.
- Từ chối gửi mẫu, hoặc mẫu khác xa hàng giao.
- Yêu cầu thanh toán 100% trước khi sản xuất với khách hàng mới.
- Tài khoản nhận tiền đứng tên cá nhân hoặc công ty khác, hoặc thay đổi số tài khoản qua email vào phút chót. Luôn xác nhận lại bằng điện thoại.
- Không cho kiểm định bên thứ ba.

## Nên bắt đầu thế nào với nhà cung cấp mới?

Hãy bắt đầu bằng **một đơn hàng thử** với khối lượng nhỏ hoặc một container gộp nhiều mã, kiểm định trước khi giao, và đánh giá cả chất lượng hàng lẫn cách nhà cung cấp phản hồi, xử lý vấn đề. Khi đã tin cậy, chuyển sang hợp đồng dài hạn để ổn định giá và nguồn hàng.

## Câu hỏi thường gặp

### Làm sao biết công ty Việt Nam có thật?

Tra cứu mã số doanh nghiệp trên Cổng thông tin quốc gia về đăng ký doanh nghiệp, đối chiếu tên và địa chỉ với hợp đồng, hoá đơn, tài khoản ngân hàng. Có thể gọi video hoặc đến thăm cơ sở.

### Có nên đặt cọc trước cho nhà cung cấp mới?

Đặt cọc một phần là thông lệ, nhưng tránh thanh toán toàn bộ trước. Với đơn hàng lớn, L/C hoặc thanh toán khi có chứng từ giao hàng an toàn hơn.

### Kiểm định SGS kiểm tra những gì?

Thường gồm số lượng, trọng lượng, quy cách đóng gói, lấy mẫu kiểm tra chất lượng (kích cỡ, màu, độ ẩm, lỗi) và giám sát đóng container. Phạm vi cụ thể do người mua yêu cầu.

## Nguồn tham khảo

- Cổng thông tin quốc gia về đăng ký doanh nghiệp — [dangkykinhdoanh.gov.vn](https://dangkykinhdoanh.gov.vn)
- International Chamber of Commerce (ICC), *Incoterms® 2020* — [iccwbo.org](https://iccwbo.org)

---

VSAP là thương hiệu của Công ty Cổ phần Nông sản Tinh Hoa Việt, trụ sở tại Đắk Lắk và văn phòng tại Hà Nội. Chúng tôi gửi mẫu thử, thông số kỹ thuật và COA theo lô, đồng thời chấp nhận kiểm định bên thứ ba theo yêu cầu. [Liên hệ đội ngũ kinh doanh](/contact).`,
      en: `**Quick answer:** A reliable cashew supplier has a verifiable legal entity, sends samples with clear specifications, provides a certificate of analysis (COA) for each lot, can trace its raw material, accepts third-party inspection and signs a contract with clear quality and claim terms. Be wary of unusually low prices, demands for 100% prepayment, or a bank account that doesn't match the company name.

## The 10-point checklist

1. **Legal status**: check the company name, enterprise code and address on Vietnam's National Business Registration Portal. The name on the contract, invoice and bank account must match.
2. **Experience and markets**: ask which markets they ship to, their main grades and monthly capacity.
3. **Samples**: request samples of the exact grade you plan to buy, with specifications. Keep a reference sample.
4. **Written specifications**: size, colour, moisture, broken ratio, foreign matter, aflatoxin, microbiology and tolerances.
5. **COA and testing**: a COA per lot; for demanding markets, independent lab results.
6. **Traceability**: each lot has a code linking it to its raw material and processing date.
7. **Third-party inspection**: the supplier accepts SGS, Intertek or similar to check quality and supervise loading.
8. **Documentation**: the right C/O, phytosanitary certificate, COA and so on for your market. See [how to import cashews from Vietnam](/news/huong-dan-nhap-khau-hat-dieu-tu-viet-nam).
9. **A clear contract**: Incoterms, shipment dates, late-delivery penalties, the quality-claim procedure, governing law and arbitration.
10. **Safe payment**: a reasonable deposit with the balance against shipping documents, or an L/C for large or first orders.

![Cashew kernels under quality inspection](/images/quality-inspection.webp "Independent inspection reduces the risk on a first order")

## Red flags

- Prices well below the market for the same grade and period.
- Refusing to send samples, or samples very different from delivered goods.
- Asking a new customer for 100% payment before production.
- A bank account in a person's name or another company's, or account details changed by email at the last minute. Always confirm by phone.
- Refusing third-party inspection.

## How to start with a new supplier

Begin with a **trial order**: a small volume or a mixed-grade container, inspected before shipment. Judge both the goods and how the supplier communicates and resolves issues. Once trust is built, move to longer contracts for stable prices and supply.

## Frequently asked questions

### How can I check that a Vietnamese company is real?

Look up its enterprise code on the National Business Registration Portal and compare the name and address with the contract, invoice and bank account. A video call or a site visit also helps.

### Should I pay a deposit to a new supplier?

A partial deposit is normal, but avoid paying everything up front. For large orders, an L/C or payment against shipping documents is safer.

### What does an SGS inspection cover?

Usually quantity, weight, packing, sampling for quality (size, colour, moisture, defects) and supervision of container loading. The buyer defines the exact scope.

## Sources

- Vietnam National Business Registration Portal — [dangkykinhdoanh.gov.vn](https://dangkykinhdoanh.gov.vn)
- International Chamber of Commerce (ICC), *Incoterms® 2020* — [iccwbo.org](https://iccwbo.org)

---

VSAP is a brand of Công ty Cổ phần Nông sản Tinh Hoa Việt, headquartered in Dak Lak with an office in Hanoi. We send samples, specifications and a COA per lot, and accept third-party inspection on request. [Talk to our sales team](/contact).`,
    },
  },
];
