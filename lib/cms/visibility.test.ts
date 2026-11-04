import { describe, expect, it } from "vitest";
import { defaultContent } from "./defaults";
import { normalize } from "./normalize";
import { can, roles } from "./roles";
import { parseVisibility } from "./visibility-format";

describe("website visibility", () => {
  it("is public unless an admin explicitly hid it", () => {
    expect(parseVisibility(null).public).toBe(true);
    expect(parseVisibility({}).public).toBe(true);
    expect(parseVisibility("garbage").public).toBe(true);
    expect(parseVisibility({ public: true }).public).toBe(true);
    expect(parseVisibility({ public: "false" }).public).toBe(true);
    expect(parseVisibility({ public: false, updatedBy: "Lan" }, 123)).toEqual({ public: false, updatedAt: 123, updatedBy: "Lan" });
  });

  it("can be switched by admins only", () => {
    expect(roles.filter((r) => can(r, "site"))).toEqual(["admin"]);
  });

  it("has Coming soon copy in every language, kept for content saved before it existed", () => {
    const content = defaultContent();
    for (const ui of Object.values(content.ui)) expect(ui.comingSoon.tag && ui.comingSoon.title && ui.comingSoon.body).toBeTruthy();
    const old = structuredClone(content) as unknown as { ui: Record<string, Record<string, unknown>> };
    for (const ui of Object.values(old.ui)) delete ui.comingSoon;
    expect(normalize(old).ui.vi.comingSoon.title).toBe(content.ui.vi.comingSoon.title);
  });
});
