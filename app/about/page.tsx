import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${BRAND.name} — handmade wood and leather earrings, made in small batches with care.`,
};

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="overflow-hidden">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <span className="eyebrow">Our story</span>
            <h1 className="text-display mt-4 text-balance">
              One maker, <span className="italic text-sage-dark">one pair at a time.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-stone">
              {BRAND.name} started at a small home workbench — a love of working
              with wood and leather, and a simple goal: earrings light enough to
              wear all day, made well enough to keep.
            </p>
            <p className="mt-4 leading-relaxed text-stone">
              Every shape is cut on the CNC for clean, repeatable lines, then
              sanded, sealed, and assembled by hand. Nothing is mass-produced,
              and nothing leaves the studio until it&apos;s right. {BRAND.location}.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card shadow-card">
            <Image
              src="/images/about.jpg"
              alt="At the workbench, finishing a pair by hand"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Pull quote */}
      <section className="bg-linen py-16 lg:py-24">
        <Container size="narrow" className="text-center">
          <p className="font-serif text-[1.7rem] leading-snug text-ink lg:text-[2.1rem]">
            “I&apos;d rather make a few pairs carefully than a hundred quickly.
            Every pair should feel like it was made for someone.”
          </p>
          <p className="mt-6 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-mist">
            — The maker behind {BRAND.name}
          </p>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Light, natural materials",
                body: "Light-toned wood and genuine leather — warm, comfortable, and kind to sensitive ears with nickel-free hardware.",
              },
              {
                title: "Cut to order",
                body: "Pairs are made a few at a time, so there's almost no waste — and it's easy to tweak a shape or finish just for you.",
              },
              {
                title: "Made to be worn",
                body: "Featherlight shapes and smooth, sealed finishes designed for everyday life, not just special occasions.",
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
      <section className="relative">
        <div className="relative min-h-[24rem] w-full overflow-hidden lg:min-h-[28rem]">
          <Image
            src="/images/banner-craft.jpg"
            alt="Cutting and engraving light wood in the studio"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-ink/15" />
          <Container className="relative flex min-h-[24rem] flex-col items-center justify-center py-16 text-center text-cream lg:min-h-[28rem]">
            <h2 className="max-w-xl font-serif text-[2rem] leading-tight lg:text-[2.6rem]">
              Find a pair to keep — or to give.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/shop" variant="primary" size="lg">
                Shop the earrings
              </Button>
              <Button
                href="/custom"
                variant="outline"
                size="lg"
                className="border-cream/40 text-cream hover:border-cream hover:bg-cream/10"
              >
                Request a custom pair
              </Button>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
