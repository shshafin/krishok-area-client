import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminTopNavbar from "./AdminTopNavbar";
import Navbar from "./NavBar";

export default function AdminLayout() {
  useEffect(() => {
    const stylesheets = [
      new URL("../../../assets/styles/Admin.Main.css", import.meta.url).href,
      new URL("../../../assets/styles/Admin.css", import.meta.url).href,
    ].map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.adminStylesheet = "true";
      document.head.appendChild(link);
      return link;
    });

    return () => {
      stylesheets.forEach((link) => link.parentNode?.removeChild(link));
    };
  }, []);

  return (
    <div className="wrapper">
      <Navbar />
      <AdminTopNavbar />
      <Suspense fallback={<div className="p-4 text-center text-muted">Loading…</div>}>
        <Outlet />
      </Suspense>
      <footer className="main-footer">
        <strong>
          &copy; 2021{" "}
          <a href="#" target="_blank" rel="noreferrer">
            Mosarrof Pvt Ltd.
          </a>
          .
        </strong>
        All rights reserved.
        <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 3.1.0
        </div>
      </footer>
      <div id="sidebar-overlay"></div>
    </div>
  );
}
