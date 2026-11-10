import Link from "next/link";

import styles from "./logo.module.css";
import { SITE } from "@/config/site";

interface LogoProps {
  /** Show the wordmark beside the mark. */
  withWordmark?: boolean;
  className?: string;
}

/**
 * Placeholder brand mark: a stencil "B" built from bars so it stays crisp at
 * any size. Swap the <svg> for your own artwork when it is ready.
 */
export function Logo({ withWordmark = true, className }: LogoProps) {
  return (
    <Link href="/" className={[styles.logo, className].filter(Boolean).join(" ")} aria-label={`${SITE.name} home`}>
      <svg
        className={styles.mark}
        viewBox="0 0 40 48"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="2" y="0" width="8" height="48" fill="currentColor" />
        <rect x="2" y="0" width="32" height="8" fill="currentColor" />
        <rect x="2" y="20" width="28" height="8" fill="currentColor" />
        <rect x="2" y="40" width="32" height="8" fill="currentColor" />
        <rect x="28" y="0" width="6" height="17" fill="currentColor" />
        <rect x="24" y="31" width="10" height="17" fill="currentColor" />
      </svg>

      {withWordmark && <span className={styles.wordmark}>{SITE.name}</span>}
    </Link>
  );
}
