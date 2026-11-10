import styles from "./promocoes.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getSaleProducts } from "@/lib/catalog";

export const metadata = {
  title: "Promoções",
  alternates: { canonical: "/promocoes" },
};

export default function PromocoesPage() {
  const products = getSaleProducts();

  return (
    <div className="container">
      <PageHeader
        eyebrow="Últimos tamanhos, últimas peças"
        title="Promoções"
        description="Preço reduzido para abrir espaço para a próxima leva. Quando acabar, acabou."
      />

      <p className={styles.note}>Peças em promoção não têm troca.</p>

      <ProductGrid products={products} />
    </div>
  );
}
