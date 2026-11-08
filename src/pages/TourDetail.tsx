import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Check,
  Share2,
  Star,
} from "lucide-react";
import { formatPrice, tours } from "./Tours";
import { scheduleTourToItinerary } from "../services/itineraryService";
import "../styles/tours.css";

export default function TourDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const tour = tours.find((item) => item.slug === slug);
  const contentDetail = tour?.detail;
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);

  const gallery = useMemo(() => {
    if (!tour) return [];
    if (tour.detail?.gallery.length) return tour.detail.gallery;
    const otherTourImages = tours
      .filter((item) => item.id !== tour.id)
      .map((item) => item.image);
    return [tour.image, ...otherTourImages].slice(0, 5);
  }, [tour]);

  useEffect(() => {
    setSelectedImage(0);
    setCopied(false);
  }, [slug]);

  if (!tour) {
    return <Navigate to="/tours" replace />;
  }

  const itinerary = contentDetail?.itinerary ?? [
    {
      title: tour.schedule,
      description: `Bắt đầu hành trình khám phá ${tour.location}. Thời lượng dự kiến: ${tour.duration}.`,
    },
    {
      title: `Trải nghiệm ${tour.location}`,
      description: tour.description,
      image: tour.image,
    },
    {
      title: "Kết thúc hành trình",
      description: `Khép lại chuyến tham quan ${tour.location}. Thời gian và các dịch vụ cụ thể được xác nhận khi đặt tour.`,
    },
  ];

  async function shareTour(title: string, text: string) {
    const shareData = {
      title,
      text,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const handleScheduleTour = () => {
    if (!tour) return;
    scheduleTourToItinerary({
      id: tour.id,
      name: tour.name,
      price: tour.price,
      image: gallery[0] || tour.image,
      duration: tour.duration,
      itinerary: tour.detail?.itinerary,
    });
    navigate("/planner#itinerary");
  };

  return (
    <main className="hs-tour-page hs-tour-detail-page">
      <div className="hs-tour-detail-shell">
        <nav className="hs-tour-breadcrumb" aria-label="Điều hướng">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/tours">Tour du lịch</Link>
          <span>/</span>
          <span aria-current="page">{tour.name}</span>
        </nav>

        <header className="hs-tour-detail-heading">
          <h1>{tour.name}</h1>
          <div className="hs-tour-detail-actions">
            <Link to="/tours" className="hs-tour-icon-link" aria-label="Quay lại danh sách tour">
              <ArrowLeft size={18} />
            </Link>
            <button
              type="button"
              className="hs-tour-icon-link"
              onClick={() => shareTour(tour.name, tour.description)}
              aria-label={copied ? "Đã sao chép liên kết" : "Chia sẻ tour"}
              title={copied ? "Đã sao chép liên kết" : "Chia sẻ tour"}
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
            </button>
            <button
              type="button"
              className="hs-tour-book-button"
              onClick={handleScheduleTour}
              title="Tự động thêm tour vào lịch trình"
            >
              Lên lịch trình <ArrowRight size={16} />
            </button>
          </div>
        </header>

        <section className="hs-tour-gallery" aria-label="Hình ảnh tour">
          <img
            className="hs-tour-gallery-main"
            src={gallery[selectedImage]}
            alt={`${tour.name} - ảnh ${selectedImage + 1}`}
          />
          <div className="hs-tour-gallery-thumbnails">
            {gallery.map((image, index) => ({ image, index }))
              .filter(({ index }) => index !== selectedImage)
              .map(({ image, index }) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={`hs-tour-gallery-thumb ${selectedImage === index ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
                aria-label={`Xem ảnh ${index + 1}`}
                aria-pressed={selectedImage === index}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </section>

        <div className="hs-tour-detail-layout">
          <section className="hs-tour-itinerary">
            <div className="hs-tour-detail-section-heading">
              <span>HÀNH TRÌNH KHÁM PHÁ</span>
              <h2>Chương trình tour</h2>
            </div>
            <>
              <p>{tour.description}</p>
              <div className="hs-tour-itinerary-list">
                {itinerary.map((item) => (
                  <article className="hs-tour-plan-item" key={item.title}>
                    <span className="hs-tour-plan-marker" />
                    <div className="hs-tour-plan-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      {item.image && (
                        <img src={item.image} alt={item.title} loading="lazy" />
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {contentDetail && (
                <>
                <section className="hs-tour-inclusions">
                  <div className="hs-tour-detail-section-heading">
                    <span>CHI TIẾT DỊCH VỤ</span>
                    <h2>Giá tour bao gồm</h2>
                  </div>
                  <div className="hs-tour-inclusion-grid">
                    {contentDetail.inclusions.map((group) => (
                      <article className="hs-tour-inclusion-card" key={group.title}>
                        <h3>{group.title}</h3>
                        <ul>
                          {group.items.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="hs-tour-exclusions">
                  <div className="hs-tour-detail-section-heading">
                    <span>THÔNG TIN CẦN BIẾT</span>
                    <h2>Giá tour không bao gồm</h2>
                  </div>
                  <ul>
                    {contentDetail.exclusions.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>

                <section className="hs-tour-child-pricing">
                  <div className="hs-tour-detail-section-heading">
                    <span>CHÍNH SÁCH GIÁ</span>
                    <h2>Giá tour trẻ em</h2>
                  </div>
                  <div className="hs-tour-child-grid">
                    {contentDetail.childPricing.map((item) => (
                      <article key={item.age}>
                        <strong>{item.age}</strong>
                        <p>{item.price}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <blockquote className="hs-tour-tagline">
                  “{contentDetail.tagline}”
                </blockquote>
                </>
              )}
            </>
          </section>

          <aside className="hs-tour-info-card" aria-label="Thông tin tour">
            <div className="hs-tour-info-row">
              <span>Mã tour</span>
              <strong>{tour.detail?.code ?? `HST-${String(tour.id).padStart(4, "0")}`}</strong>
            </div>
            <div className="hs-tour-info-row">
              <span>Loại tour</span>
              <strong>{tour.category}</strong>
            </div>
            <div className="hs-tour-info-row">
              <span>Hình thức</span>
              <strong>{tour.detail?.format ?? "Tour trải nghiệm"}</strong>
            </div>
            <div className="hs-tour-info-row">
              <span>Thời gian</span>
              <strong>{tour.duration}</strong>
            </div>
            <div className="hs-tour-info-row">
              <span>Địa điểm</span>
              <strong>{tour.location}</strong>
            </div>
            <div className="hs-tour-info-row">
              <span>Đánh giá</span>
              <strong className="hs-tour-info-rating">
                <Star size={15} fill="currentColor" /> {tour.rating.toFixed(1)} / 5
              </strong>
            </div>
            <div className="hs-tour-info-row">
              <span>Đơn vị</span>
              <strong>{tour.detail?.operator ?? "HueSmart Travel"}</strong>
            </div>
            <div className="hs-tour-info-price">
              <span>Giá tham khảo / người</span>
              <strong>{formatPrice(tour.price)}</strong>
            </div>
            <button
              type="button"
              className="hs-tour-book-button hs-tour-info-book"
              onClick={handleScheduleTour}
              title="Tự động thêm tour vào lịch trình"
            >
              <CalendarPlus size={17} /> Lên lịch cho tour
            </button>
            <p className="hs-tour-info-caption">
              <CalendarDays size={14} /> Lịch trình có thể tùy chỉnh theo nhu cầu.
            </p>
          </aside>
        </div>

        {tour.detail?.relatedTours && (
          <section className="hs-tour-related">
            <div className="hs-tour-detail-section-heading">
              <span>GỢI Ý HÀNH TRÌNH</span>
              <h2>Các tour khác</h2>
            </div>
            <div className="hs-tour-related-grid">
              {tour.detail.relatedTours.map((related) => (
                <a
                  className="hs-tour-related-card"
                  href={related.url}
                  key={related.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={related.image} alt={related.name} loading="lazy" />
                  <div>
                    <h3>{related.name}</h3>
                    <p>{related.duration}</p>
                    <strong>{formatPrice(related.price)}</strong>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
