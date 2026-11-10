import Image from "next/image";
import Link from "next/link";

import styles from "./logo.module.css";
import { SITE } from "@/config/site";

/**
 * Logo oficial da marca: o nome sobre o carro, branco sobre transparente.
 *
 * A arte vem de public/media/brand/, gerada por `npm run brand-assets` a
 * partir de pouquissimas/shape/shape_back_image_white.png.
 *
 * São dois recortes do mesmo arquivo:
 * - logo.png          lockup completo (nome + carro), usado a partir de 750px;
 * - logo-wordmark.png só a linha do nome, para o cabeçalho no celular, onde o
 *   lockup inteiro deixaria o nome ilegível.
 */
export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label={`${SITE.name} — página inicial`}>
      <Image
        src="/media/brand/logo.png"
        alt={SITE.name}
        width={1000}
        height={675}
        priority
        className={styles.lockup}
      />
      <Image
        src="/media/brand/logo-wordmark.png"
        alt={SITE.name}
        width={1000}
        height={152}
        priority
        className={styles.wordmark}
      />
    </Link>
  );
}
