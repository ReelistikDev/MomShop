import type { Material, MaterialSlug, Product } from "./types";

/* ---------------------------------------------------------------------------
   Seed catalog — handmade earrings (CNC-cut wood, leather, and mixed).

   Images in /public/images are PLACEHOLDERS sourced from Unsplash — swap them
   with the brand's own product photography. The accessor functions below are
   async and shaped to be backed by Supabase later (see supabase/migrations);
   today they resolve from this seed so the site runs with no database.
--------------------------------------------------------------------------- */

export const materials: Material[] = [
  {
    slug: "wood",
    name: "Wood",
    tagline: "CNC-cut, light as can be",
    description:
      "Light-toned wood, cut and sanded by hand, then sealed for everyday wear. Warm, natural, and barely-there on the ear.",
    image: "/images/material-wood.jpg",
  },
  {
    slug: "leather",
    name: "Leather",
    tagline: "Soft, supple, full of movement",
    description:
      "Genuine leather cut into clean shapes that move with you. Soft to the touch and easy to wear from morning to night.",
    image: "/images/material-leather.jpg",
  },
  {
    slug: "mixed",
    name: "Mixed",
    tagline: "Wood, leather & a little brass",
    description:
      "Where materials meet — wood paired with leather or a touch of brass for pieces with a bit more to say.",
    image: "/images/material-mixed.jpg",
  },
];

const FINISH_LIGHT = { name: "Finish", options: ["Natural Maple", "Light Walnut"] };
const HARDWARE = { name: "Hardware", options: ["Surgical Steel", "Brass"] };
const LEATHER_TONE = { name: "Tone", options: ["Tan", "Cognac", "Black"] };

