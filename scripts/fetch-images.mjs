// One-off: pull a curated, on-theme set of handmade WOOD + LEATHER EARRING
// photos (and a maker/workshop story shot) from Unsplash into /public/images.
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
    queries: ["woman wearing wooden statement earrings", "woman wearing wooden earrings", "model wearing wood earrings"],
    include: ["earring"],
    exclude: ["man ", "gold", "diamond"],
  },
  {
    file: "banner-craft.jpg", orientation: "landscape", width: 1800,
    queries: ["woodworking laser cut craft", "carving wood workshop hands", "wood maker workshop tools"],
    include: ["wood", "laser", "carv", "workshop", "craft", "maker", "workbench", "saw", "tools"],
    exclude: [],
  },
  {
    file: "banner-lifestyle.jpg", orientation: "landscape", width: 1800,
    queries: ["wooden earrings flat lay neutral", "handmade earrings flat lay linen", "wood jewelry styled neutral"],
    include: ["earring", "wood", "leather", "flat lay", "flatlay"],
    exclude: ["man ", "gold ring", "diamond"],
  },
  {
    file: "custom.jpg", orientation: "landscape", width: 1600,
    queries: ["laser engraving wood", "wood earrings making process", "carving wood earrings detail"],
    include: ["wood", "earring", "engrav", "laser", "carv", "craft"],
    exclude: ["man "],
  },
  {
    file: "about.jpg", orientation: "portrait", width: 1200,
    queries: ["woman maker wood studio hands", "artisan wood jewelry studio", "craftswoman workshop wood"],
    include: ["wood", "studio", "maker", "hands", "workshop", "craft", "carv", "artisan"],
    exclude: ["cross", "couple"],
  },
  {
    file: "material-wood.jpg", orientation: "portrait", width: 1100,
    queries: ["wooden earrings", "wood earrings handmade", "wood dangle earrings"],
    include: ["earring"],
    exclude: ["gold", "diamond"],
  },
  {
    file: "material-leather.jpg", orientation: "portrait", width: 1100,
    queries: ["leather earrings", "leather earrings handmade", "leather statement earrings"],
    include: ["earring"],
    exclude: ["gold", "diamond"],
  },
  {
    file: "material-mixed.jpg", orientation: "portrait", width: 1100,
    queries: ["geometric statement earrings neutral", "modern wood earrings", "handmade dangle earrings neutral"],
    include: ["earring"],
    exclude: ["gold", "diamond"],
  },
  {
    file: "product-1.jpg", orientation: "squarish", width: 1000,
    queries: ["wood stud earrings", "wooden stud earrings neutral", "small wood earrings"],
    include: ["earring"], exclude: ["gold", "diamond"],
  },
  {
    file: "product-2.jpg", orientation: "squarish", width: 1000,
    queries: ["wooden hoop earrings", "wood hoop earrings neutral", "round wood earrings"],
    include: ["earring"], exclude: ["gold", "diamond"],
  },
  {
    file: "product-3.jpg", orientation: "squarish", width: 1000,
    queries: ["laser cut wood earrings", "geometric wood earrings", "wood drop earrings"],
    include: ["earring"], exclude: ["gold", "diamond"],
  },
  {
    file: "product-4.jpg", orientation: "squarish", width: 1000,
    queries: ["wood statement earrings", "large wooden earrings", "wood dangle earrings neutral"],
    include: ["earring"], exclude: ["gold", "diamond"],
  },
  {
    file: "product-5.jpg", orientation: "squarish", width: 1000,
    queries: ["leather earrings handmade", "leather drop earrings", "leather teardrop earrings"],
    include: ["earring"], exclude: ["gold", "diamond"],
  },
  {
    file: "product-6.jpg", orientation: "squarish", width: 1000,
    queries: ["leather statement earrings", "leather fringe earrings", "leather dangle earrings"],
    include: ["earring"], exclude: ["gold", "diamond"],
  },
  {
    file: "product-7.jpg", orientation: "squarish", width: 1000,
    queries: ["leather stud earrings", "small leather earrings", "minimal leather earrings"],
    include: ["earring"], exclude: ["gold", "diamond"],
  },
  {
    file: "product-8.jpg", orientation: "squarish", width: 1000,
    queries: ["handmade dangle earrings neutral", "modern earrings neutral background", "boho earrings handmade"],
    include: ["earring"], exclude: ["gold", "diamond"],
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
