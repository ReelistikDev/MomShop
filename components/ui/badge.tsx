import type { Badge as BadgeType } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<BadgeType, string> = {
  handmade: "Handmade",
  custom: "Personalized",
  bestseller: "Loved",
  new: "New",
};

const styles: Record<BadgeType, string> = {
  handmade: "bg-linen text-stone",
  custom: "bg-sage/15 text-sage-dark",
  bestseller: "bg-oak/20 text-oak-dark",
  new: "bg-sage-light/30 text-sage-dark",
};

export function Badge({
  type,
  className,
}: {
  type: BadgeType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]",
        styles[type],
        className
      )}
    >
      {labels[type]}
    </span>
  );
}
