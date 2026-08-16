/**
 * Temporary order storage using localStorage
 * This will be replaced with Supabase integration in Phase 3
 */

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