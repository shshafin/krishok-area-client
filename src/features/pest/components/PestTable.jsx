import React from "react";
import styles from "../styles/pestDetail.module.css";
import BulletList from "./BulletList";

/** Two-column table: রোগের লক্ষণঃ | করনীয়ঃ */
export default function PestTable({ symptoms, actions }) {
  return (
    <div className={`${styles.card} ${styles.cardPad}`}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.th} ${styles.thYellow}`}>রোগের লক্ষণঃ</th>
              <th className={`${styles.th} ${styles.thGreen}`}>করনীয়ঃ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`${styles.td} ${styles.tdTop}`}>
                <BulletList items={symptoms} color="red" />
              </td>
              <td className={`${styles.td} ${styles.tdTop}`}>
                <BulletList items={actions} color="green" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}