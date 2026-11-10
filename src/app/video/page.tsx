import styles from "./video.module.css";
import { PageHeader } from "@/components/layout/PageHeader";
import { VideoTile } from "@/components/video/VideoTile";

export const metadata = { title: "Video" };

const VIDEOS = [
  {
    src: "/media/video/clip-01.mp4",
    poster: "/media/video/clip-01.jpg",
    title: "Night Shift",
    caption: "Full part · 04:12",
  },
  {
    src: "/media/video/clip-02.mp4",
    poster: "/media/video/clip-02.jpg",
    title: "Back Lot",
    caption: "Full part · 02:48",
  },
  {
    src: "/media/video/clip-03.mp4",
    poster: "/media/video/clip-03.jpg",
    title: "Concrete Hours",
    caption: "Full part · 03:26",
  },
];

export default function VideoPage() {
  return (
    <div className="container">
      <PageHeader
        eyebrow="Tapes"
        title="Video"
        description="Full parts, raw clips and whatever else we shot this season."
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
