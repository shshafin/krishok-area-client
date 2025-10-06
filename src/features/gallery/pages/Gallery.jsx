import Filter from "@/features/gallery/components/Filter";
import Card from "@/features/gallery/components/Card.jsx";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

import "@/assets/styles/Gallery.css";
import "@/assets/styles/LightBoxCustom.css";
import { useState, useMemo, useCallback } from "react";

export default function Gallery() {

  // Internal static sample cards
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
    {
        id: 105,
        type: "video",
        video:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        poster: randImg(),
        title: "Cliffside Waves (4K sample)",
        username: "sea_journal",
        date: "2024-08-18T14:00:00",
        likes: 142,
        comments: 16,
        shares: 6,
    },
    {
        id: 106,
        type: "image",
        img: randImg(),
        title: "Misty Morning Trail",
        username: "trail_tales",
        date: "2025-05-09T07:05:00",
        likes: 33,
        comments: 2,
        shares: 0,
    },
    {
        id: 107,
        type: "image",
        img: randImg(),
        title: "Vintage Harbor",
        username: "old_map",
        date: "2023-12-31T18:20:00",
        likes: 77,
        comments: 10,
        shares: 4,
    },
    {
        id: 108,
        type: "image",
        img: randImg(),
        title: "Starlit Dune",
        username: "night_sketch",
        date: "2025-03-14T02:50:00",
        likes: 210,
        comments: 40,
        shares: 18,
    },
    {
        id: 109,
        type: "video",
        video:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        poster: randImg(),
        title: "Timelapse Clouds",
        username: "skywatcher",
        date: "2024-06-27T11:00:00",
        likes: 55,
        comments: 7,
        shares: 2,
    },
    {
        id: 110,
        type: "image",
        img: randImg(),
        title: "Glass Bridge Reflection",
        username: "mirror_city",
        date: "2025-09-08T16:40:00",
        likes: 129,
        comments: 12,
        shares: 5,
    },
];

  const [filterType, setFilterType] = useState("all");

  const filtered = useMemo(() => {
    if (filterType === "all") return cards;
    if (filterType === "images") return cards.filter((c) => c.type === "image");
    if (filterType === "videos") return cards.filter((c) => c.type === "video");
    return cards;
  }, [cards, filterType]);

  // build slides from filtered items (Lightbox expects an array of slides)
  const slides = useMemo(() => {
    return filtered.map((it) => {
      if (it.type === "image") {
        return { type: "image", src: it.img, meta: it };
      }

      if (it.type === "video") {
        return {
          type: "video",
          src: it.video,
          sources: [{ src: it.video, type: "video/mp4" }],
          poster: it.poster || it.img || undefined,
          meta: it,
        };
      }

      return { type: "image", src: it.img || "", meta: it };
    });
  }, [filtered]);

  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openLightbox = useCallback((index) => {
    setStartIndex(index);
    setOpen(true);
  }, []);

  const counts = useMemo(
    () => ({
      all: cards.length,
      images: cards.filter((c) => c.type === "image").length,
      videos: cards.filter((c) => c.type === "video").length,
    }),
    [cards]
  );

  return (
    <>
      <Filter counts={counts} onFilterChange={setFilterType} />

      <div className="cards">
        {filtered.map((it, idx) => (
          <Card key={it.id || idx} {...it} onOpen={() => openLightbox(idx)} />
        ))}
      </div>

      <Lightbox
        plugins={[Video]}
        open={open}
        index={startIndex}
        close={() => setOpen(false)}
        slides={slides}
      />
    </>
  );
}