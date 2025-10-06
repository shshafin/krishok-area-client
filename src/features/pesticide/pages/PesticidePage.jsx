// e.g., in a route
import Pesticide from "../components/Pesticide";

const companies = [
  { title: "এ সি আই ক্রপ কেয়ার", name: "ACI Crop Care", rating: 4.5, location: "ঢাকা, বাংলাদেশ",url: 'aci-crop-ltd' },
  { title: "অটো ক্রপ কেয়ার লিঃ", name: "Auto Crop Care Ltd", rating: 4.2, location: "চট্টগ্রাম, বাংলাদেশ",url: 'auto-crop-ltd' },
  // ...more items
];

export default function PesticidePage(){
  return <Pesticide items={companies} />;
}