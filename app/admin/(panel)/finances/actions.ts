"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export async function createTransaction(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;

  const type = String(formData.get("type") || "income") === "expense" ? "expense" : "income";
  const amount = Number(formData.get("amount") || 0) || 0;
  if (!amount) return;

  const occurredRaw = String(formData.get("occurred_on") || "").trim();
  const occurred_on = occurredRaw || todayISO();
  const category = String(formData.get("category") || "").trim() || "Other";
  const description = String(formData.get("description") || "").trim();
  const paymentRaw = String(formData.get("payment_method") || "").trim();
  const payment_method = paymentRaw || null;

  // Optional receipt upload → store the storage PATH (private bucket).
  let receipt_url: string | null = null;
  const file = formData.get("receipt") as File | null;
  if (file && typeof file === "object" && file.size > 0) {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `receipts/${crypto.randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await db.storage
      .from("receipts")
      .upload(path, bytes, { contentType: file.type || "application/octet-stream", upsert: false });
    if (uploadError) {
      console.error("receipt upload:", uploadError.message);
    } else {
      receipt_url = path;
    }
  }

  await db.from("finance_transactions").insert({
    type,
    amount,
    occurred_on,
    category,
    description,
    payment_method,
    receipt_url,
  });

  revalidatePath("/admin/finances");
  revalidatePath("/admin");
}

export async function deleteTransaction(formData: FormData) {
  const db = getSupabaseAdmin();
  if (!db) return;
  const id = String(formData.get("id") || "");
  if (!id) return;

  // Best-effort: remove the receipt file from storage if one is linked.
  const { data: row } = await db
    .from("finance_transactions")
    .select("receipt_url")
    .eq("id", id)
    .maybeSingle();
  const path = row?.receipt_url as string | null | undefined;
  if (path) {
    const { error: removeError } = await db.storage.from("receipts").remove([path]);
    if (removeError) console.error("receipt remove:", removeError.message);
  }

  await db.from("finance_transactions").delete().eq("id", id);

  revalidatePath("/admin/finances");
  revalidatePath("/admin");
}
