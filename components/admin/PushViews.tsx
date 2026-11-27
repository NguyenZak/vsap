"use client";

// Studio push notifications: the per-device settings dialog (any account, opened
// from the avatar menu) and the "Gửi thông báo" view where publishers message
// visitors who opted in on the website.
import { useEffect, useState } from "react";
import { BellRing, Loader2, Send, X } from "lucide-react";
import { currentSubscription, pushSupport, subscribe, type PushSupport } from "@/lib/push-client";
import { api } from "./api";

const TOPIC_INFO: Record<string, { label: string; help: string }> = {
  orders: { label: "Đơn hàng mới", help: "Khách đặt hàng qua giỏ hàng trên website." },
  inquiries: { label: "Yêu cầu báo giá mới", help: "Khách gửi form báo giá / liên hệ." },
  drafts: { label: "Bản nháp chờ xuất bản", help: "Biên tập viên sửa nội dung hoặc bài viết (tối đa 1 lần mỗi giờ cho mỗi người)." },
};

const supportNote: Record<Exclude<PushSupport, "ok">, string> = {
  unsupported: "Trình duyệt này chưa hỗ trợ thông báo đẩy. Hãy dùng Chrome, Edge, Firefox hoặc Safari bản mới.",
  "ios-install": "Trên iPhone/iPad: mở website bằng Safari, bấm Chia sẻ › Thêm vào Màn hình chính, mở VSAP từ màn hình chính, đăng nhập Studio rồi bật thông báo ở đây.",
  denied: "Trình duyệt đang chặn thông báo của website này. Mở cài đặt trang (biểu tượng ổ khoá cạnh địa chỉ) › Thông báo › Cho phép, rồi thử lại.",
};

