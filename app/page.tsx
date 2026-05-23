import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { MaterialCard } from "@/components/material-card";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter";
import {
  ArrowRightIcon,
  FeatherIcon,
  GiftIcon,
  HeartIcon,
  LeafIcon,
  SprigIcon,
} from "@/components/icons";
import { getBestSellers, getMaterials } from "@/lib/data";
import { BRAND } from "@/lib/brand";

const VALUES = [
  {
    Icon: FeatherIcon,
    title: "Barely-there light",
    body: "Cut from wood and leather, every pair is light enough to wear all day and forget you have them on.",
  },
  {
    Icon: LeafIcon,
    title: "Painted by hand",
    body: "Cut from wood, then hand-painted, sealed, and assembled in small batches — so no two pairs are exactly alike.",
  },
  {
    Icon: GiftIcon,
    title: "Ready to gift",
    body: "Each pair arrives wrapped in a linen pouch with a handwritten note, ready to give.",
  },
];

export default async function HomePage() {
  const [materials, bestSellers] = await Promise.all([
    getMaterials(),
    getBestSellers(4),
  ]);

  return (
    <>
      {/* ----------------------------- Hero ----------------------------- */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="animate-rise max-w-xl">
            <span className="eyebrow">Hand-painted wood &amp; leather earrings</span>
            <h1 className="text-display mt-4 text-balance">
              Little night skies,{" "}
              <span className="italic text-sage-dark">made by hand.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-stone">
              Hand-painted wood and leather earrings — tiny landscapes, light
              enough for everyday, made in small batches with love.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/shop" variant="primary" size="lg">
                Shop the earrings
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              <Button href="/custom" variant="outline" size="lg">
                Request a custom pair
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-[0.85rem] text-mist">
              <span>Handmade to order</span>
              <span className="text-oak">·</span>
              <span>Free U.S. shipping over $50</span>
              <span className="text-oak">·</span>
              <span>Gift-ready packaging</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card shadow-card lg:aspect-[5/4]">
              <Image
                src="/images/display.jpg"
                alt="Hand-painted night-sky wood earrings displayed on Handmade with love cards"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-4 hidden rounded-full bg-cream/90 px-5 py-2.5 shadow-soft backdrop-blur-sm sm:left-6 sm:block">
              <p className="flex items-center gap-1.5 font-script text-xl leading-none text-ink">
                Find your everyday pair
                <HeartIcon className="h-3.5 w-3.5 text-heart" />
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------- Shop by material --------------------------- */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Shop by material"
              title="Wood, leather, and a little of both"
              intro="Three simple ways to start — every pair is light, comfortable, and made to wear."
            />
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 whitespace-nowrap text-sage-dark transition-colors hover:text-ink"
            >
              View all earrings
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m, i) => (
              <MaterialCard key={m.slug} material={m} priority={i === 0} />
            ))}
          </div>
        </Container>
      </section>

      {/* ----------------------------- Best sellers ----------------------------- */}
      <section className="bg-linen py-16 lg:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Most loved"
              title="Customer favorites"
              intro="The pairs people keep coming back for."
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

      {/* ------------------------------ Custom orders ------------------------------ */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid items-center gap-0 overflow-hidden rounded-card bg-shell shadow-soft lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[26rem]">
              <Image
                src="/images/custom.jpg"
                alt="A wooden earring shape being cut on the CNC"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="px-7 py-10 lg:px-14 lg:py-16">
              <span className="eyebrow">Custom orders</span>
              <h2 className="text-h2 mt-3 text-balance">Have something in mind?</h2>
              <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-stone">
                Because everything is cut to order, we can make a custom shape,
                pair wood with leather, match a color, or add a small engraving.
                Tell us what you&apos;re imagining and we&apos;ll make it real.
              </p>
              <div className="mt-8">
                <Button href="/custom" variant="sage" size="lg">
                  Start a custom pair
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
          <SprigIcon className="mx-auto mb-4 h-7 w-7 text-sage" />
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

      {/* --------------------------- Studio banner --------------------------- */}
      <section className="relative">
        <div className="relative min-h-[26rem] w-full overflow-hidden lg:min-h-[32rem]">
          <Image
            src="/images/banner-craft.jpg"
            alt="Light wood being cut and engraved in the studio"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/30 to-transparent" />
          <Container className="relative flex min-h-[26rem] items-center lg:min-h-[32rem]">
            <div className="max-w-lg py-16 text-cream">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream/85">
                From the studio
              </span>
              <h2 className="mt-4 font-serif text-[2.2rem] leading-tight text-cream lg:text-[2.8rem]">
                Cut, painted, and finished by hand.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-cream/90">
                Each shape is cut from wood, then hand-painted, sealed, and
                assembled — a few pairs at a time. No two are exactly alike.
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
            New pairs, small restocks, and the occasional note
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-stone">
            Join the list for first looks at new earrings and small-batch
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
