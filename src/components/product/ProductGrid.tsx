import styles from "./product-grid.module.css";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  /** Prioritise the first row of images for LCP. */
  priorityCount?: number;
}

export function ProductGrid({ products, priorityCount = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className={styles.empty}>
        Nothing here yet. Check back next drop.
      </p>
    );
  }

  return (
    <ul className={styles.grid}>
      {products.map((product, index) => (
        <li key={product.id} className={styles.item}>
          <ProductCard product={product} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
