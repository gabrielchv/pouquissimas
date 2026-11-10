/** Money helpers. All prices are stored in cents. */

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return formatter.format(cents / 100);
}

/** Percentage saved, rounded down so we never overstate a discount. */
export function discountPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.floor(((compareAtPrice - price) / compareAtPrice) * 100);
}
