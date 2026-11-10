import styles from "./announcement-bar.module.css";
import { SITE } from "@/config/site";

export function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <p className={styles.message}>{SITE.announcement}</p>
    </div>
  );
}
