// One-off: pull a curated, on-theme set of warm editorial jewelry/lifestyle
// photos from Unsplash's public search into /public/images.
// These are PLACEHOLDERS — swap with the brand's own product photography.
//
// Unsplash's napi rejects programmatic fetch() (401) but is fine via curl,
// so we shell out to curl for transport. The descriptive `slug` on each
// result is used to filter for genuinely on-theme photos.
import { mkdir } from "node:fs/promises";
import { statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const OUT = join(process.cwd(), "public", "images");

function curlJson(url) {
  const out = execFileSync("curl", ["-s", "-H", "Accept: application/json", url], {
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(out.toString("utf8"));
}

function curlDownload(url, dest) {
  execFileSync("curl", ["-s", "-L", "-o", dest, url], { maxBuffer: 64 * 1024 * 1024 });
}

// file, queries[], orientation, width, include[] (slug must contain one),
// exclude[] (slug must contain none)
const SPECS = [
  {
    file: "hero.jpg", orientation: "landscape", width: 2000,
    queries: ["woman wearing delicate gold necklace", "woman gold jewelry neutral"],
    include: ["necklace", "earring", "jewelry", "jewellery"],
    exclude: ["man ", "cross", "bathing", "lingerie"],
  },
  {
    file: "banner-craft.jpg", orientation: "landscape", width: 1800,
    queries: ["jeweler workbench making jewelry", "jewelry making hands tools"],
    include: ["workbench", "jeweler", "making", "polishing", "workshop", "tools", "craft"],
    exclude: [],
  },
  {
    file: "banner-lifestyle.jpg", orientation: "landscape", width: 1800,
    queries: ["gold jewelry flat lay neutral", "minimal jewelry styled neutral"],
    include: ["jewelry", "jewellery", "necklace", "earring", "flat lay", "flatlay", "accessories", "rings"],
    exclude: ["lingerie", "bathing", "bikini", "man "],
  },
  {
    file: "personalized.jpg", orientation: "landscape", width: 1600,
    queries: ["initial pendant necklace gold", "personalized name necklace", "engraved pendant necklace"],
    include: ["pendant", "necklace", "initial", "engrav", "letter", "monogram"],
    exclude: ["man ", "bathing"],
  },
  {
    file: "about.jpg", orientation: "portrait", width: 1200,
    queries: ["jewelry maker workbench hands", "artisan jewelry studio", "jeweler crafting"],
    include: ["jeweler", "workbench", "making", "hands", "studio", "craft", "tools", "artisan"],
    exclude: ["cross", "couple"],
  },
  {
    file: "collection-earrings.jpg", orientation: "portrait", width: 1100,
    queries: ["gold earrings minimal", "dangle earrings neutral", "earrings jewelry"],
    include: ["earring"],
    exclude: ["pillar", "knob", "building"],
  },
  {
    file: "collection-necklaces.jpg", orientation: "portrait", width: 1100,
    queries: ["delicate gold necklace", "layered necklaces neutral", "gold chain necklace"],
    include: ["necklace", "chain", "pendant"],
    exclude: ["man "],
  },
  {
    file: "collection-rings.jpg", orientation: "portrait", width: 1100,
    queries: ["stacking gold rings", "minimal gold ring hand", "gold rings jewelry"],
    include: ["ring"],
    exclude: ["earring", "wreath", "phone", "boxing", "ring light"],
  },
  {
    file: "collection-bracelets.jpg", orientation: "portrait", width: 1100,
    queries: ["gold bracelet wrist", "beaded bracelet handmade", "bangle bracelet gold"],
    include: ["bracelet", "bangle", "beaded", "wrist"],
    exclude: [],
  },
  {
    file: "product-1.jpg", orientation: "squarish", width: 1000,
    queries: ["gold hoop earrings", "hoop earrings neutral", "gold earrings white"],
    include: ["hoop", "earring"], exclude: ["pillar", "knob"],
  },
  {
    file: "product-2.jpg", orientation: "squarish", width: 1000,
    queries: ["dainty gold necklace neutral", "thin gold chain necklace", "delicate necklace"],
    include: ["necklace", "chain", "pendant"], exclude: ["man "],
  },
  {
    file: "product-3.jpg", orientation: "squarish", width: 1000,
    queries: ["gold stud earrings", "small stud earrings neutral", "minimal earrings"],
    include: ["stud", "earring"], exclude: ["knob", "pillar"],
  },
  {
    file: "product-4.jpg", orientation: "squarish", width: 1000,
    queries: ["pearl pendant necklace", "pearl necklace neutral", "freshwater pearl jewelry"],
    include: ["pearl", "necklace", "pendant"], exclude: ["bathing", "bikini"],
  },
  {
    file: "product-5.jpg", orientation: "squarish", width: 1000,
    queries: ["thin gold ring", "minimal gold band ring", "gold ring white background"],
    include: ["ring"], exclude: ["earring", "couple", "wreath", "ring light", "phone"],
  },
  {
    file: "product-6.jpg", orientation: "squarish", width: 1000,
    queries: ["beaded bracelet handmade", "gold bracelet neutral", "bangle jewelry"],
    include: ["bracelet", "bangle", "beaded"], exclude: ["wreath"],
  },
  {
    file: "product-7.jpg", orientation: "squarish", width: 1000,
    queries: ["gold pendant necklace", "pendant jewelry neutral", "charm necklace gold"],
    include: ["pendant", "necklace", "charm"], exclude: ["man "],
  },
  {
    file: "product-8.jpg", orientation: "squarish", width: 1000,
    queries: ["gold drop earrings", "dangle earrings gold", "statement earrings neutral"],
    include: ["earring", "drop", "dangle"], exclude: ["ball", "knob"],
  },
];

const used = new Set();

function search(query, orientation) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=30&orientation=${orientation}`;
  try {
    const json = curlJson(url);
    return json.results ?? [];
  } catch {
    return [];
  }
}

function matches(slug, include, exclude) {
  const s = slug.toLowerCase();
  const inc = include.length === 0 || include.some((k) => s.includes(k));
  const exc = exclude.some((k) => s.includes(k));
  return inc && !exc;
}

await mkdir(OUT, { recursive: true });

for (const spec of SPECS) {
  let picked = null;
  for (const q of spec.queries) {
    const results = search(q, spec.orientation);
    picked = results.find(
      (r) => r.id && !used.has(r.id) && matches(r.slug || "", spec.include, spec.exclude)
    );
    if (picked) break;
  }
  if (!picked) {
    console.log(`MISS  ${spec.file}  (no on-theme match)`);
    continue;
  }
  used.add(picked.id);
  const sized = `${picked.urls.raw}&w=${spec.width}&q=80&fit=crop&auto=format`;
  const dest = join(OUT, spec.file);
  try {
    curlDownload(sized, dest);
    const kb = (statSync(dest).size / 1024).toFixed(0);
    console.log(`OK    ${spec.file}  ${kb}KB  <- ${picked.slug}`);
  } catch (err) {
    console.log(`FAIL  ${spec.file}  ${err.message}`);
  }
}
