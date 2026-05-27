import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import {
  getAppUrl,
  getSquareClient,
  getSquareLocationId,
  isSquareConfigured,
} from "@/lib/square";
import { GIFT_NOTE_PRICE, TAX_STATE, computeOrderTotals } from "@/lib/pricing";
import { BRAND } from "@/lib/brand";

const cents = (usd: number) => BigInt(Math.round(usd * 100));

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
  const items: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
  const customer: IncomingCustomer = body.customer ?? {};

  const name = str(customer.name);
  const email = str(customer.email);

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
    .select("id, name, price, active, sold_out, stock")
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
    // Re-check tracked stock so the last unit can't be oversold.
    if (product.stock != null && line.quantity > product.stock) {
      return NextResponse.json(
        {
          error:
            product.stock <= 0
              ? `Sorry, "${product.name}" just sold out.`
              : `Sorry, only ${product.stock} of "${product.name}" left.`,
        },
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

  const rawSubtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const { subtotal, shipping, tax, total } = computeOrderTotals(
    rawSubtotal,
    str(customer.state)
  );

  if (total <= 0) {
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
      shipping,
      tax,
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

  // Build a Square hosted-checkout order. Shipping + tax are added as their own
  // line items (fixed amounts) so the Square total exactly equals what we
  // computed and stored — no percentage-tax rounding drift.
  const lineItems = lines.map((l) => ({
    name: l.engraving ? `${l.name} (“${l.engraving}”)` : l.name,
    quantity: String(l.quantity),
    basePriceMoney: { amount: cents(l.unitPrice), currency: "USD" as const },
  }));
  if (shipping > 0) {
    lineItems.push({
      name: "Shipping",
      quantity: "1",
      basePriceMoney: { amount: cents(shipping), currency: "USD" },
    });
  }
  if (tax > 0) {
    lineItems.push({
      name: `Sales tax (${TAX_STATE})`,
      quantity: "1",
      basePriceMoney: { amount: cents(tax), currency: "USD" },
    });
  }

  const appUrl = getAppUrl();
  const square = getSquareClient()!;
  try {
    const result = await square.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId: getSquareLocationId(),
        referenceId: orderId,
        lineItems,
      },
      checkoutOptions: {
        askForShippingAddress: false,
        merchantSupportEmail: BRAND.email,
        acceptedPaymentMethods: { applePay: true, googlePay: true, cashAppPay: true },
        ...(appUrl ? { redirectUrl: `${appUrl}/checkout/success` } : {}),
      },
      prePopulatedData: { buyerEmail: email },
    });

    const link = result.paymentLink;
    if (!link?.url) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
      return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
    }

    await supabase
      .from("orders")
      .update({ square_order_id: link.orderId ?? null, payment_link_id: link.id ?? null })
      .eq("id", orderId);

    return NextResponse.json({ url: link.url });
  } catch (err) {
    await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
    const detail = squareErrorMessage(err);
    console.error("[checkout] payment link failed:", detail);
    return NextResponse.json(
      { error: detail ?? "We couldn't start checkout. Please try again." },
      { status: 502 }
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
