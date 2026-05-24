import { PageHeader, ConnectNotice, ReadyPanel } from "@/components/admin/admin-ui";
import { isDatabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        description="Group products into sections like Hats, Earrings, Shirts, and Stickers — these drive the shop's filters."
      />
      {isDatabaseConfigured() ? (
        <ReadyPanel>
          The category manager (add / rename / reorder / cover image) comes
          online next.
        </ReadyPanel>
      ) : (
        <ConnectNotice />
      )}
    </>
  );
}
