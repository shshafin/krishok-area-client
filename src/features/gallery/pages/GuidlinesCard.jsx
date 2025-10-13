import {useLocation, NavLink } from "react-router-dom";
import "@/assets/styles/oldUI.css";
import Card from "@/features/gallery/components/Card.jsx";

export default function Gallery() {
  const location = useLocation();

  // Get the full path, decode Bengali characters, and split by "/"
  const url = decodeURIComponent(location.pathname);
  const parts = url.split("/").filter(Boolean); // remove empty parts

  // Get the last part (e.g., "পটল") and split by space to keep only first word
  const lastSegment = parts[parts.length - 1] || "";
  const firstWord = lastSegment.split(" ")[0]; //


  const randImg = () =>
    `https://picsum.photos/${400 + Math.floor(Math.random() * 1600)}/${
      300 + Math.floor(Math.random() * 1300)
    }?random=${Math.floor(Math.random() * 100000)}`;

  const cards = [
    {
      id: 201,
      type: "image",
      img: randImg(),
      title: "সিনজেন্টা কোম্পানির ছত্রাকনাশক — রিডোমিল গোল্ড",
      username: "syngenta_bd",
      date: "2025-03-12T10:00:00",
      likes: 312,
      comments: 19,
      shares: 14,
    },
    {
      id: 202,
      type: "image",
      img: randImg(),
      title: "বায়ার ক্রপ সায়েন্সের নাতিভো ছত্রাকনাশক",
      username: "bayer_crops",
      date: "2025-04-08T14:25:00",
      likes: 421,
      comments: 28,
      shares: 17,
    },
    {
      id: 203,
      type: "image",
      img: randImg(),
      title: "এগ্রিসায়েন্স এর ট্রাইড্যাক্স — দানার সুরক্ষায় বিশেষ ছত্রাকনাশক",
      username: "agriscience_bd",
      date: "2025-06-19T09:15:00",
      likes: 178,
      comments: 12,
      shares: 7,
    },
  ];

  return (
    <>
      <div class="header-back">
        <div class="mainback">
          <div class="backlink">
            <NavLink to="/guidelines">
              <span>⇦</span>
            </NavLink>
          </div>
          <div class="crop-header">
            <h4 class=""> {firstWord} </h4>
          </div>
        </div>

        <div className="companyprosearchbox">
          <div className="allcompanyprosearchbox text-end rounded pb-3 paddingbox mt-5">
            <div id="onecompanyproduct" className="text-start">
              <p
                title="পণ্য খোজ করুন"
                className="text-center text-white font-semibold"
              >
                পণ্য খোজ করুন
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 📸 Gallery Cards */}
      <div className="cards" style={{ marginTop: "1rem" }}>
        {cards.map((it, idx) => (
          <Card key={it.id || idx} {...it} path="blog" />
        ))}
      </div>
    </>
  );
}
