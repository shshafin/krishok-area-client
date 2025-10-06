// features/profile/components/ProfileHeader.jsx
import { NavLink } from "react-router-dom";
import CameraIcon from "@/assets/IconComponents/CameraIcon";
import MapPinIcon from "@/assets/IconComponents/MapPinIcon";
import CalendarIcon from "@/assets/IconComponents/Calendar";
import styles from "../styles/Profile.module.css";

/**
 * Props:
 *  - user: { id, username, name, avatarUrl, coverUrl, location, joinedAt, followers, following }
 *  - isOwner: boolean
 */
export default function ProfileHeader({ user, isOwner }) {
  const joinedText = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleString()
    : "";

  return (
    <section className={styles["profile-header"]}>
      <div className={styles["cover-wrap"]}>
        {user?.coverUrl ? (
          <img
            className={styles.cover}
            src={user.coverUrl}
            alt="profile cover"
          />
        ) : (
          <div className={`${styles.cover} ${styles["cover-fallback"]}`} />
        )}

        {isOwner && (
          <NavLink
            to="/profile"
            className={`${styles["cover-edit"]} ${styles["btn-ghost"]}`}
            aria-label="Edit cover"
          >
            <CameraIcon />
            <span>Edit Cover</span>
          </NavLink>
        )}
      </div>

      <div className={styles["header-main"]}>
        <div className={styles["avatar-wrap"]}>
          <img
            className={`${styles.avatar} object-cover`}
            src={user?.avatarUrl}
            alt={`${user?.username || "user"} avatar`}
          />
          {isOwner && (
            <NavLink
              to="/profile"
              className={`${styles["avatar-edit"]} ${styles["btn-circle"]}`}
              aria-label="Edit profile photo"
              title="Edit profile photo"
            >
              <CameraIcon />
            </NavLink>
          )}
        </div>

        <div className={styles["header-right"]}>
          <div className={styles["title-row"]}>
            <div>
              <h1 className={styles["profile-name"]}>
                {user?.name || user?.username}
              </h1>
              <div className={styles["profile-handle"]}>@{user?.username}</div>
            </div>

            {isOwner && (
              <NavLink
                to="/profile"
                className={styles["btn-outline"]}
                aria-label="Edit profile"
              >
                Edit Profile
              </NavLink>
            )}
          </div>

          <div className={styles["meta-row"]}>
            <div className={`${styles["meta-item"]} flex FY-center gap-1`}>
              <MapPinIcon />
              <span className="muted">{user?.location || "—"}</span>
            </div>
            <div className={`${styles["meta-item"]} flex FY-center gap-1`}>
              <CalendarIcon />
              <span className="muted">Joined {joinedText}</span>
            </div>
          </div>

          <div className={styles["stats-row"]}>
            <button className={styles["stat-btn"]} type="button">
              <span className={styles.bold}>{user?.following ?? 0}</span>
              <span className="muted"> Following</span>
            </button>
            <button className={styles["stat-btn"]} type="button">
              <span className={styles.bold}>{user?.followers ?? 0}</span>
              <span className="muted"> Followers</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}