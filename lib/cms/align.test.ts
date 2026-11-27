import { describe, expect, it } from "vitest";
import { plainText } from "../markdown";
import { alignClass } from "./align";

describe("rich text fields", () => {
  it("maps stored alignments to classes and ignores anything else", () => {
    expect(alignClass("center")).toBe("text-center");
    expect(alignClass("justify")).toBe("text-justify");
    expect(alignClass("")).toBe("");
    expect(alignClass("middle")).toBe("");
    expect(alignClass(undefined)).toBe("");
  });

  it("strips formatting marks for meta descriptions and structured data", () => {
    expect(plainText("Hạt **macca** *Tây Nguyên*, xem [báo giá](/contact).")).toBe("Hạt macca Tây Nguyên, xem báo giá.");
  });
});
