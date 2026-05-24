import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-[2rem] leading-tight text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-stone">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-line bg-shell px-5 py-5">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-mist">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl tabular-nums text-ink">{value}</p>
      {hint && <p className="mt-1 text-[0.82rem] text-stone">{hint}</p>}
    </div>
  );
}

export function ReadyPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-shell px-6 py-8">
      <p className="font-serif text-xl text-ink">Connected ✓</p>
      <p className="mt-2 max-w-prose leading-relaxed text-stone">{children}</p>
    </div>
  );
}

const code =
  "rounded bg-linen px-1.5 py-0.5 font-mono text-[0.82rem] text-ink";

export function ConnectNotice() {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-shell px-6 py-8">
      <h2 className="font-serif text-xl text-ink">
        Connect your database to go live
      </h2>
      <p className="mt-2 max-w-prose leading-relaxed text-stone">
        This section is built and ready — it just needs Supabase connected so
        your data has somewhere to live. Add these to{" "}
        <code className={code}>.env.local</code> (and your Vercel project), then
        restart:
      </p>
      <ul className="mt-4 space-y-1.5">
        {[
          "NEXT_PUBLIC_SUPABASE_URL",
          "NEXT_PUBLIC_SUPABASE_ANON_KEY",
          "SUPABASE_SERVICE_ROLE_KEY",
        ].map((v) => (
          <li key={v}>
            <code className={code}>{v}</code>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[0.85rem] text-mist">
        Then apply <code className={code}>supabase/migrations/0001_init.sql</code>.
        Full steps are in <code className={code}>CONTEXT.md</code>.
      </p>
    </div>
  );
}
