// Bài viết mẫu 1–5 (xem lib/content/posts.ts).
import type { Post } from "../cms/types";

export const posts1: Post[] = [
  {
    slug: "phan-loai-hat-dieu-w180-w240-w320",
    date: "2026-07-08",
    author: "VSAP",
    category: { vi: "Kiến thức sản phẩm", en: "Product guide" },
    cover: { src: "/images/cashew-kernels.webp", alt: { vi: "Nhân điều trắng nguyên hạt sau phân loại", en: "Graded white whole cashew kernels" } },
    title: {
      vi: "Hạt điều W180, W240, W320 là gì? Bảng phân loại nhân điều xuất khẩu",
      en: "What do W180, W240 and W320 mean? A guide to cashew kernel grades",
    },
    excerpt: {
      vi: "Chữ W và con số trên bao bì nhân điều cho biết màu sắc và số hạt trong mỗi pound. Bài viết giải thích đầy đủ các mã W, SW, WS, LWP… và cách chọn mã phù hợp cho từng mục đích.",
      en: "The letter and number on a cashew carton tell you the colour and how many kernels make up a pound. Here is what W, SW, WS, LWP and the other codes mean, and how to choose one.",
    },
    seo: {
      title: { vi: "Phân loại hạt điều W180, W240, W320: bảng mã đầy đủ", en: "Cashew grades W180, W240, W320 explained" },
      description: {
        vi: "W240 nghĩa là 220–240 nhân trắng nguyên hạt mỗi pound. Bảng phân loại nhân điều xuất khẩu theo chuẩn AFI: W180–W450, SW, WS, LWP, SWP, BB.",
        en: "W240 means 220–240 white whole kernels per pound. A complete guide to export cashew grades under AFI specs: W180–W450, SW, WS, LWP, SWP and BB.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Trong mã nhân điều, chữ cái cho biết màu và hình dạng hạt (W = trắng nguyên hạt), còn con số là số nhân trong một pound (0,454 kg). Số càng nhỏ, hạt càng to. W240 có 220–240 hạt/pound, W320 có 300–320 hạt/pound. Đây là cách phân loại được dùng phổ biến trong thương mại quốc tế, dựa trên quy cách của Hiệp hội Công nghiệp Thực phẩm Hoa Kỳ (AFI).

## Mã nhân điều được đọc như thế nào?

Một mã như **W240** gồm hai phần:

- **Chữ cái**: nhóm màu và hình dạng. *W* (White) là nhân trắng ngà, nguyên hạt. *SW* (Scorched Wholes) là nhân nguyên hạt có màu sậm hơn do sấy lâu hơn. *WS*, *B*, *LWP*… là các dạng nhân vỡ.
- **Con số**: số nhân nguyên hạt trong một pound. Quy ra kilôgam, W240 tương đương khoảng 485–530 hạt/kg.

## Bảng các mã nhân điều trắng nguyên hạt

- **W180**: 170–180 hạt/pound (khoảng 375–395 hạt/kg). Cỡ lớn nhất, thường gọi là "vua hạt điều", dùng cho quà biếu và phân khúc cao cấp.
- **W210**: 200–210 hạt/pound. Hạt to, đều, phổ biến ở thị trường Trung Đông.
- **W240**: 220–240 hạt/pound (khoảng 485–530 hạt/kg). Cân bằng giữa kích cỡ và giá, rất được ưa chuộng cho hạt rang ăn liền.
- **W320**: 300–320 hạt/pound (khoảng 660–705 hạt/kg). Mã giao dịch nhiều nhất trên thế giới, dùng rộng rãi cho bán lẻ và chế biến.
- **W450**: 400–450 hạt/pound. Hạt nhỏ, giá tốt, phù hợp làm bánh kẹo, sữa hạt hoặc trộn hạt.

## Các mã nhân điều vỡ và nhân màu sậm

- **SW** (ví dụ SW240, SW320): nguyên hạt nhưng màu vàng sậm hơn. Hương vị gần như không đổi, giá thấp hơn nhân trắng.
- **DW** (Dessert Wholes): nguyên hạt có vết đốm hoặc màu không đều, thường dùng cho chế biến.
- **WS** (White Splits): nhân trắng tách đôi theo chiều dọc.
- **B / WB** (Butts): nhân gãy ngang, còn khoảng 3/8 đến 7/8 hạt.
- **LWP** (Large White Pieces): mảnh lớn, không lọt sàng 4,75 mm.
- **SWP** (Small White Pieces): mảnh nhỏ, lọt sàng 4,75 mm nhưng không lọt sàng 2,8 mm.
- **BB** (Baby Bits): mảnh rất nhỏ, dùng làm topping, nhân bánh.

## Nên chọn mã nào?

1. **Hạt rang muối, bán lẻ cao cấp**: W180, W210 hoặc W240.
2. **Bán lẻ phổ thông, mix hạt**: W320 hoặc W240.
3. **Sữa hạt, bơ hạt điều, nhân bánh**: WS, LWP, SWP hoặc W450 để tối ưu chi phí, vì hạt sẽ được xay hoặc cắt nhỏ.
4. **Topping, kem, ngũ cốc**: SWP và BB.

Ngoài mã kích cỡ, hãy thống nhất với nhà cung cấp các chỉ tiêu đi kèm như độ ẩm, tỷ lệ hạt vỡ cho phép và màu sắc. Xem thêm bài [Tiêu chuẩn chất lượng nhân điều xuất khẩu](/news/tieu-chuan-chat-luong-nhan-dieu-xuat-khau).

## Câu hỏi thường gặp

### W240 và W320 khác nhau thế nào?

W240 có 220–240 hạt mỗi pound, còn W320 có 300–320 hạt mỗi pound, nên hạt W240 to hơn khoảng 30%. Cả hai đều là nhân trắng nguyên hạt; W320 thường có giá tốt hơn và được giao dịch nhiều hơn.

### Hạt điều SW có kém chất lượng không?

Không hẳn. SW là nhân nguyên hạt có màu sậm hơn do quá trình sấy, hương vị gần như tương đương nhân trắng. SW phù hợp khi hạt được rang lại hoặc tẩm gia vị, giúp tiết kiệm chi phí.

### Một pound là bao nhiêu kilôgam?

Một pound bằng khoảng 0,454 kg. Vì vậy số hạt mỗi kilôgam xấp xỉ bằng số hạt mỗi pound nhân 2,2.

## Nguồn tham khảo

- Association of Food Industries (AFI), *Specifications for Cashew Kernels* — [afius.org](https://www.afius.org)
- International Nut and Dried Fruit Council (INC) — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP cung cấp nhân điều trắng nguyên hạt từ W180 đến W450, nhân vỡ và hạt điều rang muối, kèm thông số kỹ thuật cho từng lô. Xem [sản phẩm hạt điều](/products/cashew) hoặc [gửi yêu cầu báo giá](/contact) để nhận mẫu thử.`,
      en: `**Quick answer:** In a cashew grade, the letters describe colour and shape (W = white whole kernel) and the number is how many kernels make up one pound (0.454 kg). The smaller the number, the bigger the nut. W240 has 220–240 kernels per pound; W320 has 300–320. These grades are used across international trade and follow the specifications of the Association of Food Industries (AFI).

## How do you read a cashew grade?

A grade such as **W240** has two parts:

- **The letters**: colour and shape. *W* (White) is an ivory, whole kernel. *SW* (Scorched Wholes) is a whole kernel with a darker tone from longer drying. *WS*, *B*, *LWP* and others are broken kernels.
- **The number**: whole kernels per pound. In metric terms, W240 is roughly 485–530 kernels per kilogram.

## White whole kernel grades

- **W180**: 170–180 kernels/lb (about 375–395/kg). The largest size, often called the "king of cashews", used for gifting and premium packs.
- **W210**: 200–210 kernels/lb. Large and uniform, popular in the Middle East.
- **W240**: 220–240 kernels/lb (about 485–530/kg). A good balance of size and price, widely used for roasted snacks.
- **W320**: 300–320 kernels/lb (about 660–705/kg). The most traded grade in the world, used for retail and manufacturing.
- **W450**: 400–450 kernels/lb. Smaller and economical, suited to bakery, confectionery, nut milks and mixes.

## Broken and darker grades

- **SW** (e.g. SW240, SW320): whole kernels with a darker yellow tone. The taste is almost unchanged and the price is lower.
- **DW** (Dessert Wholes): wholes with spots or uneven colour, mostly for processing.
- **WS** (White Splits): white kernels split naturally lengthwise.
- **B / WB** (Butts): kernels broken crosswise, roughly 3/8 to 7/8 of a kernel.
- **LWP** (Large White Pieces): pieces that do not pass a 4.75 mm sieve.
- **SWP** (Small White Pieces): pieces that pass 4.75 mm but not 2.8 mm.
- **BB** (Baby Bits): very small pieces for toppings and fillings.

## Which grade should you buy?

1. **Premium roasted and salted snacks**: W180, W210 or W240.
2. **Mainstream retail and nut mixes**: W320 or W240.
3. **Nut milk, cashew butter, fillings**: WS, LWP, SWP or W450, since the nuts will be ground or chopped anyway.
4. **Toppings, ice cream, cereals**: SWP and BB.

Besides size, agree the accompanying parameters with your supplier: moisture, the allowance for broken kernels and colour. See our guide to [export quality standards for cashew kernels](/news/tieu-chuan-chat-luong-nhan-dieu-xuat-khau).

## Frequently asked questions

### What is the difference between W240 and W320?

W240 has 220–240 kernels per pound and W320 has 300–320, so a W240 kernel is roughly 30% larger. Both are white whole kernels; W320 is usually cheaper and more widely traded.

### Are SW cashews lower quality?

Not really. SW kernels are whole kernels with a darker colour from drying, and the taste is very close to white kernels. They are a cost-effective choice when the nuts will be roasted or seasoned.

### How many kilograms are in a pound?

One pound is about 0.454 kg, so kernels per kilogram are roughly kernels per pound multiplied by 2.2.

## Sources

- Association of Food Industries (AFI), *Specifications for Cashew Kernels* — [afius.org](https://www.afius.org)
- International Nut and Dried Fruit Council (INC) — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP supplies white whole cashew kernels from W180 to W450, broken grades and roasted cashews, with specifications for every lot. See our [cashew range](/products/cashew) or [request a quote](/contact) to receive samples.`,
    },
  },
  {
    slug: "quy-trinh-che-bien-hat-dieu-xuat-khau",
    date: "2026-07-22",
    author: "VSAP",
    category: { vi: "Chế biến", en: "Processing" },
    cover: { src: "/images/cashew-processing.webp", alt: { vi: "Dây chuyền chế biến và phân loại hạt", en: "Nut processing and sorting line" } },
    title: {
      vi: "Quy trình chế biến hạt điều xuất khẩu: từ hạt thô đến nhân điều đóng thùng",
      en: "How cashews are processed for export: from raw nut to packed kernel",
    },
    excerpt: {
      vi: "Hạt điều thô phải qua khoảng mười công đoạn trước khi thành nhân điều trắng đóng thùng xuất khẩu. Bài viết đi qua từng bước và những điểm quyết định chất lượng.",
      en: "A raw cashew nut goes through about ten steps before it becomes a packed white kernel. We walk through each one and the points that decide quality.",
    },
    seo: {
      title: { vi: "Quy trình chế biến hạt điều xuất khẩu từng bước", en: "Cashew processing for export, step by step" },
      description: {
        vi: "Các công đoạn chế biến nhân điều: làm sạch, phân cỡ, hấp, tách vỏ, sấy, bóc lụa, phân loại, đóng gói hút chân không. Điểm kiểm soát chất lượng ở từng bước.",
        en: "The steps of cashew processing: cleaning, sizing, steaming, shelling, drying, peeling, grading and vacuum packing, with the quality checkpoints at each stage.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Nhân điều xuất khẩu được làm từ hạt điều thô (RCN) qua các bước chính: làm sạch và phân cỡ, hấp chín vỏ, tách vỏ, sấy nhân, bóc vỏ lụa, phân loại theo kích cỡ và màu, kiểm tra chất lượng rồi đóng gói hút chân không. Ở Việt Nam, phương pháp hấp hơi nước được dùng phổ biến vì cho nhân trắng và giữ hương vị tốt.

## Hạt điều thô (RCN) là gì?

Hạt điều thô, hay *Raw Cashew Nut*, là hạt còn nguyên vỏ cứng sau khi tách khỏi trái điều. Vỏ chứa dầu CNSL (Cashew Nut Shell Liquid) có tính ăn mòn, vì vậy không thể tách vỏ bằng tay như các loại hạt khác. Chất lượng hạt thô thường được đánh giá qua **tỷ lệ thu hồi nhân** (KOR, tính bằng pound nhân trên 80 kg hạt thô), độ ẩm và số hạt mỗi kilôgam.

## Các bước chế biến nhân điều

1. **Làm sạch và phân cỡ hạt thô**: loại bỏ đất, đá, hạt lép; chia hạt theo kích cỡ để các bước sau chạy đều.
2. **Hấp (luộc hơi)**: hạt được hấp bằng hơi nước để vỏ giòn và dễ tách, đồng thời hạn chế dầu vỏ thấm vào nhân.
3. **Làm nguội và tách vỏ cứng**: máy cắt tách vỏ theo từng cỡ hạt. Đây là bước quyết định tỷ lệ nhân nguyên hạt.
4. **Sấy nhân**: nhân còn vỏ lụa được sấy ở nhiệt độ được kiểm soát nhiều giờ để giảm độ ẩm và làm vỏ lụa bong ra.
5. **Bóc vỏ lụa**: kết hợp máy thổi khí và thao tác thủ công để giữ nhân nguyên.
6. **Phân loại kích cỡ**: sàng tách nhân nguyên theo các cỡ W180–W450 và tách nhân vỡ thành WS, B, LWP, SWP, BB.
7. **Phân loại màu**: máy bắn màu quang học kết hợp kiểm tra bằng mắt để tách nhân trắng, nhân sậm (SW) và nhân lỗi.
8. **Ổn định độ ẩm**: đưa nhân về độ ẩm phù hợp tiêu chuẩn xuất khẩu, thường không quá 5%.
9. **Kiểm tra chất lượng**: đo độ ẩm, tạp chất, tỷ lệ vỡ; kiểm nghiệm vi sinh và aflatoxin theo yêu cầu thị trường.
10. **Đóng gói**: hút chân không và nạp khí CO₂ hoặc nitơ trong túi bạc hoặc thùng thiếc, thường 2 × 25 lb mỗi thùng carton.

![Nhân điều được kiểm tra bằng tay sau khi bóc lụa](/images/quality-inspection.webp "Kiểm tra nhân điều sau công đoạn bóc vỏ lụa")

## Hấp hay chao dầu: khác nhau thế nào?

Có hai cách làm chín vỏ phổ biến. **Hấp hơi nước** là cách được các nhà máy Việt Nam dùng nhiều, cho nhân màu trắng sáng và ít bị dầu vỏ ám vào. **Chao dầu** (roasting trong bể dầu) gặp ở một số nước khác, nhanh hơn nhưng dễ làm nhân sậm màu. Vì vậy nhân điều Việt Nam thường có tỷ lệ nhân trắng cao.

## Điểm kiểm soát chất lượng quan trọng

- **Độ ẩm hạt thô** trước khi nhập kho, để tránh nấm mốc.
- **Nhiệt độ và thời gian sấy**, quyết định màu nhân và độ giòn.
- **Vệ sinh khu bóc lụa và phân loại**, nơi nhân tiếp xúc trực tiếp với người và thiết bị.
- **Truy xuất lô**: mỗi lô thành phẩm cần gắn với nguồn hạt thô và ngày chế biến. Tại VSAP, mỗi lô hàng có mã truy xuất đến vùng nguyên liệu và ngày chế biến ([xem quy trình chất lượng](/quality)).

## Câu hỏi thường gặp

### Vì sao hạt điều không bóc vỏ bằng tay như đậu phộng?

Vỏ hạt điều chứa dầu CNSL có thể gây bỏng và kích ứng da. Hạt phải được hấp hoặc chao dầu, sau đó tách vỏ bằng máy, để công nhân không tiếp xúc trực tiếp với dầu vỏ.

### Chế biến hạt điều mất bao lâu?

Từ hạt thô đến nhân thành phẩm thường mất vài ngày, phần lớn thời gian dành cho sấy nhân và ổn định độ ẩm. Thời gian cụ thể tuỳ quy mô nhà máy và chủng loại.

### Nhân điều có được rang sẵn không?

Nhân điều xuất khẩu dạng thô (chưa rang) là phổ biến nhất, để người mua tự rang hoặc chế biến. Ngoài ra còn có nhân điều rang muối, rang mộc đóng gói bán lẻ.

## Nguồn tham khảo

- Association of Food Industries (AFI), *Specifications for Cashew Kernels* — [afius.org](https://www.afius.org)
- Bài liên quan: [Bảng phân loại nhân điều W180–W450](/news/phan-loai-hat-dieu-w180-w240-w320)

---

Muốn xem thông số và mẫu thực tế? [Liên hệ VSAP](/contact) để nhận mẫu thử và phiếu phân tích chất lượng (COA) theo lô.`,
      en: `**Quick answer:** Export cashew kernels are made from raw cashew nuts (RCN) in these main steps: cleaning and sizing, steaming the shell, shelling, drying the kernels, peeling the skin (testa), grading by size and colour, quality testing and vacuum packing. Vietnamese processors mostly use steam cooking, which gives white kernels and keeps the flavour clean.

## What is a raw cashew nut (RCN)?

A raw cashew nut is the nut still in its hard shell after being separated from the cashew apple. The shell contains a caustic oil (Cashew Nut Shell Liquid, CNSL), so it cannot be cracked by hand like other nuts. Raw nuts are usually judged by **kernel outturn ratio** (KOR, pounds of kernel per 80 kg bag of raw nuts), moisture and nut count per kilogram.

## The processing steps

1. **Cleaning and sizing**: remove soil, stones and empty nuts, then sort by size so later steps run evenly.
2. **Steaming**: nuts are steam-cooked so the shell becomes brittle and less shell oil reaches the kernel.
3. **Cooling and shelling**: cutting machines open the shell, calibrated for each size. This step decides how many kernels stay whole.
4. **Drying**: kernels, still in their skins, are dried at controlled temperatures for several hours to lower moisture and loosen the skin.
5. **Peeling**: air blowers and careful hand work remove the testa while keeping kernels whole.
6. **Size grading**: sieves separate wholes into W180–W450 and broken kernels into WS, B, LWP, SWP and BB.
7. **Colour sorting**: optical sorters plus visual checks separate white kernels, darker kernels (SW) and defects.
8. **Moisture conditioning**: kernels are brought to the moisture export standards require, usually no more than 5%.
9. **Quality testing**: moisture, foreign matter and broken ratio; microbiology and aflatoxin testing as the destination market requires.
10. **Packing**: vacuum packing flushed with CO₂ or nitrogen, in foil pouches or tins, typically 2 × 25 lb per carton.

![Cashew kernels inspected by hand after peeling](/images/quality-inspection.webp "Inspecting kernels after the peeling stage")

## Steaming versus oil-bath roasting

There are two common ways to prepare the shell. **Steam cooking**, used by most Vietnamese factories, gives bright white kernels with little shell-oil contamination. **Oil-bath roasting**, found in some other origins, is faster but more likely to darken the kernel. This is one reason Vietnamese kernels typically have a high share of white grades.

## Key quality checkpoints

- **Raw nut moisture** before storage, to prevent mould.
- **Drying temperature and time**, which set kernel colour and crunch.
- **Hygiene in peeling and grading**, where kernels are handled directly.
- **Lot traceability**: every finished lot should link back to its raw material and processing date. At VSAP each lot carries a trace code to its growing area and processing date ([see our quality process](/quality)).

## Frequently asked questions

### Why can't cashews be shelled by hand like peanuts?

The shell contains CNSL, an oil that can burn and irritate skin. Nuts are steamed or roasted first and then shelled by machine, so workers don't touch the shell oil.

### How long does cashew processing take?

From raw nut to finished kernel usually takes a few days, most of it for drying and moisture conditioning. The exact time depends on the factory and the grade.

### Are export cashew kernels roasted?

Most export kernels are shipped raw (unroasted) so buyers can roast or process them themselves. Roasted and salted or dry-roasted cashews are also available in retail packs.

## Sources

- Association of Food Industries (AFI), *Specifications for Cashew Kernels* — [afius.org](https://www.afius.org)
- Related: [Cashew grades W180–W450 explained](/news/phan-loai-hat-dieu-w180-w240-w320)

---

Want to see real specifications and samples? [Contact VSAP](/contact) for samples and a certificate of analysis (COA) per lot.`,
    },
  },
  {
    slug: "mua-vu-hat-dieu-viet-nam",
    date: "2026-08-05",
    author: "VSAP",
    category: { vi: "Mùa vụ", en: "Harvest" },
    cover: { src: "/images/cashew-orchard.webp", alt: { vi: "Trái điều chín đỏ trên cây", en: "Ripe red cashew apples on the tree" } },
    title: {
      vi: "Mùa vụ hạt điều Việt Nam: thu hoạch tháng mấy và nên đặt hàng khi nào?",
      en: "Vietnam's cashew season: when is the harvest and when should you order?",
    },
    excerpt: {
      vi: "Điều Việt Nam ra hoa vào mùa khô và thu hoạch chủ yếu từ tháng 2 đến tháng 5. Hiểu lịch mùa vụ giúp người mua lên kế hoạch nhập hàng và chốt giá hợp lý.",
      en: "Vietnamese cashew trees flower in the dry season and are harvested mainly from February to May. Knowing the calendar helps buyers plan purchases and lock in prices.",
    },
    seo: {
      title: { vi: "Mùa vụ hạt điều Việt Nam: lịch thu hoạch và mua hàng", en: "Vietnam cashew harvest season and buying calendar" },
      description: {
        vi: "Hạt điều Việt Nam thu hoạch chính từ tháng 2 đến tháng 5. Vùng trồng điều lớn, nguồn hạt thô nhập khẩu và gợi ý thời điểm đặt hàng nhân điều.",
        en: "Vietnam harvests cashews mainly from February to May. The main growing regions, imported raw nuts and when to place kernel orders.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Cây điều ở Việt Nam ra hoa trong mùa khô (khoảng tháng 11 đến tháng 1) và cho thu hoạch chủ yếu từ **tháng 2 đến tháng 5**. Tuy vậy, nhà máy chế biến hoạt động quanh năm nhờ dự trữ hạt thô và nhập thêm hạt điều thô từ châu Phi, Campuchia. Với người mua nhân điều, nguồn cung có sẵn quanh năm; điều thay đổi theo mùa chủ yếu là giá và độ "mới" của hạt.

## Vùng trồng điều chính ở Việt Nam

Điều được trồng nhiều ở Đông Nam Bộ và Tây Nguyên, nơi có mùa khô rõ rệt và đất đỏ bazan hoặc đất xám phù hợp:

- **Vùng Bình Phước cũ (nay thuộc tỉnh Đồng Nai)**: vùng điều lớn nhất cả nước, nổi tiếng với hạt to, tỷ lệ nhân cao.
- **Đồng Nai, Tây Ninh**: vùng trồng và chế biến lâu năm.
- **Tây Nguyên (Đắk Lắk, Lâm Đồng, Gia Lai)**: diện tích điều đáng kể, mùa vụ có thể lệch đôi chút so với Đông Nam Bộ.

## Lịch mùa vụ trong năm

- **Tháng 11 – tháng 1**: cây ra hoa. Thời tiết lúc này (mưa trái mùa, sương muối) ảnh hưởng mạnh đến năng suất.
- **Tháng 2 – tháng 5**: thu hoạch chính. Trái chín rụng, nông dân nhặt hạt, phơi khô rồi bán cho đại lý hoặc nhà máy.
- **Tháng 4 – tháng 7**: hạt điều thô nhập khẩu từ Tây Phi về nhiều, bổ sung nguyên liệu cho nhà máy.
- **Quanh năm**: chế biến và xuất khẩu nhân điều diễn ra liên tục.

![Hạt điều thô vừa thu hoạch](/images/cashew-harvest.webp "Hạt điều thô sau thu hoạch, trước khi phơi khô")

## Việt Nam trồng điều có đủ để chế biến không?

Không đủ. Việt Nam liên tục dẫn đầu thế giới về xuất khẩu nhân điều trong gần hai thập kỷ, nhưng sản lượng hạt thô trong nước chỉ đáp ứng một phần nhu cầu chế biến. Phần lớn hạt thô được nhập từ các nước Tây Phi (như Bờ Biển Ngà, Ghana, Nigeria) và Campuchia. Vì vậy, khi mua nhân điều, người mua nên hỏi rõ nguồn gốc hạt thô nếu thị trường của mình yêu cầu ghi xuất xứ nguyên liệu.

## Nên đặt hàng nhân điều vào thời điểm nào?

1. **Hợp đồng dài hạn**: nhiều người mua chốt khối lượng cho cả năm vào quý I, khi đã có thông tin về vụ mùa.
2. **Hàng vụ mới**: nhân chế biến từ hạt vụ mới thường có từ khoảng tháng 4 – tháng 5 trở đi.
3. **Mùa cao điểm tiêu thụ**: nhu cầu tăng mạnh trước các dịp lễ cuối năm (Giáng sinh, Tết, Ramadan tuỳ năm). Nên đặt trước 2–3 tháng để kịp vận chuyển đường biển.
4. **Theo dõi giá**: giá nhân điều chịu ảnh hưởng của sản lượng toàn cầu, giá hạt thô châu Phi, tỷ giá và cước vận tải.

## Câu hỏi thường gặp

### Hạt điều Việt Nam thu hoạch vào tháng mấy?

Vụ thu hoạch chính kéo dài từ khoảng tháng 2 đến tháng 5, rộ nhất vào tháng 3 – tháng 4 ở Đông Nam Bộ.

### Ngoài mùa vụ có mua được nhân điều không?

Có. Nhà máy dự trữ hạt thô và nhập khẩu bổ sung nên nhân điều được chế biến và xuất khẩu quanh năm.

### Thời tiết ảnh hưởng đến hạt điều thế nào?

Mưa trái mùa và sương muối trong thời gian ra hoa có thể làm rụng hoa, giảm năng suất. Mưa khi thu hoạch làm hạt ẩm, dễ mốc nếu không phơi sấy kịp thời.

## Nguồn tham khảo

- Hiệp hội Điều Việt Nam (Vinacas) — số liệu ngành và mùa vụ hằng năm.
- International Nut and Dried Fruit Council (INC), *Nuts & Dried Fruits Statistical Yearbook* — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP lên kế hoạch nguyên liệu theo mùa vụ để đảm bảo nguồn hàng ổn định quanh năm. [Gửi yêu cầu](/contact) để nhận báo giá và lịch giao hàng phù hợp kế hoạch của bạn.`,
      en: `**Quick answer:** Cashew trees in Vietnam flower in the dry season (roughly November to January) and are harvested mainly from **February to May**. Factories still run all year, using stored raw nuts and raw cashews imported from Africa and Cambodia. For kernel buyers, supply is available year-round; what changes with the season is mostly price and how fresh the crop is.

## Main cashew growing regions in Vietnam

Cashews grow mostly in the Southeast and the Central Highlands, where there is a distinct dry season and red basalt or grey soils:

- **The former Binh Phuoc province (now part of Dong Nai)**: the largest cashew area in the country, known for big nuts with a high kernel yield.
- **Dong Nai and Tay Ninh**: long-established growing and processing areas.
- **Central Highlands (Dak Lak, Lam Dong, Gia Lai)**: significant acreage, with a season that can run slightly differently from the Southeast.

## The cashew calendar

- **November – January**: flowering. Weather at this time (off-season rain, cold mornings) strongly affects yield.
- **February – May**: main harvest. Ripe fruit drops, farmers collect and sun-dry the nuts and sell them to traders or factories.
- **April – July**: imported raw nuts from West Africa arrive in volume, topping up factory stocks.
- **All year**: kernel processing and export continue.

![Freshly harvested raw cashew nuts](/images/cashew-harvest.webp "Raw cashew nuts after harvest, before drying")

## Does Vietnam grow enough cashews for its factories?

No. Vietnam has led world cashew kernel exports for close to two decades, but domestic raw nut production covers only part of what its factories process. Most raw nuts are imported from West African countries such as Côte d'Ivoire, Ghana and Nigeria, and from Cambodia. If your market requires the origin of the raw material to be declared, ask your supplier about it.

## When should you place kernel orders?

1. **Annual contracts**: many buyers fix volumes for the year in the first quarter, once the crop outlook is clear.
2. **New-crop kernels**: kernels from the new Vietnamese crop are usually available from around April–May.
3. **Peak demand**: demand rises before year-end holidays (Christmas, Lunar New Year and, depending on the year, Ramadan). Order two to three months ahead to allow for sea freight.
4. **Watch the price drivers**: global crop size, African raw nut prices, exchange rates and freight costs.

## Frequently asked questions

### When is the cashew harvest in Vietnam?

The main harvest runs from about February to May, peaking in March and April in the Southeast.

### Can I buy cashew kernels outside the harvest season?

Yes. Factories hold raw nut stocks and import more, so kernels are processed and exported all year.

### How does weather affect cashews?

Off-season rain and cold snaps during flowering can make flowers drop and reduce yield. Rain at harvest makes nuts damp and prone to mould if they are not dried quickly.

## Sources

- Vietnam Cashew Association (Vinacas) — annual industry and crop data.
- International Nut and Dried Fruit Council (INC), *Nuts & Dried Fruits Statistical Yearbook* — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP plans its raw material around the crop calendar to keep supply steady through the year. [Send us your requirements](/contact) for a quote and a delivery schedule that fits your plan.`,
    },
  },
  {
    slug: "hat-macca-tay-nguyen",
    date: "2026-08-19",
    author: "VSAP",
    category: { vi: "Vùng nguyên liệu", en: "Origin" },
    cover: { src: "/images/macadamia-tree.webp", alt: { vi: "Quả macca tươi còn vỏ xanh", en: "Fresh macadamias in their green husks" } },
    title: {
      vi: "Hạt macca Tây Nguyên: vùng trồng, mùa vụ và điều làm nên chất lượng",
      en: "Macadamias from Vietnam's Central Highlands: where, when and why they're good",
    },
    excerpt: {
      vi: "Tây Nguyên với độ cao 500–1.000 m và đất đỏ bazan đang trở thành vùng macca lớn nhất Việt Nam. Bài viết giới thiệu vùng trồng, mùa thu hoạch và cách sơ chế quyết định chất lượng hạt.",
      en: "With elevations of 500–1,000 m and red basalt soils, the Central Highlands have become Vietnam's main macadamia region. Here is where they grow, when they are picked and how post-harvest handling decides quality.",
    },
    seo: {
      title: { vi: "Hạt macca Tây Nguyên: vùng trồng và mùa vụ", en: "Vietnamese macadamias from the Central Highlands" },
      description: {
        vi: "Macca Tây Nguyên được trồng ở độ cao 500–1.000 m trên đất bazan, thu hoạch khoảng tháng 8–10. Tìm hiểu vùng trồng, giống và quy trình sơ chế macca.",
        en: "Central Highlands macadamias grow at 500–1,000 m on basalt soils and are picked around August–October. Regions, varieties and post-harvest handling.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Macca (macadamia) là cây có nguồn gốc từ Úc, được trồng thử nghiệm ở Việt Nam từ những năm 1990 và phát triển mạnh từ khoảng năm 2010. Tây Nguyên, với độ cao khoảng 500–1.000 m, khí hậu mát và đất đỏ bazan, là vùng trồng macca lớn nhất cả nước. Mùa thu hoạch ở Tây Nguyên thường rơi vào **khoảng tháng 8 đến tháng 10**. Chất lượng hạt phụ thuộc nhiều vào việc thu hái đúng độ chín và sơ chế, sấy đúng cách ngay sau thu hoạch.

## Macca được trồng ở đâu tại Việt Nam?

- **Tây Nguyên**: Đắk Lắk, Lâm Đồng (bao gồm vùng Đắk Nông cũ), Gia Lai và Kon Tum cũ. Đây là vùng có diện tích lớn và tập trung nhất.
- **Tây Bắc**: Sơn La, Điện Biên, Lai Châu, với khí hậu mát, mùa thu hoạch muộn hơn Tây Nguyên.

Macca thường được trồng xen với cà phê, sầu riêng hoặc trồng thành vườn chuyên canh. Cây bắt đầu cho trái sau khoảng 3–4 năm (cây ghép) và cho năng suất ổn định khi đạt 7–8 năm tuổi trở lên.

## Vì sao Tây Nguyên hợp với cây macca?

1. **Độ cao và khí hậu**: nhiệt độ ban ngày ấm, ban đêm mát giúp cây ra hoa và tích luỹ dầu trong nhân.
2. **Đất đỏ bazan**: tầng đất dày, thoát nước tốt, phù hợp với bộ rễ của macca.
3. **Mùa khô rõ rệt**: giúp phân hoá mầm hoa đồng đều.
4. **Kinh nghiệm canh tác cây lâu năm**: nông dân quen với cây công nghiệp như cà phê, hồ tiêu.

![Hạt macca nguyên vỏ và nhân](/images/macadamia.webp "Macca nguyên vỏ và nhân macca sau khi tách")

## Từ quả tươi đến hạt macca sấy

1. **Thu hái**: quả chín có vỏ xanh nứt nhẹ, rụng hoặc được hái khi đủ độ chín.
2. **Tách vỏ xanh**: nên làm trong vòng 24 giờ sau thu hái để hạn chế nấm mốc và nhiệt sinh ra trong đống quả.
3. **Phân loại**: loại hạt lép, hạt nổi, hạt hỏng.
4. **Sấy**: sấy nhiều giai đoạn ở nhiệt độ tăng dần để đưa độ ẩm nhân xuống thấp (khoảng 1,5%), giúp nhân giòn, thơm và bảo quản lâu.
5. **Phân cỡ và nứt vỏ**: với sản phẩm macca nứt vỏ (NIS), hạt được tạo đường nứt để người dùng tách bằng dụng cụ đi kèm.

## Macca Việt Nam khác macca nhập khẩu thế nào?

Về giống, nhiều vườn ở Việt Nam dùng các giống phổ biến trên thế giới như OC, 246, 816, 849. Điểm khác biệt chủ yếu đến từ **độ tươi** (thời gian từ thu hoạch đến tay người mua ngắn hơn) và **cách sơ chế, sấy** của từng cơ sở. Khi mua, hãy hỏi về thời gian thu hoạch, độ ẩm và ngày đóng gói của lô hàng.

## Câu hỏi thường gặp

### Macca Tây Nguyên thu hoạch vào tháng mấy?

Thường khoảng tháng 8 đến tháng 10, tuỳ độ cao và giống. Vùng Tây Bắc thu hoạch muộn hơn.

### Vì sao hạt macca có giá cao?

Cây macca cần nhiều năm mới cho năng suất ổn định, vỏ hạt rất cứng nên chi phí sơ chế và tách nhân cao, đồng thời tỷ lệ nhân trên hạt nguyên vỏ chỉ khoảng 30–35%.

### Macca nứt vỏ có cần rang lại không?

Không cần. Macca nứt vỏ thương phẩm đã được sấy chín, có thể dùng ngay. Nên bảo quản kín, nơi khô mát sau khi mở bao.

## Nguồn tham khảo

- Australian Macadamia Society — [australianmacadamias.org](https://australianmacadamias.org)
- International Nut and Dried Fruit Council (INC) — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP có trụ sở tại Đắk Lắk, giữa vùng nguyên liệu macca Tây Nguyên. Xem [sản phẩm hạt macca](/products/macadamia) hoặc đọc tiếp [cách phân loại macca NIS và nhân Style](/news/phan-loai-hat-macca-nis-style).`,
      en: `**Quick answer:** The macadamia is native to Australia. It was trialled in Vietnam in the 1990s and has expanded quickly since around 2010. The Central Highlands, at roughly 500–1,000 m with a cool climate and red basalt soils, are now the country's largest macadamia region. The harvest there usually runs **from about August to October**. Quality depends heavily on picking at the right maturity and on prompt, careful drying after harvest.

## Where are macadamias grown in Vietnam?

- **Central Highlands**: Dak Lak, Lam Dong (including the former Dak Nong) and Gia Lai and the former Kon Tum. This is the largest and most concentrated area.
- **Northwest**: Son La, Dien Bien and Lai Chau, with a cooler climate and a later harvest.

Macadamias are often intercropped with coffee or durian, or planted as dedicated orchards. Grafted trees start bearing after about 3–4 years and give stable yields from about 7–8 years old.

## Why do macadamias suit the Central Highlands?

1. **Altitude and climate**: warm days and cool nights help flowering and oil build-up in the kernel.
2. **Red basalt soil**: deep and free-draining, suiting the macadamia's roots.
3. **A distinct dry season**: helps trees flower evenly.
4. **Farming know-how**: growers are used to perennial cash crops such as coffee and pepper.

![Macadamias in and out of the shell](/images/macadamia.webp "Nut-in-shell macadamias and kernels")

## From fresh fruit to dried nut

1. **Picking**: mature fruit has a green husk that starts to split; nuts drop or are picked when ripe.
2. **De-husking**: ideally within 24 hours of picking, to avoid mould and heat building up in piles of fruit.
3. **Sorting**: remove floaters, empty and damaged nuts.
4. **Drying**: in stages at rising temperatures, bringing kernel moisture down to about 1.5% for crunch, flavour and shelf life.
5. **Sizing and cracking**: for cracked nut-in-shell (NIS) products, a slit is cut so consumers can open the nut with the key provided.

## How do Vietnamese macadamias compare with imports?

Many Vietnamese orchards grow internationally common varieties such as OC, 246, 816 and 849. The main differences come from **freshness** (a shorter time from harvest to buyer) and each processor's **handling and drying**. When buying, ask for the harvest period, moisture and packing date of the lot.

## Frequently asked questions

### When are macadamias harvested in the Central Highlands?

Usually from about August to October, depending on altitude and variety. The Northwest harvests later.

### Why are macadamias expensive?

Trees take years to reach stable yields, the shell is extremely hard so cracking is costly, and the kernel makes up only about 30–35% of the nut-in-shell weight.

### Do cracked in-shell macadamias need roasting?

No. Commercial cracked macadamias are already dried and ready to eat. Keep them sealed in a cool, dry place after opening.

## Sources

- Australian Macadamia Society — [australianmacadamias.org](https://australianmacadamias.org)
- International Nut and Dried Fruit Council (INC) — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP is headquartered in Dak Lak, in the heart of the Central Highlands macadamia region. See our [macadamia range](/products/macadamia) or read on: [macadamia NIS sizes and kernel styles](/news/phan-loai-hat-macca-nis-style).`,
    },
  },
  {
    slug: "phan-loai-hat-macca-nis-style",
    date: "2026-09-02",
    author: "VSAP",
    category: { vi: "Kiến thức sản phẩm", en: "Product guide" },
    cover: { src: "/images/macadamia-spoon.webp", alt: { vi: "Hạt macca nguyên vỏ trong muỗng xúc", en: "In-shell macadamias in a scoop" } },
    title: {
      vi: "Phân loại hạt macca: macca nứt vỏ (NIS) theo cỡ và nhân macca Style 0–8",
      en: "Macadamia grades: nut-in-shell sizes and kernel styles 0–8",
    },
    excerpt: {
      vi: "Macca được bán ở hai dạng chính: nguyên vỏ (NIS) phân theo đường kính hạt, và nhân phân theo Style dựa trên tỷ lệ nguyên hạt và kích cỡ. Hiểu đúng mã giúp chọn đúng sản phẩm, đúng giá.",
      en: "Macadamias are sold in two main forms: nut-in-shell (NIS), graded by diameter, and kernels, graded into styles by wholeness and size. Knowing the codes helps you buy the right product at the right price.",
    },
    seo: {
      title: { vi: "Phân loại hạt macca: NIS 22+, 25+ và nhân Style 0–8", en: "Macadamia grades: NIS sizes and kernel styles" },
      description: {
        vi: "Macca NIS phân theo đường kính (18+, 22+, 25+ mm); nhân macca phân theo Style 0–8. Cách đọc mã, chọn loại phù hợp cho bán lẻ, bánh kẹo và chế biến.",
        en: "Macadamia NIS is graded by diameter (18+, 22+, 25+ mm) and kernels by styles 0–8. How to read the codes and choose for retail, bakery or processing.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Hạt macca nguyên vỏ (NIS – *Nut-In-Shell*) được phân loại theo **đường kính hạt**, ví dụ NIS 22+ nghĩa là hạt có đường kính từ 22 mm trở lên. Nhân macca được phân theo **Style**, từ Style 0 (nhân nguyên hạt, cỡ lớn nhất) đến các Style số cao hơn (nửa hạt, mảnh và mảnh nhỏ). Số Style càng nhỏ, tỷ lệ nhân nguyên càng cao và giá thường càng cao.

## Phân loại macca nguyên vỏ (NIS)

Macca nguyên vỏ được sàng theo đường kính:

- **NIS 18+**: đường kính từ 18 mm, cỡ phổ thông.
- **NIS 22+**: từ 22 mm, cỡ được ưa chuộng cho bán lẻ.
- **NIS 25+**: từ 25 mm, cỡ lớn, phân khúc quà tặng và cao cấp.

Với thị trường bán lẻ châu Á, macca thường được bán dạng **nứt vỏ sấy** (cracked NIS): mỗi hạt có một đường nứt và kèm dụng cụ tách. Các chỉ tiêu thường được thống nhất cùng cỡ hạt gồm: độ ẩm, **tỷ lệ thu hồi nhân** (thường khoảng 30–35%), tỷ lệ nhân loại 1 (nhân nổi trong nước, chất lượng tốt) và tỷ lệ hạt lỗi.

## Phân loại nhân macca theo Style

Nhân macca được chia Style theo tỷ lệ nguyên hạt/nửa hạt và kích cỡ. Cách phân loại phổ biến trong ngành như sau (chi tiết từng Style có thể khác nhau theo người mua):

- **Style 0**: nhân nguyên hạt cỡ lớn nhất, tỷ lệ nguyên hạt rất cao. Dùng cho hạt rang ăn liền cao cấp.
- **Style 1 (1L, 1S)**: chủ yếu nguyên hạt, chia cỡ lớn và nhỏ.
- **Style 2**: hỗn hợp nguyên hạt và nửa hạt.
- **Style 4 (4L, 4S)**: chủ yếu nửa hạt.
- **Style 5 – Style 6**: mảnh lớn và mảnh vừa.
- **Style 7 – Style 8**: mảnh nhỏ và vụn, dùng cho bánh, kem, bột macca.

## Chọn loại macca cho từng mục đích

1. **Bán lẻ nguyên vỏ, quà Tết**: NIS 22+ hoặc 25+ nứt vỏ sấy.
2. **Hạt rang ăn liền, hộp cao cấp**: nhân Style 0 hoặc Style 1.
3. **Mix hạt, granola**: Style 2 hoặc Style 4.
4. **Bánh quy, sô-cô-la, kem**: Style 5 – Style 7.
5. **Sữa hạt, bơ macca, dầu**: Style 7 – Style 8 để tối ưu chi phí.

![Macca nguyên vỏ và nhân macca](/images/macadamia.webp "Cỡ hạt nguyên vỏ quyết định mã NIS")

## Cần thống nhất những gì khi mua macca?

- Cỡ hạt hoặc Style, kèm dung sai cho phép.
- Độ ẩm nhân (thường khoảng 1,5% với nhân thương phẩm).
- Tỷ lệ hạt lỗi: nhân sậm màu, nhân bị côn trùng, nấm mốc.
- Quy cách đóng gói: hút chân không, nạp nitơ, khối lượng mỗi thùng.
- Phiếu phân tích (COA) và kiểm nghiệm vi sinh theo yêu cầu thị trường.

## Câu hỏi thường gặp

### NIS 22+ là gì?

Là hạt macca nguyên vỏ có đường kính từ 22 mm trở lên. Đây là cỡ phổ biến cho bán lẻ, cân bằng giữa kích thước và giá.

### Style 0 và Style 1 khác nhau thế nào?

Cả hai chủ yếu là nhân nguyên hạt, nhưng Style 0 có cỡ lớn nhất và tỷ lệ nguyên hạt cao nhất, nên giá cao hơn Style 1.

### Vì sao nhân macca nổi trong nước được coi là tốt?

Nhân có hàm lượng dầu cao thì nhẹ và nổi trong nước. Đây là cách đơn giản để phân biệt nhân chất lượng tốt (loại 1) với nhân kém dầu, dễ bị chìm.

## Nguồn tham khảo

- Australian Macadamia Society, tài liệu về kernel styles — [australianmacadamias.org](https://australianmacadamias.org)
- International Nut and Dried Fruit Council (INC) — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP cung cấp macca nguyên vỏ sấy nứt (NIS 22+ trở lên) và nhân macca theo Style quốc tế, đóng gói xuất khẩu hoặc bao bì bán lẻ 250 g – 1 kg theo nhãn riêng. [Xem sản phẩm macca](/products/macadamia) hoặc [yêu cầu báo giá](/contact).`,
      en: `**Quick answer:** Nut-in-shell (NIS) macadamias are graded by **diameter**: NIS 22+ means nuts of 22 mm and above. Macadamia kernels are graded into **styles**, from Style 0 (whole kernels, the largest size) to higher-numbered styles (halves, pieces and small pieces). The lower the style number, the higher the share of wholes and usually the price.

## Nut-in-shell (NIS) grades

NIS macadamias are screened by diameter:

- **NIS 18+**: 18 mm and above, a standard size.
- **NIS 22+**: 22 mm and above, popular for retail.
- **NIS 25+**: 25 mm and above, a large size for gifting and premium packs.

In Asian retail, macadamias are often sold **cracked and dried**: each nut has a slit and comes with an opener. Alongside size, buyers usually agree on moisture, **kernel recovery** (typically around 30–35%), first-grade kernel ratio (kernels that float in water, a sign of high oil content) and defects.

## Kernel styles

Kernels are graded into styles by the share of wholes and halves and by size. A widely used industry scheme looks like this (exact definitions vary by buyer):

- **Style 0**: the largest whole kernels with a very high share of wholes. Used for premium roasted snacks.
- **Style 1 (1L, 1S)**: mostly wholes, split into large and small.
- **Style 2**: a mix of wholes and halves.
- **Style 4 (4L, 4S)**: mostly halves.
- **Style 5 – Style 6**: large and medium pieces.
- **Style 7 – Style 8**: small pieces and meal, for bakery, ice cream and macadamia flour.

## Choosing a grade by use

1. **In-shell retail and gifting**: cracked NIS 22+ or 25+.
2. **Premium roasted snacks**: Style 0 or Style 1 kernels.
3. **Nut mixes and granola**: Style 2 or Style 4.
4. **Biscuits, chocolate, ice cream**: Style 5 – Style 7.
5. **Nut milk, macadamia butter, oil**: Style 7 – Style 8 for the best cost.

![Macadamias in and out of the shell](/images/macadamia.webp "Shell diameter sets the NIS grade")

## What to agree on when buying macadamias

- Size or style, with tolerances.
- Kernel moisture (around 1.5% is typical for commercial kernels).
- Defects: discoloured, insect-damaged or mouldy kernels.
- Packing: vacuum, nitrogen flush, net weight per carton.
- A certificate of analysis (COA) and microbiology tests as your market requires.

## Frequently asked questions

### What does NIS 22+ mean?

Nut-in-shell macadamias with a diameter of 22 mm or more. It is the most common retail size, balancing size and price.

### What is the difference between Style 0 and Style 1?

Both are mostly whole kernels, but Style 0 is the largest size with the highest share of wholes, so it costs more than Style 1.

### Why are floating macadamia kernels considered better?

Kernels rich in oil are lighter and float in water. It is a simple way to separate first-grade kernels from lower-oil kernels, which tend to sink.

## Sources

- Australian Macadamia Society, kernel style references — [australianmacadamias.org](https://australianmacadamias.org)
- International Nut and Dried Fruit Council (INC) — [inc.nutfruit.org](https://inc.nutfruit.org)

---

VSAP supplies cracked, dried in-shell macadamias (NIS 22+ and above) and kernels in international styles, in export packing or private-label retail packs from 250 g to 1 kg. [See our macadamias](/products/macadamia) or [request a quote](/contact).`,
    },
  },
];
