"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatZar } from "@/lib/format";
import { orderStorage, type Order } from "@/lib/orderStorage";

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Orders live in localStorage, so they can only be read after mount.
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(id ? orderStorage.getOrderById(id) : null);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-ink-soft">Loading your order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">
          Order not found
        </h1>
        <p className="max-w-sm text-ink-soft">
          We couldn&apos;t find that order on this device. Orders are saved
          locally for now, so they won&apos;t appear in a different browser.
        </p>
        <Link href="/shop" className="btn btn-primary mt-2">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-primary"
                aria-hidden
              >
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                Thank you for your order!
              </h1>
              <p className="text-sm text-ink-soft">
                Your order has been confirmed and is being processed.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Order number</span>
              <span className="font-mono text-ink">{order.id}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Date</span>
              <span className="text-ink">
                {new Date(order.createdAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h2 className="mb-4 font-display text-lg font-bold text-ink">
              Order items
            </h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-ink-soft"
                >
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatZar(item.quantity * item.priceCents)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="mb-2 font-display text-lg font-bold text-ink">
              Shipping to
            </h2>
            <p className="text-sm font-semibold text-ink">
              {order.customerInfo.firstName} {order.customerInfo.lastName}
            </p>
            <p className="text-sm text-ink-soft">{order.customerInfo.address}</p>
            <p className="text-sm text-ink-soft">
              {order.customerInfo.city}, {order.customerInfo.province}{" "}
              {order.customerInfo.postalCode}
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              {order.customerInfo.email} · {order.customerInfo.phone}
            </p>
          </div>

          {/* Order Summary */}
          <div className="mt-6 border-t border-border-soft pt-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-semibold text-ink">
                  {formatZar(order.subtotalCents)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Shipping</span>
                <span className="font-semibold text-ink">
                  {order.shippingCents === 0
                    ? "Free"
                    : formatZar(order.shippingCents)}
                </span>
              </div>

              <div className="flex justify-between border-t border-border-soft pt-4">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-display text-2xl font-bold text-ink">
                  {formatZar(order.totalCents)}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 text-primary"
                aria-hidden
              >
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ink">
              Order status: <span className="text-primary">{order.status}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-outline">
              Continue shopping
            </Link>
            <Link href="/shop" className="btn btn-primary">
              Browse more products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
