export type Badge = "handmade" | "custom" | "bestseller" | "new";

export interface ProductVariant {
  /** e.g. "Metal", "Length", "Ring size" */
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Collection slug this product belongs to. */
  collection: string;
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

export interface Collection {
  slug: string;
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
