import Card from "@/features/gallery/components/Card.jsx";
import "@/assets/styles/oldUI.css";

export default function Gallery() {
  const randImg = () =>
    `https://picsum.photos/${400 + Math.floor(Math.random() * 1600)}/${300 +
      Math.floor(Math.random() * 1300)}?random=${Math.floor(Math.random() * 100000)}`;

  const cards = [
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
      id: 102,
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
  ];

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
          <Card key={it.id || idx} {...it} />
        ))}
      </div>
    </>
  );
}