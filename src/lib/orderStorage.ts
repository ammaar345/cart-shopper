/**
 * Temporary order storage using localStorage.
 * When Supabase env vars are present (see src/lib/supabase.ts), each saved
 * order is ALSO pushed to the `orders`/`order_items` tables — fire-and-forget,
 * with localStorage remaining the source of truth until full Phase 3.
 */

import { getSupabase, isSupabaseEnabled } from "@/lib/supabase";

export interface Order {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    priceCents: number;
  }>;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  /** Amount removed by a coupon, in cents; absent on pre-coupon orders. */
  discountCents?: number;
  /** Coupon code applied to this order, if any. */
  couponCode?: string | null;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered";
  createdAt: string;
  customerInfo: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

const ORDER_STORAGE_KEY = "cart-shopper-orders";

/** Best-effort mirror of an order into Supabase. Never throws. */
function pushOrderToSupabase(order: Order): void {
  if (!isSupabaseEnabled()) return;
  const sb = getSupabase();
  if (!sb) return;

  void (async () => {
    const { error } = await sb.from("orders").insert({
      id: order.id,
      subtotal_cents: order.subtotalCents,
      shipping_cents: order.shippingCents,
      discount_cents: order.discountCents ?? 0,
      total_cents: order.totalCents,
      coupon_code: order.couponCode ?? null,
      status: order.status,
      customer_info: order.customerInfo,
      created_at: order.createdAt,
    });
    if (error) throw new Error(error.message);

    const res = await sb.from("order_items").insert(
      order.items.map((it) => ({
        order_id: order.id,
        product_id: it.productId,
        name: it.name,
        quantity: it.quantity,
        price_cents: it.priceCents,
      })),
    );
    if (res.error) throw new Error(res.error.message);
  })().catch((err: Error) =>
    console.error("Supabase order sync failed (kept locally):", err.message),
  );
}

export const orderStorage = {
  // Save order to localStorage
  saveOrder: (order: Order): void => {
    try {
      const orders = orderStorage.getAllOrders();
      orders.push(order);
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save order:", error);
    }
    pushOrderToSupabase(order);
  },

  // Get all orders
  getAllOrders: (): Order[] => {
    try {
      const ordersJson = localStorage.getItem(ORDER_STORAGE_KEY);
      return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (error) {
      console.error("Failed to get orders:", error);
      return [];
    }
  },

  // Get order by ID
  getOrderById: (id: string): Order | null => {
    try {
      const orders = orderStorage.getAllOrders();
      return orders.find((order) => order.id === id) || null;
    } catch (error) {
      console.error("Failed to get order by ID:", error);
      return null;
    }
  },

  // Clear all orders (useful for testing)
  clearAllOrders: (): void => {
    try {
      localStorage.removeItem(ORDER_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear orders:", error);
    }
  },
};