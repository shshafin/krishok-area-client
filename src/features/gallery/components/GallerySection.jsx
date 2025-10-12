import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

// optional: tiny helper to generate a first-frame thumbnail for videos (CORS permitting)
function useVideoThumbnails(items) {
  const [thumbs, setThumbs] = useState({});
  useEffect(() => {
    let alive = true;

    const genThumb = (videoUrl, atSec = 0.1) =>
      new Promise((resolve, reject) => {
        try {
          const video = document.createElement("video");
          video.crossOrigin = "anonymous";
          video.muted = true;
          video.playsInline = true;
          video.preload = "auto";
          video.src = videoUrl;

          const onLoaded = () => {
            const target = atSec;
            const onSeeked = () => {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth || 640;
              canvas.height = video.videoHeight || 360;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL("image/jpeg"));
            };
            video.currentTime = Math.min(target, video.duration || target);
            video.addEventListener("seeked", onSeeked, { once: true });
          };

          video.addEventListener("loadeddata", onLoaded, { once: true });
          video.addEventListener("error", reject, { once: true });
        } catch (e) {
          reject(e);
        }
      });

    (async () => {
      const candidates = items.filter(
        (it) =>
          it?.type === "video" && !it.poster && !it.img && it.video && !thumbs[it.id]
      );
      if (!candidates.length) return;

      const updates = {};
      for (const it of candidates) {
        try {
          updates[it.id] = await genThumb(it.video);
        } catch {
          /* swallow */
        }
      }
      if (alive && Object.keys(updates).length) {
        setThumbs((prev) => ({ ...prev, ...updates }));
      }
    })();

    return () => {
      alive = false;
    };
  }, [items, thumbs]);

  return thumbs;
}

export default function GallerySection({ post, suggest = [] }) {
  const thumbs = useVideoThumbnails(suggest);

  return (
    <div className="midkkk11">
      {/* Featured / main post */}
      {post && (
        <div className="ittdkkk11">
          <div className="itkkk11">
            {post.type === "video" ? (
              <video controls poster={post.poster || post.img} src={post.video} />
            ) : (
              <img src={post.img} alt={post.alt || "photo gallery"} />
            )}
            <h5>{post.title}</h5>
          </div>

          <div className="tdkkk11">
            <span title={post.timeTitle} className="times">
              <time
                style={{ fontSize: "small" }}
                className="timeago"
                dateTime={post.datetime}
              >
                {post.timeText}
              </time>
            </span>
            {post.description && <p className="description">{post.description}</p>}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="ailkkk11">
        {suggest.map((it) => {
          const isVideo = it.type === "video";
          const thumbSrc = isVideo ? it.poster || it.img || thumbs[it.id] : it.img;

          return (
            <div className="photobox" key={it.id}>
              <NavLink to={`/post/${it.id}`}>
                <div className="mplbkk22">
                  <div className="plarpkk22">
                    {thumbSrc ? (
                      <img src={thumbSrc} alt={it.alt || "photo gallery"} />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #ddd",
                          fontSize: "0.9rem",
                        }}
                      >
                        {isVideo ? "Loading preview…" : "No image"}
                      </div>
                    )}
                  </div>
                  <div className="plarptkk22">
                    <h5 className="as">{it.title}</h5>
                    <p title={it.timeTitle}>
                      <time
                        style={{ fontSize: "small" }}
                        className="timeago"
                        dateTime={it.datetime}
                      >
                        {it.timeText}
                      </time>
                    </p>
                  </div>
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}