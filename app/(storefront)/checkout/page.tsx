import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Securely complete your order.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <h1 className="text-h1 mb-8 text-balance">Checkout</h1>
        <CheckoutClient />
      </Container>
    </section>
  );
}
