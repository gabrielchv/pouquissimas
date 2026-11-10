import Image from "next/image";
import Link from "next/link";

import styles from "./previa.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonClassName } from "@/components/ui/button-classes";
import { getAllProducts } from "@/lib/catalog";

export const metadata = {
  title: "Prévia",
  alternates: { canonical: "/previa" },
};

/** Lookbook montado com as imagens do mesmo catálogo. */
export default function PreviaPage() {
  const looks = getAllProducts().slice(0, 6);

  return (
    <div className="container">
      <PageHeader
        eyebrow="Verão 26 · Lookbook"
        title="Prévia"
        description="Um primeiro olhar da temporada antes de chegar na loja. As fotos são provisórias até o ensaio oficial ficar pronto."
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
          A coleção completa chega em breve. Até lá, a linha atual está na loja.
        </p>
        <Link href="/loja" className={buttonClassName("primary")}>
          Ver a coleção
        </Link>
      </div>
    </div>
  );
}
