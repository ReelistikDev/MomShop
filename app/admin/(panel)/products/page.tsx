import { PageHeader, ConnectNotice, ReadyPanel } from "@/components/admin/admin-ui";
import { isDatabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="Add, edit, and organize everything in the shop — names, prices, photos, and categories."
      />
      {isDatabaseConfigured() ? (
        <ReadyPanel>
          The full product editor (create / edit / photos / variants / sold-out)
          comes online next, now that the foundation is in place.
        </ReadyPanel>
      ) : (
        <ConnectNotice />
      )}
    </>
  );
}
