import Image from "next/image";
import Link from "next/link";

import styles from "./preview.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonClassName } from "@/components/ui/button-classes";
import { getAllProducts } from "@/lib/catalog";

export const metadata = { title: "Preview" };

/** A lookbook grid built from the same catalogue imagery. */
export default function PreviewPage() {
  const looks = getAllProducts().slice(0, 6);

  return (
    <div className="container">
      <PageHeader
        eyebrow="Fall 26 · Lookbook"
        title="Preview"
        description="A first look at the season before it lands in the shop. Photography is placeholder until the real shoot is back from the lab."
      />

      <div className={styles.grid}>
        {looks.map((product, index) => (
          <figure key={product.id} className={styles.look}>
            <div className={styles.frame}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 990px) 45vw, 100vw"
                className={styles.image}
              />
            </div>

            <figcaption className={styles.caption}>
              <span className={styles.index}>LOOK {String(index + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{product.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.cta}>
        <p className={styles.ctaText}>
          The full range drops soon. Until then, the current collection is live.
        </p>
        <Link href="/shop" className={buttonClassName("primary")}>
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
