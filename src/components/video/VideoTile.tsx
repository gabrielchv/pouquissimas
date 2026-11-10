"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./video-tile.module.css";
import { PlayIcon } from "@/components/ui/Icons";

interface VideoTileProps {
  src: string;
  poster: string;
  title: string;
  caption: string;
  /** Poster is shown until the visitor presses play. */
  eager?: boolean;
}

/**
 * A deferred video, the same pattern the reference shop uses: ship a poster
 * image, and only load the mp4 once someone actually presses play.
 */
export function VideoTile({ src, poster, title, caption, eager = false }: VideoTileProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        {isPlaying ? (
          <video
            className={styles.video}
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <button
            type="button"
            className={styles.poster}
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${title}`}
          >
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 990px) 50vw, 100vw"
              priority={eager}
              className={styles.posterImage}
            />
            <span className={styles.playButton}>
              <PlayIcon />
            </span>
            <span className={styles.playLabel}>Play</span>
          </button>
        )}
      </div>

      <figcaption className={styles.caption}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.meta}>{caption}</p>
      </figcaption>
    </figure>
  );
}
