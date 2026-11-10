import Image from "next/image";
import Link from "next/link";

import styles from "./logo.module.css";
import { SITE } from "@/config/site";

interface LogoProps {
  className?: string;
  /** `large` é usado em páginas de destaque; o padrão é o cabeçalho. */
  size?: "default" | "large";
}

/**
 * A marca oficial: a faixa desenhada à mão com o nome da loja.
 * O arquivo vem de public/media/brand/wordmark.png, gerado pelo script
 * scripts/import_brand_assets.py a partir da arte original.
 */
export function Logo({ className, size = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      className={[styles.logo, styles[size], className].filter(Boolean).join(" ")}
      aria-label={`${SITE.name} — página inicial`}
    >
      <Image
        src="/media/brand/wordmark.png"
        alt={SITE.name}
        width={900}
        height={269}
        priority
        className={styles.wordmarkImage}
      />
    </Link>
  );
}
