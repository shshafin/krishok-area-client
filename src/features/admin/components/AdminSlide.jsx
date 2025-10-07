import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/adminSlide.module.css";


import DashIcon from "@/assets/iconComponents/DashIcon";
import CompanyIcon from "@/assets/iconComponents/CompanyIcon";
import IconGallery from "@/assets/iconComponents/IconGallery";
import ArrowIcon from "@/assets/iconComponents/ArrowIcon";
import MarcketIcon from "@/assets/iconComponents/MarcketIcon";
import InjectionIcon from "@/assets/iconComponents/InjectionIcon";
import SeedIcon from "@/assets/iconComponents/SeedIcon";

const NAV = [
  { to: "/adminT", label: "Dashboard", Icon: DashIcon },
  { to: "/adminT/company", label: "Company", Icon: CompanyIcon },
  { to: "/adminT/gallery", label: "Gallery", Icon: IconGallery },
  { to: "/adminT/marcket-price", label: "Marcket Price", Icon: MarcketIcon},
  { to: "/adminT/seed", label: "Seed Marcket", Icon: SeedIcon},
  { to: "/adminT/disease", label: "Disease", Icon: InjectionIcon},
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
          <ArrowIcon className={styles.toggleIcon} />
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