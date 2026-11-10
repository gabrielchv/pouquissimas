import styles from "./sale.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getSaleProducts } from "@/lib/catalog";

export const metadata = { title: "Sale" };

export default function SalePage() {
  const products = getSaleProducts();

  return (
    <div className="container">
      <PageHeader
        eyebrow="Last sizes, last pieces"
        title="Sale"
        description="Reduced to clear space for the next drop. Once they are gone, they are gone."
      />

      <p className={styles.note}>All sale items are final sale.</p>

      <ProductGrid products={products} />
    </div>
  );
}
