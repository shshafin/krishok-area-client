import GallerySection from "../components/GallerySection";

const post = {
  id: 106,
  img: "https://picsum.photos/1800/800?random=106",
  title: "Sunlight Through the Canopy",
  description:
    "A calm forest path captured after sunrise. Replace this text with the real post copy from your CMS.",
  datetime: "2024-10-18 07:05:54",
  timeText: "12 months ago",
  timeTitle: "07:05 AM (October 18th, 2024)",
};

const suggest = [
  {
    id: 105,
    type: "image",
    img: "https://picsum.photos/200/400?random=105",
    title: "Morning Mist Over the Hills",
    datetime: "2024-10-18 07:06:55",
    timeText: "12 months ago",
    timeTitle: "07:06 AM (October 18th, 2024)",
  },
  {
    id: 104,
    type: "image",
    img: "https://picsum.photos/200/400?random=104",
    title: "City Reflections at Night",
    datetime: "2024-10-04 09:43:23",
    timeText: "about a year ago",
    timeTitle: "09:43 AM (October 4th, 2024)",
  },
];

export default function GalleryPost() {
  return <GallerySection post={post} suggest={suggest} />;
}


