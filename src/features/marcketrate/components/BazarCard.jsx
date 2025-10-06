import { useMemo } from "react";
import styles from "../styles/Bazar.module.css";
import MapPinIcon from "@/assets/IconComponents/MapPinIcon";
import TrendingUpIcon from "@/assets/IconComponents/TrendingUpIcon";
import TrendingDownIcon from "@/assets/IconComponents/TrendingDownIcon";
import WheatIcon from "@/assets/IconComponents/WheatIcon";
import CarrotIcon from "@/assets/IconComponents/CarrotIcon";
import LeafIcon from "@/assets/IconComponents/LeafIcon";
import AppleIcon from "@/assets/IconComponents/AppleIcon";

function useCategoryIcon(category) {
  switch (category) {
    case "ধান":  return { Icon: WheatIcon, accent: styles.accentYellow, tag: styles.tag };
    case "সবজি": return { Icon: CarrotIcon, accent: styles.accentOrange, tag: styles.tag };
    case "ফল":   return { Icon: AppleIcon,  accent: styles.accentRed,    tag: styles.tag };
    case "মসলা":
    case "ডাল":
    case "তেল":  return { Icon: LeafIcon,   accent: styles.accentGreen,  tag: styles.tag };
    default:     return { Icon: LeafIcon,   accent: styles.accentGray,   tag: styles.tag };
  }
}

// helper to coerce "50" -> 50 safely
const num = (v) => (typeof v === "string" ? parseFloat(v) : v);

export default function BazarCard({
  category,
  quality = "উত্তম",
  price,
  unit,
  trend,          // "up" | "down" | { dir, delta }
  change,         // number or string
  prevPrice,
  market,
  updatedAgo,
  bnName, enName, // new
  title, name,    // legacy
  bnname, enname, // tolerant
}) {
  const { Icon, accent, tag } = useCategoryIcon(category);

  const bn = bnName ?? bnname ?? title ?? "";
  const en = enName ?? enname ?? name ?? "";

  const norm = useMemo(() => {
    let dir = "up";
    let delta = 0;

    // accept string or object
    if (typeof trend === "string") {
      dir = trend === "down" ? "down" : "up";
    } else if (trend && typeof trend === "object") {
      if (typeof trend.dir === "string") dir = trend.dir === "down" ? "down" : "up";
      if (trend.delta != null) delta = Math.abs(num(trend.delta) || 0);
    }

    // if delta still 0, try change
    if (!delta && change != null) {
      const ch = num(change) || 0;
      delta = Math.abs(ch);
      dir = ch < 0 ? "down" : "up";
    }

    // last fallback from price vs prevPrice
    const pNow = num(price);
    const pPrev = num(prevPrice);
    if (!delta && Number.isFinite(pNow) && Number.isFinite(pPrev)) {
      const diff = pNow - pPrev;
      delta = Math.abs(diff);
      dir = diff < 0 ? "down" : "up";
    }

    return { dir, delta };
  }, [trend, change, price, prevPrice]);

  // be explicit
  const isUp = norm.dir === "up";
  const showTrend = norm.delta > 0;

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardCatLeft}>
          <Icon className={`${styles.catIcon} ${accent}`} />
          <span className={styles.catText}>{category}</span>
        </div>
        <div className={styles.updated}>{updatedAgo}</div>
      </div>

      <div className={styles.titleBlock}>
        <h3 className={styles.cardTitle}>{bn}</h3>
        <p className={styles.cardSub}>{en}</p>
        <span
          className={`${tag} ${
            quality === "উত্তম" ? styles.tagGood :
            quality === "মাঝারি" ? styles.tagMid : styles.tagLow
          }`}
        >
          {quality}
        </span>
      </div>

      <div className={styles.priceRow}>
        <div>
          <span className={styles.priceNow}>৳{num(price)}</span>
          <span className={styles.priceUnit}>/{unit}</span>
        </div>

        {showTrend && (
          <div className={`${styles.trend} ${isUp ? styles.trendUp : styles.trendDown}`}>
            {isUp ? (
              <TrendingUpIcon className={styles.trendIcon} />
            ) : (
              <TrendingDownIcon className={styles.trendIcon} />
            )}
            <span className={styles.trendDelta}>
              {isUp ? "+" : "-"}{norm.delta}
            </span>
          </div>
        )}
      </div>

      <div className={styles.prev}>
        পূর্বের দাম: <big><big>৳</big></big>{num(prevPrice)}/{unit}
      </div>

      <div className={styles.locRow}>
        <MapPinIcon className={styles.pin} />
        <span className={styles.locText}>{market}</span>
      </div>
    </article>
  );
}
