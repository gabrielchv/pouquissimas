"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./cart-view.module.css";
import { CartLineRow } from "./CartLineRow";
import { useCart } from "./cart-context";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonClassName } from "@/components/ui/button-classes";
import { BagIcon } from "@/components/ui/Icons";
import { SHIPPING_NOTE } from "@/config/site";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_THRESHOLD = 15000;

export function CartView() {
  const { lines, subtotal, itemCount, isReady, setQuantity, removeLine, clearCart } =
    useCart();
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="container">
      <PageHeader
        eyebrow="Checkout"
        title="Your bag"
        description={
          itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? "item" : "items"} ready to go.`
            : "Nothing in the bag yet."
        }
      />

      {!isReady ? (
        <p className={styles.loading}>Loading your bag…</p>
      ) : lines.length === 0 ? (
        <div className={styles.empty}>
          <BagIcon className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Your bag is empty</p>
          <p className={styles.emptyBody}>
            Start with a deck, then build the fit around it.
          </p>
          <Link href="/shop" className={buttonClassName("primary")}>
            Shop the drop
          </Link>
        </div>
      ) : (
        <div className={styles.layout}>
          <section aria-label="Items in your bag" className={styles.items}>
            <ul>
              {lines.map((line) => (
                <CartLineRow
                  key={line.key}
                  line={line}
                  variant="page"
                  onQuantityChange={setQuantity}
                  onRemove={removeLine}
                />
              ))}
            </ul>

            <div className={styles.itemsFooter}>
              <Link href="/shop" className={styles.continueLink}>
                ← Continue shopping
              </Link>
              <button type="button" className={styles.clearButton} onClick={clearCart}>
                Empty bag
              </button>
            </div>
          </section>

          <aside className={styles.summary} aria-label="Order summary">
            <h2 className={styles.summaryTitle}>Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>
                {qualifiesForFreeShipping ? "Free" : "Calculated at checkout"}
              </span>
            </div>

            <p className={styles.shippingNote}>{SHIPPING_NOTE}</p>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.total}>{formatPrice(subtotal)}</span>
            </div>

            <button
              type="button"
              className={buttonClassName("primary", styles.checkoutButton)}
              onClick={() => setCheckoutNotice(true)}
            >
              Checkout
            </button>

            {checkoutNotice && (
              <p className={styles.notice} role="status">
                This template stops at the cart. Connect a payment provider
                (Stripe, Shopify, or your own checkout route) to take orders.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
