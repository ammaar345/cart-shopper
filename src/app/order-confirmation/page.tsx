import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orderStorage";
import Link from "next/link";
import { formatZar } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0">
                <Link href="/" className="text-xl font-display font-bold text-ink">
                  Cart Shopper
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    href="/"
                    className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft/70 hover:text-ink-soft hover:border-b-2 hover:border-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft/70 hover:text-ink-soft hover:border-b-2 hover:border-primary"
                  >
                    Shop
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              {/* Cart badge would go here in full implementation */}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Order Confirmation Content */}
            <div className="card p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-primary" aria-hidden>
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
                  <h2 className="font-display text-lg font-bold text-ink mb-4">
                    Order items
                  </h2>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-ink-soft">
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span>
                          {formatZar(item.quantity * item.priceCents)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-4 border-t border-border-soft">
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
                        {order.shippingCents === 0 ? "Free" : formatZar(order.shippingCents)}
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
                <div className="mt-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-primary" aria-hidden>
                        <path d="M12 8v4l3 3" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-ink">
                      Order status: <span className="text-primary">{order.status}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8">
                  <Link
                    href="/"
                    className="btn btn-outline mr-4"
                  >
                    Continue shopping
                  </Link>
                  <Link
                    href="/shop"
                    className="btn btn-primary"
                  >
                    Browse more products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}