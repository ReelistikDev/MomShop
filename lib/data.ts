import type { Material, Product } from "./types";

/* ---------------------------------------------------------------------------
   Seed catalog — handmade earrings. The signature pieces are hand-painted
   wood rounds (night skies, forests, mountains, bears), alongside leather and
   mixed-material pairs.

   Images in /public/images are PLACEHOLDERS (Unsplash) except display.jpg,
   which is the real product photo — swap the rest with the brand's own.
   Accessors are async and shaped to be backed by Supabase later.
--------------------------------------------------------------------------- */

export const materials: Material[] = [
  {
    slug: "wood",
    name: "Wood",
    tagline: "Hand-painted little scenes",
    description:
      "Light wood rounds, hand-painted with night skies, forests, and mountains, then sealed to last. Each one is painted by hand, so no two are quite the same.",
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

const HARDWARE = { name: "Hardware", options: ["Surgical Steel", "Brass"] };
const LEATHER_TONE = { name: "Tone", options: ["Tan", "Cognac", "Black"] };

export const products: Product[] = [
  {
    id: "moonlit-pines",
    slug: "moonlit-pines",
    name: "Moonlit Pines",
    material: "wood",
    style: "Round",
    price: 34,
    images: ["/images/product-1.jpg", "/images/material-wood.jpg", "/images/banner-lifestyle.jpg"],
    badge: "bestseller",
    bestSeller: true,
    shortDescription: "A crescent moon over a hand-painted pine forest.",
    description:
      "A crescent moon hangs over a hand-painted pine forest on a light wood round. The deep twilight sky is painted by hand and sealed to last — a little piece of a quiet night you can wear anywhere.",
    materials: ["Birch wood", "Hand-painted & sealed", "Surgical steel hooks"],
    details: ["Lightweight on the ear", "~35mm round", "Each one slightly unique"],
    care: ["Keep dry; avoid soaking & perfume", "Wipe gently with a soft cloth"],
    variants: [HARDWARE],
  },
  {
    id: "wandering-bear",
    slug: "wandering-bear",
    name: "Wandering Bear",
    material: "wood",
    style: "Round",
    price: 36,
    images: ["/images/product-2.jpg", "/images/material-wood.jpg", "/images/banner-lifestyle.jpg"],
    badge: "bestseller",
    bestSeller: true,
    shortDescription: "A bear ambling through a painted, starry treeline.",
    description:
      "A bear wanders through a hand-painted treeline under a scatter of stars. Painted on light wood and sealed by hand — calm, woodsy, and just a little wild.",
    materials: ["Birch wood", "Hand-painted & sealed", "Surgical steel hooks"],
    details: ["Lightweight on the ear", "~35mm round", "Each one slightly unique"],
    care: ["Keep dry; avoid soaking & perfume", "Wipe gently with a soft cloth"],
    variants: [HARDWARE],
  },
  {
    id: "starry-forest",
    slug: "starry-forest",
    name: "Starry Forest",
    material: "wood",
    style: "Round",
    price: 32,
    images: ["/images/product-3.jpg", "/images/material-wood.jpg", "/images/hero.jpg"],
    badge: "handmade",
    bestSeller: true,
    shortDescription: "A scatter of stars above hand-painted pines.",
    description:
      "Stars scattered above a hand-painted pine forest on a light wood round. Quietly detailed and light on the ear — the pair that makes people lean in for a closer look.",
    materials: ["Birch wood", "Hand-painted & sealed", "Surgical steel hooks"],
    details: ["Lightweight on the ear", "~32mm round", "Each one slightly unique"],
    care: ["Keep dry; avoid soaking & perfume", "Wipe gently with a soft cloth"],
    variants: [HARDWARE],
  },
  {
    id: "mountain-range",
    slug: "mountain-range",
    name: "Mountain Range",
    material: "wood",
    style: "Round",
    price: 38,
    images: ["/images/product-4.jpg", "/images/material-wood.jpg"],
    badge: "custom",
    isNew: true,
    personalizable: true,
    shortDescription: "Hand-painted peaks — engrave the back if you'd like.",
    description:
      "Hand-painted peaks under an open sky on a light wood round. Add a small initial or date and we'll engrave it on the back — a wearable little landscape, made personal and gift-ready.",
    materials: ["Birch wood", "Hand-painted & sealed", "Optional back engraving"],
    details: ["Lightweight despite the size", "~38mm round", "Up to 12 characters"],
    care: ["Keep dry; avoid soaking & perfume", "Wipe gently with a soft cloth"],
    variants: [HARDWARE],
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
    shortDescription: "Hand-painted wood paired with leather and brass.",
    description:
      "A hand-painted wood piece brought together with soft leather and a small brass accent. The materials play off each other — warm grain, painted color, a little shine — while staying light and wearable.",
    materials: ["Birch wood", "Genuine leather", "Brass accent", "Surgical steel hooks"],
    details: ["Lightweight", "42mm drop", "Mixed-material detail"],
    care: ["Keep dry", "Wipe gently; avoid soaking"],
    variants: [HARDWARE, LEATHER_TONE],
  },
];

/* ----------------------------- Accessors ---------------------------------- */

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
