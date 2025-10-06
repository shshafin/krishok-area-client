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
import RoleBasedRoute from "./components/privateRoute/RoleBasedRoute"; // নতুন যোগ
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

function App() {
  const location = useLocation();
  const hideHeader = ["/auth/login", "/auth/signup"];
  const showHeader = !hideHeader.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        {/* Public routes */}
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

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
