import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ComingSoonCard } from "@/components/placeholders";
import { ProductCard } from "@/components/product-card";
import { ArrowRightIcon, HeartIcon } from "@/components/icons";
import { getCategories, getProducts } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The Willow & Wren shop is being stocked — hats, earrings, shirts, stickers, and more, coming soon.",
};

function HeaderBand() {
  return (
    <section className="border-b border-line bg-linen/60">
      <Container className="py-16 text-center lg:py-24">
        <span className="eyebrow">The shop</span>
        <h1 className="text-h1 mt-3 text-balance">Our shelves are filling up</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone">
          Hats, earrings, shirts, stickers, and more — all handmade and
          gathered with care.
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
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category ?? "all";

  const [products, categories] = await Promise.all([
    getProducts(activeCategory),
    getCategories(),
  ]);

  // Are there any products at all (regardless of the current filter)?
  const totalProducts =
    activeCategory === "all" ? products.length : (await getProducts()).length;

  // Empty catalog → keep the original "Coming soon" layout.
  if (totalProducts === 0) {
    return (
      <>
        <HeaderBand />
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

  const chips = [{ slug: "all", name: "All" }, ...categories];

  return (
    <>
      <HeaderBand />
      <Container className="py-14 lg:py-20">
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2.5">
            {chips.map((chip) => {
              const isActive = activeCategory === chip.slug;
              const href =
                chip.slug === "all" ? "/shop" : `/shop?category=${chip.slug}`;
              return (
                <Link
                  key={chip.slug}
                  href={href}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "border-ink bg-ink text-cream"
                      : "border-line-strong bg-cream text-ink hover:border-oak"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {chip.name}
                </Link>
              );
            })}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={i < 4}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center font-script text-2xl text-stone">
            Nothing here just yet — check back soon.
          </p>
        )}
      </Container>
    </>
  );
}
