import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { LiquedLoader } from "@/components/loaders";

async function fetchPostById(id) {
  const normalizedId = String(id);
  return {
    id: normalizedId,
    title: `Gallery photo ${normalizedId}`,
    description:
      "This is placeholder content for the gallery post. Replace it with real data from your API.",
    datetime: "2024-10-18 07:05:54",
    timeText: "12 months ago",
    timeTitle: "07:05 AM (October 18th, 2024)",
    img: `https://picsum.photos/seed/gallery-${normalizedId}/1600/900`,
  };
}

async function fetchImageSuggestions(count = 6, excludeId) {
  const suggestions = Array.from({ length: count }).map((_, index) => {
    const suggestionId = 100 + index;
    return {
      id: suggestionId,
      title: `Suggested photo #${index + 1}`,
      datetime: "2024-10-04 09:43:23",
      timeText: "about a year ago",
      timeTitle: "09:43 AM (October 4th, 2024)",
      img: `https://picsum.photos/seed/gallery-s${suggestionId}/320/180`,
    };
  });

  return suggestions.filter(
    (item) => String(item.id) !== String(excludeId)
  );
}

export default function GallerySection({
  post: initialPost,
  suggest: initialSuggest,
}) {
  const { id } = useParams();
  const [post, setPost] = useState(initialPost ?? null);
  const [suggest, setSuggest] = useState(initialSuggest ?? []);
  const [status, setStatus] = useState(initialPost ? "done" : "idle");

  useEffect(() => {
    if (initialPost !== undefined) {
      setPost(initialPost);
      setStatus(initialPost ? "done" : "idle");
    }
  }, [initialPost]);

  useEffect(() => {
    if (initialSuggest !== undefined) {
      setSuggest(initialSuggest);
    }
  }, [initialSuggest]);

  useEffect(() => {
    if (!id) return;

    let alive = true;
    setStatus("loading");

    (async () => {
      try {
        const fetchedPost = await fetchPostById(id);
        if (!alive) return;

        setPost(fetchedPost);
        const related = await fetchImageSuggestions(6, fetchedPost.id);
        if (!alive) return;

        setSuggest(related);
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

  if ((status === "loading" || status === "idle") && !post) {
    return (
      <div className="page-loader">
        <LiquedLoader label="???????? ????? ??? ?????..." />
      </div>
    );
  }

  if (status === "error" || !post) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl mb-2">Unable to load gallery post</h2>
        <p className="text-gray-600">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="midkkk11">
      <div className="ittdkkk11">
        <div className="itkkk11">
          <img src={post.img} alt={post.alt || "photo gallery"} />
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

      <div className="ailkkk11">
        {suggest.map((item) => (
          <div className="photobox" key={item.id}>
            <NavLink to={`/post/${item.id}`}>
              <div className="mplbkk22">
                <div className="plarpkk22">
                  {item.img ? (
                    <img src={item.img} alt={item.alt || "photo gallery"} />
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
                      No image
                    </div>
                  )}
                </div>
                <div className="plarptkk22">
                  <h5 className="as">{item.title}</h5>
                  <p title={item.timeTitle}>
                    <time
                      style={{ fontSize: "small" }}
                      className="timeago"
                      dateTime={item.datetime}
                    >
                      {item.timeText}
                    </time>
                  </p>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}


