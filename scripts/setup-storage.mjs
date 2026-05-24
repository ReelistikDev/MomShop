// Create the Supabase Storage buckets used by the admin: `media` (public —
// product photos) and `receipts` (private — finance receipts). Idempotent.
// Reads keys from the gitignored .env.local; nothing printed or committed.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  const out = {};
  try {
    const buf = readFileSync(file);
    const text =
      buf[0] === 0xff && buf[1] === 0xfe
        ? buf.toString("utf16le").replace(/^﻿/, "")
        : buf.toString("utf8").replace(/^﻿/, "");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  } catch {}
  return out;
}

const env = { ...loadEnv(".env.local"), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local.");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const buckets = [
  { name: "media", options: { public: true } },
  { name: "receipts", options: { public: false } },
];

for (const { name, options } of buckets) {
  const { error } = await sb.storage.createBucket(name, options);
  if (error && !/already exists|duplicate/i.test(error.message)) {
    console.error(`bucket ${name}: ${error.message}`);
    process.exitCode = 1;
  } else {
    console.log(`bucket ${name} ${options.public ? "(public)" : "(private)"} ready`);
  }
}
