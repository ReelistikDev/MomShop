"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/cart-provider";
import { ActionButton } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants.map((v) => [v.name, v.options[0]]))
  );
  const [engraving, setEngraving] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      options,
      engraving: engraving.trim() || undefined,
      quantity,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {product.variants.map((variant) => (
        <div key={variant.name}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-stone">
              {variant.name}
            </span>
            <span className="text-[0.85rem] text-mist">
              {options[variant.name]}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((opt) => {
              const selected = options[variant.name] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setOptions((prev) => ({ ...prev, [variant.name]: opt }))
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all duration-200",
                    selected
                      ? "border-ink bg-ink text-cream"
                      : "border-line-strong bg-cream text-ink hover:border-oak"
                  )}
                  aria-pressed={selected}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {product.personalizable && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-stone">
              Personalize
            </span>
            <span className="text-[0.8rem] text-mist">
              {engraving.length}/8
            </span>
          </div>
          <input
            type="text"
            maxLength={8}
            value={engraving}
            onChange={(e) => setEngraving(e.target.value)}
            placeholder="Initial, date, or short word"
            className="h-12 w-full rounded-xl border border-line-strong bg-cream px-4 text-ink placeholder:text-mist focus:border-oak focus:outline-none"
          />
          <p className="mt-1.5 text-[0.82rem] text-mist">
            Hand-stamped by us — leave blank for no engraving.
          </p>
        </div>
      )}

      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded-full border border-line-strong px-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2.5 text-stone hover:text-ink"
            aria-label="Decrease quantity"
          >
            <MinusIcon />
          </button>
          <span className="w-8 text-center tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2.5 text-stone hover:text-ink"
            aria-label="Increase quantity"
          >
            <PlusIcon />
          </button>
        </div>
        <ActionButton
          variant="primary"
          size="lg"
          onClick={handleAdd}
          className="flex-1"
        >
          Add to bag
        </ActionButton>
      </div>
    </div>
  );
}
