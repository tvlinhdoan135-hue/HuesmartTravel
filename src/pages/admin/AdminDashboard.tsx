import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Home,
  MapPin,
  Calendar,
  Compass,
  Users,
  Star,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  Image as ImageIcon,
  CalendarPlus,
  FileEdit,
  UserPlus,
  Headphones,
  Clock,
  ArrowRight,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import DestinationManager from "./DestinationManager";
import EventManager from "./EventManager";
import ItineraryManager from "./ItineraryManager";
import UserManager from "./UserManager";
import ReviewManager from "./ReviewManager";
import ArticleManager from "./ArticleManager";
import AnalyticsManager from "./AnalyticsManager";
import SettingsManager from "./SettingsManager";
import "./AdminDashboard.css";
import { getStoredSystemUsers, type SystemUser } from "../../lib/users";

type TabType =
  | "overview"
  | "destinations"
  | "events"
  | "itineraries"
  | "users"
  | "reviews"
  | "articles"
  | "stats"
  | "settings";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dateRange] = useState("01/11/2026 - 30/11/2026");
  const [timeFilter, setTimeFilter] = useState<"7" | "30" | "90">("30");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    value: string;
    x: number;
    y: number;
  } | null>(null);

  // Danh sách người dùng hệ thống đồng bộ theo thời gian thực
  const [adminUsers, setAdminUsers] = useState<SystemUser[]>(() =>
    getStoredSystemUsers()
  );

  useEffect(() => {
    const syncUsers = () => {
      setAdminUsers(getStoredSystemUsers());
    };
    window.addEventListener("storage", syncUsers);
    window.addEventListener("huesmart-users-updated", syncUsers);
    return () => {
      window.removeEventListener("storage", syncUsers);
      window.removeEventListener("huesmart-users-updated", syncUsers);
    };
  }, []);

  const latestUser = adminUsers.length > 0 ? adminUsers[0] : null;

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Chart data for 30 days
  const chartPoints30 = [
    { label: "01/11", value: "2.4k", x: 40, y: 170 },
    { label: "07/11", value: "4.8k", x: 140, y: 110 },
    { label: "10/11", value: "3.9k", x: 190, y: 135 },
    { label: "14/11", value: "5.6k", x: 260, y: 85 },
    { label: "17/11", value: "4.2k", x: 320, y: 125 },
    { label: "21/11", value: "6.8k", x: 390, y: 55 },
    { label: "24/11", value: "5.9k", x: 440, y: 80 },
    { label: "28/11", value: "5.8k", x: 500, y: 82 },
    { label: "30/11", value: "5.3k", x: 570, y: 95 },
  ];

  // Quick Action Handler
  const handleQuickAction = (actionKey: string) => {
    switch (actionKey) {
      case "add-dest":
        setActiveTab("destinations");
        showToast("Đang mở trang Quản lý địa điểm du lịch Huế");
        break;
      case "add-event":
        setActiveTab("events");
        showToast("Đang mở trang Quản lý sự kiện & lễ hội Huế");
        break;
      case "add-post":
        setActiveTab("articles");
        showToast("Đang mở trang Quản lý bài viết & cẩm nang");
        break;
      case "add-user":
        setActiveTab("users");
        showToast("Đang mở trang Quản lý người dùng & phân quyền");
        break;
      case "manage-map":
        navigate("/map");
        break;
      case "settings":
        setActiveTab("settings");
        break;
      case "stats":
        setActiveTab("stats");
        break;
      case "support":
        alert("Trung tâm Hỗ trợ Kỹ thuật & CSKH HueSmart Travel: Hotline 1900 8888 (24/7).");
        break;
      default:
        break;
    }
  };

  return (
    <div className="admin-shell">
      {/* ========================================================
          LEFT SIDEBAR (MATCHING THE SCREENSHOT EXACTLY)
      ======================================================== */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          {/* Glowing Lotus Flower Logo */}
          <div className="admin-lotus-logo">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M50 15C50 15 32 38 32 58C32 72 40 82 50 82C60 82 68 72 68 58C68 38 50 15 50 15Z"
                fill="url(#lotusCenterGrad)"
              />
              <path
                d="M50 25C43 40 18 50 16 68C14 78 22 83 32 83C42 83 48 76 50 68C48 55 50 40 50 25Z"
                fill="url(#lotusLeftGrad)"
                opacity="0.92"
              />
              <path
                d="M50 25C57 40 82 50 84 68C86 78 78 83 68 83C58 83 52 76 50 68C52 55 50 40 50 25Z"
                fill="url(#lotusRightGrad)"
                opacity="0.92"
              />
              <path
                d="M20 72C10 65 5 75 14 83C25 89 36 86 42 82C32 80 23 75 20 72Z"
                fill="#f472b6"
                opacity="0.8"
              />
              <path
                d="M80 72C90 65 95 75 86 83C75 89 64 86 58 82C68 80 77 75 80 72Z"
                fill="#f472b6"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="lotusCenterGrad" x1="50" y1="15" x2="50" y2="82" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fdf2f8" />
                  <stop offset="0.6" stopColor="#f472b6" />
                  <stop offset="1" stopColor="#c084fc" />
                </linearGradient>
                <linearGradient id="lotusLeftGrad" x1="16" y1="25" x2="50" y2="83" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fbcfe8" />
                  <stop offset="0.7" stopColor="#ec4899" />
                  <stop offset="1" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id="lotusRightGrad" x1="84" y1="25" x2="50" y2="83" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fbcfe8" />
                  <stop offset="0.7" stopColor="#ec4899" />
                  <stop offset="1" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="admin-brand-title">HueSmart Travel</div>
          <div className="admin-brand-subtitle">Admin Panel</div>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-sidebar-nav">
          <button
            type="button"
            className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("overview");
              setSidebarOpen(false);
            }}
          >
            <Home size={18} />
            <span>Tổng quan</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "destinations" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("destinations");
              setSidebarOpen(false);
            }}
          >
            <MapPin size={18} />
            <span>Quản lý điểm đến</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "events" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("events");
              setSidebarOpen(false);
            }}
          >
            <Calendar size={18} />
            <span>Quản lý sự kiện</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "itineraries" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("itineraries");
              setSidebarOpen(false);
            }}
          >
            <Compass size={18} />
            <span>Quản lý lịch trình</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("users");
              setSidebarOpen(false);
            }}
          >
            <Users size={18} />
            <span>Quản lý người dùng</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("reviews");
              setSidebarOpen(false);
            }}
          >
            <Star size={18} />
            <span>Quản lý đánh giá</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "articles" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("articles");
              setSidebarOpen(false);
            }}
          >
            <FileText size={18} />
            <span>Quản lý bài viết</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("stats");
              setSidebarOpen(false);
            }}
          >
            <BarChart2 size={18} />
            <span>Thống kê</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("settings");
              setSidebarOpen(false);
            }}
          >
            <Settings size={18} />
            <span>Cài đặt hệ thống</span>
          </button>

          <button
            type="button"
            className="admin-nav-item logout"
            onClick={() => {
              if (window.confirm("Bạn có muốn đăng xuất khỏi trang Quản trị và quay về trang chủ?")) {
                navigate("/");
              }
            }}
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </nav>

        {/* Bottom Sidebar Artwork: Imperial Citadel Silhouette + Lotus Blossoms */}
        <div className="admin-sidebar-footer-art">
          <svg viewBox="0 0 260 210" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hue Imperial Gate Line Art Silhouette */}
            <g opacity="0.38" stroke="#d8b4fe" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M70 70 C85 62 105 60 130 60 C155 60 175 62 190 70" />
              <path d="M60 70 L200 70 L195 82 L65 82 Z" />
              <path d="M50 92 C70 82 100 80 130 80 C160 80 190 82 210 92" />
              <path d="M45 92 L215 92 L208 106 L52 106 Z" />
              <line x1="75" y1="82" x2="75" y2="150" />
              <line x1="110" y1="82" x2="110" y2="150" />
              <line x1="150" y1="82" x2="150" y2="150" />
              <line x1="185" y1="82" x2="185" y2="150" />
              <path d="M115 150 V 125 A 15 15 0 0 1 145 125 V 150" />
              <path d="M80 150 V 132 A 10 10 0 0 1 100 132 V 150" />
              <path d="M160 150 V 132 A 10 10 0 0 1 180 132 V 150" />
              <line x1="30" y1="150" x2="230" y2="150" />
            </g>

            {/* Lotus Blossoms & Foliage */}
            <g>
              <ellipse cx="65" cy="192" rx="36" ry="14" fill="#047857" opacity="0.75" />
              <ellipse cx="195" cy="195" rx="34" ry="13" fill="#047857" opacity="0.7" />
              <ellipse cx="125" cy="198" rx="42" ry="14" fill="#059669" opacity="0.85" />

              <path
                d="M48 180 C48 155 36 142 48 128 C60 142 48 155 48 180 Z"
                fill="url(#footerLotusMid)"
              />
              <path
                d="M48 140 C34 148 20 162 25 178 C35 180 43 172 48 165 Z"
                fill="url(#footerLotusSide)"
              />
              <path
                d="M48 140 C62 148 76 162 71 178 C61 180 53 172 48 165 Z"
                fill="url(#footerLotusSide)"
              />

              <path
                d="M125 185 C125 168 116 158 125 148 C134 158 125 168 125 185 Z"
                fill="url(#footerLotusMid)"
              />
              <path
                d="M125 158 C114 163 103 174 108 184 C116 185 122 180 125 175 Z"
                fill="url(#footerLotusSide)"
              />
              <path
                d="M125 158 C136 163 147 174 142 184 C134 185 128 180 125 175 Z"
                fill="url(#footerLotusSide)"
              />
            </g>

            <defs>
              <linearGradient id="footerLotusMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="footerLotusSide" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </aside>

      {/* ========================================================
          MAIN VIEW CONTAINER
      ======================================================== */}
      <div className="admin-main-wrap">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Đóng / mở menu"
            >
              <Menu size={20} />
            </button>

            {/* Search Box */}
            <div className="admin-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setNotificationOpen(!notificationOpen)}
                title="Thông báo hệ thống"
              >
                <Bell size={19} />
                <span className="admin-notification-badge">3</span>
              </button>

              {notificationOpen && (
                <div className="admin-dropdown-menu" style={{ width: 280, right: 0 }}>
                  <div style={{ padding: "8px 12px", fontWeight: 700, fontSize: 13, borderBottom: "1px solid #f1edf7" }}>
                    Thông báo mới (3)
                  </div>
                  <div
                    style={{ padding: "8px 12px", fontSize: 13, borderBottom: "1px solid #faf5ff", cursor: "pointer" }}
                    onClick={() => {
                      setActiveTab("users");
                      setNotificationOpen(false);
                    }}
                  >
                    🎉 <strong>{latestUser ? latestUser.name : "Người dùng mới"}</strong> vừa đăng ký tài khoản
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{latestUser?.joinedDate || "Vừa xong"}</div>
                  </div>
                  <div
                    style={{ padding: "8px 12px", fontSize: 13, borderBottom: "1px solid #faf5ff", cursor: "pointer" }}
                    onClick={() => {
                      setActiveTab("destinations");
                      setNotificationOpen(false);
                    }}
                  >
                    📍 Điểm đến <strong>Cung An Định</strong> đã được thêm
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>14:45</div>
                  </div>
                  <div
                    style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer" }}
                    onClick={() => {
                      setActiveTab("reviews");
                      setNotificationOpen(false);
                    }}
                  >
                    ⭐ Đánh giá 5 sao mới cho <strong>Đại Nội Huế</strong>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>11:10</div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="admin-profile-pill"
                onClick={() => setUserDropdown(!userDropdown)}
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                  alt="Admin"
                  className="admin-avatar"
                />
                <span className="admin-profile-name">Admin</span>
                <ChevronDown size={14} color="#6b7280" />
              </button>

              {userDropdown && (
                <div className="admin-dropdown-menu">
                  <button
                    type="button"
                    className="admin-dropdown-item"
                    onClick={() => {
                      setActiveTab("settings");
                      setUserDropdown(false);
                    }}
                  >
                    <Settings size={15} />
                    <span>Cài đặt hệ thống</span>
                  </button>
                  <button
                    type="button"
                    className="admin-dropdown-item"
                    onClick={() => {
                      navigate("/");
                      setUserDropdown(false);
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>Về trang chủ</span>
                  </button>
                  <button
                    type="button"
                    className="admin-dropdown-item danger"
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    <LogOut size={15} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ========================================================
            TAB 1: TỔNG QUAN (OVERVIEW) — EXACT MATCH
        ======================================================== */}
        {activeTab === "overview" && (
          <main className="admin-body">
            {/* Faded Hue Citadel Watermark in top right */}
            <div className="admin-imperial-backdrop">
              <img src="/images/hero-banner.jpg" alt="Hue Imperial Watermark" />
            </div>

            {/* Page Header */}
            <div className="admin-page-header">
              <div className="admin-page-title-wrap">
                <h1 className="admin-page-title">
                  <BarChart2 size={26} />
                  <span>Tổng quan</span>
                </h1>
                <div className="admin-page-subtitle">
                  Chào mừng trở lại, Admin! 👋
                </div>
              </div>

              {/* Date Filter Pill */}
              <div
                className="admin-date-picker-badge"
                title="Khoảng thời gian thống kê"
                onClick={() => showToast("Đang hiển thị thống kê tháng 11/2026")}
              >
                <Calendar size={16} />
                <span>{dateRange}</span>
                <ChevronDown size={14} />
              </div>
            </div>

            {/* ROW 1: 4 STATS CARDS */}
            <div className="admin-stats-grid">
              {/* Card 1: Người dùng */}
              <div
                className="admin-stat-card card-purple"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("users")}
                title="Bấm để chuyển tới Quản lý người dùng"
              >
                <div className="admin-stat-left">
                  <div className="admin-stat-icon-wrap">
                    <Users size={19} />
                  </div>
                  <div className="admin-stat-number">{adminUsers.length}</div>
                  <div className="admin-stat-label-wrap">
                    <span>Người dùng hệ thống</span>
                    <span className="admin-badge-trend">↑ +{adminUsers.length} tài khoản</span>
                  </div>
                </div>
                <div className="admin-stat-chart">
                  <div className="admin-mini-bar" style={{ height: "40%" }} />
                  <div className="admin-mini-bar" style={{ height: "60%" }} />
                  <div className="admin-mini-bar" style={{ height: "50%" }} />
                  <div className="admin-mini-bar" style={{ height: "85%" }} />
                  <div className="admin-mini-bar" style={{ height: "100%" }} />
                  <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, marginLeft: 2 }}>+12%</span>
                </div>
              </div>

              {/* Card 2: Điểm đến */}
              <div
                className="admin-stat-card card-pink"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("destinations")}
                title="Bấm để chuyển tới Quản lý điểm đến"
              >
                <div className="admin-stat-left">
                  <div className="admin-stat-icon-wrap">
                    <MapPin size={19} />
                  </div>
                  <div className="admin-stat-number">856</div>
                  <div className="admin-stat-label-wrap">
                    <span>Điểm đến</span>
                    <span className="admin-badge-trend">↑ +8%</span>
                  </div>
                </div>
                <div className="admin-stat-chart">
                  <div className="admin-mini-bar" style={{ height: "45%" }} />
                  <div className="admin-mini-bar" style={{ height: "55%" }} />
                  <div className="admin-mini-bar" style={{ height: "70%" }} />
                  <div className="admin-mini-bar" style={{ height: "80%" }} />
                  <div className="admin-mini-bar" style={{ height: "95%" }} />
                  <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, marginLeft: 2 }}>+8%</span>
                </div>
              </div>

              {/* Card 3: Lịch trình đã tạo */}
              <div
                className="admin-stat-card card-amber"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("itineraries")}
                title="Bấm để chuyển tới Quản lý lịch trình"
              >
                <div className="admin-stat-left">
                  <div className="admin-stat-icon-wrap">
                    <Calendar size={19} />
                  </div>
                  <div className="admin-stat-number">428</div>
                  <div className="admin-stat-label-wrap">
                    <span>Lịch trình đã tạo</span>
                    <span className="admin-badge-trend">↑ +15%</span>
                  </div>
                </div>
                <div className="admin-stat-chart">
                  <div className="admin-mini-bar" style={{ height: "30%" }} />
                  <div className="admin-mini-bar" style={{ height: "50%" }} />
                  <div className="admin-mini-bar" style={{ height: "65%" }} />
                  <div className="admin-mini-bar" style={{ height: "85%" }} />
                  <div className="admin-mini-bar" style={{ height: "100%" }} />
                  <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, marginLeft: 2 }}>+15%</span>
                </div>
              </div>

              {/* Card 4: Đánh giá trung bình */}
              <div
                className="admin-stat-card card-green"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("reviews")}
                title="Bấm để chuyển tới Quản lý đánh giá"
              >
                <div className="admin-stat-left">
                  <div className="admin-stat-icon-wrap">
                    <Star size={19} />
                  </div>
                  <div className="admin-stat-number">3,9/5</div>
                  <div className="admin-stat-label-wrap">
                    <span>Đánh giá trung bình</span>
                    <span className="admin-badge-trend">↑ +0.2</span>
                  </div>
                </div>
                <div className="admin-stat-chart">
                  <div className="admin-mini-bar" style={{ height: "50%" }} />
                  <div className="admin-mini-bar" style={{ height: "60%" }} />
                  <div className="admin-mini-bar" style={{ height: "75%" }} />
                  <div className="admin-mini-bar" style={{ height: "85%" }} />
                  <div className="admin-mini-bar" style={{ height: "90%" }} />
                  <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, marginLeft: 2 }}>+0.2</span>
                </div>
              </div>
            </div>

            {/* ROW 2: TRAFFIC CHART & FEATURED DESTINATIONS */}
            <div className="admin-grid-row-2">
              {/* Left: Thống kê truy cập */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">
                    <BarChart2 size={18} />
                    <span>Thống kê truy cập</span>
                  </h2>

                  <div className="admin-time-pills">
                    <button
                      type="button"
                      className={`admin-time-pill ${timeFilter === "7" ? "active" : ""}`}
                      onClick={() => setTimeFilter("7")}
                    >
                      7 ngày
                    </button>
                    <button
                      type="button"
                      className={`admin-time-pill ${timeFilter === "30" ? "active" : ""}`}
                      onClick={() => setTimeFilter("30")}
                    >
                      30 ngày
                    </button>
                    <button
                      type="button"
                      className={`admin-time-pill ${timeFilter === "90" ? "active" : ""}`}
                      onClick={() => setTimeFilter("90")}
                    >
                      90 ngày
                    </button>
                    <ChevronDown size={14} />
                  </div>
                </div>

                <div className="admin-chart-container">
                  <svg className="admin-chart-svg" viewBox="0 0 600 230">
                    <defs>
                      <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c24a2" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#7c24a2" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <g opacity="0.45" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3">
                      <line x1="30" y1="40" x2="590" y2="40" />
                      <line x1="30" y1="80" x2="590" y2="80" />
                      <line x1="30" y1="120" x2="590" y2="120" />
                      <line x1="30" y1="160" x2="590" y2="160" />
                      <line x1="30" y1="200" x2="590" y2="200" strokeDasharray="0" />
                    </g>

                    <g fontSize="11" fill="#94a3b8" fontWeight="500">
                      <text x="10" y="44">8k</text>
                      <text x="10" y="84">6k</text>
                      <text x="10" y="124">4k</text>
                      <text x="10" y="164">2k</text>
                      <text x="15" y="204">0</text>
                    </g>

                    <path
                      d="M 40 170 C 90 140, 110 110, 140 110 C 170 110, 170 135, 190 135 C 220 135, 230 85, 260 85 C 290 85, 300 125, 320 125 C 350 125, 360 55, 390 55 C 415 55, 425 80, 440 80 C 470 80, 480 82, 500 82 C 535 82, 545 95, 570 95 L 570 200 L 40 200 Z"
                      fill="url(#trafficGradient)"
                    />

                    <path
                      d="M 40 170 C 90 140, 110 110, 140 110 C 170 110, 170 135, 190 135 C 220 135, 230 85, 260 85 C 290 85, 300 125, 320 125 C 350 125, 360 55, 390 55 C 415 55, 425 80, 440 80 C 470 80, 480 82, 500 82 C 535 82, 545 95, 570 95"
                      fill="none"
                      stroke="#7c24a2"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {chartPoints30.map((pt, idx) => (
                      <g
                        key={idx}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.x === 390 ? 6 : 4.5}
                          fill="#ffffff"
                          stroke="#7c24a2"
                          strokeWidth="2.5"
                        />
                      </g>
                    ))}

                    <g fontSize="11" fill="#64748b" fontWeight="500">
                      <text x="35" y="218">01/11</text>
                      <text x="135" y="218">07/11</text>
                      <text x="250" y="218">14/11</text>
                      <text x="380" y="218">21/11</text>
                      <text x="555" y="218">30/11</text>
                    </g>
                  </svg>

                  <div
                    className="admin-chart-tooltip"
                    style={{
                      left: hoveredPoint ? `${(hoveredPoint.x / 600) * 100}%` : "65%",
                      top: hoveredPoint ? `${(hoveredPoint.y / 230) * 100}%` : "24%",
                    }}
                  >
                    {hoveredPoint ? `${hoveredPoint.value} lượt truy cập` : "6.8k lượt truy cập"}
                  </div>
                </div>
              </div>

              {/* Right: Điểm đến nổi bật */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">
                    <Star size={18} />
                    <span>Điểm đến nổi bật</span>
                  </h2>
                  <button
                    type="button"
                    className="admin-card-link"
                    onClick={() => setActiveTab("destinations")}
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="admin-destinations-list">
                  {/* Item 1: Đại Nội Huế */}
                  <div
                    className="admin-destination-item"
                    onClick={() => setActiveTab("destinations")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="admin-destination-left">
                      <div className="admin-rank-medal rank-1">1</div>
                      <img
                        src="https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png"
                        alt="Đại Nội Huế"
                        className="admin-destination-thumb"
                      />
                      <div className="admin-destination-info">
                        <div className="admin-destination-name">Đại Nội Huế</div>
                        <div className="admin-destination-stats">
                          <span>12.5k lượt xem</span>
                          <span className="admin-badge-trend">↑ +20%</span>
                        </div>
                      </div>
                    </div>
                    <svg className="admin-destination-sparkline" viewBox="0 0 70 28">
                      <path
                        d="M 5 22 Q 20 5, 35 18 T 65 8"
                        fill="none"
                        stroke="#9333ea"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Item 2: Chùa Thiên Mụ */}
                  <div
                    className="admin-destination-item"
                    onClick={() => setActiveTab("destinations")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="admin-destination-left">
                      <div className="admin-rank-medal rank-2">2</div>
                      <img
                        src="https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Chua-Thien-Mu_1776821164.jpg"
                        alt="Chùa Thiên Mụ"
                        className="admin-destination-thumb"
                      />
                      <div className="admin-destination-info">
                        <div className="admin-destination-name">Chùa Thiên Mụ</div>
                        <div className="admin-destination-stats">
                          <span>9.8k lượt xem</span>
                          <span className="admin-badge-trend">↑ +15%</span>
                        </div>
                      </div>
                    </div>
                    <svg className="admin-destination-sparkline" viewBox="0 0 70 28">
                      <path
                        d="M 5 24 Q 22 12, 38 18 T 65 10"
                        fill="none"
                        stroke="#9333ea"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Item 3: Lăng Khải Định */}
                  <div
                    className="admin-destination-item"
                    onClick={() => setActiveTab("destinations")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="admin-destination-left">
                      <div className="admin-rank-medal rank-3">3</div>
                      <img
                        src="https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/74d44096-3627-4cf5-a5b5-5b71fdac2f9e_1793344049.jpg"
                        alt="Lăng Khải Định"
                        className="admin-destination-thumb"
                      />
                      <div className="admin-destination-info">
                        <div className="admin-destination-name">Lăng Khải Định</div>
                        <div className="admin-destination-stats">
                          <span>7.6k lượt xem</span>
                          <span className="admin-badge-trend">↑ +12%</span>
                        </div>
                      </div>
                    </div>
                    <svg className="admin-destination-sparkline" viewBox="0 0 70 28">
                      <path
                        d="M 5 20 Q 25 8, 42 22 T 65 12"
                        fill="none"
                        stroke="#9333ea"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: QUICK MANAGEMENT & RECENT ACTIVITIES */}
            <div className="admin-grid-row-3">
              {/* Left: Quản lý nhanh */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">
                    <span style={{ color: "#7c24a2", fontSize: 18 }}>⚡</span>
                    <span>Quản lý nhanh</span>
                  </h2>
                </div>

                <div className="admin-quick-grid">
                  <button
                    type="button"
                    className="admin-quick-btn"
                    onClick={() => handleQuickAction("add-dest")}
                  >
                    <ImageIcon size={22} />
                    <span>Thêm điểm đến</span>
                  </button>

                  <button
                    type="button"
                    className="admin-quick-btn"
                    onClick={() => handleQuickAction("add-event")}
                  >
                    <CalendarPlus size={22} />
                    <span>Tạo sự kiện</span>
                  </button>

                  <button
                    type="button"
                    className="admin-quick-btn"
                    onClick={() => handleQuickAction("add-post")}
                  >
                    <FileEdit size={22} />
                    <span>Đăng bài viết</span>
                  </button>

                  <button
                    type="button"
                    className="admin-quick-btn"
                    onClick={() => handleQuickAction("add-user")}
                  >
                    <UserPlus size={22} />
                    <span>Thêm người dùng</span>
                  </button>

                  <button
                    type="button"
                    className="admin-quick-btn"
                    onClick={() => handleQuickAction("manage-map")}
                  >
                    <MapPin size={22} />
                    <span>Quản lý bản đồ</span>
                  </button>

                  <button
                    type="button"
                    className="admin-quick-btn"
                    onClick={() => handleQuickAction("settings")}
                  >
                    <Settings size={22} />
                    <span>Cài đặt chung</span>
                  </button>

                  <button
                    type="button"
                    className="admin-quick-btn"
                    onClick={() => handleQuickAction("stats")}
                  >
                    <BarChart2 size={22} />
                    <span>Xem thống kê</span>
                  </button>

                  <button
                    type="button"
                    className="admin-quick-btn"
                    onClick={() => handleQuickAction("support")}
                  >
                    <Headphones size={22} />
                    <span>Hỗ trợ khách hàng</span>
                  </button>
                </div>
              </div>

              {/* Right: Hoạt động gần đây */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">
                    <Clock size={18} />
                    <span>Hoạt động gần đây</span>
                  </h2>
                  <button
                    type="button"
                    className="admin-card-link"
                    onClick={() => showToast("Đang hiển thị toàn bộ nhật ký hệ thống")}
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="admin-timeline">
                  {/* Item 1 */}
                  <div
                    className="admin-timeline-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("users")}
                    title="Bấm để mở Quản lý người dùng"
                  >
                    <div className="admin-timeline-dot" />
                    <div className="admin-timeline-content">
                      <div className="admin-timeline-time">{latestUser?.joinedDate || "15:30"}</div>
                      <div className="admin-timeline-icon">
                        <Users size={15} />
                      </div>
                      <div className="admin-timeline-text">
                        Người dùng mới đăng ký: <strong>{latestUser ? latestUser.name : "nguyenvan123"}</strong> {latestUser ? `(${latestUser.email})` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div
                    className="admin-timeline-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("destinations")}
                    title="Bấm để mở Quản lý điểm đến"
                  >
                    <div className="admin-timeline-dot" />
                    <div className="admin-timeline-content">
                      <div className="admin-timeline-time">14:45</div>
                      <div className="admin-timeline-icon">
                        <MapPin size={15} />
                      </div>
                      <div className="admin-timeline-text">
                        Đã thêm điểm đến mới: <strong>Cung An Định</strong>
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div
                    className="admin-timeline-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("itineraries")}
                    title="Bấm để mở Quản lý lịch trình"
                  >
                    <div className="admin-timeline-dot" />
                    <div className="admin-timeline-content">
                      <div className="admin-timeline-time">13:20</div>
                      <div className="admin-timeline-icon">
                        <Calendar size={15} />
                      </div>
                      <div className="admin-timeline-text">
                        Đã cập nhật lịch trình: <strong>Chuyến đi Huế 2 ngày 1 đêm</strong>
                      </div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div
                    className="admin-timeline-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab("reviews")}
                    title="Bấm để mở Quản lý đánh giá"
                  >
                    <div className="admin-timeline-dot" />
                    <div className="admin-timeline-content">
                      <div className="admin-timeline-time">11:10</div>
                      <div className="admin-timeline-icon">
                        <Star size={15} />
                      </div>
                      <div className="admin-timeline-text">
                        Đánh giá mới: <strong>5 sao cho Đại Nội Huế</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================
            TAB 2: QUẢN LÝ ĐIỂM ĐẾN
        ======================================================== */}
        {activeTab === "destinations" && (
          <main className="admin-body">
            <DestinationManager onNotify={showToast} />
          </main>
        )}

        {/* ========================================================
            TAB 3: QUẢN LÝ SỰ KIỆN & LỄ HỘI
        ======================================================== */}
        {activeTab === "events" && (
          <main className="admin-body">
            <EventManager onNotify={showToast} />
          </main>
        )}

        {/* ========================================================
            TAB 4: QUẢN LÝ LỊCH TRÌNH
        ======================================================== */}
        {activeTab === "itineraries" && (
          <main className="admin-body">
            <ItineraryManager onNotify={showToast} />
          </main>
        )}

        {/* ========================================================
            TAB 5: QUẢN LÝ NGƯỜI DÙNG
        ======================================================== */}
        {activeTab === "users" && (
          <main className="admin-body">
            <UserManager onNotify={showToast} />
          </main>
        )}

        {/* ========================================================
            TAB 6: QUẢN LÝ ĐÁNH GIÁ
        ======================================================== */}
        {activeTab === "reviews" && (
          <main className="admin-body">
            <ReviewManager onNotify={showToast} />
          </main>
        )}

        {/* ========================================================
            TAB 7: QUẢN LÝ BÀI VIẾT
        ======================================================== */}
        {activeTab === "articles" && (
          <main className="admin-body">
            <ArticleManager onNotify={showToast} />
          </main>
        )}

        {/* ========================================================
            TAB 8: THỐNG KÊ
        ======================================================== */}
        {activeTab === "stats" && (
          <main className="admin-body">
            <AnalyticsManager onNotify={showToast} />
          </main>
        )}

        {/* ========================================================
            TAB 9: CÀI ĐẶT HỆ THỐNG
        ======================================================== */}
        {activeTab === "settings" && (
          <main className="admin-body">
            <SettingsManager onNotify={showToast} />
          </main>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
