import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="eyebrow">404</span>
      <h1 className="text-display mt-4 text-balance">
        This page slipped away
      </h1>
      <p className="mt-5 max-w-sm leading-relaxed text-stone">
        The page you&apos;re looking for isn&apos;t here — but there&apos;s plenty
        to discover back in the shop.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="primary" size="lg">
          Back home
        </Button>
        <Button href="/shop" variant="outline" size="lg">
          Browse the shop
        </Button>
      </div>
    </Container>
  );
}
