"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice, cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, remove, subtotal, count } =
    useCart();

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] overflow-hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeCart}
      />

      {/* Panel */}
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-lift transition-transform duration-[400ms] ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Shopping bag"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-xl text-ink">
            Your bag{count > 0 && <span className="text-mist"> · {count}</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 text-ink hover:bg-shell"
            aria-label="Close bag"
          >
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-serif text-2xl text-ink">Your bag is empty</p>
            <p className="max-w-xs text-stone">
              Quiet, everyday pieces — made by hand and ready to gift.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-2 inline-flex items-center gap-2 text-sage-dark underline underline-offset-4 hover:text-ink"
            >
              Browse the shop <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="flex flex-col gap-5">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-shell">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <p className="font-serif text-[1.05rem] text-ink">
                          {item.name}
                        </p>
                        <span className="text-[0.9rem] tabular-nums text-stone">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      {item.options && (
                        <p className="mt-0.5 text-[0.8rem] text-mist">
                          {Object.values(item.options).join(" · ")}
                        </p>
                      )}
                      {item.engraving && (
                        <p className="text-[0.8rem] italic text-mist">
                          “{item.engraving}”
                        </p>
                      )}
                      {item.giftNote && (
                        <p className="mt-0.5 text-[0.8rem] text-mist">
                          <span className="text-sage-dark">Gift note (+$2):</span>{" "}
                          <span className="italic">“{item.giftNote}”</span>
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-line-strong">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity - 1)
                            }
                            className="p-1.5 text-stone hover:text-ink"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-7 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.key, item.quantity + 1)
                            }
                            className="p-1.5 text-stone hover:text-ink"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item.key)}
                          className="text-[0.8rem] text-mist underline underline-offset-2 hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-line px-6 py-5">
              <div className="flex items-center justify-between text-ink">
                <span className="text-stone">Subtotal</span>
                <span className="font-serif text-xl tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-[0.8rem] text-mist">
                Shipping and any personalization confirmed at checkout.
              </p>
              <Button
                href="/checkout"
                variant="primary"
                size="lg"
                className="mt-4 w-full"
                onClick={closeCart}
              >
                Checkout
              </Button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
