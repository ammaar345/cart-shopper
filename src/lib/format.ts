/** Format integer cents (ZAR) as "R 1,249.00". */
export function formatZar(cents: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** Percent off between two cents values, rounded to nearest whole. */
export function percentOff(priceCents: number, compareAtCents: number): number {
  if (compareAtCents <= priceCents) return 0;
  return Math.round(((compareAtCents - priceCents) / compareAtCents) * 100);
}
