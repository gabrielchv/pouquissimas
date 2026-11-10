import Image from "next/image";
import Link from "next/link";

import styles from "./featured-product.module.css";
import { Price } from "@/components/ui/Price";
import { buttonClassName } from "@/components/ui/button-classes";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Product } from "@/lib/types";

interface FeaturedProductProps {
  product: Product;
  eyebrow?: string;
  title: string;
  description?: string;
}

/**
 * Destaque para uma coleção de um item só.
 *
 * Com um único shape, uma grade de quatro colunas deixaria um card pequeno
 * perdido no canto. Aqui o produto ocupa a largura da seção, como vitrine.
 */
export function FeaturedProduct({
  product,
  eyebrow,
  title,
  description,
}: FeaturedProductProps) {
  return (
    <section className={styles.band} aria-labelledby="destaque-titulo">
      <div className={styles.media}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 990px) 45vw, 100vw"
          className={styles.image}
        />
      </div>

      <div className={styles.copy}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id="destaque-titulo" className={styles.title}>
          {title}
        </h2>
        {title !== product.name && (
          <p className={styles.productName}>{product.name}</p>
        )}
        <Price
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="large"
          showDiscount
        />
        <p className={styles.description}>{description ?? product.description}</p>

        <Link
          href={`/produtos/${product.slug}`}
          className={buttonClassName("secondary", styles.action)}
        >
          {product.soldOut ? "Ver detalhes" : "Ver o shape"}
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
