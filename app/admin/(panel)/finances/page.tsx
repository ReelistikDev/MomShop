import { PageHeader, ConnectNotice, ReadyPanel } from "@/components/admin/admin-ui";
import { isDatabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function AdminFinancesPage() {
  return (
    <>
      <PageHeader
        title="Finances"
        description="Track income vs. expenses, generate a profit & loss statement, and keep receipts linked to each expense."
      />
      {isDatabaseConfigured() ? (
        <ReadyPanel>
          The finance engine (income/expense entries, income-vs-expense chart,
          P&amp;L by date range, and receipt upload auto-linked to expenses)
          comes online next.
        </ReadyPanel>
      ) : (
        <ConnectNotice />
      )}
    </>
  );
}
