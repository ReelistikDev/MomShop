import type { Material, Product } from "./types";

/* ---------------------------------------------------------------------------
   General handmade boutique — hats, earrings, shirts, stickers, and more.

   The catalog is intentionally EMPTY for now: the client will add their own
   categories and products (via Supabase later). With nothing here, the UI
   shows tasteful "Coming soon" states everywhere. Accessors stay async and
   Supabase-shaped so wiring the database is a drop-in change.
--------------------------------------------------------------------------- */

export const materials: Material[] = [];
export const products: Product[] = [];

export async function getMaterials(): Promise<Material[]> {
  return materials;
}

export async function getMaterial(slug: string): Promise<Material | undefined> {
  return materials.find((m) => m.slug === slug);
}

export async function getProducts(material?: string): Promise<Product[]> {
  if (material && material !== "all") {
    return products.filter((p) => p.material === material);
  }
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.bestSeller).slice(0, limit);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export async function getPersonalizable(): Promise<Product[]> {
  return products.filter((p) => p.personalizable);
}

export async function getRelated(slug: string, limit = 4): Promise<Product[]> {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}

export function allProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
