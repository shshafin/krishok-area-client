// /seed/ShowBizBazar.jsx
import { useMemo } from "react";
import BizBazarPage from "./BizBazarPage";

// Filters
const CATEGORIES = [
  "সব",
  "কৃষি খামার",
  "মৎস্য ব্যবসা",
  "পোল্ট্রি",
  "মসলা ব্যবসা",
  "চাল ব্যবসা",
  "ফল ব্যবসা",
  "দুগ্ধ ব্যবসা",
  "কৃষি যন্ত্রপাতি",
];

const CITIES = ["সব", "ঢাকা", "চট্টগ্রাম", "গাজীপুর", "কুমিল্লা", "বরিশাল", "পাবনা", "রংপুর", "সাভার"];

// Base businesses for variety (taken from your markup)
const BASE_BIZ = [
  {
    bnName: "গ্রিন ভ্যালি এগ্রো ফার্ম",
    enName: "Green Valley Agro Farm",
    category: "কৃষি খামার",
    tagline: "জৈব সবজি চাষ",
    description: "জৈব পদ্ধতিতে সবজি চাষ ও বিক্রয়। তাজা ও নিরাপদ সবজি সরবরাহ।",
    products: ["টমেটো", "বেগুন", "শসা", "লাউ", "ধনিয়া"],
    address: "সাভার, ঢাকা",
    city: "ঢাকা",
    phone: "+880-1711-123456",
    email: "greenvalley@gmail.com",
    owner: "মোঃ রহিম উদ্দিন",
    founded: 2018,
    verified: true,
    rating: 4.5,
    reviews: 89,
  },
  {
    bnName: "ঢাকা মাছের বাজার",
    enName: "Dhaka Fish Market",
    category: "মৎস্য ব্যবসা",
    tagline: "পাইকারি মাছ বিক্রয়",
    description: "তাজা মাছের পাইকারি ও খুচরা বিক্রয়। দেশি ও বিদেশি মাছের সরবরাহ।",
    products: ["রুই", "কাতলা", "পাঙ্গাস", "তেলাপিয়া", "ইলিশ"],
    address: "কাওরান বাজার, ঢাকা",
    city: "ঢাকা",
    phone: "+880-1812-234567",
    email: "dhakafish@yahoo.com",
    owner: "আব্দুল করিম",
    founded: 2015,
    verified: true,
    rating: 4.2,
    reviews: 156,
  },
  {
    bnName: "আধুনিক হাঁস-মুরগির খামার",
    enName: "Modern Poultry Farm",
    category: "পোল্ট্রি",
    tagline: "ডিম ও মুরগি উৎপাদন",
    description: "আধুনিক পদ্ধতিতে হাঁস-মুরগি পালন। তাজা ডিম ও মাংস সরবরাহ।",
    products: ["ব্রয়লার মুরগি", "দেশি মুরগি", "ডিম", "হাঁসের মাংস"],
    address: "গাজীপুর",
    city: "গাজীপুর",
    phone: "+880-1913-345678",
    email: "modernpoultry@gmail.com",
    owner: "সালমা খাতুন",
    founded: 2016,
    verified: true,
    rating: 4.7,
    reviews: 203,
  },
  {
    bnName: "মসলার বাগান",
    enName: "Spice Garden",
    category: "মসলা ব্যবসা",
    tagline: "মসলা উৎপাদন ও বিক্রয়",
    description: "খাঁটি ও উন্নতমানের মসলা উৎপাদন। পাইকারি ও খুচরা বিক্রয়।",
    products: ["হলুদ", "ধনিয়া", "জিরা", "মরিচের গুঁড়া"],
    address: "কুমিল্লা",
    city: "কুমিল্লা",
    phone: "+880-1714-456789",
    email: "spicegarden@hotmail.com",
    owner: "নাসির আহমেদ",
    founded: 2019,
    verified: false,
    rating: 4.3,
    reviews: 78,
  },
  {
    bnName: "গোল্ডেন রাইস মিল",
    enName: "Golden Rice Mill",
    category: "চাল ব্যবসা",
    tagline: "চাল প্রক্রিয়াজাতকরণ",
    description: "উন্নতমানের চাল প্রক্রিয়াজাতকরণ ও বিতরণ। বিভিন্ন জাতের চাল।",
    products: ["বাসমতি চাল", "মিনিকেট", "নাজিরশাইল", "পোলাও চাল"],
    address: "বরিশাল",
    city: "বরিশাল",
    phone: "+880-1815-567890",
    email: "goldenrice@gmail.com",
    owner: "মোঃ জামাল হোসেন",
    founded: 2012,
    verified: true,
    rating: 4.6,
    reviews: 134,
  },
  {
    bnName: "তাজা ফলের কর্নার",
    enName: "Fresh Fruit Corner",
    category: "ফল ব্যবসা",
    tagline: "ফল বিক্রয়",
    description: "দেশি ও বিদেশি তাজা ফলের সরবরাহ। সারা বছর বিভিন্ন ফল।",
    products: ["আম", "কাঁঠাল", "লিচু", "আপেল"],
    address: "চট্টগ্রাম",
    city: "চট্টগ্রাম",
    phone: "+880-1916-678901",
    email: "freshfruit@yahoo.com",
    owner: "রাশেদা বেগম",
    founded: 2017,
    verified: true,
    rating: 4.4,
    reviews: 92,
  },
  {
    bnName: "ডেইরি ফ্রেশ",
    enName: "Dairy Fresh",
    category: "দুগ্ধ ব্যবসা",
    tagline: "দুধ ও দুগ্ধজাত পণ্য",
    description: "খাঁটি গরুর দুধ ও দুগ্ধজাত পণ্য। দৈনিক তাজা দুধ সরবরাহ।",
    products: ["তাজা দুধ", "দই", "ছানা", "মাখন", "ঘি"],
    address: "পাবনা",
    city: "পাবনা",
    phone: "+880-1717-789012",
    email: "dairyfresh@gmail.com",
    owner: "আলী হাসান",
    founded: 2014,
    verified: true,
    rating: 4.8,
    reviews: 167,
  },
  {
    bnName: "কৃষি যন্ত্রপাতি কেন্দ্র",
    enName: "Agro Tools Center",
    category: "কৃষি যন্ত্রপাতি",
    tagline: "কৃষি সরঞ্জাম বিক্রয়",
    description: "আধুনিক কৃষি যন্ত্রপাতি ও সরঞ্জাম। বিক্রয় ও মেরামত সেবা।",
    products: ["ট্রাক্টর", "পাওয়ার টিলার", "থ্রেশার", "স্প্রে মেশিন"],
    address: "রংপুর",
    city: "রংপুর",
    phone: "+880-1818-890123",
    email: "agrotools@hotmail.com",
    owner: "মোঃ শফিক উল্লাহ",
    founded: 2020,
    verified: false,
    rating: 4.1,
    reviews: 45,
  },
];

