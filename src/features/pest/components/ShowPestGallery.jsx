import React from "react";
import PestGalleryPage from "../components/PestGalleryPage";

export default function ShowPestGallery() {
  const cards = [
    { img: "https://picsum.photos/200", caption: "বীজ থেকে চারা তৈরি করুন", url: "https://guide.example/seedling" },
    { img: "https://picsum.photos/300",   caption: "সকালে সেচ দিন",             url: "https://guide.example/watering" },
    { img: "https://picsum.photos/400",   caption: "স্টেকিং করুন",               url: "https://guide.example/staking" },
  ];

  return (
    <PestGalleryPage
      cropBn="টমেটো"
      cropEn="Tomato"
      blurb="টমেটো একটি জনপ্রিয় সবজি। এটি রান্নায় ব্যবহার করা হয় এবং পুষ্টিকর।"
      sectionTitle="ক্ষতিকর পোকামাকড়ের ছবি"
      cards={cards} // remove to see fallback
    />
  );
}