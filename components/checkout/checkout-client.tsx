"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { ActionButton } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons";
import { formatPrice } from "@/lib/utils";
import { computeOrderTotals, TAX_STATE } from "@/lib/pricing";

const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";

const fieldClass =
  "h-12 w-full rounded-xl border border-line-strong bg-cream px-4 text-ink placeholder:text-mist focus:border-oak focus:outline-none";

export function CheckoutClient() {
  const { items, subtotal } = useCart();
  const [status, setStatus] = useState<"idle" | "redirecting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [shipState, setShipState] = useState("");

  const configured = Boolean(LOCATION_ID);
  const totals = computeOrderTotals(subtotal, shipState);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "redirecting") return;
    setError(null);
    setStatus("redirecting");

    const data = new FormData(e.currentTarget);
    const customer = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      line1: String(data.get("line1") ?? ""),
      line2: String(data.get("line2") ?? ""),
      city: String(data.get("city") ?? ""),
      state: String(data.get("state") ?? ""),
      postal: String(data.get("postal") ?? ""),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            giftNote: i.giftNote,
            engraving: i.engraving,
            options: i.options,
          })),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.url) {
        setError(payload.error ?? "We couldn't start checkout. Please try again.");
        setStatus("idle");
        return;
      }
      // Hand off to Square's hosted, secure payment page.
      window.location.href = payload.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="font-serif text-2xl text-ink">Your bag is empty</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sage-dark underline underline-offset-4 hover:text-ink"
        >
          Browse the shop <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="rounded-card border border-line bg-shell px-6 py-8 text-center">
        <p className="font-serif text-xl text-ink">Checkout is being set up</p>
        <p className="mx-auto mt-2 max-w-md text-stone">
          Secure payments aren&apos;t connected yet. Reach us at{" "}
          <Link href="/contact" className="underline">
            contact
          </Link>{" "}
          to place your order in the meantime.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
      {/* Details */}
      <div className="flex flex-col gap-8">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-stone">
            Contact
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Full name" className={fieldClass} />
            <input name="email" type="email" required placeholder="Email" className={fieldClass} />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-stone">
            Shipping address
          </legend>
          <input name="line1" required placeholder="Street address" className={fieldClass} />
          <input name="line2" placeholder="Apt, suite, etc. (optional)" className={fieldClass} />
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="city" required placeholder="City" className={fieldClass} />
            <input
              name="state"
              required
              placeholder="State"
              value={shipState}
              onChange={(e) => setShipState(e.target.value)}
              className={fieldClass}
            />
            <input name="postal" required placeholder="ZIP" className={fieldClass} />
          </div>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="flex h-fit flex-col gap-4 rounded-card border border-line bg-shell p-6">
        <h2 className="font-serif text-xl text-ink">Order summary</h2>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.key} className="flex justify-between gap-3 text-[0.95rem]">
              <span className="text-ink">
                {item.name}
                <span className="text-mist"> × {item.quantity}</span>
              </span>
              <span className="tabular-nums text-stone">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2 border-t border-line pt-4 text-[0.95rem]">
          <div className="flex justify-between">
            <dt className="text-stone">Subtotal</dt>
            <dd className="tabular-nums text-ink">{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Shipping</dt>
            <dd className="tabular-nums text-ink">
              {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Tax</dt>
            <dd className="tabular-nums text-ink">{formatPrice(totals.tax)}</dd>
          </div>
        </dl>
        <div className="flex items-center justify-between border-t border-line pt-4 text-ink">
          <span className="text-stone">Total</span>
          <span className="font-serif text-xl tabular-nums">{formatPrice(totals.total)}</span>
        </div>
        <p className="text-[0.8rem] text-mist">
          Sales tax applies to {TAX_STATE} orders. You&apos;ll pay securely on the next step.
        </p>
        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={status === "redirecting"}
        >
          {status === "redirecting" ? "Taking you to checkout…" : "Continue to payment"}
        </ActionButton>
        {error && <p className="text-sm text-oak-dark">{error}</p>}
      </aside>
    </form>
  );
}
