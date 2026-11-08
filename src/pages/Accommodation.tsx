
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Hotel, Search, ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/accommodation.css";

export type AccommodationReview = {
  author: string;
  date: string;
  rating: number;
  content: string;
};

export type AccommodationItem = {
  id: number;
  name: string;
  type: "Khách sạn" | "Homestay" | "Resort";
  address: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  website?: string;
  gallery?: string[];
  galleryNote?: string;
  galleryMoreCount?: number;
  detailParagraphs?: string[];
  rooms?: {
    name: string;
    price: number;
    bed: string;
    area: string;
    guests: string;
    image: string;
  }[];
  reviewCount?: number;
  reviews?: AccommodationReview[];
};

export const accommodations: AccommodationItem[] = [
  {
    id: 1,
    name: "Melia Vinpearl Huế",
    type: "Khách sạn",
    address: "50A Hùng Vương, thành phố Huế",
    price: 1500000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=85",
    ],
    galleryNote: "Ảnh tham khảo loại hình lưu trú, không phải ảnh xác thực của cơ sở.",
    description:
      "Không gian nghỉ dưỡng hiện đại, dịch vụ tiện nghi và vị trí thuận lợi để khám phá trung tâm Huế.",
    detailParagraphs: [
      "Melia Vinpearl Huế là lựa chọn lưu trú dành cho du khách tìm kiếm không gian nghỉ dưỡng hiện đại tại trung tâm thành phố. Vị trí thuận lợi giúp bạn dễ dàng sắp xếp lịch trình khám phá Huế.",
      "Thông tin hiện có giới thiệu nơi đây với không gian tiện nghi và dịch vụ lưu trú phù hợp cho chuyến đi nghỉ dưỡng hoặc tham quan. Giá hiển thị trên trang là mức tham khảo mỗi đêm; vui lòng kiểm tra với cơ sở để biết giá và tình trạng phòng theo ngày.",
    ],
  },
  {
    id: 2,
    name: "Pilgrimage Village Resort",
    type: "Resort",
    address: "130 Minh Mạng, thành phố Huế",
    price: 2200000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=85",
    ],
    galleryNote: "Ảnh tham khảo loại hình lưu trú, không phải ảnh xác thực của cơ sở.",
    description:
      "Khu nghỉ dưỡng giữa thiên nhiên xanh mát, thích hợp cho kỳ nghỉ thư giãn và riêng tư.",
    detailParagraphs: [
      "Pilgrimage Village Resort mang đến lựa chọn nghỉ dưỡng trong không gian xanh, yên bình, phù hợp với du khách muốn dành thời gian thư giãn và riêng tư trong chuyến đi Huế.",
      "Bạn có thể tham khảo mức giá lưu trú đang hiển thị để lên kế hoạch ngân sách. Các hạng phòng, dịch vụ cụ thể và tình trạng đặt phòng thay đổi theo thời điểm; vui lòng liên hệ khu nghỉ dưỡng để được xác nhận trước khi đặt.",
    ],
  },
  {
    id: 3,
    name: "Amy 2 Hostel Huế",
    type: "Homestay",
    address: "Thành phố Huế",
    price: 350000,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85",
    ],
    galleryNote: "Ảnh tham khảo loại hình lưu trú, không phải ảnh xác thực của cơ sở.",
    description:
      "Lựa chọn lưu trú thân thiện, phù hợp với du khách trẻ và hành trình khám phá Huế tiết kiệm.",
    detailParagraphs: [
      "Amy 2 Hostel Huế là gợi ý lưu trú thân thiện dành cho du khách trẻ và những ai muốn tối ưu chi phí khi khám phá thành phố. Đây là lựa chọn phù hợp để làm điểm dừng chân trong hành trình tham quan Huế.",
      "Giá hiển thị là mức tham khảo mỗi đêm. Thông tin chi tiết về loại phòng, tiện ích và tình trạng phòng chưa được cung cấp trên trang; bạn nên liên hệ cơ sở để xác nhận trước khi đặt.",
    ],
  },
  {
    id: 4,
    name: "Khách sạn Silk Path Grand Hotel & Spa Huế",
    type: "Khách sạn",
    address: "02 Lê Lợi, thành phố Huế",
    price: 2400000,
    rating: 4.6,
    reviewCount: 220,
    website: "https://silkpathhotel.com/vi/hue/",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/87bcae71-035d-42e1-9ccc-799ae076641b_1793349777.jpg",
    description:
      "Silk Path Grand Huế Hotel & Spa gây ấn tượng bởi thiết kế đẳng cấp 5 sao tráng lệ, kết hợp kiến trúc cung đình và nét tinh tế Á – Âu giữa lòng cố đô.",
    gallery: [
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/87bcae71-035d-42e1-9ccc-799ae076641b_1793349777.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/783df818-2184-4e2f-9b66-b4a88ff460b6_1793349777.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/f14bda86-c3d2-4233-8503-ce956394cb61_1793349777.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/b55cc246-5970-4b7f-bcfc-98eace422ad1_1793349777.jpg",
      "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/b00d4c11-7d06-4385-bdc6-29b6abad5e30_1793349777.jpg",
    ],
    galleryMoreCount: 16,
    detailParagraphs: [
      "Silk Path Grand Huế Hotel & Spa gây ấn tượng bởi thiết kế đẳng cấp 5 sao tráng lệ. Trong từng chi tiết thiết kế, bạn đều sẽ bắt gặp lối kiến trúc vẩy rồng quyền quý gợi liên tưởng đến không gian sống xa hoa của tầng lớp vua chúa, lại uốn lượn trong mây tựa một dải lụa mượt mà thơ mộng. Bộ sưu tập tranh sơn mài thếp vàng của họa sĩ Bùi Hữu Hùng điểm xuyết thêm nét cao sang, tôn quý của văn hóa cung đình. Khách sạn cung cấp chỗ nghỉ với nhà hàng, chỗ đỗ xe riêng miễn phí, hồ bơi ngoài trời và trung tâm thể dục.",
      "Sở hữu 196 phòng nghỉ từ Deluxe tiêu chuẩn đến các phòng Suite đẳng cấp, Silk Path Grand Huế Hotel & Spa mang đến trải nghiệm nghỉ dưỡng hoài cổ tinh tế giữa lòng Cố đô. Phòng nghỉ được trang hoàng với nội thất gỗ sang trọng cùng các chi tiết bàn ghế, giường ngủ và đèn tạo hình theo phong cách cung đình. Từ khung cửa mái vòm phong cách Pháp, du khách có thể chiêm ngưỡng toàn cảnh thành phố Huế, sông Hương, khu vườn nhiệt đới và bể bơi ngoài trời.",
      "Khách sạn mang đến trải nghiệm nghỉ dưỡng thượng lưu đậm nét Huế. Du khách có thể thư giãn tại bể bơi được thiết kế uốn lượn mềm mại hoặc nhâm nhi trà bánh dưới những tán cây trong khu vườn nhiệt đới.",
      "Silk Path Grand Huế còn là điểm hẹn ẩm thực với nhà hàng Nam Phương phục vụ món ăn thuần túy vị Huế cùng các món đặc trưng do đội ngũ đầu bếp sáng tạo. Nhà hàng Olivio bên hồ bơi mang đến phong vị Địa Trung Hải.",
      "Khách sạn có một phòng đại tiệc và bốn phòng họp đa chức năng, phù hợp tổ chức sự kiện, tiệc cưới và hội thảo. Không gian được trang bị hệ thống âm thanh, ánh sáng và thiết bị hiện đại, kết hợp thiết kế lấy cảm hứng từ thiên nhiên.",
      "Với thiết kế sang trọng và trải nghiệm nghỉ dưỡng 5 sao, Silk Path Grand Huế đưa du khách đến gần hơn với nét đẹp di sản, đồng thời tận hưởng nhịp sống hiện đại và thơ mộng của cố đô.",
    ],
    rooms: [
      { name: "Executive Suite", price: 5000000, bed: "Giường đôi", area: "32 m²", guests: "2 người lớn", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=85" },
      { name: "President Suite", price: 40000000, bed: "Giường đôi", area: "32 m²", guests: "2 người lớn", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=85" },
      { name: "Phòng Deluxe", price: 2400000, bed: "Giường đôi", area: "32 m²", guests: "2 người lớn", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=85" },
      { name: "Junior Suite", price: 4650000, bed: "Giường đôi", area: "32 m²", guests: "2 người lớn", image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=900&q=85" },
    ],
    reviews: [
      {
        author: "quynhgiang nguyen",
        date: "2026-02-27",
        rating: 4,
        content: "Mọi thứ tuyệt vời, khách sạn đẹp, vị trí tốt, đồ ăn sáng ngon. Khi check-out, lễ tân báo thất lạc dép đi hồ bơi và nhờ gia đình chờ để kiểm tra. Việc này khá bất tiện vì gia đình còn phải di chuyển xa.",
      },
      {
        author: "Vân Nguyễn",
        date: "2026-03-02",
        rating: 5,
        content: "Mình đã có một chuyến du lịch Huế rất đáng nhớ. Trải nghiệm tuyệt vời ở Silk Path là một phần trong đó. Có chút nhầm lẫn thông tin lúc nhận phòng nhưng khách sạn giải quyết nhanh và hỗ trợ check-in sớm. Nhân viên nhiệt tình, tạo cảm giác được chào đón. Nếu quay lại Huế, mình vẫn sẽ chọn Silk Path.",
      },
      {
        author: "F&B",
        date: "2026-02-22",
        rating: 2,
        content: "Khách sạn cách âm chưa tốt, có thể nghe tiếng từ hành lang và các phòng lân cận. Thời gian chờ check-in khá lâu dù đã đặt và thanh toán trước trên ứng dụng.",
      },
      {
        author: "Michael Hoang",
        date: "2026-01-24",
        rating: 3,
        content: "Khách sạn có vị trí thuận tiện trên đường Lê Lợi, kiến trúc đẹp, nhiều dịch vụ như hồ bơi, phòng gym, spa, khu vui chơi, nhà hàng và quầy cà phê. Nhân viên thân thiện, phòng sạch sẽ. Khả năng cách âm và sự đa dạng của bữa sáng có thể cải thiện thêm.",
      },
      {
        author: "Ha Tr",
        date: "2026-03-06",
        rating: 3,
        content: "Khách sạn khá đẹp. Tuy nhiên, khâu chăm sóc khách hàng và hỗ trợ lúc nhận phòng còn có thể cải thiện; khách phải chờ lâu và tự tìm nhân viên để được hướng dẫn lên phòng.",
      },
    ],
  },
];

const categories = ["Tất cả", "Khách sạn", "Homestay", "Resort"] as const;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

export default function Accommodation() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Tất cả");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");

    return accommodations.filter((item) => {
      const matchesSearch =
        item.name.toLocaleLowerCase("vi").includes(keyword) ||
        item.address.toLocaleLowerCase("vi").includes(keyword) ||
        item.type.toLocaleLowerCase("vi").includes(keyword);

      const matchesCategory =
        category === "Tất cả" || item.type === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <main className="hs-accommodation">
      <section
        className="hs-accommodation-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8, 37, 34, 0.88) 0%, rgba(8, 37, 34, 0.63) 48%, rgba(8, 37, 34, 0.12) 100%), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=90")`,
        }}
      >
        <div className="hs-accommodation-hero-inner">
          <motion.div
            className="hs-accommodation-hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="hs-accommodation-eyebrow">
              HUE SMART TRAVEL
            </span>

            <h1>
              Nghỉ dưỡng giữa
              <br />
              <span>lòng cố đô Huế</span>
            </h1>

            <p>
              Tìm khách sạn, homestay và resort phù hợp để
              tận hưởng hành trình khám phá Huế trọn vẹn.
            </p>

            <div className="hs-accommodation-search">
              <Search size={21} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Bạn muốn nghỉ ở đâu?"
                aria-label="Tìm cơ sở lưu trú"
              />
              {search && (
                <button
                  type="button"
                  className="hs-accommodation-clear"
                  onClick={() => setSearch("")}
                  aria-label="Xóa nội dung tìm kiếm"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="hs-accommodation-hero-note">
              <MapPin size={16} />
              <span>Khám phá những điểm lưu trú tại Huế</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="hs-accommodation-content">
        <div className="hs-accommodation-heading">
          <div>
            <span className="hs-accommodation-eyebrow hs-accommodation-eyebrow-dark">
              NGHỈ NGƠI & THƯ GIÃN
            </span>
            <h2>Không gian dành cho bạn</h2>
            <p>
              Từ khách sạn sang trọng đến những nơi nghỉ dưỡng
              yên bình, hãy chọn điểm dừng chân phù hợp.
            </p>
          </div>

          <div className="hs-accommodation-heading-icon">
            <Hotel size={27} />
          </div>
        </div>

        <div className="hs-accommodation-toolbar">
          <div className="hs-accommodation-filters" aria-label="Lọc loại lưu trú">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={
                  category === item
                    ? "hs-accommodation-filter active"
                    : "hs-accommodation-filter"
                }
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="hs-accommodation-result">
            Tìm thấy <strong>{filtered.length}</strong> nơi lưu trú
          </p>
        </div>

        {filtered.length > 0 ? (
          <motion.div layout className="hs-accommodation-grid">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, index) => (
                <motion.article
                  layout
                  key={item.id}
                  className="hs-accommodation-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <div className="hs-accommodation-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                    />

                    <span className="hs-accommodation-tag">
                      {item.type}
                    </span>

                    <div className="hs-accommodation-image-rating">
                      <Star size={14} fill="currentColor" />
                      <strong>{item.rating.toFixed(1)}</strong>
                    </div>
                  </div>

                  <div className="hs-accommodation-card-body">
                    <div className="hs-accommodation-card-title">
                      <h3>{item.name}</h3>
                      <span className="hs-accommodation-card-arrow">
                        <ArrowUpRight size={19} />
                      </span>
                    </div>

                    <p className="hs-accommodation-address">
                      <MapPin size={16} />
                      <span>{item.address}</span>
                    </p>

                    <p className="hs-accommodation-description">
                      {item.description}
                    </p>

                    <div className="hs-accommodation-card-footer">
                      <div className="hs-accommodation-price">
                        <span>Giá tham khảo từ</span>
                        <strong>{formatPrice(item.price)}</strong>
                        <small>/ đêm</small>
                      </div>

                      <Link
                        className="hs-accommodation-detail-button"
                        to={`/accommodation/${item.id}`}
                      >
                        Chi tiết
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="hs-accommodation-empty">
            <div className="hs-accommodation-empty-icon">
              <Search size={28} />
            </div>
            <h3>Chưa tìm thấy nơi lưu trú</h3>
            <p>
              Hãy thử từ khóa khác hoặc chọn một loại hình lưu trú khác.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("Tất cả");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        <div className="hs-accommodation-note">
          <Hotel size={20} />
          <p>
            Giá trong danh sách là giá tham khảo, có thể thay đổi
            theo ngày lưu trú và chính sách của từng cơ sở.
          </p>
        </div>
      </section>

    </main>
  );
}
