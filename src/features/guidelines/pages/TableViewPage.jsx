import InsectsSection from "../components/InsectsSection";

const sectionsData = [
  {
    title: "ক্ষতিকর পোকামাকড়",
    items: [
      { id: 21, name: "পটল" },
      { id: 23, name: "ধান" },
    ],
  },
  {
    title: "রোগবালাই",
    items: [{ id: 22, name: "পেপে pepe" }],
  },
];

export default function TableViewPage() {
  return (
    <>
      <div class="nir-body">
        <h4 class="nir-color">ক্ষতিকর পোকামাকড় ও রোগবালাই থেকে</h4>
        <h1 class="boboo">ফসল সুরক্ষার নির্দেশিকা</h1>
      </div>

      <InsectsSection sections={sectionsData} />
    </>
  );
}
