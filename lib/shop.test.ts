import { describe, expect, it } from "vitest";
import { defaultContent } from "./cms/defaults";
import { normalize, normalizePack } from "./cms/normalize";
import { orderAlert } from "./cms/order-format";
import type { RetailPack } from "./cms/types";
import { canBuy, formatPrice, minPrice, priceOrder, resolveLine, toShopItem } from "./shop";

const base = defaultContent().retailPacks[0];
const pack = (over: Partial<RetailPack>): RetailPack => ({ ...base, ...over });
const packs = [
  pack({ id: "jar", variants: [{ weight: "250 g", price: 120000 }, { weight: "500 g", price: 220000 }] }),
  pack({ id: "box", variants: [{ weight: "450 g" }] }),
  pack({ id: "gone", soldOut: true, variants: [{ weight: "250 g", price: 99000 }] }),
];

describe("legacy retail packs", () => {
  it("turns the old comma-separated weights into variants without prices", () => {
    const legacy = { ...base, variants: undefined, weights: "250 g, 500 g ,", soldOut: undefined, description: undefined } as unknown as RetailPack;
    const p = normalizePack(legacy);
    expect(p.variants).toEqual([{ weight: "250 g" }, { weight: "500 g" }]);
    expect(p.soldOut).toBe(false);
    expect(p.description).toEqual({ vi: "", en: "" });
    expect("weights" in p).toBe(false);
  });

  it("drops empty sizes and prices that aren't positive numbers", () => {
    const p = normalizePack(pack({ variants: [{ weight: " 1 kg ", price: 0 }, { weight: "", price: 5 }, { weight: "2 kg", price: null as unknown as number }, { weight: "3 kg", price: 300000 }] }));
    expect(p.variants).toEqual([{ weight: "1 kg" }, { weight: "2 kg" }, { weight: "3 kg", price: 300000 }]);
  });

  it("is applied to whole stored documents", () => {
    const raw = JSON.parse(JSON.stringify(defaultContent()));
    raw.retailPacks = [{ ...raw.retailPacks[0], variants: undefined, weights: "450 g" }];
    expect(normalize(raw).retailPacks[0].variants).toEqual([{ weight: "450 g" }]);
  });
});

describe("shop view", () => {
  it("shows the lowest price and knows when a pack can be bought", () => {
    const [jar, box, gone] = packs.map((p) => toShopItem(p, "vi"));
    expect(minPrice(jar)).toBe(120000);
    expect(canBuy(jar)).toBe(true);
    expect(minPrice(box)).toBeNull();
    expect(canBuy(box)).toBe(false);
    expect(canBuy(gone)).toBe(false);
    expect(jar.href).toBe(`/vi/products/${base.product}/jar`);
  });

  it("formats VND per language", () => {
    expect(formatPrice(330000, "vi").replace(/\s/g, " ")).toBe("330.000 ₫");
    expect(formatPrice(330000, "en")).toBe("₫330,000");
  });

  it("drops cart lines that can no longer be bought", () => {
    const items = packs.map((p) => toShopItem(p, "vi"));
    expect(resolveLine({ id: "jar", weight: "500 g", qty: 3 }, items)?.price).toBe(220000);
    expect(resolveLine({ id: "jar", weight: "1 kg", qty: 1 }, items)).toBeNull();
    expect(resolveLine({ id: "box", weight: "450 g", qty: 1 }, items)).toBeNull();
    expect(resolveLine({ id: "gone", weight: "250 g", qty: 1 }, items)).toBeNull();
    expect(resolveLine({ id: "jar", weight: "250 g", qty: 500 }, items)?.qty).toBe(99);
  });
});

describe("priceOrder", () => {
  it("prices from the catalogue and merges repeated lines", () => {
    const order = priceOrder(
      [
        { id: "jar", weight: "250 g", qty: 2 },
        { id: "jar", weight: "500 g", qty: 1, price: 1 },
        { id: "jar", weight: "250 g", qty: 1 },
      ],
      packs,
    );
    expect(order?.items.map((i) => [i.weight, i.qty, i.price])).toEqual([
      ["250 g", 3, 120000],
      ["500 g", 1, 220000],
    ]);
    expect(order?.total).toBe(3 * 120000 + 220000);
  });

  it("rejects anything the customer could not have bought", () => {
    const bad = [
      [],
      "x",
      [{ id: "box", weight: "450 g", qty: 1 }],
      [{ id: "gone", weight: "250 g", qty: 1 }],
      [{ id: "jar", weight: "9 kg", qty: 1 }],
      [{ id: "nope", weight: "250 g", qty: 1 }],
      [{ id: "jar", weight: "250 g", qty: 0 }],
      [{ id: "jar", weight: "250 g", qty: 1.5 }],
      [{ id: "jar", weight: "250 g", qty: 100 }],
      Array.from({ length: 31 }, () => ({ id: "jar", weight: "250 g", qty: 1 })),
    ];
    for (const lines of bad) expect(priceOrder(lines, packs)).toBeNull();
  });
});

describe("orderAlert", () => {
  it("lists items and total, escapes customer text and links to Studio", () => {
    const { text, buttons } = orderAlert(
      {
        id: 7,
        locale: "vi",
        data: {
          customer: { name: "An <b>", phone: "0962 874 111", address: "Hà Nội", note: "Giao giờ hành chính" },
          items: [{ id: "jar", name: "Hạt macca", weight: "500 g", price: 220000, qty: 2 }],
          total: 440000,
        },
      },
      "https://vsap.com.vn",
    );
    expect(text).toContain("Đơn hàng mới #7");
    expect(text).toContain("An &lt;b&gt;");
    expect(text).toContain("2 × Hạt macca (500 g) — 440.000₫");
    expect(buttons[0][0].url).toBe("https://vsap.com.vn/admin?view=orders&id=7");
    expect(buttons[1][0].url).toBe("https://zalo.me/0962874111");
  });
});
