import { useMemo, useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

/** Helper: safe slug from Bangla/English names */
const slugify = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0980-\u09FF\s-]/g, "") // keep basic Bangla range + spaces/dash
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/** Category → heading CSS class map (match your original classes) */
const categoryHeadingClass = {
  "কীটনাশক": "kitnacxc_7x",
  "ছত্রাকনাশক": "chotrcxc_7x",
  "অনুখাদ্য": "unuxc_7x",
  "আগাছানাশক": "agacxc_7x",
};

function CategorySection({ title }) {
  const cls = categoryHeadingClass[title] || "";
  return (
    <div className="Pctg_xh18">
      <h4 className={cls}>{title}</h4>
    </div>
  );
}

/**
 * ProductGrid
 * Props:
 *  - items: Array<{
 *      id: number|string,
 *      name: string,        // product name (Bangla/English)
 *      material: string,    // active ingredient / material
 *      category: string,    // e.g. কীটনাশক / ছত্রাকনাশক / অনুখাদ্য / আগাছানাশক
 *      slug?: string        // optional precomputed slug
 *    }>
 *  - initialCount?: number (default 20)
 *  - step?: number (default 10)
 */

export default function ProductGrid({ items = [], initialCount = 20, step = 10 }) {
  // Preferred category ordering for company pages
  const preferredOrder = ["কীটনাশক", "ছত্রাকনাশক", "আগাছানাশক", "অনুখাদ্য"];

  // Group by category and preserve preferred order
  const grouped = useMemo(() => {
    const byCat = new Map();
    for (const it of items) {
      const cat = it.category || "অন্যান্য";
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat).push(it);
    }
    // sort items in each category by id asc (or keep original order)
    for (const arr of byCat.values()) {
      arr.sort((a, b) => String(a.id).localeCompare(String(b.id), "en"));
    }
    // return array of [category, items[]] sorted by preferredOrder then alphabetically
    return Array.from(byCat.entries()).sort((a, b) => {
      const ia = preferredOrder.indexOf(a[0]);
      const ib = preferredOrder.indexOf(b[0]);
      if (ia === -1 && ib === -1) return a[0].localeCompare(b[0], "bn");
      if (ia === -1) return 1; // a after b
      if (ib === -1) return -1; // a before b
      return ia - ib;
    });
  }, [items]);

  // Flatten to a linear render list with category headers injected
  // We'll render categories as separate rows so alignment is predictable.
  const [visible, setVisible] = useState(initialCount);
  useEffect(() => setVisible(initialCount), [initialCount, items]);

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setVisible(v => Math.min(v + step, items.length));
          }
        });
      },
      { rootMargin: "400px 0px", threshold: 0.01 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [items.length, step]);

  // Render: for each category, show header then a grid row of items
  return (
    <div className="product-align">
      {grouped.map(([cat, arr]) => {
        const colorClass =
          cat === "কীটনাশক" ? "colorboxk" :
          cat === "ছত্রাকনাশক" ? "colorboxc" :
          cat === "অনুখাদ্য" ? "colorboxo" :
          cat === "আগাছানাশক" ? "colorboxa" : "";

        return (
          <div key={cat} className="category-block">
            <CategorySection title={cat} />
            <div className="category-row">
              {arr.slice(0, Math.max(0, Math.min(arr.length, visible))).map(item => {
                const { id, name, material, category, slug, img } = item;
                const url = `/productdetails/${slug || slugify(name)}`;
                return (
                  <div className="si" key={`item-${id}`}>
                    <NavLink to={url} className="co">
                      {/* Image at top */}
                      <div className="product-image">
                        <img src={img || "https://placehold.co/300x400?text=No+Image"} alt={name} />
                      </div>
                      {/* Text content below */}
                      <div className="cardBb">
                        <h3 className="pronamesize">{name}</h3>
                        <p className="new">{category}</p>
                      </div>
                    </NavLink>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div ref={sentinelRef} />
    </div>
  );
}