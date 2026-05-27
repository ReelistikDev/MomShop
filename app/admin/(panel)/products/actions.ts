"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isMailConfigured } from "@/lib/mailer";
import { sendProductAnnouncement } from "@/lib/emails";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
}

async function uniqueSlug(db: SupabaseClient, base: string, ignoreId?: string) {
  let slug = base || "item";
  for (let i = 0; i < 20; i++) {
    const q = db.from("products").select("id").eq("slug", slug).limit(1);
    const { data } = await q;
    const taken = (data ?? []).some((r: { id: string }) => r.id !== ignoreId);
    if (!taken) return slug;
    slug = `${base}-${Math.random().toString(36).slice(2, 5)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

async function uploadImage(db: SupabaseClient, file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await db.storage
    .from("media")
    .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) {
    console.error("image upload:", error.message);
    return null;
  }
  return db.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function parseFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const badge = String(formData.get("badge") || "none");
  const stockRaw = String(formData.get("stock") || "").trim();
  return {
    name,
    category: String(formData.get("category") || "") || null,
    price: Number(formData.get("price") || 0) || 0,
    short_description: String(formData.get("short_description") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    badge: badge === "none" ? null : badge,
    // Blank = untracked (null); otherwise a non-negative integer.
    stock: stockRaw === "" ? null : Math.max(0, Math.floor(Number(stockRaw)) || 0),
    sold_out: formData.get("sold_out") === "on",
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };
}

export async function createProduct(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const fields = parseFields(formData);
  if (!fields.name) return;

  const slug = await uniqueSlug(db, slugify(fields.name));
  const imageUrl = await uploadImage(db, formData.get("image") as File);

  await db.from("products").insert({
    ...fields,
    slug,
    images: imageUrl ? [imageUrl] : [],
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  const fields = parseFields(formData);

  const imageUrl = await uploadImage(db, formData.get("image") as File);
  const patch: Record<string, unknown> = { ...fields };
  if (imageUrl) patch.images = [imageUrl]; // only replace when a new file is given

  await db.from("products").update(patch).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const id = String(formData.get("id") || "");
  if (!id) return;
  await db.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function announceProduct(formData: FormData) {
  const db = getSupabaseAdmin();
  const id = String(formData.get("id") || "");
  if (!db || !id || !isMailConfigured()) return;

  const { data: product } = await db
    .from("products")
    .select("name, slug, short_description, images")
    .eq("id", id)
    .single();
  if (!product) return;

  const { data: subs } = await db
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .eq("status", "confirmed");
  const recipients = subs ?? [];

  const { data: bc } = await db
    .from("broadcasts")
    .insert({
      subject: `New in the shop: ${product.name}`,
      body: `Product announcement: ${product.name}`,
      status: "sending",
      recipient_count: recipients.length,
    })
    .select("id")
    .single();

  const sent = await sendProductAnnouncement(product, recipients);

  if (bc?.id) {
    await db
      .from("broadcasts")
      .update({
        status: sent > 0 || recipients.length === 0 ? "sent" : "failed",
        sent_count: sent,
        sent_at: new Date().toISOString(),
      })
      .eq("id", bc.id);
  }
  revalidatePath("/admin/products");
  revalidatePath("/admin/broadcasts");
}

export async function quickToggle(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const id = String(formData.get("id") || "");
  const fieldName = String(formData.get("field") || "");
  const value = String(formData.get("value") || "") === "true";
  if (!id || !["active", "sold_out", "featured"].includes(fieldName)) return;
  await db.from("products").update({ [fieldName]: value }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
