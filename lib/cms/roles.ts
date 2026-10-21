// Who may do what in VSAP Studio. Pure data so both the API and the admin UI
// read the same table (the UI only hides buttons; the API is what enforces it).

export const roles = ["admin", "publisher", "editor", "sales"] as const;
export type Role = (typeof roles)[number];

export type Permission =
  /** Open the editors and read the draft. */
  | "content.read"
  /** Change the draft, write news posts, upload images. */
  | "content.write"
  /** Make changes live: publish, discard the draft, restore old versions, publish/delete posts. */
  | "content.publish"
  | "media.delete"
  /** Read and handle quote requests from the website. */
  | "inquiries"
  | "users"
  | "audit";

const grants: Record<Role, Permission[]> = {
  admin: ["content.read", "content.write", "content.publish", "media.delete", "inquiries", "users", "audit"],
  publisher: ["content.read", "content.write", "content.publish", "media.delete", "inquiries"],
  editor: ["content.read", "content.write"],
  sales: ["inquiries"],
};

export const roleInfo: Record<Role, { label: string; description: string }> = {
  admin: { label: "Quản trị", description: "Toàn quyền, kể cả quản lý tài khoản và xem nhật ký." },
  publisher: { label: "Biên tập chính", description: "Sửa và xuất bản nội dung, tin tức; xử lý yêu cầu báo giá." },
  editor: { label: "Biên tập viên", description: "Sửa bản nháp, viết bài, tải ảnh. Không xuất bản được." },
  sales: { label: "Kinh doanh", description: "Chỉ xem và xử lý yêu cầu báo giá." },
};

export const isRole = (v: unknown): v is Role => typeof v === "string" && (roles as readonly string[]).includes(v);

export const permissionsOf = (role: Role): Permission[] => [...(grants[role] ?? [])];

export const can = (role: Role | undefined | null, perm: Permission) => Boolean(role && grants[role]?.includes(perm));

/** Login names: lowercase letters, digits, dot, dash, underscore; "admin" is the built-in owner. */
export const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,31}$/;
export const OWNER_USERNAME = "admin";
export const MIN_PASSWORD = 10;
