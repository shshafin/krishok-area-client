import { Routes, Route, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Home from "@/features/home/pages/Home";
import Gallery from "@/features/gallery/pages/Gallery";
import Auth from "@/features/auth/pages/Auth";
import TableViewPage from "@/features/guidelines/pages/TableViewPage";
import DiscoverPage from "@/features/discover/page/DiscoverPage";
import NotificationPage from "@/features/notification/page/NotificationPage";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import PublicRoute from "./components/privateRoute/PublicRoute";
import RoleBasedRoute from "./components/privateRoute/RoleBasedRoute";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import ProfilePage from "@/features/profile/pages/Profile";
import PesticidePage from "@/features/pesticide/pages/PesticidePage";
import PesticidesTable from "@/features/pestcideTable/pages/PesticidesTable";
import ShowBazarRate from "@/features/marcketrate/pages/ShowBazarRate";
import ShowBizBazar from "@/features/seed/pages/BizBazar";
import FollowPage from "@/features/follow/pages/Follow";
import PestPage from "@/features/pest/pages/pestGallery";
import ShowPestDetail from "@/features/pest/pages/ShowPestDetail";
import AdminGallery from "@/features/admin/components/Gallery";
import AdminSlide from "./features/admin/components/AdminSlide";
import CompanyForm from "./features/admin/components/CompanyForm";

function App() {
  const location = useLocation();
  const hideHeader = ["/auth/login", "/auth/signup"]; // Added admin paths
  const showHeader = !hideHeader.some(path => location.pathname.startsWith(path)); // Use startsWith for admin paths

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        {/* --- Admin Panel Routes (Nested for Layout) --- */}
        <Route path="/adminT" element={<AdminSlide />}>

          <Route index element={<AdminDashboard />} /> 
          

        </Route>
          <Route path="adminT/gallery" element={<AdminGallery />} /> 
          <Route path="adminT/company" element={<CompanyForm />} />
        
        {/* Public routes */}
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        {/* ... (Keep your other routes here, they're fine) ... */}

        {/* Private routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/follow"
          element={
            <PrivateRoute>
              <FollowPage />
            </PrivateRoute>
          }
        />
        {/* ... (All other PrivateRoutes) ... */}
        
        <Route
          path="/pesticide"
          element={
            <PrivateRoute>
              <PesticidePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/pest?"
          element={
            <PrivateRoute>
              <PestPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/pest/details?"
          element={
            <PrivateRoute>
              <ShowPestDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/pesticide/table?"
          element={
            <PrivateRoute>
              <PesticidesTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/market"
          element={
            <PrivateRoute>
              <ShowBazarRate />
            </PrivateRoute>
          }
        />

        <Route
          path="/seed-market"
          element={
            <PrivateRoute>
              <ShowBizBazar />
            </PrivateRoute>
          }
        />

        <Route
          path="/user?"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/gallery"
          element={
            <PrivateRoute>
              <Gallery />
            </PrivateRoute>
          }
        />
        <Route
          path="/guidelines"
          element={
            <PrivateRoute>
              <TableViewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/discover"
          element={
            <PrivateRoute>
              <DiscoverPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* Role based routes */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;