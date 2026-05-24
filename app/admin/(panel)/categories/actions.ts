"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function createCategory(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const slug = slugify(String(formData.get("slug") || "") || name);
  if (!slug) return;
  const description = String(formData.get("description") || "").trim();
  const sort_order = Number(formData.get("sort_order") || 0) || 0;
  await db
    .from("categories")
    .upsert({ slug, name, description, sort_order, active: true });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function toggleCategoryActive(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const slug = String(formData.get("slug") || "");
  const active = String(formData.get("active") || "") === "true";
  if (!slug) return;
  await db.from("categories").update({ active }).eq("slug", slug);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function deleteCategory(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const slug = String(formData.get("slug") || "");
  if (!slug) return;
  await db.from("categories").delete().eq("slug", slug);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}
