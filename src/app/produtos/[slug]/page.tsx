import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "./product.module.css";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { SectionHeading } from "@/components/product/SectionHeading";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { SITE_URL } from "@/config/site";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";

interface ProdutoPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProdutoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: "Produto não encontrado" };

  const imageUrl = `${SITE_URL}${product.image}`;

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/produtos/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${SITE_URL}/produtos/${product.slug}`,
      type: "website",
      images: [{ url: imageUrl, alt: product.name }],
    },
  };
}

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const galleryImages = [
    { src: product.image, alt: product.name },
    ...(product.hoverImage
      ? [{ src: product.hoverImage, alt: `${product.name}, outra vista` }]
      : []),
  ];

  const related = getRelatedProducts(product, 4);

  return (
    <div className="container">
      <ProductJsonLd product={product} imageUrl={`${SITE_URL}${product.image}`} />
      <BreadcrumbJsonLd
        items={[
          { name: "Início", href: "/" },
          { name: "Loja", href: "/loja" },
          { name: product.name },
        ]}
      />

      <nav className={styles.breadcrumbs} aria-label="Você está aqui">
        <Link href="/" className={styles.crumb}>
          Início
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/loja" className={styles.crumb}>
          Loja
        </Link>
        <span aria-hidden="true">/</span>
        <span className={styles.crumbCurrent}>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        <ProductGallery images={galleryImages} />
        <ProductPurchasePanel product={product} />
      </div>

      <section className={styles.related} aria-labelledby="relacionados">
        <SectionHeading
          id="relacionados"
          eyebrow="Continue olhando"
          title="Você também pode gostar"
        />
        <ProductGrid products={related} priorityCount={0} />
      </section>
    </div>
  );
}
