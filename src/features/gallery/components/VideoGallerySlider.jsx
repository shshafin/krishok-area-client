import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";

// Required styles
import "yet-another-react-lightbox/styles.css";

const dummyVideos = [
  {
    id: 1,
    title: "Organic Farming Techniques",
    thumbnail: "https://i.imgur.com/example1.jpg",
    duration: "5:30",
    src: "/videos/organic-farming.mp4", // <— put your actual mp4 here
  },
  {
    id: 2,
    title: "Sustainable Agriculture",
    thumbnail: "https://i.imgur.com/example2.jpg",
    duration: "4:15",
    src: "/videos/sustainable-agriculture.mp4",
  },
  {
    id: 3,
    title: "Modern Farming Methods",
    thumbnail: "https://i.imgur.com/example3.jpg",
    duration: "6:45",
    src: "/videos/modern-farming.mp4",
  },
  {
    id: 4,
    title: "Agricultural Innovation",
    thumbnail: "https://i.imgur.com/example4.jpg",
    duration: "3:20",
    src: "/videos/agri-innovation.mp4",
  },
  {
    id: 5,
    title: "Smart Farming Solutions",
    thumbnail: "https://i.imgur.com/example5.jpg",
    duration: "7:10",
    src: "/videos/smart-farming.mp4",
  }
];

const VideoGallerySlider = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: false,
      align: "start",
      dragFree: true,
      containScroll: "trimSnaps",
    },
    // enable autoplay if desired:
    [Autoplay({ delay: 3500, stopOnMouseEnter: true, stopOnInteraction: false })]
  );

  useEffect(() => {
    // Any extra Embla setup can go here
  }, []);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Build slides for the lightbox Video plugin
  const slides = useMemo(
    () =>
      dummyVideos.map((v) => ({
        type: "video",
        poster: v.thumbnail,
        title: v.title,
        sources: [
          // List multiple sources if you want webm/hls fallbacks, etc.
          { src: v.src, type: "video/mp4" },
        ],
      })),
    []
  );

  const handleVideoClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="video-gallery-container">
      <h2 className="gallery-title">বৈশিষ্ট্যযুক্ত ভিডিও</h2>

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {dummyVideos.map((video, idx) => (
            <div
              key={video.id}
              className="embla__slide"
              onClick={() => handleVideoClick(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" ? handleVideoClick(idx) : null)}
            >
              <div className="video-card">
                <div className="thumbnail-container">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <span className="video-duration">{video.duration}</span>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  {/* <span className="video-views">{video.views} views</span> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Video]}
        // Useful video defaults:
        render={{
          buttonPrev: undefined,
          buttonNext: undefined,
        }}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
};

export default VideoGallerySlider;
