import { useMemo, useState } from "react";
import GridIcon from "@/assets/IconComponents/Grid";
import CameraIcon from "@/assets/IconComponents/CameraIcon";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import styles from "../styles/Profile.module.css";

/**
 * Props:
 *  - posts: Array<Post>  (ProfilePage slices for infinite scroll)
 *  - renderPost: (post) => ReactNode
 *
 * Photos tab:
 *  - Click any photo -> opens Lightbox (zoomable)
 */
export default function ProfileTabs({ posts = [], renderPost }) {
  const [tab, setTab] = useState("posts");

  // build photo list from visible posts (images only)
  const photos = useMemo(() => {
    return posts
      .flatMap((p) => (p.media || []).map((m) => ({ postId: p.postId, url: m })))
      .filter((m) => !/\.(mp4|webm|ogg)$/i.test(m.url));
  }, [posts]);

  // Lightbox state for Photos tab
  const [openIndex, setOpenIndex] = useState(-1);
  const photoSlides = useMemo(() => photos.map((m) => ({ src: m.url })), [photos]);

  return (
    <section className={styles["profile-tabs"]}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "posts" ? styles.active : ""}`}
          onClick={() => setTab("posts")}
          type="button"
        >
          <GridIcon /> Posts
        </button>
        <button
          className={`${styles.tab} ${tab === "photos" ? styles.active : ""}`}
          onClick={() => setTab("photos")}
          type="button"
        >
          <CameraIcon /> Photos
        </button>
      </div>

      {tab === "posts" && (
        <div className={styles["posts-list"]}>
          {posts.length === 0 ? (
            <span className={styles["empty-hint"]}>no post</span>
          ) : (
            posts.map((p) => (
              <div className={styles["post-wrap"]} key={p.postId}>
                {renderPost(p)}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "photos" && (
        <div className={styles["photos-grid"]}>
          {photos.length === 0 ? (
            <span className={styles["empty-hint"]}>no photo</span>
          ) : (
            photos.map((m, i) => (
              <button
                key={`${m.postId}-${i}`}
                type="button"
                className={styles["photo-cell"]}
                onClick={() => setOpenIndex(i)}
                aria-label="Open photo"
                title="Open photo"
              >
                <img src={m.url} alt="post media" className={styles.photo} loading="lazy" />
              </button>
            ))
          )}
        </div>
      )}

      {/* Photos Lightbox */}
      <Lightbox
        open={openIndex >= 0}
        index={openIndex}
        close={() => setOpenIndex(-1)}
        slides={photoSlides}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 4,
          wheelZoomDistanceFactor: 100,
        }}
      />
    </section>
  );
}