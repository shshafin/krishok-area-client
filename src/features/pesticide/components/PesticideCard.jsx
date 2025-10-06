import styles from "../styles/Pesticide.module.css";
import ShieldIcon from "@/assets/IconComponents/ShieldIcon";
import StarIcon from "@/assets/IconComponents/StarIcon";
import MapPinIcon from "@/assets/IconComponents/MapPinIcon";
import { Link } from "react-router-dom";

/**
 * @param {{title:string, name:string, rating:number, location:string}} props
 */
export default function PesticideCard({ title, name, rating = 0, location, url }) {
  return (
    <Link to={`table?url=${url}`}>
      <article className={styles.card} role="button" tabIndex={0}>
        <div className={styles.cardHeader}>
          <div className={styles.avatar}>
            <ShieldIcon />
          </div>
          <div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardSub}>{name}</p>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.rating}>
            <StarIcon className={styles.star} />
            <span className={styles.ratingText}>{rating}</span>
          </div>
          <div className={styles.location}>
            <MapPinIcon className={styles.pin} />
            <span className={styles.locationText}>{location}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
