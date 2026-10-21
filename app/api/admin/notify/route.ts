import { handle, json } from "@/lib/cms/api";
import { disconnect, discoverChats, saveToken, selectChat, sendTest, telegramStatus } from "@/lib/cms/notify";
import { audit } from "@/lib/cms/users";

/** Telegram alert settings (admins only). */
export async function GET(req: Request) {
  return handle(req, "users", async () => json(await telegramStatus()));
}

type Body = { action?: string; token?: unknown; chatId?: unknown; title?: unknown };

export async function POST(req: Request) {
  return handle(req, "users", async (user) => {
    const body = (await req.json()) as Body;
    switch (body.action) {
      case "token": {
        const bot = await saveToken(body.token);
        await audit(user, "notify.token", bot);
        break;
      }
      case "discover":
        return json({ chats: await discoverChats() });
      case "chat":
        await selectChat(body.chatId, body.title);
        await audit(user, "notify.chat", String(body.title ?? body.chatId));
        break;
      case "test":
        await sendTest(new URL(req.url).origin, user.name);
        return json({ ok: true });
      case "disconnect":
        await disconnect();
        await audit(user, "notify.disconnect", "telegram");
        break;
      default:
        throw new Error("Unknown action");
    }
    return json(await telegramStatus());
  });
}
