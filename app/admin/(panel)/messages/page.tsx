import { PageHeader, ConnectNotice } from "@/components/admin/admin-ui";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { setMessageRead, deleteMessage } from "./actions";

export const dynamic = "force-dynamic";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export default async function AdminMessagesPage() {
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Messages" description="Notes sent through your contact form." />
        <ConnectNotice />
      </>
    );
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from("contact_messages")
    .select("id, name, email, subject, message, read, created_at")
    .order("created_at", { ascending: false });
  const messages = (data ?? []) as Message[];
  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        description={
          messages.length === 0
            ? "Notes sent through your contact form."
            : `${messages.length} total · ${unread} unread`
        }
      />

      {messages.length === 0 ? (
        <p className="rounded-card border border-dashed border-line-strong bg-shell px-6 py-10 text-center text-stone">
          No messages yet — notes from your contact form will land here.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "rounded-card border bg-shell px-5 py-4",
                m.read ? "border-line" : "border-oak/50 ring-1 ring-oak/20"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">
                    {m.name}{" "}
                    {!m.read && (
                      <span className="ml-1 rounded-full bg-oak/20 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-oak-dark">
                        New
                      </span>
                    )}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-[0.88rem] text-sage-dark hover:underline">
                    {m.email}
                  </a>
                </div>
                <time className="text-[0.8rem] text-mist">
                  {new Date(m.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </time>
              </div>

              {m.subject && (
                <p className="mt-2 text-[0.92rem] font-medium text-stone">{m.subject}</p>
              )}
              <p className="mt-1 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-stone">
                {m.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.85rem]">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "your note"))}`}
                  className="font-medium text-sage-dark hover:text-ink"
                >
                  Reply
                </a>
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={(!m.read).toString()} />
                  <button type="submit" className="text-stone hover:text-ink">
                    Mark {m.read ? "unread" : "read"}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="text-mist hover:text-heart">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
