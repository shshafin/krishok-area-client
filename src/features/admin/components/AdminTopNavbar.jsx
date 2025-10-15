import { useNavigate } from "react-router-dom";

export default function AdminTopNavbar() {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Fullscreen toggle
  const handleFullscreen = (e) => {
    e.preventDefault();
    const doc = document.documentElement;
    if (!document.fullscreenElement) {
      doc.requestFullscreen().catch((err) => console.warn("Fullscreen error:", err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Logout */}
        <li className="nav-item">
          <a
            className="btn btn-sm btn-danger"
            href="#"
            role="button"
            onClick={handleLogout}
          >
            Logout
          </a>
        </li>

        {/* Fullscreen */}
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
            onClick={handleFullscreen}
          >
            <i className="fas fa-expand-arrows-alt"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}