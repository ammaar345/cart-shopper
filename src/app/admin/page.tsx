"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/catalog";
import type { Product, Category, ColorKey } from "@/types";
import { productsApi, categoriesApi } from "@/lib/storage";
import { VALID_COLORS, colorOf, tileClass, tileInkClass } from "@/lib/colors";
import { productImageUrl } from "@/lib/images";
import {
  PlusIcon,
  TrashIcon2 as TrashIcon,
  ChevronRightIcon,
  XIcon,
  SparkleIcon,
} from "@/components/Icons";
import { cn } from "@/lib/cn";

// ── local helpers ──────────────────────────────────────────────────────────────

const LOW_STOCK_THRESHOLD = 5;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  slug: "",
  name: "",
  categoryId: CATEGORIES[0]?.id ?? "",
  priceCents: 0,
  compareAtCents: null,
  tagline: "",
  description: "",
  features: [],
  rating: 4.5,
  reviewCount: 0,
  stock: 10,
  gradient: "from-indigo-500 to-violet-600",
  badge: null,
  color: "indigo" as ColorKey,
  imageUrl: null,
  createdAt: new Date().toISOString(),
};

const EMPTY_CAT = {
  slug: "",
  name: "",
  tagline: "",
  gradient: "from-indigo-500 to-violet-600",
  color: "indigo" as ColorKey,
} as Category & { id?: string };

type Tab = "products" | "categories";
type ProductForm = Omit<Product, "id"> & { id?: string };

