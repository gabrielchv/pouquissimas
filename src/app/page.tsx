import Link from "next/link";

import styles from "./page.module.css";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/product/SectionHeading";
import { buttonClassName } from "@/components/ui/button-classes";
import { PlayIcon } from "@/components/ui/Icons";
import { SITE } from "@/config/site";
import {
  getNewArrivals,
  getProductsByCollection,
  getSaleProducts,
} from "@/lib/catalog";

export default function HomePage() {
  const latest = getNewArrivals(8);
  const shapes = getProductsByCollection("shapes");
  const onSale = getSaleProducts().slice(0, 4);

  return (
    <div className={styles.home}>
      <section className={`container ${styles.section}`} aria-labelledby="novidades">
        <SectionHeading
          id="novidades"
          eyebrow="Nova temporada"
          title="Últimos lançamentos"
          description="Shapes novos e algodão pesado, estampado em tiragens pequenas."
          action={{ label: "Ver tudo", href: "/loja" }}
        />
        <ProductGrid products={latest} />
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="shapes">
        <SectionHeading
          id="shapes"
          eyebrow="Sete lâminas de bordo"
          title="Shapes"
          action={{ label: "Todos os shapes", href: "/loja?colecao=shapes" }}
        />
        <ProductGrid products={shapes} priorityCount={0} />
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="video">
        <Link href="/video" className={styles.videoBand}>
          <video
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/video/clip-01.jpg"
          >
            <source src="/media/video/clip-01.mp4" type="video/mp4" />
          </video>

          <div className={styles.videoOverlay}>
            <p className={styles.videoEyebrow}>{SITE.tagline}</p>
            <h2 id="video" className={styles.videoTitle}>
              Assista ao vídeo completo
            </h2>
            <span className={styles.videoCta}>
              <PlayIcon />
              Abrir vídeo
            </span>
          </div>
        </Link>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="promocoes">
        <SectionHeading
          id="promocoes"
          eyebrow="Últimos tamanhos"
          title="Em promoção"
          action={{ label: "Ver promoções", href: "/promocoes" }}
        />
        <ProductGrid products={onSale} priorityCount={0} />

        <div className={styles.closing}>
          <p className={styles.closingText}>
            Na dúvida com o tamanho? Cada shape e cada camiseta mostra as medidas
            na página do produto.
          </p>
          <Link href="/loja" className={buttonClassName("secondary")}>
            Ver a coleção
          </Link>
        </div>
      </section>
    </div>
  );
}
