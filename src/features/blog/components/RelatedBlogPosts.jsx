import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function RelatedBlogPosts({
  cropLabel = "পেপে এর",
  topicLabel = "রোগবালাই",
  items = [
    {
      id: 29,
      title: "পেপের মোজাইক রোগ",
      image:
        "admin/crop-image/crop-image456527379_488024297459119_3008315293522916196_n.jpg",
    },
    {
      id: 32,
      title: "পচনের অনেক কোম্পানীর ছতরাকনাশক রয়েছে তা দিতে হবে।",
      image: "admin/crop-image/crop-imagepointedgourdthrips-krishokarea.jfif",
    },
    {
      id: 34,
      title: "পেপের মোজাইক রোগ",
      image:
        "admin/crop-image/crop-imagepointedgourdscaleinsect-krishokarea.jfif",
    },
    {
      id: 37,
      title: "টমাটো প্রতিদিন একটি করে খাওয়া সকলের প্রয়োজন ।",
      image: "admin/crop-image/crop-imagebishakto shohor.PNG",
    },
    {
      id: 38,
      title: "টমাটো প্রতিদিন একটি করে খাওয়া সকলের প্রয়োজন ।",
      image:
        "admin/crop-image/crop-image467474496_515902994830123_3009009493729625416_n.png",
    },
    {
      id: 39,
      title:
        "টমাটো প্রতিদিন একটি করে খাওয়া সকলের প্রয়োজন । টমাটো প্রতিদিন একটি করে খাওয়া সকলের প্রয়োজন ।",
      image: "admin/crop-image/crop-imagefol-fete-jawya-krishokarea.jpg",
    },
  ],
  basePath = "post",
  titleMaxLen = 52,
  // where to go if there's no browser history to go back to:
  fallbackTo = "/guidelines",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = (e) => {
    e.preventDefault();
    // if a previous route was passed via state, prefer it
    const from = location.state?.from;
    if (from) {
      navigate(from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  };

  const clampTitle = (t = "", max = 52) =>
    t.length > max ? t.slice(0, max - 1) + "…" : t;

  return (
    <section aria-labelledby="related-blog-header">
      {/* Back link */}
      <div className="back">
        <a href="#" onClick={handleBack}>
          <span>⇦</span> নির্দেশীকায় ফিরে যান
        </a>
        <p></p>
      </div>

      {/* Header */}
      <div className="related-crop-main-header">
        <h2 id="related-blog-header" className="m-a">
          <p className="corpndpbmr">{cropLabel}</p>
          <span>{topicLabel}</span> সম্পর্কিত অন্যান্য রোগসমূহ
        </h2>
      </div>

      {/* Grid */}
      <div className="main-related-crop">
        <div className="related-crop-list">
          {items.map((it) => (
            <div className="related-item" key={it.id}>
              <div className="crop-card">
                <NavLink
                  className=""
                  to={`/${basePath}/${it.id}`}
                  // TIP: if you create these links from a page,
                  // pass state={{ from: location.pathname }} at the source
                >
                  <img
                    className="gallery-img"
                    src={it.image}
                    alt={it.title || "crop image"}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/fallbacks/placeholder-related.jpg";
                    }}
                  />
                </NavLink>
                <p title="crop title" className="related-slide-crop-title">
                  {clampTitle(it.title, titleMaxLen)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}