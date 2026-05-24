import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ComingSoonCard } from "@/components/placeholders";
import { ArrowRightIcon, HeartIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The Willow & Wren shop is being stocked — hats, earrings, shirts, stickers, and more, coming soon.",
};

export default function ShopPage() {
  return (
    <>
      <section className="border-b border-line bg-linen/60">
        <Container className="py-16 text-center lg:py-24">
          <span className="eyebrow">The shop</span>
          <h1 className="text-h1 mt-3 text-balance">Our shelves are filling up</h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone">
            Hats, earrings, shirts, stickers, and more — all handmade and
            gathered with care. The full shop opens soon.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/#newsletter" variant="primary" size="lg">
              Get notified
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button href="/custom" variant="outline" size="lg">
              Request a custom piece
            </Button>
          </div>
        </Container>
      </section>

      <Container className="py-14 lg:py-20">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ComingSoonCard key={i} />
          ))}
        </div>
        <p className="mt-12 flex items-center justify-center gap-2 font-script text-2xl text-stone">
          Worth the wait
          <HeartIcon className="h-4 w-4 text-heart" />
        </p>
      </Container>
    </>
  );
}
