import { PageHeader, StatCard, ConnectNotice } from "@/components/admin/admin-ui";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { formatPrice, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface OrderItem {
  name: string;
  unit_price: number | string;
  quantity: number;
  engraving: string | null;
}

interface Order {
  id: string;
  status: "pending" | "paid" | "failed";
  customer_name: string;
  customer_email: string;
  ship_line1: string | null;
  ship_line2: string | null;
  ship_city: string | null;
  ship_state: string | null;
  ship_postal: string | null;
  subtotal: number | string;
  shipping: number | string;
  tax: number | string;
  total: number | string;
  square_receipt_url: string | null;
  created_at: string;
}

const STATUS_STYLES: Record<Order["status"], string> = {
  paid: "bg-sage/15 text-sage-dark",
  pending: "bg-oak/15 text-oak-dark",
  failed: "bg-heart/15 text-heart",
};

function shippingLine(o: Order): string {
  const parts = [
    o.ship_line1,
    o.ship_line2,
    [o.ship_city, o.ship_state].filter(Boolean).join(", "),
    o.ship_postal,
  ].filter(Boolean);
  return parts.join(" · ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminOrdersPage() {
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Orders" description="Orders placed through your shop." />
        <ConnectNotice />
      </>
    );
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from("orders")
    .select(
      "id, status, customer_name, customer_email, ship_line1, ship_line2, ship_city, ship_state, ship_postal, subtotal, shipping, tax, total, square_receipt_url, created_at, order_items(name, unit_price, quantity, engraving)"
    )
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as (Order & { order_items: OrderItem[] })[];
  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <>
      <PageHeader
        title="Orders"
        description={
          orders.length === 0
            ? "Orders placed through your shop."
            : `${paid.length} paid · ${orders.length} total`
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Paid orders" value={String(paid.length)} />
        <StatCard label="Revenue (paid)" value={formatPrice(revenue)} hint="Includes shipping + tax" />
        <StatCard label="All orders" value={String(orders.length)} />
      </div>

      {orders.length === 0 ? (
        <p className="rounded-card border border-dashed border-line-strong bg-shell px-6 py-10 text-center text-stone">
          No orders yet — paid orders from checkout will appear here.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className={cn(
                "rounded-card border bg-shell px-5 py-4",
                o.status === "paid" ? "border-line" : "border-line opacity-80"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">
                    {o.customer_name}{" "}
                    <span
                      className={cn(
                        "ml-1 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em]",
                        STATUS_STYLES[o.status]
                      )}
                    >
                      {o.status}
                    </span>
                  </p>
                  <a
                    href={`mailto:${o.customer_email}`}
                    className="text-[0.88rem] text-sage-dark hover:underline"
                  >
                    {o.customer_email}
                  </a>
                </div>
                <div className="text-right">
                  <time className="block text-[0.8rem] text-mist">{formatDate(o.created_at)}</time>
                  <span className="font-mono text-[0.72rem] text-mist">#{o.id.slice(0, 8)}</span>
                </div>
              </div>

              {shippingLine(o) && (
                <p className="mt-2 text-[0.85rem] text-stone">{shippingLine(o)}</p>
              )}

              <ul className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-[0.92rem]">
                {o.order_items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="text-stone">
                      {it.name}
                      <span className="text-mist"> × {it.quantity}</span>
                      {it.engraving && (
                        <span className="text-mist"> · “{it.engraving}”</span>
                      )}
                    </span>
                    <span className="tabular-nums text-stone">
                      {formatPrice(Number(it.unit_price) * it.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-[0.88rem]">
                <Row label="Subtotal" value={formatPrice(Number(o.subtotal))} />
                <Row
                  label="Shipping"
                  value={Number(o.shipping) === 0 ? "Free" : formatPrice(Number(o.shipping))}
                />
                <Row label="Tax" value={formatPrice(Number(o.tax))} />
                <div className="mt-1 flex justify-between border-t border-line pt-2 font-medium text-ink">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPrice(Number(o.total))}</span>
                </div>
              </div>

              {o.square_receipt_url && (
                <a
                  href={o.square_receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[0.85rem] font-medium text-sage-dark hover:text-ink"
                >
                  View Square receipt →
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-stone">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
