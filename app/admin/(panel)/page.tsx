import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { PageHeader, StatCard, ConnectNotice } from "@/components/admin/admin-ui";
import { formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

async function countRows(db: SupabaseClient, table: string): Promise<number> {
  const { count } = await db.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboard() {
  const db = getSupabaseAdmin();
  const configured = isDatabaseConfigured();

  let products = "—";
  let categories = "—";
  let subscribers = "—";
  let messages = "—";
  let net = "—";

  if (db) {
    try {
      const [p, c, s, m] = await Promise.all([
        countRows(db, "products"),
        countRows(db, "categories"),
        countRows(db, "newsletter_subscribers"),
        countRows(db, "contact_messages"),
      ]);
      products = String(p);
      categories = String(c);
      subscribers = String(s);
      messages = String(m);

      const { data: tx } = await db
        .from("finance_transactions")
        .select("type, amount");
      if (tx) {
        const sum = (t: string) =>
          tx
            .filter((r) => r.type === t)
            .reduce((a, r) => a + Number(r.amount), 0);
        net = formatPrice(sum("income") - sum("expense"));
      }
    } catch {
      /* tables not created yet — leave placeholders */
    }
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back — here's how ${BRAND.name} is doing.`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Products" value={products} />
        <StatCard label="Categories" value={categories} />
        <StatCard label="Subscribers" value={subscribers} />
        <StatCard label="Messages" value={messages} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Net (all time)" value={net} hint="Income minus expenses" />
      </div>

      {!configured && (
        <div className="mt-8">
          <ConnectNotice />
        </div>
      )}
    </>
  );
}
