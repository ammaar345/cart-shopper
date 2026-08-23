# Supabase setup — Phase 3 activation

The app ships with a **dormant** Supabase integration. Nothing changes until
you add credentials; then new orders mirror into your database automatically.

## Activate in 4 steps (~10 minutes)

1. Create a free project at https://supabase.com/dashboard (no credit card).
2. Open the SQL Editor in the dashboard and run everything in `supabase/schema.sql`.
3. Copy **Project URL** and **anon public key** from Project Settings → API.
4. Copy `.env.example` to `.env.local`, paste both values, restart `npm run dev`.

From then on every placed order is stored locally AND inserted into the
`orders` + `order_items` tables. If the insert fails, the order is still safe
locally and the error is logged to the browser console.

## What stays local for now

- Catalog (products/categories) and coupons still live in localStorage.
- Migrating them is the remaining Phase 3 work — target tables are sketched
  as comments at the bottom of `supabase/schema.sql`.

## Security notes

- The anon key is public by design; RLS policies in schema.sql let guests
  INSERT orders but read nothing back.
- Admin/staff reads need the service-role key server-side or auth roles —
  do that when accounts arrive.
