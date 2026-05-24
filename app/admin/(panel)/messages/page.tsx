import { PageHeader, ConnectNotice, ReadyPanel } from "@/components/admin/admin-ui";
import { isDatabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function AdminMessagesPage() {
  return (
    <>
      <PageHeader
        title="Messages"
        description="Notes sent through your contact form."
      />
      {isDatabaseConfigured() ? (
        <ReadyPanel>
          The message inbox (read / mark-as-read / reply-by-email) comes online
          next.
        </ReadyPanel>
      ) : (
        <ConnectNotice />
      )}
    </>
  );
}
