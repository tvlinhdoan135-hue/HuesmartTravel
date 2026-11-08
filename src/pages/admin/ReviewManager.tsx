import { useState, useMemo } from "react";
import {
  Star,
  Search,
  Trash2,
  Check,
  X,
  MessageSquare,
  EyeOff,
  RotateCcw,
} from "lucide-react";

export interface DestinationReview {
  id: string;
  destinationName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  status: "Đã duyệt" | "Chờ duyệt" | "Bị ẩn";
  adminReply?: string;
}

export const REVIEWS_STORAGE_KEY = "huesmart-admin-reviews";

const DEFAULT_REVIEWS: DestinationReview[] = [
  {
    id: "rev-1",
    destinationName: "Đại Nội Huế",
    reviewerName: "Trần Bảo Ngọc",
    rating: 5,
    comment: "Không gian cung điện cổ kính, nguy nga tráng lệ! Rất ấn tượng với Cổng Ngọ Môn và Điện Thái Hòa vừa được trùng tu xong. Thuyết minh viên giới thiệu rất truyền cảm.",
    date: "11:10 hôm nay",
    status: "Đã duyệt",
    adminReply: "Cảm ơn bạn đã ghé thăm Đại Nội và để lại đánh giá tuyệt vời!",
  },
  {
    id: "rev-2",
    destinationName: "Chùa Thiên Mụ",
    reviewerName: "Hoàng Minh Tuấn",
    rating: 5,
    comment: "Khung cảnh thanh tịnh tuyệt vời bên bờ sông Hương lúc hoàng hôn. Tháp Phước Duyên uy nghi và tiếng chuông chùa ngân vang làm lòng người nhẹ nhõm.",
    date: "Hôm qua",
    status: "Đã duyệt",
  },
  {
    id: "rev-3",
    destinationName: "Lăng Khải Định",
    reviewerName: "Lê Nhật Tân",
    rating: 4,
    comment: "Kiến trúc khảm sành sứ đỉnh cao tinh xảo, chụp ảnh góc nào cũng đẹp. Leo hơi nhiều bậc thang nhưng lên tới đỉnh rất xứng đáng.",
    date: "04/11/2026",
    status: "Đã duyệt",
  },
  {
    id: "rev-4",
    destinationName: "Ẩm thực Chè Hẻm",
    reviewerName: "Phạm Hải Đăng",
    rating: 5,
    comment: "Chè bột lọc heo quay ăn lạ miệng mà ngon bất ngờ! Giá rất bình dân và phục vụ nhanh nhẹn.",
    date: "02/11/2026",
    status: "Chờ duyệt",
  },
  {
    id: "rev-5",
    destinationName: "Đồi Vọng Cảnh",
    reviewerName: "Ẩn danh",
    rating: 2,
    comment: "Chỗ đậu xe hơi nhỏ, cần thêm thùng rác bảo vệ môi trường đồi thông.",
    date: "30/10/2026",
    status: "Chờ duyệt",
  },
];

interface ReviewManagerProps {
  onNotify?: (msg: string) => void;
}

