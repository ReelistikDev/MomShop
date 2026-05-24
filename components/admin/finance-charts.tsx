import { formatPrice } from "@/lib/utils";

/**
 * Income vs. expense donut. Pure SVG (no chart lib, no client JS).
 * Two arcs drawn with stroke-dasharray on overlapping circles; the net
 * sits in the center with a small legend below. Zero case renders an empty ring.
 */
export function IncomeExpenseDonut({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) {
  const total = income + expense;
  const net = income - expense;

  // Geometry
  const size = 200;
  const stroke = 26;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const incomeFraction = total > 0 ? income / total : 0;
  const incomeLen = incomeFraction * circumference;
  const expenseLen = circumference - incomeLen;

  return (
    <div className="rounded-card border border-line bg-shell px-5 py-6">
      <p className="eyebrow mb-4 text-mist">Income vs. expenses</p>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label={`Income ${formatPrice(income)}, expenses ${formatPrice(expense)}`}
          >
            {/* Track */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              strokeWidth={stroke}
              className="stroke-linen"
            />
            {total > 0 && (
              <g transform={`rotate(-90 ${cx} ${cy})`}>
                {/* Income arc (sage) */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  className="stroke-sage"
                  strokeWidth={stroke}
                  strokeLinecap="butt"
                  strokeDasharray={`${incomeLen} ${circumference - incomeLen}`}
                  strokeDashoffset={0}
                />
                {/* Expense arc (oak-dark), offset to start after income */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  className="stroke-oak-dark"
                  strokeWidth={stroke}
                  strokeLinecap="butt"
                  strokeDasharray={`${expenseLen} ${circumference - expenseLen}`}
                  strokeDashoffset={-incomeLen}
                />
              </g>
            )}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {total > 0 ? (
              <>
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-mist">
                  Net
                </span>
                <span
                  className={
                    "font-serif text-xl tabular-nums " +
                    (net >= 0 ? "text-sage-dark" : "text-heart")
                  }
                >
                  {formatPrice(net)}
                </span>
              </>
            ) : (
              <span className="px-6 text-[0.82rem] text-mist">No data yet</span>
            )}
          </div>
        </div>

        <ul className="flex w-full flex-col gap-2.5 text-[0.9rem]">
          <li className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-stone">
              <span className="inline-block size-3 rounded-full bg-sage" aria-hidden />
              Income
            </span>
            <span className="tabular-nums font-medium text-ink">
              {formatPrice(income)}
            </span>
          </li>
          <li className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-stone">
              <span className="inline-block size-3 rounded-full bg-oak-dark" aria-hidden />
              Expenses
            </span>
            <span className="tabular-nums font-medium text-ink">
              {formatPrice(expense)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Horizontal category bars, scaled to the largest amount. Pure SVG/CSS — each
 * bar is a rounded div whose width is a percentage of the max. Sorted desc by
 * the caller (or here defensively).
 */
export function CategoryBars({
  items,
}: {
  items: { label: string; amount: number }[];
}) {
  const sorted = [...items].sort((a, b) => b.amount - a.amount);
  const max = sorted.reduce((m, i) => Math.max(m, i.amount), 0);

  return (
    <div className="rounded-card border border-line bg-shell px-5 py-6">
      <p className="eyebrow mb-4 text-mist">Expenses by category</p>

      {sorted.length === 0 || max === 0 ? (
        <p className="py-6 text-center text-[0.88rem] text-mist">
          No expenses in this range yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {sorted.map((item, i) => {
            const pct = max > 0 ? Math.max((item.amount / max) * 100, 2) : 0;
            // Alternate sage / oak tones for visual rhythm.
            const tone = i % 2 === 0 ? "bg-oak" : "bg-sage";
            return (
              <li key={item.label}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-[0.88rem]">
                  <span className="truncate text-stone">{item.label}</span>
                  <span className="tabular-nums font-medium text-ink">
                    {formatPrice(item.amount)}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-linen">
                  <div
                    className={"h-full rounded-full " + tone}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
