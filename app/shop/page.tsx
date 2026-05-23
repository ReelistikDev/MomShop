import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product-card";
import { getMaterials, getProducts } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop earrings",
  description:
    "Browse handmade wood and leather earrings — lightweight pairs designed for everyday wear.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ material?: string }>;
}) {
  const { material } = await searchParams;
  const active = material ?? "all";
  const [products, materials] = await Promise.all([
    getProducts(active),
    getMaterials(),
  ]);

  const chips = [
    { slug: "all", name: "All" },
    ...materials.map((m) => ({ slug: m.slug, name: m.name })),
  ];

  return (
    <>
      <section className="border-b border-line bg-linen/60">
        <Container className="py-14 text-center lg:py-20">
          <span className="eyebrow">The shop</span>
          <h1 className="text-h1 mt-3 text-balance">
            Handmade earrings, light as can be
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone">
            CNC-cut wood, soft leather, and a little of both — made in small
            batches and ready to gift.
          </p>
        </Container>
      </section>

      <Container className="py-12 lg:py-16">
        {/* Material filter chips */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {chips.map((chip) => {
            const isActive = active === chip.slug;
            const href = chip.slug === "all" ? "/shop" : `/shop?material=${chip.slug}`;
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

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-stone">
            New pairs are on the way — check back soon.
          </p>
        )}
      </Container>
    </>
  );
}
