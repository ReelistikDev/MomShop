import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { CollectionCard } from "@/components/collection-card";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter";
import {
  ArrowRightIcon,
  FeatherIcon,
  GiftIcon,
  HandIcon,
} from "@/components/icons";
import { getBestSellers, getFeaturedCollections } from "@/lib/data";
import { BRAND } from "@/lib/brand";

const VALUES = [
  {
    Icon: HandIcon,
    title: "Made by hand",
    body: "Every piece is shaped, finished, and checked by hand in small batches — never mass-produced.",
  },
  {
    Icon: FeatherIcon,
    title: "Light & comfortable",
    body: "Designed to be worn all day. Lightweight metals, smooth edges, and hypoallergenic findings.",
  },
  {
    Icon: GiftIcon,
    title: "Ready to gift",
    body: "Each order arrives wrapped in a linen pouch with a handwritten note, ready to give.",
  },
];

export default async function HomePage() {
  const [collections, bestSellers] = await Promise.all([
    getFeaturedCollections(3),
    getBestSellers(4),
  ]);

  return (
    <>
      {/* ----------------------------- Hero ----------------------------- */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="animate-rise max-w-xl">
            <span className="eyebrow">Handmade boutique jewelry</span>
            <h1 className="text-display mt-4 text-balance">
              Everyday pieces,{" "}
              <span className="italic text-sage-dark">made by hand.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-stone">
              Lightweight, handmade jewelry and personalized gifts — designed
              for everyday wear and made in small batches with care.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/shop" variant="primary" size="lg">
                Shop new arrivals
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              <Button href="/personalized" variant="outline" size="lg">
                Personalize a gift
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-[0.85rem] text-mist">
              <span>Handmade to order</span>
              <span className="text-oak">·</span>
              <span>Free U.S. shipping over $75</span>
              <span className="text-oak">·</span>
              <span>Gift-ready packaging</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card shadow-card">
              <Image
                src="/images/hero.jpg"
                alt="A model wearing delicate handmade gold jewelry"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-4 hidden rounded-full bg-cream/90 px-5 py-3 shadow-soft backdrop-blur-sm sm:left-6 sm:block">
              <p className="font-serif text-[0.95rem] text-ink">
                “Find your everyday piece.”
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------ Featured collections ------------------------ */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Shop by collection"
              title="Quietly considered, easy to wear"
              intro="Earrings, necklaces, rings, and bracelets — small edits, made to mix."
            />
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 whitespace-nowrap text-sage-dark transition-colors hover:text-ink"
            >
              View all collections
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c, i) => (
              <CollectionCard key={c.slug} collection={c} priority={i === 0} />
            ))}
          </div>
        </Container>
      </section>

      {/* ----------------------------- Best sellers ----------------------------- */}
      <section className="bg-linen py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Loved by everyone"
              title="Our best sellers"
              intro="The pieces our customers keep coming back for."
            />
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 whitespace-nowrap text-sage-dark transition-colors hover:text-ink"
            >
              Shop all
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------- Personalized --------------------------- */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-0 overflow-hidden rounded-card bg-shell shadow-soft lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[26rem]">
              <Image
                src="/images/personalized.jpg"
                alt="A personalized hand-stamped pendant necklace"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="px-7 py-10 lg:px-14 lg:py-16">
              <span className="eyebrow">Personalized gifts</span>
              <h2 className="text-h2 mt-3 text-balance">Make it theirs</h2>
              <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-stone">
                Add an initial, a date, or a short word and we&apos;ll hand-stamp
                it for you. A small, thoughtful gift that arrives ready to give —
                wrapped in linen with a handwritten note.
              </p>
              <div className="mt-8">
                <Button href="/personalized" variant="sage" size="lg">
                  Start a personalized piece
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------- Handmade with care ------------------------- */}
      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Handmade with care"
            title="The difference is in the making"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {VALUES.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/12 text-sage-dark">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-h3 mt-5">{title}</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-stone">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------- Lifestyle banner --------------------------- */}
      <section className="relative">
        <div className="relative min-h-[26rem] w-full overflow-hidden lg:min-h-[32rem]">
          <Image
            src="/images/banner-craft.jpg"
            alt="A jeweler finishing a piece by hand at the workbench"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/30 to-transparent" />
          <Container className="relative flex min-h-[26rem] items-center lg:min-h-[32rem]">
            <div className="max-w-lg py-16 text-cream">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream/85">
                From our studio
              </span>
              <h2 className="mt-4 font-serif text-[2.2rem] leading-tight text-cream lg:text-[2.8rem]">
                Made by hand, made to keep.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-cream/90">
                We design and finish every piece ourselves, in small batches. No
                rush, no shortcuts — just jewelry made to be worn for years.
              </p>
              <div className="mt-8">
                <Button
                  href="/about"
                  variant="outline"
                  size="lg"
                  className="border-cream/40 text-cream hover:border-cream hover:bg-cream/10"
                >
                  Our story
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ----------------------------- Newsletter ----------------------------- */}
      <section className="py-20 lg:py-28">
        <Container size="narrow" className="text-center">
          <span className="eyebrow">Stay in touch</span>
          <h2 className="text-h2 mt-3 text-balance">
            Quiet updates, new pieces, and the occasional note
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-stone">
            Join the list for first looks at new arrivals and small-batch
            restocks. No noise — just a gentle hello now and then.
          </p>
          <NewsletterForm className="mx-auto mt-8 max-w-md" />
          <p className="mt-3 text-[0.8rem] text-mist">
            By joining you agree to hear from {BRAND.name}. Unsubscribe anytime.
          </p>
        </Container>
      </section>
    </>
  );
}
