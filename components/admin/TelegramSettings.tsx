"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, Send, Unplug, Users } from "lucide-react";
import { api, type TelegramChat, type TelegramStatus } from "./api";

const inputCls = "w-full rounded-lg border border-mist-200 bg-white px-3 py-2 text-sm outline-none focus:border-forest-600 focus:ring-2 focus:ring-sun-400/50";

function Step({ n, done, title, children }: { n: number; done: boolean; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${done ? "bg-forest-600 text-white" : "bg-mist-100 text-ink-600"}`}>
        {done ? <Check className="size-3.5" /> : n}
      </span>
      <div className="min-w-0 flex-1 pb-5">
        <p className="text-sm font-medium text-ink-900">{title}</p>
        <div className="mt-1.5 text-xs leading-relaxed text-ink-600">{children}</div>
      </div>
    </li>
  );
}

/** Connect quote-request alerts to a Telegram group: bot token → pick the group → test. */
export function TelegramSettings({ onChange }: { onChange?: (s: TelegramStatus) => void }) {
  const [status, setStatus] = useState<TelegramStatus | null>(null);
  const [token, setToken] = useState("");
  const [chats, setChats] = useState<TelegramChat[] | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const update = (s: TelegramStatus) => {
    setStatus(s);
    onChange?.(s);
  };
  useEffect(() => {
    api
      .telegram()
      .then(update)
      .catch((e: Error) => setError(e.message));
  }, []);

  const run = async (name: string, fn: () => Promise<void>) => {
    setBusy(name);
    setError("");
    setNote("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  const hasToken = Boolean(status?.tokenSource);
  const connected = Boolean(hasToken && status?.chat);

  return (
    <section className="rounded-2xl border border-mist-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-ink-900">Thông báo yêu cầu báo giá qua Telegram</h3>
          <p className="mt-1 text-sm text-ink-600">Mỗi khi khách gửi yêu cầu báo giá, nhóm Telegram được chọn sẽ nhận tin ngay, kèm nút mở trong Studio, WhatsApp và Zalo.</p>
        </div>
        {status && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.tokenSource && status.chat ? "bg-sun-400 text-forest-950" : "bg-mist-100 text-ink-600"}`}>
            {status.tokenSource && status.chat ? "Đang hoạt động" : "Chưa kết nối"}
          </span>
        )}
      </div>
      {!status && !error && <Loader2 className="mx-auto my-8 size-6 animate-spin text-ink-400" />}
      {status && (
        <ol className="mt-5">
          <Step n={1} done={hasToken} title="Tạo bot và dán token">
            {status.tokenSource === "secret" ? (
              <p>
                Đang dùng token từ secret <code className="font-mono">TELEGRAM_BOT_TOKEN</code> trên Cloudflare{status.bot && <> · bot <b className="text-ink-900">{status.bot}</b></>}.
              </p>
            ) : (
              <>
                {hasToken ? (
                  <p>
                    Đã kết nối bot <b className="text-ink-900">{status.bot ?? "(không kiểm tra được)"}</b>. Muốn đổi bot, dán token mới bên dưới.
                  </p>
                ) : (
                  <p>
                    Trong Telegram, nhắn <b className="text-ink-900">@BotFather</b> → gõ <code className="font-mono">/newbot</code> → đặt tên (ví dụ “VSAP Báo giá”) → BotFather gửi lại một token dạng <code className="font-mono">123456:ABC…</code>.
                  </p>
                )}
                <form
                  className="mt-2 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    run("token", async () => {
                      update(await api.telegramToken(token));
                      setToken("");
                      setChats(null);
                    });
                  }}
                >
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Dán token bot"
                    autoComplete="off"
                    spellCheck={false}
                    className={`font-mono ${inputCls}`}
                  />
                  <button type="submit" disabled={!token.trim() || busy === "token"} className="shrink-0 rounded-lg bg-forest-900 px-3 text-sm font-medium text-white hover:bg-forest-800 disabled:opacity-40">
                    {busy === "token" ? <Loader2 className="size-4 animate-spin" /> : "Lưu"}
                  </button>
                </form>
              </>
            )}
          </Step>

          <Step n={2} done={Boolean(status.chat)} title="Chọn nhóm nhận thông báo">
            {status.chat && (
              <p className="mb-2">
                Đang gửi tới <b className="text-ink-900">{status.chat.title}</b>.
              </p>
            )}
            <p>
              Tạo nhóm Telegram (ví dụ “VSAP – Báo giá”), thêm bot{status.bot ? <> <b className="text-ink-900">{status.bot}</b></> : ""} và các bạn kinh doanh vào nhóm, gửi một tin bất kỳ trong nhóm, rồi bấm “Tìm nhóm”.
            </p>
            <button
              type="button"
              disabled={!hasToken || busy === "discover"}
              onClick={() => run("discover", async () => setChats((await api.telegramDiscover()).chats))}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-mist-200 px-3 py-1.5 text-sm text-ink-900 hover:bg-mist-50 disabled:opacity-40"
            >
              {busy === "discover" ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Tìm nhóm
            </button>
            {chats && chats.length === 0 && (
              <p className="mt-2 rounded-lg bg-sun-500/10 px-3 py-2 text-ink-900">Chưa thấy nhóm nào. Kiểm tra bot đã ở trong nhóm, gửi thêm một tin trong nhóm rồi bấm “Tìm nhóm” lần nữa.</p>
            )}
            {chats && chats.length > 0 && (
              <ul className="mt-2 space-y-1">
                {chats.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      disabled={busy === "chat"}
                      onClick={() => run("chat", async () => update(await api.telegramChat(c)))}
                      className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${status.chat?.id === c.id ? "border-forest-600 bg-sun-400/15" : "border-mist-200 hover:bg-mist-50"}`}
                    >
                      <Users className="size-4 shrink-0 text-ink-400" />
                      <span className="min-w-0 flex-1 truncate text-ink-900">{c.title}</span>
                      <span className="text-[11px] text-ink-400">{c.type === "private" ? "cá nhân" : "nhóm"}</span>
                      {status.chat?.id === c.id && <Check className="size-4 text-forest-600" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Step>

          <Step n={3} done={false} title="Gửi tin thử">
            <button
              type="button"
              disabled={!connected || busy === "test"}
              onClick={() =>
                run("test", async () => {
                  await api.telegramTest();
                  setNote("Đã gửi. Kiểm tra nhóm Telegram trên điện thoại.");
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-sun-400 px-3 py-1.5 text-sm font-medium text-forest-950 hover:bg-sun-500 disabled:opacity-40"
            >
              {busy === "test" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Gửi tin thử
            </button>
          </Step>
        </ol>
      )}

      {note && <p className="rounded-lg bg-sun-400/30 px-3 py-2 text-sm text-forest-900">{note}</p>}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-chili-600">{error}</p>}

      {connected && status?.tokenSource === "studio" && (
        <div className="mt-2 border-t border-mist-200 pt-4">
          <button
            type="button"
            onClick={() => confirm("Ngắt kết nối Telegram? Yêu cầu báo giá vẫn được lưu trong Studio.") && run("disconnect", async () => update(await api.telegramDisconnect()))}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-ink-600 hover:bg-red-50 hover:text-chili-600"
          >
            <Unplug className="size-4" /> Ngắt kết nối
          </button>
        </div>
      )}
    </section>
  );
}
