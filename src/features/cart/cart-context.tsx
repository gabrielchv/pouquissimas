"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { getProductById } from "@/lib/catalog";
import type { CartLineWithProduct, Product } from "@/lib/types";
import {
  addToCart,
  clearCart,
  getCartServerSnapshot,
  getCartSnapshot,
  removeCartLine,
  setCartQuantity,
  subscribeToCart,
} from "./cart-store";

interface CartContextValue {
  lines: CartLineWithProduct[];
  itemCount: number;
  subtotal: number;
  /** False until the persisted cart has been read on the client. */
  isReady: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { lines: rawLines, isReady } = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot,
  );

  // Drawer visibility is UI state: it does not belong in the persisted cart.
  const [isOpen, setIsOpen] = useState(false);

  const lines = useMemo<CartLineWithProduct[]>(() => {
    return rawLines.flatMap((line) => {
      const product = getProductById(line.productId);
      if (!product) return [];
      return [{ ...line, product, lineTotal: product.price * line.quantity }];
    });
  }, [rawLines]);

  const itemCount = useMemo(
    () => lines.reduce((total, line) => total + line.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((total, line) => total + line.lineTotal, 0),
    [lines],
  );

  const addItem = useCallback((product: Product, size: string, quantity = 1) => {
    addToCart(product.id, size, quantity);
    setIsOpen(true);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      subtotal,
      isReady,
      isOpen,
      openCart,
      closeCart,
      addItem,
      setQuantity: setCartQuantity,
      removeLine: removeCartLine,
      clearCart,
    }),
    [lines, itemCount, subtotal, isReady, isOpen, openCart, closeCart, addItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }

  return context;
}
