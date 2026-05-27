import { PageHeader, ConnectNotice } from "@/components/admin/admin-ui";
import { ExportCsv } from "@/components/admin/export-csv";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Subscriber {
  email: string;
  status: string;
  created_at: string;
  [key: string]: string;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-sage/15 text-sage-dark",
  pending: "bg-oak/20 text-oak-dark",
  unsubscribed: "bg-linen text-mist",
};

export default async function AdminNewsletterPage() {
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Subscribers" description="Everyone who's signed up to hear when the shop opens." />
        <ConnectNotice />
      </>
    );
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from("newsletter_subscribers")
    .select("email, status, created_at")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Subscriber[];
  const confirmed = rows.filter((r) => r.status === "confirmed").length;
  const pending = rows.filter((r) => r.status === "pending").length;
  const unsubscribed = rows.filter((r) => r.status === "unsubscribed").length;

  return (
    <>
      <PageHeader
        title="Subscribers"
        description={
          rows.length === 0
            ? "Everyone who's signed up to hear when the shop opens."
            : `${confirmed} confirmed · ${pending} pending · ${unsubscribed} unsubscribed`
        }
        action={
          <ExportCsv
            rows={rows}
            columns={["email", "status", "created_at"]}
            filename="the-myrtle-turtle-subscribers.csv"
          />
        }
      />

      {rows.length === 0 ? (
        <p className="rounded-card border border-dashed border-line-strong bg-shell px-6 py-10 text-center text-stone">
          No subscribers yet — they&apos;ll appear here as people join the list.
        </p>
      ) : (
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-left text-[0.95rem]">
            <thead className="bg-shell text-[0.72rem] uppercase tracking-[0.14em] text-mist">
              <tr>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} className="border-t border-line">
                  <td className="px-5 py-3 text-ink">{r.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold capitalize",
                        STATUS_STYLES[r.status] ?? "bg-linen text-stone"
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-stone">
                    {new Date(r.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
