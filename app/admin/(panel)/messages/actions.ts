"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function setMessageRead(formData: FormData) {
  const id = String(formData.get("id") || "");
  const read = String(formData.get("read") || "") === "true";
  const db = getSupabaseAdmin();
  if (!db || !id) return;
  await db.from("contact_messages").update({ read }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  const id = String(formData.get("id") || "");
  const db = getSupabaseAdmin();
  if (!db || !id) return;
  await db.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}
