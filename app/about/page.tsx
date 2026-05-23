import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${BRAND.name} — handmade jewelry made in small batches with care.`,
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
              Made slowly, <span className="italic text-sage-dark">made to keep.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-stone">
              {BRAND.name} began at a small workbench with a simple idea: jewelry
              you can actually wear every day — light, comfortable, and made well
              enough to last.
            </p>
            <p className="mt-4 leading-relaxed text-stone">
              We design and finish each piece by hand, in small batches. Nothing
              is mass-produced, and nothing leaves the studio until it&apos;s
              right. {BRAND.location}.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card shadow-card">
            <Image
              src="/images/about.jpg"
              alt="A jeweler at the workbench finishing a piece by hand"
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
            “We&apos;d rather make a few things carefully than many things
            quickly. Every piece should feel like it was made for someone.”
          </p>
          <p className="mt-6 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-mist">
            — The {BRAND.name} studio
          </p>
        </Container>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Small batches",
                body: "We make in small runs so we can keep a close eye on quality and waste less along the way.",
              },
              {
                title: "Materials that last",
                body: "Gold fill, sterling silver, and freshwater pearls — chosen to wear well and stay kind to sensitive skin.",
              },
              {
                title: "Made to be worn",
                body: "Lightweight shapes and smooth, comfortable finishes designed for everyday life, not just special occasions.",
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
            alt="Tools and a piece in progress at the jewelry bench"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-ink/15" />
          <Container className="relative flex min-h-[24rem] flex-col items-center justify-center py-16 text-center text-cream lg:min-h-[28rem]">
            <h2 className="max-w-xl font-serif text-[2rem] leading-tight lg:text-[2.6rem]">
              Find a piece to keep — or to give.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/shop" variant="primary" size="lg">
                Shop the collection
              </Button>
              <Button
                href="/personalized"
                variant="outline"
                size="lg"
                className="border-cream/40 text-cream hover:border-cream hover:bg-cream/10"
              >
                Personalize a gift
              </Button>
            </div>
          </Container>
        </div>
      </section>
    </>
  );
}
