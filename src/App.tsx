
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import MapPage from "./pages/MapPage";
import Services from "./pages/Services";
import FoodDetail from "./pages/FoodDetail";
import Shopping from "./pages/Shopping";
import ShoppingDetail from "./pages/ShoppingDetail";
import Accommodation from "./pages/Accommodation";
import AccommodationDetail from "./pages/AccommodationDetail";
import Transport from "./pages/Transport";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import PlannerPage from "./pages/PlannerPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthPage from "./pages/auth/AuthPage";

import {
  AboutPage,
  DestinationDetailPage,
  DestinationsPage,
  EventsPage,
  ExperiencesPage,
  FavoritesPage,
  HomePage,
} from "./pages/Pages";

export default function App() {
  return (
    <Routes>
      {/* Cổng Quản trị Admin chuyên biệt */}
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="admin/*" element={<AdminDashboard />} />

      {/* Cổng Đăng ký / Đăng nhập / Tài khoản toàn màn hình chuẩn nhận diện Cố Đô */}
      <Route path="register" element={<AuthPage initialMode="register" />} />
      <Route path="login" element={<AuthPage initialMode="login" />} />
      <Route path="auth" element={<AuthPage initialMode="register" />} />
      <Route path="account" element={<AuthPage initialMode="register" />} />

      <Route element={<Layout />}>
        {/* Trang chủ */}
        <Route
          index
          element={<HomePage />}
        />

        {/* Danh sách điểm tham quan */}
        <Route
          path="destinations"
          element={<DestinationsPage />}
        />

        {/* Chi tiết điểm tham quan */}
        <Route
          path="destinations/:id"
          element={<DestinationDetailPage />}
        />

        {/* Dịch vụ du lịch và ăn uống */}
        <Route
          path="services"
          element={<Services />}
        />
        <Route
          path="services/:id"
          element={<FoodDetail />}
        />

        {/* Mua sắm */}
        <Route
          path="shopping"
          element={<Shopping />}
        />
        <Route
          path="shopping/:id"
          element={<ShoppingDetail />}
        />

        {/* Cơ sở lưu trú */}
        <Route
          path="accommodation"
          element={<Accommodation />}
        />

        <Route
          path="accommodation/:id"
          element={<AccommodationDetail />}
        />

        {/* Phương tiện di chuyển */}
        <Route
          path="transport"
          element={<Transport />}
        />

        {/* Trải nghiệm */}
        <Route
          path="experiences"
          element={<ExperiencesPage />}
        />

        {/* Tour du lịch */}
        <Route
          path="tours"
          element={<Tours />}
        />

        <Route
          path="tours/:slug"
          element={<TourDetail />}
        />

        {/* Sự kiện và lễ hội */}
        <Route
          path="events"
          element={<EventsPage />}
        />

        {/* Bản đồ du lịch */}
        <Route
          path="map"
          element={<MapPage />}
        />

        {/* Lập kế hoạch du lịch */}
        <Route
          path="planner"
          element={<PlannerPage />}
        />

        {/* Danh sách yêu thích */}
        <Route
          path="favorites"
          element={<FavoritesPage />}
        />

        {/* Giới thiệu */}
        <Route
          path="about"
          element={<AboutPage />}
        />

        {/* Chuyển về trang chủ nếu đường dẫn không tồn tại */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
        
      </Route>
    </Routes>
  );
} 
