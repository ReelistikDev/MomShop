import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const VARIANTS = {
  // The complete logo: turtle illustration + the script wordmark.
  full: { src: "/images/logo.jpg", width: 1800, height: 1800 },
  // Just the turtle/wave/lily illustration — wordmark cropped off. Use this
  // beside a text wordmark in tight spots like the header.
  mark: { src: "/images/logo-mark.png", width: 1220, height: 1239 },
} as const;

/**
 * The Myrtle Turtle logo — line art on white, so `mix-blend-multiply` drops the
 * white background out against the warm cream/linen surfaces it sits on. Size
 * it with `className` (e.g. `h-12 w-12`). Use `variant="mark"` for the
 * turtle-only mark, `variant="full"` for the mark + script wordmark.
 */
export function Logo({
  variant = "full",
  className,
  priority = false,
  sizes,
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const { src, width, height } = VARIANTS[variant];
  return (
    <Image
      src={src}
      alt={`${BRAND.name} logo`}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={cn("select-none object-contain mix-blend-multiply", className)}
    />
  );
}
