import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@/assets/IconComponents/MenuIcon";
import FullScreen from "@/assets/IconComponents/FullScreen";

export default function AdminTopNavbar() {
  const navigate = useNavigate();

  const toggleSidebar = useCallback((e) => {
    e.preventDefault();
    const wrapper = document.querySelector(".wrapper");
    if (!wrapper) return;
    wrapper.classList.toggle("sidebar-collapsed");
  }, []);

  const handleLogout = useCallback(
    (e) => {
      e.preventDefault();
      localStorage.removeItem("accessToken");
      navigate("/");
    },
    [navigate]
  );

  const handleFullscreen = useCallback((e) => {
    e.preventDefault();
    const doc = document.documentElement;
    if (!document.fullscreenElement) {
      doc
        .requestFullscreen()
        .catch((err) => console.warn("Fullscreen error:", err));
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light admin-top-navbar">
      <section className="flex-FY-center">
        <button
          type="button"
          className="admin-icon-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar">
          <MenuIcon />
        </button>
      </section>
      <section className="admin-actions">
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={handleLogout}>
          Logout
        </button>
        <button
          type="button"
          className="admin-icon-btn"
          onClick={handleFullscreen}
          aria-label="Toggle fullscreen">
          <FullScreen />
        </button>
      </section>
    </nav>
  );
}
