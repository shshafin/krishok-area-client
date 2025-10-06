import { useMemo } from "react";
import BazarRatePage from "./BazarRatePage";

const CATEGORIES = ["সব", "ধান", "সবজি", "ফল", "মসলা", "ডাল", "তেল"];
const MARKETS = [
  "সব",
  "কাওরান বাজার",
  "শাহবাগ বাজার",
  "নিউ মার্কেট",
  "গুলশান বাজার",
  "ধানমন্ডি বাজার",
  "মিরপুর বাজার",
  "উত্তরা বাজার",
];

const BASE_ITEMS = [
  { category: "ধান",   bnName: "চাল",        enName: "Rice",          unit: "কেজি", price: 65, quality: "উত্তম" },
  { category: "সবজি",  bnName: "আলু",        enName: "Potato",        unit: "কেজি", price: 50, quality: "উত্তম" },
  { category: "সবজি",  bnName: "পেঁয়াজ",     enName: "Onion",         unit: "কেজি", price: 40, quality: "মাঝারি" },
  { category: "সবজি",  bnName: "টমেটো",      enName: "Tomato",        unit: "কেজি", price: 80, quality: "উত্তম" },
  { category: "সবজি",  bnName: "বেগুন",      enName: "Brinjal",       unit: "কেজি", price: 35, quality: "উত্তম" },
  { category: "ডাল",   bnName: "মসুর ডাল",   enName: "Lentil",        unit: "কেজি", price: 120,quality: "উত্তম" },
  { category: "ফল",    bnName: "কলা",        enName: "Banana",        unit: "ডজন", price: 60, quality: "উত্তম" },
  { category: "তেল",   bnName: "সরিষার তেল", enName: "Mustard Oil",   unit: "লিটার",price: 180,quality: "উত্তম" },
  { category: "সবজি",  bnName: "শসা",        enName: "Cucumber",      unit: "কেজি", price: 25, quality: "উত্তম" },
  { category: "সবজি",  bnName: "গাজর",       enName: "Carrot",        unit: "কেজি", price: 45, quality: "উত্তম" },
  { category: "সবজি",  bnName: "কাঁচা মরিচ", enName: "Green Chili",   unit: "কেজি", price: 100,quality: "উত্তম" },
  { category: "মসলা",  bnName: "রসুন",       enName: "Garlic",        unit: "কেজি", price: 200,quality: "উত্তম" },
  { category: "মসলা",  bnName: "আদা",        enName: "Ginger",        unit: "কেজি", price: 150,quality: "মাঝারি" },
  { category: "ফল",    bnName: "আপেল",       enName: "Apple",         unit: "কেজি", price: 220,quality: "উত্তম" },
  { category: "ফল",    bnName: "কমলা",       enName: "Orange",        unit: "কেজি", price: 120,quality: "উত্তম" },
];

function randomInt(min, max) {
  // inclusive range
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nonZeroDelta(min, max) {
  let d = 0;
  while (d === 0) d = randomInt(min, max); // ensure not zero
  return d;
}

function makeDummyData(count = 120) {
  const stamps = ["২ দিন আগে", "৩ দিন আগে", "৫ দিন আগে", "১ সপ্তাহ আগে"];
  const out = [];

  for (let i = 0; i < count; i++) {
    const base = BASE_ITEMS[i % BASE_ITEMS.length];

    // small drift around the base price for "current" price
    const drift = randomInt(-3, 3);
    const price = Math.max(5, base.price + drift);

    // independent previous movement (can be up or down)
    const delta = nonZeroDelta(-5, 5); // -5..+5 (never 0)
    const prevPrice = Math.max(5, price - delta);

    const change = price - prevPrice; // equals delta
    const trend = change < 0 ? "down" : "up";

    const market = MARKETS[(i % (MARKETS.length - 1)) + 1]; // skip "সব"

    out.push({
      id: `${base.enName}-${i}`,
      category: base.category,
      bnName: base.bnName,
      enName: base.enName,
      unit: base.unit,
      price,
      prevPrice,
      change,
      trend,
      quality: base.quality,
      market,
      updatedAgo: stamps[i % stamps.length],
    });
  }

  console.log(out)
  return out;
}

export default function ShowBazarRate() {
  const items = useMemo(() => makeDummyData(120), []);
  return (
    <BazarRatePage
      title="প্রতিদিনের বাজার মূল্যের তালিকা দেখুন"
      subtitle="কৃষি পণ্যের সর্বশেষ বাজার দর এবং মূল্য তুলনা"
      items={items}
      categories={CATEGORIES}
      markets={MARKETS}
    />
  );
}