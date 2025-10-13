import RelatedBlogPosts from "../components/RelatedBlogPosts";
import BlogPost from "../components/BlogPost";
import '@/assets/styles/oldUI.css';

const serverItems = [
  {
    id: 101,
    title: "পেপের মোজাইক ভাইরাস — লক্ষণ ও প্রতিকার",
    image:
      "https://picsum.photos/seed/papaya1/400/300",
  },
  {
    id: 102,
    title: "পেপে পাতায় দাগ — ছত্রাকজনিত রোগের নিয়ন্ত্রণ",
    image:
      "https://picsum.photos/seed/papaya2/400/300",
  },
  {
    id: 103,
    title: "ফল পচন রোধে সময়মতো ছত্রাকনাশক প্রয়োগের নির্দেশনা",
    image:
      "https://picsum.photos/seed/papaya3/400/300",
  },
  {
    id: 104,
    title: "পেপের গাছের পাতা কুঁকড়ে যাওয়া — প্রতিকার জানুন",
    image:
      "https://picsum.photos/seed/papaya4/400/300",
  },
  {
    id: 105,
    title: "গরম আবহাওয়ায় পেপে গাছের রোগ প্রতিরোধে করণীয়",
    image:
      "https://picsum.photos/seed/papaya5/400/300",
  },
  {
    id: 106,
    title: "পেপে ফলের দাগ রোগ — কৃষি বিশেষজ্ঞদের পরামর্শ",
    image:
      "https://picsum.photos/seed/papaya6/400/300",
  },
];

export default function BlogPage() {
  return (
    <>
      <BlogPost />

      <RelatedBlogPosts
        cropLabel="পেপে এর" // from API
        topicLabel="রোগবালাই" // from API
        items={serverItems} // from API: [{id, title, image}]
        basePath="blog" // route like /blog/:id
      />
    </>
  );
}