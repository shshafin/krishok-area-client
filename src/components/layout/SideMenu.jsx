/* eslint-disable no-unused-vars */
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import styles from "@/assets/styles/Menu.module.css";

import CloseIcon from "@/assets/IconComponents/Close";
import CloudIcon from "@/assets/IconComponents/CloudIcon";
import MessageCircleIcon from "@/assets/IconComponents/MessageCircleIcon";
import ImageIcon from "@/assets/IconComponents/ImageIcon";
import UserPlusIcon from "@/assets/IconComponents/UserPlusIcon";
import SettingsIcon from "@/assets/IconComponents/SettingsColorIcon";
import LocationIcon from "@/assets/IconComponents/LocationIcon";

import { logoutUser } from "../../api/authApi";
import { baseApi } from "../../api";

export default function SideMenu({
  open = false,
  onClose = () => {},
  user = {
    name: "",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=K",
  },
  items: itemsProp,
}) {
  // ======================
  // logout handler
  // ======================
  const handleSignOut = async () => {
    try {
      const res = await logoutUser(); // API call
      if (res.success) {
        localStorage.removeItem("accessToken"); // token remove
        window.location.href = "/auth/login"; // redirect
      }
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed!");
    }
  };

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const items = useMemo(
    () =>
      itemsProp ?? [
        { to: "/weather", label: "প্রতিদিনের আবহাওয়া", Icon: CloudIcon },
        { to: "/districts", label: "বিভাগ ও জেলাসমূহ", Icon: LocationIcon },
        {
          to: "/companyes",
          label: "কীটনাশক ও কোম্পানি",
          Icon: MessageCircleIcon,
        },
        { to: "/market", label: "বাজার দর", Icon: ImageIcon },
        { to: "/seed-market", label: "বিজ বাজার", Icon: ImageIcon },
        { to: "/follow", label: "অনুসরণ করুন", Icon: UserPlusIcon },
        { to: "/logout", label: "লগ আউট", Icon: SettingsIcon },
      ],
    [itemsProp]
  );

  if (!open) return null;

  return createPortal(
    <>
      {/* overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* drawer */}
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        {/* header */}
        <div className={styles.drawerHeader}>
          <NavLink
            to="/profile"
            className={styles.profileBtn}
            onClick={onClose}
            aria-label="Edit profile"
            title="Edit profile"
          >
            <img
              src={
                user.avatar
                  ? user.avatar.startsWith("http")
                    ? user.avatar
                    : `${baseApi}${user.avatar}`
                  : "https://i.postimg.cc/fRVdFSbg/e1ef6545-86db-4c0b-af84-36a726924e74.png"
              }
              alt={user.name || "User"}
              className={styles.profileAvatar}
            />

            <div className={styles.profileText}>
              <h3 id="menu-title" className={styles.profileName}>
                {user.name}
              </h3>
              <p className={styles.profileHint}>edit profile</p>
            </div>
          </NavLink>

          <button
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* menu items */}
        <nav className={styles.menuList} aria-label="Menu">
          {items.map(({ to, label, Icon }) => {
            const isLogout = to === "/logout";

            // Logout handled via button
            if (isLogout) {
              return (
                <button
                  key={to}
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    onClose();
                    handleSignOut();
                  }}
                >
                  <Icon className={styles.menuIcon} />
                  {label}
                </button>
              );
            }

            // Regular NavLink
            return (
              <NavLink
                key={to}
                to={to}
                className={styles.menuItem}
                onClick={onClose}
              >
                <Icon className={styles.menuIcon} />
                {label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>,
    document.body
  );
}
