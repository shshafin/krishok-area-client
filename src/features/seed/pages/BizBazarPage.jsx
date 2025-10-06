import { useState, useMemo } from "react";

import styles from "../styles/BizBazar.module.css";
import BizCard from "../components/BizCard";
import SearchIcon from "@/assets/IconComponents/SearchIcon";
import GridIcon from "@/assets/IconComponents/Grid";
import ListIcon from "@/assets/IconComponents/ListIcon";

export default function BizBazarPage({ title, subtitle, items, categories, cities }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(categories?.[0] || "সব");
  const [city, setCity] = useState(cities?.[0] || "সব");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [view, setView] = useState("grid"); // "grid" | "list"

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return (items || []).filter((b) => {
      const okCat = cat === "সব" || b.category === cat;
      const okCity = city === "সব" || b.city === city;
      const okVer = !onlyVerified || b.verified;
      const hay = `${b.bnName} ${b.enName} ${b.description} ${b.products.join(" ")} ${b.category}`.toLowerCase();
      const okQ = !query || hay.includes(query);
      return okCat && okCity && okVer && okQ;
    });
  }, [items, q, cat, city, onlyVerified]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.h1}>{title}</h1>
        <p className={styles.sub}>{subtitle}</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            className={styles.input}
            placeholder="ব্যবসা বা পণ্য খুঁজুন..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <select className={styles.select} value={cat} onChange={(e) => setCat(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className={styles.select} value={city} onChange={(e) => setCity(e.target.value)}>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className={styles.chkLabel}>
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
          />
          <span>শুধু যাচাইকৃত</span>
        </label>
      </div>

      <div className={styles.topRow}>
        <p className={styles.count}>{filtered.length} টি ব্যবসা পাওয়া গেছে</p>
        <div className={styles.viewBtns}>
          <button
            className={`${styles.iconBtn} ${view === "grid" ? styles.iconBtnActive : ""}`}
            onClick={() => setView("grid")}
            title="Grid"
          >
            <GridIcon />
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => setView("list")}
            title="List"
          >
            <ListIcon />
          </button>
        </div>
      </div>

      <div className={view === "grid" ? styles.grid : styles.list}>
        {filtered.map((biz) => (
          <BizCard key={biz.id} biz={biz} />
        ))}
      </div>
    </div>
  );
}