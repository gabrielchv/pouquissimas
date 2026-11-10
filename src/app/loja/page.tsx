import type { Metadata } from "next";
import Link from "next/link";

import styles from "./loja.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeaturedProduct } from "@/components/product/FeaturedProduct";
import { ProductGrid } from "@/components/product/ProductGrid";
import { COLLECTIONS, collectionLabel } from "@/config/navigation";
import { getProductsByCollection } from "@/lib/catalog";
import type { CollectionId } from "@/lib/types";

interface LojaPageProps {
  searchParams: Promise<{ colecao?: string }>;
}

function parseCollection(value: string | undefined): CollectionId | "todas" {
  const match = COLLECTIONS.find((collection) => collection.id === value);
  return match ? match.id : "todas";
}

/**
 * O canonical acompanha o filtro.
 *
 * Se toda variação apontasse para /loja, o Google trataria ?colecao=shapes como
 * duplicata da loja inteira e as entradas do sitemap seriam ignoradas.
 */
export async function generateMetadata({ searchParams }: LojaPageProps): Promise<Metadata> {
  const { colecao } = await searchParams;
  const collection = parseCollection(colecao);
  const active = COLLECTIONS.find((item) => item.id === collection);

  const canonical = active ? `/loja?colecao=${active.id}` : "/loja";

  return {
    title: active ? `${active.label} — Loja` : "Loja",
    description: active?.blurb ?? "Shapes e camisetas de skate.",
    alternates: { canonical },
  };
}

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
          activeCollection?.blurb ?? "Shapes e camisetas."
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

      {/* Uma coleção de um item só fica melhor como vitrine do que como um
          card solto no canto da grade. */}
      {products.length === 1 && products[0] ? (
        <FeaturedProduct product={products[0]} eyebrow={collectionLabel(products[0].collection)} title={products[0].name} />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
