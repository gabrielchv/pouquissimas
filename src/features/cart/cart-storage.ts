import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "skate-shop.cart.v1";

interface PersistedCart {
  version: 1;
  lines: CartLine[];
}

/**
 * Storage is deliberately defensive: a corrupt or outdated payload must never
 * break the storefront, so anything unexpected resolves to an empty cart.
 */
export function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Partial<PersistedCart>;
    if (parsed.version !== 1 || !Array.isArray(parsed.lines)) return [];

    return parsed.lines.filter(isCartLine);
  } catch {
    return [];
  }
}

export function writeStoredCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;

  try {
    const payload: PersistedCart = { version: 1, lines };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private mode or a full quota: the cart still works for this session.
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;

  return (
    typeof line.key === "string" &&
    typeof line.productId === "string" &&
    typeof line.size === "string" &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}
