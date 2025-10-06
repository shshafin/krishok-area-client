import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import SearchIcon from "@/assets/IconComponents/SearchIcon";
import BazarList from "../components/BazarList";
import styles from "../styles/Bazar.module.css";

/**
 * @param {Object} props
 * @param {Array<{
 *   category:string,        // ধান | সবজি | ফল | মসলা | ডাল | তেল
 *   title:string,           // চাল
 *   name:string,            // Rice
 *   quality:string,         // উত্তম | মাঝারি | নিম্ন
 *   price:number,           // current price numeric
 *   unit:string,            // /কেজি | /ডজন | /লিটার ...
 *   trend:{dir:'up'|'down', delta:number},
 *   prevPrice:number,
 *   market:string,          // কাওরান বাজার / শাহবাগ বাজার ...
 *   updatedAgo:string       // e.g. ২ দিন আগে
 * }>} props.items
 */

export default function BazarRatePage({ items = [] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("সব");
  const [market, setMarket] = useState("সব");
  const inputRef = useRef(null);

  const onSearch = useCallback((e) => setQuery(e.target.value), []);
  const onCategory = useCallback((e) => setCategory(e.target.value), []);
  const onMarket = useCallback((e) => setMarket(e.target.value), []);

  // derive filter options
  const categories = useMemo(
    () => ["সব", ...Array.from(new Set(items.map(i => i.category)))],
    [items]
  );
  const markets = useMemo(
    () => ["সব", ...Array.from(new Set(items.map(i => i.market)))],
    [items]
  );

  // filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (category !== "সব" && it.category !== category) return false;
      if (market !== "সব" && it.market !== market) return false;
      if (!q) return true;
      return [it.title, it.name, it.market, it.category]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [items, query, category, market]);

  // quick focus shortcut
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        el.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.page}>
      {/* Page header */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>প্রতিদিনের বাজার মূল্যের তালিকা দেখুন</h1>
        <p className={styles.heroSub}>কৃষি পণ্যের সর্বশেষ বাজার দর এবং মূল্য তুলনা</p>
      </section>

      {/* Controls */}
      <section className={styles.controls}>
        <div className={styles.controlsGrid}>
          <div className={styles.searchWrap}>
            <SearchIcon className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={onSearch}
              placeholder="পণ্য খুঁজুন...  (Ctrl/⌘ + K)"
              className={styles.searchInput}
            />
          </div>

          <select value={category} onChange={onCategory} className={styles.select}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={market} onChange={onMarket} className={styles.select}>
            {markets.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </section>

      {/* List */}
      <BazarList items={filtered} />
    </div>
  );
}