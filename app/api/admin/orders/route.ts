import { handle, json } from "@/lib/cms/api";
import { orderStatusInfo } from "@/lib/cms/order-format";
import { deleteOrder, listOrders, orderCounts, updateOrder } from "@/lib/cms/orders";
import { audit } from "@/lib/cms/users";

/** List orders (with counts per status). Sales staff handle orders with the same permission as quote requests. */
export async function GET(req: Request) {
  return handle(req, "inquiries", async () => {
    const q = new URL(req.url).searchParams;
    const filter = { status: q.get("status") || undefined, q: q.get("q")?.trim() || undefined };
    const [items, counts] = await Promise.all([listOrders(filter), orderCounts()]);
    return json({ items, counts });
  });
}

export async function PATCH(req: Request) {
  return handle(req, "inquiries", async (user) => {
    const { id, status, note } = (await req.json()) as { id?: number; status?: unknown; note?: unknown };
    const { order, before } = await updateOrder(Number(id), { status, note }, user.username);
    if (before.status !== order.status) {
      await audit(user, "order.status", `#${order.id} ${order.data.customer.name}`, `${orderStatusInfo[before.status].label} → ${orderStatusInfo[order.status].label}`);
    }
    return json({ order });
  });
}

export async function DELETE(req: Request) {
  return handle(req, "inquiries", async (user) => {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) throw new Error("Missing id");
    await deleteOrder(id);
    await audit(user, "order.delete", `#${id}`);
    return json({ ok: true });
  });
}
