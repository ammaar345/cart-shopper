"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore, cartSubtotalCents, cartCount, appliedCoupon } from "@/lib/store";
import { PRODUCTS_BY_ID } from "@/lib/catalog";
import { formatZar } from "@/lib/format";
import { cn } from "@/lib/cn";
import { colorOf, tileClass, tileInkClass } from "@/lib/colors";
import { productImageUrl } from "@/lib/images";
import { MinusIcon, PlusIcon, XIcon } from "@/components/Icons";

const FREE_SHIPPING_THRESHOLD_CENTS = 75000;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const couponCode = useCartStore((s) => s.couponCode);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const clearCoupon = useCartStore((s) => s.clearCoupon);
  const [couponInput, setCouponInput] = useState("");

  const subtotal = cartSubtotalCents(items);
  const count = cartCount(items);
  const applied = appliedCoupon(couponCode, subtotal);
  const discount = applied?.discountCents ?? 0;
  const total = subtotal - discount;
  const toFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);
  const freeShipPct = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD_CENTS);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const error = applyCoupon(couponInput);
    if (error) {
      toast.error(error);
    } else {
      toast.success(`Coupon ${couponInput.trim().toUpperCase()} applied`);
      setCouponInput("");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-lg border border-border-soft bg-cream text-ink-soft/60">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10" aria-hidden>
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="17" cy="20" r="1.4" />
            <path d="M2.5 3.5h2.2l2.4 12h11.3l2-8.5H6" />
          </svg>
        </span>
        <h1 className="font-display text-3xl font-bold text-ink">Your cart is empty</h1>
        <p className="max-w-sm text-ink-soft">
          Looks like you haven&apos;t added anything yet. Let&apos;s fix that.
        </p>
        <Link href="/shop" className="btn btn-primary mt-2">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 py-8 lg:grid-cols-[1fr_360px]">
      {/* Line items */}
      <div>
        <h1 className="font-display text-4xl font-bold text-ink">
          Your cart
          <span className="ml-3 text-lg font-medium text-ink-soft">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </h1>

        {/* Free shipping progress */}
        <div className="card mt-6 p-5">
          <p className="text-sm font-semibold text-ink">
            {toFreeShip > 0 ? (
              <>
                You&apos;re{" "}
                <span className="text-primary">{formatZar(toFreeShip)}</span> away from
                free shipping
              </>
            ) : (
              <span className="text-success">You&apos;ve unlocked free shipping!</span>
            )}
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink/10">
            <motion.div
              className={cn("h-full rounded-full", toFreeShip === 0 ? "bg-success" : "bg-secondary")}
              initial={{ width: 0 }}
              animate={{ width: `${freeShipPct * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <ul className="mt-6 grid gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const p = PRODUCTS_BY_ID[item.productId];
              if (!p) return null;
              const onSale = p.compareAtCents !== null && p.compareAtCents > p.priceCents;
              return (
                <motion.li
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="card flex gap-4 p-4"
                >
                  <Link
                    href={`/products/${p.slug}`}
                    className={cn(
                      "relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-soft",
                      tileClass(colorOf(p.color)),
                    )}
                  >
                    <span
                      aria-hidden
                      className={`absolute font-display text-2xl font-bold ${tileInkClass(colorOf(p.color))}`}
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

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-display text-lg font-semibold text-ink transition-colors hover:text-primary"
                        >
                          {p.name}
                        </Link>
                        <p className="text-sm text-ink-soft">{p.tagline}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${p.name}`}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-ink-soft/60 transition-colors hover:bg-error-soft hover:text-error"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div className="flex items-center overflow-hidden rounded-lg border border-border-soft bg-bg">
                        <button
                          onClick={() => setQty(item.productId, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-10 w-10 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-7 text-center font-display text-base font-bold tabular-nums text-ink">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.productId, item.qty + 1)}
                          disabled={item.qty >= p.stock}
                          aria-label="Increase quantity"
                          className="flex h-10 w-10 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:bg-cream hover:text-ink disabled:opacity-30"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        {onSale && (
                          <p className="text-xs text-ink-soft/70 line-through">
                            {formatZar(p.compareAtCents! * item.qty)}
                          </p>
                        )}
                        <p className="font-display text-lg font-bold text-ink">
                          {formatZar(p.priceCents * item.qty)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          ← Continue shopping
        </Link>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold text-ink">Order summary</h2>

          {/* Coupon */}
          {applied ? (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-success/30 bg-success-soft px-3 py-2.5 text-sm">
              <span className="font-bold text-success">
                {applied.coupon.code} applied
              </span>
              <button
                onClick={() => {
                  clearCoupon();
                  toast.success("Coupon removed");
                }}
                className="cursor-pointer text-xs font-semibold text-success underline underline-offset-2 hover:opacity-70"
              >
                Remove
              </button>
            </div>
          ) : (
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyCoupon();
              }}
            >
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                aria-label="Coupon code"
                className="min-w-0 flex-1 rounded-lg border border-border-soft bg-bg px-3 py-2.5 text-sm uppercase tracking-wide outline-none transition-colors placeholder:normal-case placeholder:tracking-normal focus:border-primary"
              />
              <button type="submit" className="btn btn-outline btn-sm shrink-0">
                Apply
              </button>
            </form>
          )}

          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="font-semibold text-ink">{formatZar(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-soft">Discount ({applied?.coupon.code})</dt>
                <dd className="font-semibold text-success">−{formatZar(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="font-semibold text-ink">
                {toFreeShip > 0 ? "Calculated at checkout" : "Free"}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border-soft pt-3">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-display text-2xl font-bold text-ink">
                {formatZar(total)}
              </dd>
            </div>
          </dl>

          <Link
            href="/checkout"
            className="btn btn-primary btn-block mt-5 h-12"
          >
            Proceed to checkout
          </Link>

          <p className="mt-3 text-center text-xs text-ink-soft">
            Secure checkout via PayFast · Card, Instant EFT &amp; more
          </p>
        </div>
      </aside>
    </div>
  );
}
