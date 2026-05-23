import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "sage" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-cream hover:bg-ink/88 shadow-soft hover:shadow-card hover:-translate-y-0.5",
  sage: "bg-sage text-white hover:bg-sage-dark shadow-soft hover:-translate-y-0.5",
  outline:
    "border border-line-strong bg-transparent text-ink hover:border-oak hover:bg-shell",
  ghost: "bg-transparent text-ink hover:bg-shell",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-[0.95rem]",
  lg: "px-8 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps &
  ({ href: string } & React.ComponentProps<typeof Link>) ) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function ActionButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
