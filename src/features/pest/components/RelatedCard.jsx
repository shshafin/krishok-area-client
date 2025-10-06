import React, { memo, useMemo } from "react";
import styles from "../styles/pestDetail.module.css";

function toPostHref(url) {
  return url ? `/pest/post=${encodeURIComponent(url)}` : "#";
}

const RelatedCard = memo(function RelatedCard({ img, title, subtitle, url }) {
  const href = useMemo(() => toPostHref(url), [url]);
  return (
    <a href={href} className={styles.card}>
      <div className={`${styles.square}`}>
        <img loading="lazy" src={img} alt={title || "related"} className={styles.thumb} />
      </div>
      <div className={styles.cardPad}>
        <h3 className={styles.titleSm}>{title}</h3>
        {subtitle ? <p className={`${styles.muted} ${styles.mtXs}`}>{subtitle}</p> : null}
      </div>
    </a>
  );
});

export default RelatedCard;