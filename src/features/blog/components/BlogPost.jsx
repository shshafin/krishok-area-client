// BlogPost.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function BlogPost() {
  const { id } = useParams();           // route is /blog/:id
  const category = "blog";               // force blog for this page
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");

  const dummyDB = useMemo(() => ({
    blog: [
      {
        id: 201,
        category: "ব্লগ",
        title: "মাটির স্বাস্থ্য ও রোগ প্রতিরোধ",
        image: "https://picsum.photos/seed/blog201/800/500",
        imageAlt: "soil health",
        symptoms: ["জৈব পদার্থের ঘাটতি", "অতিরিক্ত লবণাক্ততা"],
        actions: ["কম্পোস্ট প্রয়োগ", "মাল্চিং"],
      },
      {
        id: 202,
        category: "ব্লগ",
        title: "পেপে পাতার ঝলসানি: প্রতিরোধ",
        image: "https://picsum.photos/seed/blog202/800/500",
        imageAlt: "leaf scorch",
        symptoms: "পাতার প্রান্ত শুকিয়ে যাওয়া",
        actions: "দুপুরে সেচ এড়ানো, ছায়া ব্যবস্থা",
      },
      {
        id: 203,
        category: "ব্লগ",
        title: "পেপের মোজাইক: লক্ষণ ও করণীয়",
        image: "https://picsum.photos/seed/blog203/800/500",
        imageAlt: "papaya mosaic",
        symptoms: ["পাতায় মিশ্র রঙের ছোপ", "বৃদ্ধি কমে যায়"],
        actions: ["আক্রান্ত গাছ অপসারণ", "পরিষ্কার যন্ত্রপাতি ব্যবহার"],
      },
      // ...204–206 as needed
    ],
  }), []);

  useEffect(() => {
    setStatus("loading");
    const t = setTimeout(() => {
      const list = dummyDB[category] || [];
      const found = list.find(x => String(x.id) === String(id));
      setData(found || null);
      setStatus(found ? "done" : "error");
    }, 150);
    return () => clearTimeout(t);
  }, [id, category, dummyDB]);

  const renderText = (val, title) =>
    Array.isArray(val)
      ? <ul className="list-disc ms-6">{val.map((s,i)=><li key={i} title={title}>{s}</li>)}</ul>
      : <p title={title}>{val || "তথ্য নেই"}</p>;

  if (status !== "done") {
    return status === "error"
      ? (
        <div className="p-6 text-center">
          <h2 className="text-xl mb-2">ডেটা পাওয়া যায়নি</h2>
          <p className="text-gray-600">অনুগ্রহ করে লিংকটি যাচাই করুন বা অন্যটি চেষ্টা করুন।</p>
        </div>
      )
      : <div className="p-4">লোড হচ্ছে…</div>;
  }

  const { category: catLabel, title, image, imageAlt, symptoms, actions } = data;

  return (
    <div className="singlecropdetailsnew">
      <div className="cropnewimg">
        <div className="crop-details-boxsizenew">
          <div className="crop-details-image">
            <img src={image} alt={imageAlt || "crop image"} />
          </div>
        </div>
        <div className="crop-details-tablesize">
          <div className="crop-details-imgtitle">
            <span>{catLabel}</span>
            <h1>{title}</h1>
          </div>
        </div>
      </div>

      <div className="crop-details-textareanew">
        <div className="crop-details-h3">
          <h3>রোগের লক্ষণঃ</h3>
          {renderText(symptoms, "khotir dhoron")}

          <h3>করনীয়ঃ</h3>
          {renderText(actions, "koroniyo")}
        </div>
      </div>
    </div>
  );
}