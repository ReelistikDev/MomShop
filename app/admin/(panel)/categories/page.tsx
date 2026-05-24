import { PageHeader, ConnectNotice } from "@/components/admin/admin-ui";
import { ActionButton } from "@/components/ui/button";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  createCategory,
  deleteCategory,
  toggleCategoryActive,
} from "./actions";

export const dynamic = "force-dynamic";

interface Category {
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  active: boolean;
}

const field =
  "h-11 w-full rounded-xl border border-line-strong bg-cream px-3.5 text-ink placeholder:text-mist focus:border-oak focus:outline-none";

export default async function AdminCategoriesPage() {
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Categories" description="Group products into sections like Hats, Earrings, Shirts, and Stickers." />
        <ConnectNotice />
      </>
    );
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from("categories")
    .select("slug, name, description, sort_order, active")
    .order("sort_order", { ascending: true });
  const categories = (data ?? []) as Category[];

  return (
    <>
      <PageHeader
        title="Categories"
        description="Sections that group products and power the shop's filters."
      />

      {/* Add form */}
      <form
        action={createCategory}
        className="mb-8 grid gap-3 rounded-card border border-line bg-shell p-5 sm:grid-cols-[1.2fr_1fr_auto] sm:items-end"
      >
        <div>
          <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-mist">
            Name
          </label>
          <input name="name" required placeholder="e.g. Hats" className={cn(field, "mt-1.5")} />
        </div>
        <div>
          <label className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-mist">
            Sort order
          </label>
          <input name="sort_order" type="number" defaultValue={(categories.length + 1) * 10} className={cn(field, "mt-1.5")} />
        </div>
        <ActionButton type="submit" variant="primary" size="md" className="h-11">
          Add category
        </ActionButton>
      </form>

      {categories.length === 0 ? (
        <p className="rounded-card border border-dashed border-line-strong bg-shell px-6 py-10 text-center text-stone">
          No categories yet — add your first one above (Hats, Earrings, Shirts, Stickers…).
        </p>
      ) : (
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-left text-[0.95rem]">
            <thead className="bg-shell text-[0.72rem] uppercase tracking-[0.14em] text-mist">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.slug} className="border-t border-line">
                  <td className="px-5 py-3 text-ink">{c.name}</td>
                  <td className="px-5 py-3 font-mono text-[0.82rem] text-mist">{c.slug}</td>
                  <td className="px-5 py-3 text-stone">{c.sort_order}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold",
                        c.active ? "bg-sage/15 text-sage-dark" : "bg-linen text-mist"
                      )}
                    >
                      {c.active ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-4 text-[0.85rem]">
                      <form action={toggleCategoryActive}>
                        <input type="hidden" name="slug" value={c.slug} />
                        <input type="hidden" name="active" value={(!c.active).toString()} />
                        <button type="submit" className="text-stone hover:text-ink">
                          {c.active ? "Hide" : "Show"}
                        </button>
                      </form>
                      <form action={deleteCategory}>
                        <input type="hidden" name="slug" value={c.slug} />
                        <button type="submit" className="text-mist hover:text-heart">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
