import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const hover = product.images[1] ?? product.images[0];
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-shell shadow-soft transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-card">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-opacity duration-700 ease-out group-hover:opacity-0"
        />
        <Image
          src={hover}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          aria-hidden="true"
          className="scale-105 object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
        />
        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge type={product.badge} className="bg-cream/85 backdrop-blur-sm" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-[1.15rem] leading-snug text-ink transition-colors group-hover:text-sage-dark">
          {product.name}
        </h3>
        <span className="shrink-0 text-[0.95rem] tabular-nums text-stone">
          {formatPrice(product.price)}
        </span>
      </div>
      <p className="mt-1 text-[0.9rem] leading-relaxed text-mist">
        {product.shortDescription}
      </p>
    </Link>
  );
}
