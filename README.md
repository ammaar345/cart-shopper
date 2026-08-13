# Cart Shopper

A sleek, animated e-commerce website for physical goods. Browse a catalog,
add to cart, checkout (PayFast, ZAR). South African shipping.

Full product plan: [`PLAN.md`](PLAN.md) · project conventions: [`CLAUDE.md`](CLAUDE.md)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Test

```bash
npm run build    # production build + type check
npm run lint
```

## Pages

- **/** — hero, category tiles, featured best sellers
- **/shop** — product grid with search, category filter, price range, sorting
- **/products/[slug]** — product detail, quantity, add to cart, related items
- **/cart** — line items, quantity edit, free-shipping progress, order summary

Cart state persists in localStorage. Checkout (PayFast) arrives in Phase 2.

## Structure

```
src/
  app/                  routes: home, shop, products/[slug], cart
  components/           Header, CartDrawer, ProductCard, Price, AppShell, Icons
  lib/
    catalog.ts          seed catalog (6 categories, 18 products, brand-neutral)
    store.ts            Zustand cart + localStorage persistence
    format.ts           ZAR currency formatting (integer cents)
  types.ts
```

## Content

Money is stored as integer cents (ZAR). The catalog is a brand-neutral seed —
swap `src/lib/catalog.ts` when the real product range is decided.
