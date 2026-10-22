// Mười bài viết mẫu cho mục Tin tức, song ngữ, viết theo hướng SEO/GEO: trả lời
// ngắn ở đầu bài, tiêu đề dạng câu hỏi, danh sách, mục "Câu hỏi thường gặp"
// (sinh FAQPage) và nguồn tham khảo. Được nạp một lần vào D1 dưới dạng bản nháp
// (lib/cms/posts.ts › seedSamplePosts); xuất bản từng bài trong Studio sau khi duyệt.
import type { Post } from "../cms/types";
import { posts1 } from "./posts-1";
import { posts2 } from "./posts-2";

/** A post written in Vietnamese and English only (the samples predate Chinese). */
export type SeedPost = Bilingual<Post>;
type Bilingual<T> = T extends { vi: string; zh: string } ? Omit<T, "zh"> : T extends object ? { [K in keyof T]: Bilingual<T[K]> } : T;

/** Adds an empty Chinese text next to every vi/en pair, so the post stays hidden on /zh until translated. */
function withZh<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withZh) as T;
  if (!value || typeof value !== "object") return value;
  const out = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withZh(v)]));
  return ("vi" in out && "en" in out && !("zh" in out) ? { ...out, zh: "" } : out) as T;
}

export const samplePosts: Post[] = [...posts1, ...posts2].map((p) => withZh(p) as unknown as Post);
