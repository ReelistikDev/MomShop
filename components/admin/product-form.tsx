import Link from "next/link";
import { ActionButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  slug: string;
  name: string;
}
interface ProductLike {
  id?: string;
  name?: string;
  category?: string | null;
  price?: number;
  short_description?: string;
  description?: string;
  badge?: string | null;
  images?: string[];
  active?: boolean;
  sold_out?: boolean;
  featured?: boolean;
}

const field =
  "h-11 w-full rounded-xl border border-line-strong bg-cream px-3.5 text-ink placeholder:text-mist focus:border-oak focus:outline-none";
const label =
  "text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-mist";

const BADGES = ["none", "handmade", "custom", "bestseller", "new"];

export function ProductForm({
  action,
  categories,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  product?: ProductLike;
  submitLabel: string;
}) {
  const p = product ?? {};
  const isEdit = Boolean(p.id);
  const current = p.images?.[0];

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-5">
      {isEdit && <input type="hidden" name="id" value={p.id} />}

      <div>
        <label className={label}>Name</label>
        <input name="name" required defaultValue={p.name} placeholder="e.g. Linen Bucket Hat" className={cn(field, "mt-1.5")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Category</label>
          <select name="category" defaultValue={p.category ?? ""} className={cn(field, "mt-1.5")}>
            <option value="">— none —</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Price (USD)</label>
          <input name="price" type="number" step="0.01" min="0" defaultValue={p.price ?? ""} placeholder="0.00" className={cn(field, "mt-1.5")} />
        </div>
      </div>

      <div>
        <label className={label}>Short description</label>
        <input name="short_description" defaultValue={p.short_description} placeholder="One line shown on product cards" className={cn(field, "mt-1.5")} />
      </div>

      <div>
        <label className={label}>Description</label>
        <textarea name="description" rows={5} defaultValue={p.description} placeholder="The full description shown on the product page" className="mt-1.5 w-full rounded-xl border border-line-strong bg-cream px-3.5 py-3 text-ink placeholder:text-mist focus:border-oak focus:outline-none" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Badge</label>
          <select name="badge" defaultValue={p.badge ?? "none"} className={cn(field, "mt-1.5")}>
            {BADGES.map((b) => (
              <option key={b} value={b}>{b === "none" ? "— none —" : b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Photo</label>
          <div className="mt-1.5 flex items-center gap-3">
            {current && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
            )}
            <input name="image" type="file" accept="image/*" className="text-[0.85rem] text-stone file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-cream" />
          </div>
          {isEdit && <p className="mt-1 text-[0.75rem] text-mist">Leave empty to keep the current photo.</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 rounded-xl border border-line bg-shell px-4 py-3.5">
        <label className="flex items-center gap-2 text-[0.92rem] text-ink">
          <input type="checkbox" name="active" defaultChecked={p.active ?? true} className="h-4 w-4 accent-sage-dark" />
          Visible in shop
        </label>
        <label className="flex items-center gap-2 text-[0.92rem] text-ink">
          <input type="checkbox" name="featured" defaultChecked={p.featured ?? false} className="h-4 w-4 accent-sage-dark" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-[0.92rem] text-ink">
          <input type="checkbox" name="sold_out" defaultChecked={p.sold_out ?? false} className="h-4 w-4 accent-sage-dark" />
          Sold out
        </label>
      </div>

      <div className="flex items-center gap-4">
        <ActionButton type="submit" variant="primary" size="lg">{submitLabel}</ActionButton>
        <Link href="/admin/products" className="text-stone hover:text-ink">Cancel</Link>
      </div>
    </form>
  );
}
