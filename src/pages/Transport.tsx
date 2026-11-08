
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  ArrowUpDown,
  X,
  Phone,
  Truck,
} from "lucide-react";
import "../styles/Transport.css";

type TransportCategory =
  | "Tất cả"
  | "Ô tô"
  | "Ô tô điện"
  | "Xe máy"
  | "Xích lô"
  | "Xe máy điện"
  | "Thuyền rồng"
  | "Xe đạp"
  | "Xe buýt";

type TransportItem = {
  id: number;
  name: string;
  category: Exclude<TransportCategory, "Tất cả">;
  description: string;
  price: number;
  unit: string;
  provider: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  image: string;
  updated: number;
};

const categories: TransportCategory[] = [
  "Tất cả",
  "Ô tô",
  "Ô tô điện",
  "Xe máy",
  "Xích lô",
  "Xe máy điện",
  "Thuyền rồng",
  "Xe đạp",
  "Xe buýt",
];

const transportItems: TransportItem[] = [
  {
    id: 1,
    name: "Thuê xe máy",
    category: "Xe máy",
    description: "Xe máy thuận tiện khám phá các điểm du lịch tại Huế.",
    price: 100000,
    unit: "Ngày",
    provider: "Dịch vụ du lịch Huế",
    address: "Trung tâm thành phố Huế",
    phone: "",
    rating: 4.8,
    reviews: 128,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/thue-xe-may-o-hue_1781497003.webp",
    updated: 12,
  },
  {
    id: 2,
    name: "Ô tô du lịch 7 chỗ",
    category: "Ô tô",
    description: "Phù hợp cho gia đình hoặc nhóm bạn đi tham quan.",
    price: 1200000,
    unit: "Ngày",
    provider: "Dịch vụ xe du lịch Huế",
    address: "Thành phố Huế",
    phone: "",
    rating: 4.7,
    reviews: 86,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/xe-fortuner-7-cho_1781497274.webp",
    updated: 11,
  },
  {
    id: 3,
    name: "Thuê xe đạp",
    category: "Xe đạp",
    description: "Đạp xe dạo quanh thành phố và khám phá phố cổ.",
    price: 80000,
    unit: "Ngày",
    provider: "Dịch vụ xe đạp Huế",
    address: "Khu vực trung tâm Huế",
    phone: "",
    rating: 4.6,
    reviews: 53,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/xedaptroluc_1781495848.webp",
    updated: 10,
  },
  {
    id: 4,
    name: "Taxi 4 chỗ",
    category: "Ô tô",
    description: "Di chuyển nhanh chóng giữa sân bay, nhà ga và khách sạn.",
    price: 10000,
    unit: "Km",
    provider: "Dịch vụ taxi tại Huế",
    address: "Thành phố Huế",
    phone: "",
    rating: 4.5,
    reviews: 174,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/taxiVang_4cho_1781494445.jpg",
    updated: 9,
  },
  {
    id: 5,
    name: "Thuê xe máy điện",
    category: "Xe máy điện",
    description: "Lựa chọn linh hoạt cho hành trình ngắn trong thành phố.",
    price: 120000,
    unit: "Ngày",
    provider: "Dịch vụ xe điện Huế",
    address: "Trung tâm thành phố Huế",
    phone: "",
    rating: 4.6,
    reviews: 42,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/ThueXeMayDongXanh_1781490675.jpg",
    updated: 8,
  },
  {
    id: 6,
    name: "Ô tô điện tham quan",
    category: "Ô tô điện",
    description: "Trải nghiệm di chuyển thân thiện với môi trường.",
    price: 150000,
    unit: "Chuyến",
    provider: "Dịch vụ xe điện du lịch",
    address: "Khu vực Đại Nội Huế",
    phone: "",
    rating: 4.5,
    reviews: 61,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/XeDienHoangThanh_1781493945.jpg",
    updated: 7,
  },
  {
    id: 7,
    name: "Trải nghiệm xích lô Huế",
    category: "Xích lô",
    description: "Ngắm phố phường và cảm nhận nhịp sống cố đô.",
    price: 100000,
    unit: "Chuyến",
    provider: "Dịch vụ xích lô du lịch",
    address: "Khu vực trung tâm Huế",
    phone: "",
    rating: 4.7,
    reviews: 95,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/XeXichLo_1781491252.jpg",
    updated: 6,
  },
  {
    id: 8,
    name: "Thuyền rồng sông Hương",
    category: "Thuyền rồng",
    description: "Ngắm cảnh sông Hương và trải nghiệm du lịch đường thủy.",
    price: 150000,
    unit: "Người",
    provider: "Dịch vụ thuyền du lịch",
    address: "Bến thuyền sông Hương, Huế",
    phone: "",
    rating: 4.8,
    reviews: 143,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/ca_hue_tren_song_huong-768x432_1781497131.jpg",
    updated: 5,
  },
  {
    id: 9,
    name: "Xe buýt tham quan",
    category: "Xe buýt",
    description: "Lựa chọn tiết kiệm để di chuyển giữa các khu vực.",
    price: 15000,
    unit: "Lượt",
    provider: "Dịch vụ xe buýt",
    address: "Các tuyến xe buýt tại Huế",
    phone: "",
    rating: 4.3,
    reviews: 78,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/XeKhachPhiLong_1781493647.jpg",
    updated: 4,
  },
  {
    id: 10,
    name: "Thuê ô tô 4 chỗ",
    category: "Ô tô",
    description: "Phù hợp cho chuyến đi riêng tư và hành trình ngắn.",
    price: 900000,
    unit: "Ngày",
    provider: "Dịch vụ ô tô Huế",
    address: "Thành phố Huế",
    phone: "",
    rating: 4.6,
    reviews: 49,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/taxi-thanh-cong-hue-1-1024x685_1781494216.webp",
    updated: 3,
  },
  {
    id: 11,
    name: "Thuê xe đạp điện",
    category: "Xe đạp",
    description: "Di chuyển nhẹ nhàng và khám phá cảnh đẹp địa phương.",
    price: 120000,
    unit: "Ngày",
    provider: "Dịch vụ xe đạp Huế",
    address: "Thành phố Huế",
    phone: "",
    rating: 4.4,
    reviews: 35,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/xedaptroluc_1781495848.webp",
    updated: 2,
  },
  {
    id: 12,
    name: "Thuê xe máy đi tham quan",
    category: "Xe máy",
    description: "Tự do khám phá các lăng tẩm và cảnh đẹp xứ Huế.",
    price: 150000,
    unit: "Ngày",
    provider: "Dịch vụ cho thuê xe",
    address: "Thành phố Huế",
    phone: "",
    rating: 4.7,
    reviews: 67,
    image:
      "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/ThueXeMayDongXanh_1781490675.jpg",
    updated: 1,
  },
];

