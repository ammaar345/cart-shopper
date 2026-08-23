import type { Product } from "@/types";

/**
 * Resolves the display image for a product.
 * Priority: admin-set imageUrl → deterministic picsum.photos photo keyed by slug.
 * The slug seed means every product gets a stable, unique stock photo without
 * storing anything — swap in real photos later by setting imageUrl in admin.
 */
export function productImageUrl(p: Pick<Product, "slug" | "imageUrl">): string {
  const custom = p.imageUrl?.trim();
  if (custom) return custom;
  return `https://picsum.photos/seed/${encodeURIComponent(p.slug)}/800/800`;
}
