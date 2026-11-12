
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import AIFloatingBot from "./AIFloatingBot";
import {
  Menu,
  X,
  Compass,
  Heart,
  UserRound,
  ChevronDown,
  MapPin,
  Hotel,
  Utensils,
  ShoppingBag,
  Bus,
  CalendarDays,
  Sparkles,
  Home,
  Plane,
  Map,
} from "lucide-react";
import "./Layout.css";

const exploreCategories = [
  {
    label: "Điểm tham quan",
    description: "Di tích, danh lam thắng cảnh và địa điểm nổi tiếng",
    icon: MapPin,
    to: "/destinations",
  },
  {
    label: "Cơ sở lưu trú",
    description: "Khách sạn, homestay và resort tại Huế",
    icon: Hotel,
    to: "/accommodation",
  },
  {
    label: "Ăn uống",
    description: "Khám phá ẩm thực và đặc sản xứ Huế",
    icon: Utensils,
    to: "/services",
  },
  {
    label: "Mua sắm",
    description: "Đặc sản, quà lưu niệm và sản phẩm địa phương",
    icon: ShoppingBag,
    to: "/shopping",
  },
  {
    label: "Phương tiện",
    description: "Thuê xe, taxi và phương tiện di chuyển",
    icon: Bus,
    to: "/transport",
  },
  {
    label: "Tour du lịch",
    description: "Các hành trình khám phá cố đô Huế",
    icon: Compass,
    to: "/tours",
  },
  {
    label: "Sự kiện - Lễ hội",
    description: "Lễ hội, chương trình và hoạt động văn hóa",
    icon: CalendarDays,
    to: "/events",
  },
];

const mainLinks = [
  { to: "/", label: "Trang chủ", icon: Home },
  { to: "/experiences", label: "Trải nghiệm", icon: Plane },
  { to: "/events", label: "Sự kiện", icon: CalendarDays },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

  const closeMenus = () => {
    setOpen(false);
    setExploreOpen(false);
  };

  return (
    <>
      <header className="topbar">
        <div className="nav-shell">
          <Link to="/" className="brand" onClick={closeMenus}>
            <span className="brand-mark">H</span>
            <span>
              HueSmart <b>Travel</b>
              <small>DISCOVER THE IMPERIAL CITY</small>
            </span>
          </Link>

          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>

          <nav className={open ? "nav-links show" : "nav-links"}>
            {mainLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={closeMenus}
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}

            <div
              className={`explore-dropdown ${
                exploreOpen ? "active" : ""
              }`}
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                type="button"
                className="explore-trigger"
                onClick={() => setExploreOpen((value) => !value)}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
              >
                <Compass size={17} />
                Khám phá
                <ChevronDown
                  size={15}
                  className={exploreOpen ? "chevron-rotate" : ""}
                />
              </button>

              {exploreOpen && (
                <div className="explore-menu">
                  <div className="explore-menu-heading">
                    <span className="explore-heading-icon">
                      <Sparkles size={19} />
                    </span>

                    <div>
                      <strong>Khám phá Huế</strong>
                      <small>Chọn hành trình bạn yêu thích</small>
                    </div>
                  </div>

                  <div className="explore-category-list">
                    {exploreCategories.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="explore-category"
                          onClick={closeMenus}
                        >
                          <span className="explore-category-icon">
                            <Icon size={19} />
                          </span>

                          <span className="explore-category-content">
                            <strong>{item.label}</strong>
                            <small>{item.description}</small>
                          </span>

                          <span className="explore-category-arrow">
                            ›
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/map" onClick={closeMenus}>
              <Map size={17} />
              <span>Bản đồ</span>
            </NavLink>
          </nav>

          <div className="nav-actions">
            <Link
              to="/favorites"
              aria-label="Yêu thích"
              title="Yêu thích"
              onClick={closeMenus}
            >
              <Heart size={18} />
            </Link>

            <Link
              to="/account"
              aria-label="Tài khoản"
              title="Tài khoản"
              onClick={closeMenus}
            >
              <UserRound size={18} />
            </Link>

            <Link
              className="nav-cta"
              to="/planner"
              onClick={closeMenus}
            >
              Lên kế hoạch <Compass size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Floating AI Assistant Bot */}
      <AIFloatingBot />

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <Link
              to="/"
              className="brand footer-brand"
              onClick={closeMenus}
            >
              <span className="brand-mark">H</span>
              <span>
                HueSmart <b>Travel</b>
                <small>DISCOVER THE IMPERIAL CITY</small>
              </span>
            </Link>

            <p>
              Chạm vào di sản, cảm nhận chất Huế. Đồng hành cùng bạn
              trên hành trình khám phá cố đô.
            </p>
          </div>

          <div>
            <b>Khám phá</b>
            <Link to="/destinations">Điểm tham quan</Link>
            <Link to="/experiences">Trải nghiệm</Link>
            <Link to="/tours">Tour du lịch</Link>
            <Link to="/events">Sự kiện - Lễ hội</Link>
            <Link to="/map">Bản đồ du lịch</Link>
          </div>

          <div>
            <b>Dịch vụ</b>
            <Link to="/accommodation">Cơ sở lưu trú</Link>
            <Link to="/services">Ăn uống</Link>
            <Link to="/shopping">Mua sắm</Link>
            <Link to="/transport">Phương tiện</Link>
            <Link to="/planner">Lập lịch trình</Link>
          </div>

          <div>
            <b>Thông tin</b>
            <Link to="/about">Về HueSmart Travel</Link>
            <Link to="/account">Tài khoản</Link>
            <Link to="/admin">Quản trị</Link>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 HueSmart Travel · Nền tảng du lịch thông minh
        </div>
      </footer>
    </>
  );
}