export const products: Product[] = [
  {
    id: "birch-studs",
    slug: "birch-studs",
    name: "Birch Studs",
    material: "wood",
    style: "Studs",
    price: 24,
    images: ["/images/product-1.jpg", "/images/hero.jpg", "/images/material-wood.jpg"],
    badge: "bestseller",
    bestSeller: true,
    shortDescription: "Lightweight CNC-cut wood studs for everyday wear.",
    description:
      "A small, smooth wood stud cut on the CNC and sanded by hand. Light enough to forget you're wearing them — the pair you reach for on a normal Tuesday. Warm, simple, and easy to gift.",
    materials: ["Light maple", "Hand-sealed finish", "Surgical steel posts"],
    details: ["Featherlight — under 1g", "10mm", "Nickel-free posts"],
    care: ["Keep dry; wipe with a soft cloth", "Avoid soaking or perfume"],
    variants: [FINISH_LIGHT],
  },
  {
    id: "aspen-hoops",
    slug: "aspen-hoops",
    name: "Aspen Hoops",
    material: "wood",
    style: "Hoops",
    price: 32,
    images: ["/images/product-2.jpg", "/images/material-wood.jpg", "/images/hero.jpg"],
    badge: "bestseller",
    bestSeller: true,
    shortDescription: "Warm wooden hoops with an easy, everyday swing.",
    description:
      "An open wooden hoop, cut clean and sanded smooth. It catches the light with a warm, natural grain and stays light on the ear all day. Quiet enough for work, pretty enough for after.",
    materials: ["Light walnut", "Hand-sealed finish", "Surgical steel hooks"],
    details: ["Under 2g each", "35mm drop", "Smooth, snag-free edges"],
    care: ["Keep dry", "Store flat, out of direct sun"],
    variants: [FINISH_LIGHT, HARDWARE],
  },
  {
    id: "meadow-drops",
    slug: "meadow-drops",
    name: "Meadow Drops",
    material: "wood",
    style: "Drops",
    price: 30,
    images: ["/images/product-3.jpg", "/images/material-wood.jpg", "/images/banner-lifestyle.jpg"],
    badge: "handmade",
    shortDescription: "Laser-cut botanical drops in light wood.",
    description:
      "A slender leaf shape, laser-cut from light wood and finished by hand. It moves softly when you do and keeps an outfit feeling calm and considered. A little nod to the outdoors you can wear anywhere.",
    materials: ["Light maple", "Laser-cut detail", "Surgical steel hooks"],
    details: ["Lightweight on the ear", "40mm drop", "Open hook closure"],
    care: ["Keep dry", "Wipe gently with a soft cloth"],
    variants: [FINISH_LIGHT],
  },
  {
    id: "quarry-geometrics",
    slug: "quarry-geometrics",
    name: "Quarry Geometrics",
    material: "wood",
    style: "Statement",
    price: 38,
    images: ["/images/product-4.jpg", "/images/material-wood.jpg"],
    badge: "new",
    isNew: true,
    personalizable: true,
    shortDescription: "Bold geometric wood — engrave it if you'd like.",
    description:
      "A clean geometric shape cut on the CNC for a bit more presence. Surprisingly light for its size, and a lovely blank canvas — add a small initial or date and we'll engrave it for you, gift-ready.",
    materials: ["Light walnut", "CNC-cut", "Surgical steel posts"],
    details: ["Lightweight despite the size", "45mm", "Optional hand engraving"],
    care: ["Keep dry", "Avoid soaking and perfume"],
    variants: [FINISH_LIGHT, HARDWARE],
  },
  {
    id: "saddle-teardrops",
    slug: "saddle-teardrops",
    name: "Saddle Teardrops",
    material: "leather",
    style: "Drops",
    price: 28,
    images: ["/images/product-5.jpg", "/images/material-leather.jpg", "/images/hero.jpg"],
    badge: "bestseller",
    bestSeller: true,
    shortDescription: "Soft leather teardrops that move with you.",
    description:
      "A simple teardrop cut from genuine leather — soft, light, and full of easy movement. Broken-in from the first wear, it's the kind of pair that just goes with everything.",
    materials: ["Genuine leather", "Surgical steel hooks"],
    details: ["Featherlight", "45mm drop", "Soft, flexible feel"],
    care: ["Keep dry", "Reshape gently if needed"],
    variants: [LEATHER_TONE],
  },
  {
    id: "fringe-danglers",
    slug: "fringe-danglers",
    name: "Fringe Danglers",
    material: "leather",
    style: "Statement",
    price: 34,
    images: ["/images/product-6.jpg", "/images/material-leather.jpg"],
    badge: "handmade",
    shortDescription: "Hand-cut leather fringe with plenty of swing.",
    description:
      "Fine leather fringe, hand-cut to fall and sway with you. A statement that still feels soft and wearable — light on the ear, with a relaxed, handmade edge.",
    materials: ["Genuine leather", "Surgical steel hooks"],
    details: ["Light despite the length", "65mm drop", "Soft movement"],
    care: ["Keep dry", "Store hanging to keep the shape"],
    variants: [LEATHER_TONE],
  },
  {
    id: "harvest-studs",
    slug: "harvest-studs",
    name: "Harvest Studs",
    material: "leather",
    style: "Studs",
    price: 22,
    images: ["/images/product-7.jpg", "/images/material-leather.jpg"],
    badge: "new",
    isNew: true,
    shortDescription: "Tiny leather studs in warm, earthy tones.",
    description:
      "A small leather disc on a steel post — understated and comfortable enough to wear every day. Warm, earthy, and quietly different from the usual stud.",
    materials: ["Genuine leather", "Surgical steel posts"],
    details: ["Featherlight", "12mm", "Nickel-free posts"],
    care: ["Keep dry", "Wipe gently"],
    variants: [LEATHER_TONE],
  },
  {
    id: "grove-mixed-drops",
    slug: "grove-mixed-drops",
    name: "Grove Mixed Drops",
    material: "mixed",
    style: "Drops",
    price: 36,
    images: ["/images/product-8.jpg", "/images/material-mixed.jpg", "/images/banner-lifestyle.jpg"],
    badge: "handmade",
    shortDescription: "Light wood paired with leather and a hint of brass.",
    description:
      "Wood, leather, and a small brass accent brought together in one easy drop. The materials play off each other — warm grain, soft leather, a little shine — while staying light and wearable.",
    materials: ["Light maple", "Genuine leather", "Brass accent", "Surgical steel hooks"],
    details: ["Lightweight", "42mm drop", "Mixed-material detail"],
    care: ["Keep dry", "Wipe gently; avoid soaking"],
    variants: [FINISH_LIGHT, LEATHER_TONE],
  },
];

/* ----------------------------- Accessors ---------------------------------- */
/* async + Promise-returning so they can be swapped for Supabase queries with
   no change at the call sites. */

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

/** Other earrings for "you may also like", excluding the given slug. */
export async function getRelated(slug: string, limit = 4): Promise<Product[]> {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}

export function allProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
