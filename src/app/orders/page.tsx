"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Order } from "@/lib/orderStorage";
import { orderStorage } from "@/lib/orderStorage";
import { formatZar } from "@/lib/format";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-cream text-ink-soft",
  confirmed: "bg-success-soft text-success",
  processing: "bg-primary-soft text-primary",
  shipped: "bg-secondary-soft text-secondary",
  delivered: "bg-success text-white",
};

export default function OrdersPage() {
  // null = not yet read from localStorage (avoids SSR/hydration mismatch)
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    setOrders(orderStorage.getAllOrders());
  }, []);

  if (orders === null) return null;

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-lg border border-border-soft bg-cream text-ink-soft/60">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10" aria-hidden>
            <path d="M6 3h12l1.5 5H4.5L6 3z" />
            <path d="M4.5 8h15l-1 11a2 2 0 0 1-2 1.8h-9a2 2 0 0 1-2-1.8l-1-11z" />
            <path d="M9.5 12.5h5" />
          </svg>
        </span>
        <h1 className="font-display text-3xl font-bold text-ink">No orders yet</h1>
        <p className="max-w-sm text-ink-soft">
          Orders you place will show up here so you can track them.
        </p>
        <Link href="/shop" className="btn btn-primary mt-2">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 py-8">
      <div>
        <h1 className="font-display text-4xl font-bold text-ink">Your orders</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {sorted.length} {sorted.length === 1 ? "order" : "orders"} on this device
        </p>
      </div>

      <ul className="grid gap-4">
        {sorted.map((o) => (
          <li key={o.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-bold text-ink">{o.id}</p>
                <p className="text-xs text-ink-soft">
                  {new Date(o.createdAt).toLocaleString("en-ZA", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[o.status] ?? STATUS_STYLES.pending}`}
              >
                {o.status}
              </span>
            </div>

            <ul className="mt-4 grid gap-1 border-t border-border-soft pt-3 text-sm text-ink-soft">
              {o.items.map((it) => (
                <li key={it.productId} className="flex justify-between gap-4">
                  <span>
                    {it.quantity}× {it.name}
                  </span>
                  <span className="tabular-nums">
                    {formatZar(it.priceCents * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-lg font-bold text-ink">
                {formatZar(o.totalCents)}
                {"discountCents" in o && o.discountCents > 0 && (
                  <span className="ml-2 text-xs font-semibold text-success">
                    incl. discount
                  </span>
                )}
              </p>
              <Link
                href={`/order-confirmation?id=${o.id}`}
                className="btn btn-outline btn-sm"
              >
                View details
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-ink-soft/70">
        Orders are stored on this device only until account sign-up arrives.
      </p>
    </div>
  );
}
