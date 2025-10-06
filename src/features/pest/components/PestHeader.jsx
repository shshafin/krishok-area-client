import styles from "../styles/pestDetail.module.css";

/** Header with back, title and lead block */
export default function PestHeader({ cropBn, pestBn, pestEn, cover, headline, summary, onBack }) {
  const headerTitle =
    [cropBn, pestBn].filter(Boolean).join(" - ");

  const handleBack = onBack || (() => window.history.back());

  return (
    <header className={styles.headerBar}>
      <div className={styles.headerRow}>
        <button className={styles.backBtn} onClick={handleBack} aria-label="ফিরে যান">
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.backIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>
          </svg>
          <span className={styles.backLabel}>⇦ নির্দেশীকায় ফিরে যান</span>
        </button>

        <div className={styles.titles}>
          <h1 className={styles.h1}>{headerTitle}</h1>
          <div className={styles.sub}>{pestEn}</div>
        </div>
      </div>

      <div className={styles.leadWrap}>
        <div className={styles.cover}>
          <img loading="lazy" src={cover?.src} alt={cover?.alt || pestBn || "cover"} className={styles.coverImg} />
        </div>
        <div className={styles.leadText}>
          <h2 className={styles.leadHeadline}>{headline}</h2>
          <p className={styles.leadSummary}>{summary}</p>
        </div>
      </div>
    </header>
  );
}