// ── main component ─────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<(Category & { id?: string }) | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    setProducts(productsApi.list());
    setCategories(categoriesApi.list());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const lowStock = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);

  // ── product CRUD ────────────────────────────────────────────────────────────

  const openNew = () => {
    setEditing({ ...EMPTY_PRODUCT });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing({
      id: p.id,
      slug: p.slug,
      name: p.name,
      categoryId: p.categoryId,
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents,
      tagline: p.tagline,
      description: p.description,
      features: p.features,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      gradient: p.gradient,
      badge: p.badge,
      color: p.color,
      imageUrl: p.imageUrl ?? null,
      createdAt: p.createdAt ?? new Date().toISOString(),
    });
    setShowForm(true);
  };

  const saveProduct = () => {
    if (!editing) return;
    const errors: string[] = [];

    if (!editing.name.trim()) errors.push("Product name is required");
    if (!editing.slug.trim()) errors.push("Slug is required");
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(editing.slug))
      errors.push("Slug can only contain lowercase letters, numbers, and hyphens");

    if (editing.priceCents < 0) errors.push("Price cannot be negative");
    if (editing.stock < 0) errors.push("Stock cannot be negative");
    if (editing.rating < 0 || editing.rating > 5) errors.push("Rating must be between 0 and 5");
    if (editing.reviewCount < 0) errors.push("Review count cannot be negative");

    if (errors.length) {
      toast.error(errors.join(" • "));
      return;
    }

    if (editing.id) {
      productsApi.update(editing.id, editing);
    } else {
      productsApi.add({ ...editing, id: uid() });
    }
    setEditing(null);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    load();
  };

  const deleteProduct = (id: string) => {
    toast.error("Delete this product? This cannot be undone.", {
      action: {
        label: "Delete",
        onClick: () => {
          productsApi.remove(id);
          setSaved(true);
          setTimeout(() => setSaved(false), 1800);
          load();
        },
      },
      onDismiss: () => {
        // Cancel action - do nothing
      },
    });
  };

  // ── category CRUD ───────────────────────────────────────────────────────────

  const openNewCat = () => {
    setEditingCat({ ...EMPTY_CAT });
    setShowCatForm(true);
  };

  const openEditCat = (c: Category) => {
    setEditingCat({ ...c });
    setShowCatForm(true);
  };

  const saveCategory = () => {
    if (!editingCat) return;
    if (!editingCat.name.trim() || !editingCat.slug.trim()) {
      toast.error("Name and slug required.");
      return;
    }
    if (editingCat.id) {
      categoriesApi.update(editingCat.id, editingCat);
    } else {
      categoriesApi.add({ ...editingCat, id: uid() });
    }
    setEditingCat(null);
    setShowCatForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    load();
  };

  const deleteCategory = (id: string) => {
    const inUse = products.some((p) => p.categoryId === id);
    if (inUse) {
      toast.error("This category still has products assigned.");
      return;
    }
    toast.error("Delete this category?", {
      action: {
        label: "Delete",
        onClick: () => {
          categoriesApi.remove(id);
          setSaved(true);
          setTimeout(() => setSaved(false), 1800);
          load();
        },
      },
      onDismiss: () => {
        // Cancel action - do nothing
      },
    });
  };

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="grid gap-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Store Admin
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage products and categories. Changes persist to localStorage.
          </p>
        </div>
        <AnimatePresence>
          {saved && (
            <motion.span
              key="saved"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 rounded-md border border-success/30 bg-success-soft px-4 py-2 text-sm font-semibold text-success"
            >
              <SparkleIcon className="h-4 w-4" />
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Low-stock alert */}
      {lowStock.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-error/30 bg-error-soft px-4 py-3 text-sm">
          <span className="font-bold uppercase tracking-wide text-error">
            Low stock ({lowStock.length})
          </span>
          <span className="text-ink">
            {lowStock.map((p) => `${p.name} (${p.stock})`).join(" · ")}
          </span>
        </div>
      )}

      {/* Tabs — editorial underline strip */}
      <div className="tab-strip">
        {(["products", "categories"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("tab", tab === t && "tab-active")}
          >
            {t === "products" ? "Products" : "Categories"}
            <span className="ml-1.5 text-xs font-semibold text-ink-soft">
              {t === "products" ? products.length : categories.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Products panel ─────────────────────────────────────────────────── */}
      {tab === "products" && (
        <div className="grid gap-4">
          <button onClick={openNew} className="btn btn-primary w-fit">
            <PlusIcon className="h-4 w-4" />
            Add product
          </button>

          <div className="grid gap-3">
            {products.map((p) => {
              const cat = categories.find((c) => c.id === p.categoryId);
              const cKey = VALID_COLORS.includes(p.color ?? "indigo")
                ? p.color
                : "indigo";
              return (
                <div
                  key={p.id}
                  className="group flex items-center gap-4 rounded-2xl border border-border-soft bg-surface p-4 transition-shadow hover:shadow-soft"
                >
                  {/* Image swatch — custom photo, else duotone letter tile */}
                  {p.imageUrl ? (
                    <img
                      src={productImageUrl(p)}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-lg border border-border-soft object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border-soft text-xl font-bold",
                        tileClass(colorOf(cKey)),
                        tileInkClass(colorOf(cKey)),
                      )}
                    >
                      {p.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-ink truncate">
                      {p.name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                      <span className="rounded-md bg-cream px-2 py-0.5 font-semibold text-ink-soft">
                        {cat?.name ?? "—"}
                      </span>
                      <span className="font-semibold text-ink">
                        R{(p.priceCents / 100).toFixed(2)}
                      </span>
                      <span
                        className={cn(
                          p.stock <= LOW_STOCK_THRESHOLD
                            ? "font-bold text-error"
                            : "text-ink-soft/70",
                        )}
                      >
                        stock: {p.stock}
                        {p.stock <= LOW_STOCK_THRESHOLD && " — low"}
                      </span>
                      {p.badge && (
                        <span className="stamp stamp-soft">{p.badge}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                      aria-label="Edit"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-error-soft hover:text-error"
                      aria-label="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            {products.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border-soft py-16 text-center">
                <PlusIcon className="h-10 w-10 text-ink-soft/30" />
                <p className="font-display text-lg font-semibold text-ink-soft">
                  No products yet
                </p>
                <p className="text-sm text-ink-soft/70">
                  Tap "Add product" to build your catalog.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Categories panel ───────────────────────────────────────────────── */}
      {tab === "categories" && (
        <div className="grid gap-4">
          <button onClick={openNewCat} className="btn btn-primary w-fit">
            <PlusIcon className="h-4 w-4" />
            Add category
          </button>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="relative flex flex-col gap-3 rounded-2xl border border-border-soft bg-surface p-5 transition-shadow hover:shadow-soft"
              >
                <div
                  className={cn(
                    "flex h-16 items-center justify-center rounded-lg border border-border-soft text-2xl font-bold",
                    tileClass(colorOf(c.color ?? "indigo")),
                    tileInkClass(colorOf(c.color ?? "indigo")),
                  )}
                >
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-bold text-ink">
                    {c.name}
                  </p>
                  <p className="text-sm text-ink-soft">{c.tagline}</p>
                  <p className="mt-1 text-xs font-mono text-ink-soft/70">
                    /{c.slug}
                  </p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openEditCat(c)}
                    className="btn btn-outline btn-sm flex-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="btn btn-outline btn-sm flex-1 hover:border-error hover:text-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border-soft py-16 text-center">
                <PlusIcon className="h-10 w-10 text-ink-soft/30" />
                <p className="font-display text-lg font-semibold text-ink-soft">
                  No categories yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Product drawer panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && editing && (
          <ProductFormDrawer
            form={editing}
            onChange={setEditing}
            onSave={saveProduct}
            onClose={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Category drawer panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showCatForm && editingCat && (
          <CategoryFormDrawer
            form={editingCat}
            onChange={setEditingCat}
            onSave={saveCategory}
            onClose={() => {
              setShowCatForm(false);
              setEditingCat(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Product form drawer ───────────────────────────────────────────────────────

function ProductFormDrawer({
  form,
  onChange,
  onSave,
  onClose,
}: {
  form: ProductForm;
  onChange: (f: ProductForm) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const update = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K],
  ) => onChange({ ...form, [key]: value });

  const toggleFeature = (f: string) => {
    const next = form.features.includes(f)
      ? form.features.filter((x) => x !== f)
      : [...form.features, f];
    update("features", next);
  };

  const FEATURE_PRESETS = [
    "Bluetooth 5.3",
    "USB-C",
    "Wireless charging",
    "IPX6 water resistant",
    "1-year warranty",
    "Eco-friendly materials",
    "Made in SA",
    "Fast shipping",
  ];

  return (
    <motion.div
      key="product-drawer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
      >
        {/* Drawer handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-border-soft" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
          <h2 className="font-display text-lg font-bold text-ink">
            {form.id ? "Edit product" : "New product"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-5">
            {/* Name + slug */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name *">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                  placeholder="e.g. Orbis Headphones"
                />
              </Field>
              <Field label="Slug *">
                <input
                  value={form.slug}
                  onChange={(e) =>
                    update(
                      "slug",
                      e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                  onBlur={() => {
                    // Auto-derive slug from name if empty
                    if (!form.slug.trim() && form.name.trim()) {
                      update(
                        "slug",
                        form.name
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, ""),
                      );
                    }
                  }}
                  className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm font-mono outline-none transition-colors focus:border-primary focus:bg-white"
                  placeholder="orbis-headphones"
                />
              </Field>
            </div>

            {/* Category + color */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select
                  value={form.categoryId}
                  onChange={(e) => update("categoryId", e.target.value)}
                  className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Color palette">
                <select
                  value={form.color}
                  onChange={(e) =>
                    update("color", e.target.value as ColorKey)
                  }
                  className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                >
                  {VALID_COLORS.map((k) => (
                    <option key={k} value={k}>
                      {k[0].toUpperCase() + k.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Prices */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price (ZAR)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft">
                    R
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={(form.priceCents / 100).toFixed(2)}
                    onChange={(e) =>
                      update("priceCents", Math.round(parseFloat(e.target.value) * 100))
                    }
                    className="w-full rounded-2xl border border-border-soft bg-cream/50 py-2.5 pl-7 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                  />
                </div>
              </Field>
              <Field label="Compare at price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-ink-soft">
                    R
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={
                      form.compareAtCents !== null
                        ? (form.compareAtCents / 100).toFixed(2)
                        : ""
                    }
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      update(
                        "compareAtCents",
                        v === "" ? null : Math.round(parseFloat(v) * 100),
                      );
                    }}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-border-soft bg-cream/50 py-2.5 pl-7 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                  />
                </div>
              </Field>
              <Field label="Stock">
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    update("stock", Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                />
              </Field>
            </div>

            {/* Tagline */}
            <Field label="Tagline">
              <input
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                placeholder="Short hook shown on cards"
              />
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
              />
            </Field>

            {/* Badge */}
            <Field label="Badge label">
              <input
                value={form.badge ?? ""}
                onChange={(e) => update("badge", e.target.value || null)}
                className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                placeholder="e.g. Best seller, New (leave empty for none)"
              />
            </Field>

            {/* Image URL */}
            <Field label="Image URL (optional)">
              <input
                value={form.imageUrl ?? ""}
                onChange={(e) => update("imageUrl", e.target.value.trim() || null)}
                className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm font-mono outline-none transition-colors focus:border-primary focus:bg-white"
                placeholder="https://… (empty = auto stock photo for this slug)"
              />
              {form.imageUrl && (
                <span className="mt-2 block h-20 w-20 overflow-hidden rounded-xl border border-border-soft">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </span>
              )}
            </Field>

            {/* Gradient alt */}
            <Field label="Gradient classes">
              <input
                value={form.gradient}
                onChange={(e) => update("gradient", e.target.value)}
                className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-xs font-mono outline-none transition-colors focus:border-primary focus:bg-white"
                placeholder="from-blue-500 to-cyan-600"
              />
            </Field>

            {/* Features */}
            <Field label="Features">
              <div className="flex flex-wrap gap-2">
                {FEATURE_PRESETS.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFeature(f)}
                    className={cn(
                      "cursor-pointer rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                      form.features.includes(f)
                        ? "border-primary bg-primary text-white"
                        : "border-border-soft bg-surface text-ink-soft hover:border-ink/30 hover:text-ink",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {form.features.filter(
                (f) => !FEATURE_PRESETS.includes(f),
              ).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.features
                    .filter((f) => !FEATURE_PRESETS.includes(f))
                    .map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border-soft bg-cream px-2.5 py-1 text-xs font-semibold text-ink"
                      >
                        {f}
                        <button
                          onClick={() => toggleFeature(f)}
                          className="cursor-pointer rounded-sm p-0.5 text-ink-soft/60 transition-colors hover:bg-error-soft hover:text-error"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </Field>

            {/* Rating + reviewCount */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rating (1-5)">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) =>
                    update(
                      "rating",
                      Math.min(5, Math.max(1, parseFloat(e.target.value) || 4.5)),
                    )
                  }
                  className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                />
              </Field>
              <Field label="Review count">
                <input
                  type="number"
                  value={form.reviewCount}
                  onChange={(e) =>
                    update(
                      "reviewCount",
                      Math.max(0, parseInt(e.target.value) || 0),
                    )
                  }
                  className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-border-soft px-6 py-4">
          {form.id && (
            <span className="text-xs font-mono text-ink-soft/60">
              id: {form.id.slice(0, 8)}
            </span>
          )}
          <div className="ml-auto flex gap-3">
            <button onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button onClick={onSave} className="btn btn-primary btn-sm">
              {form.id ? "Save changes" : "Add product"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Category form drawer ──────────────────────────────────────────────────────

function CategoryFormDrawer({
  form,
  onChange,
  onSave,
  onClose,
}: {
  form: Category & { id?: string };
  onChange: (f: Category & { id?: string }) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const update = <K extends keyof (Category & { id?: string })>(
    key: K,
    value: (Category & { id?: string })[K],
  ) => onChange({ ...form, [key]: value });

  return (
    <motion.div
      key="cat-drawer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-border-soft" />
        </div>
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
          <h2 className="font-display text-lg font-bold text-ink">
            {form.id ? "Edit category" : "New category"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 px-6 py-5">
          <Field label="Category name *">
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
              placeholder="e.g. Audio"
            />
          </Field>
          <Field label="Slug *">
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm font-mono outline-none transition-colors focus:border-primary focus:bg-white"
              placeholder="audio"
            />
          </Field>
          <Field label="Tagline">
            <input
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
            />
          </Field>
          <Field label="Gradient classes">
            <input
              value={form.gradient}
              onChange={(e) => update("gradient", e.target.value)}
              className="w-full rounded-2xl border border-border-soft bg-cream/50 px-4 py-2.5 text-xs font-mono outline-none transition-colors focus:border-primary focus:bg-white"
            />
          </Field>
          {/* Preview swatch */}
          <div
            className={cn(
              "h-20 rounded-2xl bg-gradient-to-br",
              form.gradient,
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border-soft px-6 py-4">
          <button onClick={onClose} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button onClick={onSave} className="btn btn-primary btn-sm">
            {form.id ? "Save changes" : "Add category"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── shared form field ─────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}





