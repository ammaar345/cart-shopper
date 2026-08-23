"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Coupon } from "@/types";
import { PRODUCTS_BY_ID } from "@/lib/catalog";
import { couponsApi, evaluateCoupon } from "@/lib/couponStorage";

interface CartState {
  items: CartItem[];
  /** Applied coupon code (validated on apply). */
  couponCode: string | null;
  drawerOpen: boolean;
  /** Returns an error message, or null when applied successfully. */
  applyCoupon: (code: string) => string | null;
  clearCoupon: () => void;
  addItem: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      drawerOpen: false,

      applyCoupon: (code) => {
        const subtotal = cartSubtotalCents(get().items);
        const coupon = couponsApi.findActiveByCode(code);
        const { error } = evaluateCoupon(coupon, subtotal);
        if (error) return error;
        set({ couponCode: code.trim().toUpperCase() });
        return null;
      },

      clearCoupon: () => set({ couponCode: null }),

      addItem: (productId, qty = 1) => {
        const product = PRODUCTS_BY_ID[productId];
        if (!product) return;
        const items = get().items;
        const existing = items.find((i) => i.productId === productId);
        const currentQty = existing?.qty ?? 0;
        const nextQty = Math.min(currentQty + qty, product.stock);
        if (nextQty <= 0) return;
        set({
          items: existing
            ? items.map((i) => (i.productId === productId ? { ...i, qty: nextQty } : i))
            : [...items, { productId, qty: nextQty }],
          drawerOpen: true,
        });
      },

      setQty: (productId, qty) => {
        const product = PRODUCTS_BY_ID[productId];
        const max = product?.stock ?? 99;

        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }

        const clamped = Math.min(qty, max);
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, qty: clamped } : i,
          ),
        });
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "cart-shopper-v1",
      partialize: (s) => ({ items: s.items, couponCode: s.couponCode }),
    },
  ),
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((sum, i) => {
    const p = PRODUCTS_BY_ID[i.productId];
    return sum + (p ? p.priceCents * i.qty : 0);
  }, 0);
}

/** Resolves the currently applied coupon for a subtotal.
 *  Returns undefined when no code is set or it no longer validates. */
export function appliedCoupon(
  couponCode: string | null,
  subtotalCents: number,
): { coupon: Coupon; discountCents: number } | undefined {
  if (!couponCode) return undefined;
  const coupon = couponsApi.findActiveByCode(couponCode);
  const { error, discountCents } = evaluateCoupon(coupon, subtotalCents);
  if (error || !coupon) return undefined;
  return { coupon, discountCents };
}
