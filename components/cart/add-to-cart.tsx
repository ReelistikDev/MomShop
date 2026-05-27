"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/cart-provider";
import { ActionButton } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { cn, formatPrice } from "@/lib/utils";
import { GIFT_NOTE_PRICE } from "@/lib/pricing";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const variants = product.variants ?? [];
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(variants.map((v) => [v.name, v.options[0]]))
  );
  const [engraving, setEngraving] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  const soldOut = Boolean(product.soldOut);
  const note = giftNote.trim();

  function handleAdd() {
    if (soldOut) return;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price + (note ? GIFT_NOTE_PRICE : 0),
      image: product.images[0] ?? "",
      options: variants.length > 0 ? options : undefined,
      engraving: engraving.trim() || undefined,
      giftNote: note || undefined,
      quantity,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {variants.map((variant) => (
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
              {engraving.length}/12
            </span>
          </div>
          <input
            type="text"
            maxLength={12}
            value={engraving}
            onChange={(e) => setEngraving(e.target.value)}
            placeholder="Initial, date, or short word"
            className="h-12 w-full rounded-xl border border-line-strong bg-cream px-4 text-ink placeholder:text-mist focus:border-oak focus:outline-none"
          />
          <p className="mt-1.5 text-[0.82rem] text-mist">
            Hand-engraved — leave blank for none.
          </p>
        </div>
      )}

      {/* Send a note — optional gift note included with the order (+$2) */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-stone">
            Send a note
          </span>
          <span className="text-[0.8rem] font-medium text-sage-dark">
            +{formatPrice(GIFT_NOTE_PRICE)}
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={300}
          value={giftNote}
          onChange={(e) => setGiftNote(e.target.value)}
          placeholder="Write a gift note to include with your order (optional)"
          className="w-full rounded-xl border border-line-strong bg-cream px-4 py-3 text-ink placeholder:text-mist focus:border-oak focus:outline-none"
        />
        <p className="mt-1.5 text-[0.82rem] text-mist">
          {note
            ? `Your gift note will be included for ${formatPrice(GIFT_NOTE_PRICE)}.`
            : `We'll include your gift note with the order for ${formatPrice(GIFT_NOTE_PRICE)}. Leave blank to skip.`}
        </p>
      </div>

      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded-full border border-line-strong px-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2.5 text-stone hover:text-ink disabled:opacity-40"
            aria-label="Decrease quantity"
            disabled={soldOut}
          >
            <MinusIcon />
          </button>
          <span className="w-8 text-center tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2.5 text-stone hover:text-ink disabled:opacity-40"
            aria-label="Increase quantity"
            disabled={soldOut}
          >
            <PlusIcon />
          </button>
        </div>
        <ActionButton
          variant="primary"
          size="lg"
          onClick={handleAdd}
          className="flex-1"
          disabled={soldOut}
        >
          {soldOut ? "Sold out" : "Add to bag"}
        </ActionButton>
      </div>
    </div>
  );
}
