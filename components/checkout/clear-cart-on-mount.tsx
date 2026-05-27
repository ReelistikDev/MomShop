"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/cart-provider";

/** Empties the bag once the buyer reaches the post-payment success page. */
export function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
