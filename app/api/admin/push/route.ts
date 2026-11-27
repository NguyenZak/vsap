import { handle, json } from "@/lib/cms/api";
import { postPath } from "@/lib/cms/post-format";
import { getPostAdmin } from "@/lib/cms/posts";
import {
  STAFF_TOPICS,
  notifyUser,
  notifyVisitors,
  parseSubscription,
  publicKey,
  staffTopicsOf,
  subscribeStaff,
  subscriberCounts,
  topicPermission,
} from "@/lib/cms/push";
import { can } from "@/lib/cms/roles";
import { getContent } from "@/lib/cms/store";
import { audit } from "@/lib/cms/users";
import type { L } from "@/lib/cms/types";

type Body = { action?: string; subscription?: unknown; endpoint?: unknown; topics?: unknown; title?: unknown; body?: unknown; url?: unknown; postId?: unknown };

const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/** Pick a language with a Vietnamese fallback. */
const pickL = (v: Partial<L> | undefined, locale: string) => (v?.[locale as keyof L] || v?.vi || "").trim();

/**
 * Studio push notifications.
 *  - status / subscribe / test: any signed-in user, for their own device and the topics their role allows
 *  - counts / broadcast / post: publishers, to message website visitors who opted in
 */
export async function POST(req: Request) {
  return handle(req, "user", async (user) => {
    const b = (await req.json()) as Body;
    const allowed = STAFF_TOPICS.filter((t) => can(user.role, topicPermission[t]));

    switch (b.action) {
      case "status":
        return json({ publicKey: await publicKey(), allowed, topics: typeof b.endpoint === "string" ? await staffTopicsOf(b.endpoint, user.id) : [] });

      case "subscribe": {
        const sub = parseSubscription(b.subscription);
        if (!sub) throw new Error("Thiết bị không gửi được thông tin đăng ký.");
        const topics = await subscribeStaff(sub, b.topics, user);
        await audit(user, "push.device", topics.length ? topics.join(", ") : "tắt");
        return json({ allowed, topics: topics.filter((t) => (allowed as string[]).includes(t)) });
      }

      case "test": {
        const { sent } = await notifyUser(user.id, { title: "VSAP Studio", body: `Thông báo thử cho ${user.name}. Thiết bị này đã nhận được thông báo.`, url: "/admin", tag: "test" });
        if (!sent) throw new Error("Chưa gửi được: thiết bị chưa bật thông báo hoặc dịch vụ thông báo của trình duyệt từ chối.");
        return json({ sent });
      }
    }

    if (!can(user.role, "content.publish")) throw new Error("Chỉ Biên tập chính và Quản trị gửi được thông báo cho khách.");

    switch (b.action) {
      case "counts":
        return json(await subscriberCounts());

      case "broadcast": {
        const title = text(b.title, 80);
        const body = text(b.body, 200);
        const url = text(b.url, 300) || "/";
        if (!title || !body) throw new Error("Cần có tiêu đề và nội dung.");
        if (!url.startsWith("/") || url.startsWith("//")) throw new Error("Đường dẫn phải bắt đầu bằng /, ví dụ /products.");
        // A path without a language goes to the subscriber's language: /products → /vi/products.
        const localized = (locale: string) => (/^\/(vi|en|zh|ja|ko)(\/|$)/.test(url) ? url : `/${locale}${url === "/" ? "" : url}`);
        const result = await notifyVisitors("broadcast", (locale) => ({ title, body, url: localized(locale), tag: "broadcast" }));
        await audit(user, "push.broadcast", title, `${result.sent} thiết bị`);
        return json(result);
      }

      case "post": {
        const record = await getPostAdmin(text(b.postId, 64));
        const post = record.published;
        if (!post) throw new Error("Bài chưa xuất bản, chưa gửi thông báo được.");
        const { categories } = await getContent();
        const result = await notifyVisitors("news", (locale) => {
          const title = pickL(post.title, locale);
          if (!title) return null;
          const lang = post.title[locale as keyof L]?.trim() ? locale : "vi";
          return { title, body: pickL(post.excerpt, locale).slice(0, 180), url: `/${lang}${postPath(post, categories)}`, tag: `post-${post.slug}`.slice(0, 32) };
        });
        await audit(user, "push.post", post.slug, `${result.sent} thiết bị`);
        return json(result);
      }
    }
    throw new Error("Unknown action");
  });
}
