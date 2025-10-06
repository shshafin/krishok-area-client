import PestDetail from "../components/PestDetail";

export default function ShowPestDetail() {
  const data = {
    cropBn: "আলু",
    pestBn: "জাব পোকা",
    pestEn: "Jassid",
    cover: {
      src: "https://www.plantwise.org/sites/plantwise.org/files/thumbnails/image/jassid_adult.jpg",
      alt: "জাব পোকা",
    },
    headline: "ক্ষতিকর পোকামাকড়",
    summary: "জাব পোকা একটি ক্ষতিকর পোকা যা পাতার রস শুষে নেয়।",
    symptoms: ["পাতার রং হলুদ হয়ে যায়", "পাতা কুঁচকে যায়", "গাছের বৃদ্ধি ব্যাহত হয়"],
    actions: ["নিয়মিত পর্যবেক্ষণ করুন", "পোকা খেকো পাখি উৎসাহিত করুন", "কীটনাশক ব্যবহার করুন"],
    related: [
      {
        img: "https://www.plantwise.org/sites/plantwise.org/files/thumbnails/image/thrips_damage.jpg",
        title: "থ্রিপস",
        subtitle: "থ্রিপস পাতার ক্ষতি করে",
        url: "https://guide.example/thrips",
      },
      {
        img: "https://www.plantwise.org/sites/plantwise.org/files/thumbnails/image/whitefly_adult.jpg",
        title: "সাদা মাছি",
        subtitle: "সাদা মাছি পাতার নিচে থাকে",
        url: "https://guide.example/whitefly",
      },
    ],
    // Optional: onBack override; if omitted, window.history.back() will be used.
    // onBack: () => navigate(-1) // if you use react-router
  };

  return <PestDetail {...data} />;
}