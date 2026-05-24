import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product-gallery";
import { ProductCard } from "@/components/product-card";
import { AddToCart } from "@/components/cart/add-to-cart";
import { FeatherIcon, GiftIcon, LeafIcon } from "@/components/icons";
import { getCategory, getProduct, getRelated } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Render product pages on demand (no build-time DB dependency).
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph:
      product.images.length > 0 ? { images: [product.images[0]] } : undefined,
  };
}

const TRUST = [
  { Icon: GiftIcon, label: "Thoughtfully packed, ready to give" },
  { Icon: FeatherIcon, label: "Made or hand-picked with care" },
  { Icon: LeafIcon, label: "Handmade to order" },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    product.category ? getCategory(product.category) : Promise.resolve(undefined),
    getRelated(slug, 4),
  ]);

  const hasMaterials = (product.materials?.length ?? 0) > 0;
  const hasDetails = (product.details?.length ?? 0) > 0;
  const hasCare = (product.care?.length ?? 0) > 0;
  const hasSpecs = hasMaterials || hasDetails || hasCare;

  return (
    <>
      <Container className="pt-6">
        <nav className="flex items-center gap-2 text-[0.85rem] text-mist">
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link
                href={`/shop?category=${category.slug}`}
                className="hover:text-ink"
              >
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-stone">{product.name}</span>
        </nav>
      </Container>

      <Container className="grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="lg:py-4">
          <div className="flex items-center gap-3">
            {product.soldOut ? (
              <span className="inline-flex items-center rounded-full bg-ink/90 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-cream">
                Sold out
              </span>
            ) : (
              product.badge && <Badge type={product.badge} />
            )}
            {product.style && (
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-mist">
                {product.style}
              </span>
            )}
          </div>
          <h1 className="text-h1 mt-3">{product.name}</h1>
          <p className="mt-3 text-2xl tabular-nums text-stone">
            {formatPrice(product.price)}
          </p>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-stone">
            {product.description}
          </p>

          <div className="my-8 h-px w-full bg-line" />

          <AddToCart product={product} />

          <div className="mt-8 flex flex-col gap-3 rounded-card bg-shell px-5 py-5">
            {TRUST.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 text-[0.92rem] text-stone"
              >
                <Icon className="h-5 w-5 shrink-0 text-sage-dark" />
                {label}
              </div>
            ))}
          </div>

          {hasSpecs && (
            <dl className="mt-10 grid gap-8 sm:grid-cols-3">
              {hasMaterials && (
                <Spec title="Materials" items={product.materials!} />
              )}
              {hasDetails && <Spec title="Details" items={product.details!} />}
              {hasCare && <Spec title="Care" items={product.care!} />}
            </dl>
          )}
        </div>
      </Container>

      {related.length > 0 && (
        <Container className="py-16 lg:py-24">
          <h2 className="text-h2 mb-10 text-center">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}

function Spec({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <dt className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-mist">
        {title}
      </dt>
      <dd>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="text-[0.92rem] leading-relaxed text-stone">
              {item}
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}
