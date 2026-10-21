import { handle, json } from "@/lib/cms/api";
import { deleteInquiry, inquiriesCsv, inquiryCounts, listInquiries, updateInquiry } from "@/lib/cms/inquiries";
import { inquiryStatusInfo } from "@/lib/cms/inquiry-format";
import { audit } from "@/lib/cms/users";

/** List (with counts per status), or ?format=csv to download everything matching the filter. */
export async function GET(req: Request) {
  return handle(req, "inquiries", async (user) => {
    const q = new URL(req.url).searchParams;
    const filter = { status: q.get("status") || undefined, q: q.get("q")?.trim() || undefined };
    if (q.get("format") === "csv") {
      const items = await listInquiries({ ...filter, limit: 2000 });
      await audit(user, "inquiry.export", `${items.length} yêu cầu`);
      const date = new Date().toISOString().slice(0, 10);
      return new Response(inquiriesCsv(items), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="vsap-yeu-cau-bao-gia-${date}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }
    const [items, counts] = await Promise.all([listInquiries(filter), inquiryCounts()]);
    return json({ items, counts });
  });
}

export async function PATCH(req: Request) {
  return handle(req, "inquiries", async (user) => {
    const { id, status, note } = (await req.json()) as { id?: number; status?: unknown; note?: unknown };
    const { inquiry, before } = await updateInquiry(Number(id), { status, note }, user.username);
    if (before.status !== inquiry.status) {
      await audit(user, "inquiry.status", `#${inquiry.id} ${inquiry.data.name}`, `${inquiryStatusInfo[before.status].label} → ${inquiryStatusInfo[inquiry.status].label}`);
    }
    return json({ inquiry });
  });
}

export async function DELETE(req: Request) {
  return handle(req, "inquiries", async (user) => {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) throw new Error("Missing id");
    await deleteInquiry(id);
    await audit(user, "inquiry.delete", `#${id}`);
    return json({ ok: true });
  });
}
