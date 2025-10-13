import { useLocation } from "react-router-dom";
import Card from "@/features/gallery/components/Card.jsx";
import "@/assets/styles/oldUI.css";

export default function Gallery() {
  const location = useLocation();
  const isVideoRoute = location.pathname.startsWith("/videos"); // 👈 URL-based switch

  const randImg = () =>
    `https://picsum.photos/${400 + Math.floor(Math.random() * 1600)}/${300 +
      Math.floor(Math.random() * 1300)}?random=${Math.floor(
      Math.random() * 100000
    )}`;

  // 🔹 Dummy image cards (for /gallery)
  const imageCards = [
    {
      id: 101,
      type: "image",
      img: randImg(),
      title: "Aurora Over the Fjord",
      username: "sora_explorer",
      date: "2025-02-11T21:30:00",
      likes: 248,
      comments: 34,
      shares: 12,
    },
    {
      id: 103,
      type: "image",
      img: randImg(),
      title: "Desert Bloom",
      username: "hana_desert",
      date: "2024-11-03T06:10:00",
      likes: 64,
      comments: 5,
      shares: 1,
    },
    {
      id: 104,
      type: "image",
      img: randImg(),
      title: "Neon Alley",
      username: "pixel_nomad",
      date: "2025-01-20T23:45:00",
      likes: 181,
      comments: 21,
      shares: 9,
    },
    {
      id: 105,
      type: "image",
      img: randImg(),
      title: "Wetlands at Dawn",
      username: "delta_birder",
      date: "2025-04-02T07:20:00",
      likes: 92,
      comments: 7,
      shares: 4,
    },
  ];

  // 🔹 Dummy video cards (for /videos)
  const videoCards = [
    {
      id: 201,
      type: "video",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      poster: randImg(),
      title: "Slow Motion City Ride",
      username: "urban_move",
      date: "2025-07-04T09:15:00",
      likes: 97,
      comments: 8,
      shares: 3,
    },
    {
      id: 202,
      type: "video",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: randImg(),
      title: "Rolling Hills Drone Pass",
      username: "sky_mapper",
      date: "2025-05-22T16:40:00",
      likes: 154,
      comments: 12,
      shares: 5,
    },
    {
      id: 203,
      type: "video",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      poster: randImg(),
      title: "Rain on Window — ASMR",
      username: "calm_tracks",
      date: "2025-03-09T22:11:00",
      likes: 211,
      comments: 19,
      shares: 8,
    },
    {
      id: 204,
      type: "video",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      poster: randImg(),
      title: "Street Jazz Night",
      username: "late_night",
      date: "2025-06-14T20:05:00",
      likes: 83,
      comments: 6,
      shares: 2,
    },
  ];

  // 👉 choose based on URL
  const cards = isVideoRoute ? videoCards : imageCards;

  return (
    <>
      {/* Top Info Section */}
      <div className="photo-body-box">
        <h4>বাংলার কৃষকদের পাশে আমরা থাকবো সবসময়</h4>

        <div className="companyprosearchbox">
          <div className="allcompanyprosearchbox text-end rounded pb-3 paddingbox mt-5">
            <div id="onecompanyproduct" className="text-start">
              <p title="পণ্য খোজ করুন" className="text-center text-white">
                পণ্য খোজ করুন
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Cards */}
      <div className="cards" style={{ marginTop: "1rem" }}>
        {cards.map((it, idx) => (
          <Card key={it.id || idx} {...it} path="post" />
        ))}
      </div>
    </>
  );
}