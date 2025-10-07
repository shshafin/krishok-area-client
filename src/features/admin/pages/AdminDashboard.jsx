import { useLocation } from "react-router-dom";
import CompanyForm from "../components/CompanyForm";
import AdminGallery from "../components/gallery";
import AdminSlide from "../components/AdminSlide";
import GalleryTable from "../components/GalleryTable";
import MarketPriceForm from "../components/MarketPriceForm";
import MarketPriceTable from "../components/MarketPriceTable";
import CompanyTable from "../components/CompanyTable";
import "../styles/admin.css"

function AdminDashboard() {
  const location = useLocation();
  const currentPath = location.pathname;

  let ContentComponent = null;

  if (currentPath.endsWith("/company")) {
    ContentComponent = <CompanyTable />;
  } else if (currentPath.endsWith("/company/new")) {
    ContentComponent = <CompanyForm />;
  } else if (currentPath.endsWith("/gallery/new")) {
    ContentComponent = <AdminGallery />;
  } else if (currentPath.endsWith("/gallery")) {
    ContentComponent = <GalleryTable />;
  }else if (currentPath.endsWith("/marcket-price")) {
    ContentComponent = <MarketPriceTable />;
  }else if (currentPath.endsWith("/marcket-price/new")) {
    ContentComponent = <MarketPriceForm />;
  } else {
    ContentComponent = <h2>Select a section from the navigation.</h2>;
  }

  return (
    <>
      <AdminSlide />

      <main className="content">
        <section className="fake-slide"></section>
        <section className="render-admin">{ContentComponent}</section>
      </main>
    </>
  );
}

export default AdminDashboard;
