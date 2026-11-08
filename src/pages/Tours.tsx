import "../styles/tours.css";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Compass,
  MapPin,
  Search,
  Star,
  Users,
  CalendarPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { scheduleTourToItinerary } from "../services/itineraryService";

export type Tour = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  rating: number;
  location: string;
  schedule: string;
  featured: boolean;
  detail?: {
    code: string;
    format: string;
    operator: string;
    gallery: string[];
    itinerary: {
      title: string;
      description: string;
      image?: string;
    }[];
    inclusions: {
      title: string;
      items: string[];
    }[];
    exclusions: string[];
    childPricing: {
      age: string;
      price: string;
    }[];
    tagline: string;
    relatedTours: {
      name: string;
      image: string;
      price: number;
      duration: string;
      url: string;
    }[];
  };
};

export const tours: Tour[] = [
  {
    id: 1,
    slug: "kham-pha-dai-noi-hue",
    name: "Khám phá Đại Nội Huế",
    category: "Di sản",
    description:
      "Khám phá Hoàng thành, cung điện và những dấu ấn vàng son của triều Nguyễn.",
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png",
    duration: "3–4 giờ",
    price: 350000,
    rating: 4.9,
    location: "Đại Nội Huế",
    schedule: "Buổi sáng hoặc buổi chiều",
    featured: true,
  },
  {
    id: 2,
    slug: "tour-lang-khai-dinh",
    name: "Hành trình lăng Khải Định",
    category: "Di sản",
    description:
      "Chiêm ngưỡng kiến trúc giao thoa Đông – Tây và nghệ thuật khảm sành sứ độc đáo.",
    image:
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/74d44096-3627-4cf5-a5b5-5b71fdac2f9e_1793344049.jpg",
    duration: "2–3 giờ",
    price: 280000,
    rating: 4.8,
    location: "Lăng Khải Định",
    schedule: "Buổi sáng",
    featured: false,
  },
  {
    id: 3,
    slug: "tour-chua-thien-mu-song-huong",
    name: "Chùa Thiên Mụ và sông Hương",
    category: "Văn hóa",
    description:
      "Thăm ngôi chùa cổ bên dòng Hương Giang và tận hưởng không gian thanh bình của xứ Huế.",
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Chua-Thien-Mu_1776821164.jpg",
    duration: "3 giờ",
    price: 250000,
    rating: 4.8,
    location: "Chùa Thiên Mụ",
    schedule: "Buổi sáng hoặc hoàng hôn",
    featured: true,
  },
  {
    id: 4,
    slug: "tour-am-thuc-hue",
    name: "Khám phá ẩm thực cố đô",
    category: "Ẩm thực",
    description:
      "Thưởng thức bún bò Huế, bánh bèo, bánh nậm và những món ăn mang hương vị cung đình.",
    image:
      "https://huetripo.hue.gov.vn/uploads/Media/2026/HFT_2_1781235575.jpg",
    duration: "3–4 giờ",
    price: 320000,
    rating: 4.9,
    location: "Trung tâm thành phố Huế",
    schedule: "Buổi sáng hoặc buổi tối",
    featured: true,
  },
  {
    id: 5,
    slug: "tour-pha-tam-giang",
    name: "Hoàng hôn phá Tam Giang",
    category: "Thiên nhiên",
    description:
      "Ngắm hoàng hôn trên đầm phá, tìm hiểu cuộc sống ngư dân và tận hưởng vẻ đẹp miền sông nước.",
    image:
      "https://huetripo.hue.gov.vn/uploads/Media/2026/PhaTamGiang_1_1781237567.jpg",
    duration: "4–5 giờ",
    price: 450000,
    rating: 4.9,
    location: "Phá Tam Giang",
    schedule: "Buổi chiều",
    featured: true,
  },
  {
    id: 6,
    slug: "tour-lang-nghe-truyen-thong",
    name: "Làng nghề truyền thống Huế",
    category: "Trải nghiệm",
    description:
      "Tìm hiểu nghề làm hương, làm nón lá và gặp gỡ những người thợ thủ công địa phương.",
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/LangHuongXuHue_2sa01_1776821456.jpg",
    duration: "3 giờ",
    price: 290000,
    rating: 4.7,
    location: "Các làng nghề Huế",
    schedule: "Buổi sáng",
    featured: false,
  },
  {
    id: 7,
    slug: "suoi-khoang-nong-thanh-tan",
    name: "Huế - Suối khoáng nóng Thanh Tân (1 ngày)",
    category: "Nghỉ dưỡng",
    description:
      "Trải nghiệm Zipline, công viên nước và thư giãn tại suối khoáng nóng Thanh Tân.",
    image:
      "https://huetripo.hue.gov.vn/uploads/Media/2026/alba-thanh-tan-suoi-nuoc-nong_1671523460_1781593284.jpg",
    duration: "1 ngày",
    price: 950000,
    rating: 4.8,
    location: "Suối khoáng nóng Thanh Tân",
    schedule: "Khởi hành 08:00, về Huế lúc 15:30",
    featured: true,
    detail: {
      code: "ND-TTH-0066",
      format: "Tour ghép đoàn",
      operator: "Công ty CP Du lịch Đại Bàng",
      gallery: [
        "https://dulichdaibang.com/theme/root/thanhtan.jpg",
        "https://dulichdaibang.com/theme/root/zipline%20thanh%20tan.jpg",
        "https://dulichdaibang.com/theme/root/thanhtan1.jpg",
        "https://dulichdaibang.com/theme/root/thanh%20tan%202.jpg",
        "https://dulichdaibang.com/theme/root/thanhtan.jpg",
      ],
      itinerary: [
        {
          title: "08:00 · Khởi hành từ Huế",
          description:
            "Xe đón quý khách tại điểm hẹn, khởi hành đi suối khoáng nóng Thanh Tân.",
        },
        {
          title: "Buổi sáng · Trải nghiệm Thanh Tân",
          description:
            "Đến nơi, quý khách gửi hành lý tại khu vực ký gửi. Thử sức với trò chơi trượt Zipline tự do ở độ cao 45,5 m, chiều dài 560 m; vui chơi tại công viên nước, tắm hồ bơi ngoài trời và ngâm mình trong dòng suối khoáng nóng có nhiệt độ khoảng 40–60°C. Quý khách cũng có thời gian trải nghiệm các dịch vụ khác tại khu du lịch.",
          image: "https://dulichdaibang.com/theme/root/zipline%20thanh%20tan.jpg",
        },
        {
          title: "Buổi trưa · Dùng bữa tại nhà hàng",
          description:
            "Quý khách dùng bữa trưa tại nhà hàng trong khu du lịch.",
        },
        {
          title: "Buổi chiều · Nghỉ ngơi và trở về Huế",
          description:
            "Tự do nghỉ ngơi, dạo bộ tham quan vườn hươu và tiếp tục tắm khoáng. 15:30, đoàn khởi hành về Huế. Kết thúc chương trình, chào tạm biệt và hẹn gặp lại quý khách.",
          image: "https://dulichdaibang.com/theme/root/thanhtan.jpg",
        },
      ],
      inclusions: [
        {
          title: "Vận chuyển",
          items: ["Xe du lịch chất lượng cao."],
        },
        {
          title: "Hướng dẫn viên",
          items: ["Hướng dẫn viên phục vụ suốt tuyến."],
        },
        {
          title: "Vé tham quan",
          items: ["Vé tắm khoáng Alba Thanh Tân."],
        },
        {
          title: "Ăn uống",
          items: [
            "Bữa trưa tiêu chuẩn 180.000 đ/suất.",
            "01 chai nước suối/ngày.",
          ],
        },
      ],
      exclusions: [
        "Chi phí cá nhân.",
        "Tiền tip cho tài xế và hướng dẫn viên.",
        "Thuế VAT.",
      ],
      childPricing: [
        {
          age: "Trẻ em 1–5 tuổi",
          price: "Miễn phí tour; chi phí phát sinh của bé do bố mẹ thanh toán.",
        },
        {
          age: "Trẻ em 6–11 tuổi",
          price: "75% giá tour.",
        },
        {
          age: "Trên 11 tuổi",
          price: "100% giá tour.",
        },
      ],
      tagline: "Sự hài lòng của quý khách là đích đến của chúng tôi.",
      relatedTours: [
        {
          name: "Nghỉ dưỡng tại SBH Gloria resort 4* tại Huế (2 ngày 1 đêm)",
          image:
            "https://huetripo.hue.gov.vn/uploads/Media/2026/SBHResort_1781168770.jpg",
          price: 425000,
          duration: "2 ngày",
          url: "https://huetripo.hue.gov.vn/tour-du-lich/nghi-duong-tai-sbh-gloria-resort-4-tai-hue-2-ngay-1-dem-804395",
        },
        {
          name: "Hoàng hôn trên phá Tam Giang vườn quốc gia Bạch Mã",
          image:
            "https://huetripo.hue.gov.vn/uploads/Media/2026/KPCDH_1_1781247445.jpg",
          price: 3990000,
          duration: "3 ngày",
          url: "https://huetripo.hue.gov.vn/tour-du-lich/hoang-hon-tren-pha-tam-giang-vuon-quoc-gia-bach-ma-108718",
        },
        {
          name: "Huế - Đại Nội - Lăng Khải Định",
          image:
            "https://huetripo.hue.gov.vn/uploads/Media/2026/langkhaidinh_1781231859.jpg",
          price: 890000,
          duration: "1 ngày",
          url: "https://huetripo.hue.gov.vn/tour-du-lich/hue-dai-noi-lang-khai-dinh-486882",
        },
        {
          name: "Khám phá ẩm thực xứ Huế [Hue Food Tour]",
          image:
            "https://huetripo.hue.gov.vn/uploads/Media/2026/HFT_2_1781235575.jpg",
          price: 850000,
          duration: "0,5 ngày",
          url: "https://huetripo.hue.gov.vn/tour-du-lich/kham-pha-am-thuc-xu-hue-hue-food-tour-476755",
        },
        {
          name: "Huế - Vườn quốc gia Bạch Mã - Hải Vọng Đài - Ngũ Hồ - Thác Đỗ Quyên",
          image:
            "https://huetripo.hue.gov.vn/uploads/Media/2026/vong-hai-dai-bach-ma-hue-2_1719483159_1781489123.jpg",
          price: 1050000,
          duration: "1 ngày",
          url: "https://huetripo.hue.gov.vn/tour-du-lich/hue-vuon-quoc-gia-bach-ma-hai-vong-dai-ngu-ho-thac-do-quyen-489657",
        },
      ],
    },
  },
];

