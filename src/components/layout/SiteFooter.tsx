import Link from "next/link";

import styles from "./site-footer.module.css";
import { FOOTER_LINKS, SITE } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <ul className={styles.links}>
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.link}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={SITE.instagram}
              className={styles.link}
              target="_blank"
              rel="noreferrer noopener"
            >
              INSTAGRAM
            </a>
          </li>
        </ul>

        <p className={styles.meta}>
          © {new Date().getFullYear()} {SITE.name} — {SITE.tagline}
        </p>
      </div>
    </footer>
  );
}
