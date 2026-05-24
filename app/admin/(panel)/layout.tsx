import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { BRAND } from "@/lib/brand";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="border-b border-line bg-cream lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:py-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            <span className="font-serif text-xl text-ink">{BRAND.name}</span>
          </Link>
        </div>
        <div className="px-3 pb-3 lg:flex-1 lg:px-4">
          <AdminNav />
        </div>
        <div className="hidden px-5 py-4 lg:block">
          <Link
            href="/"
            target="_blank"
            className="text-[0.85rem] text-mist transition-colors hover:text-ink"
          >
            View live site ↗
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
