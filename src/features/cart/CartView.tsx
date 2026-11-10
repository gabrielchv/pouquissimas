"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./cart-view.module.css";
import { CartLineRow } from "./CartLineRow";
import { useCart } from "./cart-context";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonClassName } from "@/components/ui/button-classes";
import { BagIcon } from "@/components/ui/Icons";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_NOTE } from "@/config/site";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { lines, subtotal, itemCount, isReady, setQuantity, removeLine, clearCart } =
    useCart();
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="container">
      <PageHeader
        eyebrow="Checkout"
        title="Sua sacola"
        description={
          itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? "item" : "itens"} para finalizar.`
            : "Nada na sacola ainda."
        }
      />

      {!isReady ? (
        <p className={styles.loading}>Carregando sua sacola…</p>
      ) : lines.length === 0 ? (
        <div className={styles.empty}>
          <BagIcon className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>Sua sacola está vazia</p>
          <p className={styles.emptyBody}>
            Comece por um shape e monte o resto em volta.
          </p>
          <Link href="/loja" className={buttonClassName("primary")}>
            Ver a coleção
          </Link>
        </div>
      ) : (
        <div className={styles.layout}>
          <section aria-label="Itens da sua sacola" className={styles.items}>
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
              <Link href="/loja" className={styles.continueLink}>
                ← Continuar comprando
              </Link>
              <button type="button" className={styles.clearButton} onClick={clearCart}>
                Esvaziar sacola
              </button>
            </div>
          </section>

          <aside className={styles.summary} aria-label="Resumo do pedido">
            <h2 className={styles.summaryTitle}>Resumo</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Frete</span>
              <span>
                {qualifiesForFreeShipping ? "Grátis" : "Calculado na finalização"}
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
              Finalizar compra
            </button>

            {checkoutNotice && (
              <p className={styles.notice} role="status">
                Este template termina na sacola. Conecte um meio de pagamento
                (Pix, cartão, Stripe ou seu próprio checkout) para receber pedidos.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
