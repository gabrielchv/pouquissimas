import styles from "./video.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { VideoTile } from "@/components/video/VideoTile";

export const metadata = {
  title: "Vídeo",
  alternates: { canonical: "/video" },
};

const VIDEOS = [
  {
    src: "/media/video/clip-01.mp4",
    poster: "/media/video/clip-01.jpg",
    title: "Turno da noite",
    caption: "Parte completa · 04:12",
  },
  {
    src: "/media/video/clip-02.mp4",
    poster: "/media/video/clip-02.jpg",
    title: "Pátio dos fundos",
    caption: "Parte completa · 02:48",
  },
  {
    src: "/media/video/clip-03.mp4",
    poster: "/media/video/clip-03.jpg",
    title: "Horas de concreto",
    caption: "Parte completa · 03:26",
  },
];

export default function VideoPage() {
  return (
    <div className="container">
      <PageHeader
        eyebrow="Fitas"
        title="Vídeo"
        description="Partes completas, clipes crus e tudo o que gravamos nesta temporada."
      />

      <div className={styles.feed}>
        {VIDEOS.map((video, index) => (
          <VideoTile
            key={video.src}
            src={video.src}
            poster={video.poster}
            title={video.title}
            caption={video.caption}
            eager={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
