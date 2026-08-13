import type { Category, Product } from "@/types";

/** Seed catalog — the single source of truth.
 *  Admin edits are persisted to localStorage; this file is the canonical shape.
 *  See src/lib/storage.ts for admin CRUD API.
 */

export const CATEGORIES: Category[] = [
  { id: "audio",   slug: "audio",   name: "Audio",   tagline: "Sound that feels alive",   gradient: "from-indigo-500 via-violet-500 to-purple-500", color: "indigo" },
  { id: "desk",    slug: "desk",    name: "Desk",    tagline: "Workspaces you want to sit at", gradient: "from-cyan-500 via-sky-500 to-blue-500", color: "sky" },
  { id: "kitchen", slug: "kitchen", name: "Kitchen", tagline: "Tools that make cooking easy", gradient: "from-amber-500 via-orange-500 to-rose-500", color: "amber" },
  { id: "home",    slug: "home",    name: "Home",    tagline: "Little comforts, daily",   gradient: "from-emerald-500 via-teal-500 to-green-500", color: "emerald" },
  { id: "travel",  slug: "travel",  name: "Travel",  tagline: "Built for moving",        gradient: "from-fuchsia-500 via-pink-500 to-rose-500", color: "fuchsia" },
  { id: "wellness",slug: "wellness",name: "Wellness",tagline: "Moments to reset",        gradient: "from-lime-500 via-green-500 to-emerald-500", color: "lime" },
];

