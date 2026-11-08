import { useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  Check,
  ExternalLink,
  MapPin,
  Share2,
  Star,
  Users,
} from "lucide-react";
import {
  accommodations,
  type AccommodationReview,
} from "./Accommodation";
import "../styles/accommodation.css";

type ReviewFilter = "all" | "newest" | "oldest";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

function formatReviewDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function AccommodationDetail() {
  const { id } = useParams();
  const accommodation = accommodations.find((item) => String(item.id) === id);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [shareMessage, setShareMessage] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState<AccommodationReview[]>([]);

  const photos = accommodation?.gallery?.length
    ? accommodation.gallery
    : accommodation
      ? [accommodation.image]
      : [];
  const reviews = useMemo(() => {
    const allReviews = [
      ...(accommodation?.reviews ?? []),
      ...submittedReviews,
    ];
    if (filter === "newest") {
      return [...allReviews].sort((a, b) => b.date.localeCompare(a.date));
    }
    if (filter === "oldest") {
      return [...allReviews].sort((a, b) => a.date.localeCompare(b.date));
    }
    return allReviews;
  }, [accommodation, filter, submittedReviews]);

  if (!accommodation) return <Navigate to="/accommodation" replace />;

  const stay = accommodation;

  async function shareAccommodation() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: stay.name,
          text: stay.description,
          url: window.location.href,
        });
        return;
      }

      if (!navigator.clipboard) {
        setShareMessage("Trình duyệt không hỗ trợ chia sẻ liên kết.");
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Đã sao chép liên kết nơi lưu trú.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareMessage("Không thể chia sẻ. Vui lòng thử lại.");
    }
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const author = reviewName.trim();
    const content = reviewContent.trim();
    if (!author || !content) return;

    setSubmittedReviews((current) => [
      {
        author,
        date: new Date().toISOString().slice(0, 10),
        rating: reviewRating,
        content,
      },
      ...current,
    ]);
    setReviewName("");
    setReviewContent("");
    setReviewRating(5);
    setShowReviewForm(false);
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${accommodation.name}, ${accommodation.address}`,
  )}`;
  const reviewCount =
    accommodation.reviewCount ?? accommodation.reviews?.length ?? 0;

  return (
    <main className="hs-accommodation hs-accommodation-detail">
      <div className="hs-accommodation-detail-shell">
        <nav className="hs-accommodation-breadcrumb" aria-label="Điều hướng">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/accommodation">Cơ sở lưu trú</Link>
          <span>/</span>
          <span aria-current="page">{accommodation.name}</span>
        </nav>

        <header className="hs-accommodation-detail-heading">
          <div>
            <span className="hs-accommodation-tag-modal">{accommodation.type}</span>
            <h1>{accommodation.name}</h1>
            <p>
              <MapPin size={17} />
              {accommodation.address}
              {accommodation.website && (
                <a href={accommodation.website} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} /> Website chính thức
                </a>
              )}
            </p>
          </div>
          <div className="hs-accommodation-detail-actions">
            <Link
              to="/accommodation"
              className="hs-accommodation-detail-icon"
              aria-label="Quay lại danh sách lưu trú"
            >
              <ArrowLeft size={18} />
            </Link>
            <button
              type="button"
              className="hs-accommodation-detail-icon"
              onClick={() => void shareAccommodation()}
              aria-label="Chia sẻ nơi lưu trú"
            >
              <Share2 size={18} />
            </button>
            <a
              className="hs-accommodation-detail-book"
              href={accommodation.website ?? mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Xem nơi lưu trú <ArrowUpRight size={16} />
            </a>
          </div>
        </header>

        {shareMessage && <p className="hs-accommodation-share-message" role="status">{shareMessage}</p>}

        <section
          className={`hs-accommodation-gallery ${photos.length > 1 ? "has-gallery" : ""}`}
          aria-label="Thư viện ảnh nơi lưu trú"
        >
          <img
            className="hs-accommodation-gallery-main"
            src={photos[selectedPhoto]}
            alt={`${accommodation.name} - ảnh ${selectedPhoto + 1}`}
          />
          {photos.length > 1 && (
            <div className="hs-accommodation-gallery-thumbnails">
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={`${photo}-${index}`}
                  className={`hs-accommodation-gallery-thumb ${selectedPhoto === index ? "active" : ""}`}
                  onClick={() => setSelectedPhoto(index)}
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-pressed={selectedPhoto === index}
                >
                  <img src={photo} alt="" />
                  {index === photos.length - 1 && accommodation.galleryMoreCount ? (
                    <span>+{accommodation.galleryMoreCount}</span>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </section>
        {accommodation.galleryNote && (
          <p className="hs-accommodation-gallery-note">{accommodation.galleryNote}</p>
        )}

        <div className="hs-accommodation-detail-layout">
          <div className="hs-accommodation-detail-main">
            <section className="hs-accommodation-description-section">
              <h2>Nội dung chi tiết</h2>
              {accommodation.detailParagraphs?.length ? (
                accommodation.detailParagraphs.map((paragraph, index) => (
                  <p key={`${accommodation.id}-description-${index}`}>{paragraph}</p>
                ))
              ) : (
                <p>{accommodation.description}</p>
              )}
            </section>

            <section className="hs-accommodation-rooms">
              <div className="hs-accommodation-detail-section-heading">
                <div>
                  <span>NGHỈ NGƠI & THƯ GIÃN</span>
                  <h2>Thông tin phòng</h2>
                </div>
                {accommodation.rooms && accommodation.rooms.length > 0 && (
                  <span className="hs-accommodation-room-count">
                    {accommodation.rooms.length} hạng phòng
                  </span>
                )}
              </div>
              {accommodation.rooms && accommodation.rooms.length > 0 ? (
                <div className="hs-accommodation-room-grid">
                  {accommodation.rooms.map((room) => (
                    <article className="hs-accommodation-room-card" key={room.name}>
                      <img
                        src={room.image}
                        alt={room.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = stay.image;
                        }}
                      />
                      <div className="hs-accommodation-room-body">
                        <h3>{room.name}</h3>
                        <strong>{formatPrice(room.price)} <small>/đêm</small></strong>
                        <div className="hs-accommodation-room-facts">
                          <span><BedDouble size={15} />{room.bed}</span>
                          <span>{room.area}</span>
                          <span><Users size={15} />{room.guests}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="hs-accommodation-no-reviews">
                  Thông tin hạng phòng chưa được cập nhật. Vui lòng liên hệ cơ sở lưu trú để xác nhận loại phòng, giá và tình trạng phòng.
                </p>
              )}
            </section>

            <section className="hs-accommodation-reviews">
              <div className="hs-accommodation-detail-section-heading">
                <div>
                  <span>TRẢI NGHIỆM CỦA DU KHÁCH</span>
                  <h2>Đánh giá</h2>
                </div>
                <button
                  type="button"
                  className="hs-accommodation-write-review"
                  onClick={() => setShowReviewForm((current) => !current)}
                >
                  Viết đánh giá
                </button>
              </div>

              <div className="hs-accommodation-review-summary">
                <Star size={34} fill="currentColor" aria-hidden="true" />
                <strong>{accommodation.rating.toFixed(1)}<small>/5</small></strong>
                <span>
                  {reviewCount > 0
                    ? `${reviewCount} lượt đánh giá`
                    : "Chưa có lượt đánh giá được hiển thị"}
                </span>
              </div>

              {showReviewForm && (
                <form className="hs-accommodation-review-form" onSubmit={submitReview}>
                  <label>
                    Tên của bạn
                    <input
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      required
                      maxLength={70}
                    />
                  </label>
                  <label>
                    Số sao
                    <select
                      value={reviewRating}
                      onChange={(event) => setReviewRating(Number(event.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>{rating}/5</option>
                      ))}
                    </select>
                  </label>
                  <label className="hs-accommodation-review-message">
                    Nhận xét
                    <textarea
                      value={reviewContent}
                      onChange={(event) => setReviewContent(event.target.value)}
                      required
                      rows={4}
                      maxLength={1200}
                    />
                  </label>
                  <button type="submit"><Check size={16} /> Gửi đánh giá</button>
                </form>
              )}

              <label className="hs-accommodation-review-filter">
                Lọc theo:
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value as ReviewFilter)}
                >
                  <option value="all">Tất cả</option>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </label>

              <div className="hs-accommodation-review-list">
                {reviews.map((review, index) => (
                  <article className="hs-accommodation-review" key={`${review.author}-${review.date}-${index}`}>
                    <div className="hs-accommodation-review-header">
                      <strong>{review.author}</strong>
                      <time dateTime={review.date}>{formatReviewDate(review.date)}</time>
                    </div>
                    <div className="hs-accommodation-review-rating" aria-label={`${review.rating} trên 5 sao`}>
                      <span>Rất hài lòng</span>
                      <strong>{review.rating}/5</strong>
                      <span aria-hidden="true">
                        {Array.from({ length: 5 }, (_, starIndex) => (
                          <Star
                            key={starIndex}
                            size={14}
                            fill={starIndex < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </span>
                    </div>
                    <p>{review.content}</p>
                  </article>
                ))}
                {reviews.length === 0 && (
                  <p className="hs-accommodation-no-reviews">Chưa có đánh giá cho nơi lưu trú này.</p>
                )}
              </div>
            </section>
          </div>

          <aside className="hs-accommodation-facts">
            <span className="hs-accommodation-eyebrow hs-accommodation-eyebrow-dark">THÔNG TIN LƯU TRÚ</span>
            <h2>Thông tin cơ sở</h2>
            <div><span>Loại hình</span><strong>{accommodation.type}{accommodation.id === 4 ? " 5 sao" : ""}</strong></div>
            <div><span>Địa chỉ</span><strong>{accommodation.address}</strong></div>
            <div><span>Giá tham khảo</span><strong>{formatPrice(accommodation.price)}/đêm</strong></div>
            <div><span>Đánh giá</span><strong className="hs-accommodation-fact-rating"><Star size={15} fill="currentColor" /> {accommodation.rating.toFixed(1)}/5</strong></div>
            {accommodation.website && (
              <a href={accommodation.website} target="_blank" rel="noreferrer">
                Website chính thức <ExternalLink size={14} />
              </a>
            )}
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              Xem bản đồ <MapPin size={14} />
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
