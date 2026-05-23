import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CollectionCard } from "@/components/collection-card";
import { getCollections } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore our handmade jewelry collections — earrings, necklaces, rings, and bracelets.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <>
      <section className="border-b border-line bg-linen/60">
        <Container className="py-14 text-center lg:py-20">
          <span className="eyebrow">Collections</span>
          <h1 className="text-h1 mt-3 text-balance">Small edits, made to mix</h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone">
            Four quiet collections of handmade pieces — choose a place to start.
          </p>
        </Container>
      </section>

      <Container className="py-14 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {collections.map((c, i) => (
            <CollectionCard
              key={c.slug}
              collection={c}
              priority={i < 2}
              className="aspect-auto"
            />
          ))}
        </div>
      </Container>
    </>
  );
}