export default function ReviewManager({ onNotify }: ReviewManagerProps) {
  const [reviews, setReviews] = useState<DestinationReview[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_REVIEWS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [replyingReview, setReplyingReview] = useState<DestinationReview | null>(null);
  const [replyText, setReplyText] = useState("");

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const saveReviews = (items: DestinationReview[]) => {
    setReviews(items);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(items));
  };

  const handleApprove = (id: string) => {
    const next = reviews.map((r) =>
      r.id === id ? { ...r, status: "Đã duyệt" as const } : r
    );
    saveReviews(next);
    notify("Đã duyệt đánh giá thành công!");
  };

  const handleHide = (id: string) => {
    const next = reviews.map((r) =>
      r.id === id ? { ...r, status: "Bị ẩn" as const } : r
    );
    saveReviews(next);
    notify("Đã ẩn đánh giá khỏi giao diện công khai!");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      const next = reviews.filter((r) => r.id !== id);
      saveReviews(next);
      notify("Đã xóa đánh giá vi phạm!");
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview || !replyText.trim()) return;

    const next = reviews.map((r) =>
      r.id === replyingReview.id ? { ...r, adminReply: replyText.trim() } : r
    );
    saveReviews(next);
    notify("Đã gửi phản hồi từ Ban Quản trị!");
    setReplyingReview(null);
    setReplyText("");
  };

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.destinationName.toLowerCase().includes(q) ||
        r.reviewerName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);
      const matchStar =
        starFilter === "Tất cả" || String(r.rating) === starFilter;
      const matchStatus =
        statusFilter === "Tất cả" || r.status === statusFilter;
      return matchSearch && matchStar && matchStatus;
    });
  }, [reviews, searchQuery, starFilter, statusFilter]);

  return (
    <div className="admin-subview-panel">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: 14 }}>
        <div className="admin-page-title-wrap">
          <h1 className="admin-page-title">
            <Star size={26} />
            <span>Quản lý Đánh giá & Phản hồi du khách ({reviews.length})</span>
          </h1>
          <div className="admin-page-subtitle">
            Kiểm duyệt bình luận, đánh giá sao và tương tác chăm sóc khách du lịch Cố đô Huế
          </div>
        </div>

        <button
          type="button"
          className="admin-btn-secondary"
          onClick={() => {
            saveReviews(DEFAULT_REVIEWS);
            notify("Đã khôi phục danh sách đánh giá mẫu!");
          }}
        >
          <RotateCcw size={15} />
          <span>Khôi phục mẫu</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="admin-dest-toolbar">
        <div className="admin-dest-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo điểm đến, tên người đánh giá, nhận xét..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            className="admin-select"
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value)}
          >
            <option value="Tất cả">Tất cả số sao</option>
            <option value="5">5 sao ★★★★★</option>
            <option value="4">4 sao ★★★★</option>
            <option value="3">3 sao ★★★</option>
            <option value="2">2 sao ★★</option>
            <option value="1">1 sao ★</option>
          </select>

          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Bị ẩn">Bị ẩn</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Điểm đến</th>
              <th>Người đánh giá</th>
              <th>Số sao</th>
              <th style={{ minWidth: 260 }}>Nội dung nhận xét & Phản hồi</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th style={{ width: 140, textAlign: "center" }}>Kiểm duyệt</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rev) => (
              <tr key={rev.id}>
                <td>
                  <strong>{rev.destinationName}</strong>
                </td>
                <td style={{ color: "#1e1b4b", fontWeight: 600 }}>{rev.reviewerName}</td>
                <td>
                  <div style={{ display: "flex", gap: 2, color: "#f59e0b" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < rev.rating ? "#f59e0b" : "none"}
                        color={i < rev.rating ? "#f59e0b" : "#cbd5e1"}
                      />
                    ))}
                  </div>
                </td>
                <td>
                  <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "#334155" }}>
                    "{rev.comment}"
                  </p>
                  {rev.adminReply && (
                    <div style={{ background: "#f5effe", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "#6b21a8", marginTop: 4 }}>
                      <strong>Admin phản hồi:</strong> {rev.adminReply}
                    </div>
                  )}
                </td>
                <td style={{ color: "#64748b", fontSize: 12.5 }}>{rev.date}</td>
                <td>
                  <span
                    className={`admin-tag ${
                      rev.status === "Đã duyệt"
                        ? "admin-tag-green"
                        : rev.status === "Chờ duyệt"
                        ? "admin-tag-amber"
                        : "admin-tag-red"
                    }`}
                  >
                    {rev.status}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions" style={{ justifyContent: "center" }}>
                    {rev.status !== "Đã duyệt" && (
                      <button
                        type="button"
                        className="admin-action-btn"
                        title="Duyệt hiển thị"
                        onClick={() => handleApprove(rev.id)}
                      >
                        <Check size={15} color="#16a34a" />
                      </button>
                    )}

                    {rev.status !== "Bị ẩn" && (
                      <button
                        type="button"
                        className="admin-action-btn"
                        title="Ẩn bình luận"
                        onClick={() => handleHide(rev.id)}
                      >
                        <EyeOff size={15} />
                      </button>
                    )}

                    <button
                      type="button"
                      className="admin-action-btn"
                      title="Trả lời du khách"
                      onClick={() => {
                        setReplyingReview(rev);
                        setReplyText(rev.adminReply || "");
                      }}
                    >
                      <MessageSquare size={15} />
                    </button>

                    <button
                      type="button"
                      className="admin-action-btn delete"
                      title="Xóa đánh giá"
                      onClick={() => handleDelete(rev.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div className="admin-modal-backdrop" onClick={() => setReplyingReview(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Phản hồi đánh giá: {replyingReview.reviewerName}</h3>
              <button type="button" className="admin-action-btn" onClick={() => setReplyingReview(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendReply}>
              <div className="admin-modal-body">
                <div style={{ background: "#faf8fd", padding: 12, borderRadius: 10, fontSize: 13, color: "#475569" }}>
                  <strong>Điểm đến:</strong> {replyingReview.destinationName}
                  <div style={{ marginTop: 4 }}>"{replyingReview.comment}"</div>
                </div>

                <div className="admin-form-group">
                  <label>Nội dung phản hồi từ Ban Quản trị (*)</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Nhập lời cảm ơn hoặc giải đáp thắc mắc cho du khách..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setReplyingReview(null)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>Gửi phản hồi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
