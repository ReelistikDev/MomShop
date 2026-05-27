import { NextResponse } from "next/server";
import { WebhooksHelper } from "square";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAppUrl, getSquareWebhookSignatureKey } from "@/lib/square";

// Square notifies us here when a hosted-checkout payment completes. The
// redirect back to the site is for UX only; THIS is the authoritative
// confirmation that flips an order to "paid" and records the sale.
export async function POST(req: Request) {
  const raw = await req.text();
  const signatureKey = getSquareWebhookSignatureKey();
  const notificationUrl = `${getAppUrl()}/api/square/webhook`;
  const signature = req.headers.get("x-square-hmacsha256-signature") ?? "";

  if (!signatureKey || !getAppUrl()) {
    console.error("[square webhook] missing SQUARE_WEBHOOK_SIGNATURE_KEY or APP_URL");
    return NextResponse.json({ ok: true });
  }

  const valid = await WebhooksHelper.verifySignature({
    requestBody: raw,
    signatureHeader: signature,
    signatureKey,
    notificationUrl,
  }).catch(() => false);

  if (!valid) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let event: unknown;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const payment = extractCompletedPayment(event);
  if (!payment?.orderId) {
    return NextResponse.json({ ok: true });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  // Idempotent: only the first COMPLETED notification transitions pending→paid,
  // so duplicate deliveries can't double-record the sale.
  const { data: updated, error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      square_payment_id: payment.id ?? null,
      square_receipt_url: payment.receiptUrl ?? null,
    })
    .eq("square_order_id", payment.orderId)
    .eq("status", "pending")
    .select("id, total")
    .maybeSingle();

  if (error) {
    console.error("[square webhook] order update failed:", error.message);
    return NextResponse.json({ ok: true });
  }

  if (updated) {
    await supabase
      .from("finance_transactions")
      .insert({
        type: "income",
        amount: updated.total,
        category: "Sales",
        description: `Online order ${updated.id}`,
        payment_method: "Square",
      })
      .then(({ error: finErr }) => {
        if (finErr) console.error("[square webhook] finance log failed:", finErr.message);
      });
  }

  return NextResponse.json({ ok: true });
}

type CompletedPayment = { id?: string; orderId?: string; receiptUrl?: string };

function extractCompletedPayment(event: unknown): CompletedPayment | null {
  if (!event || typeof event !== "object") return null;
  const e = event as {
    type?: string;
    data?: { object?: { payment?: Record<string, unknown> } };
  };
  if (e.type !== "payment.updated" && e.type !== "payment.created") return null;
  const p = e.data?.object?.payment;
  if (!p || p.status !== "COMPLETED") return null;
  return {
    id: typeof p.id === "string" ? p.id : undefined,
    orderId: typeof p.order_id === "string" ? p.order_id : undefined,
    receiptUrl: typeof p.receipt_url === "string" ? p.receipt_url : undefined,
  };
}
