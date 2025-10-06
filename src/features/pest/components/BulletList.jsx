import React, { memo } from "react";
import styles from "../styles/pestDetail.module.css";

const BulletList = memo(function BulletList({ items, color = "red" }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const dotClass = color === "green" ? styles.dotGreen : styles.dotRed;

  return (
    <ul className={styles.bulletList}>
      {items.map((t, i) => (
        <li key={i} className={styles.bulletItem}>
          <span className={`${styles.dot} ${dotClass}`} aria-hidden>•</span>
          <span className={styles.bulletText}>{t}</span>
        </li>
      ))}
    </ul>
  );
});

export default BulletList;