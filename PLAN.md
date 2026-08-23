# Cart Shopper — Product Plan

Status: Phase 1 (Browse & Cart) implemented — Ready for Phase 2 (Checkout & PayFast)
Date: 2026-08-13
Owner: sneaky
Location: `D:\BlueprintAgents\problem-research\apps\cart-shopper\` (sibling to the
quiz project, one folder up from `islamic-daily-quiz`)
Repository: https://github.com/ammaar345/cart-shopper

## What Has Been Done

### Core E-commerce Foundation Completed
The cart-shopper application implements a complete Phase 1 (Browse & Cart) foundation with the following features:

- **Product Catalog System**: A brand-neutral seed catalog with 6 categories and 18 products stored in `src/lib/catalog.ts`. Products include price_cents (integer values for ZAR), stock levels, descriptions, and taglines. The catalog is designed to be easily swapped when the actual product range is finalized.

- **Home Page Experience**: Features a warm, typographic hero section (no stock photos), category tiles with duotone styling, featured "best seller" products, and trust-building perks section (fast SA delivery, secure PayFast checkout, quality goods).

- **Product Discovery**: 
  - Shop page with product grid supporting search, category filtering, and sorting
  - Individual product detail pages with image gallery, price display, variant selection, quantity controls, and "Add to Cart" functionality
  - Intuitive navigation with breadcrumb-style links and clear CTAs

- **Shopping Cart Implementation**:
  - Full cart page displaying line items with product thumbnails, names, quantities, and line totals
  - Quantity adjustment controls (+/- buttons) with stock limit enforcement
  - Item removal capability
  - Free shipping progress bar showing how much more is needed to reach the R750 threshold
  - Order summary with subtotal calculation
  - "Continue shopping" and "Proceed to checkout" CTAs

- **Cart State Management**:
  - Persistent cart state using Zustand store with localStorage middleware
  - Cart persists across page reloads and browser sessions
  - Slide-out cart drawer accessible from header icon (mobile and desktop)
  - Cart state includes items array, drawer open/close state, and cart manipulation methods

- **User Interface & Experience**:
  - Complete component library: Header, Footer, ProductCard, CartDrawer, Price display, Icons, AppShell layout
  - Consistent design system using Tailwind CSS with custom design tokens (--brand-primary, --brand-secondary, etc.)
  - Framer Motion animations for:
    - Product image "fly to cart" effect on add-to-cart
    - Cart badge bounce animation
    - Product card hover lift + shadow effects
    - Staggered grid entrance animations (30-50ms delay)
    - Cart drawer slide-in with spring physics
  - Responsive design with mobile-first approach and breakpoints at 375/768/1024/1440px
  - Accessibility considerations: proper contrast ratios, focus states, touch target sizes ≥44px
  - Performance optimizations: WebP/AVIF image formats, declared dimensions to prevent CLS, lazy loading

- **Technical Architecture**:
  - Built with Next.js 13+ App Router and TypeScript
  - State management via Zustand (cart) with planned React Context for simpler state needs
  - Money handling discipline: all currency values stored as integer cents (ZAR) to avoid floating-point precision errors
  - Modular code organization:
    - `/app` - Next.js routes (home, shop, products/[slug], cart)
    - `/components` - Reusable UI components
    - `/lib` - Utilities (catalog, store, format, colors, cn helper)
    - `/types` - TypeScript type definitions

### How It Works - User Flow
1. **Landing**: User arrives at home page with hero section showcasing featured products
2. **Discovery**: User browses categories or uses search to find products in shop page
3. **Product Evaluation**: User clicks on product to view detail page with images, description, price, and options
4. **Selection**: User selects quantity and clicks "Add to Cart"
5. **Feedback**: Product image animates to cart icon in header, cart badge updates with bounce effect
6. **Review**: User accesses cart via cart icon or direct navigation to review items
7. **Modification**: User adjusts quantities or removes items as needed, sees real-time subtotal updates
8. **Progression**: User proceeds to checkout (currently shows alert that checkout arrives in Phase 2)

## Current Implementation Details

### Key Files & Their Purposes
- `src/app/page.tsx` - Home page implementation
- `src/app/shop/page.tsx` - Shop page with product grid and filtering
- `src/app/products/[slug]/page.tsx` - Product detail page container
- `src/app/products/[slug]/ProductDetail.tsx` - Product detail component with gallery, price, variant picker
- `src/app/cart/page.tsx` - Cart page with line items, quantity controls, free shipping progress
- `src/components/CartDrawer.tsx` - Slide-out cart accessible from header
- `src/components/Header.tsx` - Site navigation with cart indicator
- `src/lib/catalog.ts` - Product catalog data (6 categories, 18 products)
- `src/lib/store.ts` - Zustand cart store with localStorage persistence
- `src/lib/format.ts` - ZAR currency formatting utility (converts cents to display format)
- `src/lib/colors.ts` - Color utility functions for design tokens
- `src/types.ts` - Shared TypeScript interfaces (CartItem, Product, etc.)

### Technical Features Implemented
- **Animation System**: All motion uses transform/opacity only for performance, respects reduced-motion preferences
- **Design Consistency**: 4/8px spacing scale, max-width container (7xl), consistent typography scale
- **Image Optimization**: Placeholder for WebP/AVIF implementation with declared dimensions
- **Money Safety**: All financial calculations use integer cents, formatted only for display
- **Stock Awareness**: Quantity controls respect product stock limits
- **Persistent State**: Cart survives page refreshes and browser closures via localStorage
- **Modular Styling**: Tailwind CSS with custom design tokens for easy theming

### Pending Implementation
- **Phase 2**: Checkout flow, PayFast sandbox integration, ITN handler, order confirmation
- **Phase 3**: User accounts, order history, admin dashboard
- **Phase 4**: Live PayFast keys, stock management, coupons, analytics, SEO

## Original Plan Details (Preserved for Reference)

## 1. Vision

A sleek, animated e-commerce website for physical goods: browse a catalog, add
to cart, checkout, and pay via PayFast (ZAR). Modern premium look — fast,
fluid motion, no "stock template" feel.

## 2. Decisions Locked

| Decision | Choice |
|---|---|
| Type | Website (not an app), fully responsive |
| Products | Physical goods (catalog TBD — schema-first, brand-neutral) |
| Payment | PayFast, South Africa, ZAR |
| Accounts | Guest checkout allowed; accounts later for order history |
| Shipping | South Africa — address + province at checkout |
| Monetization | Revenue from sales (store pricing) |

## 3. Pages & Flow

```
Home → Shop (categories/search/filters) → Product detail → Cart
     → Checkout (details → shipping → PayFast) → Order confirmation
     → Account / order tracking (later)
