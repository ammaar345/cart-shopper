"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { SearchIcon, ChevronDownIcon, XIcon } from "@/components/Icons";
import { cn } from "@/lib/cn";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
  { key: "newest", label: "Newest" },
];

interface Props {
  initialCategory: string | null;
  initialQuery: string;
  initialSort: string;
  initialMin: string;
  initialMax: string;
}

export function ShopGrid({
  initialCategory,
  initialQuery,
  initialSort,
  initialMin,
  initialMax,
}: Props) {
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>(initialSort as SortKey);
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (category) list = list.filter((p) => p.categoryId === category);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    const minC = parseFloat(min) * 100;
    const maxC = parseFloat(max) * 100;
    if (!Number.isNaN(minC)) list = list.filter((p) => p.priceCents >= minC);
    if (!Number.isNaN(maxC)) list = list.filter((p) => p.priceCents <= maxC);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-desc":
        list.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => (a.badge === "New" ? -1 : 0) - (b.badge === "New" ? -1 : 0));
        break;
    }
    return list;
  }, [category, query, sort, min, max]);

  const activeFilters = [
    category && CATEGORIES.find((c) => c.id === category)?.name,
    query.trim() ? `"${query.trim()}"` : null,
    min && `≥ R${min}`,
    max && `≤ R${max}`,
  ].filter(Boolean) as string[];

  const clearAll = () => {
    setCategory(null);
    setQuery("");
    setMin("");
    setMax("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="grid gap-7 rounded-card border border-border-soft bg-surface p-5">
          {/* Search */}
          <label className="block">
            <span className="eyebrow mb-2 block">Search</span>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-lg border border-border-soft bg-bg py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-primary focus:bg-surface"
              />
            </div>
          </label>

          {/* Category — editorial index */}
          <div>
            <span className="eyebrow mb-3 block">Category</span>
            <ul className="flex flex-col gap-0.5">
              <FilterRow
                active={category === null}
                onClick={() => setCategory(null)}
                label="All"
              />
              {CATEGORIES.map((c) => (
                <FilterRow
                  key={c.id}
                  active={category === c.id}
                  onClick={() => setCategory(category === c.id ? null : c.id)}
                  label={c.name}
                />
              ))}
            </ul>
          </div>

          {/* Price */}
          <div>
            <span className="eyebrow mb-2 block">Price (R)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="Min"
                aria-label="Minimum price"
                className="w-full rounded-lg border border-border-soft bg-bg px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-primary focus:bg-surface"
              />
              <span className="text-ink-soft">–</span>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="Max"
                aria-label="Maximum price"
                className="w-full rounded-lg border border-border-soft bg-bg px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-primary focus:bg-surface"
              />
            </div>
          </div>

          {activeFilters.length > 0 && (
            <button
              onClick={clearAll}
              className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-error"
            >
              <XIcon className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </aside>

      {/* Grid */}
      <div>
        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"}
          </p>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="btn btn-outline btn-sm"
              >
                {SORTS.find((s) => s.key === sort)?.label}
                <ChevronDownIcon className={cn("h-4 w-4 transition-transform", sortOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-lg border border-border-soft bg-surface py-1 shadow-lift"
                  >
                    {SORTS.map((s) => (
                      <li key={s.key}>
                        <button
                          onClick={() => {
                            setSort(s.key);
                            setSortOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 cursor-pointer px-4 py-2.5 text-left text-sm transition-colors hover:bg-cream",
                            sort === s.key ? "font-bold text-ink" : "text-ink-soft",
                          )}
                        >
                          {s.label}
                          {sort === s.key && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center justify-center gap-2 py-20 text-center">
            <p className="font-display text-xl font-bold text-ink">
              Nothing matches
            </p>
            <p className="max-w-xs text-sm text-ink-soft">
              Try a different search, category, or price range.
            </p>
          </div>
        ) : (
          <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.5), duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Category index row
function FilterRow({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "group flex w-full cursor-pointer items-center gap-2.5 rounded-md py-1.5 text-left transition-colors",
          active ? "font-bold text-ink" : "text-ink-soft hover:text-ink",
        )}
      >
        <span
          className={cn(
            "h-4 w-0.5 rounded-full bg-primary transition-transform",
            active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50",
          )}
        />
        <span className="text-sm">{label}</span>
      </button>
    </li>
  );
}