import { useState, useMemo } from "react";
import {
  Compass,
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

export interface ItineraryItem {
  id: string;
  title: string;
  creator: string;
  days: number;
  spotsCount: number;
  budget: string;
  target: string;
  image: string;
  status: "Đã duyệt" | "Chờ duyệt" | "Bản nháp";
  featured?: boolean;
  schedule: {
    day: number;
    title: string;
    activities: string[];
  }[];
}

export const ITINERARIES_STORAGE_KEY = "huesmart-admin-itineraries";

const DEFAULT_ITINERARIES: ItineraryItem[] = [
  {
    id: "itin-1",
    title: "Chuyến đi Huế 2 ngày 1 đêm — Dấu ấn Kinh thành & Sông Hương",
    creator: "Nguyễn Văn Hùng",
    days: 2,
    spotsCount: 6,
    budget: "1.200.000 đ / người",
    target: "Cặp đôi / Bạn trẻ",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png",
    status: "Đã duyệt",
    featured: true,
    schedule: [
      {
        day: 1,
        title: "Khám phá Đại Nội & Thưởng thức Ca Huế",
        activities: [
          "08:00: Check-in khách sạn trung tâm & ăn sáng bún bò Huế",
          "09:00 - 12:00: Tham quan Đại Nội Huế (Ngọ Môn, Điện Thái Hòa, Cung Diên Thọ)",
          "15:00: Viếng Chùa Thiên Mụ & ngắm hoàng hôn bên bờ sông Hương",
          "19:30: Đi thuyền rồng nghe ca Huế và thả hoa đăng cầu may",
        ],
      },
      {
        day: 2,
        title: "Hành trình Lăng tẩm Triều Nguyễn & Ẩm thực Cố đô",
        activities: [
          "08:30: Tham quan Lăng Khải Định kiến trúc Á - Âu tráng lệ",
          "11:00: Ghé Làng hương Thủy Xuân chụp ảnh nón lá rực rỡ",
          "12:30: Ăn trưa bánh bèo, nậm, lọc tại quán Bà Đỏ",
          "15:00: Mua sắm mè xửng, kẹo cau tại Chợ Đông Ba trước khi về",
        ],
      },
    ],
  },
  {
    id: "itin-2",
    title: "Khám phá Di sản Huế 3 ngày 2 đêm chuyên sâu",
    creator: "Lê Thị Thảo (HDV)",
    days: 3,
    spotsCount: 10,
    budget: "2.500.000 đ / người",
    target: "Gia đình / Đoàn du khách",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/74d44096-3627-4cf5-a5b5-5b71fdac2f9e_1793344049.jpg",
    status: "Đã duyệt",
    featured: true,
    schedule: [
      {
        day: 1,
        title: "Kinh đô Cung đình & Lịch sử vương triều",
        activities: ["Đại Nội Huế", "Bảo tàng Cổ vật Cung đình", "Cầu Tràng Tiền về đêm"],
      },
      {
        day: 2,
        title: "Quần thể lăng tẩm & Đồi Vọng Cảnh",
        activities: ["Lăng Tự Đức", "Lăng Khải Định", "Đồi Vọng Cảnh", "Làng hương Thủy Xuân"],
      },
      {
        day: 3,
        title: "Sinh thái Đầm phá & Biển Thuận An",
        activities: ["Ngắm bình minh Phá Tam Giang", "Ăn hải sản đầm phá", "Chợ Đông Ba"],
      },
    ],
  },
  {
    id: "itin-3",
    title: "Food Tour Huế 1 ngày — 1001 món ngon cố đô",
    creator: "Trần Minh Quang",
    days: 1,
    spotsCount: 8,
    budget: "450.000 đ / người",
    target: "Tín đồ ẩm thực",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    status: "Đã duyệt",
    featured: false,
    schedule: [
      {
        day: 1,
        title: "Càn quét ẩm thực từ sáng tới khuya",
        activities: [
          "Bún bò mụ Rơi",
          "Bánh ép Nguyễn Du",
          "Chè Hẻm Hùng Vương (20 loại chè)",
          "Bánh khoái Lạc Thiện",
          "Cơm hến Đập Đá",
        ],
      },
    ],
  },
];

interface ItineraryManagerProps {
  onNotify?: (msg: string) => void;
}

export default function ItineraryManager({ onNotify }: ItineraryManagerProps) {
  const [itineraries, setItineraries] = useState<ItineraryItem[]>(() => {
    try {
      const saved = localStorage.getItem(ITINERARIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ITINERARIES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [previewItem, setPreviewItem] = useState<ItineraryItem | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    creator: "Ban Quản lý Du lịch Huế",
    days: 2,
    spotsCount: 6,
    budget: "1.500.000 đ",
    target: "Mọi đối tượng",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png",
    status: "Đã duyệt" as "Đã duyệt" | "Chờ duyệt" | "Bản nháp",
    featured: true,
  });

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const saveItineraries = (items: ItineraryItem[]) => {
    setItineraries(items);
    localStorage.setItem(ITINERARIES_STORAGE_KEY, JSON.stringify(items));
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      creator: "Ban Quản lý Du lịch Huế",
      days: 2,
      spotsCount: 5,
      budget: "1.200.000 đ",
      target: "Mọi đối tượng",
      image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png",
      status: "Đã duyệt",
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ItineraryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      creator: item.creator,
      days: item.days,
      spotsCount: item.spotsCount,
      budget: item.budget,
      target: item.target,
      image: item.image,
      status: item.status,
      featured: !!item.featured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa lịch trình "${title}"?`)) {
      const next = itineraries.filter((i) => i.id !== id);
      saveItineraries(next);
      notify(`Đã xóa lịch trình "${title}"`);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề lịch trình!");
      return;
    }

    if (editingItem) {
      const updated = itineraries.map((item) =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      saveItineraries(updated);
      notify(`Đã cập nhật lịch trình "${formData.title}"`);
    } else {
      const newItem: ItineraryItem = {
        ...formData,
        id: `itin-${Date.now()}`,
        schedule: [
          {
            day: 1,
            title: "Khám phá các điểm nổi bật",
            activities: ["Đại Nội Huế", "Chùa Thiên Mụ", "Thưởng thức ẩm thực Huế"],
          },
        ],
      };
      saveItineraries([newItem, ...itineraries]);
      notify(`Đã tạo lịch trình mới "${newItem.title}"`);
    }
    setIsModalOpen(false);
  };

  const filtered = useMemo(() => {
    return itineraries.filter((i) =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.creator.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [itineraries, searchQuery]);

  return (
    <div className="admin-subview-panel">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: 14 }}>
        <div className="admin-page-title-wrap">
          <h1 className="admin-page-title">
            <Compass size={26} />
            <span>Quản lý Lịch trình Du lịch Huế ({itineraries.length})</span>
          </h1>
          <div className="admin-page-subtitle">
            Kiểm duyệt và biên tập các tour, lịch trình gợi ý cho du khách trong và ngoài nước
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              saveItineraries(DEFAULT_ITINERARIES);
              notify("Đã khôi phục các lịch trình mẫu!");
            }}
          >
            <RotateCcw size={15} />
            <span>Khôi phục mẫu</span>
          </button>

          <button type="button" className="admin-btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Thêm lịch trình mẫu</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-dest-toolbar">
        <div className="admin-dest-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên lịch trình, người tạo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Ảnh</th>
              <th>Tiêu đề lịch trình</th>
              <th>Người tạo</th>
              <th>Thời gian & Địa điểm</th>
              <th>Chi phí ước tính</th>
              <th>Đối tượng</th>
              <th>Trạng thái</th>
              <th style={{ width: 120, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="admin-table-thumb"
                    style={{ width: 44, height: 44, borderRadius: 8 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/hero-banner.jpg";
                    }}
                  />
                </td>
                <td>
                  <strong
                    style={{ color: "#1e1b4b", cursor: "pointer" }}
                    onClick={() => setPreviewItem(item)}
                  >
                    {item.title}
                  </strong>
                  {item.featured && (
                    <span className="admin-tag admin-tag-amber" style={{ fontSize: 10, marginLeft: 6 }}>
                      Ghim gợi ý
                    </span>
                  )}
                </td>
                <td style={{ fontSize: 13, color: "#64748b" }}>{item.creator}</td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#7c24a2" }}>
                    {item.days} ngày · {item.spotsCount} điểm đến
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{item.budget}</td>
                <td style={{ fontSize: 13, color: "#475569" }}>{item.target}</td>
                <td>
                  <span
                    className={`admin-tag ${
                      item.status === "Đã duyệt"
                        ? "admin-tag-green"
                        : "admin-tag-purple"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions" style={{ justifyContent: "center" }}>
                    <button
                      type="button"
                      className="admin-action-btn"
                      title="Xem chi tiết"
                      onClick={() => setPreviewItem(item)}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn"
                      title="Chỉnh sửa"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn delete"
                      title="Xóa"
                      onClick={() => handleDelete(item.id, item.title)}
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

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingItem ? "Chỉnh sửa lịch trình" : "Thêm lịch trình mẫu mới"}</h3>
              <button type="button" className="admin-action-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Tiêu đề lịch trình (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Huế 2 ngày 1 đêm — Dấu ấn Kinh thành..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Số ngày đi</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Số điểm tham quan</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.spotsCount}
                      onChange={(e) => setFormData({ ...formData, spotsCount: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Ngân sách ước tính</label>
                    <input
                      type="text"
                      placeholder="VD: 1.500.000 đ / người"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Đối tượng phù hợp</label>
                    <input
                      type="text"
                      placeholder="VD: Cặp đôi, Gia đình, Bạn bè..."
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>URL Hình ảnh đại diện</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>Ghim lên danh sách Lịch trình Gợi ý nổi bật</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>{editingItem ? "Lưu thay đổi" : "Tạo lịch trình"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewItem(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="dest-preview-banner">
              <img src={previewItem.image} alt={previewItem.title} />
              <button type="button" className="close-preview-btn" onClick={() => setPreviewItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
              <h2 style={{ margin: 0, fontSize: 19, color: "#1e1b4b" }}>{previewItem.title}</h2>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748b" }}>
                <span>⏱️ {previewItem.days} ngày</span>
                <span>📍 {previewItem.spotsCount} điểm đến</span>
                <span>💰 {previewItem.budget}</span>
              </div>

              {previewItem.schedule && previewItem.schedule.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h4 style={{ margin: 0, fontSize: 14, color: "#581c87" }}>Lộ trình chi tiết từng ngày:</h4>
                  {previewItem.schedule.map((day) => (
                    <div
                      key={day.day}
                      style={{ background: "#faf8fd", padding: 12, borderRadius: 10, border: "1px solid #ebdcfc" }}
                    >
                      <strong>Ngày {day.day}: {day.title}</strong>
                      <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: 13, color: "#475569" }}>
                        {day.activities.map((act, idx) => (
                          <li key={idx} style={{ marginBottom: 3 }}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="button" className="admin-btn-primary" onClick={() => setPreviewItem(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
