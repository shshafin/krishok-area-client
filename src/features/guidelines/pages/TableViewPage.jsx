import HarmfulInsectsTable from "./HarmfulInsectsTable";
import DiseasesTable from "./DiseasesTable";
import styles from "../styles/TableViewPage.module.css";

function TableViewPage() {

    function randImgs(n, seedBase = 1) {
  return Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seedBase + i}/64`);
}

const harmfulInsectsRows = [
  {
    crop: "ধান",
    common: { items: ["জাব পোকা", "থ্রিপস", "বলওয়ার্ম"], extra: 4 },
    recommended: ["রিপকর্ড ১০ ইসি", "কনফিডোর ২০০ এসএএল"],
    images: randImgs(3, 11),
  },
  {
    crop: "গম",
    common: { items: ["জাব পোকা", "থ্রিপস", "বলওয়ার্ম"], extra: 1 },
    recommended: ["রিপকর্ড ১০ ইসি"],
    images: randImgs(3, 21),
  },
  {
    crop: "ভুট্টা",
    common: { items: ["জাব পোকা", "থ্রিপস", "বলওয়ার্ম"], extra: 4 },
    recommended: ["রিপকর্ড ১০ ইসি", "কনফিডোর ২০০ এসএএল"],
    images: randImgs(3, 31),
  },
  {
    crop: "তুলা",
    common: { items: ["জাব পোকা", "থ্রিপস", "বলওয়ার্ম"], extra: 3 },
    recommended: ["রিপকর্ড ১০ ইসি", "ফিউরি ১০ ইসি"],
    images: randImgs(3, 41),
  },
  {
    crop: "সবজি",
    common: { items: ["জাব পোকা", "থ্রিপস", "বলওয়ার্ম"], extra: 2 },
    recommended: ["রিপকর্ড ১০ ইসি", "কনফিডোর ২০০ এসএএল"],
    images: randImgs(3, 51),
  },
  {
    crop: "জুট",
    common: { items: ["কাটওয়ার্ম", "লিফ মাইনর"], extra: 1 },
    recommended: ["ট্রাইগার ২০ ইসি"],
    images: randImgs(3, 61),
  },
  {
    crop: "চাল কুমড়া",
    common: { items: ["ফলছিদ্রকারি", "এফিড"], extra: 2 },
    recommended: ["ফিউরি ১০ ইসি"],
    images: randImgs(3, 71),
  },
  {
    crop: "বেগুন",
    common: { items: ["ফল ও ডাল ছিদ্রকারি", "জাব পোকা"], extra: 1 },
    recommended: ["সাইপার ১০ ইসি", "ট্রাইগার ২০ ইসি"],
    images: randImgs(3, 81),
  },
];

const diseasesRows = [
  {
    crop: "ধান",
    diseases: { items: ["ব্লাস্ট রোগ", "শিথ ব্লাইট", "পাউডারি মিলডিউ"], extra: 3 },
    recommended: ["টিল্ট ২৫০ ইসি", "স্কোর ২৫০ ইসি"],
    images: randImgs(3, 101),
  },
  {
    crop: "গম",
    diseases: { items: ["ব্লাস্ট রোগ", "শিথ ব্লাইট", "পাউডারি মিলডিউ"], extra: 2 },
    recommended: ["টিল্ট ২৫০ ইসি", "স্কোর ২৫০ ইসি"],
    images: randImgs(3, 111),
  },
  {
    crop: "আলু",
    diseases: { items: ["আর্লি ব্লাইট", "লেট ব্লাইট", "স্ক্যাব"], extra: 0 },
    recommended: ["রিডোমিল গোল্ড", "ডাইথেন এম-৪৫"],
    images: randImgs(3, 121),
  },
  {
    crop: "টমেটো",
    diseases: { items: ["লেট ব্লাইট", "পাতা কার্ল", "লিফ স্পট"], extra: 0 },
    recommended: ["ম্যানকোজেব ৮০ ডব্লিউপি"],
    images: randImgs(3, 131),
  },
  {
    crop: "ভুট্টা",
    diseases: { items: ["পাতার দাগ রোগ", "রস্ট"], extra: 0 },
    recommended: ["স্কোর ২৫০ ইসি"],
    images: randImgs(3, 141),
  },
  {
    crop: "কপি",
    diseases: { items: ["ডাউনি মিলডিউ", "ব্ল্যাক রট"], extra: 1 },
    recommended: ["রিডোমিল গোল্ড"],
    images: randImgs(3, 151),
  },
  {
    crop: "শসা",
    diseases: { items: ["পাউডারি মিলডিউ", "অ্যান্থ্রাকনোজ"], extra: 0 },
    recommended: ["টপসিন এম"],
    images: randImgs(3, 161),
  },
  {
    crop: "পেঁয়াজ",
    diseases: { items: ["ডাউনি মিলডিউ", "পার্পল ব্লচ"], extra: 0 },
    recommended: ["ম্যানকোজেব ৮০ ডব্লিউপি"],
    images: randImgs(3, 171),
  },
];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <i className="pi pi-book" aria-hidden />
          <h1 className={styles.title}>
            তিকর পোকামাকড় ও রোগবালাই থেকে ফসল সুরক্ষার নির্দেশিকা
          </h1>
        </div>
        <p className={styles.subtitle}>
          ক্ষতিকর পোকামাকড় ও রোগবালাই থেকে ফসল রক্ষার জন্য সঠিক কীটনাশক ব্যবহারের নির্দেশিকা
        </p>
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>
              <i className="pi pi-bug" aria-hidden />
              <span>ক্ষতিকর পোকামাকড় (Harmful Insects)</span>
            </h3>
          </div>
          <div className={styles.cardBody}>
            <HarmfulInsectsTable rows={harmfulInsectsRows} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>
              <i className="pi pi-leaf" aria-hidden />
              <span>রোগবালাই (Diseases)</span>
            </h3>
          </div>
          <div className={styles.cardBody}>
            <DiseasesTable rows={diseasesRows} />
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>এই নির্দেশিকা পরিবর্তন সাপেক্ষ। সর্বশেষ আপডেট: ১/১০/২০২৫</p>
        <p>ফসল সুরক্ষায় সঠিক তথ্য ব্যবহার করুন!</p>
      </footer>
    </main>
  );
}

export default TableViewPage;