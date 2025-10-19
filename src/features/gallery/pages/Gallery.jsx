import Card from "@/features/gallery/components/Card.jsx";
import "@/assets/styles/oldUI.css";

export default function Gallery() {
  const randImg = () =>
    `https://picsum.photos/${400 + Math.floor(Math.random() * 1600)}/${300 +
      Math.floor(Math.random() * 1300)}?random=${Math.floor(
      Math.random() * 100000
    )}`;

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

  return (
    <>
      {/* Top Info Section */}
      <div className="photo-body-box">
        <h4>Discover inspiring photos shared by the community</h4>

        <div className="companyprosearchbox">
          <div className="allcompanyprosearchbox text-end rounded pb-3 paddingbox mt-5">
            <div id="onecompanyproduct" className="text-start">
              <p title="Search photos" className="text-center text-white">
                Search photos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Cards */}
      <div className="cards" style={{ marginTop: "1rem" }}>
        {imageCards.map((it, idx) => (
          <Card key={it.id || idx} {...it} path="post" />
        ))}
      </div>
    </>
  );
}


