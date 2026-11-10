"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./product-gallery.module.css";

interface ProductGalleryProps {
  images: { src: string; alt: string }[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          priority
          sizes="(min-width: 990px) 55vw, 100vw"
          className={styles.stageImage}
        />
      </div>

      {images.length > 1 && (
        <ul className={styles.thumbs}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                className={[
                  styles.thumb,
                  index === activeIndex ? styles.thumbActive : "",
                ].join(" ")}
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={index === activeIndex}
              >
                <Image
                  src={image.src}
                  alt=""
                  width={120}
                  height={120}
                  className={styles.thumbImage}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
