// Apply supabase/migrations/*.sql directly to Supabase Postgres.
// Reads keys from the gitignored .env.local (handles UTF-8 or UTF-16).
// SUPABASE_DB_URL may be a full postgres:// URI OR just the DB password (in
// which case we build the connection from the project ref). Dev-only helper —
// nothing is printed or committed.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

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
const raw = env.SUPABASE_DB_URL;
const supaUrl = env.NEXT_PUBLIC_SUPABASE_URL || "";
const ref = (supaUrl.match(/https?:\/\/([a-z0-9]+)\.supabase\.co/) || [])[1];

let config;
if (raw && /^postgres(ql)?:\/\//i.test(raw)) {
  config = { connectionString: raw };
} else if (raw && ref) {
  // treat SUPABASE_DB_URL value as the database password
  config = {
    host: `db.${ref}.supabase.co`,
    port: 5432,
    user: "postgres",
    password: raw,
    database: "postgres",
  };
} else {
  console.error("Need SUPABASE_DB_URL (URI or password) + NEXT_PUBLIC_SUPABASE_URL in .env.local.");
  process.exit(1);
}
config.ssl = { rejectUnauthorized: false };
config.connectionTimeoutMillis = 15000;

const dir = join(process.cwd(), "supabase", "migrations");
// Optional arg = apply only that one file (e.g. "0002_newsletter.sql").
const only = process.argv[2];
const files = only
  ? [only]
  : readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

const client = new Client(config);
try {
  await client.connect();
  console.log("connected ✓");
  for (const f of files) {
    process.stdout.write(`applying ${f} ... `);
    await client.query(readFileSync(join(dir, f), "utf8"));
    console.log("ok");
  }
  console.log("All migrations applied ✓");
} catch (err) {
  console.error("FAILED:", err.code || "", err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
