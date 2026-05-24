import { PageHeader, StatCard, ConnectNotice } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/button";
import { IncomeExpenseDonut, CategoryBars } from "@/components/admin/finance-charts";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { cn, formatPrice } from "@/lib/utils";
import { createTransaction, deleteTransaction } from "./actions";

export const dynamic = "force-dynamic";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  occurred_on: string;
  category: string;
  description: string | null;
  payment_method: string | null;
  receipt_url: string | null;
}

const field =
  "h-11 w-full rounded-xl border border-line-strong bg-cream px-3.5 text-ink placeholder:text-mist focus:border-oak focus:outline-none";
const labelCls =
  "text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-mist";

const INCOME_CATEGORIES = ["Sales", "Custom orders", "Markets", "Other"];
const EXPENSE_CATEGORIES = [
  "Materials",
  "Supplies",
  "Shipping",
  "Fees",
  "Marketing",
  "Equipment",
  "Other",
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function startOfYearISO() {
  return `${new Date().getFullYear()}-01-01`;
}

function formatRangeLabel(from: string, to: string) {
  const fmt = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(from)} – ${fmt(to)}`;
}

function formatDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Sum amounts grouped by category for a given transaction type. */
function categoryTotals(rows: Transaction[], type: "income" | "expense") {
  const map = new Map<string, number>();
  for (const r of rows) {
    if (r.type !== type) continue;
    const key = r.category || "Other";
    map.set(key, (map.get(key) ?? 0) + Number(r.amount));
  }
  return [...map.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export default async function AdminFinancesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader
          title="Finances"
          description="Track income vs. expenses, see your profit & loss, and keep receipts."
        />
        <ConnectNotice />
      </>
    );
  }

  const params = await searchParams;
  const from = (params.from || "").trim() || startOfYearISO();
  const to = (params.to || "").trim() || todayISO();

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from("finance_transactions")
    .select(
      "id, type, amount, occurred_on, category, description, payment_method, receipt_url"
    )
    .gte("occurred_on", from)
    .lte("occurred_on", to)
    .order("occurred_on", { ascending: false });
  const transactions = (data ?? []) as Transaction[];

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + Number(t.amount), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + Number(t.amount), 0);
  const net = totalIncome - totalExpenses;

  const incomeByCategory = categoryTotals(transactions, "income");
  const expenseByCategory = categoryTotals(transactions, "expense");

  // Pre-generate signed URLs for any receipts (private bucket) before render.
  const signedReceipts = new Map<string, string>();
  await Promise.all(
    transactions
      .filter((t) => t.receipt_url)
      .map(async (t) => {
        const { data: signed } = await db.storage
          .from("receipts")
          .createSignedUrl(t.receipt_url as string, 3600);
        if (signed?.signedUrl) signedReceipts.set(t.id, signed.signedUrl);
      })
  );

  return (
    <>
      <PageHeader
        title="Finances"
        description={`Income, expenses, and profit & loss for ${formatRangeLabel(from, to)}.`}
      />

      {/* Date range filter (GET form → reloads with searchParams) */}
      <form
        method="GET"
        className="mb-6 flex flex-wrap items-end gap-3 rounded-card border border-line bg-shell p-4"
      >
        <div>
          <label htmlFor="from" className={labelCls}>
            From
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={from}
            className={cn(field, "mt-1.5 w-[10.5rem]")}
          />
        </div>
        <div>
          <label htmlFor="to" className={labelCls}>
            To
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={to}
            className={cn(field, "mt-1.5 w-[10.5rem]")}
          />
        </div>
        <ActionButton type="submit" variant="outline" size="md" className="h-11">
          Apply
        </ActionButton>
      </form>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Income" value={formatPrice(totalIncome)} />
        <StatCard label="Expenses" value={formatPrice(totalExpenses)} />
        <StatCard
          label="Net"
          value={formatPrice(net)}
          hint={net >= 0 ? "Profit" : "Loss"}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <IncomeExpenseDonut income={totalIncome} expense={totalExpenses} />
        <CategoryBars items={expenseByCategory} />
      </div>

      {/* Profit & Loss statement */}
      <div className="mt-6 rounded-card border border-line bg-shell px-6 py-6">
        <p className="eyebrow mb-1 text-mist">Profit &amp; loss</p>
        <p className="mb-5 text-[0.85rem] text-stone">{formatRangeLabel(from, to)}</p>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Income */}
          <div>
            <h3 className="text-h3 mb-3 text-ink">Income</h3>
            {incomeByCategory.length === 0 ? (
              <p className="text-[0.88rem] text-mist">No income recorded.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {incomeByCategory.map((c) => (
                  <li
                    key={c.label}
                    className="flex items-baseline justify-between gap-4 text-[0.92rem]"
                  >
                    <span className="text-stone">{c.label}</span>
                    <span className="tabular-nums text-ink">
                      {formatPrice(c.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3 text-[0.92rem]">
              <span className="font-medium text-ink">Total income</span>
              <span className="tabular-nums font-medium text-sage-dark">
                {formatPrice(totalIncome)}
              </span>
            </div>
          </div>

          {/* Expenses */}
          <div>
            <h3 className="text-h3 mb-3 text-ink">Expenses</h3>
            {expenseByCategory.length === 0 ? (
              <p className="text-[0.88rem] text-mist">No expenses recorded.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {expenseByCategory.map((c) => (
                  <li
                    key={c.label}
                    className="flex items-baseline justify-between gap-4 text-[0.92rem]"
                  >
                    <span className="text-stone">{c.label}</span>
                    <span className="tabular-nums text-ink">
                      {formatPrice(c.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3 text-[0.92rem]">
              <span className="font-medium text-ink">Total expenses</span>
              <span className="tabular-nums font-medium text-oak-dark">
                {formatPrice(totalExpenses)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-line-strong pt-4">
          <span className="font-serif text-lg text-ink">
            Net {net >= 0 ? "profit" : "loss"}
          </span>
          <span
            className={cn(
              "font-serif text-2xl tabular-nums",
              net >= 0 ? "text-sage-dark" : "text-heart"
            )}
          >
            {formatPrice(net)}
          </span>
        </div>
      </div>

      {/* Add transaction */}
      <div className="mt-6 rounded-card border border-line bg-shell px-6 py-6">
        <h2 className="text-h3 mb-4 text-ink">Add transaction</h2>
        <form
          action={createTransaction}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label htmlFor="type" className={labelCls}>
              Type
            </label>
            <select
              id="type"
              name="type"
              defaultValue="income"
              className={cn(field, "mt-1.5")}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className={labelCls}>
              Amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className={cn(field, "mt-1.5")}
            />
          </div>

          <div>
            <label htmlFor="occurred_on" className={labelCls}>
              Date
            </label>
            <input
              id="occurred_on"
              name="occurred_on"
              type="date"
              defaultValue={todayISO()}
              className={cn(field, "mt-1.5")}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelCls}>
              Category
            </label>
            <input
              id="category"
              name="category"
              list="finance-categories"
              placeholder="e.g. Materials"
              className={cn(field, "mt-1.5")}
            />
            <datalist id="finance-categories">
              {[...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])].map(
                (c) => (
                  <option key={c} value={c} />
                )
              )}
            </datalist>
          </div>

          <div>
            <label htmlFor="payment_method" className={labelCls}>
              Payment method <span className="normal-case text-mist">(optional)</span>
            </label>
            <input
              id="payment_method"
              name="payment_method"
              placeholder="e.g. Cash, Card, Venmo"
              className={cn(field, "mt-1.5")}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelCls}>
              Description
            </label>
            <input
              id="description"
              name="description"
              placeholder="What was it?"
              className={cn(field, "mt-1.5")}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <label htmlFor="receipt" className={labelCls}>
              Receipt <span className="normal-case text-mist">(optional)</span>
            </label>
            <input
              id="receipt"
              name="receipt"
              type="file"
              accept="image/*,application/pdf"
              className="mt-1.5 block w-full text-[0.88rem] text-stone file:mr-3 file:rounded-full file:border-0 file:bg-sage file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sage-dark"
            />
          </div>

          <div className="flex items-end">
            <ActionButton type="submit" variant="primary" size="md" className="h-11 w-full">
              Add transaction
            </ActionButton>
          </div>
        </form>
      </div>

      {/* Transactions table */}
      <div className="mt-6">
        <h2 className="text-h3 mb-4 text-ink">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="rounded-card border border-dashed border-line-strong bg-shell px-6 py-10 text-center text-stone">
            No transactions in this range yet — add your first one above.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-line">
            <table className="w-full min-w-[44rem] text-left text-[0.92rem]">
              <thead className="bg-shell text-[0.72rem] uppercase tracking-[0.14em] text-mist">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Receipt</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const isIncome = t.type === "income";
                  const receiptUrl = signedReceipts.get(t.id);
                  return (
                    <tr key={t.id} className="border-t border-line align-top">
                      <td className="whitespace-nowrap px-5 py-3 text-stone">
                        {formatDate(t.occurred_on)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em]",
                            isIncome
                              ? "bg-sage/15 text-sage-dark"
                              : "bg-heart/12 text-heart"
                          )}
                        >
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink">{t.category}</td>
                      <td className="px-5 py-3 text-stone">
                        {t.description || (
                          <span className="text-mist">—</span>
                        )}
                        {t.payment_method && (
                          <span className="ml-2 text-[0.78rem] text-mist">
                            · {t.payment_method}
                          </span>
                        )}
                      </td>
                      <td
                        className={cn(
                          "whitespace-nowrap px-5 py-3 text-right tabular-nums font-medium",
                          isIncome ? "text-sage-dark" : "text-heart"
                        )}
                      >
                        {isIncome ? "" : "−"}
                        {formatPrice(Number(t.amount))}
                      </td>
                      <td className="px-5 py-3">
                        {t.receipt_url ? (
                          receiptUrl ? (
                            <a
                              href={receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sage-dark hover:text-ink hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-[0.82rem] text-mist">
                              Unavailable
                            </span>
                          )
                        ) : (
                          <span className="text-mist">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <form action={deleteTransaction}>
                          <input type="hidden" name="id" value={t.id} />
                          <button
                            type="submit"
                            className="text-[0.85rem] text-mist hover:text-heart"
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
