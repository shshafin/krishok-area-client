import AdminTest from "../components/AdminTest";
import AdminTopNavbar from "../components/AdminTopNavbar";
import Navbar from "../components/NavBar";
import "@/assets/styles/Admin.css";
import "@/assets/styles/Admin.Main.css";

export default function AdminPage() {
  return (
    <>
      <AdminTopNavbar />
      <Navbar />
      <AdminTest />
    </>
  );
}
