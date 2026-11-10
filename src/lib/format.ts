/** Formatação de dinheiro. Todos os preços são guardados em centavos. */

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return formatter.format(cents / 100);
}

/** Percentual de desconto, arredondado para baixo para nunca exagerar. */
export function discountPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.floor(((compareAtPrice - price) / compareAtPrice) * 100);
}
