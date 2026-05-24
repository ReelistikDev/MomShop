import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeartIcon, SprigIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "You're confirmed",
  robots: { index: false },
};

export default function ConfirmedPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <SprigIcon className="mb-5 h-9 w-9 text-sage" />
      <span className="eyebrow">You&apos;re on the list</span>
      <h1 className="text-display mt-3 text-balance">Subscription confirmed</h1>
      <p className="mt-5 flex items-center gap-1.5 text-lg leading-relaxed text-stone">
        Thank you — we&apos;ll let you know the moment the shop opens
        <HeartIcon className="h-4 w-4 text-heart" />
      </p>
      <div className="mt-8">
        <Button href="/" variant="primary" size="lg">
          Back home
        </Button>
      </div>
    </Container>
  );
}
