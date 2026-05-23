import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product-card";
import { ArrowLeftIcon } from "@/components/icons";
import {
  allCollectionSlugs,
  getCollection,
  getProductsByCollection,
} from "@/lib/data";

export function generateStaticParams() {
  return allCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: "Not found" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  const products = await getProductsByCollection(slug);

  return (
    <>
      <section className="relative">
        <div className="relative min-h-[18rem] w-full overflow-hidden lg:min-h-[24rem]">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-ink/10" />
          <Container className="relative flex min-h-[18rem] flex-col justify-end pb-10 lg:min-h-[24rem] lg:pb-14">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cream/85">
              {collection.tagline}
            </p>
            <h1 className="mt-2 font-serif text-[2.4rem] leading-tight text-cream lg:text-[3.2rem]">
              {collection.name}
            </h1>
            <p className="mt-3 max-w-xl leading-relaxed text-cream/90">
              {collection.description}
            </p>
          </Container>
        </div>
      </section>

      <Container className="py-14 lg:py-20">
        <Link
          href="/collections"
          className="group mb-10 inline-flex items-center gap-2 text-sage-dark transition-colors hover:text-ink"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          All collections
        </Link>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-stone">
            New pieces are on the way — check back soon.
          </p>
        )}
      </Container>
    </>
  );
}
