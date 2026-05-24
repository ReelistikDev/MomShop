import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeartIcon, SprigIcon } from "@/components/icons";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${BRAND.name} — a little handmade boutique, made and gathered with love.`,
};

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="overflow-hidden border-b border-line">
        <Container size="narrow" className="py-16 text-center lg:py-24">
          <SprigIcon className="mx-auto mb-5 h-8 w-8 text-sage" />
          <span className="eyebrow">Our story</span>
          <h1 className="text-display mt-4 text-balance">
            A little shop, <span className="italic text-sage-dark">made with love.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            {BRAND.name} started as a small creative habit that grew into
            something to share — a place for handmade and hand-picked pieces
            made with care, not in a factory.
          </p>
          <p className="mt-4 leading-relaxed text-stone">
            The shop is filling up with hats, earrings, shirts, stickers, and
            more, made and gathered in small batches. {BRAND.location}.
          </p>
        </Container>
      </section>

      {/* Pull quote */}
      <section className="bg-linen py-16 lg:py-24">
        <Container size="narrow" className="text-center">
          <p className="font-serif text-[1.7rem] leading-snug text-ink lg:text-[2.1rem]">
            “I&apos;d rather make a few things carefully than a hundred quickly.
            Every piece should feel like it was made for someone.”
          </p>
          <p className="mt-6 flex items-center justify-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-mist">
            The maker behind {BRAND.name}
            <HeartIcon className="h-3 w-3 text-heart" />
          </p>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Made with care",
                body: "Everything is made or hand-picked in small batches, checked over before it ever ships.",
              },
              {
                title: "Small & personal",
                body: "A one-person shop, so every order — and every custom request — gets real attention.",
              },
              {
                title: "Made to be gifted",
                body: "Orders arrive wrapped with a handwritten note, ready to give (or to keep).",
              },
            ].map((v) => (
              <div key={v.title} className="border-t border-line pt-6">
                <h3 className="text-h3">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Banner + CTA */}
      <section className="bg-gradient-to-br from-twilight via-twilight to-ink">
        <Container className="py-20 text-center text-cream lg:py-28">
          <h2 className="mx-auto max-w-xl font-serif text-[2rem] leading-tight lg:text-[2.6rem]">
            Something for you — or for someone you love.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/shop" variant="primary" size="lg">
              Visit the shop
            </Button>
            <Button
              href="/custom"
              variant="outline"
              size="lg"
              className="border-cream/40 text-cream hover:border-cream hover:bg-cream/10"
            >
              Custom orders
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
