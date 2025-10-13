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

import GalleryPost from "./features/gallery/pages/GalleryPost";
import GuidlinesCard from "./features/gallery/pages/GuidlinesCard";

function App() {
  const location = useLocation();
  const hideHeader = ["/auth/login", "/auth/signup"]; // Added admin paths
  const showHeader = !hideHeader.some((path) =>
    location.pathname.startsWith(path)
  ); // Use startsWith for admin paths

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        <Route path="adminT/*" element={<AdminDashboard />} />

        {/* Public routes */}
        <Route
          path="/auth/*"
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

        <Route path="/post/*" element={<GalleryPost />} />

        <Route path="/insects/*" element={<GuidlinesCard />} />

        <Route path="/disease/*" element={<GuidlinesCard />} />

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
          path="/videos"
          element={
            <PrivateRoute>
              <Gallery type="video" />
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