/** Turn this device's Studio alerts on/off and pick the topics. */
export function PushSettings({ onClose }: { onClose: () => void }) {
  const [support, setSupport] = useState<PushSupport>("ok");
  const [allowed, setAllowed] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [active, setActive] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSupport(pushSupport());
    (async () => {
      try {
        const sub = await currentSubscription();
        const status = await api.push({ action: "status", endpoint: sub?.endpoint });
        setAllowed(status.allowed);
        setActive(status.topics);
        setTopics(status.topics.length ? status.topics : status.allowed);
      } catch (e) {
        setMessage((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async (wanted: string[]) => {
    setBusy(true);
    setMessage("");
    try {
      const sub = wanted.length ? await subscribe() : (await currentSubscription())?.toJSON();
      if (!sub) {
        setSupport(pushSupport());
        if (wanted.length) setMessage("Chưa được phép gửi thông báo trên thiết bị này.");
        return;
      }
      const res = await api.push({ action: "subscribe", subscription: sub, topics: wanted });
      setActive(res.topics);
      setMessage(res.topics.length ? "Đã bật thông báo trên thiết bị này." : "Đã tắt thông báo Studio trên thiết bị này.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setBusy(true);
    setMessage("");
    try {
      await api.push<{ sent: number }>({ action: "test" });
      setMessage("Đã gửi thông báo thử. Nếu không thấy, kiểm tra chế độ Không làm phiền / Tập trung của máy.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Thông báo đẩy" className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-medium text-ink-900">
              <BellRing className="size-5 text-forest-600" /> Thông báo đẩy
            </h2>
            <p className="mt-1 text-sm text-ink-600">Nhận báo ngay trên thiết bị này (điện thoại hoặc máy tính), kể cả khi không mở Studio. Mỗi thiết bị bật riêng.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-1 text-ink-600 hover:bg-mist-100">
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <Loader2 className="mx-auto mt-8 size-6 animate-spin text-forest-600" />
        ) : support !== "ok" && !active.length ? (
          <p className="mt-5 rounded-xl bg-mist-50 p-4 text-sm leading-relaxed text-ink-600">{supportNote[support as Exclude<PushSupport, "ok">]}</p>
        ) : !allowed.length ? (
          <p className="mt-5 rounded-xl bg-mist-50 p-4 text-sm text-ink-600">Vai trò của bạn chưa có loại thông báo nào.</p>
        ) : (
          <>
            <fieldset className="mt-5 space-y-2">
              <legend className="mb-2 text-xs font-medium tracking-wider text-ink-400 uppercase">Báo cho tôi khi có</legend>
              {allowed.map((t) => (
                <label key={t} className="flex cursor-pointer items-start gap-3 rounded-xl border border-mist-200 p-3 has-[:checked]:border-forest-600 has-[:checked]:bg-forest-600/5">
                  <input
                    type="checkbox"
                    checked={topics.includes(t)}
                    onChange={(e) => setTopics(e.target.checked ? [...topics, t] : topics.filter((x) => x !== t))}
                    className="mt-0.5 size-4 accent-forest-900"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink-900">{TOPIC_INFO[t]?.label ?? t}</span>
                    <span className="block text-xs text-ink-400">{TOPIC_INFO[t]?.help}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="mt-4 text-xs text-ink-400">
              Trạng thái: {active.length ? <span className="font-medium text-forest-600">đang bật ({active.map((t) => TOPIC_INFO[t]?.label ?? t).join(", ")})</span> : "đang tắt trên thiết bị này"}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => save(topics)}
                disabled={busy || !topics.length}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-forest-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-50"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <BellRing className="size-4" />} {active.length ? "Lưu" : "Bật thông báo"}
              </button>
              {active.length > 0 && (
                <>
                  <button type="button" onClick={test} disabled={busy} className="rounded-lg border border-mist-200 px-4 py-2.5 text-sm text-ink-900 hover:bg-mist-50 disabled:opacity-50">
                    Gửi thử
                  </button>
                  <button type="button" onClick={() => save([])} disabled={busy} className="rounded-lg px-4 py-2.5 text-sm text-chili-600 hover:bg-chili-600/5 disabled:opacity-50">
                    Tắt
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {message && <p className="mt-4 text-sm text-ink-600">{message}</p>}
      </div>
    </div>
  );
}

type Counts = { news: number; broadcast: number; staff: number };

/** Publishers: write a notification to every visitor who opted in. */
export function PushView() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/products");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => api.push<Counts>({ action: "counts" }).then(setCounts).catch((e) => setMessage((e as Error).message));
  useEffect(() => {
    load();
  }, []);

  const send = async () => {
    if (!confirm(`Gửi thông báo “${title}” tới ${counts?.broadcast ?? 0} thiết bị đã đăng ký? Không thu hồi được sau khi gửi.`)) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await api.push<{ sent: number; failed: number }>({ action: "broadcast", title, body, url });
      setMessage(`Đã gửi tới ${res.sent} thiết bị${res.failed ? `, ${res.failed} thiết bị lỗi` : ""}.`);
      setTitle("");
      setBody("");
      load();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const input = "mt-1 w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-600";
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-mist-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <h2 className="text-xl font-medium text-ink-900">Gửi thông báo</h2>
          <p className="mt-1 text-sm text-ink-600">
            Gửi tới khách đã bấm “Nhận thông báo” ở chân trang website. Bài viết mới gửi bằng nút “Gửi thông báo” trong mục Tin tức. Khách đặt hàng được báo tự động khi đổi trạng thái đơn.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ["Nhận ưu đãi & thông báo", counts?.broadcast],
            ["Nhận tin bài mới", counts?.news],
            ["Thiết bị nhân viên", counts?.staff],
          ].map(([label, n]) => (
            <div key={label as string} className="rounded-xl border border-mist-200 bg-white p-4">
              <p className="text-2xl font-medium text-ink-900 tabular-nums">{n ?? "–"}</p>
              <p className="mt-1 text-xs text-ink-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-mist-200 bg-white p-5">
          <label className="block">
            <span className="text-xs font-medium text-ink-900">Tiêu đề</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="VD: Hạt điều rang củi mùa mới đã về" className={input} />
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-ink-900">Nội dung</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={200} rows={3} placeholder="Một hai câu ngắn; dài quá điện thoại sẽ cắt bớt." className={input} />
            <span className="mt-1 block text-right text-[11px] text-ink-400">{body.length}/200</span>
          </label>
          <label className="mt-2 block">
            <span className="text-xs font-medium text-ink-900">Mở trang khi bấm vào</span>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/products" className={input} />
            <span className="mt-1 block text-[11px] text-ink-400">Đường dẫn trên website, ví dụ /products hoặc /products/cashew. Không ghi ngôn ngữ thì mở theo ngôn ngữ khách đã chọn.</span>
          </label>

          {(title || body) && (
            <div className="mt-5 rounded-xl bg-mist-50 p-3">
              <p className="mb-2 text-[11px] font-medium tracking-wider text-ink-400 uppercase">Xem trước</p>
              <div className="flex gap-3 rounded-xl bg-white p-3 shadow-sm">
                <img src="/icon-512.png" alt="" className="size-9 rounded-lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{title || "Tiêu đề"}</p>
                  <p className="line-clamp-2 text-xs text-ink-600">{body || "Nội dung"}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={send}
            disabled={busy || !title.trim() || !body.trim() || !counts?.broadcast}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-50"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Gửi tới {counts?.broadcast ?? 0} thiết bị
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-400">Thông báo gửi một lần cho tất cả, không chọn ngôn ngữ. Chỉ gửi nội dung khách đã đồng ý nhận (tin tức, ưu đãi), đừng gửi dồn dập.</p>
          {message && <p className="mt-3 text-sm text-ink-900">{message}</p>}
        </div>
      </div>
    </div>
  );
}

/** "Gửi thông báo" for a published post (Tin tức view). */
export async function sendPostPush(postId: string, title: string) {
  if (!confirm(`Gửi thông báo bài “${title}” tới khách đã đăng ký nhận tin bài mới?`)) return null;
  return api.push<{ sent: number; failed: number }>({ action: "post", postId });
}
