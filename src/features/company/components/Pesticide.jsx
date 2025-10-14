import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import SearchIcon from "@/assets/IconComponents/SearchIcon";

import PesticideList from "./PesticideList";

import styles from "../styles/Pesticide.module.css";

/**
 * @param {Object} props
 * @param {Array<{title:string, name:string, rating:number, location:string}>} props.items
 */

export default function Pesticide({ items = [] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const onSearch = useCallback((e) => setQuery(e.target.value), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((it) =>
      [it.title, it.name, it.location]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, query]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
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
        <h1 className={styles.heroTitle}>
          বাংলাদেশের কীটনাশক আমদানী, বাজারজাতকারী ও পরিবেশক কোম্পানীর তালিকাসমূহ
        </h1>
        <p className={styles.heroSub}>
          কৃষি কীটনাশক পণ্য এবং কোম্পানির বিস্তারিত তথ্য
        </p>
      </section>

      {/* Search */}
      <section className={styles.controls}>
        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={onSearch}
            placeholder="খুঁজুন...  (Press ⌘/Ctrl + K)"
            className={styles.searchInput}
          />
        </div>
      </section>

      {/* List */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>কোম্পানি সমূহ</h2>
        <PesticideList items={filtered} />
      </section>
    </div>
  );
}
