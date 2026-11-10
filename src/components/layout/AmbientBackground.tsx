"use client";

import { useSyncExternalStore } from "react";

import styles from "./ambient-background.module.css";

/**
 * Observa uma media query sem efeito nem estado derivado.
 *
 * `useSyncExternalStore` é o caminho certo aqui: no servidor o snapshot é
 * sempre `false`, então o HTML inicial não contém o vídeo, e no cliente ele
 * reflete a query real.
 */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * O vídeo de fundo fixo atrás da loja, como na referência.
 *
 * Performance: o vídeo é decoração e pesa ~525 KB. Ele só é renderizado quando
 * faz sentido — tela larga, sem preferência por movimento reduzido e sem
 * economia de dados. Nos outros casos fica só o poster, que já é o
 * `background-image` de .backdrop, então o visual não muda. CSS `display:none`
 * não bastava: o navegador baixava o mp4 de qualquer forma.
 */
export function AmbientBackground() {
  const isWide = useMediaQuery("(min-width: 750px)");

  // IMPORTANTE: as queries são escritas na forma "reduce", não "no-preference".
  // O Chrome não suporta `prefers-reduced-data`, e uma query desconhecida
  // resolve para false. Perguntando "no-preference" o vídeo seria desligado em
  // todo navegador que não conhece a feature; perguntando "reduce" ele só é
  // desligado quando o usuário realmente pediu.
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const prefersReducedData = useMediaQuery("(prefers-reduced-data: reduce)");

  const showVideo = isWide && !prefersReducedMotion && !prefersReducedData;

  return (
    <div className={styles.backdrop} aria-hidden="true">
      {showVideo && (
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
      )}

      <div className={styles.wash} />
      <div className={styles.scanlines} />
    </div>
  );
}
