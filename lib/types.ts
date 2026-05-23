export type Badge = "handmade" | "custom" | "bestseller" | "new";

/** Material grouping used for the shop filter + home tiles. */
export type MaterialSlug = "wood" | "leather" | "mixed";

export interface ProductVariant {
  /** e.g. "Finish", "Hardware" */
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  material: MaterialSlug;
  /** Silhouette, shown as a small label: Studs / Hoops / Drops / Statement. */
  style: string;
  price: number;
  images: string[];
  badge?: Badge;
  shortDescription: string;
  description: string;
  materials: string[];
  details: string[];
  care: string[];
  variants: ProductVariant[];
  personalizable?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
}

export interface Material {
  slug: MaterialSlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface CartItem {
  /** Stable composite key (product + chosen options + engraving). */
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options?: Record<string, string>;
  engraving?: string;
}
