import React, { useMemo, useState } from "react";
import styles from "../styles/marketPriceForm.module.css";

export default function MarketPriceForm() {
  // categories + add-more
  const [categories, setCategories] = useState([
    "ধান",
    "ডাল",
    "সবজি",
    "মসলা",
    "ফল",
    "মাছ",
    "মাংস",
  ]);
  const [categoryBn, setCategoryBn] = useState("ধান");
  const [newCat, setNewCat] = useState("");

  const [itemBn, setItemBn] = useState("চাল");
  const [itemEn, setItemEn] = useState("Rice");

  const [quality, setQuality] = useState("উত্তম");

  const [price, setPrice] = useState(65);
  const [prevPrice, setPrevPrice] = useState(62);
  const [unit, setUnit] = useState("কেজি");

  const [location, setLocation] = useState("কাওরান বাজার");

  const [result, setResult] = useState(null);

  const trend = useMemo(() => {
    const delta = Number(price) - Number(prevPrice || 0);
    return {
      direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
      change: Math.abs(Number.isFinite(delta) ? Number(delta) : 0),
    };
  }, [price, prevPrice]);

  const addCategory = () => {
    const v = newCat.trim();
    if (!v) return;
    if (!categories.includes(v)) setCategories((c) => [...c, v]);
    setCategoryBn(v);
    setNewCat("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemBn.trim() || !itemEn.trim() || !location.trim() || !price) return;

    const payload = {
      categoryBn,
      item: { bn: itemBn.trim(), en: itemEn.trim() },
      quality,
      price: { value: Number(price), currency: "BDT", symbol: "৳", unit },
      previousPrice:
        prevPrice !== ""
          ? { value: Number(prevPrice), currency: "BDT", symbol: "৳", unit }
          : null,
      location: location.trim(),
      trend,
    };

    setResult(payload);
  };

  return (
    <div className={`${styles.page} dark`}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Add New Market Price</h1>

        {/* Category + Add new */}
        <div className={styles.catRow}>
          <label className={styles.label}>
            Category
            <select
              className={styles.input}
              value={categoryBn}
              onChange={(e) => setCategoryBn(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Add new category
            <div className={styles.addCatGroup}>
              <input
                className={styles.input}
                placeholder="নতুন ক্যাটাগরি…"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" ? (e.preventDefault(), addCategory()) : null
                }
              />
              <button
                type="button"
                className={styles.addBtn}
                onClick={addCategory}
              >
                Add
              </button>
            </div>
          </label>
        </div>

        {/* Items (BN/EN) */}
        <div className={styles.row2}>
          <label className={styles.label}>
            Item (BN)
            <input
              className={styles.input}
              value={itemBn}
              onChange={(e) => setItemBn(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Item (EN)
            <input
              className={styles.input}
              value={itemEn}
              onChange={(e) => setItemEn(e.target.value)}
            />
          </label>
        </div>

        {/* Quality + Location */}
        <div className={styles.row2}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Quality</legend>
            <div className={styles.segment}>
              {["উত্তম", "মাঝারি", "নিম্ন"].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={`${styles.segmentBtn} ${
                    quality === q ? styles.segmentActive : ""
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </fieldset>

          <label className={styles.label}>
            Location
            <input
              className={styles.input}
              placeholder="যেমন: কাওরান বাজার"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
        </div>

        {/* Prices row: unit on TOP, number input under it; trend on the side */}
        <div className={styles.row3}>
          <label className={styles.label}>
            Price
            <div className={styles.stack}>
              <select
                className={styles.unitTop}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                {["কেজি", "লিটার", "পিস"].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                className={`${styles.input} ${styles.inputBare}`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </label>

          <label className={styles.label}>
            Previous
            <div className={styles.stack}>
              <div className={styles.unitTopReadonly}>{unit}</div>
              <input
                type="number"
                step="0.01"
                className={`${styles.input} ${styles.inputBare}`}
                value={prevPrice}
                onChange={(e) => setPrevPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </label>

          <div className={styles.trendSide}>
            <span
              className={`${styles.trendDot} ${
                trend.direction === "up"
                  ? styles.up
                  : trend.direction === "down"
                  ? styles.down
                  : styles.flat
              }`}
            />
            <span className={styles.trendText}>
              {trend.direction === "up"
                ? `Up by ${trend.change}`
                : trend.direction === "down"
                ? `Down by ${trend.change}`
                : "No change"}
            </span>
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>

      {result && (
        <section className={styles.output}>
          <h2 className={styles.outTitle}>Result (JSON)</h2>
          <pre className={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}
