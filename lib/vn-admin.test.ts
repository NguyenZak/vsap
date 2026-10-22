import { describe, expect, it } from "vitest";
import { formatAddress, isValidAddress, provinces, wardsOf } from "./vn-admin";

describe("Vietnam administrative units (from 1 July 2025)", () => {
  it("has the 34 provinces and 3,321 wards/communes of the reform", () => {
    expect(provinces).toHaveLength(34);
    expect(provinces.reduce((n, [, wards]) => n + wards.length, 0)).toBe(3321);
    expect(new Set(provinces.map(([name]) => name)).size).toBe(34);
  });

  it("only accepts a ward together with its own province", () => {
    expect(isValidAddress("Tỉnh Đắk Lắk", "Xã Ea Súp")).toBe(true);
    expect(isValidAddress("Tỉnh Khánh Hòa", "Phường Nha Trang")).toBe(true);
    expect(isValidAddress("Thành phố Hà Nội", "Xã Ea Súp")).toBe(false);
    expect(isValidAddress("Tỉnh Không Có", "Xã Ea Súp")).toBe(false);
    expect(isValidAddress("", "")).toBe(false);
    expect(wardsOf("Tỉnh Không Có")).toEqual([]);
  });

  it("builds the address line from street, ward and province", () => {
    expect(formatAddress(" 12 Lê Lợi ", "Phường Bến Thành", "Thành phố Hồ Chí Minh")).toBe("12 Lê Lợi, Phường Bến Thành, Thành phố Hồ Chí Minh");
  });
});
