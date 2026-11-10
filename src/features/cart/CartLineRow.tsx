"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "./cart-line-row.module.css";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatPrice } from "@/lib/format";
import type { CartLineWithProduct } from "@/lib/types";

interface CartLineRowProps {
  line: CartLineWithProduct;
  variant: "drawer" | "page";
  onQuantityChange: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
  onNavigate?: () => void;
}

export function CartLineRow({
  line,
  variant,
  onQuantityChange,
  onRemove,
  onNavigate,
}: CartLineRowProps) {
  const { product, size, quantity, key, lineTotal } = line;

  return (
    <li className={[styles.row, styles[variant]].join(" ")}>
      <Link
        href={`/produtos/${product.slug}`}
        className={styles.media}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={product.image}
          alt=""
          width={200}
          height={200}
          className={styles.image}
        />
      </Link>

      <div className={styles.details}>
        <div className={styles.headingRow}>
          <Link
            href={`/produtos/${product.slug}`}
            className={styles.name}
            onClick={onNavigate}
          >
            {product.name}
          </Link>
          <span className={styles.lineTotal}>{formatPrice(lineTotal)}</span>
        </div>

        <p className={styles.meta}>
          {product.colorway} · TAM. {size}
        </p>
        <p className={styles.unitPrice}>{formatPrice(product.price)} cada</p>

        <div className={styles.controls}>
          <QuantityStepper
            value={quantity}
            onChange={(next) => onQuantityChange(key, next)}
            label={`Quantidade de ${product.name}`}
          />

          <button
            type="button"
            className={styles.remove}
            onClick={() => onRemove(key)}
          >
            Remover
          </button>
        </div>
      </div>
    </li>
  );
}
