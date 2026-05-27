"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { ActionButton } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons";
import { formatPrice } from "@/lib/utils";
import { computeOrderTotals, TAX_STATE } from "@/lib/pricing";

interface SquareTokenizeResult {
  status: string;
  token?: string;
  errors?: { message: string }[];
}
interface SquareCard {
  attach(selector: string): Promise<void>;
  tokenize(): Promise<SquareTokenizeResult>;
  destroy(): Promise<void>;
}
interface SquarePayments {
  card(): Promise<SquareCard>;
}
interface SquareSdk {
  payments(appId: string, locationId: string): SquarePayments;
}
declare global {
  interface Window {
    Square?: SquareSdk;
  }
}

const APP_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? "";
const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
const SDK_URL =
  process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "sandbox"
    ? "https://sandbox.web.squarecdn.com/v1/square.js"
    : "https://web.squarecdn.com/v1/square.js";

const fieldClass =
  "h-12 w-full rounded-xl border border-line-strong bg-cream px-4 text-ink placeholder:text-mist focus:border-oak focus:outline-none";

function loadSquareSdk(): Promise<SquareSdk> {
  return new Promise((resolve, reject) => {
    if (window.Square) return resolve(window.Square);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    const onReady = () =>
      window.Square ? resolve(window.Square) : reject(new Error("Square SDK failed to load"));
    if (existing) {
      existing.addEventListener("load", onReady);
      existing.addEventListener("error", () => reject(new Error("Square SDK failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = onReady;
    script.onerror = () => reject(new Error("Square SDK failed to load"));
    document.head.appendChild(script);
  });
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const cardRef = useRef<SquareCard | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "paying">("idle");
  const [error, setError] = useState<string | null>(null);
  const [shipState, setShipState] = useState("");

  const configured = Boolean(APP_ID && LOCATION_ID);
  const totals = computeOrderTotals(subtotal, shipState);

  useEffect(() => {
    if (!configured || items.length === 0) return;
    let card: SquareCard | null = null;
    let cancelled = false;

    loadSquareSdk()
      .then(async (sq) => {
        const payments = sq.payments(APP_ID, LOCATION_ID);
        card = await payments.card();
        if (cancelled) {
          await card.destroy();
          return;
        }
        await card.attach("#card-container");
        cardRef.current = card;
        setCardReady(true);
      })
      .catch(() => setError("Couldn't load the secure card form. Please refresh and try again."));

    return () => {
      cancelled = true;
      card?.destroy().catch(() => {});
      cardRef.current = null;
    };
  }, [configured, items.length]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cardRef.current || status === "paying") return;
    setError(null);
    setStatus("paying");

    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK" || !result.token) {
        setError(result.errors?.[0]?.message ?? "Please check your card details and try again.");
        setStatus("idle");
        return;
      }

      const form = e.currentTarget;
      const data = new FormData(form);
      const customer = {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        line1: String(data.get("line1") ?? ""),
        line2: String(data.get("line2") ?? ""),
        city: String(data.get("city") ?? ""),
        state: String(data.get("state") ?? ""),
        postal: String(data.get("postal") ?? ""),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: result.token,
          idempotencyKey: crypto.randomUUID(),
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
      if (!res.ok) {
        setError(payload.error ?? "We couldn't process your payment. Please try again.");
        setStatus("idle");
        return;
      }

      clear();
      router.push("/checkout/success");
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
          Secure card payments aren&apos;t connected yet. Reach us at{" "}
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
      {/* Details + payment */}
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

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-stone">
            Payment
          </legend>
          <div
            id="card-container"
            className="min-h-[52px] rounded-xl border border-line-strong bg-cream px-3 py-2"
          />
          {!cardReady && !error && (
            <p className="text-[0.85rem] text-mist">Loading secure card form…</p>
          )}
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
          Sales tax applies to {TAX_STATE} orders. Enter your state to see your total.
        </p>
        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!cardReady || status === "paying"}
        >
          {status === "paying" ? "Processing…" : `Pay ${formatPrice(totals.total)}`}
        </ActionButton>
        {error && <p className="text-sm text-oak-dark">{error}</p>}
      </aside>
    </form>
  );
}
