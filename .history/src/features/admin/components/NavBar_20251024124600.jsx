import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import BrandLogo from "@/assets/images/krishok-icona.png";

import dashboardIcon from "@/assets/icons/dashboard_icon.png";
import userIcon from "@/assets/icons/user_icon.png";
import addIcon from "@/assets/icons/add_icon.png";
// import manageIcon from "@/assets/icons/manage_icon.png";
// import bellIcon from "@/assets/icons/bell_icon.png";

import { fetchMe } from "@/api/authApi"; // 👈 fetchMe import

export default function Navbar() {
  const [userName, setUserName] = useState("Krishok Mosarrof");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchMe();
        if (res?.success && res.data?.name) {
          setUserName(res.data.name);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    loadUser();
  }, []);

  const menu = [
    {
      type: "item",
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: dashboardIcon,
    },
    {
      type: "item",
      to: "/admin/profile/edit",
      label: "Edit Profile",
      icon: userIcon,
    },
    { type: "divider" },
    {
      type: "item",
      to: "/admin/media/add-photo",
      label: "Add Galleries",
      icon: addIcon,
    },
    // ... বাকি menu
  ];

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <NavLink
        to="/admin/dashboard"
        className="brand-link">
        <img
          src={BrandLogo}
          alt="krishokarea Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">krishokarea</span>
      </NavLink>

      <div
        className="sidebar sideheight"
        style={{ overflowY: "auto" }}>
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="info">
            <NavLink
              to="/admin/dashboard"
              className="d-block">
              {userName}
            </NavLink>
          </div>
        </div>

        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false">
            {menu.map((item, idx) => {
              if (item.type === "divider") {
                return (
                  <div
                    className="s_border"
                    key={`div-${idx}`}
                  />
                );
              }

              if (item.type === "item") {
                return (
                  <li
                    className="nav-item admin-icons"
                    key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }>
                      <img
                        src={item.icon}
                        alt=""
                        className="nav-icon"
                        style={{
                          width: 18,
                          height: 18,
                          marginRight: 8,
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                      <p>{item.label}</p>
                    </NavLink>
                  </li>
                );
              }

              return null;
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
