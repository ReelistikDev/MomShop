import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRightIcon } from "@/components/icons";
import { getProducts } from "@/lib/data";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Personalized",
  description:
    "Personalized handmade jewelry — add an initial, date, or short word, hand-stamped and gift-ready.",
};

const STEPS = [
  {
    n: "01",
    title: "Choose your piece",
    body: "Start with a pendant or band made to be personalized.",
  },
  {
    n: "02",
    title: "Add your detail",
    body: "An initial, a date, or a short word — up to eight characters.",
  },
  {
    n: "03",
    title: "We hand-stamp it",
    body: "Each character is stamped by hand, so no two are exactly alike.",
  },
  {
    n: "04",
    title: "Arrives ready to give",
    body: "Wrapped in a linen pouch with a handwritten note.",
  },
];

export default async function PersonalizedPage() {
  const products = await getProducts();
  const personalizable = products.filter((p) => p.personalizable);

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="max-w-xl">
            <span className="eyebrow">Personalized gifts</span>
            <h1 className="text-display mt-4 text-balance">
              A small piece, <span className="italic text-sage-dark">made just for them.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-stone">
              Add an initial, a date, or a short word and we&apos;ll hand-stamp
              it for you. Thoughtful, understated, and made to be kept.
            </p>
            <div className="mt-8">
              <Button href="#pieces" variant="primary" size="lg">
                Personalize a piece
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card shadow-card">
            <Image
              src="/images/personalized.jpg"
              alt="A personalized hand-stamped pendant"
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

      {/* Personalizable pieces */}
      <section id="pieces" className="scroll-mt-24 py-16 lg:py-24">
        <Container>
          <div className="mb-10 text-center">
            <span className="eyebrow">Ready to personalize</span>
            <h2 className="text-h2 mt-3 text-balance">Pieces you can make your own</h2>
          </div>
          {personalizable.length > 0 ? (
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2">
              {personalizable.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-stone">
              Personalized pieces are coming soon.
            </p>
          )}
        </Container>
      </section>

      {/* Gifting note */}
      <section className="pb-20 lg:pb-28">
        <Container size="narrow">
          <div className="rounded-card bg-shell px-8 py-12 text-center shadow-soft lg:px-14">
            <h2 className="text-h2 text-balance">Need it for a certain date?</h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-stone">
              Personalized pieces are made to order. If you have a deadline,
              send us a note and we&apos;ll let you know what&apos;s possible.
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
