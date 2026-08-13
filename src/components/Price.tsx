import type { Product } from "@/types";
import { formatZar, percentOff } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Price with optional sale display + percent-off badge. */
export function Price({
  product,
  className,
  size = "md",
}: {
  product: Pick<Product, "priceCents" | "compareAtCents">;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const onSale = product.compareAtCents !== null && product.compareAtCents > product.priceCents;
  const off = onSale ? percentOff(product.priceCents, product.compareAtCents!) : 0;

  const main = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn("font-display font-bold text-ink", main)}>
        {formatZar(product.priceCents)}
      </span>
      {onSale && (
        <>
          <span className="text-sm text-ink-soft/70 line-through">
            {formatZar(product.compareAtCents!)}
          </span>
          <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-bold text-accent-dark">
            -{off}%
          </span>
        </>
      )}
    </div>
  );
}
