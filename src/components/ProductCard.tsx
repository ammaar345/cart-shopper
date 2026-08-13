"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { formatZar } from "@/lib/format";
import { colorOf, tileClass, tileInkClass } from "@/lib/colors";
import { StarIcon, PlusIcon } from "./Icons";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const duo = colorOf(product.color);

  return (
    <motion.div
      layout
      className="group relative flex flex-col overflow-hidden rounded-card border border-border-soft bg-surface shadow-soft transition-shadow duration-400 hover:shadow-lift"
    >
      {/* Image area — duotone tile */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <div
          className={`
            flex h-full w-full items-center justify-center
            transition-transform duration-700 ease-out
            group-hover:scale-105
            ${tileClass(duo)}
          `}
        >
          <span className={`font-display text-5xl font-bold transition-transform duration-500 group-hover:scale-110 ${tileInkClass(duo)}`}>
            {product.name.charAt(0)}
          </span>
        </div>

        {/* Stamps */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && <span className="stamp stamp-soft">{product.badge}</span>}
          {product.compareAtCents && product.compareAtCents > product.priceCents && (
            <span className="stamp stamp-sale">Sale</span>
          )}
        </div>

        {/* Stock cue */}
        {product.stock <= 10 && (
          <span className="absolute right-3 top-3 text-[11px] font-bold uppercase tracking-wide text-ink/60">
            {product.stock} left
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-ink-soft">
          <StarIcon className="h-3.5 w-3.5 text-accent" />
          <span className="text-ink">{product.rating.toFixed(1)}</span>
          <span className="font-medium text-ink-soft/70">({product.reviewCount})</span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="font-display text-[15px] leading-tight font-semibold text-ink transition-colors group-hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {product.tagline}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2">
          <Price product={product} />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addItem(product.id)}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-ink text-white shadow-soft transition-colors hover:bg-primary active:shadow-none"
          >
            <PlusIcon className="h-5 w-5" strokeWidth={2.2} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Price block ───────────────────────────────────────────────────────────────

function Price({ product }: { product: Product }) {
  const onSale = product.compareAtCents && product.compareAtCents > product.priceCents;
  return (
    <div className="space-y-0.5">
      <p className="font-display text-base font-bold text-ink">
        {formatZar(product.priceCents)}
      </p>
      {onSale && (
        <p className="text-xs font-semibold text-ink-soft/70 line-through">
          {formatZar(product.compareAtCents!)}
        </p>
      )}
    </div>
  );
}
