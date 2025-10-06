import { useLocation } from "react-router-dom";
import CompanyForm from "../components/CompanyForm";
import AdminGallery from "../components/gallery";
import AdminSlide from "../components/AdminSlide";

function AdminDashboard() {
  const location = useLocation();
  const currentPath = location.pathname;

  let ContentComponent = null;

  if (currentPath.endsWith("/company")) {
    ContentComponent = <CompanyForm />;
  } else if (currentPath.endsWith("/gallery")) {
    ContentComponent = <AdminGallery />;
  } else {
    ContentComponent = <h2>Select a section from the navigation.</h2>;
  }

  return (
    <>
      <AdminSlide />

      <main>{ContentComponent}</main>
    </>
  );
}

export default AdminDashboard;