// helpers
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randPick = (arr) => arr[rand(0, arr.length - 1)];
const roundHalf = (n) => Math.round(n * 2) / 2;

function makeBizDummyData(count = 24) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const base = BASE_BIZ[i % BASE_BIZ.length];

    // Slightly vary stats so cards don’t look identical
    const ratingJitter = (rand(-2, 3)) / 10; // -0.2..+0.3
    const rating = Math.min(5, Math.max(3.8, roundHalf(base.rating + ratingJitter)));
    const reviews = base.reviews + rand(-10, 40);
    const verified = Math.random() < (base.verified ? 0.85 : 0.4);

    // Sometimes trim to show "+N আরও" chips in UI
    const maxProd = rand(3, base.products.length);
    const products = base.products.slice(0, maxProd);

    out.push({
      id: `${base.enName.replace(/\s+/g, "-")}-${i}`,
      bnName: base.bnName,
      enName: base.enName,
      category: base.category,
      tagline: base.tagline,
      description: base.description,
      products,
      address: base.address,
      city: base.city,
      phone: base.phone,
      email: base.email,
      owner: base.owner,
      founded: base.founded,
      verified,
      rating,
      reviews,
    });
  }
  return out;
}

export default function ShowBizBazar() {
  const items = useMemo(() => makeBizDummyData(24), []);
  return (
    <BizBazarPage
      title="বিজ বাজার"
      subtitle="কৃষি ব্যবসায়িক তালিকা"
      items={items}
      categories={CATEGORIES}
      cities={CITIES}
      // You can also pass initial UI prefs if your page supports them:
      // initialView="grid"  // or "list"
      // onlyVerified={false}
      // initialQuery=""
    />
  );
}