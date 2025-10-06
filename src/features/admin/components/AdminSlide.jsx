import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/adminSlide.module.css";

/* Sample icons (replace with yours as needed) */
const IconHome = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" />
  </svg>
);
const IconUsers = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5ZM8 14c-2.66 0-8 1.33-8 4v3h6v-2c0-1.62.96-3.05 2.49-4.19A14.2 14.2 0 0 0 8 14Z"/>
  </svg>
);
const IconCog = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm9.4 4.5a7.8 7.8 0 0 0 .05-.5 7.8 7.8 0 0 0-.05-.5l2.06-1.6a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.43 1a7.3 7.3 0 0 0-1-.58l-.37-2.6a.5.5 0 0 0-.5-.4h-4a.5.5 0 0 0-.5.4l-.37 2.6a7.3 7.3 0 0 0-1 .58l-2.43-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64L2.6 11a7.8 7.8 0 0 0-.05.5 7.8 7.8 0 0 0 .05.5l-2.06 1.6a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.43-1a7.3 7.3 0 0 0 1 .58l.37 2.6a.5.5 0 0 0 .5.4h4a.5.5 0 0 0 .5-.4l.37-2.6a7.3 7.3 0 0 0 1-.58l2.43 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64ZM12 18a6 6 0 1 1 6-6 6.01 6.01 0 0 1-6 6Z"/>
  </svg>
);

/* Your curved arrow icon */
const ToggleArrow = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    color="#ffffff"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: IconHome },
  { to: "/admin/users", label: "Users", Icon: IconUsers },
  { to: "/admin/settings", label: "Settings", Icon: IconCog },
];

const AdminSlide = () => {
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);

  const expanded = pinnedOpen || hoverOpen;

  return (
    <aside
      className={`${styles.sidebar} ${expanded ? styles.expanded : ""}`}
      onMouseEnter={() => setHoverOpen(true)}
      onMouseLeave={() => setHoverOpen(false)}
    >
      {/* Top brand / toggle */}
      <div className={styles.header}>
        <div className={styles.brandDot} />
        <button
          type="button"
          className={`${styles.toggleBtn} ${expanded ? styles.toggleOpen : ""}`}
          onClick={() => setPinnedOpen((v) => !v)}
          aria-label={expanded ? "Collapse" : "Expand"}
          title={expanded ? "Collapse" : "Expand"}
        >
          {/* rotate arrow when open */}
          <ToggleArrow className={styles.toggleIcon} />
        </button>
      </div>

      {/* Nav items */}
      <nav className={styles.nav}>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
          >
            <Icon className={styles.itemIcon} />
            <span className={styles.itemText}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSlide;