
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Heart,
  Utensils,
  Coffee,
  Wine,
  Leaf,
  Soup,
  CookingPot,
  Grid2X2,
  Navigation,
  ArrowRight,
  Sparkles,
  CalendarPlus,
} from "lucide-react";
import { autoScheduleToItinerary } from "../services/itineraryService";
import "../styles/Services.css";

type FoodCategory =
  | "Tất cả"
  | "Nhà hàng"
  | "Bar/Pub"
  | "Nhà hàng/Quán ăn chay"
  | "Quán ăn"
  | "Quán cà phê/trà"
  | "Khu ẩm thực"
  | "Buffet"
  | "Tiệm bánh"
  | "Ăn vặt/Vỉa hè"
  | "Khác";

export type Restaurant = {
  id: number;
  name: string;
  category: Exclude<FoodCategory, "Tất cả">;
  image: string;
  images?: string[];
  url: string;
  rating: number;
  reviews: number;
  hours: string;
  address: string;
  price: string;
  summary?: string;
  detailParagraphs?: string[];
  phone?: string;
  website?: string;
  social?: string;
};

const categories: {
  label: FoodCategory;
  icon: typeof Utensils;
}[] = [
  { label: "Tất cả", icon: Grid2X2 },
  { label: "Nhà hàng", icon: Utensils },
  { label: "Buffet", icon: CookingPot },
  { label: "Bar/Pub", icon: Wine },
  { label: "Nhà hàng/Quán ăn chay", icon: Leaf },
  { label: "Quán ăn", icon: Soup },
  { label: "Quán cà phê/trà", icon: Coffee },
  { label: "Khác", icon: Sparkles },
];

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Nhà hàng cơm niêu Huế - Mâm",
    category: "Nhà hàng",
    image: "https://huetripo.hue.gov.vn/uploads/Media/2026/10/AnhDaiDien_1793093831.JPG",
    images: [
      "https://huetripo.hue.gov.vn/uploads/Media/2026/10/AnhDaiDien_1793093831.JPG",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/8bf9c08d-cdd5-4901-9e04-b6b60087b3e9_1793094744.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/0327e7ed-fb44-470d-968f-63357d1912f0_1793094744.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/df05a1d9-a7ba-43a9-9712-d6b84d00063c_1793094744.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/ba5c7fd1-dff5-41d6-bf82-f44f852ed0f3_1793094744.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/56fde294-8ffb-4398-9f6f-98e849196d8d_1793094744.png",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/8ed52299-76f3-4118-8079-83fa8f049e86_1793094744.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/109f55f7-bbad-42d2-87f0-1442c9a157e3_1793094744.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/0e86b8c1-070f-4bf5-a9ec-df21296a1772_1793094744.jpg",
      "https://huetripo.hue.gov.vn/uploads/Media/2026/10/AnhDaiDien_1_1793093997.JPG",
      ...["5", "6", "4", "3", "2", "10", "8", "7", "9", "1"].map(
        (number) =>
          `https://huetripo.hue.gov.vn/uploads/Media/2026/10/AnhKhongGian_${number}_1793093924.JPG`,
      ),
      ...["8", "6", "9", "7", "10"].map(
        (number) =>
          `https://huetripo.hue.gov.vn/uploads/Media/2026/10/AnhMonAn_${number}_1793094147.jpg`,
      ),
      ...["3", "5", "4", "1", "2"].map(
        (number) =>
          `https://huetripo.hue.gov.vn/uploads/Media/2026/10/AnhMonAn_${number}_1793094109.jpg`,
      ),
    ],
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/nha-hang/nha-hang-com-nieu-hue-mam-173250",
    rating: 4.8,
    reviews: 950,
    hours: "09:00 - 22:00",
    address: "10 Hà Huy Tập, Phường Vỹ Dạ, thành phố Huế",
    price: "150.000 đ - 250.000 đ",
    summary:
      "Nhà hàng phục vụ cơm niêu Huế, với không gian rộng rãi, thoáng mát. Nhà hàng có vị trí ngay trung tâm thành phố thuận lợi trong việc di chuyển và đỗ xe. Nhà hàng cơm Huế chuyên phục vụ cho khách du lịch, đoàn tham quan Huế hay phù hợp để cho các bữa cơm mời khách.",
    detailParagraphs: [
      "Nhà hàng phục vụ cơm niêu Huế, với không gian rộng rãi, thoáng mát. Nhà hàng có vị trí ngay trung tâm thành phố thuận lợi trong việc di chuyển và đỗ xe.",
      "Nhà hàng cơm Huế chuyên phục vụ cho khách du lịch, đoàn tham quan Huế hay phù hợp để cho các bữa cơm mời khách.",
    ],
    phone: "0777683636",
    website: "https://nhahangmam.vn",
    social: "https://www.facebook.com/mam.comvietloihue",
  },
  {
    id: 2,
    name: "Nhà hàng La Brasserie (Indochine Palace)",
    category: "Nhà hàng",
    image: "https://huetripo.hue.gov.vn/uploads/Media/2026/nha_hang_indochine_1781663655.jpg",
    images: [
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/b6f5b355-9334-47df-b3c0-f4e48b9fbeaa_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/582c3c81-9c63-4247-a7af-ac2a06f77c64_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/7186e37b-8399-491c-a2b1-49fdb09829b1_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/022fdefb-254c-480b-a2d3-282574d3fb20_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/22e69aa9-2405-4a07-a80f-0354a88fc871_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/9c16a3d1-481f-4235-902e-5d0a23a36324_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/ef869cad-2cfb-424f-a8a1-a5c35a5a3e46_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/fef4101c-c6cb-4304-b592-aa22f2e45e0c_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/1ea2546e-b122-4d84-859d-09e3212530d3_1781781225.png",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/e5523d5e-e994-4717-ad38-84145919ec07_1781781225.jpg",
      "https://huetripo.hue.gov.vn/uploads/Media/2026/nha_hang_indochine_1781663655.jpg",
    ],
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/nha-hang/nha-hang-la-brasserie-indochine-palace-272476",
    rating: 4.6,
    reviews: 1420,
    hours: "07:00 - 22:00",
    address: "105A Hùng Vương, Thuận Hóa, thành phố Huế",
    price: "300.000 đ - 500.000 đ",
  },
  {
    id: 3,
    name: "Nhà hàng nổi Sông Hương",
    category: "Nhà hàng",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/c37c6836-e480-4ece-a805-82338c99b0e0_1793344102.jpg",
    images: [
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/c37c6836-e480-4ece-a805-82338c99b0e0_1793344102.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/389d45e0-d7ae-4b77-b1ed-896a30c4917e_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/a005b55f-5d40-4b21-854c-da3e3d32ea52_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/b2a0623f-fc5f-48f9-93ea-6bf28a534d01_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/e6b08a60-ca91-4580-a39c-4137fd848b69_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/d3424b1d-f496-49ef-87b7-c58b04ea1f1b_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/8012d2f7-c814-4a18-a540-16c51d2148eb_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/9f42222d-e013-4df5-8eb8-6141fa2bf028_1783418516.png",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/442f4252-1878-449e-98ad-121130792672_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/1ec9b480-1bda-4af4-9416-300cf923b6f3_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/cf0efb93-0d8d-45bf-a4c2-a910a446f258_1783418516.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/a24ee671-88fc-4808-a850-693f238f9d9b_1793344102.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/e8858087-2991-40db-9749-e37a03ebb6fd_1793344102.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/7df1cbdb-7de2-44fb-901c-c6c8ec19e533_1793344102.png",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/0d38ae1d-5c7b-42a9-a1ae-f2d3d717d80e_1793344102.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/56df8f40-99d9-4bda-be23-a3c4700cff6d_1793344102.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/3be0cf9e-3ec1-43f5-b588-60b4b922a740_1793344102.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/a3721db7-295a-4a27-9785-2c4772ecd042_1793344102.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/1cf3c6b0-8ead-45cb-a0e9-74ee158c4e6e_1793344102.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/03e4ef7a-1e51-4829-9fff-fd7dc8ba65b3_1793344102.jpg",
    ],
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/nha-hang/nha-hang-noi-song-huong-675334",
    rating: 4.1,
    reviews: 832,
    hours: "07:30 - 20:30",
    address: "32 Lê Lợi, Phường Thuận Hóa, Thành phố Huế",
    price: "200.000 đ - 300.000 đ",
  },
  {
    id: 4,
    name: "An Nhiên Garden Vegetarian",
    category: "Nhà hàng/Quán ăn chay",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/huetourism-top-cac-quan-chay-nha-hang-chay-ngon-bac-nhat-o-hue-5_1779193128.jpg",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/nha-hangquan-an-chay/an-nhien-garden-vegetarian-725223",
    rating: 4.9,
    reviews: 774,
    hours: "07:00 - 21:00",
    address: "Kiệt 11, đường Tỉnh Lộ 10, P. Phú Thượng, TP. Huế",
    price: "100.000 đ - 200.000 đ",
  },
  {
    id: 5,
    name: "Nhà hàng Le Parfum của khách sạn Azerai La Residence Hue",
    category: "Nhà hàng",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/12d224ef-1946-4437-89a6-ce3658cd80fa_1793344102.jpg",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/nha-hang/nha-hang-le-parfum-cua-khach-san-azerai-la-residence-hue-364833",
    rating: 4.8,
    reviews: 30,
    hours: "07:00 - 22:00",
    address: "5 Lê Lợi",
    price: "250.000 đ - 350.000 đ",
  },
  {
    id: 6,
    name: "Nhà hàng Nam Châu Hội Quán",
    category: "Nhà hàng",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/5902a454-a4f9-41ff-9e4d-f8a63d43b1f3_1793344102.jpg",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/nha-hang/nha-hang-nam-chau-hoi-quan-164587",
    rating: 4.2,
    reviews: 738,
    hours: "07:00 - 22:00",
    address: "04 và 07 Kim Long và Vạn Xuân, Phường Kim Long, Thành phố Huế",
    price: "250.000 đ - 400.000 đ",
  },
  {
    id: 7,
    name: "NOON Beer Club",
    category: "Bar/Pub",
    image: "https://huetripo.hue.gov.vn/uploads/Media/2026/10/AnhDaiDien_1793095290.jpg",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/barpub/noon-beer-club-663369",
    rating: 5,
    reviews: 85,
    hours: "17:00 - 03:00",
    address: "41 Bà Triệu, Phường Vỹ Dạ, thành phố Huế",
    price: "99.000 đ - 990.000 đ",
  },
  {
    id: 8,
    name: "Nhà hàng - Huong Giang Hotel Resort & Spa",
    category: "Nhà hàng",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10b403d1-9e3e-459f-af23-46e54f09cf44_1781781261.jpg",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/nha-hang/nha-hang-huong-giang-hotel-resort-spa-481321",
    rating: 4.1,
    reviews: 1627,
    hours: "07:00 - 21:00",
    address: "51 Lê Lợi",
    price: "200.000 đ - 400.000 đ",
  },
  {
    id: 9,
    name: "Nhà hàng Không gian xưa",
    category: "Nhà hàng",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/nha_hang_khong_gian_xua_1776758334.png",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/nha-hang/nha-hang-khong-gian-xua-961128",
    rating: 4.5,
    reviews: 136,
    hours: "07:30 - 20:30",
    address: "205 Điện Biên Phủ",
    price: "150.000 đ - 300.000 đ",
  },
  {
    id: 10,
    name: "Quán cơm chị Tẹo",
    category: "Quán ăn",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/8/34ce84fa-268a-4a69-9f55-923f8a85ec9f_1787127871.jpg",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/quan-an/quan-com-chi-teo-495931",
    rating: 3.9,
    reviews: 1122,
    hours: "10:00 - 08:30",
    address: "59 Hai Bà Trưng, Thuận Hóa, Huế, Vietnam",
    price: "50.000 đ - 100.000 đ",
  },
  {
    id: 11,
    name: "Quán Cơm Âm Phủ",
    category: "Quán ăn",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/3aec1e4b-34a5-4116-9d99-b34e5f2876ba_1781249697.jpg",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/quan-an/quan-com-am-phu-843941",
    rating: 2.8,
    reviews: 84,
    hours: "08:00 - 22:00",
    address: "51 Nguyễn Thái Học Nguyễn Thái Học",
    price: "Liên hệ",
  },
  {
    id: 12,
    name: "Quán Hạnh bánh khoái - nem lụi",
    category: "Quán ăn",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/5be2046b-90aa-48c3-b5bd-d45b345f1220_1781250030.jpg",
    url: "https://huetripo.hue.gov.vn/co-so-an-uong/quan-an/quan-hanh-banh-khoai-nem-lui-890351",
    rating: 4.3,
    reviews: 160,
    hours: "08:00 - 22:00",
    address: "13 Phó Đức Chính",
    price: "Liên hệ",
  },
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] =
    useState<FoodCategory>("Tất cả");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("huetravel-food-favorites");
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });
  const [locationMessage, setLocationMessage] = useState("");

  const filteredRestaurants = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");

    return restaurants.filter((restaurant) => {
      const matchesCategory =
        selectedCategory === "Tất cả" ||
        (selectedCategory === "Khác"
          ? ["Khu ẩm thực", "Tiệm bánh", "Ăn vặt/Vỉa hè"].includes(
              restaurant.category,
            )
          : restaurant.category === selectedCategory);

      const matchesSearch =
        !keyword ||
        `${restaurant.name} ${restaurant.category} ${restaurant.address}`
          .toLocaleLowerCase("vi")
          .includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);
  const visibleRestaurants =
    selectedCategory === "Tất cả" && !search.trim() && !showAll
      ? filteredRestaurants.slice(0, 4)
      : filteredRestaurants;
  const isAllView = selectedCategory === "Tất cả" && !search.trim();
  const isFeaturedView =
    isAllView && !showAll;

  function toggleFavorite(id: number) {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      try {
        localStorage.setItem(
          "huetravel-food-favorites",
          JSON.stringify(next),
        );
      } catch {
        // Vẫn cho phép sử dụng yêu thích trong phiên hiện tại.
      }

      return next;
    });
  }

  function showMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Trình duyệt không hỗ trợ xác định vị trí.");
      return;
    }

    setLocationMessage("Đang xác định vị trí của bạn...");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setLocationMessage("Đã mở vị trí của bạn trên Google Maps.");
      },
      () => {
        setLocationMessage(
          "Không lấy được vị trí. Hãy cấp quyền vị trí cho trình duyệt.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <main className="food-page">
      <section className="food-hero">
        <div className="food-hero-overlay" />
        <div className="food-hero-content">
          <span className="food-hero-kicker">
            <Sparkles size={14} /> Tinh hoa ẩm thực
          </span>
          <h1>Ẩm thực <span>Huế</span></h1>
          <p>Khám phá ẩm thực Cố đô – Hương vị đậm đà, khó quên</p>

          <form
            className="food-search"
            onSubmit={(event) => {
              event.preventDefault();
              document
                .getElementById("food-list")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Search size={21} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm nhà hàng, món ăn, quán cà phê..."
              aria-label="Tìm kiếm địa điểm ăn uống"
            />
            <button type="submit">
              Tìm kiếm <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </section>

      <section className="food-content" id="food-list">
        <div className="food-section-heading">
          <div className="food-heading-title">
            <span className="food-heading-icon"><Utensils size={23} /></span>
            <div>
              <span className="food-eyebrow">DANH MỤC ẨM THỰC</span>
            </div>
          </div>

          <div className="food-heading-actions">
            <button
              type="button"
              className="food-location-button food-location-icon"
              onClick={showMyLocation}
              aria-label="Bật vị trí của bạn"
              title="Bật vị trí của bạn"
            >
              <Navigation size={16} />
            </button>
          </div>
        </div>

        {locationMessage && (
          <p className="food-location-message" role="status">
            {locationMessage}
          </p>
        )}

        <div className="food-category-list" aria-label="Danh mục ăn uống">
          {categories.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`food-category-chip ${
                selectedCategory === label ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(label);
                setShowAll(true);
              }}
              aria-pressed={selectedCategory === label}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {!isFeaturedView && <div className="food-result-line">
          <p>
            Tìm thấy <strong>{filteredRestaurants.length}</strong> địa điểm
          </p>
          {favorites.length > 0 && (
            <p>
              <Heart size={15} fill="currentColor" /> {favorites.length} địa
              điểm yêu thích
            </p>
          )}
        </div>}

        {visibleRestaurants.length > 0 ? (
          <>
            <div className="food-featured-heading">
              <div>
                <h2>
                  {isFeaturedView
                    ? "Nhà hàng nổi bật"
                    : isAllView
                      ? "Tất cả địa điểm ăn uống"
                      : "Địa điểm ăn uống"}
                </h2>
                <p>
                  {isFeaturedView
                    ? "Khám phá những nhà hàng được yêu thích nhất tại Huế"
                    : `${filteredRestaurants.length} địa điểm phù hợp với lựa chọn của bạn`}
                </p>
              </div>
              {isAllView && (
                <button
                  type="button"
                  onClick={() => setShowAll((current) => !current)}
                >
                  {showAll ? "Thu gọn" : "Xem tất cả"} <ArrowRight size={16} />
                </button>
              )}
            </div>
          <div className="food-grid">
            {visibleRestaurants.map((restaurant) => {
              const isFavorite = favorites.includes(restaurant.id);

              return (
                <article className="food-card" key={restaurant.id}>
                  <div className="food-card-image-wrap">
                    <img
                      className="food-card-image"
                      src={restaurant.image}
                      alt={restaurant.name}
                      loading="lazy"
                    />
                    <div className="food-rating food-rating-badge">
                      <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                      <strong>{restaurant.rating.toFixed(1)}</strong>
                      <span>({restaurant.reviews})</span>
                    </div>
                    <div className="food-card-actions-top">
                      <button
                        type="button"
                        className="food-schedule-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          autoScheduleToItinerary({
                            id: `food-${restaurant.id}`,
                            name: restaurant.name,
                            category: `Ẩm thực / ${restaurant.category}`,
                            image: restaurant.image,
                            address: restaurant.address,
                            price: restaurant.price,
                            note: `Bữa ăn / Thưởng thức ẩm thực Huế: ${restaurant.name}`,
                          });
                        }}
                        aria-label="Lên lịch vào hành trình"
                        title="Tự động thêm vào bữa ăn trong lịch trình"
                      >
                        <CalendarPlus size={15} />
                      </button>
                      <button
                        type="button"
                        className={`food-favorite ${
                          isFavorite ? "selected" : ""
                        }`}
                        onClick={() => toggleFavorite(restaurant.id)}
                        aria-label={
                          isFavorite
                            ? "Bỏ khỏi yêu thích"
                            : "Thêm vào yêu thích"
                        }
                        title={
                          isFavorite
                            ? "Bỏ khỏi yêu thích"
                            : "Thêm vào yêu thích"
                        }
                      >
                        <Heart
                          size={15}
                          fill={isFavorite ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="food-card-body">
                    <h3>{restaurant.name}</h3>

                    <p className="food-card-info">
                      <Clock size={14} />
                      <span>{restaurant.hours}</span>
                    </p>
                    <p className="food-card-info">
                      <MapPin size={14} />
                      <span className="food-address-text">{restaurant.address}</span>
                    </p>

                    <div className="food-card-footer">
                      <span className="food-price">{restaurant.price}</span>
                      <Link
                        to={`/services/${restaurant.id}`}
                        className="food-detail-button"
                      >
                        Chi tiết <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          </>
        ) : (
          <div className="food-empty">
            <Search size={34} />
            <h3>Không tìm thấy địa điểm phù hợp</h3>
            <p>Thử từ khóa khác hoặc chọn danh mục khác nhé.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("Tất cả");
              }}
            >
              Xem tất cả địa điểm
            </button>
          </div>
        )}

        <footer className="food-footer-note">
          <span>Ẩm thực Huế</span>
          <span>•</span>
          <span>Mỗi món ăn là một câu chuyện về cố đô</span>
        </footer>
      </section>
    </main>
  );
}
