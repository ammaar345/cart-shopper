import type { Metadata } from "next";
import { ShopGrid } from "./ShopGrid";
import { CATEGORIES } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop — Cart Shopper",
  description: "Browse our full catalog.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; min?: string; max?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="grid gap-8 py-8">
      <div className="relative overflow-hidden rounded-card border border-border-soft bg-cream/60 px-6 py-12 sm:px-10">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-10 font-display text-[11rem] font-black leading-none text-ink/[0.05] select-none"
        >
          Shop
        </span>
        <div className="relative">
          <p className="eyebrow">The catalog</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ink">Shop</h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            {CATEGORIES.length} curated categories, every item quality-checked
            and shipped from South Africa.
          </p>
        </div>
      </div>

      <ShopGrid
        initialCategory={params.category ?? null}
        initialQuery={params.q ?? ""}
        initialSort={params.sort ?? "featured"}
        initialMin={params.min ?? ""}
        initialMax={params.max ?? ""}
      />
    </div>
  );
}