const categories = [
  "Tất cả",
  "Di sản",
  "Văn hóa",
  "Ẩm thực",
  "Thiên nhiên",
  "Trải nghiệm",
  "Nghỉ dưỡng",
];

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export default function Tours() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState<SortOption>("featured");

  const filteredTours = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");

    const result = tours.filter((tour) => {
      const matchesCategory =
        category === "Tất cả" || tour.category === category;

      const searchableText =
        `${tour.name} ${tour.description} ${tour.location} ${tour.category}`
          .toLocaleLowerCase("vi");

      const matchesSearch = searchableText.includes(keyword);

      return matchesCategory && matchesSearch;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "featured":
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });
  }, [search, category, sort]);

  return (
    <main className="hs-tour-page">
      <section className="hs-tour-hero">
        <motion.div
          className="hs-tour-hero-content"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hs-tour-eyebrow">
            <Compass size={16} />
            HUE SMART TRAVEL
          </span>

          <h1>Khám phá Huế theo cách của riêng bạn</h1>

          <p>
            Từ những di sản nghìn năm đến vẻ đẹp thiên nhiên và ẩm thực
            đặc sắc, hãy lựa chọn hành trình phù hợp để cảm nhận trọn vẹn
            tinh hoa cố đô.
          </p>
        </motion.div>
      </section>

      <form
        className="hs-tour-search"
        onSubmit={(event) => event.preventDefault()}
      >
        <Search size={21} color="#176b5b" />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Bạn muốn khám phá địa điểm hoặc tour nào?"
          aria-label="Tìm kiếm tour du lịch"
        />

        <button type="submit">
          <Search size={17} />
          Tìm tour
        </button>
      </form>

      <section className="hs-tour-section">
        <div className="hs-tour-heading">
          <div>
            <small>YOUR JOURNEY STARTS HERE</small>
            <h2>Những hành trình nổi bật</h2>
            <p>
              Lựa chọn tour yêu thích và bắt đầu hành trình khám phá
              vùng đất cố đô.
            </p>
          </div>

          <span className="hs-tour-count">
            Tìm thấy <strong>{filteredTours.length}</strong> tour
          </span>
        </div>

        <div className="hs-tour-filters" aria-label="Lọc theo danh mục">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`hs-tour-filter ${
                category === item ? "active" : ""
              }`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="hs-tour-heading">
          <div>
            <small>FIND YOUR EXPERIENCE</small>
            <h2>Chọn tour phù hợp</h2>
          </div>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            aria-label="Sắp xếp tour"
            style={{
              padding: "11px 14px",
              border: "1px solid #dfe8e1",
              borderRadius: 10,
              background: "#fff",
              color: "#193b35",
              fontSize: 13,
              maxWidth: "100%",
            }}
          >
            <option value="featured">Tour nổi bật</option>
            <option value="price-asc">Giá: thấp đến cao</option>
            <option value="price-desc">Giá: cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>

        <div className="hs-tour-grid">
          {filteredTours.length > 0 ? (
            filteredTours.map((tour, index) => (
              <motion.article
                className="hs-tour-card"
                key={tour.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <div className="hs-tour-image">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    loading={index < 3 ? "eager" : "lazy"}
                  />

                  <span className="hs-tour-tag">{tour.category}</span>

                  <span className="hs-tour-rating">
                    <Star size={14} fill="#f5c56b" color="#f5c56b" />
                    {tour.rating.toFixed(1)}
                  </span>
                </div>

                <div className="hs-tour-body">
                  <h3>{tour.name}</h3>

                  <p className="hs-tour-description">
                    {tour.description}
                  </p>

                  <div className="hs-tour-meta">
                    <span>
                      <Clock3 size={15} />
                      {tour.duration}
                    </span>

                    <span>
                      <MapPin size={15} />
                      {tour.location}
                    </span>
                  </div>

                  <div className="hs-tour-meta">
                    <span>
                      <CalendarDays size={15} />
                      {tour.schedule}
                    </span>

                    <span>
                      <Users size={15} />
                      Tour tham quan
                    </span>
                  </div>

                  <div className="hs-tour-footer">
                    <div>
                      <span className="hs-tour-price-label">
                        Giá tham khảo / người
                      </span>

                      <div className="hs-tour-price">
                        {formatPrice(tour.price)}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          scheduleTourToItinerary(tour);
                        }}
                        title="Tự động thêm tour này vào Lịch trình du lịch"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "8px 12px",
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
                      <Link
                        className="hs-tour-link"
                        to={`/tours/${tour.slug}`}
                        title={`Xem chi tiết ${tour.name}`}
                      >
                        Chi tiết tour
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="hs-tour-empty">
              <Search
                size={32}
                style={{ margin: "0 auto 12px", display: "block" }}
              />

              <h3>Không tìm thấy tour phù hợp</h3>

              <p>
                Hãy thử từ khóa khác hoặc chọn một danh mục khác.
              </p>

              <button
                type="button"
                className="hs-tour-button"
                onClick={() => {
                  setSearch("");
                  setCategory("Tất cả");
                  setSort("featured");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        <div className="hs-tour-cta">
          <div>
            <h3>Hành trình Huế của bạn bắt đầu từ đây</h3>

            <p>
              Tự xây dựng lịch trình, lựa chọn điểm đến và sắp xếp
              chuyến đi theo sở thích của bạn.
            </p>
          </div>

          <Link className="hs-tour-button" to="/planner">
            Tạo lịch trình
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
