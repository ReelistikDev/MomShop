import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-h2 max-w-2xl text-balance">{title}</h2>
      {intro && (
        <p
          className={cn(
            "max-w-xl text-[1.05rem] leading-relaxed text-stone",
            align === "center" && "mx-auto"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
