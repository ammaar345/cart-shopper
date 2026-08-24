@AGENTS.md

# Cart Shopper — Project

## What this is
Sleek animated e-commerce website for **physical goods**: browse catalog, cart,
checkout, pay via **PayFast** (ZAR, SA). Catalog TBD — schema-first, brand-neutral.

**Recent Enhancements (Aug 23 session):**
- Real product photos everywhere (cards, detail, cart, drawer) via deterministic
  picsum.photos per slug — admin can override with a custom `imageUrl` + preview
- Coupon codes end-to-end: admin CRUD tab, apply UI on `/cart`, discount math in
  `/checkout`, `discountCents`/`couponCode` recorded on orders (seeds WELCOME10, SAVE50)
- `/orders` history page (device-local orders, status chips) + header nav link
- Inline per-field checkout validation (red borders + messages after Continue),
  sessionStorage checkout draft survives navigation, spinner/disabled Place order
- Admin: low-stock banner + red stock rows at ≤5, save-time validation,
  slug auto-derived from name and normalized while typing
- SEO pack: metadata templates, per-product OG images, sitemap.xml, robots.txt,
  noindex layouts for cart/checkout/admin/orders (site URL from NEXT_PUBLIC_SITE_URL)
- Dormant Supabase sync: placed orders dual-write once env vars are set — see
  SUPABASE.md; catalog stays local until Phase 3

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
- **Coupons:** `src/lib/couponStorage.ts` — `couponsApi` CRUD over localStorage
  (`cart-shopper-v1-coupons`) + `evaluateCoupon()`. Applied code lives in the
  zustand cart store (`couponCode`, persisted). Discount recomputes against
  subtotal at render time, so removing the coupon or shrinking the cart below
  its minimum silently drops it.
- **Checkout draft:** contact/shipping/step state persists to sessionStorage
  (`cart-shopper-checkout-draft`); cleared after a successful order.
- **Orders:** `src/lib/orderStorage.ts` — `saveOrder` / `getAllOrders` /
  `getOrderById` over localStorage (`cart-shopper-orders`). When Supabase env
  vars are set, `saveOrder` also fire-and-forget inserts into the `orders` +
  `order_items` tables (see SUPABASE.md); localStorage stays source of truth.
  Orders are device-local, so a confirmation page opened on a different browser
  shows "Order not found".

## Pages
- `/` home — hero (bg image + blur), perks, category tiles, best sellers
- `/shop` — search/filter/sort grid, category pills, price range
- `/products/[slug]` — product detail + photo hero + related
- `/cart` — line items with photos, free-shipping progress, coupon apply box,
  discount/total summary
- `/checkout` — multi-step client flow (contact → shipping → payment → review),
  `CheckoutStepper` progress bar, inline field validation, order summary sidebar
  with discount row, `CheckoutClient` at `src/app/checkout/checkout-client.tsx`.
  Payment is a **mock/placeholder** until PayFast sandbox is wired — "Place
  order" saves the local order (and mirrors to Supabase when configured), clears
  cart + coupon, toasts, and redirects.
- `/order-confirmation` — client component (`order-confirmation-client.tsx`)
  reading `orderStorage` by `?id=`, with an "Order not found" state
- `/orders` — device-local order history, status chips, totals; header nav link
- `/admin` — product + category + coupon CRUD, spring drawer forms, low-stock
  banner, feature preset chips, saved toast. All routes above except shop/home/
  products are noindexed.
- SEO: `src/app/sitemap.ts` (home, /shop, all product slugs) and
  `src/app/robots.ts`; base URL from `NEXT_PUBLIC_SITE_URL` via `src/lib/site.ts`.

## Build status
Phase 1 BUILT and UI-overhauled: huashu design pass, fonts swapped (Sora/Manrope),
button color spread, background images with blur, admin page added, cart qty bug
fixed. Production build passes; dev server smoke-tested 200 (home, shop, admin, cart).

