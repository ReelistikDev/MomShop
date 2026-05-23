import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";
import { ArrowRightIcon } from "@/components/icons";

export function CollectionCard({
  collection,
  priority = false,
  className = "",
}: {
  collection: Collection;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={`group relative flex overflow-hidden rounded-card shadow-soft transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-card ${className}`}
    >
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 90vw, 33vw"
          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
        />
        {/* warm legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cream/80">
            {collection.tagline}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <h3 className="font-serif text-[1.7rem] leading-tight text-cream">
              {collection.name}
            </h3>
            <ArrowRightIcon className="translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </Link>
  );
}
