import { useCallback, useMemo, useState } from "react";
import Card from "@/features/gallery/components/Card.jsx";
import "@/assets/styles/oldUI.css";

export default function Gallery() {
  const [query, setQuery] = useState("");

  const randImg = useCallback(
    () =>
      `https://picsum.photos/${400 + Math.floor(Math.random() * 1600)}/${300 +
        Math.floor(Math.random() * 1300)}?random=${Math.floor(
        Math.random() * 100000
      )}`,
    []
  );

  const imageCards = useMemo(
    () => [
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
    ],
    [randImg]
  );

  const filteredCards = useMemo(() => {
    if (!query.trim()) return imageCards;
    const q = query.toLowerCase();
    return imageCards.filter(({ title, username }) =>
      [title, username].filter(Boolean).some((value) =>
        String(value).toLowerCase().includes(q)
      )
    );
  }, [imageCards, query]);

  return (
    <>
      {/* Top Info Section */}
      <div className="photo-body-box">
        <h4>কমিউনিটির শেয়ার করা অনুপ্রেরণাদায়ক ছবি আবিষ্কার করুন</h4>

        {/* <div className="companyprosearchbox">
          <div className="allcompanyprosearchbox text-end rounded pb-3 paddingbox mt-5">
            <div id="onecompanyproduct" className="text-start">
              <p title="ছবি অনুসন্ধান করুন" className="text-center text-white mb-3">
                ছবি অনুসন্ধান করুন
              </p>
              <input
                id="gallery-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ছবি বা ব্যবহারকারীর নাম লিখুন"
                className="form-control"
                aria-label="ছবির গ্যালারি অনুসন্ধান করুন"
              />
            </div>
          </div>
        </div> */}
      </div>

      {/* Gallery Cards */}
      <div className="cards" style={{ marginTop: "1rem" }}>
        {filteredCards.map((it, idx) => (
          <Card key={it.id || idx} {...it} path="post" />
        ))}
        {filteredCards.length === 0 && (
          <div className="text-center text-white w-100 py-4">
            কোনও ছবি খুঁজে পাওয়া যায়নি
          </div>
        )}
      </div>
    </>
  );
}


