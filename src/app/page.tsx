import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRightIcon, ShieldIcon, SparkleIcon, TruckIcon } from "@/components/Icons";
import { colorOf, tileClass, tileInkClass } from "@/lib/colors";

const FEATURED = PRODUCTS.filter((p) => p.badge === "Best seller").slice(0, 4);

const PERKS = [
  { icon: TruckIcon, title: "Fast SA delivery", body: "Door-to-door courier across all provinces." },
  { icon: ShieldIcon, title: "Secure checkout", body: "PayFast payments, encrypted and safe." },
  { icon: SparkleIcon, title: "Quality you can feel", body: "Curated goods built to last." },
];

export default function Home() {
  return (
    <div className="grid gap-20">
      {/* Hero — warm paper, typographic, no stock photo */}
      <section className="relative -mx-4 overflow-hidden border-b border-border-soft">
        <div className="relative px-4 py-24 text-center sm:py-32">
          {/* faint warm glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-[120%] -translate-x-1/2 rounded-[100%] bg-primary/[0.06] blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl">
            <p className="eyebrow">New season · new favourites</p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-7xl">
              Things you&apos;ll love,
              <br />
              delivered{" "}
              <em className="text-primary">to your door.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Thoughtfully made everyday essentials — audio, home, desk, and
              more. Free shipping over R750.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop the new season
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link href="/shop?category=audio" className="btn btn-outline btn-lg">
                Browse audio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="grid gap-4 sm:grid-cols-3">
        {PERKS.map((p) => (
          <div
            key={p.title}
            className="card flex items-start gap-4 p-5 transition-shadow hover:shadow-soft"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border-soft bg-cream text-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">{p.title}</h3>
              <p className="mt-0.5 text-sm text-ink-soft">{p.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories — duotone tiles */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink">
              Find your thing
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline sm:flex"
          >
            View all
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => {
            const duo = colorOf(c.color ?? "indigo");
            return (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className={`group relative flex h-36 flex-col justify-end overflow-hidden rounded-card border border-border-soft p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft ${tileClass(duo)}`}
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -right-3 -top-5 font-display text-8xl font-black leading-none ${tileInkClass(duo)} opacity-15 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg]`}
                >
                  {c.name.charAt(0)}
                </span>
                <span className={`relative font-display text-lg font-bold ${tileInkClass(duo)}`}>
                  {c.name}
                </span>
                <span className="relative mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
                  {c.tagline}
                  <ArrowRightIcon className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Customer favourites</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink">
              Best sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline sm:flex"
          >
            Shop all
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
