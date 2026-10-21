// Quote-request types, labels and CSV export, shared by the API and Studio (no Cloudflare imports).

export const inquiryStatuses = ["new", "processing", "done", "spam"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

export const inquiryStatusInfo: Record<InquiryStatus, { label: string }> = {
  new: { label: "Mới" },
  processing: { label: "Đang xử lý" },
  done: { label: "Đã xong" },
  spam: { label: "Spam" },
};

export type InquiryData = {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  product?: string;
  quantity?: string;
  message: string;
};

export type Inquiry = {
  id: number;
  created_at: number;
  status: InquiryStatus;
  data: InquiryData;
  locale: string | null;
  source: string | null;
  country: string | null;
  note: string | null;
  updated_at: number | null;
  updated_by: string | null;
};

const CSV_COLUMNS: [string, (i: Inquiry) => string][] = [
  ["Mã", (i) => String(i.id)],
  ["Thời gian", (i) => new Date(i.created_at).toISOString()],
  ["Trạng thái", (i) => inquiryStatusInfo[i.status]?.label ?? i.status],
  ["Họ tên", (i) => i.data.name],
  ["Công ty", (i) => i.data.company ?? ""],
  ["Email", (i) => i.data.email],
  ["Điện thoại", (i) => i.data.phone ?? ""],
  ["Quốc gia", (i) => i.data.country ?? ""],
  ["Sản phẩm", (i) => i.data.product ?? ""],
  ["Số lượng", (i) => i.data.quantity ?? ""],
  ["Nội dung", (i) => i.data.message],
  ["Ngôn ngữ", (i) => i.locale ?? ""],
  ["Trang gửi", (i) => i.source ?? ""],
  ["Quốc gia (IP)", (i) => i.country ?? ""],
  ["Ghi chú nội bộ", (i) => i.note ?? ""],
];

/** Excel-friendly CSV (UTF-8 BOM, CRLF). Cells starting with = + - @ are prefixed so spreadsheets don't run them as formulas. */
export function inquiriesCsv(items: Inquiry[]) {
  const cell = (v: string) => {
    const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  const rows = [CSV_COLUMNS.map(([h]) => h), ...items.map((i) => CSV_COLUMNS.map(([, get]) => get(i)))];
  return `﻿${rows.map((r) => r.map(cell).join(",")).join("\r\n")}\r\n`;
}
