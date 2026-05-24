import { getSupabase } from "./supabase";
import type { Category, Product, ProductVariant } from "./types";

/* ---------------------------------------------------------------------------
   Storefront data accessors, backed by the public (anon) Supabase client.

   Every accessor degrades gracefully: when `getSupabase()` is null (env not
   configured) or a query errors, we return empty arrays / undefined so the
   build works without a database and the UI falls back to "Coming soon".

   RLS allows public read of active rows only, but we still scope queries to
   `active = true` to be explicit and resilient to policy changes.
--------------------------------------------------------------------------- */

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  short_description: string | null;
  description: string | null;
  images: string[] | null;
  badge: Product["badge"] | null;
  variants: unknown;
  sku: string | null;
  featured: boolean | null;
  sold_out: boolean | null;
  active: boolean;
  sort_order: number | null;
  created_at: string;
};

type CategoryRow = {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  sort_order: number | null;
  active: boolean;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    images: row.images ?? [],
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    badge: row.badge ?? undefined,
    category: row.category ?? undefined,
    soldOut: row.sold_out ?? undefined,
    featured: row.featured ?? undefined,
    variants: Array.isArray(row.variants) ? (row.variants as ProductVariant[]) : [],
  };
}

function mapCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    image: row.image,
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, description, image, sort_order, active")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as CategoryRow[]).map(mapCategory);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name, description, image, sort_order, active")
    .eq("active", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapCategory(data as CategoryRow);
}

export async function getProducts(category?: string): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true);
  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  const { data, error } = await query
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return (data as ProductRow[]).map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const supabase = getSupabase();
  if (!supabase) return undefined;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapProduct(data as ProductRow);
}

export async function getFeatured(limit = 4): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: featured, error: featuredError } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!featuredError && featured && featured.length > 0) {
    return (featured as ProductRow[]).map(mapProduct);
  }

  // Fallback: most-recent active products when nothing is flagged featured.
  const { data: recent, error: recentError } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (recentError || !recent) return [];
  return (recent as ProductRow[]).map(mapProduct);
}

export async function getRelated(slug: string, limit = 4): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const current = await getProduct(slug);

  // Prefer products in the same category, excluding the current one.
  if (current?.category) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .eq("category", current.category)
      .neq("slug", slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(limit);
    if (!error && data && data.length > 0) {
      return (data as ProductRow[]).map(mapProduct);
    }
  }

  // Fallback: any other active products.
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .neq("slug", slug)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error || !data) return [];
  return (data as ProductRow[]).map(mapProduct);
}

export async function allProductSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("active", true);
  if (error || !data) return [];
  return (data as { slug: string }[]).map((r) => r.slug);
}
