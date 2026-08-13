"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, cartCount } from "@/lib/store";
import { CartIcon, SearchIcon } from "./Icons";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  const items = useCartStore((s) => s.items);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const count = cartCount(items);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="sticky top-0 z-40 border-b border-border-soft bg-bg/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo — serif wordmark, stamped mark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
        >
          <motion.span
            whileHover={{ rotate: -8 }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/20 bg-surface shadow-soft transition-colors group-hover:border-primary"
          >
            <CartIcon className="h-5 w-5 text-ink" strokeWidth={2} />
          </motion.span>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Cart<span className="italic text-primary">Shopper</span>
          </span>
        </Link>

        {/* Nav — editorial underline links */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "nav-link text-sm font-semibold text-ink-soft hover:text-ink",
                isActive(l.href) && "nav-link-active",
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="h-5 w-px bg-border-soft" />
          <Link href="/shop" className="btn btn-primary btn-sm">
            <SearchIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Browse</span>
          </Link>
        </nav>

        {/* Cart button */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={openDrawer}
            aria-label="Open cart"
            whileTap={{ scale: 0.92 }}
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-ink/20 bg-surface text-ink shadow-soft transition-colors hover:border-ink hover:bg-cream"
          >
            <CartIcon className="h-5 w-5" strokeWidth={2} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 16 }}
                  className="absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-white shadow-md"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
