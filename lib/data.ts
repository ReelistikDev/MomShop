import type { Collection, Product } from "./types";

/* ---------------------------------------------------------------------------
   Seed catalog.

   Images in /public/images are PLACEHOLDERS sourced from Unsplash — swap them
   with the brand's own product photography. The accessor functions below are
   async and shaped to be backed by Supabase later (see supabase/migrations);
   today they resolve from this seed so the site runs with no database.
--------------------------------------------------------------------------- */

export const collections: Collection[] = [
  {
    slug: "earrings",
    name: "Earrings",
    tagline: "Light enough to forget you're wearing them",
    description:
      "Hand-shaped hoops, studs, and drops in gold fill and sterling silver. Designed to sit comfortably from morning to evening.",
    image: "/images/collection-earrings.jpg",
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    tagline: "Layer them, or wear just one",
    description:
      "Delicate chains and quiet pendants made to live close to the skin. Easy to mix, easy to keep on.",
    image: "/images/collection-necklaces.jpg",
  },
  {
    slug: "rings",
    name: "Rings",
    tagline: "Simple bands for every day",
    description:
      "Slim, stackable rings finished by hand. Smooth edges, no snagging, made to be worn together.",
    image: "/images/collection-rings.jpg",
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    tagline: "A soft weight on the wrist",
    description:
      "Beaded and chain bracelets strung in small batches. Understated pieces that finish a look without asking for attention.",
    image: "/images/collection-bracelets.jpg",
  },
];

const GOLD_SILVER = { name: "Metal", options: ["14k Gold Fill", "Sterling Silver"] };
const LENGTHS = { name: "Length", options: ['16"', '18"', '20"'] };
const RING_SIZES = { name: "Ring size", options: ["5", "6", "7", "8", "9"] };

