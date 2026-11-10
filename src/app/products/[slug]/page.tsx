import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "./product.module.css";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { SectionHeading } from "@/components/product/SectionHeading";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const galleryImages = [
    { src: product.image, alt: product.name },
    ...(product.hoverImage
      ? [{ src: product.hoverImage, alt: `${product.name}, alternate view` }]
      : []),
  ];

  const related = getRelatedProducts(product, 4);

  return (
    <div className="container">
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/" className={styles.crumb}>
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/shop" className={styles.crumb}>
          Shop
        </Link>
        <span aria-hidden="true">/</span>
        <span className={styles.crumbCurrent}>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        <ProductGallery images={galleryImages} />
        <ProductPurchasePanel product={product} />
      </div>

      <section className={styles.related} aria-labelledby="related-title">
        <SectionHeading
          id="related-title"
          eyebrow="Keep looking"
          title="You might also like"
        />
        <ProductGrid products={related} priorityCount={0} />
      </section>
    </div>
  );
}