type SortMode = "default" | "newest" | "oldest" | "low" | "high";

const formatPrice = (price: number) =>
  `${price.toLocaleString("vi-VN")} đ`;

export default function Transport() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<TransportCategory>("Tất cả");
  const [sort, setSort] = useState<SortMode>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<TransportItem | null>(null);
  const [maxPrice, setMaxPrice] = useState("all");

  const filteredItems = useMemo(() => {
    let result = transportItems.filter((item) => {
      const keyword = search.trim().toLocaleLowerCase("vi");

      const matchesSearch =
        !keyword ||
        item.name.toLocaleLowerCase("vi").includes(keyword) ||
        item.description.toLocaleLowerCase("vi").includes(keyword) ||
        item.provider.toLocaleLowerCase("vi").includes(keyword);

      const matchesCategory =
        category === "Tất cả" || item.category === category;

      const matchesPrice =
        maxPrice === "all" || item.price <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    result = [...result];

    switch (sort) {
      case "newest":
        result.sort((a, b) => b.updated - a.updated);
        break;
      case "oldest":
        result.sort((a, b) => a.updated - b.updated);
        break;
      case "low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [search, category, sort, maxPrice]);

  return (
    <div className="transport-page">
      <section className="transport-hero">
        <div className="transport-hero-overlay" />
        <div className="transport-hero-content">
          <span className="transport-eyebrow">
            HUE SMART TRAVEL
          </span>
          <h1>Phương tiện</h1>
          <p>
            Khám phá Huế theo cách thuận tiện và phù hợp nhất dành cho bạn
          </p>

          <form
            className="transport-search"
            onSubmit={(event) => event.preventDefault()}
          >
            <Search size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm phương tiện, dịch vụ..."
              aria-label="Tìm kiếm phương tiện"
            />
            {search && (
              <button
                type="button"
                aria-label="Xóa tìm kiếm"
                onClick={() => setSearch("")}
              >
                <X size={18} />
              </button>
            )}
            <button type="submit" className="transport-search-button">
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <section className="transport-content">
        <div className="transport-toolbar">
          <div>
            <h2>Dịch vụ vận chuyển</h2>
            <p className="transport-subtitle">
              Lựa chọn phương tiện phù hợp cho chuyến đi của bạn.
            </p>
          </div>

          <div className="transport-category-list">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={`transport-category ${
                  category === item ? "active" : ""
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="transport-controls">
          <button
            type="button"
            className={`transport-filter-button ${
              showFilters ? "active" : ""
            }`}
            onClick={() => setShowFilters((value) => !value)}
          >
            <SlidersHorizontal size={17} />
            Bộ lọc
            <span>{filteredItems.length}</span>
          </button>

          <div className="transport-sort">
            <ArrowUpDown size={17} />
            <strong>Sắp xếp theo</strong>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortMode)
              }
              aria-label="Sắp xếp phương tiện"
            >
              <option value="default">Tất cả</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="low">Giá từ thấp - cao</option>
              <option value="high">Giá từ cao - thấp</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="transport-filter-panel">
            <label htmlFor="transport-max-price">
              Mức giá tối đa
            </label>
            <select
              id="transport-max-price"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            >
              <option value="all">Tất cả mức giá</option>
              <option value="100000">100.000 đ</option>
              <option value="200000">200.000 đ</option>
              <option value="500000">500.000 đ</option>
              <option value="1000000">1.000.000 đ</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setMaxPrice("all");
                setCategory("Tất cả");
                setSearch("");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        <div className="transport-result-count">
          Tìm thấy <strong>{filteredItems.length}</strong> dịch vụ
        </div>

        {filteredItems.length > 0 ? (
          <div className="transport-grid">
            {filteredItems.map((item) => (
              <article className="transport-card" key={item.id}>
                <button
                  type="button"
                  className="transport-image-button"
                  onClick={() => setSelectedItem(item)}
                  aria-label={`Xem ${item.name}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.opacity = "0.25";
                    }}
                  />
                  <span className="transport-card-badge">
                    {item.category}
                  </span>
                </button>

                <div className="transport-card-body">
                  <h3>{item.name}</h3>
                  <p className="transport-description">
                    {item.description}
                  </p>

                  <div className="transport-rating">
                    <Star size={16} fill="currentColor" />
                    <strong>{item.rating.toFixed(1)}/5</strong>
                    <span>({item.reviews} lượt đánh giá)</span>
                  </div>

                  <p className="transport-price">
                    Giá từ <strong>{formatPrice(item.price)}</strong>
                    <span>/{item.unit}</span>
                  </p>

                  <div className="transport-provider">
                    <span className="transport-provider-icon">
                      <Truck size={21} />
                    </span>
                    <div>
                      <strong>{item.provider}</strong>
                      <small>Đơn vị cung cấp dịch vụ</small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="transport-detail-button"
                    onClick={() => setSelectedItem(item)}
                  >
                    Xem dịch vụ
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="transport-empty">
            <Search size={35} />
            <h3>Không tìm thấy dịch vụ phù hợp</h3>
            <p>Thử từ khóa khác hoặc thay đổi bộ lọc của bạn.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("Tất cả");
                setMaxPrice("all");
              }}
            >
              Hiển thị tất cả
            </button>
          </div>
        )}
      </section>

      {selectedItem && (
        <div
          className="transport-modal-backdrop"
          onClick={() => setSelectedItem(null)}
        >
          <section
            className="transport-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transport-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="transport-modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Đóng"
            >
              <X size={21} />
            </button>

            <img
              className="transport-modal-image"
              src={selectedItem.image}
              alt={selectedItem.name}
            />

            <div className="transport-modal-body">
              <span className="transport-card-badge">
                {selectedItem.category}
              </span>
              <h2 id="transport-modal-title">
                {selectedItem.name}
              </h2>
              <p>{selectedItem.description}</p>

              <div className="transport-modal-info">
                <span>
                  <Star size={17} fill="currentColor" />
                  {selectedItem.rating}/5 ({selectedItem.reviews} đánh giá)
                </span>
                <span>
                  <MapPin size={17} />
                  {selectedItem.address}
                </span>
              </div>

              <p className="transport-price">
                Giá tham khảo:{" "}
                <strong>{formatPrice(selectedItem.price)}</strong>
                /{selectedItem.unit}
              </p>

              <p className="transport-notice">
                Đây là mức giá tham khảo minh họa. Vui lòng xác nhận
                giá và tình trạng dịch vụ với đơn vị cung cấp trước khi đặt.
              </p>

              {selectedItem.phone ? (
                <a
                  className="transport-detail-button"
                  href={`tel:${selectedItem.phone}`}
                >
                  <Phone size={17} /> Liên hệ đơn vị cung cấp
                </a>
              ) : (
                <p className="transport-contact-note">
                  Thông tin liên hệ của đơn vị này chưa được cập nhật.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
