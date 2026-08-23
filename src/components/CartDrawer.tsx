"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore, cartSubtotalCents } from "@/lib/store";
import { PRODUCTS_BY_ID } from "@/lib/catalog";
import { formatZar } from "@/lib/format";
import { cn } from "@/lib/cn";
import { colorOf, tileClass, tileInkClass } from "@/lib/colors";
import { productImageUrl } from "@/lib/images";
import { MinusIcon, PlusIcon, XIcon, ArrowRightIcon } from "./Icons";

const FREE_SHIP_CENTS = 75000;

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.drawerOpen);
  const close = useCartStore((s) => s.closeDrawer);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = cartSubtotalCents(items);
  const totalQty = items.reduce((n, i) => n + i.qty, 0);
  const toFreeShip = Math.max(0, FREE_SHIP_CENTS - subtotal);
  const freeShipPct = Math.min(1, subtotal / FREE_SHIP_CENTS);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Glass backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
          />

          {/* Main panel */}
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%", opacity: 0.4 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.4 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-white/95 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: totalQty > 0 ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 0.35 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-soft bg-cream text-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <circle cx="9" cy="20" r="1.4" />
                    <circle cx="17" cy="20" r="1.4" />
                    <path d="M2.5 3.5h2.2l2.4 12h11.3l2-8.5H6" />
                  </svg>
                </motion.div>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink leading-none">
                    Your cart
                  </h2>
                  {totalQty > 0 && (
                    <motion.p
                      key={totalQty}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-0.5 text-xs font-semibold text-primary"
                    >
                      {totalQty} {totalQty === 1 ? "item" : "items"}
                    </motion.p>
                  )}
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-bg text-ink-soft transition-colors hover:bg-error-soft hover:text-error"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {/* ── Body ────────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                /* Empty state */
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="flex h-20 w-20 items-center justify-center rounded-lg border border-border-soft bg-cream"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      className="h-9 w-9 text-ink-soft/60"
                    >
                      <circle cx="9" cy="20" r="1.4" />
                      <circle cx="17" cy="20" r="1.4" />
                      <path d="M2.5 3.5h2.2l2.4 12h11.3l2-8.5H6" />
                    </svg>
                  </motion.div>
                  <div>
                    <p className="font-display text-base font-bold text-ink">
                      Your cart is empty
                    </p>
                    <p className="mt-1 max-w-[200px] text-xs text-ink-soft">
                      Find something you love — it&apos;s waiting for you.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="btn btn-primary btn-sm mt-2"
                  >
                    Browse the shop
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  <ul className="grid gap-3">
                    {items.map((item, idx) => {
                      const p = PRODUCTS_BY_ID[item.productId];
                      if (!p) return null;
                      const onSale =
                        p.compareAtCents !== null && p.compareAtCents > p.priceCents;
                      return (
                        <motion.li
                          key={item.productId}
                          layout
                          initial={{ opacity: 0, y: 14, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{
                            opacity: 0,
                            x: 30,
                            scale: 0.95,
                            transition: { duration: 0.2 },
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 28,
                            delay: idx * 0.03,
                          }}
                          className="flex gap-3 rounded-card border border-border-soft bg-surface p-3 shadow-soft"
                        >
                          {/* Image — photo over duotone tile */}
                          <Link
                            href={`/products/${p.slug}`}
                            onClick={close}
                            className={cn(
                              "relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg",
                              tileClass(colorOf(p.color)),
                            )}
                          >
                            <span
                              aria-hidden
                              className={`absolute font-display text-lg font-bold ${tileInkClass(colorOf(p.color))}`}
                            >
                              {p.name.charAt(0)}
                            </span>
                            <img
                              src={productImageUrl(p)}
                              alt={p.name}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          </Link>

                          {/* Details */}
                          <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <Link
                                href={`/products/${p.slug}`}
                                onClick={close}
                                className="truncate pr-2 text-sm font-bold text-ink transition-colors hover:text-primary"
                              >
                                {p.name}
                              </Link>
                              <button
                                onClick={() => removeItem(item.productId)}
                                aria-label={`Remove ${p.name}`}
                                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-soft/60 transition-colors hover:bg-error-soft hover:text-error"
                              >
                                <XIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Price row */}
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-sm font-bold text-ink">
                                {formatZar(p.priceCents * item.qty)}
                              </span>
                              {onSale && (
                                <span className="text-xs text-ink-soft/70 line-through">
                                  {formatZar((p.compareAtCents ?? 0) * item.qty)}
                                </span>
                              )}
                            </div>

                            {/* Qty controls */}
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center overflow-hidden rounded-lg border border-border-soft bg-bg">
                                <button
                                  onClick={() => setQty(item.productId, item.qty - 1)}
                                  aria-label="Decrease quantity"
                                  className="flex h-8 w-8 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                                >
                                  <MinusIcon className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-6 text-center text-sm font-bold tabular-nums text-ink">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => setQty(item.productId, item.qty + 1)}
                                  disabled={item.qty >= p.stock}
                                  aria-label="Increase quantity"
                                  className="flex h-8 w-8 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:bg-cream hover:text-ink disabled:opacity-25"
                                >
                                  <PlusIcon className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* stock cue */}
                              {p.stock <= 10 && (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-ink-soft/70">
                                  Only {p.stock} left
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                </AnimatePresence>
              )}
            </div>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            {items.length > 0 && (
              <div className="space-y-4 border-t border-border-soft bg-cream/50 px-5 py-5">
                {/* Free shipping progress */}
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn(
                      "font-medium",
                      toFreeShip > 0 ? "text-ink-soft" : "text-success",
                    )}>
                      {toFreeShip > 0
                        ? <>Add {formatZar(toFreeShip)} for free shipping</>
                        : "Free shipping unlocked!"
                      }
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        toFreeShip === 0 ? "bg-success" : "bg-secondary",
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShipPct * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink-soft">Subtotal</span>
                  <span className="font-display text-2xl font-bold text-ink">
                    {formatZar(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">Shipping and discount codes calculated at checkout.</p>

                {/* Checkout CTA */}
                <Link
                  href="/cart"
                  onClick={close}
                  className="btn btn-primary btn-block h-12"
                >
                  Go to checkout
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
