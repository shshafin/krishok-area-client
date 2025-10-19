import { useMemo, useState } from "react";
import GridIcon from "@/assets/IconComponents/Grid";
import CameraIcon from "@/assets/IconComponents/CameraIcon";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { baseApi } from "@/api";
import styles from "../styles/Profile.module.css";

const VIDEO_PATTERN = /\.(mp4|webm|ogg)$/i;
const isAbsoluteUrl = (url) =>
  typeof url === "string" &&
  (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:"));

const withBaseUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  return isAbsoluteUrl(url) ? url : `${baseApi}${url}`;
};

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
    return posts.flatMap((p) => {
      const postId = p._id ?? p.postId ?? p.id ?? "post";
      const fromImages = Array.isArray(p.images) ? p.images : [];
      const fromMedia = Array.isArray(p.media)
        ? p.media.filter((src) => !VIDEO_PATTERN.test(src))
        : [];
      const sources = [...fromImages, ...fromMedia];
      return sources.map((url) => ({
        postId: String(postId),
        url: withBaseUrl(url),
      }));
    });
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
            posts.map((p, index) => (
              <div
                className={styles["post-wrap"]}
                key={p._id ?? p.postId ?? p.id ?? `post-${index}`}
              >
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
