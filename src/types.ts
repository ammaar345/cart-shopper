/** Money is stored as integer cents (ZAR) — never floats. */

export type ColorKey =
  | "indigo"
  | "violet"
  | "blue"
  | "sky"
  | "cyan"
  | "emerald"
  | "amber"
  | "rose"
  | "pink"
  | "fuchsia"
  | "lime"
  | "teal"
  | "slate";

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  gradient: string;
  color?: ColorKey;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  /** Price in cents (ZAR). */
  priceCents: number;
  /** Original price for sale display; null when not on sale. */
  compareAtCents: number | null;
  /** Short tagline shown on cards. */
  tagline: string;
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  /** Tailwind gradient classes for the placeholder "image". */
  gradient: string;
  /** Badge label (e.g. "Best seller", "New"); null when none. */
  badge: string | null;
  /** huashu-design color key — ensures consistent palette across the app. */
  color: ColorKey;
  /** ISO date string for newest-first sort. */
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}
