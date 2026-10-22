// Bài viết mẫu cho chuyên mục Sức khỏe và đời sống (xem lib/content/posts.ts).
// Nội dung sức khỏe chỉ nêu điều có nguồn rõ ràng, không thay lời khuyên y tế.
import type { SeedPost } from "./posts";

export const posts3: SeedPost[] = [
  {
    slug: "an-hat-moi-ngay-co-tot-khong",
    channel: "health",
    date: "2026-10-21",
    author: "VSAP",
    category: { vi: "Sức khỏe", en: "Health" },
    cover: { src: "/images/macadamia.webp", alt: { vi: "Hạt macca nguyên vỏ và đã tách vỏ", en: "Macadamia nuts in and out of the shell" } },
    title: {
      vi: "Ăn hạt mỗi ngày có tốt không? Lợi ích và lưu ý khi ăn hạt điều, hạt macca",
      en: "Is eating nuts every day good for you? Benefits and cautions for cashews and macadamias",
    },
    excerpt: {
      vi: "Một nắm hạt khoảng 30 g mỗi ngày là thói quen được nhiều khuyến nghị dinh dưỡng ủng hộ. Bài viết tóm tắt những gì nghiên cứu cho thấy, cách ăn đúng lượng và những ai cần thận trọng.",
      en: "A handful of nuts, about 30 g a day, is a habit many dietary guidelines support. Here is what the research shows, how much to eat and who should be careful.",
    },
    seo: {
      title: { vi: "Ăn hạt mỗi ngày có tốt không? Lợi ích và lưu ý", en: "Eating nuts every day: benefits and cautions" },
      description: {
        vi: "Ăn khoảng 30 g hạt mỗi ngày trong chế độ ăn cân đối có lợi cho tim mạch. Lợi ích của hạt điều, hạt macca, khẩu phần hợp lý và ai cần thận trọng.",
        en: "About 30 g of nuts a day within a balanced diet is linked to heart health. Benefits of cashews and macadamias, sensible servings and who should be careful.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Với hầu hết người trưởng thành, ăn khoảng **30 g hạt mỗi ngày** (một nắm tay nhỏ) trong một chế độ ăn cân đối là thói quen tốt. Hạt cung cấp chất béo không bão hòa, đạm thực vật, chất xơ và khoáng chất. Nhiều nghiên cứu cho thấy người ăn hạt đều đặn có nguy cơ bệnh tim mạch thấp hơn. Tuy vậy, hạt giàu năng lượng, và người dị ứng hạt cây cần tránh hoàn toàn.

## Nghiên cứu nói gì về việc ăn hạt?

- **Tim mạch**: Năm 2017, Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA) cho phép một *tuyên bố sức khỏe có điều kiện* đối với hạt macca. Theo đó, nghiên cứu ủng hộ nhưng chưa kết luận chắc chắn rằng ăn khoảng 42 g (1,5 ounce) macca mỗi ngày, trong chế độ ăn ít chất béo bão hòa và cholesterol, có thể giảm nguy cơ bệnh mạch vành.
- **Chế độ ăn Địa Trung Hải**: Nghiên cứu PREDIMED tại Tây Ban Nha ghi nhận nhóm theo chế độ ăn Địa Trung Hải có bổ sung khoảng 30 g hạt mỗi ngày có ít biến cố tim mạch hơn nhóm ăn chế độ giảm chất béo thông thường.
- **Cảm giác no**: Chất béo, đạm và chất xơ trong hạt giúp no lâu, nên hạt là lựa chọn ăn vặt tốt hơn bánh kẹo ngọt nếu ăn đúng lượng.

Các kết quả này nói về hạt **trong một chế độ ăn cân đối**, không phải hạt là thuốc chữa bệnh.

## Hạt điều và hạt macca có gì?

- **Hạt điều**: nhiều đạm thực vật (khoảng 18 g/100 g), giàu **magie** và **đồng**, vị béo nhẹ, dễ kết hợp trong món mặn lẫn món ngọt.
- **Hạt macca**: giàu **chất béo không bão hòa đơn** (khoảng 59 g/100 g), ít carbohydrate, vị bùi béo đặc trưng.

So sánh chi tiết có trong bài [Giá trị dinh dưỡng của hạt điều và hạt macca](/health/gia-tri-dinh-duong-hat-dieu-hat-macca).

## Ăn bao nhiêu và ăn thế nào cho đúng?

1. **Khoảng 30 g mỗi ngày**: tương đương khoảng 18 hạt điều hoặc 10–12 hạt macca.
2. **Thay thế, đừng cộng thêm**: dùng hạt thay cho bánh quy, snack chiên, thay vì ăn thêm ngoài các bữa vốn đã đủ năng lượng.
3. **Ưu tiên hạt rang mộc hoặc ít muối**: hạn chế loại tẩm đường, tẩm nhiều muối hoặc chiên dầu.
4. **Chia nhỏ**: để sẵn từng phần 30 g trong hộp nhỏ, tránh ăn trực tiếp từ túi lớn.

![Hạt điều rang](/images/cashew-roasted.webp "Một khẩu phần khoảng 30 g mỗi ngày là đủ")

## Ai cần thận trọng?

- **Người dị ứng hạt cây (tree nuts)**: hạt điều và macca có thể gây phản ứng dị ứng nghiêm trọng. Người có tiền sử dị ứng cần tránh và hỏi ý kiến bác sĩ.
- **Trẻ nhỏ dưới 5 tuổi**: không nên cho ăn hạt nguyên vì nguy cơ hóc. Có thể xay mịn hoặc dùng bơ hạt.
- **Người cần kiểm soát cân nặng hoặc muối**: tính phần năng lượng của hạt vào tổng khẩu phần trong ngày, chọn loại không muối.

## Câu hỏi thường gặp

### Ăn hạt có làm tăng cân không?

Hạt giàu năng lượng nên ăn quá nhiều có thể làm dư calo. Với khoảng 30 g mỗi ngày dùng thay cho món ăn vặt khác, hạt không làm tăng cân trong một chế độ ăn cân đối.

### Nên ăn hạt vào lúc nào trong ngày?

Lúc nào cũng được. Nhiều người dùng hạt làm bữa phụ giữa buổi sáng hoặc chiều, hoặc rắc vào salad, sữa chua, cháo yến mạch.

### Hạt điều và hạt macca, loại nào tốt hơn?

Mỗi loại có thế mạnh riêng: hạt điều nhiều đạm và khoáng chất, macca nhiều chất béo không bão hòa đơn. Ăn xen kẽ nhiều loại hạt là lựa chọn cân bằng nhất.

## Nguồn tham khảo

- U.S. Food and Drug Administration (FDA), tuyên bố sức khỏe có điều kiện về hạt macca và bệnh mạch vành (2017) — [fda.gov](https://www.fda.gov)
- Estruch R. và cộng sự, nghiên cứu PREDIMED, *New England Journal of Medicine* (2018)
- USDA FoodData Central — [fdc.nal.usda.gov](https://fdc.nal.usda.gov)

---

*Bài viết mang tính thông tin chung, không thay thế tư vấn của bác sĩ hoặc chuyên gia dinh dưỡng.* Xem các [sản phẩm hạt điều, hạt macca VSAP](/products).`,
      en: `**Quick answer:** For most adults, eating about **30 g of nuts a day** (a small handful) as part of a balanced diet is a good habit. Nuts provide unsaturated fat, plant protein, fibre and minerals, and many studies link regular nut eating with a lower risk of heart disease. They are energy-dense, though, and anyone with a tree-nut allergy must avoid them completely.

## What does the research say?

- **Heart health**: In 2017 the U.S. Food and Drug Administration (FDA) allowed a *qualified health claim* for macadamias: supportive but not conclusive research shows that eating about 42 g (1.5 ounces) of macadamias a day, in a diet low in saturated fat and cholesterol, may reduce the risk of coronary heart disease.
- **Mediterranean diet**: The PREDIMED trial in Spain found fewer cardiovascular events in people following a Mediterranean diet with about 30 g of mixed nuts a day than in those on a standard reduced-fat diet.
- **Feeling full**: Fat, protein and fibre keep you satisfied, so a portion of nuts is a better snack than sweet biscuits.

These findings concern nuts **within a balanced diet**; nuts are not a medicine.

## What's in cashews and macadamias?

- **Cashews**: rich in plant protein (about 18 g per 100 g), **magnesium** and **copper**, with a mild, creamy taste that suits savoury and sweet dishes.
- **Macadamias**: rich in **monounsaturated fat** (about 59 g per 100 g) and low in carbohydrate, with a distinctive buttery flavour.

See the full comparison in [Cashew and macadamia nutrition](/health/gia-tri-dinh-duong-hat-dieu-hat-macca).

## How much, and how?

1. **About 30 g a day**: roughly 18 cashews or 10–12 macadamias.
2. **Swap, don't add**: replace biscuits or fried snacks rather than eating nuts on top of meals that are already enough.
3. **Choose dry-roasted or lightly salted nuts**: limit sugar-coated, heavily salted or fried ones.
4. **Portion them**: keep 30 g servings in small containers instead of eating from a large bag.

![Roasted cashews](/images/cashew-roasted.webp "A serving of about 30 g a day is enough")

## Who should be careful?

- **People with a tree-nut allergy**: cashews and macadamias can cause severe reactions. Avoid them and talk to a doctor.
- **Children under 5**: whole nuts are a choking hazard. Grind them finely or use nut butter instead.
- **Anyone watching weight or salt**: count nuts in your daily energy and choose unsalted ones.

## Frequently asked questions

### Do nuts make you gain weight?

Nuts are energy-dense, so eating a lot can add excess calories. About 30 g a day in place of other snacks does not cause weight gain within a balanced diet.

### When is the best time to eat nuts?

Any time. Many people have them as a mid-morning or afternoon snack, or sprinkle them on salads, yoghurt or porridge.

### Which is better, cashews or macadamias?

Each has its strengths: cashews offer more protein and minerals, macadamias more monounsaturated fat. Eating a variety of nuts is the most balanced choice.

## Sources

- U.S. Food and Drug Administration (FDA), qualified health claim for macadamia nuts and coronary heart disease (2017) — [fda.gov](https://www.fda.gov)
- Estruch R. et al., the PREDIMED trial, *New England Journal of Medicine* (2018)
- USDA FoodData Central — [fdc.nal.usda.gov](https://fdc.nal.usda.gov)

---

*This article is general information and does not replace advice from a doctor or dietitian.* See [VSAP cashews and macadamias](/products).`,
    },
  },
  {
    slug: "cach-dung-hat-dieu-hat-macca-trong-bua-an",
    channel: "health",
    date: "2026-10-22",
    author: "VSAP",
    category: { vi: "Công thức", en: "Recipes" },
    cover: { src: "/images/cashew.webp", alt: { vi: "Nhân hạt điều nguyên hạt", en: "Whole cashew kernels" } },
    title: {
      vi: "5 cách dùng hạt điều, hạt macca trong bữa ăn gia đình",
      en: "5 ways to use cashews and macadamias in family meals",
    },
    excerpt: {
      vi: "Sữa hạt điều, sốt kem thuần chay, salad macca, granola và gà xào hạt điều: năm công thức đơn giản giúp cả nhà ăn hạt mỗi ngày mà không nhàm chán.",
      en: "Cashew milk, vegan cashew cream, macadamia salad, granola and cashew chicken: five simple recipes that make everyday nuts easy for the whole family.",
    },
    seo: {
      title: { vi: "5 cách dùng hạt điều, hạt macca trong bữa ăn", en: "5 ways to cook with cashews and macadamias" },
      description: {
        vi: "Công thức sữa hạt điều, sốt kem hạt điều thuần chay, salad macca, granola và gà xào hạt điều: dễ làm, nguyên liệu quen thuộc, hợp cho cả gia đình.",
        en: "Recipes for cashew milk, vegan cashew cream, macadamia salad, granola and cashew chicken: easy, familiar ingredients, made for the whole family.",
      },
    },
    body: {
      vi: `**Tóm tắt nhanh:** Cách dễ nhất để ăn hạt đều đặn là đưa hạt vào món ăn hằng ngày. Hạt điều tươi (chưa rang, không muối) hợp làm **sữa hạt** và **sốt kem**; hạt điều rang và hạt macca hợp với **salad**, **granola** và **món xào**. Dưới đây là năm công thức cho khoảng 2–4 người.

## 1. Sữa hạt điều

**Nguyên liệu:** 100 g hạt điều tươi, 1 lít nước, một nhúm muối, 1–2 thìa mật ong hoặc 2 quả chà là (tùy chọn).

1. Ngâm hạt điều trong nước khoảng 4 giờ, rồi rửa lại.
2. Xay hạt với 1 lít nước trong khoảng 1 phút đến khi mịn.
3. Lọc qua túi lọc nếu thích uống mịn; thêm muối và mật ong.
4. Bảo quản trong chai kín, để tủ lạnh và dùng trong 3 ngày; lắc đều trước khi uống.

## 2. Sốt kem hạt điều thuần chay

**Nguyên liệu:** 150 g hạt điều tươi, 120 ml nước, 1 thìa nước cốt chanh, 1 tép tỏi, muối.

Ngâm hạt điều khoảng 2 giờ, để ráo rồi xay cùng các nguyên liệu đến khi sánh mịn. Dùng thay kem tươi để trộn mì Ý, chấm rau củ hoặc rưới lên khoai nướng.

## 3. Salad rau xanh với hạt macca

**Nguyên liệu:** rau xà lách, cà chua bi, dưa leo, bơ chín, 40 g nhân macca, dầu ô liu, nước cốt chanh, muối, tiêu.

Rang nhân macca trên chảo khô đến khi thơm, để nguội rồi đập dập. Trộn rau với dầu ô liu, chanh, muối, tiêu; rắc macca lên trên ngay trước khi ăn để hạt giữ độ giòn.

![Hạt macca](/images/macadamia-spoon.webp "Nhân macca rang khô tăng vị bùi cho salad")

## 4. Granola yến mạch, hạt điều và macca

**Nguyên liệu:** 200 g yến mạch cán, 80 g hạt điều, 60 g nhân macca, 3 thìa mật ong, 2 thìa dầu dừa, một nhúm muối.

1. Cắt nhỏ hạt điều và macca, trộn với yến mạch và muối.
2. Đun chảy dầu dừa với mật ong, rưới lên hỗn hợp và trộn đều.
3. Trải mỏng trên khay, nướng khoảng 20–25 phút ở 160 °C, đảo giữa chừng.
4. Để nguội hẳn rồi cho vào hũ kín. Ăn với sữa chua hoặc sữa hạt điều.

## 5. Gà xào hạt điều

**Nguyên liệu:** 300 g ức gà thái miếng, 60 g hạt điều rang, 1 quả ớt chuông, nửa củ hành tây, 2 tép tỏi, 1 thìa dầu hào, 1 thìa nước tương.

Ướp gà với nước tương. Phi thơm tỏi, xào gà đến khi săn, thêm hành tây và ớt chuông, nêm dầu hào. Cho hạt điều vào cuối cùng, đảo nhanh rồi tắt bếp để hạt còn giòn.

## Câu hỏi thường gặp

### Làm sữa hạt có cần ngâm hạt điều không?

Nên ngâm khoảng 4 giờ. Hạt mềm hơn nên xay mịn, sữa béo và ít bã hơn. Nếu vội, có thể ngâm nước ấm khoảng 30 phút.

### Dùng hạt điều rang muối làm sữa được không?

Được nhưng sữa sẽ mặn và có vị rang. Để sữa và sốt kem thơm nhẹ, nên dùng hạt điều tươi, không muối.

### Sữa hạt điều tự làm để được bao lâu?

Khoảng 3 ngày trong tủ lạnh, đựng trong chai kín. Nếu sữa có mùi chua thì không nên dùng.

---

Cần hạt điều, hạt macca cho căn bếp gia đình? Xem [sản phẩm bán lẻ VSAP](/products) hoặc đọc thêm [Ăn hạt mỗi ngày có tốt không?](/health/an-hat-moi-ngay-co-tot-khong).`,
      en: `**Quick answer:** The easiest way to eat nuts regularly is to put them in everyday dishes. Raw, unsalted cashews make great **nut milk** and **cream sauces**; roasted cashews and macadamias suit **salads**, **granola** and **stir-fries**. Here are five recipes for about 2–4 people.

## 1. Cashew milk

**Ingredients:** 100 g raw cashews, 1 litre water, a pinch of salt, 1–2 teaspoons honey or 2 dates (optional).

1. Soak the cashews for about 4 hours, then rinse.
2. Blend with 1 litre of water for about a minute, until smooth.
3. Strain through a nut-milk bag if you like it silky; add salt and honey.
4. Keep in a sealed bottle in the fridge and use within 3 days; shake before drinking.

## 2. Vegan cashew cream

**Ingredients:** 150 g raw cashews, 120 ml water, 1 tablespoon lemon juice, 1 garlic clove, salt.

Soak the cashews for about 2 hours, drain, then blend with the rest until thick and smooth. Use it instead of cream for pasta, as a dip for vegetables or over baked potatoes.

## 3. Green salad with macadamias

**Ingredients:** lettuce, cherry tomatoes, cucumber, ripe avocado, 40 g macadamia kernels, olive oil, lemon juice, salt, pepper.

Toast the macadamias in a dry pan until fragrant, let them cool and crush lightly. Dress the salad with olive oil, lemon, salt and pepper; scatter the macadamias on top just before serving so they stay crunchy.

![Macadamias](/images/macadamia-spoon.webp "Dry-toasted macadamias add a buttery crunch to salads")

## 4. Oat, cashew and macadamia granola

**Ingredients:** 200 g rolled oats, 80 g cashews, 60 g macadamia kernels, 3 tablespoons honey, 2 tablespoons coconut oil, a pinch of salt.

1. Chop the cashews and macadamias and mix with the oats and salt.
2. Melt the coconut oil with the honey, pour over and mix well.
3. Spread thinly on a tray and bake for about 20–25 minutes at 160 °C, stirring halfway.
4. Cool completely and store in an airtight jar. Serve with yoghurt or cashew milk.

## 5. Cashew chicken stir-fry

**Ingredients:** 300 g chicken breast in pieces, 60 g roasted cashews, 1 bell pepper, half an onion, 2 garlic cloves, 1 tablespoon oyster sauce, 1 tablespoon soy sauce.

Marinate the chicken in soy sauce. Fry the garlic until fragrant, stir-fry the chicken until firm, add onion and pepper, then the oyster sauce. Add the cashews last, toss briefly and turn off the heat so they stay crunchy.

## Frequently asked questions

### Do cashews need soaking for nut milk?

Soaking for about 4 hours is best: softer nuts blend smoother, giving creamier milk with less pulp. In a hurry, soak in warm water for about 30 minutes.

### Can I use roasted salted cashews for milk?

You can, but the milk will taste salty and toasted. For mild milk and cream, use raw, unsalted cashews.

### How long does homemade cashew milk keep?

About 3 days in the fridge in a sealed bottle. If it smells sour, don't drink it.

---

Need cashews and macadamias for your kitchen? See [VSAP retail products](/products) or read [Is eating nuts every day good for you?](/health/an-hat-moi-ngay-co-tot-khong)`,
    },
  },
];
