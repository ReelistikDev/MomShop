import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false },
};

export default function UnsubscribedPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="eyebrow">All done</span>
      <h1 className="text-display mt-3 text-balance">You&apos;ve unsubscribed</h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-stone">
        You won&apos;t hear from us again — no hard feelings. You&apos;re always
        welcome back if you change your mind.
      </p>
      <div className="mt-8">
        <Button href="/" variant="outline" size="lg">
          Back home
        </Button>
      </div>
    </Container>
  );
}
