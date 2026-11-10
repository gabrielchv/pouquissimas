"use client";

import { useState } from "react";

import styles from "./product-purchase-panel.module.css";
import { buttonClassName } from "@/components/ui/button-classes";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Price } from "@/components/ui/Price";
import { SHIPPING_NOTE } from "@/config/site";
import { collectionLabel } from "@/config/navigation";
import { useCart } from "@/features/cart/cart-context";
import type { Product } from "@/lib/types";

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "ONE SIZE");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart() {
    addItem(product, size, quantity);
    setJustAdded(true);

    // Reset the confirmation after the drawer has had time to open.
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>{collectionLabel(product.collection)}</p>
      <h1 className={styles.title}>{product.name}</h1>
      <Price
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        size="large"
        showDiscount
      />

      <p className={styles.colorway}>{product.colorway}</p>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          Size
          <span className={styles.legendHint}>
            {product.sizes.length === 1 ? "One size" : "True to size"}
          </span>
        </legend>

        <div className={styles.sizes}>
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              className={[styles.size, option === size ? styles.sizeActive : ""].join(" ")}
              onClick={() => setSize(option)}
              aria-pressed={option === size}
              disabled={product.soldOut}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          label={`Quantity for ${product.name}`}
        />

        <button
          type="button"
          className={buttonClassName("primary", styles.addButton)}
          onClick={handleAddToCart}
          disabled={product.soldOut}
        >
          {product.soldOut ? "Sold out" : justAdded ? "Added to bag" : "Add to bag"}
        </button>
      </div>

      <p className={styles.shipping}>{SHIPPING_NOTE}</p>

      <div className={styles.details}>
        <h2 className={styles.detailsTitle}>Details</h2>
        <p className={styles.description}>{product.description}</p>

        <dl className={styles.specs}>
          <div className={styles.spec}>
            <dt>Colourway</dt>
            <dd>{product.colorway}</dd>
          </div>
          <div className={styles.spec}>
            <dt>Category</dt>
            <dd>{collectionLabel(product.collection)}</dd>
          </div>
          <div className={styles.spec}>
            <dt>Sizes</dt>
            <dd>{product.sizes.join(" / ")}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
