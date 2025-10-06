import { useMemo, useState, useCallback } from "react";
import styles from "../styles/Pesticide.module.css";
import SearchIcon from "@/assets/IconComponents/SearchIcon";
import ArrowLeftIcon from "@/assets/IconComponents/ArrowLeftIcon";

export default function PesticideCompanyPage({
  pageTitle,
  pageSubtitle,
  companyName,
  items = [],
  onBack, // optional callback
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return items;
    const query = q.toLowerCase();
    return items.filter((it) => {
      const hay = [
        it.bnName,
        it.enName,
        ...(it.crops || []),
        ...(it.pests || []),
        it.formula,
        it.method,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [items, q]);

  const handleBack = useCallback(() => {
    if (onBack) return onBack();
    if (typeof window !== "undefined") window.history.back();
  }, [onBack]);

  return (
    <div className={styles.page}>
      {/* Top header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.h1}>{pageTitle}</h1>
        <p className={styles.sub}>{pageSubtitle}</p>
      </div>

      {/* Search */}
      <div className={styles.card}>
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <SearchIcon className={styles.searchIcon} />
            <input
              className={styles.input}
              placeholder="খুঁজুন..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Company section */}
      <div className={styles.card}>
        <div className={styles.companyHeader}>
          <button className={styles.backBtn} onClick={handleBack}>
            <ArrowLeftIcon className={styles.backIcon} />
            কোম্পানি তালিকায় ফিরে যান
          </button>
          <div>
            <h2 className={styles.h2}>
              {companyName} - কীটনাশক পণ্যসমূহ
            </h2>
            <p className={styles.subSmall}>এই কোম্পানির সকল পণ্য</p>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>ফসল (Crop)</th>
                <th>বালাই (Pest/Disease)</th>
                <th>মন্ত্র (Formula/Solution)</th>
                <th>ব্যবহারবিধি (Method of Use)</th>
                <th>পণ্যের নাম</th>
                <th>নিরাপত্তা</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {filtered.map((it) => (
                <tr key={it.id} className={styles.row}>
                  <td className={styles.cell}>
                    <div className={styles.chipsRow}>
                      {it.crops?.map((c, i) => (
                        <span key={c + i} className={styles.chipGreen}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={styles.cell}>
                    <div className={styles.chipsRow}>
                      {it.pests?.map((p, i) => (
                        <span key={p + i} className={styles.chipRed}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={styles.cell}>
                    <span className={styles.linkBlue}>{it.formula}</span>
                  </td>
                  <td className={styles.cell}>
                    <span className={styles.linkPurple}>{it.method}</span>
                  </td>
                  <td className={styles.cell}>
                    <div>
                      <div className={styles.prodBn}>{it.bnName}</div>
                      <div className={styles.prodEn}>{it.enName}</div>
                    </div>
                  </td>
                  <td className={styles.cell}>
                    <span
                      className={
                        it.safety === "বিপদ"
                          ? styles.badgeDanger
                          : it.safety === "নিরাপদ"
                          ? styles.badgeSafe
                          : styles.badgeWarn
                      }
                    >
                      {it.safety}
                    </span>
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td className={styles.empty} colSpan={6}>
                    কোনো ফলাফল পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}