export const products: Product[] = [
  {
    id: "petal-hoops",
    slug: "petal-hoops",
    name: "Petal Hoops",
    collection: "earrings",
    price: 42,
    images: ["/images/product-1.jpg", "/images/hero.jpg", "/images/collection-earrings.jpg"],
    badge: "bestseller",
    bestSeller: true,
    shortDescription: "Lightweight handmade hoops designed for everyday wear.",
    description:
      "A softly rounded hoop, shaped and polished by hand. Light enough to wear from a morning coffee to a late dinner — the kind of pair you reach for without thinking. A quiet, giftable everyday piece.",
    materials: ["14k gold fill", "Hypoallergenic posts"],
    details: ["Under 2g each", "20mm diameter", "Secure click closure"],
    care: ["Keep dry; remove before swimming", "Wipe gently with a soft cloth"],
    variants: [GOLD_SILVER],
  },
  {
    id: "linen-chain-necklace",
    slug: "linen-chain-necklace",
    name: "Linen Chain Necklace",
    collection: "necklaces",
    price: 58,
    images: ["/images/product-2.jpg", "/images/hero.jpg", "/images/collection-necklaces.jpg"],
    badge: "bestseller",
    bestSeller: true,
    shortDescription: "A fine everyday chain that layers beautifully.",
    description:
      "A whisper-fine chain with just enough weight to feel substantial. Wear it on its own for something quiet, or layer it with a pendant. It sits close to the collarbone and never tangles when you take it off.",
    materials: ["14k gold fill", "Lobster clasp"],
    details: ["Adjustable 16–18 in", "Lightweight, tangle-resistant", "Lays flat on the skin"],
    care: ["Store flat or hung", "Avoid lotions and perfume"],
    variants: [GOLD_SILVER, LENGTHS],
  },
  {
    id: "hawthorn-studs",
    slug: "hawthorn-studs",
    name: "Hawthorn Studs",
    collection: "earrings",
    price: 36,
    images: ["/images/product-3.jpg", "/images/collection-earrings.jpg", "/images/hero.jpg"],
    badge: "handmade",
    shortDescription: "Faceted studs that catch the light, quietly.",
    description:
      "Small, faceted studs that throw a little light without ever feeling loud. The pair you can sleep in, travel with, and pass along — comfortable enough to forget, pretty enough to notice.",
    materials: ["Sterling silver", "Cubic zirconia", "Butterfly backs"],
    details: ["5mm face", "Featherweight", "Posts sit flush to the ear"],
    care: ["Remove before showering", "Polish with a soft cloth"],
    variants: [GOLD_SILVER],
  },
  {
    id: "dew-pearl-pendant",
    slug: "dew-pearl-pendant",
    name: "Dew Pearl Pendant",
    collection: "necklaces",
    price: 64,
    images: ["/images/product-4.jpg", "/images/collection-necklaces.jpg", "/images/banner-lifestyle.jpg"],
    badge: "bestseller",
    bestSeller: true,
    shortDescription: "A single freshwater pearl on a fine chain.",
    description:
      "One small freshwater pearl, each a little different, suspended from a fine chain. A soft, giftable piece that feels considered without trying too hard — lovely for a birthday, a thank-you, or no reason at all.",
    materials: ["Freshwater pearl", "14k gold fill chain"],
    details: ["Adjustable 16–18 in", "Pearl 6–7mm", "Naturally one of a kind"],
    care: ["Put on last, take off first", "Keep away from water"],
    variants: [GOLD_SILVER, LENGTHS],
  },
  {
    id: "field-band-ring",
    slug: "field-band-ring",
    name: "Field Band Ring",
    collection: "rings",
    price: 48,
    images: ["/images/product-5.jpg", "/images/collection-rings.jpg"],
    badge: "new",
    isNew: true,
    shortDescription: "A slim, smooth band made for stacking.",
    description:
      "A slim band with gently rounded edges, finished by hand so it never catches. Wear one on its own or stack a few — it's the quiet base layer the rest of your rings are built around.",
    materials: ["14k gold fill", "Solid band"],
    details: ["1.5mm wide", "Comfort-fit interior", "Smooth, snag-free edges"],
    care: ["Remove for heavy tasks", "Buff with a soft cloth"],
    variants: [GOLD_SILVER, RING_SIZES],
  },
  {
    id: "makers-bead-bracelet",
    slug: "makers-bead-bracelet",
    name: "Maker's Bead Bracelet",
    collection: "bracelets",
    price: 52,
    images: ["/images/product-6.jpg", "/images/collection-bracelets.jpg"],
    badge: "handmade",
    shortDescription: "Hand-strung beads with a soft weight on the wrist.",
    description:
      "Strung one bead at a time on a durable cord, with a little gold detail to finish. A relaxed, everyday bracelet that adds warmth to a stack — softly worn-in from the very first day.",
    materials: ["Glass and brass beads", "Gold-fill accent", "Stretch cord"],
    details: ["Fits most wrists", "No clasp to fuss with", "Soft, flexible fit"],
    care: ["Roll on and off gently", "Keep dry"],
    variants: [{ name: "Tone", options: ["Sage", "Sand", "Stone"] }],
  },
  {
    id: "keepsake-pendant",
    slug: "keepsake-pendant",
    name: "Keepsake Pendant",
    collection: "necklaces",
    price: 72,
    images: ["/images/product-7.jpg", "/images/personalized.jpg", "/images/banner-lifestyle.jpg"],
    badge: "custom",
    bestSeller: true,
    personalizable: true,
    shortDescription: "A hand-stamped pendant, personalized for someone you love.",
    description:
      "A smooth little pendant we hand-stamp with an initial, a date, or a short word — whatever you'd like it to hold. It arrives gift-ready in a linen pouch, made to be kept and worn for years.",
    materials: ["14k gold fill", "Hand-stamped by us"],
    details: ["Up to 8 characters", "Adjustable 16–18 in", "Arrives in a linen gift pouch"],
    care: ["Wipe gently to keep the stamp crisp", "Avoid water and lotion"],
    variants: [GOLD_SILVER, LENGTHS],
  },
  {
    id: "willow-drops",
    slug: "willow-drops",
    name: "Willow Drops",
    collection: "earrings",
    price: 46,
    images: ["/images/product-8.jpg", "/images/hero.jpg", "/images/collection-earrings.jpg"],
    badge: "new",
    isNew: true,
    shortDescription: "Slender drop earrings with an easy, fluid swing.",
    description:
      "A long, slender drop that moves with you — graceful but never heavy. Light on the ear and easy to wear up or down, it's the piece that quietly pulls an outfit together.",
    materials: ["14k gold fill", "Hypoallergenic hooks"],
    details: ["32mm drop", "Lightweight on the ear", "Open hook closure"],
    care: ["Store hung to keep the shape", "Keep dry"],
    variants: [GOLD_SILVER],
  },
];

/* ----------------------------- Accessors ---------------------------------- */
/* async + Promise-returning so they can be swapped for Supabase queries with
   no change at the call sites. */

export async function getCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return collections.find((c) => c.slug === slug);
}

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCollection(slug: string): Promise<Product[]> {
  return products.filter((p) => p.collection === slug);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.bestSeller).slice(0, limit);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export async function getFeaturedCollections(limit = 3): Promise<Collection[]> {
  return collections.slice(0, limit);
}

/** All slugs, for generateStaticParams. */
export function allProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function allCollectionSlugs(): string[] {
  return collections.map((c) => c.slug);
}
