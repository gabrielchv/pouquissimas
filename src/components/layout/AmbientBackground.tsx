import styles from "./ambient-background.module.css";

/**
 * The fixed video wash behind the whole storefront, matching the reference
 * layout where product cut-outs float over moving footage.
 *
 * Server-rendered on purpose: the markup costs no JavaScript. The poster is
 * used as a still fallback when the visitor prefers reduced motion.
 */
export function AmbientBackground() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/video/bg-loop.jpg"
      >
        <source src="/media/video/bg-loop.mp4" type="video/mp4" />
      </video>

      <div className={styles.wash} />
      <div className={styles.scanlines} />
    </div>
  );
}
