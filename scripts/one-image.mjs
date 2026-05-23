// Re-fetch a single image: node one-image.mjs <file> <orientation> <width> "<inc,inc>" "<exc,exc>" "q1" "q2" ...
import { statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const [file, orientation, width, incRaw, excRaw, ...queries] = process.argv.slice(2);
const include = incRaw ? incRaw.split(",").filter(Boolean) : [];
const exclude = excRaw ? excRaw.split(",").filter(Boolean) : [];
const OUT = join(process.cwd(), "public", "images");

function curlJson(url) {
  return JSON.parse(
    execFileSync("curl", ["-s", "-H", "Accept: application/json", url], {
      maxBuffer: 64 * 1024 * 1024,
    }).toString("utf8")
  );
}
const matches = (slug) => {
  const s = slug.toLowerCase();
  return (
    (include.length === 0 || include.some((k) => s.includes(k))) &&
    !exclude.some((k) => s.includes(k))
  );
};

for (const q of queries) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(
    q
  )}&per_page=30&orientation=${orientation}`;
  const results = curlJson(url).results ?? [];
  const pick = results.find((r) => r.id && matches(r.slug || ""));
  if (pick) {
    const sized = `${pick.urls.raw}&w=${width}&q=80&fit=crop&auto=format`;
    const dest = join(OUT, file);
    execFileSync("curl", ["-s", "-L", "-o", dest, sized], { maxBuffer: 64 * 1024 * 1024 });
    console.log(`OK ${file} ${(statSync(dest).size / 1024).toFixed(0)}KB <- ${pick.slug}`);
    process.exit(0);
  }
}
console.log(`MISS ${file}`);