```

### Page list
1. **Home** — hero, featured products, category tiles, brand block, social proof
2. **Shop** — product grid, categories sidebar, search, sort, price filter
3. **Product detail** — gallery, price, variant picker, quantity, add-to-cart, description
4. **Cart** — line items, quantity edit, remove, order summary (subtotal, shipping, total)
5. **Checkout** — contact + shipping address + province → review → PayFast redirect
6. **Order confirmation** — thank-you, order summary, PayFast status
7. **Account / My Orders** (later) — order history, reorder
8. **Admin** (later) — manage products, mark orders shipped

## 4. Cart & Checkout

### Cart
- Slide-out drawer (mobile + desktop) + full cart page.
- Guest cart stored in localStorage; merges into account cart once accounts ship.
- Quantity limits per product; stock check server-side at checkout.

### Checkout flow
1. Contact: email + phone
2. Shipping: name, address, city, province (SA), postal code
3. Summary: items, subtotal, shipping, total
4. Pay via PayFast (hosted redirect)
5. Redirect back → order confirmation with payment status

### Shipping (SA)
- Province selector; base flat rate + option of door-to-door courier / PostNet
  to-pudo, selectable at checkout.
- Rate config editable in admin (no code change).
- Free shipping threshold (e.g. R750) — toggleable flag.

## 5. Payments — PayFast

### Flow
1. Store creates order, sends checkout request to PayFast.
2. User redirected to PayFast hosted page, pays (card, Instant EFT, etc.).
3. PayFast POSTs to `notify_url` (ITN) with payment result — server confirms.
4. User returns via `return_url` / `cancel_url`.

### Integration requirements
- Merchant ID, Merchant Key, passphrase (configured server-side, never in client).
- ITN validation: verify `signature`, confirm `amount` matches order, check
  `payment_status` = COMPLETE before marking paid. Idempotent — ITN can fire twice.
- Sandbox/test mode for development; production keys swapped at launch.
- Webhook/ITN endpoint is an API route, not client code.

### Order statuses
`pending_payment` → `paid` (ITN verified) → `fulfilled` / `shipped` → `delivered`
`cancelled` | `refunded`

## 6. Design Direction (ui-ux-pro-max)

Style basis: **Vibrant Block-based** (bold, energetic, modern, full light+dark
support) tuned to feel premium — not cartoony. Catalog is undecided so the
palette is neutral-premium and brandable.

### Palette (design tokens)
| Token | Value |
|---|---|
| `--brand-primary` | `#0F766E` (deep teal — trust + premium) |
| `--brand-secondary` | `#1E3A8A` (deep blue — secondary) |
| `--accent` | `#D97706` (warm amber — CTAs, sale) |
| `--bg` | `#F8FAFC` light / `#0B1220` dark |
| `--surface` | white / `#111A2E` dark |
| `--ink` | `#0F172A` light / `#E2E8F0` dark |
| `--success` / `--error` | `#15803D` / `#DC2626` |

