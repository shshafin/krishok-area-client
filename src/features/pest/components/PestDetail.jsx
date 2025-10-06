import styles from "../styles/pestDetail.module.css";
import PestHeader from "./PestHeader";
import PestTable from "./PestTable";
import RelatedCard from "./RelatedCard";

/**
 * Props (all passed in):
 * - cropBn, pestBn, pestEn
 * - cover: { src, alt }
 * - headline, summary
 * - symptoms: string[]
 * - actions: string[]
 * - related: { img, title, subtitle, url }[]
 * - onBack?: () => void
 */
export default function PestDetail(props) {
  const { related = [] } = props;

  return (
    <div className={styles.page}>
      <PestHeader {...props} />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.gridTwo}>
            {/* Big image + summary */}
            <div className={`${styles.card} ${styles.cardPad}`}>
              <div className={`${styles.square} ${styles.squareMb}`}>
                <img loading="lazy" src={props.cover?.src} alt={props.cover?.alt || props.pestBn || "image"} className={styles.thumb} />
              </div>
              <h3 className={`${styles.titleSm} ${styles.center}`}>{props.pestBn}</h3>
              <p className={`${styles.muted} ${styles.center} ${styles.mtXs}`}>{props.summary}</p>
            </div>

            {/* Symptoms / Actions table */}
            <PestTable symptoms={props.symptoms} actions={props.actions} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
            {props.cropBn} এর ক্ষতিকর পোকামাকড় সম্পর্কিত অন্যান্য রোগসমূহ
          </h2>

          <div className={styles.relatedGrid}>
            {Array.isArray(related) &&
              related.map((r, idx) => (
                <RelatedCard key={`${r.title || "rel"}-${idx}`} img={r.img} title={r.title} subtitle={r.subtitle} url={r.url} />
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}