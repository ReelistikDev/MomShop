import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product-card";
import { getCollections, getProducts } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse handmade earrings, necklaces, rings, and bracelets — lightweight pieces designed for everyday wear.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const { collection } = await searchParams;
  const active = collection ?? "all";
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  const filtered =
    active === "all"
      ? products
      : products.filter((p) => p.collection === active);

  const chips = [{ slug: "all", name: "All" }, ...collections.map((c) => ({ slug: c.slug, name: c.name }))];

  return (
    <>
      <section className="border-b border-line bg-linen/60">
        <Container className="py-14 text-center lg:py-20">
          <span className="eyebrow">The shop</span>
          <h1 className="text-h1 mt-3 text-balance">
            Everyday jewelry, made by hand
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone">
            Lightweight, comfortable pieces in gold fill and sterling silver —
            made in small batches and ready to gift.
          </p>
        </Container>
      </section>

      <Container className="py-12 lg:py-16">
        {/* Filter chips */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {chips.map((chip) => {
            const isActive = active === chip.slug;
            const href = chip.slug === "all" ? "/shop" : `/shop?collection=${chip.slug}`;
            return (
              <Link
                key={chip.slug}
                href={href}
                scroll={false}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "border-ink bg-ink text-cream"
                    : "border-line-strong text-stone hover:border-oak hover:text-ink"
                )}
              >
                {chip.name}
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      </Container>
    </>
  );
}
