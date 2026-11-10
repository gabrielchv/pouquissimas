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
        Nada por aqui ainda. Volte na próxima leva.
      </p>
    );
  }

  // Uma coleção de um item só não deve virar um card pequeno num canto.
  const layoutClass = products.length === 1 ? styles.single : styles.grid;

  return (
    <ul className={layoutClass}>
      {products.map((product, index) => (
        <li key={product.id} className={styles.item}>
          <ProductCard product={product} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
