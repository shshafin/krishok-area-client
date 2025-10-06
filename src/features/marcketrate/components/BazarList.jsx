import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import BazarCard from "../components/BazarCard";
import styles from "../styles/Bazar.module.css";

const CHUNK = 12;
const MAX_ITEMS = 60;

export default function BazarList({ items = [] }) {
  const [count, setCount] = useState(0);
  const sentinelRef = useRef(null);

  const total = Math.min(items.length, MAX_ITEMS);

  useEffect(() => {
    setCount(Math.min(total, CHUNK));
  }, [items, total]);

  const visible = useMemo(() => items.slice(0, count), [items, count]);

  const loadMore = useCallback(() => {
    setCount((c) => Math.min(total, c + CHUNK));
  }, [total]);

  useEffect(() => {
    if (count >= total) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([ent]) => ent.isIntersecting && loadMore(),
      { root: null, rootMargin: "600px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, total, loadMore]);

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {visible.map((it, idx) => (
          <BazarCard key={`${it.title}-${idx}`} {...it} />
        ))}
      </div>
      {count < total && <div ref={sentinelRef} className={styles.sentinel} />}
      {items.length === 0 && <div className={styles.empty}>কোন ফলাফল নেই</div>}
    </section>
  );
}