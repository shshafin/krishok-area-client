import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Home from "@/features/home/pages/Home";
import Gallery from "@/features/gallery/pages/Gallery";
import Auth from "@/features/auth/pages/Auth";
import TableViewPage from "@/features/guidelines/pages/TableViewPage";
import DiscoverPage from "@/features/discover/page/DiscoverPage";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import PublicRoute from "./components/privateRoute/PublicRoute";
import RoleBasedRoute from "./components/privateRoute/RoleBasedRoute";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import ProfilePage from "@/features/profile/pages/Profile";
import FollowPage from "@/features/follow/pages/Follow";

import GalleryPost from "./features/gallery/pages/GalleryPost";
import GuidlinesCard from "./features/gallery/pages/GuidlinesCard";
import BlogPage from "./features/blog/pages/BlogPage";
import Weather from "./features/weather/page/WeatherPage";
import AllDistrict from "./components/ui/AllDistrict";
import SeedMarketPage from "./features/Marcket/pages/SeedMarketPage";
import MarcketPricePage from "./features/Marcket/pages/MarcketPricePage";
import CompanyPage from "./features/company/pages/CompanyPage";
import CompanyName from "./features/company/pages/CompanyName";
import ProductDetails from "./features/company/components/ProductDetails";

// Admin Pages (lazy-loaded)
const AdminLayout = lazy(() => import("./features/admin/components/AdminLayout"));
const AdminPage = lazy(() => import("./features/admin/pages/AdminPage"));
const EditProfilePage = lazy(() => import("./features/admin/pages/EditProfilePage"));
const AddPhotosPage = lazy(() => import("./features/admin/pages/AddPhotosPage"));
const AddVideosPage = lazy(() => import("./features/admin/pages/AddVideosPage"));
const AddCropCategoryPage = lazy(() => import("./features/admin/pages/AddCropCategoryPage"));
const AddCropDetailsPage = lazy(() => import("./features/admin/pages/AddCropDetailsPage"));
const AddCompanyCategoryPage = lazy(() => import("./features/admin/pages/AddCompanyCategoryPage"));
const AddProductPage = lazy(() => import("./features/admin/pages/AddProductPage"));
const ManagePostsPage = lazy(() => import("./features/admin/pages/ManagePostsPage"));
const AddDistrictPage = lazy(() => import("./features/admin/pages/AddDistrictPage"));

function App() {
  const location = useLocation();
  const adminFallback = <div className="p-4 text-center text-muted">Loading admin…</div>;
  const hideHeader = ["/auth/login", "/auth/signup", "/admin"]; // Added admin paths
  const showHeader = !hideHeader.some((path) =>
    location.pathname.startsWith(path)
  ); // Use startsWith for admin paths

  return (
    <>
      {showHeader && <Header />}

      <Routes>
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

        {/* <Route
          path="/market"
          element={
            <PrivateRoute>
              <ShowBazarRate />
            </PrivateRoute>
          }
        /> */}

        <Route
          path="/seed-market"
          element={
            <PrivateRoute>
              <SeedMarketPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/market"
          element={
            <PrivateRoute>
              <MarcketPricePage />
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
          path="/blog/:id"
          element={
            <PrivateRoute>
              <BlogPage />
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
          path="/profile"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/weather"
          element={
            <PrivateRoute>
              <Weather />
            </PrivateRoute>
          }
        />

        <Route
          path="/districts"
          element={
            <PrivateRoute>
              <AllDistrict />
            </PrivateRoute>
          }
        />

        <Route
          path="/companyes"
          element={
            <PrivateRoute>
              <CompanyPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/company/*"
          element={
            <PrivateRoute>
              <CompanyName />
            </PrivateRoute>
          }
        />

        <Route
        path="/productdetails/*"
        element={
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        } />

        {/* Role based routes */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={adminFallback}>
              {/* <RoleBasedRoute allowedRoles={["admin"]}> */}
              <AdminLayout />
              {/* </RoleBasedRoute> */}
            </Suspense>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminPage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          <Route path="media/add-photo" element={<AddPhotosPage />} />
          <Route path="media/add-video" element={<AddVideosPage />} />
          <Route path="companies/add-category" element={<AddCompanyCategoryPage />} />
          <Route path="posts/manage" element={<ManagePostsPage />} />
          <Route path="crops/add-category" element={<AddCropCategoryPage />} />
          <Route path="crops/add-details" element={<AddCropDetailsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="locations/add-district" element={<AddDistrictPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
