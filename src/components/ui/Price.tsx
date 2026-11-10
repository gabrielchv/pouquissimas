import styles from "./price.module.css";
import { discountPercent, formatPrice } from "@/lib/format";

interface PriceProps {
  price: number;
  compareAtPrice?: number;
  /** Larger treatment for product detail pages. */
  size?: "default" | "large";
  showDiscount?: boolean;
}

export function Price({
  price,
  compareAtPrice,
  size = "default",
  showDiscount = false,
}: PriceProps) {
  const onSale = typeof compareAtPrice === "number" && compareAtPrice > price;
  const percent = discountPercent(price, compareAtPrice);

  return (
    <p className={[styles.price, styles[size]].join(" ")}>
      <span className={onSale ? styles.salePrice : styles.regularPrice}>
        {formatPrice(price)}
      </span>

      {onSale && (
        <>
          <s className={styles.compareAt}>{formatPrice(compareAtPrice)}</s>
          <span className="visually-hidden">, reduzido de {formatPrice(compareAtPrice)}</span>
        </>
      )}

      {showDiscount && percent !== null && (
        <span className={styles.discount}>−{percent}%</span>
      )}
    </p>
  );
}
