import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeartIcon, SprigIcon } from "@/components/icons";
import { ClearCartOnMount } from "@/components/checkout/clear-cart-on-mount";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Thank you for your order.",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <section className="py-20 lg:py-28">
      <ClearCartOnMount />
      <Container size="narrow" className="text-center">
        <SprigIcon className="mx-auto mb-5 h-8 w-8 text-sage" />
        <span className="eyebrow">Thank you</span>
        <h1 className="text-display mt-4 text-balance">
          Your order is{" "}
          <span className="italic text-sage-dark">on its way to us.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-stone">
          We&apos;ve received your order and sent a receipt to your email. We&apos;ll
          be in touch shortly with tracking details.
        </p>
        <p className="mt-6 flex items-center justify-center gap-2 font-script text-2xl text-ink">
          Made with love
          <HeartIcon className="h-4 w-4 text-heart" />
        </p>
        <div className="mt-8">
          <Button href="/shop" variant="primary" size="lg">
            Keep shopping
          </Button>
        </div>
      </Container>
    </section>
  );
}
