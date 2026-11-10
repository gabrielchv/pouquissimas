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
 * São dois recortes do mesmo arquivo, trocados por breakpoint:
 * - logo.png          lockup completo (nome + carro), a partir de 750px;
 * - logo-wordmark.png só a linha do nome, no celular, onde o lockup inteiro
 *   deixaria o nome ilegível.
 *
 * O logo dá uma volta de 360° no hover e no foco por teclado (ver
 * logo.module.css). O giro fica no hover de propósito: rotação contínua
 * deixaria o nome de cabeça para baixo metade do tempo.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className={styles.logo}
      aria-label={`${SITE.name} — página inicial`}
    >
      {/* As duas imagens são decorativas: o nome acessível vem do aria-label. */}
      <span className={styles.spin}>
        <Image
          src="/media/brand/logo.png"
          alt=""
          width={1000}
          height={675}
          priority
          className={styles.lockup}
        />
        <Image
          src="/media/brand/logo-wordmark.png"
          alt=""
          width={1000}
          height={152}
          priority
          className={styles.wordmark}
        />
      </span>
    </Link>
  );
}
