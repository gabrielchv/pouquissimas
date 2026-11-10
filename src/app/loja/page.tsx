import Link from "next/link";

import styles from "./loja.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { COLLECTIONS } from "@/config/navigation";
import { getProductsByCollection } from "@/lib/catalog";
import type { CollectionId } from "@/lib/types";

interface LojaPageProps {
  searchParams: Promise<{ colecao?: string }>;
}

function parseCollection(value: string | undefined): CollectionId | "todas" {
  const match = COLLECTIONS.find((collection) => collection.id === value);
  return match ? match.id : "todas";
}

export const metadata = { title: "Loja" };

export default async function LojaPage({ searchParams }: LojaPageProps) {
  const { colecao } = await searchParams;
  const collection = parseCollection(colecao);
  const products = getProductsByCollection(collection);

  const activeCollection = COLLECTIONS.find((item) => item.id === collection);

  return (
    <div className="container">
      <PageHeader
        eyebrow="Loja"
        title="A coleção completa"
        description={
          activeCollection?.blurb ?? "Shapes, camisetas, moletons, bonés e acessórios."
        }
      />

      <nav className={styles.filters} aria-label="Coleções">
        <Link
          href="/loja"
          className={[styles.filter, collection === "todas" ? styles.filterActive : ""].join(" ")}
          aria-current={collection === "todas" ? "page" : undefined}
        >
          TODOS
        </Link>
        {COLLECTIONS.map((item) => (
          <Link
            key={item.id}
            href={`/loja?colecao=${item.id}`}
            className={[styles.filter, collection === item.id ? styles.filterActive : ""].join(" ")}
            aria-current={collection === item.id ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <p className={styles.count}>
        {products.length} {products.length === 1 ? "item" : "itens"}
      </p>

      <ProductGrid products={products} />
    </div>
  );
}
