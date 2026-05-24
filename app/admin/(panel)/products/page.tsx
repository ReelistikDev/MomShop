import Link from "next/link";
import { PageHeader, ConnectNotice } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { formatPrice, cn } from "@/lib/utils";
import { deleteProduct, quickToggle } from "./actions";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number;
  images: string[];
  active: boolean;
  sold_out: boolean;
  featured: boolean;
}

export default async function AdminProductsPage() {
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Products" description="Add, edit, and organize everything in the shop." />
        <ConnectNotice />
      </>
    );
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from("products")
    .select("id, name, slug, category, price, images, active, sold_out, featured")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as Row[];

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} ${products.length === 1 ? "product" : "products"} in the shop.`}
        action={<Button href="/admin/products/new" variant="primary" size="md">New product</Button>}
      />

      {products.length === 0 ? (
        <p className="rounded-card border border-dashed border-line-strong bg-shell px-6 py-10 text-center text-stone">
          No products yet. Add categories first, then create your first product.
        </p>
      ) : (
        <div className="overflow-hidden rounded-card border border-line">
          <table className="w-full text-left text-[0.95rem]">
            <thead className="bg-shell text-[0.72rem] uppercase tracking-[0.14em] text-mist">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-line align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-linen">
                        {p.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone">{p.category ?? "—"}</td>
                  <td className="px-4 py-3 tabular-nums text-stone">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Chip on={p.active} labelOn="Visible" labelOff="Hidden" />
                      {p.sold_out && <Chip on={false} labelOn="" labelOff="Sold out" />}
                      {p.featured && <Chip on labelOn="Featured" labelOff="" tone="oak" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3 text-[0.85rem]">
                      <Link href={`/admin/products/edit/${p.id}`} className="text-sage-dark hover:text-ink">Edit</Link>
                      <form action={quickToggle}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="field" value="active" />
                        <input type="hidden" name="value" value={(!p.active).toString()} />
                        <button type="submit" className="text-stone hover:text-ink">{p.active ? "Hide" : "Show"}</button>
                      </form>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="text-mist hover:text-heart">Delete</button>
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

function Chip({
  on,
  labelOn,
  labelOff,
  tone = "sage",
}: {
  on: boolean;
  labelOn: string;
  labelOff: string;
  tone?: "sage" | "oak";
}) {
  const label = on ? labelOn : labelOff;
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[0.68rem] font-semibold",
        on && tone === "sage" && "bg-sage/15 text-sage-dark",
        on && tone === "oak" && "bg-oak/20 text-oak-dark",
        !on && "bg-linen text-mist"
      )}
    >
      {label}
    </span>
  );
}
