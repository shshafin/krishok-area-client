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
  // Group by category (stable order by category name, then by id)
  const grouped = useMemo(() => {
    const byCat = new Map();
    for (const it of items) {
      const cat = it.category || "অন্যান্য";
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat).push(it);
    }
    // sort items in each category by id asc (or keep original order)
    for (const arr of byCat.values()) {
      arr.sort((a, b) => (String(a.id).localeCompare(String(b.id), "en")));
    }
    // return array of [category, items[]] sorted by category label
    return Array.from(byCat.entries()).sort((a, b) => a[0].localeCompare(b[0], "bn"));
  }, [items]);

  // Flatten to a linear render list with category headers injected
  const linear = useMemo(() => {
    const out = [];
    for (const [cat, arr] of grouped) {
      out.push({ _header: true, category: cat, key: `head-${cat}` });
      for (const it of arr) out.push({ ...it, key: `item-${it.id}` });
    }
    return out;
  }, [grouped]);

  const [visible, setVisible] = useState(initialCount);
  useEffect(() => setVisible(initialCount), [initialCount, items]);

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setVisible(v => Math.min(v + step, linear.length));
          }
        });
      },
      { rootMargin: "400px 0px", threshold: 0.01 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [linear.length, step]);

  const slice = linear.slice(0, visible);

  return (
    <div className="product-align">
      {slice.map(node => {
        if (node._header) {
          return <CategorySection key={node.key} title={node.category} />;
        }
        const { id, name, material, category, slug } = node;
        const url = `/productdetails/${slug || slugify(name)}`;

        // Category color classes like original (optional)
        const colorClass =
          category === "কীটনাশক" ? "colorboxk" :
          category === "ছত্রাকনাশক" ? "colorboxc" :
          category === "অনুখাদ্য" ? "colorboxo" :
          category === "আগাছানাশক" ? "colorboxa" : "";

        return (
          <div className="si" key={node.key}>
            <div className="co">
              <div className="cardBb">
                <h3 className="pronamesize">{name}</h3>
                <p title="product material name" className="mulname">{material}</p>
              </div>

              <p title="product category" className={`new ${colorClass}`}>{category}</p>

              <div className="buttom">
                <NavLink to={url} className="plinkk" title="আরও জানুন">
                  আরও জানুন
                </NavLink>
              </div>
            </div>
          </div>
        );
      })}

      {/* Sentinel + fallback button */}
      <div ref={sentinelRef} />
      {visible < linear.length && (
        <div className="text-center my-4">
          <button
            type="button"
            onClick={() => setVisible(v => Math.min(v + step, linear.length))}
            className="plinkk"
          >
            আরও দেখুন (+{step})
          </button>
        </div>
      )}
    </div>
  );
}