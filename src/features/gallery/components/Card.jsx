import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const isVideoUrl = (url = "") => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

const Card = ({
  id,
  img, // image URL OR (if no `video` prop) might be a video URL
  video, // explicit video URL (preferred for videos)
  poster, // optional poster URL for video
  alt = "media",
  title,
  onOpen,
  path = "post",
}) => {
  const mediaUrl = video || img;
  const isVideo = useMemo(() => !!video || isVideoUrl(img), [video, img]);

  // For generating a thumbnail from the first frame when poster not provided
  const [thumb, setThumb] = useState(poster || null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isVideo || thumb || !mediaUrl) return;

    // Try to grab first frame as a thumbnail (best effort)
    const v = document.createElement("video");
    v.crossOrigin = "anonymous"; // needed for drawing to canvas from CORS-enabled sources
    v.preload = "metadata";
    v.muted = true;
    v.src = mediaUrl;

    const onLoadedMetadata = () => {
      try {
        // Seek a tiny bit in to ensure we have a frame
        v.currentTime = Math.min(0.1, v.duration || 0.1);
      } catch {
        // ignore
      }
    };

    const onSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth || 640;
        canvas.height = v.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        if (dataUrl && dataUrl.startsWith("data:image")) {
          setThumb(dataUrl);
        }
      } catch {
        // If canvas is tainted or something fails, silently fall back
      }
      // Stop loading ASAP
      v.pause();
      v.removeAttribute("src");
      v.load();
    };

    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("error", () => {
      // Ignore errors; keep no thumb
    });

    // Kick off loading
    v.load();

    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("seeked", onSeeked);
      // ensure cleanup
      v.pause?.();
      v.removeAttribute?.("src");
      try {
        v.load?.();
      } catch {}
    };
  }, [isVideo, mediaUrl, thumb]);

  return (
    <div className="mibkk30">
      <div className="iandtkk30">
        <NavLink to={`/${path}/${id}`} onClick={onOpen}>
          {isVideo ? (
            // VIDEO THUMBNAIL MODE
            <>
              {/* Show poster/thumbnail as <img> to avoid any playback */}
              <img
                className="gallery-img"
                src={thumb || poster || ""}
                alt={alt}
                // If no poster or capture failed, fall back to a tiny hidden video element as visual
                style={!thumb && !poster ? { display: "none" } : undefined}
                onError={(e) => {
                  // graceful fallback to a neutral placeholder
                  e.currentTarget.src =
                    "https://via.placeholder.com/640x360?text=Video";
                }}
              />
              {/* Hidden lightweight <video> ensures correct aspect ratio fallback if no poster available */}
              {!thumb && !poster && (
                <video
                  ref={videoRef}
                  className="gallery-img"
                  src={mediaUrl}
                  preload="metadata"
                  playsInline
                  muted
                  controls={false}
                  autoPlay={false}
                  // keep it visible if you want a native preview frame; here we keep it visible as a last resort
                  style={{ display: "block" }}
                  onLoadedData={(e) => {
                    // Immediately pause at first frame
                    try {
                      e.currentTarget.currentTime = 0;
                      e.currentTarget.pause();
                    } catch {}
                  }}
                />
              )}
            </>
          ) : (
            // IMAGE MODE
            <img className="gallery-img" src={img} alt={alt} />
          )}
        </NavLink>

        <p title="photo title" className="itkk30">
          {title}
        </p>
      </div>
    </div>
  );
};

export default Card;