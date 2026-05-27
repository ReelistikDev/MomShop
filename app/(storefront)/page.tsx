import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ComingSoonCard } from "@/components/placeholders";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter";
import {
  ArrowRightIcon,
  GiftIcon,
  HandIcon,
  HeartIcon,
  LeafIcon,
  SprigIcon,
} from "@/components/icons";
import { BRAND } from "@/lib/brand";
import { getFeatured } from "@/lib/data";

const VALUES = [
  {
    Icon: HandIcon,
    title: "Made by hand",
    body: "Everything is made or hand-picked with care — never mass-produced.",
  },
  {
    Icon: LeafIcon,
    title: "Made to last",
    body: "Quality materials and a careful finish, made to hold up to everyday life.",
  },
  {
    Icon: GiftIcon,
    title: "Ready to gift",
    body: "Every order is packed with care — and you can add a gift note to any order.",
  },
];

export default async function HomePage() {
  const featured = await getFeatured(4);

  return (
    <>
      {/* ----------------------------- Hero ----------------------------- */}
      <section className="relative overflow-hidden">
        <Container className="flex flex-col items-center py-20 text-center lg:py-28">
          <span className="eyebrow animate-rise">A handmade boutique</span>
          <h1 className="text-display mt-5 max-w-3xl text-balance">
            Handmade things,{" "}
            <span className="italic text-sage-dark">made with love.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">
            Hats, earrings, shirts, stickers, and more — handmade and chosen
            with care. The shop is being stocked right now.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/#newsletter" variant="primary" size="lg">
              Get notified
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button href="/custom" variant="outline" size="lg">
              Custom orders
            </Button>
          </div>
          <p className="mt-12 flex items-center gap-2.5 font-script text-2xl text-ink">
            <SprigIcon className="h-5 w-5 text-sage" />
            Opening soon
            <HeartIcon className="h-4 w-4 text-heart" />
          </p>
        </Container>
      </section>

      {/* --------------------------- New in the shop --------------------------- */}
      <section className="bg-linen py-16 lg:py-24">
        <Container>
          {featured.length > 0 ? (
            <>
              <SectionHeading
                eyebrow="The shop"
                title="New in the shop"
                intro="Fresh from the studio — new handmade pieces ready to find a home."
                align="center"
                className="mx-auto"
              />
              <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
                {featured.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={i < 2}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <SectionHeading
                eyebrow="The shop"
                title="New things, coming soon"
                intro="We're stocking the shelves — hats, earrings, shirts, stickers, and more on the way."
                align="center"
                className="mx-auto"
              />
              <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ComingSoonCard key={i} />
                ))}
              </div>
            </>
          )}
          <div className="mt-10 text-center">
            <Button href="/shop" variant="outline" size="md">
              Visit the shop
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* ------------------------- Handmade with care ------------------------- */}
      <section className="py-16 lg:py-24">
        <Container>
          <SprigIcon className="mx-auto mb-4 h-7 w-7 text-sage" />
          <SectionHeading
            eyebrow="Handmade with care"
            title="A shop run with heart"
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

      {/* ------------------------------ Custom orders ------------------------------ */}
      <section className="pb-4 lg:pb-8">
        <Container size="narrow">
          <div className="rounded-card bg-shell px-8 py-12 text-center shadow-soft lg:px-14">
            <span className="eyebrow">Custom orders</span>
            <h2 className="text-h2 mt-3 text-balance">Have something in mind?</h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-stone">
              Want a custom piece, a certain color, or a personalized gift? Tell
              us what you&apos;re imagining and we&apos;ll see what we can make.
            </p>
            <div className="mt-7">
              <Button href="/custom" variant="sage" size="lg">
                Start a custom request
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------- Studio banner --------------------------- */}
      <section className="mt-16 bg-gradient-to-br from-twilight via-twilight to-ink lg:mt-24">
        <Container className="py-20 text-center text-cream lg:py-28">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream/85">
            From the studio
          </span>
          <h2 className="mx-auto mt-4 max-w-xl font-serif text-[2.2rem] leading-tight text-cream lg:text-[2.8rem]">
            Made by hand, with love.
          </h2>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-cream/90">
            Run with a lot of heart — everything is made or chosen with care,
            and ready to give or to keep.
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
        </Container>
      </section>

      {/* ----------------------------- Newsletter ----------------------------- */}
      <section id="newsletter" className="scroll-mt-24 py-20 lg:py-28">
        <Container size="narrow" className="text-center">
          <span className="eyebrow">Be the first to know</span>
          <h2 className="text-h2 mt-3 text-balance">
            We&apos;ll let you know the moment we open
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-stone">
            Join the list for first looks at new pieces and the shop opening —
            no noise, just a gentle hello when there&apos;s something to share.
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
