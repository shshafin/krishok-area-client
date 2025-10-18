import { Outlet } from "react-router-dom";
import AdminTopNavbar from "./AdminTopNavbar";
import Navbar from "./NavBar";

export default function AdminLayout() {
  return (
    <div className="wrapper">
      <AdminTopNavbar />
      <Navbar />
      <Outlet />
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
