// /seed/ShowPesticideCompany.jsx
import { useMemo } from "react";
import PesticideCompanyPage from "./PestcideCompany";

const PAGE_TITLE =
  "বাংলাদেশে কীটনাশক আমদানী, বাজারজাতকারী ও পরিবেশক কোম্পানীর তালিকাসমূহ";
const PAGE_SUBTITLE = "কৃষি কীটনাশক পণ্য এবং কোম্পানির বিস্তারিত তথ্য";

const COMPANY = "Syngenta Bangladesh";

const BASE_PRODUCTS = [
  {
    crops: ["ধান", "গম", "আলু", "টমেটো"],
    pests: ["ব্লাস্ট রোগ", "শিথ ব্লাইট", "পাউডারি মিলডিউ"],
    formula: "১ মিলি/লিটার পানি",
    method: "স্প্রে",
    bnName: "টিল্ট ২৫০ ইসি",
    enName: "Tilt 250 EC",
    safety: "সতর্কতা", // সতর্কতা | বিপদ | নিরাপদ
  },
  {
    crops: ["ধান", "গম", "ভুট্টা"],
    pests: ["ধানের ব্লাইট", "পাতার দাগ রোগ"],
    formula: "০.৫-১ মিলি/লিটার পানি",
    method: "স্প্রে",
    bnName: "স্কোর ২৫০ ইসি",
    enName: "Score 250 EC",
    safety: "সতর্কতা",
  },
  {
    crops: ["টমেটো", "বেগুন", "মরিচ"],
    pests: ["লিফ মাইনর", "সাদা মাছি"],
    formula: "১ গ্রাম/লিটার পানি",
    method: "স্প্রে",
    bnName: "অ্যাক্টারা ২৫ ডব্লিউজি",
    enName: "Actara 25 WG",
    safety: "নিরাপদ",
  },
  {
    crops: ["আলু", "টমেটো"],
    pests: ["লেট ব্লাইট"],
    formula: "২ গ্রাম/লিটার পানি",
    method: "স্প্রে",
    bnName: "রিডোমিল গোল্ড এমজেড",
    enName: "Ridomil Gold MZ",
    safety: "বিপদ",
  },
];

function makeProducts(count = 12) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const b = BASE_PRODUCTS[i % BASE_PRODUCTS.length];
    out.push({
      id: `${b.enName.replace(/\s+/g, "-")}-${i}`,
      ...b,
    });
  }
  return out;
}

export default function ShowPesticideCompany() {
  const items = useMemo(() => makeProducts(10), []);
  return (
    <PesticideCompanyPage
      pageTitle={PAGE_TITLE}
      pageSubtitle={PAGE_SUBTITLE}
      companyName={COMPANY}
      items={items}
    />
  );
}