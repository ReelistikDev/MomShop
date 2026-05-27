import { cn } from "@/lib/utils";
import { SprigIcon } from "@/components/icons";

/** Stand-in for a product card while the real lineup + photos are pending. */
export function ComingSoonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line-strong bg-shell text-center",
        className
      )}
    >
      <SprigIcon className="h-7 w-7 text-sage/70" />
      <span className="font-script text-2xl leading-none text-stone">
        New piece
      </span>
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-mist">
        Fresh in the shop
      </span>
    </div>
  );
}

/**
 * Fills its container in place of an <Image>. `tone="light"` shows a warm linen
 * panel with a sprig + caption; `tone="dark"` is a twilight→ink gradient meant
 * to sit behind cream text (no caption).
 */
export function PlaceholderPanel({
  className,
  label = "Photo on the way",
  tone = "light",
}: {
  className?: string;
  label?: string;
  tone?: "light" | "dark";
}) {
  if (tone === "dark") {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-twilight via-twilight to-ink",
          className
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-linen to-sand text-mist",
        className
      )}
    >
      <SprigIcon className="h-8 w-8 text-sage/70" />
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
        {label}
      </span>
    </div>
  );
}
