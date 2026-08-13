/** huashu-design color factory — each color gets a duotone tile + soft/adjust helpers */

interface ColorPair {
  gradient: string;      // legacy — kept for the admin form field, unused in UI
  tile: string;          // duotone tile background (muted, paper-leaning)
  tileInk: string;       // duotone tile initial/text
  soft: string;          // background tint
  text: string;          // badge text
  badge: string;         // badge bg
  ink: string;           // dark variant — price, active tab
  ring: string;          // focus ring
  hover: string;         // hover bg tint
  subtle: string;        // very faint body tint
}

export const COLORS: Record<string, ColorPair> = {
  indigo: {
    gradient: "from-indigo-500 to-violet-600",
    tile: "bg-[#efeaf8]",
    tileInk: "text-[#463c85]",
    soft: "bg-indigo-50",
    text: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
    ink: "text-indigo-900",
    ring: "focus:ring-indigo-200",
    hover: "hover:bg-indigo-50",
    subtle: "bg-indigo-50/60",
  },
  violet: {
    gradient: "from-violet-500 to-purple-600",
    tile: "bg-[#f4ecf6]",
    tileInk: "text-[#6b3e77]",
    soft: "bg-violet-50",
    text: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
    ink: "text-violet-900",
    ring: "focus:ring-violet-200",
    hover: "hover:bg-violet-50",
    subtle: "bg-violet-50/60",
  },
  blue: {
    gradient: "from-blue-500 to-cyan-600",
    tile: "bg-[#e9eef8]",
    tileInk: "text-[#3e558c]",
    soft: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    ink: "text-blue-900",
    ring: "focus:ring-blue-200",
    hover: "hover:bg-blue-50",
    subtle: "bg-blue-50/60",
  },
  sky: {
    gradient: "from-sky-400 to-blue-600",
    tile: "bg-[#e6f1f7]",
    tileInk: "text-[#2e6a8a]",
    soft: "bg-sky-50",
    text: "text-sky-600",
    badge: "bg-sky-100 text-sky-700",
    ink: "text-sky-900",
    ring: "focus:ring-sky-200",
    hover: "hover:bg-sky-50",
    subtle: "bg-sky-50/60",
  },
  cyan: {
    gradient: "from-cyan-400 to-teal-600",
    tile: "bg-[#e3f2f1]",
    tileInk: "text-[#236d76]",
    soft: "bg-cyan-50",
    text: "text-cyan-600",
    badge: "bg-cyan-100 text-cyan-700",
    ink: "text-cyan-900",
    ring: "focus:ring-cyan-200",
    hover: "hover:bg-cyan-50",
    subtle: "bg-cyan-50/60",
  },
  emerald: {
    gradient: "from-emerald-400 to-green-600",
    tile: "bg-[#e7f1e9]",
    tileInk: "text-[#2f6b46]",
    soft: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    ink: "text-emerald-900",
    ring: "focus:ring-emerald-200",
    hover: "hover:bg-emerald-50",
    subtle: "bg-emerald-50/60",
  },
  amber: {
    gradient: "from-amber-400 to-orange-500",
    tile: "bg-[#f6eedd]",
    tileInk: "text-[#8a6222]",
    soft: "bg-amber-50",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    ink: "text-amber-900",
    ring: "focus:ring-amber-200",
    hover: "hover:bg-amber-50",
    subtle: "bg-amber-50/60",
  },
  rose: {
    gradient: "from-rose-400 to-red-500",
    tile: "bg-[#f8e9ea]",
    tileInk: "text-[#91323f]",
    soft: "bg-rose-50",
    text: "text-rose-600",
    badge: "bg-rose-100 text-rose-700",
    ink: "text-rose-900",
    ring: "focus:ring-rose-200",
    hover: "hover:bg-rose-50",
    subtle: "bg-rose-50/60",
  },
  pink: {
    gradient: "from-pink-400 to-rose-600",
    tile: "bg-[#f9eaf0]",
    tileInk: "text-[#993d5b]",
    soft: "bg-pink-50",
    text: "text-pink-600",
    badge: "bg-pink-100 text-pink-700",
    ink: "text-pink-900",
    ring: "focus:ring-pink-200",
    hover: "hover:bg-pink-50",
    subtle: "bg-pink-50/60",
  },
  fuchsia: {
    gradient: "from-fuchsia-500 to-pink-600",
    tile: "bg-[#f6e9f3]",
    tileInk: "text-[#7e3976]",
    soft: "bg-fuchsia-50",
    text: "text-fuchsia-600",
    badge: "bg-fuchsia-100 text-fuchsia-700",
    ink: "text-fuchsia-900",
    ring: "focus:ring-fuchsia-200",
    hover: "hover:bg-fuchsia-50",
    subtle: "bg-fuchsia-50/60",
  },
  lime: {
    gradient: "from-lime-400 to-green-500",
    tile: "bg-[#eef1e1]",
    tileInk: "text-[#4e6b2a]",
    soft: "bg-lime-50",
    text: "text-lime-600",
    badge: "bg-lime-100 text-lime-700",
    ink: "text-lime-900",
    ring: "focus:ring-lime-200",
    hover: "hover:bg-lime-50",
    subtle: "bg-lime-50/60",
  },
  teal: {
    gradient: "from-teal-400 to-emerald-600",
    tile: "bg-[#e3f0ed]",
    tileInk: "text-[#23604f]",
    soft: "bg-teal-50",
    text: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
    ink: "text-teal-900",
    ring: "focus:ring-teal-200",
    hover: "hover:bg-teal-50",
    subtle: "bg-teal-50/60",
  },
  slate: {
    gradient: "from-slate-500 to-blue-700",
    tile: "bg-[#eceeef]",
    tileInk: "text-[#3f4753]",
    soft: "bg-slate-50",
    text: "text-slate-600",
    badge: "bg-slate-100 text-slate-700",
    ink: "text-slate-900",
    ring: "focus:ring-slate-200",
    hover: "hover:bg-slate-50",
    subtle: "bg-slate-50/60",
  },
};

export const VALID_COLORS = Object.keys(COLORS);

export function colorOf(palette: keyof typeof COLORS): ColorPair {
  return COLORS[palette] ?? COLORS.indigo;
}

export function gradientClass(colors: ColorPair) {
  return colors.gradient;
}
export function tileClass(colors: ColorPair) {
  return colors.tile;
}
export function tileInkClass(colors: ColorPair) {
  return colors.tileInk;
}
export function softClass(colors: ColorPair) {
  return colors.soft;
}
export function textClass(colors: ColorPair) {
  return colors.text;
}
export function inkClass(colors: ColorPair) {
  return colors.ink;
}
export function badgeClass(colors: ColorPair) {
  return colors.badge;
}
export function subtleClass(colors: ColorPair) {
  return colors.subtle;
}
export function hoverClass(colors: ColorPair) {
  return colors.hover;
}
