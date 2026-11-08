import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Flag,
  Globe,
  Link2,
  MapPin,
  Phone,
  Share2,
  Star,
  Utensils,
  CalendarPlus,
} from "lucide-react";
import { restaurants } from "./Services";
import { autoScheduleToItinerary } from "../services/itineraryService";
import "../styles/food-detail.css";

const formatReviewCount = (count: number) =>
  new Intl.NumberFormat("vi-VN").format(count);

export default function FoodDetail() {
  const { id } = useParams();
  const restaurant = restaurants.find((item) => String(item.id) === id);
  const [shareMessage, setShareMessage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!restaurant) return <Navigate to="/services" replace />;
  const place = restaurant;
  const galleryImages = place.images?.length ? place.images : [place.image];

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name}, ${place.address}`,
  )}`;

  async function shareRestaurant() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: place.name,
          text: place.summary ?? place.name,
          url: window.location.href,
        });
        return;
      }

      if (!navigator.clipboard) {
        setShareMessage("Trình duyệt không hỗ trợ sao chép liên kết.");
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Đã sao chép liên kết nhà hàng.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareMessage("Không thể chia sẻ. Vui lòng thử lại.");
    }
  }

  const detailParagraphs = place.detailParagraphs?.length
    ? place.detailParagraphs
    : [
        `${place.name} là ${place.category.toLocaleLowerCase("vi")} tại Huế. Tham khảo địa chỉ, giờ mở cửa và mức giá ở phần thông tin cơ sở; vui lòng liên hệ trực tiếp nhà hàng để xác nhận trước khi đến.`,
      ];

  return (
    <main className="food-detail-page">
      <div className="food-detail-shell">
        <nav className="food-detail-breadcrumb" aria-label="Điều hướng">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/services">Ăn uống</Link>
          <span>/</span>
          <span aria-current="page">{place.name}</span>
        </nav>

        <header className="food-detail-header">
          <div className="food-detail-title">
            <h1>{place.name}</h1>
            <p><MapPin size={17} />{place.address}</p>
          </div>
          <div className="food-detail-actions" aria-label="Tùy chọn nhà hàng">
            <Link to="/services" className="food-detail-action back" aria-label="Quay lại danh sách ăn uống">
              <ArrowLeft size={18} />
            </Link>
            <a href={place.url} target="_blank" rel="noreferrer" className="food-detail-action report" aria-label="Mở trang thông tin nguồn">
              <Flag size={18} />
            </a>
            {place.phone && (
              <a href={`tel:${place.phone}`} className="food-detail-action phone" aria-label="Gọi nhà hàng">
                <Phone size={18} />
              </a>
            )}
            {place.social && (
              <a href={place.social} target="_blank" rel="noreferrer" className="food-detail-action social" aria-label="Mở mạng xã hội nhà hàng">
                <Link2 size={18} />
              </a>
            )}
            {place.website && (
              <a href={place.website} target="_blank" rel="noreferrer" className="food-detail-action website" aria-label="Mở website nhà hàng">
                <Globe size={18} />
              </a>
            )}
            <button type="button" className="food-detail-action share" onClick={() => void shareRestaurant()} aria-label="Chia sẻ nhà hàng">
              <Share2 size={18} />
            </button>
          </div>
        </header>

        {shareMessage && <p className="food-detail-share-message" role="status">{shareMessage}</p>}

        <section className="food-detail-gallery" aria-label={`Ảnh ${place.name}`}>
          <div className="food-detail-gallery-main">
            <img
              src={galleryImages[activeImageIndex]}
              alt={`${place.name} - ảnh ${activeImageIndex + 1}`}
            />
            {galleryImages.length > 1 && (
              <span className="food-detail-gallery-count">
                {activeImageIndex + 1} / {galleryImages.length}
              </span>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="food-detail-gallery-thumbnails" aria-label="Chọn ảnh">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={index === activeImageIndex ? "active" : ""}
                  aria-label={`Xem ảnh ${index + 1} trên ${galleryImages.length}`}
                  aria-pressed={index === activeImageIndex}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={image}
                    alt=""
                    loading={index > 4 ? "lazy" : "eager"}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="food-detail-layout">
          <div className="food-detail-main">
            <section className="food-detail-summary">
              <h2>Tóm tắt</h2>
              <p>{place.summary ?? detailParagraphs[0]}</p>
            </section>
            <section className="food-detail-description">
              <h2>Nội dung chi tiết</h2>
              {detailParagraphs.map((paragraph, index) => (
                <p key={`${place.id}-detail-${index}`}>{paragraph}</p>
              ))}
            </section>
          </div>

          <aside className="food-detail-facts">
            <div><span>Loại hình:</span><strong>Cơ sở ăn uống</strong></div>
            <div><span>Lĩnh vực:</span><strong>{place.category}</strong></div>
            <div>
              <span>Giờ mở cửa:</span>
              <strong className="food-detail-hours">{place.hours}</strong>
            </div>
            <div><span>Mức giá:</span><strong>{place.price}</strong></div>
            <div><span>Đánh giá:</span><strong className="food-detail-rating"><Star size={15} fill="currentColor" /> {place.rating.toFixed(1)}/5 ({formatReviewCount(place.reviews)} lượt)</strong></div>
            {place.social && (
              <div><span>MXH:</span><a href={place.social} target="_blank" rel="noreferrer">{place.social.replace(/^https?:\/\//, "")}</a></div>
            )}
            {place.phone && (
              <div><span>Điện thoại:</span><a href={`tel:${place.phone}`}>{place.phone}</a></div>
            )}
            {place.website && (
              <div><span>Website:</span><a href={place.website} target="_blank" rel="noreferrer">{place.website.replace(/^https?:\/\//, "")}</a></div>
            )}
            <button
              type="button"
              className="food-detail-plan-btn"
              onClick={() => {
                autoScheduleToItinerary({
                  id: `food-${place.id}`,
                  name: place.name,
                  category: `Ẩm thực / ${place.category}`,
                  image: galleryImages[0] || place.image,
                  address: place.address,
                  price: place.price,
                  note: `Thưởng thức ẩm thực tại ${place.name}`,
                });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                margin: "12px 0 8px 0",
              }}
            >
              <CalendarPlus size={16} />
              <span>Lên lịch vào bữa ăn</span>
            </button>
            <a className="food-detail-source" href={place.url} target="_blank" rel="noreferrer">
              Xem trang thông tin <ExternalLink size={15} />
            </a>
            <a className="food-detail-map" href={mapUrl} target="_blank" rel="noreferrer">
              Xem bản đồ <MapPin size={15} />
            </a>
            <div className="food-detail-callout">
              <Utensils size={16} />
              <span>Thông tin có thể thay đổi. Vui lòng xác nhận với cơ sở trước khi đến.</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
