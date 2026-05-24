import { PageHeader, ConnectNotice, ReadyPanel } from "@/components/admin/admin-ui";
import { isDatabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function AdminNewsletterPage() {
  return (
    <>
      <PageHeader
        title="Subscribers"
        description="Everyone who's signed up to hear when the shop opens."
      />
      {isDatabaseConfigured() ? (
        <ReadyPanel>
          The subscriber list (with CSV export) comes online next.
        </ReadyPanel>
      ) : (
        <ConnectNotice />
      )}
    </>
  );
}
