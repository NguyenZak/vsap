import { handle, json } from "@/lib/cms/api";
import { audit } from "@/lib/cms/users";
import { getVisibility, setVisibility } from "@/lib/cms/visibility";

/** Is the website public? Any signed-in account may ask (Studio shows a badge when it isn't). */
export async function GET(req: Request) {
  return handle(req, "user", async () => json(await getVisibility()));
}

/** Open the website, or hide it behind "Coming soon" (admins only). Takes effect at once. */
export async function POST(req: Request) {
  return handle(req, "site", async (user) => {
    const body = (await req.json()) as { public?: unknown };
    if (typeof body.public !== "boolean") throw new Error("Thiếu giá trị công khai (true/false).");
    const next = await setVisibility(body.public, user.name || user.username);
    await audit(user, "site.visibility", body.public ? "public" : "coming-soon");
    return json(next);
  });
}
