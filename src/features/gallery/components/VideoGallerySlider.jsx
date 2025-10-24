import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";

const dummyVideos = [
  {
    id: 1,
    title: "Organic Farming Techniques",
    thumbnail: "https://i.imgur.com/example1.jpg",
    views: "1.2k",
    duration: "5:30",
  },
  {
    id: 2,
    title: "Sustainable Agriculture",
    thumbnail: "https://i.imgur.com/example2.jpg",
    views: "2.4k",
    duration: "4:15",
  },
  {
    id: 3,
    title: "Modern Farming Methods",
    thumbnail: "https://i.imgur.com/example3.jpg",
    views: "3.1k",
    duration: "6:45",
  },
  {
    id: 4,
    title: "Agricultural Innovation",
    thumbnail: "https://i.imgur.com/example4.jpg",
    views: "1.8k",
    duration: "3:20",
  },
  {
    id: 5,
    title: "Smart Farming Solutions",
    thumbnail: "https://i.imgur.com/example5.jpg",
    views: "2.7k",
    duration: "7:10",
  }
];

const VideoGallerySlider = () => {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps"
  }
  );

  useEffect(() => {
    if (emblaApi) {
      // Additional initialization if needed
    }
  }, [emblaApi]);

  const handleVideoClick = (title) => {
    // Convert title to URL-friendly format
    const urlTitle = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/post/${urlTitle}`);
  };

  return (
    <div className="video-gallery-container">
      <h2 className="gallery-title">বৈশিষ্ট্যযুক্ত ভিডিও</h2>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {dummyVideos.map((video) => (
            <div 
              key={video.id} 
              className="embla__slide"
              onClick={() => handleVideoClick(video.title)}
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
    </div>
  );
};

export default VideoGallerySlider;