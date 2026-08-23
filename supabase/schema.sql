-- Cart Shopper — Supabase schema (Phase 3)
-- Run this in the Supabase SQL editor after creating a free project.
-- App ids are short strings generated client-side, so text PKs match as-is.

create table if not exists public.orders (
  id text primary key,                      -- e.g. "CS-48213" from checkout
  subtotal_cents integer not null,
  shipping_cents integer not null default 0,
  discount_cents integer not null default 0,
  total_cents integer not null,
  coupon_code text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered')),
  customer_info jsonb not null,             -- {email, phone, firstName, ...}
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  quantity integer not null check (quantity > 0),
  price_cents integer not null
);

create index if not exists order_items_order_idx on public.order_items(order_id);

-- Phase 3 catalog migration targets (app currently reads localStorage seeds):
-- create table public.categories (
--   id text primary key, slug text unique not null, name text not null,
--   tagline text, gradient text, color text);
-- create table public.products (
--   id text primary key, slug text unique not null, name text not null,
--   category_id text references public.categories(id), price_cents integer not null,
--   compare_at_cents integer, tagline text, description text, features jsonb,
--   rating numeric, review_count integer, stock integer not null default 0,
--   gradient text, badge text, color text, image_url text, created_at date);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Guests may create orders but never read anyone's.
create policy "anon can insert orders"
  on public.orders for insert to anon with check (true);

create policy "anon can insert order items"
  on public.order_items for insert to anon with check (true);

-- Staff/admin reads happen with the service-role key or a future auth role:
-- create policy "staff read orders"
--   on public.orders for select to authenticated using (true);
