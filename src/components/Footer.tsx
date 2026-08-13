import Link from "next/link";
import { CartIcon } from "./Icons";

const LINKS = {
  Shop: [
    { href: "/shop", label: "All products" },
    { href: "/shop?category=audio", label: "Audio" },
    { href: "/shop?category=desk", label: "Desk" },
    { href: "/shop?category=home", label: "Home" },
  ],
  Company: [
    { href: "/", label: "Home" },
    { href: "/cart", label: "Cart" },
    { href: "/shop", label: "Browse" },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border-soft bg-cream/60">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/20 bg-surface text-ink">
              <CartIcon className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-display text-lg font-bold text-ink">
              Cart<span className="italic text-primary">Shopper</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            A premium online store for everyday essentials. Thoughtfully made,
            fairly priced, delivered across South Africa.
          </p>
        </div>

        {Object.entries(LINKS).map(([title, links]) => (
          <div key={title}>
            <h3 className="eyebrow">{title}</h3>
            <ul className="mt-4 grid gap-2.5">
              {links.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-soft transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="eyebrow">PayFast secure checkout</h3>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Secure payments in South African Rand. Card, Instant EFT and more.
          </p>
        </div>
      </div>
      <div className="relative border-t border-border-soft">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-ink-soft">
          © {new Date().getFullYear()} Cart Shopper. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
