import styles from "../styles/pest.module.css";
import ArrowLeftIcon from "@/assets/IconComponents/ArrowLeftIcon";
import ImageIcon from "@/assets/IconComponents/ImageIcon";

export default function PestGalleryPage({
  cropBn,
  cropEn,
  blurb,
  sectionTitle = "ক্ষতিকর পোকামাকড়ের ছবি",
  cards = [],
  onBack, // optional
}) {
  return (
    <div className={styles.page}>
      <div className={styles.headerBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeftIcon className={styles.backIcon} />
          ফিরে যান
        </button>

        <div className={styles.titles}>
          <h1 className={styles.h1}>{cropBn}</h1>
          <p className={styles.sub}>{cropEn}</p>
        </div>

        <p className={styles.blurb}>{blurb}</p>
      </div>

      <div className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <ImageIcon className={styles.sectionIcon} />
            {sectionTitle}
          </h2>

          <div className={styles.grid}>
            {cards.map((c, i) => (
              <a
                key={i}
                className={styles.card}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.square}>
                  <img
                    src={c.img}
                    alt={c.caption || "Pest image"}
                    className={styles.thumb}
                  />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.caption}>{c.caption}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}