import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckIcon, HeartIcon } from "@/components/icons";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Custom orders",
  description:
    "Custom handmade pieces and personalized gifts — tell us what you're imagining and we'll see what we can make.",
};

const STEPS = [
  {
    n: "01",
    title: "Tell us your idea",
    body: "A piece, a color, a name or date — whatever you have in mind.",
  },
  {
    n: "02",
    title: "We'll confirm",
    body: "A quick note back with options, a price, and how long it'll take.",
  },
  {
    n: "03",
    title: "We make it",
    body: "Made by hand, with the same care as everything in the shop.",
  },
  {
    n: "04",
    title: "Arrives ready to give",
    body: "Packed with care and ready to give.",
  },
];

const POSSIBLE = [
  "A custom color or finish",
  "A personalized name or date",
  "A matching set or gift bundle",
  "A piece you've seen, made your size",
  "Party, wedding, or event orders",
  "Something entirely your own idea",
];

export default function CustomPage() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden border-b border-line">
        <Container className="flex flex-col items-center py-16 text-center lg:py-24">
          <span className="eyebrow">Custom orders</span>
          <h1 className="text-display mt-5 max-w-2xl text-balance">
            Made <span className="italic text-sage-dark">just for you.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">
            Want a custom piece, a certain color, or a personalized gift? Tell us
            what you&apos;re imagining and we&apos;ll see what we can make.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="primary" size="lg">
              Start a custom request
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
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
                <span className="font-serif text-3xl text-oak-dark">
                  {step.n}
                </span>
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
                If you can picture it, just ask
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-stone">
                A few of the most-requested custom touches — but this is only a
                starting point. Send a note and we&apos;ll tell you what&apos;s doable.
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

      {/* CTA */}
      <section className="pb-20 lg:pb-28">
        <Container size="narrow">
          <div className="rounded-card bg-shell px-8 py-12 text-center shadow-soft lg:px-14">
            <h2 className="text-h2 text-balance">Need it for a certain date?</h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-stone">
              Custom pieces are made to order. If you have a deadline, send us a
              note and we&apos;ll let you know what&apos;s possible.
            </p>
            <div className="mt-7">
              <Button href="/contact" variant="sage" size="lg">
                Get in touch
              </Button>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.85rem] text-mist">
              Made with love
              <HeartIcon className="h-3 w-3 text-heart" />
              {BRAND.email}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
