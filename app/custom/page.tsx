import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { getPersonalizable } from "@/lib/data";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Custom orders",
  description:
    "Custom handmade earrings — bespoke shapes, wood and leather pairings, finish matching, and hand engraving.",
};

const STEPS = [
  {
    n: "01",
    title: "Tell us your idea",
    body: "A shape, a material, a color to match, or a date to engrave.",
  },
  {
    n: "02",
    title: "We'll confirm",
    body: "A quick note back with options, a price, and how long it'll take.",
  },
  {
    n: "03",
    title: "We cut & finish",
    body: "Cut on the CNC, then sanded, sealed, and assembled by hand.",
  },
  {
    n: "04",
    title: "Arrives ready to give",
    body: "Wrapped in a linen pouch with a handwritten note.",
  },
];

const POSSIBLE = [
  "Custom shapes cut to your design",
  "Wood paired with leather or brass",
  "Finish and color matching",
  "Small hand engraving — an initial or date",
  "Matching sets and bridal-party orders",
  "Lightweight versions of a pair you love",
];

export default async function CustomPage() {
  const personalizable = await getPersonalizable();

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <span className="eyebrow">Custom orders</span>
            <h1 className="text-display mt-4 text-balance">
              A pair, <span className="italic text-sage-dark">made just for you.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-stone">
              Everything is cut to order, so a custom pair is easy — a new shape,
              a wood-and-leather mix, a color to match, or a small engraving.
            </p>
            <div className="mt-8">
              <Button href="/contact" variant="primary" size="lg">
                Start a custom request
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card shadow-card">
            <Image
              src="/images/custom.jpg"
              alt="A custom earring shape being cut from wood"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Steps */}
      <section className="bg-linen py-16 lg:py-24">
        <Container>
          <h2 className="text-h2 mb-12 text-center text-balance">How it works</h2>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-serif text-3xl text-oak-dark">{step.n}</span>
                <h3 className="text-h3 mt-3">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-stone">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* What's possible */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="eyebrow">What&apos;s possible</span>
              <h2 className="text-h2 mt-3 text-balance">
                If you can picture it, we can probably make it
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-stone">
                A few of the most-requested custom touches — but this is just a
                starting point. Send us a note and we&apos;ll tell you what&apos;s doable.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:content-center">
              {POSSIBLE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-stone">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage-dark" />
                  <span className="text-[0.95rem] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Personalizable pieces */}
      {personalizable.length > 0 && (
        <section className="pb-4 lg:pb-12">
          <Container>
            <div className="mb-10 text-center">
              <span className="eyebrow">Ready to personalize</span>
              <h2 className="text-h2 mt-3 text-balance">
                Start from a pair you can engrave
              </h2>
            </div>
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-5 gap-y-10">
              {personalizable.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Gifting note */}
      <section className="py-16 lg:py-24">
        <Container size="narrow">
          <div className="rounded-card bg-shell px-8 py-12 text-center shadow-soft lg:px-14">
            <h2 className="text-h2 text-balance">Need it for a certain date?</h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-stone">
              Custom pairs are made to order. If you have a deadline, send us a
              note and we&apos;ll let you know what&apos;s possible.
            </p>
            <div className="mt-7">
              <Button href="/contact" variant="sage" size="lg">
                Get in touch
              </Button>
            </div>
            <p className="mt-4 text-[0.85rem] text-mist">
              Or email us anytime at {BRAND.email}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
