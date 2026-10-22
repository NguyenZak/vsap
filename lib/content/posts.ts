// Bài viết mẫu cho Tin tức và Sức khỏe và đời sống, song ngữ, viết theo hướng SEO/GEO: trả lời
// ngắn ở đầu bài, tiêu đề dạng câu hỏi, danh sách, mục "Câu hỏi thường gặp"
// (sinh FAQPage) và nguồn tham khảo. Được nạp một lần vào D1 dưới dạng bản nháp
// (lib/cms/posts.ts › seedSamplePosts); xuất bản từng bài trong Studio sau khi duyệt.
import type { Post } from "../cms/types";
import { emptyL } from "../locales";
import { posts1 } from "./posts-1";
import { posts2 } from "./posts-2";
import { posts3 } from "./posts-3";

/** A post written in Vietnamese and English only (the samples predate the other languages). */
export type SeedPost = Bilingual<Post>;
type Bilingual<T> = T extends { vi: string; en: string } ? Pick<T, "vi" | "en"> : T extends object ? { [K in keyof T]: Bilingual<T[K]> } : T;

/** Gives every vi/en text empty values for the other languages, so the post stays hidden there until translated. */
function withAllLocales<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withAllLocales) as T;
  if (!value || typeof value !== "object") return value;
  const out = Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withAllLocales(v)]));
  return ("vi" in out && "en" in out ? { ...emptyL(), ...out } : out) as T;
}

export const samplePosts: Post[] = [...posts1, ...posts2, ...posts3].map((p) => withAllLocales(p) as unknown as Post);

/** Samples added after the first batch was loaded, inserted once into databases that already had it. */
export const SECOND_BATCH = posts3.map((p) => p.slug);
