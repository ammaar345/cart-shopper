"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { formatZar } from "@/lib/format";
import { cn } from "@/lib/cn";
import { colorOf, tileClass, tileInkClass } from "@/lib/colors";
import { productImageUrl } from "@/lib/images";
import { Price } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { CheckIcon, MinusIcon, PlusIcon, ShieldIcon, StarIcon, TruckIcon } from "@/components/Icons";

export function ProductDetail({
  product,
  categoryName,
  related,
}: {
  product: Product;
  categoryName: string;
  related: Product[];
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const onSale = product.compareAtCents !== null && product.compareAtCents > product.priceCents;

  const add = () => {
    addItem(product.id, qty);
    setQty(1);
  };

  return (
    <div className="grid gap-12 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-soft">
        <Link href="/" className="transition-colors hover:text-primary">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/shop" className="transition-colors hover:text-primary">Shop</Link>
        <span aria-hidden>/</span>
        <Link href={`/shop?category=${product.categoryId}`} className="transition-colors hover:text-primary">
          {categoryName}
        </Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "relative aspect-square overflow-hidden rounded-card border border-border-soft",
            tileClass(colorOf(product.color)),
          )}
        >
          <span
            aria-hidden
            className={`absolute inset-0 flex items-center justify-center font-display text-8xl font-bold ${tileInkClass(colorOf(product.color))}`}
          >
            {product.name.charAt(0)}
          </span>
          <img
            src={productImageUrl(product)}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.badge && (
              <span className="stamp stamp-dark">{product.badge}</span>
            )}
            {onSale && (
              <span className="stamp stamp-sale">Sale</span>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-1 text-sm font-semibold text-ink-soft">
            <StarIcon className="h-4 w-4 text-accent" />
            {product.rating.toFixed(1)}
            <span className="font-normal text-ink-soft/70">
              · {product.reviewCount} reviews
            </span>
            {product.stock <= 10 && (
              <span className="ml-2 text-xs font-bold text-error">
                Only {product.stock} left
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink">
            {product.name}
          </h1>
          <p className="mt-2 text-lg text-ink-soft">{product.tagline}</p>

          <Price product={product} size="lg" className="mt-5" />

          <p className="mt-5 leading-relaxed text-ink-soft">{product.description}</p>

          {/* Features */}
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Add to cart */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center overflow-hidden rounded-lg border border-border-soft bg-bg">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-12 w-12 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:bg-cream hover:text-ink"
              >
                <MinusIcon className="h-5 w-5" />
              </button>
              <span className="w-8 text-center font-display text-lg font-bold tabular-nums text-ink">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                aria-label="Increase quantity"
                className="flex h-12 w-12 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:bg-cream hover:text-ink disabled:opacity-30"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={add}
              className="btn btn-primary flex-1 h-12 sm:flex-none sm:px-10"
            >
              Add to cart — {formatZar(product.priceCents * qty)}
            </motion.button>
          </div>

          {/* Trust */}
          <div className="mt-8 grid gap-3 rounded-card border border-border-soft bg-surface p-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <TruckIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Ships across SA</p>
                <p className="text-xs text-ink-soft">Free over R750</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Secure PayFast</p>
                <p className="text-xs text-ink-soft">Card &amp; Instant EFT</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold text-ink">You might also like</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
