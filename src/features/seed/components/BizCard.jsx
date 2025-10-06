import styles from "../styles/BizBazar.module.css";

import MapPinIcon from "@/assets/IconComponents/MapPinIcon";
import PhoneIcon from "@/assets/IconComponents/PhoneIcon";
import MailIcon from "@/assets/IconComponents/MailIcon";
import StarIcon from "@/assets/IconComponents/StarIcon";
import CircleCheckIcon from "@/assets/IconComponents/CircleCheckIcon";

export default function BizCard({ biz }) {
  return (
    <div className={styles.bizCard}>
      <div className={styles.bizTop}>
        <div className={styles.bizNames}>
          <div className={styles.nameRow}>
            <h3 className={styles.bizTitle}>{biz.bnName}</h3>
            {biz.verified && <CircleCheckIcon className={styles.verified} />}
          </div>
          <p className={styles.enName}>{biz.enName}</p>
          <p className={styles.cat}>{biz.category}</p>
          <p className={styles.tagline}>{biz.tagline}</p>
        </div>

        <div className={styles.ratingBox}>
          <div className={styles.starsRow}>
            {/* Simple stars: fill floor rating, rest grey */}
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className={i < Math.floor(biz.rating) ? styles.starFill : styles.starEmpty} />
            ))}
            <span className={styles.ratingNum}>{biz.rating.toFixed(1)}</span>
          </div>
          <p className={styles.reviews}>({biz.reviews} রিভিউ)</p>
        </div>
      </div>

      <p className={styles.desc}>{biz.description}</p>

      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <MapPinIcon className={styles.infoIcon} />
          <span>{biz.address}</span>
        </div>
        <div className={styles.infoItem}>
          <PhoneIcon className={styles.infoIcon} />
          <span>{biz.phone}</span>
        </div>
        <div className={styles.infoItem}>
          <MailIcon className={styles.infoIcon} />
          <span>{biz.email}</span>
        </div>
      </div>

      <div className={styles.productsWrap}>
        <p className={styles.productsLabel}>পণ্যসমূহ:</p>
        <div className={styles.chips}>
          {biz.products.map((p, i) => (
            <span className={styles.chip} key={p + i}>{p}</span>
          ))}
          {/* Show +N if truncated elsewhere */}
        </div>
      </div>

      <div className={styles.footerRow}>
        <span>মালিক: {biz.owner}</span>
        <span>প্রতিষ্ঠিত: {biz.founded}</span>
      </div>
    </div>
  );
}