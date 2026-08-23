/** Central site identity for SEO. Set NEXT_PUBLIC_SITE_URL before deploy
 *  (e.g. https://cartshopper.co.za) — sitemap/robots/OG URLs derive from it. */
export const SITE_NAME = "Cart Shopper";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const SITE_DESCRIPTION =
  "Premium everyday goods shipped across South Africa — audio, desk, kitchen, home, travel and wellness. Free delivery over R750, secure PayFast checkout.";
