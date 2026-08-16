@AGENTS.md

# Cart Shopper — Project

## What this is
Sleek animated e-commerce website for **physical goods**: browse catalog, cart,
checkout, pay via **PayFast** (ZAR, SA). Catalog TBD — schema-first, brand-neutral.

**Recent Enhancements:**
- Wired the full checkout flow: contact → shipping → payment → review → place order
- Order confirmation page (`/order-confirmation?id=CS-…`) reads from localStorage and
  shows line items, shipping address, and totals — a client component (reads storage
  only after mount/hydration)
- Toast notifications (sonner) for success/error instead of blocking alerts
- "Proceed to checkout" on `/cart` now links to the live `/checkout` page

**Full plan: `PLAN.md`** — read it before any work. This file is the quick index.

## Locked decisions
- Type: website (not an app), fully responsive
- Payment: PayFast, ZAR, hosted redirect + ITN server-side confirmation
- Products: physical goods, SA shipping (province + address at checkout)
- Accounts: guest checkout first, accounts later for order history
- Money stored as integer cents, order totals recomputed server-side

## Stack
Next.js (App Router) + React + Tailwind + Framer Motion + Zustand
Supabase (Postgres; Auth later) · PayFast ITN via API routes · Vercel
No real DB yet — cart, admin edits, and orders persist to **localStorage** only.

## Design (use /ui-ux-pro-max:ui-ux-pro-max and /huashu-design skills for UI work)
- Style: **huashu-design** — bright blues/whites, fades, glass pills, spring motion.
  Background images (picsum.photos) with blur + tint overlays behind hero/shop/footer.
  Button colors spread by context — see below.
- **Fonts:** Plus Jakarta Sans (display) + Inter (body). Declared in `src/app/layout.tsx`.
  Tokens in `src/app/globals.css`:
  - primary indigo `#4F46E5`, accent amber `#F59E0B`, secondary cyan `#06B6D4`
  - bg `#FAFAF8`, ink `#18181B`, warm cream `#F4F1E9`
- **Color system:** `src/lib/colors.ts` — 13 `ColorKey` palettes (indigo, violet,
  blue, sky, cyan, emerald, amber, rose, pink, fuchsia, lime, teal, slate). Each has
  gradient/soft/text/badge/ink/ring/hover/subtle classes. `Product.color: ColorKey`.
- **Button color rules:**
  - Add-to-cart pills → product's own gradient (rainbow across grid)
  - Checkout/confirm actions → emerald→teal
  - Brand anchors (hero, header Browse, admin add) → indigo/violet
  - Perks icons → cyan / emerald / amber
- Motion 150-300ms; **spring anims only allow 2 keyframes** (multi-keyframe arrays
  need a tween transition). Respect prefers-reduced-motion. SVG icons only.

## Data & storage
- **Cart:** Zustand + `persist` → localStorage key `cart-shopper-v1`.
- **Admin catalog:** `src/lib/storage.ts` — `productsApi` / `categoriesApi` CRUD
  over localStorage (`cart-shopper-v1-products`, `cart-shopper-v1-categories`).
  Seeds mirror `src/lib/catalog.ts`. **Not multi-device** — clear storage to reset.
- **Qty rule:** `setQty` with qty ≤ 0 **removes the item** from cart (fixed — was
  clamped to 1 before).
- **Orders:** `src/lib/orderStorage.ts` — `saveOrder` / `getAllOrders` /
  `getOrderById` over localStorage (`cart-shopper-orders`). Phase-3 Supabase will
  replace this. Orders are device-local, so a confirmation page opened on a
  different browser shows "Order not found".

## Pages
- `/` home — hero (bg image + blur), perks, category tiles, best sellers
- `/shop` — search/filter/sort grid, category pills, price range
- `/products/[slug]` — product detail + related
- `/cart` — line items, free-shipping progress, order summary
- `/checkout` — multi-step client flow (contact → shipping → payment → review),
  `CheckoutStepper` progress bar, order summary sidebar, `CheckoutClient` at
  `src/app/checkout/checkout-client.tsx`. Payment is a **mock/placeholder** until
  PayFast sandbox is wired — "Place order" just saves the local order, clears the
  cart, toasts, and redirects.
- `/order-confirmation` — client component (`order-confirmation-client.tsx`)
  reading `orderStorage` by `?id=`, with an "Order not found" state
- `/admin` — product + category CRUD (add/edit/delete), spring drawer forms,
  feature preset chips, saved toast

## Build status
Phase 1 BUILT and UI-overhauled: huashu design pass, fonts swapped (Sora/Manrope),
button color spread, background images with blur, admin page added, cart qty bug
fixed. Production build passes; dev server smoke-tested 200 (home, shop, admin, cart).

Phase 2 CHECKOUT IMPLEMENTED: Contact information, shipping address, payment
method selection, order review, order confirmation pages, localStorage order
persistence. /checkout renders a client flow; /order-confirmation is a client
component (server-reading localStorage was 404'ing). Production build passes.

⚠️ **sneaky** is testing live — fix reported issues as they come.

NOT done: live PayFast sandbox integration (requires API credentials),
Supabase accounts/orders (Phase 3), advanced shipping rate configuration,
real product catalog + store name, admin DB persistence.
