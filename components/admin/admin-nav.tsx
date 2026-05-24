"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChartIcon,
  DashboardIcon,
  LayersIcon,
  LogoutIcon,
  MailIcon,
  MessageIcon,
  TagIcon,
} from "@/components/icons";

const LINKS = [
  { href: "/admin", label: "Dashboard", Icon: DashboardIcon, exact: true },
  { href: "/admin/products", label: "Products", Icon: TagIcon },
  { href: "/admin/categories", label: "Categories", Icon: LayersIcon },
  { href: "/admin/finances", label: "Finances", Icon: ChartIcon },
  { href: "/admin/newsletter", label: "Subscribers", Icon: MailIcon },
  { href: "/admin/messages", label: "Messages", Icon: MessageIcon },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-stretch gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {LINKS.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[0.92rem] transition-colors",
              active
                ? "bg-ink text-cream"
                : "text-stone hover:bg-cream hover:text-ink"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[0.92rem] text-stone transition-colors hover:bg-cream hover:text-heart lg:mt-2 lg:border-t lg:border-line lg:pt-4"
      >
        <LogoutIcon className="h-[18px] w-[18px]" />
        Sign out
      </button>
    </div>
  );
}
