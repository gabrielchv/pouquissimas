import Link from "next/link";

import styles from "./shop.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { COLLECTIONS } from "@/config/navigation";
import { getProductsByCollection } from "@/lib/catalog";
import type { CollectionId } from "@/lib/types";

interface ShopPageProps {
  searchParams: Promise<{ collection?: string }>;
}

function parseCollection(value: string | undefined): CollectionId | "all" {
  const match = COLLECTIONS.find((collection) => collection.id === value);
  return match ? match.id : "all";
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { collection: rawCollection } = await searchParams;
  const collection = parseCollection(rawCollection);
  const products = getProductsByCollection(collection);

  const activeCollection = COLLECTIONS.find((item) => item.id === collection);

  return (
    <div className="container">
      <PageHeader
        eyebrow="Shop"
        title="The full collection"
        description={
          activeCollection?.blurb ?? "Decks, tees, tops, headwear and hardware."
        }
      />

      <nav className={styles.filters} aria-label="Collections">
        <Link
          href="/shop"
          className={[styles.filter, collection === "all" ? styles.filterActive : ""].join(" ")}
          aria-current={collection === "all" ? "page" : undefined}
        >
          ALL
        </Link>
        {COLLECTIONS.map((item) => (
          <Link
            key={item.id}
            href={`/shop?collection=${item.id}`}
            className={[styles.filter, collection === item.id ? styles.filterActive : ""].join(" ")}
            aria-current={collection === item.id ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <p className={styles.count}>
        {products.length} {products.length === 1 ? "item" : "items"}
      </p>

      <ProductGrid products={products} />
    </div>
  );
}