Phase 2 CHECKOUT IMPLEMENTED: Contact information, shipping address, payment
method selection, order review, order confirmation pages, localStorage order
persistence. /checkout renders a client flow; /order-confirmation is a client
component (server-reading localStorage was 404'ing). Production build passes.

Aug 23 2026: production build green with photos, coupons, /orders, low-stock,
SEO routes (sitemap.xml + robots.txt appear in the route table), and the dormant
Supabase sync. Deps: added `@supabase/supabase-js`. `.env.example` is tracked
(force-added past the `.env*` ignore rule) — copy to `.env.local`.

⚠️ **sneaky** is testing live — fix reported issues as they come.

NOT done: live PayFast sandbox integration (requires API credentials),
Supabase auth + catalog migration (order sync is wired; products/categories/
coupons still localStorage — see STILL TO DO below), advanced shipping rate
configuration, real product catalog + store name.

## Status log (Aug 2026 session)

Done:
- Checkout draft persists via sessionStorage across navigation; cleared after
  successful order placement.
- Place-order buttons disabled with spinner during processing; double-submit guarded.
- Step-validation failures use sonner toasts (blocking alerts removed).
- Admin product form validates on save (name, slug format, price/stock/rating/
  reviewCount ranges) and auto-derives slug from name on blur.
- Real product images: deterministic per-slug picsum.photos URL via
  `src/lib/images.ts` → `productImageUrl()`. Optional custom `imageUrl` on
  Product (editable in admin) overrides the default. Letter-tile remains as
  loading/missing fallback.

🚨 STILL TO DO — do not drop these:
1. Live PayFast sandbox integration — BLOCKED on sneaky creating a sandbox
   profile at payfast.io and sharing Merchant ID / Key / passphrase
2. Supabase catalog migration (products/categories/coupons) — order sync is
   LIVE once env vars are set (see SUPABASE.md); catalog tables still local
3. User accounts + auth (login/register) — orders page notes device-only
4. Order confirmation emails
5. Analytics events (view item, add to cart, purchase)

## What sneaky needs to do (action items)

- [ ] **Test the Aug 23 build** (~5 min): `npm run dev` → http://localhost:3000/shop →
  add 2 items → apply `WELCOME10` in the cart → complete checkout → verify `/orders`
  shows the discounted order and `/admin` shows photos, coupon tab, low-stock banner.
- [ ] **PayFast sandbox** (~10 min) — BLOCKER for real payments: register at
  https://payfast.io, enable Sandbox, hand over Merchant ID + Merchant Key +
  passphrase so the hosted-checkout redirect + ITN confirmation can be wired.
- [ ] **Supabase project** (~10 min): follow SUPABASE.md — free project at
  https://supabase.com/dashboard → run `supabase/schema.sql` in its SQL editor →
  put URL + anon key in `.env.local`. Orders start syncing to a real DB immediately.
- [ ] **Set `NEXT_PUBLIC_SITE_URL`** in `.env.local` before any deploy — sitemap.xml,
  robots.txt, and Open Graph URLs otherwise emit http://localhost:3000.
- [ ] **Real product photos before launch**: picsum placeholders are random
  landscapes — source real shots and paste URLs into each product's Image URL
  field in /admin (no code changes needed).
- [ ] **Pick an email provider** for order confirmations (suggested: Resend free
  tier) and say the word so it gets wired.
- [ ] **Decide store name + real catalog** — brand-neutral seeds ("Cart Shopper",
  18 demo products) need replacing with the real lineup before going live.

Done since Aug 23 session start:
- SEO pack: metadata templates, per-product OG images, sitemap.xml, robots.txt,
  noindex layouts for cart/checkout/admin/orders (src/lib/site.ts holds SITE_URL)
- Coupons end-to-end: admin Coupons tab CRUD, cart apply UI, checkout discount
  math, discountCents/couponCode on orders; seeds WELCOME10 + SAVE50
- /orders history page with status chips; nav link added
- Admin low-stock alerts (banner + red rows at ≤5 stock)
- Supabase scaffold dormant: supabase/schema.sql, src/lib/supabase.ts,
  dual-write of orders on save, .env.example, SUPABASE.md