export const PRODUCTS: Product[] = [
  // ── Audio ──────────────────────────────────────────────────────────────────
  {
    id: "a1", slug: "orbit-headphones", name: "Orbit Wireless Headphones",
    categoryId: "audio", priceCents: 249900, compareAtCents: 329900,
    tagline: "Studio sound, all-day comfort",
    description: "Precision-tuned 40 mm drivers deliver rich, balanced audio with deep bass and crystal-clear highs. Plush memory-foam ear cups and a featherweight frame make long listening sessions effortless.",
    features: ["40mm precision drivers", "38-hour battery life", "Active noise cancelling", "Bluetooth 5.3 + wired"],
    rating: 4.8, reviewCount: 412, stock: 24,
    gradient: "from-indigo-500 to-violet-600", badge: "Best seller",
    color: "indigo", createdAt: "2025-01-01",
  },
  {
    id: "a2", slug: "pulse-mini-speaker", name: "Pulse Mini Speaker",
    categoryId: "audio", priceCents: 89900, compareAtCents: null,
    tagline: "Big sound from a tiny sphere",
    description: "A palm-sized speaker that fills the room with seamless 360° audio. IPX6 splash-proof, 14-hour battery, TWS pairing.",
    features: ["360° sound", "14-hour battery", "IPX6 water resistant", "TWS pairing"],
    rating: 4.6, reviewCount: 208, stock: 56,
    gradient: "from-violet-500 to-purple-600", badge: null,
    color: "violet", createdAt: "2025-02-15",
  },
  {
    id: "a3", slug: "echo-buds", name: "Echo Buds Pro",
    categoryId: "audio", priceCents: 179900, compareAtCents: 199900,
    tagline: "True wireless, zero fuss",
    description: "Compact earbuds with adaptive ANC, touch controls, and a pocketable wireless-charging case.",
    features: ["Adaptive ANC", "32h total battery", "Wireless charging case", "Low-latency mode"],
    rating: 4.7, reviewCount: 351, stock: 40,
    gradient: "from-blue-500 to-indigo-600", badge: "New",
    color: "blue", createdAt: "2025-06-01",
  },
  // ── Desk ───────────────────────────────────────────────────────────────────
  {
    id: "d1", slug: "halo-desk-lamp", name: "Halo Desk Lamp",
    categoryId: "desk", priceCents: 129900, compareAtCents: null,
    tagline: "Light that follows your day",
    description: "A sculptural lamp with stepless 2700K–6000K range, a Qi wireless charger base, and brightness memory.",
    features: ["2700K–6000K range", "Qi wireless charging base", "Touch dimmer", "Auto off timer"],
    rating: 4.5, reviewCount: 122, stock: 33,
    gradient: "from-cyan-400 to-blue-500", badge: null,
    color: "cyan", createdAt: "2025-01-20",
  },
  {
    id: "d2", slug: "vertex-mechanical-keyboard", name: "Vertex Mechanical Keyboard",
    categoryId: "desk", priceCents: 189900, compareAtCents: 229900,
    tagline: "Clacky, tactile, customisable",
    description: "Hot-swappable switches, gasket-mounted plate, per-key RGB, USB-C and Bluetooth.",
    features: ["Hot-swappable switches", "Gasket mount", "Per-key RGB", "USB-C + Bluetooth"],
    rating: 4.9, reviewCount: 276, stock: 18,
    gradient: "from-sky-400 to-blue-600", badge: "Best seller",
    color: "sky", createdAt: "2024-11-01",
  },
  {
    id: "d3", slug: "nomad-laptop-stand", name: "Nomad Laptop Stand",
    categoryId: "desk", priceCents: 74900, compareAtCents: null,
    tagline: "Better posture, cooler laptop",
    description: "Foldable aerospace-aluminium stand with 6 height positions. Fits any bag.",
    features: ["Aerospace aluminium", "Folds flat", "6 height positions", "Grip pads"],
    rating: 4.4, reviewCount: 98, stock: 61,
    gradient: "from-slate-500 to-blue-700", badge: null,
    color: "slate", createdAt: "2025-03-10",
  },
  // ── Kitchen ────────────────────────────────────────────────────────────────
  {
    id: "k1", slug: "ember-kettle", name: "Ember Pour Kettle",
    categoryId: "kitchen", priceCents: 159900, compareAtCents: null,
    tagline: "Precision pour, every cup",
    description: "Gooseneck kettle with ±1°C control and 1 L capacity. Rapid boil in 3 min, auto shut-off.",
    features: ["±1°C temperature control", "1L capacity", "Rapid boil in 3 min", "Auto shut-off"],
    rating: 4.7, reviewCount: 189, stock: 27,
    gradient: "from-amber-400 to-orange-500", badge: "New",
    color: "amber", createdAt: "2025-06-15",
  },
  {
    id: "k2", slug: "terra-grinder", name: "Terra Coffee Grinder",
    categoryId: "kitchen", priceCents: 99900, compareAtCents: 119900,
    tagline: "Fresh ground, zero fuss",
    description: "Compact burr grinder with 30 settings. Stainless steel burrs, single-dose chamber.",
    features: ["30 grind settings", "Stainless steel burrs", "Single-dose chamber", "Static-free cup"],
    rating: 4.6, reviewCount: 214, stock: 44,
    gradient: "from-orange-400 to-amber-600", badge: null,
    color: "amber", createdAt: "2024-09-01",
  },
  {
    id: "k3", slug: "flora-bottle", name: "Flora Insulated Bottle",
    categoryId: "kitchen", priceCents: 54900, compareAtCents: null,
    tagline: "Cold for 24h, hot for 12",
    description: "750 ml double-wall vacuum, leak-proof lid, powder-coated exterior.",
    features: ["24h cold / 12h hot", "Double-wall vacuum", "Leak-proof lid", "750ml"],
    rating: 4.5, reviewCount: 156, stock: 88,
    gradient: "from-rose-400 to-red-500", badge: null,
    color: "rose", createdAt: "2025-02-01",
  },
  // ── Home ───────────────────────────────────────────────────────────────────
  {
    id: "h1", slug: "glow-candle-set", name: "Glow Candle Set",
    categoryId: "home", priceCents: 39900, compareAtCents: null,
    tagline: "Three scents, one evening",
    description: "Hand-poured soy candles — amber, cedar, vanilla — 40-hour burn each, crackling wicks, reusable jars.",
    features: ["100% soy wax", "40-hour burn each", "Wooden wicks", "Reusable glass jars"],
    rating: 4.8, reviewCount: 232, stock: 120,
    gradient: "from-amber-300 to-orange-400", badge: "Best seller",
    color: "amber", createdAt: "2024-10-15",
  },
  {
    id: "h2", slug: "cloud-throw-blanket", name: "Cloud Throw Blanket",
    categoryId: "home", priceCents: 69900, compareAtCents: null,
    tagline: "Your couch's best friend",
    description: "Chunky-knit ultra-soft throw. Warm without weight, machine washable, ethically made.",
    features: ["Chunky knit", "Machine washable", "Ethically made", "130 × 170 cm"],
    rating: 4.7, reviewCount: 167, stock: 52,
    gradient: "from-teal-300 to-emerald-500", badge: null,
    color: "teal", createdAt: "2025-01-05",
  },
  {
    id: "h3", slug: "sana-diffuser", name: "Sana Aroma Diffuser",
    categoryId: "home", priceCents: 47900, compareAtCents: 59900,
    tagline: "Mist and calm, on a timer",
    description: "Ultrasonic diffuser with soft amber glow, 6-hour runtime, whisper-quiet.",
    features: ["Ultrasonic mist", "6-hour runtime", "Auto shut-off", "Soft glow mode"],
    rating: 4.4, reviewCount: 87, stock: 74,
    gradient: "from-emerald-300 to-teal-500", badge: null,
    color: "emerald", createdAt: "2025-04-20",
  },
  // ── Travel ─────────────────────────────────────────────────────────────────
  {
    id: "t1", slug: "voyage-backpack", name: "Voyage 24L Backpack",
    categoryId: "travel", priceCents: 219900, compareAtCents: null,
    tagline: "City to trail, one bag",
    description: "Weatherproof 24L pack with padded 16\" laptop sleeve, luggage pass-through, breathable back panel.",
    features: ["24L capacity", "16\" laptop sleeve", "Weatherproof shell", "Luggage pass-through"],
    rating: 4.8, reviewCount: 298, stock: 36,
    gradient: "from-fuchsia-500 to-pink-600", badge: "Best seller",
    color: "fuchsia", createdAt: "2024-12-01",
  },
  {
    id: "t2", slug: "drift-duffel", name: "Drift Weekender Duffle",
    categoryId: "travel", priceCents: 179900, compareAtCents: 209900,
    tagline: "Three days, one duffle",
    description: "Structured duffle with shoe compartment, quick-access pockets, detachable strap.",
    features: ["Shoe compartment", "Wipe-clean lining", "40L capacity", "Detachable strap"],
    rating: 4.6, reviewCount: 143, stock: 29,
    gradient: "from-pink-400 to-rose-500", badge: null,
    color: "pink", createdAt: "2025-03-01",
  },
  {
    id: "t3", slug: "nomad-utility-tote", name: "Nomad Utility Tote",
    categoryId: "travel", priceCents: 59900, compareAtCents: null,
    tagline: "Everything, everywhere",
    description: "Sturdy canvas tote with internal organizers, laptop sleeve, reinforced straps.",
    features: ["Reinforced canvas", "Internal organizers", "Laptop sleeve", "Machine washable"],
    rating: 4.3, reviewCount: 95, stock: 66,
    gradient: "from-violet-400 to-fuchsia-500", badge: null,
    color: "violet", createdAt: "2025-05-10",
  },
  // ── Wellness ───────────────────────────────────────────────────────────────
  {
    id: "w1", slug: "zen-yoga-mat", name: "Zen Yoga Mat",
    categoryId: "wellness", priceCents: 89900, compareAtCents: null,
    tagline: "Grip that stays put",
    description: "6 mm natural rubber, closed-cell surface grips when you sweat. Carry strap, alignment lines.",
    features: ["6mm natural rubber", "Anti-slip grip", "Alignment lines", "Carry strap"],
    rating: 4.7, reviewCount: 201, stock: 48,
    gradient: "from-lime-400 to-green-500", badge: null,
    color: "lime", createdAt: "2025-01-10",
  },
  {
    id: "w2", slug: "aera-pillow", name: "Aera Cooling Pillow",
    categoryId: "wellness", priceCents: 119900, compareAtCents: null,
    tagline: "Sleep cool, wake fresh",
    description: "Breathable cooling pillow, adjustable loft, washable cover, premium memory foam.",
    features: ["Cooling gel layer", "Adjustable loft", "Washable cover", "Hypoallergenic"],
    rating: 4.6, reviewCount: 173, stock: 31,
    gradient: "from-emerald-400 to-green-600", badge: "New",
    color: "emerald", createdAt: "2025-06-20",
  },
  {
    id: "w3", slug: "sol-wake-light", name: "Sol Wake-Up Light",
    categoryId: "wellness", priceCents: 99900, compareAtCents: null,
    tagline: "Rise with the sun, inside",
    description: "Sunrise alarm that gradually brightens over 30 min. Sunset wind-down mode, FM + aux.",
    features: ["30-min sunrise", "Sunset wind-down", "Natural wake sounds", "FM + aux"],
    rating: 4.5, reviewCount: 118, stock: 22,
    gradient: "from-amber-300 to-lime-400", badge: null,
    color: "amber", createdAt: "2025-02-28",
  },
];

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
export function productsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}
export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
