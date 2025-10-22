import InsectsSection from "../components/InsectsSection";

const buildImageUrl = (seed) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/480/320`;

const sectionsData = [
  {
    title: "ক্ষতিকর পোকামাকড়",
    items: [
      { id: 21, name: "পটল", image: buildImageUrl("potol") },
      { id: 23, name: "ধান", image: buildImageUrl("dhan") },
      { id: 24, name: "মরিচ", image: buildImageUrl("morich") },
    ],
  },
  {
    title: "রোগবালাই",
    items: [
      { id: 22, name: "পেপে", image: buildImageUrl("pepe") },
      { id: 25, name: "টমেটো", image: buildImageUrl("tomato") },
    ],
  },
];

export default function TableViewPage() {
  return (
    <div className="guidelines-page">
      <header className="guidelines-hero">
        <div className="nir-body">
          <h4 style={{ color: "rgb(211, 211, 211)" }}>
            ক্ষতিকর পোকামাকড় ও রোগবালাই থেকে
          </h4>
          <h1 className="boboo">ফসল সুরক্ষার নির্দেশিকা</h1>
        </div>
      </header>

      <section className="guidelines-content">
        <InsectsSection sections={sectionsData} />
      </section>
    </div>
  );
}
