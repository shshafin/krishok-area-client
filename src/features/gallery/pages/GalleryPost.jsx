import GallerySection from "../components/GallerySection";

const post = {
  id: 106,
  img: "https://picsum.photos/1800/800",
  title:
    "ডিম ফুটে সাদা রঙের অতিক্ষুদ্র বাচ্চা বের হয়ে পাতার খোল থেকে রস খেয়ে বড় হতে থাকে।",
  description:
    "ডিম ফুটে সাদা রঙের অতিক্ষুদ্র বাচ্চা বের হয়ে পাতার খোল থেকে রস খেয়ে বড় হতে থাকে।",
  datetime: "2024-10-18 07:05:54",
  timeText: "12 months ago",
  timeTitle: "07:05 AM (October 18th, 2024)",
  // type: "image", // optional (default render is image when no type)
};

const suggest = [
  {
    id: 105,
    img: "https://picsum.photos/200/400",
    title: "ডিম ফুটে সাদা রঙের অতিক্ষুদ্র বাচ্চা...",
    datetime: "2024-10-18 07:06:55",
    timeText: "12 months ago",
    timeTitle: "07:06 AM (October 18th, 2024)",
    type: "image",
  },
  {
    id: 104,
    type: "video",
    video:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://picsum.photos/320/180",
    title: "New video",
    datetime: "2024-10-04 09:43:23",
    timeText: "about a year ago",
    timeTitle: "09:43 AM (October 4th, 2024)",
  },
];

export default function GalleryPost() {
  return <GallerySection post={post} suggest={suggest} />;
}