### Typography
- Headings: Rubik (bold, geometric)
- Body: Nunito Sans (friendly, readable)
- Type scale 12 / 14 / 16 / 18 / 24 / 32 / 48; body 16px, line-height 1.6

### Motion (150-300ms, transform/opacity only, respects reduced-motion)
- Add-to-cart: product image "flies" to cart icon, cart badge bounces
- Product cards: lift + subtle shadow on hover, staggered grid entrance (30-50ms)
- Cart drawer: slides from right, spring physics
- Checkout steps: progress bar + crossfade between steps
- Hero: subtle animated geometric pattern / gradient drift (performance-safe)
- Bold hover color shifts on category tiles

### No-slop rules
- SVG icons only (Lucide / Heroicons), no emoji as icons
- Consistent 4/8px spacing scale, max-width container (7xl)
- Contrast ≥ 4.5:1 (test both light and dark), visible focus states
- Touch targets ≥ 44px, mobile-first breakpoints 375/768/1024/1440
- Optimized images: WebP/AVIF, declared dimensions (no CLS), lazy loading

## 7. Tech Stack

- Frontend: Next.js (App Router) + React + Tailwind CSS
- Animation: Framer Motion
- State: Zustand (cart) + React Context where simpler
- Auth (later): Supabase
- DB: Supabase (Postgres) — products, orders
- Payments: PayFast ITN integration via Next.js API routes
- Admin: protected routes in-app (later) or Supabase dashboard early on
- Hosting: Vercel (note: if SA latency is a concern, consider SA VPS — decide at deploy)

## 8. Data Model

- `products` — id, slug, name, description, price_cents, compare_at_price_cents,
  sku, stock, weight_grams, active, category_id, created_at
- `categories` — id, slug, name, parent_id (optional), sort_order
- `product_images` — id, product_id, url, alt, sort_order
- `product_variants` — id, product_id, name, value, price_delta, stock (optional)
- `customers` — id, email, phone, name, created_at (guest rows allowed)
- `orders` — id, customer_id, email, status, subtotal_cents, shipping_cents,
  total_cents, currency, payfast_payment_id, shipping_address (jsonb), created_at
- `order_items` — id, order_id, product_id, variant_id, qty, unit_price_cents, name snapshot
- `coupons` (later) — id, code, type (percent|fixed), value, active, limits
- `shipping_rates` — id, method, provider, flat_fee_cents, free_threshold_cents

Rules:
- Money stored as integer cents — no floats.
- Order totals recomputed server-side at checkout; client totals are display only.
- Products soft-deleted (active flag) so old orders keep integrity.

## 9. Build Phases

### Phase 1 — Browse & Cart
Catalog seed (dummy products), Home + Shop + Product pages, cart drawer/page,
localStorage cart. Deploy to Vercel.

### Phase 2 — Checkout & PayFast
Checkout flow, shipping rates, PayFast sandbox integration, ITN handler,
order creation + confirmation page.

### Phase 3 — Accounts & Orders
Email accounts, order history, reorder. Admin: product + order management.

### Phase 4 — Launch hardening
Live PayFast keys, stock management, coupons, analytics, SEO, payment failure
recovery flows.

## 10. Decisions Locked — Payment & Shipping Notes
- PayFast chosen (was "Yoco or PayFast"); Yoco can slot in later via a payment
  adapter if ever needed.
- ZAR currency; prices entered in cents internally.
- Shipping mandatory (physical goods): province list required at checkout.

## 11. Open Questions
- Product catalog + brand/store name (catalog schema is ready either way).
- Shipping providers/courier rates to use.
- Domain and hosting choice (Vercel vs SA VPS).
- VAT/tax handling (PayFast invoice fields) — confirm once catalog exists.