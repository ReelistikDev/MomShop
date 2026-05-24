import { PageHeader, ConnectNotice } from "@/components/admin/admin-ui";
import { ExportCsv } from "@/components/admin/export-csv";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
    .select("email, created_at")
    .order("created_at", { ascending: false });
  const rows = data ?? [];

  return (
    <>
      <PageHeader
        title="Subscribers"
        description={`${rows.length} ${rows.length === 1 ? "person has" : "people have"} signed up.`}
        action={
          <ExportCsv
            rows={rows}
            columns={["email", "created_at"]}
            filename="willow-and-wren-subscribers.csv"
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
                <th className="px-5 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} className="border-t border-line">
                  <td className="px-5 py-3 text-ink">{r.email}</td>
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
