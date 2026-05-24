import { PageHeader, ConnectNotice, StatCard } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/button";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { isMailConfigured } from "@/lib/mailer";
import { cn } from "@/lib/utils";
import { sendBroadcast } from "./actions";

export const dynamic = "force-dynamic";

interface Broadcast {
  id: string;
  subject: string;
  status: string;
  recipient_count: number;
  sent_count: number;
  sent_at: string | null;
  created_at: string;
}

const field =
  "w-full rounded-xl border border-line-strong bg-cream px-3.5 py-3 text-ink placeholder:text-mist focus:border-oak focus:outline-none";

export default async function AdminBroadcastsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Broadcasts" description="Email your confirmed subscribers." />
        <ConnectNotice />
      </>
    );
  }

  const db = getSupabaseAdmin()!;
  const [{ count }, { data }] = await Promise.all([
    db
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed"),
    db.from("broadcasts").select("*").order("created_at", { ascending: false }),
  ]);
  const confirmed = count ?? 0;
  const broadcasts = (data ?? []) as Broadcast[];
  const mailOk = isMailConfigured();

  return (
    <>
      <PageHeader
        title="Broadcasts"
        description="Write an announcement and send it to everyone who's confirmed."
      />

      {!mailOk && (
        <div className="mb-6 rounded-card border border-dashed border-oak/50 bg-shell px-5 py-4 text-[0.92rem] text-stone">
          Email sending isn&apos;t configured yet. Add your Resend settings
          (<code className="rounded bg-linen px-1.5 py-0.5 font-mono text-[0.8rem]">RESEND_API_KEY</code>,{" "}
          <code className="rounded bg-linen px-1.5 py-0.5 font-mono text-[0.8rem]">MAIL_FROM</code>,{" "}
          <code className="rounded bg-linen px-1.5 py-0.5 font-mono text-[0.8rem]">APP_URL</code>) to{" "}
          <code className="rounded bg-linen px-1.5 py-0.5 font-mono text-[0.8rem]">.env.local</code> and Vercel.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Confirmed subscribers" value={confirmed} hint="Who broadcasts go to" />
        <StatCard label="Broadcasts sent" value={broadcasts.filter((b) => b.status === "sent").length} />
      </div>

      {/* Compose */}
      <form action={sendBroadcast} className="mb-10 flex flex-col gap-4 rounded-card border border-line bg-shell p-6">
        <div>
          <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-mist">Subject</label>
          <input name="subject" required placeholder="e.g. The shop is open!" className={cn(field, "mt-1.5 h-11")} />
        </div>
        <div>
          <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-mist">Message</label>
          <textarea name="body" required rows={8} placeholder={"Write your announcement…\n\nBlank lines start new paragraphs."} className={cn(field, "mt-1.5")} />
        </div>
        <div className="flex items-center gap-4">
          <ActionButton type="submit" variant="primary" size="lg" disabled={!mailOk || confirmed === 0}>
            {confirmed === 0 ? "No confirmed subscribers yet" : `Send to ${confirmed} subscriber${confirmed === 1 ? "" : "s"}`}
          </ActionButton>
          <span className="text-[0.82rem] text-mist">Each email includes a one-click unsubscribe link.</span>
        </div>
      </form>

      {/* History */}
      {broadcasts.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-left text-[0.95rem]">
            <thead className="bg-shell text-[0.72rem] uppercase tracking-[0.14em] text-mist">
              <tr>
                <th className="px-5 py-3 font-semibold">Subject</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Sent</th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {broadcasts.map((b) => (
                <tr key={b.id} className="border-t border-line">
                  <td className="px-5 py-3 text-ink">{b.subject}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold capitalize",
                        b.status === "sent" && "bg-sage/15 text-sage-dark",
                        b.status === "failed" && "bg-heart/15 text-heart",
                        (b.status === "draft" || b.status === "sending") && "bg-linen text-stone"
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 tabular-nums text-stone">
                    {b.sent_count}/{b.recipient_count}
                  </td>
                  <td className="px-5 py-3 text-stone">
                    {b.sent_at
                      ? new Date(b.sent_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
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
