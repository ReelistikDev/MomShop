import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { getSquareClient, getSquareLocationId, isSquareConfigured } from "@/lib/square";
import { GIFT_NOTE_PRICE } from "@/lib/pricing";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type IncomingItem = {
  productId?: unknown;
  quantity?: unknown;
  giftNote?: unknown;
  engraving?: unknown;
  options?: unknown;
};

type IncomingCustomer = {
  name?: unknown;
  email?: unknown;
  line1?: unknown;
  line2?: unknown;
  city?: unknown;
  state?: unknown;
  postal?: unknown;
  country?: unknown;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  if (!isSquareConfigured() || !isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Checkout isn't available right now. Please reach out to place your order." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const sourceId = str(body.sourceId);
  const idempotencyKey = str(body.idempotencyKey) || randomUUID();
  const items: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
  const customer: IncomingCustomer = body.customer ?? {};

  const name = str(customer.name);
  const email = str(customer.email);

  if (!sourceId) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  }
  if (!name || !EMAIL.test(email)) {
    return NextResponse.json(
      { error: "Please provide your name and a valid email." },
      { status: 400 }
    );
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  // Normalize the requested lines (server still re-prices everything below).
  const requested = items.map((it) => ({
    productId: str(it.productId),
    quantity: Math.floor(Number(it.quantity)),
    giftNote: str(it.giftNote),
    engraving: str(it.engraving),
    options:
      it.options && typeof it.options === "object" && !Array.isArray(it.options)
        ? (it.options as Record<string, unknown>)
        : {},
  }));

  if (requested.some((l) => !l.productId || !Number.isInteger(l.quantity) || l.quantity < 1)) {
    return NextResponse.json({ error: "Invalid items in your bag." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin()!;

  // Authoritative pricing: look up the products in the DB and ignore any prices
  // sent by the client. Only active products can be purchased.
  const ids = [...new Set(requested.map((l) => l.productId))];
  const { data: rows, error: lookupError } = await supabase
    .from("products")
    .select("id, name, price, active, sold_out")
    .in("id", ids)
    .eq("active", true);

  if (lookupError) {
    console.error("[checkout] product lookup failed:", lookupError.message);
    return NextResponse.json({ error: "Could not verify your order." }, { status: 500 });
  }

  const byId = new Map((rows ?? []).map((r) => [r.id as string, r]));

  const lines: {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    giftNote: string;
    engraving: string;
    options: Record<string, unknown>;
  }[] = [];

  for (const line of requested) {
    const product = byId.get(line.productId);
    if (!product || product.sold_out) {
      return NextResponse.json(
        { error: "One or more items are no longer available." },
        { status: 409 }
      );
    }
    const unitPrice = Number(product.price) + (line.giftNote ? GIFT_NOTE_PRICE : 0);
    lines.push({
      productId: line.productId,
      name: product.name as string,
      unitPrice,
      quantity: line.quantity,
      giftNote: line.giftNote,
      engraving: line.engraving,
      options: line.options,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const total = subtotal; // shipping/tax handled offline for now
  const amountCents = Math.round(total * 100);

  if (amountCents <= 0) {
    return NextResponse.json({ error: "Order total must be greater than zero." }, { status: 400 });
  }

  // Persist a pending order first so a charge is always traceable to a record.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      status: "pending",
      customer_name: name,
      customer_email: email,
      ship_line1: str(customer.line1) || null,
      ship_line2: str(customer.line2) || null,
      ship_city: str(customer.city) || null,
      ship_state: str(customer.state) || null,
      ship_postal: str(customer.postal) || null,
      ship_country: "US",
      subtotal,
      total,
      currency: "USD",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[checkout] order insert failed:", orderError?.message);
    return NextResponse.json({ error: "Could not start your order." }, { status: 500 });
  }

  const orderId = order.id as string;

  const { error: itemsError } = await supabase.from("order_items").insert(
    lines.map((l) => ({
      order_id: orderId,
      product_id: l.productId,
      name: l.name,
      unit_price: l.unitPrice,
      quantity: l.quantity,
      gift_note: l.giftNote || null,
      engraving: l.engraving || null,
      options: l.options,
    }))
  );

  if (itemsError) {
    console.error("[checkout] order_items insert failed:", itemsError.message);
    await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
    return NextResponse.json({ error: "Could not start your order." }, { status: 500 });
  }

  // Charge the card with Square.
  const square = getSquareClient()!;
  try {
    const result = await square.payments.create({
      sourceId,
      idempotencyKey,
      amountMoney: { amount: BigInt(amountCents), currency: "USD" },
      locationId: getSquareLocationId(),
      buyerEmailAddress: email,
      referenceId: orderId,
      note: `MomShop order ${orderId}`,
      ...(str(customer.line1)
        ? {
            shippingAddress: {
              addressLine1: str(customer.line1),
              addressLine2: str(customer.line2) || undefined,
              locality: str(customer.city) || undefined,
              administrativeDistrictLevel1: str(customer.state) || undefined,
              postalCode: str(customer.postal) || undefined,
              country: "US" as const,
            },
          }
        : {}),
    });

    const payment = result.payment;
    if (!payment || payment.status === "FAILED") {
      await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
      return NextResponse.json({ error: "Payment was declined." }, { status: 402 });
    }

    await supabase
      .from("orders")
      .update({
        status: "paid",
        square_payment_id: payment.id ?? null,
        square_receipt_url: payment.receiptUrl ?? null,
      })
      .eq("id", orderId);

    // Record the sale as income for the finance dashboard (best-effort).
    await supabase
      .from("finance_transactions")
      .insert({
        type: "income",
        amount: total,
        category: "Sales",
        description: `Online order ${orderId}`,
        payment_method: "Square",
      })
      .then(({ error }) => {
        if (error) console.error("[checkout] finance log failed:", error.message);
      });

    return NextResponse.json({ orderId, receiptUrl: payment.receiptUrl ?? null });
  } catch (err) {
    await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
    const detail = squareErrorMessage(err);
    console.error("[checkout] payment failed:", detail);
    return NextResponse.json(
      { error: detail ?? "We couldn't process your payment. Please try again." },
      { status: 402 }
    );
  }
}

/** Pull a customer-safe message out of a Square SDK error, if present. */
function squareErrorMessage(err: unknown): string | null {
  if (err && typeof err === "object") {
    const maybe = err as { errors?: { detail?: string; code?: string }[]; message?: string };
    const first = maybe.errors?.[0];
    if (first?.detail) return first.detail;
    if (typeof maybe.message === "string") return maybe.message;
  }
  return null;
}
