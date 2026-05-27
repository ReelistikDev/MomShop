/** Surcharge (USD) added to a line when a gift note is included with the order. */
export const GIFT_NOTE_PRICE = 2;

/* ---------------------------------------------------------------------------
   Shipping + tax rules.

   These are the single source of truth for order totals: the checkout page
   imports them to preview the total as the customer types, and the server
   re-runs the same functions before charging. Edit the constants below to
   change rates — no other file needs to change.
--------------------------------------------------------------------------- */

/** Flat shipping fee (USD), waived once the subtotal reaches the threshold. */
export const SHIPPING_FLAT = 6;
/** Subtotal (USD) at or above which shipping is free. */
export const FREE_SHIPPING_THRESHOLD = 75;

/** Sales tax is collected only for orders shipping to this state. */
export const TAX_STATE = "NC";
export const TAX_STATE_NAME = "North Carolina";
/** Combined state + local rate applied to taxable orders (Asheville, NC ≈ 7.25%). */
export const TAX_RATE = 0.0725;

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}

/** True when an order shipping to `state` is taxable (accepts code or full name). */
export function isTaxableState(state: string): boolean {
  const s = state.trim().toUpperCase();
  return s === TAX_STATE || s === TAX_STATE_NAME.toUpperCase();
}

/** NC taxes shipping on taxable goods, so the tax base includes shipping. */
export function computeOrderTotals(subtotal: number, state: string): OrderTotals {
  const sub = round2(Math.max(0, subtotal));
  const shipping = computeShipping(sub);
  const tax = isTaxableState(state) ? round2((sub + shipping) * TAX_RATE) : 0;
  return { subtotal: sub, shipping, tax, total: round2(sub + shipping + tax) };
}
