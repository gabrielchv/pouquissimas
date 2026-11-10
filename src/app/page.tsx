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
  const decks = getProductsByCollection("decks");
  const onSale = getSaleProducts().slice(0, 4);

  return (
    <div className={styles.home}>
      <section className={`container ${styles.section}`} aria-labelledby="latest-title">
        <SectionHeading
          id="latest-title"
          eyebrow="New season"
          title="Latest drop"
          description="Fresh decks and heavyweight cotton, printed in small runs."
          action={{ label: "Shop all", href: "/shop" }}
        />
        <ProductGrid products={latest} />
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="decks-title">
        <SectionHeading
          id="decks-title"
          eyebrow="Seven-ply maple"
          title="Decks"
          action={{ label: "All decks", href: "/shop?collection=decks" }}
        />
        <ProductGrid products={decks} priorityCount={0} />
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="video-title">
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
            <h2 id="video-title" className={styles.videoTitle}>
              Watch the full tape
            </h2>
            <span className={styles.videoCta}>
              <PlayIcon />
              Open video
            </span>
          </div>
        </Link>
      </section>

      <section className={`container ${styles.section}`} aria-labelledby="sale-title">
        <SectionHeading
          id="sale-title"
          eyebrow="Last sizes"
          title="On sale"
          action={{ label: "Shop sale", href: "/sale" }}
        />
        <ProductGrid products={onSale} priorityCount={0} />

        <div className={styles.closing}>
          <p className={styles.closingText}>
            Not sure about sizing? Every deck and tee lists its measurements on
            the product page.
          </p>
          <Link href="/shop" className={buttonClassName("secondary")}>
            Browse the collection
          </Link>
        </div>
      </section>
    </div>
  );
}
