"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import styles from "./cart-drawer.module.css";
import { CartLineRow } from "./CartLineRow";
import { buttonClassName } from "@/components/ui/button-classes";
import { BagIcon, CloseIcon } from "@/components/ui/Icons";
import { SITE } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-context";

/**
 * Slide-over cart. Mounted once in the root layout, opened from the header or
 * automatically after an item is added.
 */
export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    itemCount,
    subtotal,
    setQuantity,
    removeLine,
  } = useCart();

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
        return;
      }

      // Keep tab focus inside the drawer while it is open.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className={styles.root}>
      <div className={styles.overlay} onClick={closeCart} aria-hidden="true" />

      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className={styles.header}>
          <h2 id="cart-drawer-title" className={styles.title}>
            Sua sacola{itemCount > 0 && <span className={styles.count}> ({itemCount})</span>}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Fechar sacola"
          >
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <BagIcon className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Sua sacola está vazia.</p>
            <p className={styles.emptyBody}>
              Shapes, camisetas e parafusos estão a um clique.
            </p>
            <Link
              href="/loja"
              className={buttonClassName("primary")}
              onClick={closeCart}
            >
              Ver a coleção
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.lines}>
              {lines.map((line) => (
                <CartLineRow
                  key={line.key}
                  line={line}
                  variant="drawer"
                  onQuantityChange={setQuantity}
                  onRemove={removeLine}
                  onNavigate={closeCart}
                />
              ))}
            </ul>

            <footer className={styles.footer}>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <span className={styles.subtotal}>{formatPrice(subtotal)}</span>
              </div>
              <p className={styles.note}>
                {SITE.announcement}. Impostos calculados na finalização.
              </p>
              <Link
                href="/sacola"
                className={buttonClassName("primary", styles.checkout)}
                onClick={closeCart}
              >
                Ver sacola e finalizar
              </Link>
              <button type="button" className={styles.continue} onClick={closeCart}>
                Continuar comprando
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
