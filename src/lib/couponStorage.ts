import type { Coupon } from "@/types";

/** Coupon CRUD over localStorage — same pattern as products/categories in
 *  src/lib/storage.ts. Phase-3 Supabase will replace this. */

const COUPON_KEY = "cart-shopper-v1-coupons";

function seedCoupons(): Coupon[] {
  return [
    {
      id: "c1",
      code: "WELCOME10",
      type: "percent",
      value: 10,
      minSubtotalCents: 0,
      active: true,
      createdAt: "2026-08-01",
    },
    {
      id: "c2",
      code: "SAVE50",
      type: "fixed",
      value: 5000,
      minSubtotalCents: 50000,
      active: true,
      createdAt: "2026-08-01",
    },
  ];
}

function read(): Coupon[] {
  if (typeof window === "undefined") return seedCoupons();
  try {
    const raw = localStorage.getItem(COUPON_KEY);
    return raw ? (JSON.parse(raw) as Coupon[]) : seedCoupons();
  } catch {
    return seedCoupons();
  }
}

function write(all: Coupon[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COUPON_KEY, JSON.stringify(all));
}

export const couponsApi = {
  list(): Coupon[] {
    return read();
  },
  findActiveByCode(code: string): Coupon | undefined {
    const normalized = code.trim().toUpperCase();
    return read().find((c) => c.code === normalized && c.active);
  },
  add(c: Coupon) {
    write([...read(), c]);
  },
  update(id: string, patch: Partial<Coupon>) {
    write(read().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  },
  remove(id: string) {
    write(read().filter((c) => c.id !== id));
  },
};

/** Validates a coupon against a subtotal and returns its discount in cents.
 *  `error` is a customer-facing message; `discountCents` is 0 whenever error is set. */
export function evaluateCoupon(
  coupon: Coupon | undefined,
  subtotalCents: number,
): { error: string | null; discountCents: number } {
  if (!coupon || !coupon.active) {
    return { error: "That coupon code isn't valid.", discountCents: 0 };
  }
  if (subtotalCents < coupon.minSubtotalCents) {
    return {
      error: `Spend at least R${(coupon.minSubtotalCents / 100).toFixed(0)} to use this coupon.`,
      discountCents: 0,
    };
  }
  const raw =
    coupon.type === "percent"
      ? Math.floor((subtotalCents * coupon.value) / 100)
      : coupon.value;
  return { error: null, discountCents: Math.min(raw, subtotalCents) };
}
