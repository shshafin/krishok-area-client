// GalleryPost.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const isVideoUrl = (url = "") => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

// ---- Dummy server fetchers (replace with your real API calls) ----
async function fetchPostById(id) {
  // Example logic: treat some ids as video for demo; replace with real fetch
  const sampleVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
  const samplePoster = "https://picsum.photos/800/450?random=101";

  const isVideo =
    String(id).endsWith("4") || String(id) === "104" || String(id) === "204";
  const mediaUrl = isVideo
    ? sampleVideo
    : `https://picsum.photos/1600/900?random=${id}`;

  return {
    id,
    title: isVideo
      ? "ক্ষেতে নতুন প্রযুক্তি — ভিডিও গাইড"
      : "ডিম ফুটে সাদা রঙের অতিক্ষুদ্র বাচ্চা বের হয়ে পাতার খোল থেকে রস খেয়ে বড় হতে থাকে।",
    description: isVideo
      ? "এই ভিডিওতে মাঠপর্যায়ে ব্যবহারযোগ্য দিকনির্দেশনা দেখানো হয়েছে।"
      : "ডিম ফুটে সাদা রঙের অতিক্ষুদ্র বাচ্চা বের হয়ে পাতার খোল থেকে রস খেয়ে বড় হতে থাকে।",
    datetime: "2024-10-18 07:05:54",
    timeText: "12 months ago",
    timeTitle: "07:05 AM (October 18th, 2024)",
    mediaUrl, // <-- single source for detection
    poster: isVideo ? samplePoster : undefined,
  };
}

async function fetchSuggestionsOfType(kind /* 'video' | 'image' */, count = 6) {
  if (kind === "video") {
    const videoSrcs = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    ].slice(0, count);

    return videoSrcs.map((src, i) => ({
      id: 200 + i,
      title: `ভিডিও পরামর্শ #${i + 1}`,
      datetime: "2024-10-18 07:06:55",
      timeText: "12 months ago",
      timeTitle: "07:06 AM (October 18th, 2024)",
      video: src, // <-- no type needed
      poster: `https://picsum.photos/seed/poster${i}/320/180`,
    }));
  }

  // images
  return Array.from({ length: count }).map((_, i) => ({
    id: 100 + i,
    title: `সম্পর্কিত ছবি #${i + 1}`,
    datetime: "2024-10-04 09:43:23",
    timeText: "about a year ago",
    timeTitle: "09:43 AM (October 4th, 2024)",
    img: `https://picsum.photos/seed/s${i}/320/180`,
  }));
}

// ---- Optional: generate first-frame thumbnails for video suggestions (CORS permitting) ----
function useVideoThumbs(items) {
  const [thumbs, setThumbs] = useState({});
  useEffect(() => {
    let alive = true;
    const candidates = items.filter(
      (it) => it.video && !it.poster && !thumbs[it.id]
    );
    if (!candidates.length) return;

    const genThumb = (videoUrl, atSec = 0.1) =>
      new Promise((resolve, reject) => {
        try {
          const v = document.createElement("video");
          v.crossOrigin = "anonymous";
          v.muted = true;
          v.playsInline = true;
          v.preload = "metadata";
          v.src = videoUrl;

          const onLoaded = () => {
            const target = atSec;
            const onSeeked = () => {
              try {
                const canvas = document.createElement("canvas");
                canvas.width = v.videoWidth || 640;
                canvas.height = v.videoHeight || 360;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg"));
              } catch (err) {
                reject(err);
              }
            };
            v.currentTime = Math.min(target, v.duration || target);
            v.addEventListener("seeked", onSeeked, { once: true });
          };

          v.addEventListener("loadeddata", onLoaded, { once: true });
          v.addEventListener("error", reject, { once: true });
        } catch (e) {
          reject(e);
        }
      });

    (async () => {
      const updates = {};
      for (const it of candidates) {
        try {
          updates[it.id] = await genThumb(it.video);
        } catch {
          /* ignore */
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

// ---- Component ----
export default function GalleryPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [suggest, setSuggest] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  // Load post by id (server signal)
  useEffect(() => {
    let alive = true;
    setStatus("loading");
    (async () => {
      try {
        const p = await fetchPostById(id);
        if (!alive) return;

        const isVideo = isVideoUrl(p.mediaUrl);
        setPost({
          id: p.id,
          title: p.title,
          description: p.description,
          datetime: p.datetime,
          timeText: p.timeText,
          timeTitle: p.timeTitle,
          img: isVideo ? undefined : p.mediaUrl,
          video: isVideo ? p.mediaUrl : undefined,
          poster: p.poster,
        });

        const sameType = isVideo ? "video" : "image";
        const s = await fetchSuggestionsOfType(sameType, 6);
        if (!alive) return;
        setSuggest(s);
        setStatus("done");
      } catch {
        if (!alive) return;
        setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // thumbnails for video suggestions (poster fallback)
  const videoThumbs = useVideoThumbs(suggest);

  // Main post: decide render
  const isPostVideo = useMemo(() => {
    const src = post?.video || post?.img;
    return !!src && isVideoUrl(src) && !!post?.video;
  }, [post]);

  if (status === "loading" || status === "idle") {
    return <div className="p-4">লোড হচ্ছে…</div>;
  }
  if (status === "error" || !post) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-2">ডেটা পাওয়া যায়নি</h2>
        <p className="text-gray-600">
          অনুগ্রহ করে লিংকটি যাচাই করুন বা অন্যটি চেষ্টা করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="midkkk11">
      {/* Featured / main post */}
      <div className="ittdkkk11">
        <div className="itkkk11">
          {isPostVideo ? (
            <video
              controls
              preload="metadata"
              playsInline
              poster={post.poster}
              src={post.video}
            />
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
          {post.description && (
            <p className="description">{post.description}</p>
          )}
        </div>
      </div>

      {/* Suggestions (thumbnails only; if post is video -> all video thumbs; else image thumbs) */}
      <div className="ailkkk11">
        {suggest.map((it) => {
          const src = it.video || it.img;
          const isVid = isVideoUrl(src) && !!it.video;
          const thumbSrc = isVid ? it.poster || videoThumbs[it.id] : it.img;

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
                        {isVid ? "Loading preview…" : "No image"}
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
