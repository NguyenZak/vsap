import { describe, expect, it } from "vitest";
import { defaultContent } from "./cms/defaults";
import { emptyL, preferredLocale } from "./locales";
import { normalize, normalizePack } from "./cms/normalize";
import { orderAlert } from "./cms/order-format";
import type { RetailPack } from "./cms/types";
import { canBuy, discountPercent, formatPrice, priceOrder, resolveLine, toShopItem } from "./shop";

const base = defaultContent().retailPacks[0];
const pack = (over: Partial<RetailPack>): RetailPack => ({ ...base, ...over });
const packs = [
  pack({ id: "jar", price: 120000 }),
  pack({ id: "box", price: null }),
  pack({ id: "gone", soldOut: true, price: 99000 }),
];

describe("legacy retail packs (sizes before single prices)", () => {
  it("drops the old comma-separated weights", () => {
    const legacy = { ...base, price: undefined, weights: "250 g, 500 g", soldOut: undefined, description: undefined } as unknown as RetailPack;
    const p = normalizePack(legacy);
    expect(p.price).toBeNull();
    expect(p.soldOut).toBe(false);
    expect(p.description).toEqual({ vi: "", en: "", zh: "", ja: "", ko: "" });
    expect("weights" in p).toBe(false);
  });

  it("keeps the first size's price and drops the sizes", () => {
    const legacy = { ...base, price: undefined, variants: [{ weight: "250 g", price: 125000 }, { weight: "500 g", price: 235000 }] } as unknown as RetailPack;
    const p = normalizePack(legacy);
    expect(p.price).toBe(125000);
    expect("variants" in p).toBe(false);
  });

  it("ignores prices that aren't positive numbers", () => {
    expect(normalizePack(pack({ price: 0 })).price).toBeNull();
    expect(normalizePack(pack({ price: null })).price).toBeNull();
    expect(normalizePack(pack({ price: 300000 })).price).toBe(300000);
  });

  it("is applied to whole stored documents", () => {
    const raw = JSON.parse(JSON.stringify(defaultContent()));
    raw.retailPacks = [{ ...raw.retailPacks[0], price: undefined, variants: [{ weight: "450 g", price: 215000 }] }];
    expect(normalize(raw).retailPacks[0].price).toBe(215000);
  });
});

describe("shop view", () => {
  it("shows the price and knows when a pack can be bought", () => {
    const [jar, box, gone] = packs.map((p) => toShopItem(p, "vi"));
    expect(jar.price).toBe(120000);
    expect(canBuy(jar)).toBe(true);
    expect(box.price).toBeNull();
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
    expect(resolveLine({ id: "jar", qty: 3 }, items)?.price).toBe(120000);
    expect(resolveLine({ id: "box", qty: 1 }, items)).toBeNull();
    expect(resolveLine({ id: "gone", qty: 1 }, items)).toBeNull();
    expect(resolveLine({ id: "nope", qty: 1 }, items)).toBeNull();
    expect(resolveLine({ id: "jar", qty: 500 }, items)?.qty).toBe(99);
  });
});

describe("priceOrder", () => {
  it("prices from the catalogue, ignores prices sent by the browser and merges repeated lines", () => {
    const order = priceOrder(
      [
        { id: "jar", qty: 2 },
        { id: "jar", qty: 1, price: 1 },
      ],
      packs,
    );
    expect(order?.items.map((i) => [i.id, i.qty, i.price])).toEqual([["jar", 3, 120000]]);
    expect(order?.total).toBe(3 * 120000);
  });

  it("rejects anything the customer could not have bought", () => {
    const bad = [
      [],
      "x",
      [{ id: "box", qty: 1 }],
      [{ id: "gone", qty: 1 }],
      [{ id: "nope", qty: 1 }],
      [{ id: "jar", qty: 0 }],
      [{ id: "jar", qty: 1.5 }],
      [{ id: "jar", qty: 100 }],
      Array.from({ length: 31 }, () => ({ id: "jar", qty: 1 })),
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

  it("leaves out the size on orders placed without one", () => {
    const { text } = orderAlert(
      { id: 8, data: { customer: { name: "An", phone: "0900000000", address: "Hà Nội" }, items: [{ id: "jar", name: "Hạt macca", price: 220000, qty: 1 }], total: 220000 } },
      "https://vsap.com.vn",
    );
    expect(text).toContain("1 × Hạt macca — 220.000₫");
  });
});

describe("languages added later (zh, ja, ko)", () => {
  it("fall back to English, then Vietnamese, when a text is not translated yet", () => {
    const item = toShopItem(pack({ id: "x", name: { ...emptyL(), vi: "Hạt điều", en: "Cashews" }, flavor: { ...emptyL(), vi: "Rang muối" } }), "zh");
    expect(item.name).toBe("Cashews");
    expect(item.flavor).toBe("Rang muối");
    expect(item.href).toBe(`/zh/products/${base.product}/x`);
  });
});

describe("preferredLocale (device language)", () => {
  it("picks the first site language in the device list, by q-value", () => {
    expect(preferredLocale("fr-FR,fr;q=0.9,ja;q=0.8,en;q=0.7")).toBe("ja");
    expect(preferredLocale("en-US;q=0.5, ko-KR")).toBe("ko");
    expect(preferredLocale("zh-TW,zh;q=0.9")).toBe("zh");
    expect(preferredLocale("de-DE,fr;q=0.8")).toBe("en");
    expect(preferredLocale("")).toBe("vi");
    expect(preferredLocale(null)).toBe("vi");
  });

  it("lets a saved choice from the language menu win", () => {
    expect(preferredLocale("ja-JP", "vi")).toBe("vi");
    expect(preferredLocale("ja-JP", "xx")).toBe("ja");
  });
});

describe("old price (discount)", () => {
  it("shows the old price and a rounded discount only when it is higher than the price", () => {
    const sale = toShopItem(pack({ price: 125000, oldPrice: 150000 }), "vi");
    expect(sale.oldPrice).toBe(150000);
    expect(discountPercent(sale)).toBe(17);
    const same = toShopItem(pack({ price: 125000, oldPrice: 100000 }), "vi");
    expect(same.oldPrice).toBeNull();
    expect(discountPercent(same)).toBeNull();
    expect(toShopItem(pack({ price: null, oldPrice: 150000 }), "vi").oldPrice).toBeNull();
  });

  it("charges the new price", () => {
    const order = priceOrder([{ id: "sale", qty: 2 }], [pack({ id: "sale", price: 125000, oldPrice: 150000 })]);
    expect(order?.total).toBe(250000);
  });
});

describe("policies", () => {
  const all = defaultContent().policies;
  it("ships the five pages an online shop must publish, in Vietnamese and English", () => {
    expect(all.map((p) => p.slug)).toEqual(["terms", "privacy", "payment", "shipping", "returns"]);
    for (const p of all) {
      expect(p.body.vi.length).toBeGreaterThan(200);
      expect(p.body.en.length).toBeGreaterThan(200);
      expect(p.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("only uses placeholders the policy page knows how to fill", () => {
    const known = new Set(["company", "taxId", "address", "phone", "email", "website"]);
    for (const p of all) {
      for (const text of [p.body.vi, p.body.en]) {
        for (const [, key] of text.matchAll(/\{(\w+)\}/g)) expect(known.has(key)).toBe(true);
      }
    }
  });
});
