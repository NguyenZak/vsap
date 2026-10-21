// Telegram alerts for new quote requests, so sales see them on their phones in
// seconds. The bot token comes from the Worker secret TELEGRAM_BOT_TOKEN if set,
// otherwise from Studio (stored in D1, never sent back to the browser). The
// target chat is picked in Studio from the groups the bot has been added to.
import { env } from "cloudflare:workers";
import { db } from "./db";
import { esc, inquiryAlert, type InquiryAlert } from "./telegram-format";

const KEY = "notify:telegram";

type Config = { token?: string; chatId?: string; chatTitle?: string };
export type TelegramStatus = { tokenSource: "secret" | "studio" | null; bot: string | null; chat: { id: string; title: string } | null };
export type TelegramChat = { id: string; title: string; type: string };

async function readConfig(): Promise<Config> {
  const row = await (await db()).prepare("SELECT data FROM cms_documents WHERE key = ?").bind(KEY).first<{ data: string }>();
  return row ? (JSON.parse(row.data) as Config) : {};
}

async function writeConfig(config: Config) {
  await (await db())
    .prepare("INSERT INTO cms_documents (key, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
    .bind(KEY, JSON.stringify(config), Date.now())
    .run();
}

const secretToken = () => {
  const t = (env as unknown as { TELEGRAM_BOT_TOKEN?: string }).TELEGRAM_BOT_TOKEN;
  return typeof t === "string" && t ? t : null;
};

const TOKEN_RE = /^\d{5,}:[\w-]{30,}$/;

class TelegramError extends Error {
  constructor(
    message: string,
    readonly migrateTo?: number,
  ) {
    super(message);
  }
}

async function call<T>(token: string, method: string, body: unknown = {}): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; result?: T; description?: string; parameters?: { migrate_to_chat_id?: number } };
  if (!data.ok) throw new TelegramError(`Telegram: ${data.description ?? res.status}`, data.parameters?.migrate_to_chat_id);
  return data.result as T;
}

async function token() {
  const t = secretToken() ?? (await readConfig()).token;
  if (!t) throw new Error("Chưa có token bot Telegram.");
  return t;
}

export async function telegramStatus(): Promise<TelegramStatus> {
  const config = await readConfig();
  const t = secretToken() ?? config.token ?? null;
  let bot: string | null = null;
  if (t) bot = await call<{ username: string }>(t, "getMe").then((me) => `@${me.username}`, () => null);
  return {
    tokenSource: secretToken() ? "secret" : config.token ? "studio" : null,
    bot,
    chat: config.chatId ? { id: config.chatId, title: config.chatTitle ?? config.chatId } : null,
  };
}

/** Check the token with Telegram before saving it. */
export async function saveToken(input: unknown) {
  if (secretToken()) throw new Error("Token đang được đặt bằng secret TELEGRAM_BOT_TOKEN trên Cloudflare.");
  const t = typeof input === "string" ? input.trim() : "";
  if (!TOKEN_RE.test(t)) throw new Error("Token không đúng định dạng. Token có dạng 123456789:ABC… (lấy từ @BotFather).");
  const me = await call<{ username: string }>(t, "getMe").catch(() => {
    throw new Error("Telegram không nhận token này. Hãy kiểm tra lại với @BotFather.");
  });
  // A new bot can't post to the old bot's chat, so start the chat choice over.
  await writeConfig({ token: t });
  return `@${me.username}`;
}

/** Groups and people that have recently interacted with the bot (added it, or messaged it). */
export async function discoverChats(): Promise<TelegramChat[]> {
  type Chat = { id: number; title?: string; first_name?: string; last_name?: string; username?: string; type: string };
  type Update = { message?: { chat: Chat }; my_chat_member?: { chat: Chat; new_chat_member?: { status: string } }; channel_post?: { chat: Chat } };
  const updates = await call<Update[]>(await token(), "getUpdates", { allowed_updates: ["message", "my_chat_member", "channel_post"], limit: 100 });
  const chats = new Map<string, TelegramChat>();
  for (const u of updates) {
    // Skip chats the bot was removed from.
    const left = u.my_chat_member && ["left", "kicked"].includes(u.my_chat_member.new_chat_member?.status ?? "");
    const chat = u.message?.chat ?? u.my_chat_member?.chat ?? u.channel_post?.chat;
    if (!chat) continue;
    const id = String(chat.id);
    if (left) {
      chats.delete(id);
      continue;
    }
    const title = chat.title ?? ([chat.first_name, chat.last_name].filter(Boolean).join(" ") || (chat.username ? `@${chat.username}` : id));
    chats.set(id, { id, title, type: chat.type });
  }
  return [...chats.values()];
}

export async function selectChat(chatId: unknown, title: unknown) {
  const id = String(chatId ?? "");
  if (!/^-?\d+$/.test(id)) throw new Error("Mã nhóm không hợp lệ.");
  const config = await readConfig();
  await writeConfig({ ...config, chatId: id, chatTitle: String(title ?? id).slice(0, 120) });
}

export async function disconnect() {
  await writeConfig({});
}

/** Send to the configured chat, following a group → supergroup upgrade if Telegram reports one. */
async function send(text: string, buttons: { text: string; url: string }[][]) {
  const config = await readConfig();
  const t = secretToken() ?? config.token;
  if (!t || !config.chatId) return false;
  const body = (chat_id: string) => ({
    chat_id,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    ...(buttons.length ? { reply_markup: { inline_keyboard: buttons } } : {}),
  });
  try {
    await call(t, "sendMessage", body(config.chatId));
  } catch (e) {
    if (!(e instanceof TelegramError) || !e.migrateTo) throw e;
    const chatId = String(e.migrateTo);
    await writeConfig({ ...config, chatId });
    await call(t, "sendMessage", body(chatId));
  }
  return true;
}

export async function notifyInquiry(inq: InquiryAlert, origin: string) {
  const { text, buttons } = inquiryAlert(inq, origin);
  return send(text, buttons);
}

export async function sendTest(origin: string, by: string) {
  const sent = await send(`✅ <b>VSAP Studio</b>\nThông báo yêu cầu báo giá đã được kết nối với nhóm này.\nGửi thử bởi ${esc(by)}.`, [[{ text: "Mở hộp thư báo giá", url: `${origin}/admin?view=inbox` }]]);
  if (!sent) throw new Error("Chưa chọn nhóm nhận thông báo.");
}
