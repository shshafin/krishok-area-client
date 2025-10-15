import AdminTest from "../components/AdminTest";
import AdminTopNavbar from "../components/AdminTopNavbar";
import Navbar from "../components/NavBar";
import "@/assets/styles/Admin.css";

export default function AdminPage() {
  return (
    <>
      <AdminTopNavbar />
      <Navbar />
      <AdminTest />
    </>
  );
}
