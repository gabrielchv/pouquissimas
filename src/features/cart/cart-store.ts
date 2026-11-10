"use client";

import type { CartLine } from "@/lib/types";
import { readStoredCart, writeStoredCart } from "./cart-storage";

/**
 * The cart lives outside React as a tiny external store.
 *
 * Why: the cart is persisted in localStorage, which only exists in the browser.
 * Reading it inside an effect forces an extra render pass and, worse, makes the
 * first paint disagree with the stored state. `useSyncExternalStore` gives the
 * server a stable empty snapshot and the client the real one, with no tearing.
 */

export const MAX_QUANTITY = 10;

export interface CartSnapshot {
  lines: CartLine[];
  /** False until the persisted cart has been read in the browser. */
  isReady: boolean;
}

type CartAction =
  | { type: "add"; productId: string; size: string; quantity: number }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

/* -------------------------------------------------------------------------- */
/* Pure state transitions                                                     */
/* -------------------------------------------------------------------------- */

function lineKey(productId: string, size: string): string {
  return `${productId}:${size}`;
}

function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.productId, action.size);
      const existing = state.find((line) => line.key === key);

      if (existing) {
        return state.map((line) =>
          line.key === key
            ? {
                ...line,
                quantity: Math.min(line.quantity + action.quantity, MAX_QUANTITY),
              }
            : line,
        );
      }

      return [
        ...state,
        {
          key,
          productId: action.productId,
          size: action.size,
          quantity: Math.min(action.quantity, MAX_QUANTITY),
        },
      ];
    }

    case "setQuantity": {
      if (action.quantity <= 0) {
        return state.filter((line) => line.key !== action.key);
      }

      return state.map((line) =>
        line.key === action.key
          ? { ...line, quantity: Math.min(action.quantity, MAX_QUANTITY) }
          : line,
      );
    }

    case "remove":
      return state.filter((line) => line.key !== action.key);

    case "clear":
      return [];

    default:
      return state;
  }
}

/* -------------------------------------------------------------------------- */
/* External store                                                             */
/* -------------------------------------------------------------------------- */

const SERVER_SNAPSHOT: CartSnapshot = { lines: [], isReady: false };

let snapshot: CartSnapshot = SERVER_SNAPSHOT;
let hasHydrated = false;
const listeners = new Set<() => void>();

function publish(lines: CartLine[]): void {
  snapshot = { lines, isReady: true };
  writeStoredCart(lines);

  for (const listener of listeners) {
    listener();
  }
}

function apply(action: CartAction): void {
  publish(cartReducer(snapshot.lines, action));
}

export function subscribeToCart(listener: () => void): () => void {
  listeners.add(listener);

  // Read localStorage once, on the first subscriber (always the browser).
  if (!hasHydrated) {
    hasHydrated = true;
    publish(readStoredCart());
  }

  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): CartSnapshot {
  return snapshot;
}

export function getCartServerSnapshot(): CartSnapshot {
  return SERVER_SNAPSHOT;
}

export function addToCart(productId: string, size: string, quantity = 1): void {
  apply({ type: "add", productId, size, quantity });
}

export function setCartQuantity(key: string, quantity: number): void {
  apply({ type: "setQuantity", key, quantity });
}

export function removeCartLine(key: string): void {
  apply({ type: "remove", key });
}

export function clearCart(): void {
  apply({ type: "clear" });
}
