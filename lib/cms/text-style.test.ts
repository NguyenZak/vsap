import { describe, expect, it } from "vitest";
import { plainText } from "../markdown";
import { alignClass, sizeOffset, sizeStyle } from "./text-style";

describe("rich text fields", () => {
  it("maps stored alignments to classes and ignores anything else", () => {
    expect(alignClass("center")).toBe("text-center");
    expect(alignClass("justify")).toBe("text-justify");
    expect(alignClass("")).toBe("");
    expect(alignClass("middle")).toBe("");
    expect(alignClass(undefined)).toBe("");
  });

  it("turns a size offset into a relative font size, clamped and rounded", () => {
    expect(sizeStyle(2)).toEqual({ fontSize: "calc(1em + 2px)" });
    expect(sizeStyle(-1, "1.1em")).toEqual({ fontSize: "calc(1.1em - 1px)" });
    expect(sizeStyle(0)).toBeUndefined();
    expect(sizeStyle("3")).toBeUndefined();
    expect(sizeOffset(99)).toBe(24);
    expect(sizeOffset(-2.6)).toBe(-3);
  });

  it("strips formatting marks for meta descriptions and structured data", () => {
    expect(plainText("Hạt **macca** *Tây Nguyên*, xem [báo giá](/contact).")).toBe("Hạt macca Tây Nguyên, xem báo giá.");
  });
});
