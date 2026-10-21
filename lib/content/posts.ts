// Mười bài viết mẫu cho mục Tin tức, song ngữ, viết theo hướng SEO/GEO: trả lời
// ngắn ở đầu bài, tiêu đề dạng câu hỏi, danh sách, mục "Câu hỏi thường gặp"
// (sinh FAQPage) và nguồn tham khảo. Được nạp một lần vào D1 dưới dạng bản nháp
// (lib/cms/posts.ts › seedSamplePosts); xuất bản từng bài trong Studio sau khi duyệt.
import type { Post } from "../cms/types";
import { posts1 } from "./posts-1";
import { posts2 } from "./posts-2";

export const samplePosts: Post[] = [...posts1, ...posts2];
