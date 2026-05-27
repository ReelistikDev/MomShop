export type Badge = "handmade" | "custom" | "bestseller" | "new";

/** Material grouping used for the (legacy) shop filter + home tiles. */
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
  price: number;
  images: string[];
  shortDescription: string;
  description: string;
  badge?: Badge;
  /** Category slug (→ categories.slug). */
  category?: string;
  soldOut?: boolean;
  /** Units available; null/undefined = not tracked (unlimited). */
  stock?: number | null;
  featured?: boolean;
  variants?: ProductVariant[];
  /** Whether the piece supports a short personalization / engraving. */
  personalizable?: boolean;

  /* ---- Legacy earrings-only fields (optional, may be absent on DB rows) ---- */
  material?: MaterialSlug;
  /** Silhouette, shown as a small label: Studs / Hoops / Drops / Statement. */
  style?: string;
  materials?: string[];
  details?: string[];
  care?: string[];
  bestSeller?: boolean;
  isNew?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string | null;
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
