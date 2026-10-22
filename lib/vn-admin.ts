// Đơn vị hành chính Việt Nam sau sắp xếp từ 1/7/2025: 34 tỉnh/thành, 3.321 xã/phường/đặc khu,
// không còn cấp huyện. Nguồn: provinces.open-api.vn (API v2), lấy ngày 22/10/2026.
// Cập nhật: tải lại https://provinces.open-api.vn/api/v2/?depth=2 và ghi lại vn-admin.json
// dạng [[tên tỉnh, [tên xã/phường…]], …].
import data from "./vn-admin.json";

export type Province = [name: string, wards: string[]];

export const provinces = data as Province[];

/** The ward list of a province, or [] when the name is unknown. */
export const wardsOf = (province: string) => provinces.find(([name]) => name === province)?.[1] ?? [];

/** True when both names are exactly a province and one of its wards. */
export const isValidAddress = (province: string, ward: string) => wardsOf(province).includes(ward);

/** "12 Lê Lợi, Phường Bến Thành, Thành phố Hồ Chí Minh" */
export const formatAddress = (street: string, ward: string, province: string) => [street, ward, province].map((s) => s.trim()).filter(Boolean).join(", ");
