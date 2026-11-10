"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "./product-card.module.css";
import { Price } from "@/components/ui/Price";
import { useCart } from "@/features/cart/cart-context";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  /** First row of a grid can skip lazy loading for a faster first paint. */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const isOneSize = product.sizes.length === 1;

  return (
    <article
      className={[styles.card, product.hoverImage ? styles.hasHover : ""].join(" ")}
    >
      <div className={styles.mediaWrap}>
        <Link
          href={`/produtos/${product.slug}`}
          className={styles.mediaLink}
          aria-label={`${product.name}, ${product.compareAtPrice ? "em promoção" : "ver produto"}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 990px) 25vw, 50vw"
            priority={priority}
            className={styles.image}
          />

          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes="(min-width: 990px) 25vw, 50vw"
              aria-hidden="true"
              className={styles.hoverImage}
            />
          )}
        </Link>

        {(product.soldOut || product.compareAtPrice) && (
          <div className={styles.badges}>
            {product.soldOut ? (
              <span className={styles.soldOut}>ESGOTADO</span>
            ) : (
              <span className={styles.sale}>PROMO</span>
            )}
          </div>
        )}

        <div className={styles.overlay}>
          <Link href={`/produtos/${product.slug}`} className={styles.overlayName}>
            {product.name}
          </Link>
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />

          {!product.soldOut &&
            (isOneSize ? (
              <button
                type="button"
                className={styles.quickAdd}
                onClick={(event) => {
                  event.preventDefault();
                  addItem(product, product.sizes[0] ?? "ÚNICO");
                }}
              >
                Compra rápida
              </button>
            ) : (
              <Link href={`/produtos/${product.slug}`} className={styles.quickAdd}>
                Escolher tamanho
              </Link>
            ))}
        </div>
      </div>

      <div className={styles.meta}>
        <Link href={`/produtos/${product.slug}`} className={styles.name}>
          {product.name}
        </Link>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} />
        {product.soldOut && <span className={styles.soldOutLabel}>Esgotado</span>}
      </div>
    </article>
  );
}
