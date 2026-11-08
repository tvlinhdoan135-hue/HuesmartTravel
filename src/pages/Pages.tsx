
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Search,
  MapPin,
  Clock3,
  Star,
  Heart,
  CalendarDays,
  Sparkles,
  Hotel,
  Utensils,
  Car,
  ShoppingBag,
  Compass,
  Landmark,
  Camera,
  Flower2,
  Trees,
  LayoutGrid,
  List,
  ChevronDown,
  ArrowLeft,
  Share2,
  ExternalLink,
  LogIn,
  LogOut,
  Trash2,
  CheckCircle2,
  X,
  Clock,
  CalendarPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice, tours } from "./Tours";
import AdminDashboard from "./admin/AdminDashboard";
import { recordUserRegistration } from "../lib/users";
import { autoScheduleToItinerary } from "../services/itineraryService";
import "../styles/experiences.css";

import {
  experiences,
  serviceGroups,
  getAllDestinations,
  type TravelItem,
  type HueExperience,
} from "../data";

// ==============================
// ĐỒNG BỘ DỮ LIỆU ĐỊA ĐIỂM
// ==============================

function useDestinations() {
  const [items, setItems] = useState<TravelItem[]>(() =>
    getAllDestinations()
  );

  useEffect(() => {
    const refresh = () => setItems(getAllDestinations());

    window.addEventListener(
      "huesmart-destinations-updated",
      refresh
    );
    window.addEventListener("storage", refresh);

    refresh();

    return () => {
      window.removeEventListener(
        "huesmart-destinations-updated",
        refresh
      );
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return items;
}

// ==============================
// COMPONENT DÙNG CHUNG
// ==============================

function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  className = "",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  className?: string;
}) {
  const overlay =
    className === "destinations-hero"
      ? "linear-gradient(90deg,rgba(7,38,33,.88) 0%,rgba(7,38,33,.68) 42%,rgba(7,38,33,.12) 100%),linear-gradient(0deg,rgba(7,38,33,.24),transparent 55%)"
      : "linear-gradient(90deg,rgba(8,35,31,.84),rgba(8,35,31,.25))";

  return (
    <section
      className={`page-hero ${className}`.trim()}
      style={{
        backgroundImage: `${overlay},url("${image}")`,
      }}
    >
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function SectionTitle({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-title">
      <span className="eyebrow dark">{label}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

// ==============================
// THẺ ĐỊA ĐIỂM
// ==============================

function DestinationCard({ item }: { item: TravelItem }) {
  const priceRange = item.price.split(/\s*-\s*/);
  const priceLabel =
    priceRange.length === 2
      ? priceRange[0] === priceRange[1]
        ? `Từ ${priceRange[0]}`
        : `${priceRange[0]} – ${priceRange[1]}`
      : item.price === "Liên hệ"
        ? "Giá Liên hệ"
        : item.price;

  const [saved, setSaved] = useState(() => {
    try {
      const list: string[] = JSON.parse(
        localStorage.getItem("huesmart-favorites") || "[]"
      );
      return list.includes(item.id);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const refresh = () => {
      try {
        const list: string[] = JSON.parse(
          localStorage.getItem("huesmart-favorites") || "[]"
        );
        setSaved(list.includes(item.id));
      } catch {
        setSaved(false);
      }
    };

    window.addEventListener("storage", refresh);
    window.addEventListener(
      "huesmart-favorites-updated",
      refresh
    );

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "huesmart-favorites-updated",
        refresh
      );
    };
  }, [item.id]);

  function toggle() {
    let list: string[] = [];

    try {
      list = JSON.parse(
        localStorage.getItem("huesmart-favorites") || "[]"
      );
    } catch {
      list = [];
    }

    const next = list.includes(item.id)
      ? list.filter((id) => id !== item.id)
      : [...list, item.id];

    localStorage.setItem(
      "huesmart-favorites",
      JSON.stringify(next)
    );

    setSaved(next.includes(item.id));

    window.dispatchEvent(
      new Event("huesmart-favorites-updated")
    );
  }

  return (
    <motion.article
      className="place-card"
      whileHover={{ y: -6 }}
    >
      <div className="place-image">
        <img
          src={item.image}
          alt={item.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/images/hero-banner.jpg";
          }}
        />
        <span className="pill">{item.category}</span>

        <button
          type="button"
          className={saved ? "save-btn saved" : "save-btn"}
          onClick={toggle}
          aria-label={
            saved ? "Bỏ địa điểm khỏi yêu thích" : "Lưu yêu thích"
          }
        >
          <Heart
            size={18}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="place-body">
        <div className="place-meta">
          <span>
            <Star size={14} fill="currentColor" />{" "}
            <strong className="destination-rating-score">
              {item.rating > 0 ? item.rating.toFixed(1) : "Chưa đánh giá"}
            </strong>
            {item.ratingCount !== undefined && item.ratingCount > 0
              ? <span className="destination-rating-count">
                  / 5 · {item.ratingCount} lượt đánh giá
                </span>
              : ""}
          </span>
        </div>

        <h3>{item.name}</h3>
        <p>{item.description}</p>

        <div className="destination-card-info">
          <span title={item.address}>
            <MapPin size={16} />
            <span className="destination-address-text">{item.address}</span>
          </span>
          <span>
            <Clock3 size={16} /> Giờ mở cửa:{" "}
            {item.openingHours ?? "Vui lòng liên hệ"}
          </span>
        </div>

        <div className="place-bottom">
          <span className="place-price">{priceLabel}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              className="destination-quick-plan-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                autoScheduleToItinerary(item);
              }}
              title="Tự động thêm điểm đến này vào Lịch trình du lịch"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 8,
                background: "#f3e8ff",
                color: "#6d28d9",
                border: "1px solid #ddd6fe",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <CalendarPlus size={14} />
              <span>Lên lịch</span>
            </button>
            <Link to={`/destinations/${item.id}`}>
              Chi tiết <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ==============================
// TRANG CHỦ
// ==============================

export function HomePage() {
  const allDestinations = useDestinations();
  const [showAllTours, setShowAllTours] = useState(false);

  const quickLinks = [
    {
      title: "Điểm tham quan",
      description: "Di tích và danh thắng",
      to: "/destinations",
      icon: <Landmark size={27} />,
      color: "quick-green",
    },
    {
      title: "Cơ sở lưu trú",
      description: "Khách sạn, homestay",
      to: "/accommodation",
      icon: <Hotel size={25} />,
      color: "quick-yellow",
    },
    {
      title: "Dịch vụ du lịch",
      description: "Tiện ích cho chuyến đi",
      to: "/services",
      icon: <Utensils size={25} />,
      color: "quick-purple",
    },
    {
      title: "Mua sắm",
      description: "Đặc sản và quà tặng",
      to: "/shopping",
      icon: <ShoppingBag size={25} />,
      color: "quick-green",
    },
    {
      title: "Di chuyển",
      description: "Phương tiện khám phá Huế",
      to: "/transport",
      icon: <Car size={25} />,
      color: "quick-purple",
    },
    {
      title: "Tour du lịch",
      description: "Hành trình được gợi ý",
      to: "/tours",
      icon: <Compass size={25} />,
      color: "quick-green",
    },
    {
      title: "Sự kiện & lễ hội",
      description: "Văn hóa và hoạt động",
      to: "/events",
      icon: <CalendarDays size={25} />,
      color: "quick-yellow",
    },
    {
      title: "Bản đồ du lịch",
      description: "Khám phá theo vị trí",
      to: "/map",
      icon: <MapPin size={25} />,
      color: "quick-purple",
    },
  ];

  return (
    <>
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-banner.jpg"
          aria-hidden="true"
        >
          <source src="/video/hue-banner.mp4" type="video/mp4" />
        </video>
        <div className="hero-backdrop" />

        <div className="container hero-content">
          <span className="eyebrow">
            THE SOUL OF CENTRAL VIETNAM
          </span>

          <h1>
            Huế – nơi di sản
            <br />
            <em>chạm đến cảm xúc.</em>
          </h1>

          <p>
            Khám phá cố đô theo cách riêng của bạn. Tìm điểm đến,
            trải nghiệm văn hóa và tạo hành trình thông minh chỉ
            trong vài bước.
          </p>

          <div className="hero-buttons">
            <Link className="btn btn-gold" to="/destinations">
              Khám phá Huế <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-glass" to="/planner">
              <Sparkles size={17} /> Tạo lịch trình
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <span className="hero-stat-icon"><Landmark size={20} /></span>
              <span className="hero-stat-copy">
                <b>Di sản</b>
                <small>Văn hóa nghìn năm</small>
              </span>
            </div>
            <div>
              <span className="hero-stat-icon"><Utensils size={20} /></span>
              <span className="hero-stat-copy">
                <b>Ẩm thực</b>
                <small>Hương vị cố đô</small>
              </span>
            </div>
            <div>
              <span className="hero-stat-icon"><Camera size={20} /></span>
              <span className="hero-stat-copy">
                <b>Trải nghiệm</b>
                <small>Hành trình của bạn</small>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          SCROLL TO DISCOVER ↓
        </div>
      </section>

      <section className="search-panel container">
        <div>
          <span className="eyebrow dark">
            BẮT ĐẦU HÀNH TRÌNH
          </span>
          <h2>Bạn muốn khám phá điều gì?</h2>
        </div>

        <div className="search-shortcuts">
          <Link to="/destinations">
            <MapPin /> Điểm đến
          </Link>
          <Link to="/services">
            <Hotel /> Dịch vụ
          </Link>
          <Link to="/experiences">
            <Compass /> Trải nghiệm
          </Link>
          <Link to="/planner">
            <CalendarDays /> Lịch trình
          </Link>
        </div>
      </section>

      {/* KHÁM PHÁ NHANH */}
      <section className="quick-explore section container">
        <div className="quick-explore-heading">
          <div>
            <span className="quick-explore-eyebrow">
              <Compass size={22} />
              DISCOVER HUE
            </span>
            <h2>Khám phá nhanh</h2>
            <p>
              Bắt đầu hành trình khám phá cố đô chỉ với một chạm.
            </p>
            <span className="quick-explore-heading-rule" />
          </div>
        </div>

        <div className="quick-explore-grid">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              to={link.to}
              className={`quick-explore-card ${link.color}`}
            >
              <span className="quick-explore-icon">
                {link.icon}
              </span>

              <span className="quick-explore-label">
                <strong>{link.title}</strong>
                <small>{link.description}</small>
              </span>

              <ArrowRight
                className="quick-explore-arrow"
                size={18}
              />
            </Link>
          ))}
        </div>

        <div className="quick-explore-more">
          <Link to="/destinations">
            Khám phá tất cả <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <section className="section container home-destinations-section">
        <SectionTitle
          label="DESTINATIONS"
          title="Những điểm đến không thể bỏ lỡ"
          text="Từ dấu ấn hoàng cung đến cảnh sắc thiên nhiên yên bình của xứ Huế."
        />

        <div className="card-grid home-destinations-grid">
          {allDestinations.slice(0, 4).map((item) => (
            <DestinationCard key={item.id} item={item} />
          ))}
        </div>

        {allDestinations.length === 0 && (
          <div className="empty-state">
            Chưa có địa điểm nào được cập nhật.
          </div>
        )}

        <div className="center home-destinations-more">
          <Link to="/destinations">
            Xem thêm{" "}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section container home-tours-section">
        <div className="home-tours-heading">
          <span className="home-tours-icon">
            <Compass size={22} />
          </span>
          <div>
            <h2>Tour du lịch</h2>
            <p>Khám phá các hành trình hấp dẫn tại Huế.</p>
          </div>
        </div>

        <div className="home-tours-grid" id="home-tours-grid">
          {tours.slice(0, showAllTours ? tours.length : 4).map((tour) => (
            <article className="home-tour-card" key={tour.id}>
              <div className="home-tour-image">
                <img src={tour.image} alt={tour.name} loading="lazy" />
                <span>{tour.category}</span>
              </div>
              <div className="home-tour-content">
                <h3 title={tour.name}>{tour.name}</h3>
                <p className="home-tour-location">
                  Khởi hành tại {tour.location}
                </p>
                <div className="home-tour-facts">
                  <span>
                    <Clock3 size={17} /> Thời gian: <strong>{tour.duration}</strong>
                  </span>
                  <span>
                    <CalendarDays size={17} /> {tour.schedule}
                  </span>
                  <span>
                    <MapPin size={17} /> Đánh giá: <strong>{tour.rating.toFixed(1)} / 5</strong>
                  </span>
                </div>
                <div className="home-tour-footer">
                  <strong>Từ {formatPrice(tour.price)}</strong>
                  <Link to={`/tours/${tour.slug}`}>Chi tiết <ArrowRight size={15} /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {tours.length > 4 && (
          <div className="home-tours-more">
            <button
              type="button"
              onClick={() => setShowAllTours((expanded) => !expanded)}
              aria-expanded={showAllTours}
              aria-controls="home-tours-grid"
            >
              {showAllTours ? "Thu gọn" : "Xem thêm"}
              <ChevronDown size={17} />
            </button>
          </div>
        )}
      </section>

      <section className="experience-showcase-band">
        <div className="experience-showcase-bg">
          <img
            src="/images/ngo-mon-lotus.jpg"
            alt="Ngọ Môn Cố Đô Huế bên hồ sen"
            className="experience-showcase-photo"
          />
          <div className="experience-showcase-gradient" />
        </div>

        <div className="container experience-showcase-inner">
          <div className="experience-showcase-content">
            <div className="experience-showcase-badge">
              <Sparkles size={14} />
              <span>LOCAL EXPERIENCES</span>
            </div>

            <h2 className="experience-showcase-title">
              Không chỉ tham quan.
              <br />
              <em>Hãy sống như người Huế.</em>
            </h2>

            <p className="experience-showcase-desc">
              Khám phá cố đô, chạm vào nhịp sống chậm, thưởng thức ẩm thực truyền
              thống và tận hưởng trọn vẹn vẻ đẹp bình yên, thơ mộng của xứ Huế.
            </p>

            <div className="experience-showcase-chips">
              <span className="exp-chip">
                <Compass size={13} /> Trải nghiệm văn hóa
              </span>
              <span className="exp-chip">
                <Landmark size={13} /> Di sản Cố Đô
              </span>
              <span className="exp-chip">
                <Utensils size={13} /> Ẩm thực chuẩn vị
              </span>
            </div>

            <div className="experience-showcase-actions">
              <Link
                to="/experiences"
                className="btn btn-gold exp-cta-btn"
                title="Khám phá các trải nghiệm Huế"
              >
                Khám phá trải nghiệm <ArrowRight size={16} />
              </Link>
              <Link
                to="/planner"
                className="btn exp-sub-btn"
                title="Lên lịch trình khám phá Huế"
              >
                <CalendarDays size={16} /> Lên lịch trình
              </Link>
            </div>
          </div>

          <div className="experience-showcase-card-tag">
            <div className="exp-tag-pill">
              <MapPin size={14} />
              <span>Ngọ Môn &amp; Hồ Sen Đại Nội</span>
              <small>Di sản UNESCO</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionTitle
          label="SMART TRAVEL"
          title="Một nền tảng – trọn hành trình"
          text="Tìm dịch vụ, lưu địa điểm yêu thích và lên kế hoạch du lịch theo nhu cầu."
        />

        <div className="service-grid">
          {serviceGroups.slice(0, 4).map((service, index) => (
            <Link
              to="/services"
              className="service-tile"
              key={service.title}
            >
              <span className="service-icon">
                {[
                  <Hotel key="hotel" />,
                  <Utensils key="food" />,
                  <Compass key="compass" />,
                  <Car key="car" />,
                ][index]}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-strip">
        <div className="container">
          <div>
            <span className="eyebrow">
              YOUR JOURNEY STARTS HERE
            </span>
            <h2>Sẵn sàng cho chuyến đi Huế?</h2>
            <p>
              Hãy để HueSmart Travel giúp bạn lên kế hoạch phù hợp.
            </p>
          </div>

          <Link className="btn btn-gold" to="/planner">
            Lập lịch trình ngay <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}

// ==============================
// TRANG ĐIỂM THAM QUAN
// ==============================

export function DestinationsPage() {
  const allDestinations = useDestinations();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("default");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(
    () => {
      const results = allDestinations.filter(
        (destination) =>
          (cat === "Tất cả" || destination.category === cat) &&
          `${destination.name} ${destination.description} ${destination.address}`
            .toLocaleLowerCase("vi")
            .includes(q.toLocaleLowerCase("vi"))
      );

      if (sortBy === "rating") {
        return results.sort((a, b) => b.rating - a.rating);
      }

      if (sortBy === "name") {
        return results.sort((a, b) =>
          a.name.localeCompare(b.name, "vi")
        );
      }

      return results;
    },
    [allDestinations, q, cat, sortBy]
  );

  return (
    <div className="destinations-page">
      <PageHero
        className="destinations-hero"
        eyebrow="EXPLORE HUE"
        title="Điểm tham quan"
        subtitle="Tìm kiếm những di sản, danh thắng và góc bình yên của cố đô."
        image="/images/hero-banner.jpg"
      />

      <section className="destinations-section container">
        <div className="destination-filter-panel">
          <label className="destination-search">
            <Search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Tìm điểm đến"
              placeholder="Tìm địa điểm, khu vực..."
            />
          </label>

          <div className="destination-categories" aria-label="Lọc theo danh mục">
            {[
              { label: "Tất cả", icon: <LayoutGrid size={15} /> },
              { label: "Di tích", icon: <Landmark size={15} /> },
              { label: "Tâm linh", icon: <Flower2 size={15} /> },
              { label: "Thiên nhiên", icon: <Trees size={15} /> },
              { label: "Ẩm thực", icon: <Utensils size={15} /> },
              { label: "Khám phá", icon: <Compass size={15} /> },
              { label: "Nông thôn", icon: <Trees size={15} /> },
              { label: "Không gian công cộng", icon: <MapPin size={15} /> },
              { label: "Văn hoá", icon: <Landmark size={15} /> },
            ].map(({ label, icon }) => (
              <button
                type="button"
                className={`destination-category${cat === label ? " active" : ""}`}
                key={label}
                onClick={() => setCat(label)}
                aria-pressed={cat === label}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <label className="destination-sort">
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sắp xếp địa điểm"
            >
              <option value="default">Mặc định</option>
              <option value="rating">Đánh giá cao</option>
              <option value="name">Tên A–Z</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="destination-results-bar">
          <div className="destination-result-count">
            <Flower2 size={21} />
            <span>
              Có <strong>{filtered.length}</strong> địa điểm phù hợp
            </span>
          </div>

          <div className="destination-view-toggle" aria-label="Kiểu hiển thị">
            <button
              type="button"
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
              aria-label="Hiển thị dạng lưới"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              type="button"
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
              aria-label="Hiển thị dạng danh sách"
              aria-pressed={view === "list"}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className={`card-grid destinations-grid ${view}`}>
          {filtered.map((item) => (
            <DestinationCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            Không tìm thấy địa điểm phù hợp.
          </div>
        )}

        {filtered.length > 0 && (
          <div className="destinations-endmark" aria-hidden="true">
            <span />
            <Flower2 size={23} />
            <span />
          </div>
        )}
      </section>
    </div>
  );
}

// ==============================
// CHI TIẾT ĐỊA ĐIỂM
// ==============================

export function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shareMessage, setShareMessage] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const allDestinations = useDestinations();

  const item = allDestinations.find(
    (destination) => destination.id === id
  );

  if (!item) {
    return (
      <section className="section container">
        <h2>Không tìm thấy địa điểm</h2>
        <Link to="/destinations">
          Quay lại điểm tham quan
        </Link>
      </section>
    );
  }

  const destination = item;
  const photos = item.gallery?.length ? item.gallery : [item.image];

  async function shareDestination() {
    const shareData = {
      title: destination.name,
      text: destination.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("");
        return;
      }

      if (!navigator.clipboard) {
        setShareMessage("Trình duyệt không hỗ trợ chia sẻ liên kết.");
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      setShareMessage("Đã sao chép liên kết địa điểm.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareMessage("Không thể chia sẻ địa điểm. Vui lòng thử lại.");
    }
  }

  function addToItinerary() {
    try {
      const res = autoScheduleToItinerary(destination);
      setShareMessage(res.message);
    } catch {
      setShareMessage("Không thể thêm địa điểm vào lịch trình. Vui lòng thử lại.");
    }
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${item.name}, ${item.address}`
  )}`;

  return (
    <main className="destination-detail-page">
      <div className="destination-detail-container">
        <nav className="destination-breadcrumb" aria-label="Điều hướng">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/destinations">Điểm tham quan</Link>
          <span>/</span>
          <span aria-current="page">{item.name}</span>
        </nav>

        <header className="destination-detail-heading">
          <div className="destination-detail-title">
            <span className="destination-detail-category">{item.category}</span>
            <h1>{item.name}</h1>
            <p>
              <MapPin size={17} />
              {item.address}
            </p>
          </div>

          <div className="destination-detail-actions">
            <button
              type="button"
              className="detail-icon-action"
              onClick={() => navigate(-1)}
              aria-label="Quay lại trang trước"
              title="Quay lại"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="detail-icon-action"
              onClick={() => void shareDestination()}
              aria-label="Chia sẻ địa điểm"
              title="Chia sẻ"
            >
              <Share2 size={18} />
            </button>
            <a
              className="detail-map-action"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={17} />
              Xem bản đồ
              <ExternalLink size={14} />
            </a>
            <button
              type="button"
              className="detail-plan-action"
              onClick={addToItinerary}
              title="Tự động thêm vào lịch trình"
            >
              Lên lịch trình
              <CalendarDays size={16} />
            </button>
          </div>
        </header>

        {shareMessage && (
          <p className="destination-share-message" role="status">
            {shareMessage}
          </p>
        )}

        <section
          className={`destination-detail-feature ${photos.length > 1 ? "has-gallery" : ""}`}
        >
          <div className="destination-detail-photo">
            <img
              src={photos[selectedPhoto]}
              alt={`${item.name} - hình ảnh ${selectedPhoto + 1}`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/images/hero-banner.jpg";
              }}
            />
            <span className="destination-photo-caption">
              Khám phá {item.name}
            </span>
          </div>
          {photos.length > 1 && (
            <div className="destination-detail-thumbnails" aria-label="Thư viện ảnh">
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={`${photo}-${index}`}
                  className={`destination-detail-thumbnail ${selectedPhoto === index ? "active" : ""}`}
                  onClick={() => setSelectedPhoto(index)}
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-pressed={selectedPhoto === index}
                >
                  <img
                    src={photo}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "/images/hero-banner.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="destination-detail-summary">
          <div className="destination-summary-main">
            <span className="eyebrow dark">GIỚI THIỆU</span>
            <h2>Tóm tắt</h2>
            <p>{item.description}</p>

            <div className="destination-detail-divider" />

            <div className="destination-long-description">
              <h2>Nội dung chi tiết</h2>
              {item.details?.length ? (
                item.details.map((section) => (
                  <section
                    className="destination-detail-section"
                    key={section.heading}
                  >
                    <h3>{section.heading}</h3>
                    {section.paragraphs?.map((paragraph, index) => (
                      <p key={`${section.heading}-paragraph-${index}`}>
                        {paragraph}
                      </p>
                    ))}
                    {section.points && section.points.length > 0 && (
                      <ul>
                        {section.points.map((point) => (
                          <li key={point.title}>
                            <strong>{point.title}:</strong>{" "}
                            {point.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))
              ) : (
                <>
                  <p>{item.description}</p>
                  <p>
                    Thời lượng tham quan gợi ý:{" "}
                    <strong>{item.duration}</strong>. Vui lòng kiểm tra
                    thông tin thực tế trước chuyến đi vì giờ hoạt động và giá
                    vé có thể thay đổi.
                  </p>
                </>
              )}
            </div>
          </div>

          <aside className="destination-facts-card">
            <span className="eyebrow dark">THÔNG TIN THAM QUAN</span>
            <h2>Thông tin địa điểm</h2>

            <div className="destination-fact">
              <span>Loại hình</span>
              <strong>Điểm du lịch, tài nguyên</strong>
            </div>
            <div className="destination-fact">
              <span>Lĩnh vực</span>
              <strong>{item.category}</strong>
            </div>
            <div className="destination-fact">
              <span>Giờ mở cửa</span>
              <strong className="highlight">
                {item.openingHours ?? "Vui lòng liên hệ"}
              </strong>
            </div>
            <div className="destination-fact">
              <span>Mức giá</span>
              <strong>{item.price || "Liên hệ"}</strong>
            </div>
            <div className="destination-fact">
              <span>Địa chỉ</span>
              <strong>{item.address}</strong>
            </div>

            <div className="destination-rating-card">
              <Star size={20} fill="currentColor" />
              <strong>
                {item.rating > 0 ? item.rating.toFixed(1) : "Chưa có"}
                {item.rating > 0 && <small>/ 5</small>}
              </strong>
              <span>
                {item.ratingCount !== undefined
                  ? `${item.ratingCount.toLocaleString("vi-VN")} lượt đánh giá`
                  : "Đánh giá tham khảo"}
              </span>
            </div>

            <a
              className="destination-facts-map"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={15} />
              Mở trong bản đồ
              <ExternalLink size={14} />
            </a>

            <button
              type="button"
              className="detail-plan-wide"
              onClick={addToItinerary}
            >
              Thêm vào lịch trình
              <ArrowRight size={17} />
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}

// ==============================
// TRANG TRẢI NGHIỆM
// ==============================

export function ExperiencesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState<"popular" | "rating" | "price">("popular");
  const [activeModalExp, setActiveModalExp] = useState<HueExperience | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Danh sách ID yêu thích từ localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("huesmart-favorites") || "[]");
    } catch {
      return [];
    }
  });

  const categories = [
    { id: "all", label: "Tất cả trải nghiệm", icon: "✨" },
    { id: "culture", label: "Văn hóa & Âm nhạc", icon: "🎭" },
    { id: "craft", label: "Làng nghề thủ công", icon: "🏮" },
    { id: "food", label: "Ẩm thực & Trà đạo", icon: "🍲" },
    { id: "heritage", label: "Di sản & Hoàng gia", icon: "🏛️" },
    { id: "nature", label: "Sinh thái & Sông Hương", icon: "🚣" },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const toggleFavorite = (id: string, title: string) => {
    let next: string[];
    if (favoriteIds.includes(id)) {
      next = favoriteIds.filter((item) => item !== id);
      showToast(`Đã bỏ "${title}" khỏi danh sách yêu thích`);
    } else {
      next = [...favoriteIds, id];
      showToast(`Đã thêm "${title}" vào mục yêu thích ❤️`);
    }
    setFavoriteIds(next);
    localStorage.setItem("huesmart-favorites", JSON.stringify(next));
    window.dispatchEvent(new Event("huesmart-favorites-updated"));
  };

  const handleAddToPlanner = (exp: HueExperience) => {
    try {
      const res = autoScheduleToItinerary({
        id: exp.id,
        name: exp.title,
        category: exp.category,
        image: exp.image,
        address: exp.location,
        price: exp.priceText,
        duration: exp.duration,
        rating: exp.rating,
        note: `Trải nghiệm Huế: ${exp.text}`,
      });
      showToast(res.message);
    } catch {
      showToast("Không thể thêm vào lịch trình. Vui lòng thử lại.");
    }
  };

  // Lọc và sắp xếp trải nghiệm
  const filteredExperiences = useMemo(() => {
    const list = experiences.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    if (selectedSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "price") {
      list.sort((a, b) => a.priceText.localeCompare(b.priceText));
    } else {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [searchQuery, selectedCategory, selectedSort]);

  return (
    <div style={{ backgroundColor: "#fcfaff", minHeight: "100vh" }}>
      {/* Hero Header */}
      <section className="exp-hero">
        <div className="exp-hero-bg" />
        <div className="exp-hero-content">
          <span className="exp-eyebrow">
            <Sparkles size={14} /> DISCOVER LOCAL EXPERIENCES
          </span>
          <h1 className="exp-hero-title">Khám phá Trải nghiệm xứ Huế</h1>
          <p className="exp-hero-subtitle">
            Không chỉ là tham quan ngắm cảnh, hãy đắm chìm vào nếp sống cung đình, làng nghề trăm tuổi,
            ẩm thực tao nhã và nhịp đập êm đềm của mảnh đất Cố Đô.
          </p>

          <div className="exp-stats-row">
            <div className="exp-stat-pill">
              <span>🏮</span>
              <span>10+ Trải nghiệm độc bản</span>
            </div>
            <div className="exp-stat-pill">
              <span>⭐</span>
              <span>Đánh giá trung bình 4.9/5</span>
            </div>
            <div className="exp-stat-pill">
              <span>🧭</span>
              <span>Dễ dàng đưa vào lịch trình AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Toolbar & Category Filters */}
      <div className="exp-toolbar-wrap">
        <div className="exp-toolbar">
          <div className="exp-toolbar-top">
            <div className="exp-search-box">
              <Search size={18} className="exp-search-icon" />
              <input
                type="text"
                className="exp-search-input"
                placeholder="Tìm trải nghiệm (ví dụ: ca Huế, làm hương, chèo SUP, ẩm thực, cổ phục...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="exp-toolbar-actions">
              <select
                className="exp-sort-select"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                aria-label="Sắp xếp trải nghiệm"
              >
                <option value="popular">Phổ biến & Đặt nhiều nhất</option>
                <option value="rating">Đánh giá cao nhất (4.9+)</option>
                <option value="price">Giá vé tham khảo</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="exp-categories-row">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`exp-category-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Experiences */}
      <main className="exp-container">
        <div className="exp-results-header">
          <div className="exp-results-count">
            Hiển thị <strong>{filteredExperiences.length}</strong> trải nghiệm phù hợp
          </div>
          {searchQuery && (
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setSearchQuery("")}
              style={{ fontSize: 12, padding: "4px 10px" }}
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>

        <div className="exp-grid">
          {filteredExperiences.map((exp) => {
            const isFav = favoriteIds.includes(exp.id);
            return (
              <article key={exp.id} className="exp-card">
                <div className="exp-card-media">
                  <img src={exp.image} alt={exp.title} className="exp-card-img" loading="lazy" />
                  <span className="exp-card-tag">{exp.tag}</span>

                  <button
                    type="button"
                    className={`exp-card-fav-btn ${isFav ? "active" : ""}`}
                    onClick={() => toggleFavorite(exp.id, exp.title)}
                    title={isFav ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
                    aria-label="Yêu thích"
                  >
                    <Heart size={18} fill={isFav ? "#e11d48" : "none"} />
                  </button>

                  <span className="exp-card-duration">
                    <Clock size={13} color="#6d28d9" />
                    <span>{exp.duration}</span>
                  </span>
                </div>

                <div className="exp-card-body">
                  <div className="exp-card-meta">
                    <div className="exp-card-rating">
                      <Star size={14} fill="#d97706" color="#d97706" />
                      <span>{exp.rating}</span>
                      <span style={{ color: "#94a3b8", fontWeight: 400 }}>({exp.reviewCount})</span>
                    </div>

                    <div className="exp-card-location" title={exp.location}>
                      <MapPin size={13} color="#7c3aed" />
                      <span>{exp.location.split(",")[0]}</span>
                    </div>
                  </div>

                  <h3 className="exp-card-title" onClick={() => setActiveModalExp(exp)}>
                    {exp.title}
                  </h3>

                  <p className="exp-card-desc">{exp.text}</p>

                  <div className="exp-card-highlights">
                    {exp.highlights.slice(0, 2).map((hl, i) => (
                      <span key={i} className="exp-highlight-pill">
                        ✓ {hl}
                      </span>
                    ))}
                  </div>

                  <div className="exp-card-footer">
                    <div className="exp-card-price-wrap">
                      <span className="exp-card-price-label">Chi phí</span>
                      <span className="exp-card-price-val">{exp.priceText}</span>
                    </div>

                    <div className="exp-card-actions">
                      <button
                        type="button"
                        className="exp-btn-detail"
                        onClick={() => setActiveModalExp(exp)}
                      >
                        Chi tiết
                      </button>

                      <button
                        type="button"
                        className="exp-btn-plan"
                        onClick={() => handleAddToPlanner(exp)}
                        title="Đưa trải nghiệm này vào Lịch trình du lịch"
                      >
                        <Compass size={14} />
                        <span>Lên lịch</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredExperiences.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: 18, color: "#64748b" }}>
              Không tìm thấy trải nghiệm nào phù hợp với từ khóa "<strong>{searchQuery}</strong>"
            </p>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              style={{ marginTop: 14 }}
            >
              Xem tất cả trải nghiệm
            </button>
          </div>
        )}
      </main>

      {/* Modal Detail Trải Nghiệm */}
      {activeModalExp && (
        <div className="exp-modal-backdrop" onClick={() => setActiveModalExp(null)}>
          <div className="exp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="exp-modal-cover">
              <img
                src={activeModalExp.image}
                alt={activeModalExp.title}
                className="exp-modal-cover-img"
              />
              <button
                type="button"
                className="exp-modal-close"
                onClick={() => setActiveModalExp(null)}
                aria-label="Đóng chi tiết"
              >
                <X size={20} />
              </button>
            </div>

            <div className="exp-modal-content">
              <div className="exp-modal-header">
                <div className="exp-modal-pill-row">
                  <span className="exp-highlight-pill" style={{ fontSize: 12 }}>
                    {activeModalExp.tag}
                  </span>
                  <span className="exp-card-rating">
                    <Star size={14} fill="#d97706" color="#d97706" />
                    <span>{activeModalExp.rating}</span> ({activeModalExp.reviewCount} đánh giá)
                  </span>
                </div>
                <h2 className="exp-modal-title">{activeModalExp.title}</h2>
              </div>

              {/* Thông tin nhanh */}
              <div className="exp-modal-info-grid">
                <div className="exp-info-item">
                  <span className="exp-info-item-label">⏱️ Thời lượng</span>
                  <span className="exp-info-item-val">{activeModalExp.duration}</span>
                </div>
                <div className="exp-info-item">
                  <span className="exp-info-item-label">🌅 Thời điểm vàng</span>
                  <span className="exp-info-item-val">{activeModalExp.bestTime}</span>
                </div>
                <div className="exp-info-item">
                  <span className="exp-info-item-label">💰 Chi phí tham khảo</span>
                  <span className="exp-info-item-val" style={{ color: "#047857" }}>
                    {activeModalExp.priceText}
                  </span>
                </div>
              </div>

              {/* Mô tả chi tiết */}
              <div className="exp-modal-section-title">
                <span>📖 Giới thiệu chi tiết trải nghiệm</span>
              </div>
              <p style={{ lineHeight: 1.7, color: "#334155", fontSize: 14 }}>
                {activeModalExp.description}
              </p>

              {/* Địa điểm */}
              <div style={{ margin: "14px 0", fontSize: 13.5, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={16} color="#7c3aed" />
                <span>
                  <strong>Địa điểm tổ chức:</strong> {activeModalExp.location}
                </span>
              </div>

              {/* Hoạt động nổi bật */}
              <div className="exp-modal-section-title">
                <span>✨ Điểm nhấn không thể bỏ lỡ</span>
              </div>
              <ul className="exp-highlights-list">
                {activeModalExp.highlights.map((hl, i) => (
                  <li key={i} className="exp-highlight-li">
                    <span>✓</span>
                    <div>{hl}</div>
                  </li>
                ))}
              </ul>

              {/* Lời khuyên bỏ túi */}
              {activeModalExp.tips && activeModalExp.tips.length > 0 && (
                <div className="exp-tips-box">
                  <strong>💡 Lời khuyên bỏ túi cho bạn:</strong>
                  <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    {activeModalExp.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Phù hợp cho */}
              {activeModalExp.suitableFor && (
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
                  👥 <strong>Phù hợp cho:</strong> {activeModalExp.suitableFor}
                </div>
              )}

              {/* Nút hành động trong Modal */}
              <div className="exp-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setActiveModalExp(null)}
                >
                  Đóng
                </button>

                <button
                  type="button"
                  className="exp-btn-plan"
                  onClick={() => {
                    handleAddToPlanner(activeModalExp);
                    setActiveModalExp(null);
                    navigate("/planner");
                  }}
                >
                  <Compass size={16} />
                  <span>Đưa vào Lịch trình & Mở Planner</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="exp-toast">
          <CheckCircle2 size={18} color="#4ade80" />
          <span>{toastMessage}</span>
          <button
            type="button"
            className="exp-toast-btn"
            onClick={() => navigate("/planner")}
          >
            Mở Planner
          </button>
        </div>
      )}
    </div>
  );
}

// ==============================
// TRANG DỊCH VỤ
// ==============================

export function ServicesPage() {
  const icons = [
    <Hotel key="hotel" />,
    <Utensils key="food" />,
    <Compass key="compass" />,
    <Car key="car" />,
    <ShoppingBag key="shopping" />,
    <CalendarDays key="calendar" />,
  ];

  return (
    <>
      <PageHero
        eyebrow="TRAVEL SERVICES"
        title="Dịch vụ du lịch"
        subtitle="Các nhóm dịch vụ cần thiết để bạn chuẩn bị chuyến đi thuận tiện hơn."
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=90"
      />

      <section className="section container">
        <div className="service-grid">
          {serviceGroups.map((service, index) => (
            <article
              className="service-tile"
              key={service.title}
            >
              <span className="service-icon">
                {icons[index] ?? <Compass />}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="muted">
                Danh mục mẫu – chờ cập nhật dữ liệu dịch vụ
              </span>
            </article>
          ))}
        </div>

        <p className="notice">
          Thông tin nhà cung cấp, giá và khả năng đặt dịch vụ sẽ
          hiển thị sau khi quản trị viên cập nhật dữ liệu đã xác minh.
        </p>
      </section>
    </>
  );
}

// ==============================
// TRANG SỰ KIỆN
// ==============================

export function EventsPage() {
  const [events, setEvents] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("huesmart-admin-events");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "ev-1",
        name: "Festival Huế 2026 - Di sản văn hóa với hội nhập và phát triển",
        category: "Lễ hội văn hóa",
        startDate: "07/06/2026",
        endDate: "12/06/2026",
        location: "Kỳ Đài, Ngọ Môn & các sân khấu cộng đồng TP Huế",
        description: "Kỳ Festival quy mô quốc tế tôn vinh vẻ đẹp di sản Cố đô, quy tụ hàng chục đoàn nghệ thuật trong nước và quốc tế.",
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
        price: "Miễn phí vé / Một số chương trình có vé",
        status: "Sắp tới",
      },
      {
        id: "ev-2",
        name: "Đêm Hoàng Cung & Trình diễn Áo Dài xứ Huế",
        category: "Nghệ thuật truyền thống",
        startDate: "01/11/2026",
        endDate: "31/12/2026",
        location: "Điện Thái Hòa & Cung Diên Thọ - Đại Nội Huế",
        description: "Tái hiện không gian cung đình xưa với nhã nhạc, ngâm thơ, dạ yến và bộ sưu tập áo dài cung đình lộng lẫy.",
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
        price: "150.000 đ",
        status: "Đang diễn ra",
      },
      {
        id: "ev-3",
        name: "Lễ hội Khinh khí cầu Quốc tế Huế",
        category: "Lễ hội ngoài trời",
        startDate: "25/04/2026",
        endDate: "01/05/2026",
        location: "Quảng trường Ngọ Môn & Sân vận động Tự Do",
        description: "Chiêm ngưỡng hàng chục khinh khí cầu khổng lồ bay trên bầu trời cố đô, ngắm toàn cảnh sông Hương từ trên cao.",
        image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80",
        price: "180.000 đ / lượt",
        status: "Sắp tới",
      },
      {
        id: "ev-5",
        name: "Biểu diễn Ca Huế thính phòng trên Sông Hương",
        category: "Âm nhạc di sản",
        startDate: "Hằng đêm",
        endDate: "31/12/2026",
        location: "Bến thuyền Tòa Khâm, Đường Lê Lợi, TP Huế",
        description: "Thả hoa đăng cầu may và thưởng thức di sản phi vật thể quốc gia Ca Huế trên du thuyền rồng truyền thống lướt êm đềm.",
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
        price: "100.000 đ - 150.000 đ",
        status: "Đang diễn ra",
      },
    ];
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem("huesmart-admin-events");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setEvents(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("huesmart-events-updated", handleUpdate);
    return () => window.removeEventListener("huesmart-events-updated", handleUpdate);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="WHAT'S ON IN HUE"
        title="Sự kiện & lễ hội"
        subtitle="Theo dõi các hoạt động văn hóa, nghệ thuật và lễ hội đặc sắc tại Huế."
        image="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1800&q=90"
        className="events-hero"
      />

      <section className="section container events-section">
        <SectionTitle
          label="EVENT CALENDAR"
          title={`Lịch sự kiện & Lễ hội (${events.length})`}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
            marginTop: 24,
          }}
        >
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                background: "#ffffff",
                borderRadius: 18,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 18px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ height: 190, position: "relative", overflow: "hidden" }}>
                <img
                  src={ev.image || "/images/hero-banner.jpg"}
                  alt={ev.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/hero-banner.jpg";
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "rgba(255, 255, 255, 0.94)",
                    color: "#581c87",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: 20,
                  }}
                >
                  {ev.category}
                </span>

                <span
                  style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    background: ev.status === "Đang diễn ra" ? "#16a34a" : "#7c24a2",
                    color: "#ffffff",
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 8,
                  }}
                >
                  {ev.status}
                </span>
              </div>

              <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: 17, color: "#1e1b4b", lineHeight: 1.4, fontWeight: 700 }}>
                  {ev.name}
                </h3>

                <div style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span>📅</span>
                  <span>{ev.startDate} — {ev.endDate}</span>
                </div>

                <div style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <span>📍</span>
                  <span>{ev.location}</span>
                </div>

                <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 16px 0", flex: 1 }}>
                  {ev.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 12,
                    borderTop: "1px solid #f1f5f9",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#176b5b" }}>
                    {ev.price}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        autoScheduleToItinerary({
                          id: ev.id,
                          name: ev.name,
                          category: ev.category,
                          image: ev.image,
                          address: ev.location,
                          price: ev.price,
                          note: `Sự kiện Huế (${ev.startDate} - ${ev.endDate}): ${ev.description}`,
                        });
                      }}
                      title="Tự động thêm sự kiện này vào lịch trình"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 12px",
                        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <CalendarPlus size={14} />
                      <span>Lên lịch</span>
                    </button>
                    <Link
                      to="/map"
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#7c24a2",
                        textDecoration: "none",
                      }}
                    >
                      Bản đồ →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ==============================
// TRANG TẠO LỊCH TRÌNH
// ==============================

export function PlannerPage() {
  const allDestinations = useDestinations();

  const [days, setDays] = useState(2);
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState("Trung bình");
  const [interest, setInterest] = useState("Di sản & văn hóa");
  const [plan, setPlan] = useState(false);

  const suggested = allDestinations.slice(
    0,
    Math.min(days * 2, allDestinations.length)
  );

  return (
    <>
      <PageHero
        eyebrow="SMART TRIP PLANNER"
        title="Thiết kế hành trình của bạn"
        subtitle="Chọn thời gian, số người và sở thích để nhận gợi ý lịch trình ban đầu."
        image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=90"
      />

      <section className="section container planner-layout">
        <div className="planner-form">
          <span className="eyebrow dark">
            YOUR TRAVEL PROFILE
          </span>
          <h2>Chuyến đi trong mơ của bạn</h2>

          <label>
            Số ngày
            <input
              type="number"
              min="1"
              max="7"
              value={days}
              onChange={(e) =>
                setDays(
                  Math.max(1, Math.min(7, Number(e.target.value)))
                )
              }
            />
          </label>

          <label>
            Số người
            <input
              type="number"
              min="1"
              max="20"
              value={people}
              onChange={(e) =>
                setPeople(
                  Math.max(1, Math.min(20, Number(e.target.value)))
                )
              }
            />
          </label>

          <label>
            Ngân sách
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option>Tiết kiệm</option>
              <option>Trung bình</option>
              <option>Cao cấp</option>
            </select>
          </label>

          <label>
            Sở thích
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              <option>Di sản & văn hóa</option>
              <option>Thiên nhiên</option>
              <option>Ẩm thực</option>
              <option>Gia đình</option>
            </select>
          </label>

          <button
            type="button"
            className="btn btn-dark full"
            onClick={() => setPlan(true)}
          >
            <Sparkles size={17} /> Tạo gợi ý lịch trình
          </button>
        </div>

        <div className="planner-result">
          <span className="eyebrow dark">YOUR ITINERARY</span>
          <h2>
            {plan
              ? "Gợi ý hành trình Huế"
              : "Hành trình sẽ xuất hiện tại đây"}
          </h2>

          {plan ? (
            <>
              <p>
                {days} ngày · {people} người · Ngân sách {budget} ·{" "}
                {interest}
              </p>

              {suggested.map((destination, index) => (
                <div
                  className="plan-item"
                  key={destination.id}
                >
                  <span>
                    Ngày {Math.floor(index / 2) + 1}
                  </span>
                  <div>
                    <b>{destination.name}</b>
                    <small>
                      {destination.duration} ·{" "}
                      {destination.address}
                    </small>
                    <Link to={`/destinations/${destination.id}`}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}

              {suggested.length === 0 && (
                <p>Chưa có địa điểm để tạo lịch trình.</p>
              )}

              <button
                type="button"
                className="btn btn-gold"
                onClick={() => window.print()}
              >
                In / Lưu PDF
              </button>
            </>
          ) : (
            <p>
              Điền thông tin bên trái và chọn tạo lịch trình để xem gợi ý.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

// ==============================
// TRANG ĐỊA ĐIỂM YÊU THÍCH
// ==============================

export function FavoritesPage() {
  const allDestinations = useDestinations();

  const [ids, setIds] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("huesmart-favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const refresh = () => {
      try {
        setIds(
          JSON.parse(
            localStorage.getItem("huesmart-favorites") || "[]"
          )
        );
      } catch {
        setIds([]);
      }
    };

    window.addEventListener("storage", refresh);
    window.addEventListener(
      "huesmart-favorites-updated",
      refresh
    );

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "huesmart-favorites-updated",
        refresh
      );
    };
  }, []);

  const saved = allDestinations.filter((destination) =>
    ids.includes(destination.id)
  );

  function remove(id: string) {
    const next = ids.filter((itemId) => itemId !== id);
    setIds(next);

    localStorage.setItem(
      "huesmart-favorites",
      JSON.stringify(next)
    );

    window.dispatchEvent(
      new Event("huesmart-favorites-updated")
    );
  }

  return (
    <>
      <PageHero
        eyebrow="YOUR COLLECTION"
        title="Địa điểm yêu thích"
        subtitle="Những nơi bạn đã lưu để khám phá trong chuyến đi."
        image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=90"
      />

      <section className="section container">
        <div className="card-grid">
          {saved.map((item) => (
            <div key={item.id}>
              <DestinationCard item={item} />
              <button
                type="button"
                className="text-button"
                onClick={() => remove(item.id)}
              >
                <Trash2 size={15} /> Bỏ khỏi yêu thích
              </button>
            </div>
          ))}
        </div>

        {saved.length === 0 && (
          <div className="empty-state">
            Bạn chưa lưu địa điểm nào. Hãy khám phá và nhấn biểu
            tượng trái tim để lưu lại.
          </div>
        )}
      </section>
    </>
  );
}

// ==============================
// TRANG GIỚI THIỆU
// ==============================

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR STORY"
        title="Về HueSmart Travel"
        subtitle="Kết nối di sản, con người và công nghệ để hành trình khám phá Huế dễ dàng hơn."
        image="https://images.unsplash.com/photo-1599708153386-62bf1f4f6f2b?auto=format&fit=crop&w=1800&q=90"
      />

      <section className="section container about-story">
        <div>
          <span className="eyebrow dark">OUR MISSION</span>
          <h2>
            Đưa vẻ đẹp cố đô đến gần hơn với mọi du khách.
          </h2>
          <p>
            HueSmart Travel là dự án nền tảng du lịch thông minh,
            hỗ trợ tìm kiếm thông tin, khám phá dịch vụ và tổ chức
            hành trình tại Huế.
          </p>
          <p>
            Chúng tôi hướng tới trải nghiệm thuận tiện, trực quan
            và có trách nhiệm với giá trị di sản.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85"
          alt="Di sản Huế"
        />
      </section>
    </>
  );
}

// ==============================
// TRANG TÀI KHOẢN - DEMO LOCAL
// ==============================

export function AccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState<string | null>(() =>
    localStorage.getItem("huesmart-demo-user")
  );

  function auth(mode: "login" | "signup") {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    if (password.length < 6) {
      setMessage("Mật khẩu cần có ít nhất 6 ký tự.");
      return;
    }

    localStorage.setItem("huesmart-demo-user", cleanEmail);
    setUser(cleanEmail);

    if (mode === "signup") {
      recordUserRegistration({
        name: cleanEmail.split("@")[0].toUpperCase(),
        email: cleanEmail,
        role: "Du khách",
        source: "online_signup",
      });
    }

    setMessage(
      mode === "signup"
        ? "Tạo tài khoản mô phỏng thành công!"
        : "Đăng nhập mô phỏng thành công!"
    );
  }

  function logout() {
    localStorage.removeItem("huesmart-demo-user");
    setUser(null);
    setPassword("");
    setMessage("Bạn đã đăng xuất.");
  }

  return (
    <section className="section container account-wrap">
      <div className="account-card">
        <span className="eyebrow dark">YOUR ACCOUNT</span>
        <h1>Tài khoản HueSmart</h1>

        {user ? (
          <>
            <p>Đang đăng nhập: {user}</p>
            <button
              type="button"
              className="btn btn-dark full"
              onClick={logout}
            >
              <LogOut size={16} /> Đăng xuất
            </button>
          </>
        ) : (
          <>
            <p>
              Đăng nhập hoặc tạo tài khoản để trải nghiệm HueSmart Travel.
            </p>

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@email.com"
              />
            </label>

            <label>
              Mật khẩu
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
              />
            </label>

            <div className="button-row">
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => auth("login")}
              >
                <LogIn size={16} /> Đăng nhập
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => auth("signup")}
              >
                Đăng ký
              </button>
            </div>
          </>
        )}

        {message && <p className="notice">{message}</p>}

        <p className="muted">
          Chế độ demo: dữ liệu đăng nhập chỉ được mô phỏng trên trình duyệt.
        </p>
      </div>
    </section>
  );
}

// ==============================
// TRANG QUẢN TRỊ HUESMART TRAVEL
// ==============================

export function AdminPage() {
  return <AdminDashboard />;
}
