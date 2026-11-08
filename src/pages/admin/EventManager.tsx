import { useState, useMemo } from "react";
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Clock,
  Trash2,
  Edit3,
  Eye,
  Check,
  X,
  Tag,
  RotateCcw,
} from "lucide-react";

export interface HueEvent {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  image: string;
  price: string;
  status: "Đang diễn ra" | "Sắp tới" | "Đã kết thúc";
  featured?: boolean;
}

export const EVENTS_STORAGE_KEY = "huesmart-admin-events";

const DEFAULT_EVENTS: HueEvent[] = [
  {
    id: "ev-1",
    name: "Festival Huế 2026 - Di sản văn hóa với hội nhập và phát triển",
    category: "Lễ hội văn hóa",
    startDate: "07/06/2026",
    endDate: "12/06/2026",
    location: "Kỳ Đài, Ngọ Môn & các sân khấu cộng đồng TP Huế",
    description: "Kỳ Festival quy mô quốc tế tôn vinh vẻ đẹp di sản Cố đô, quy tụ hàng chục đoàn nghệ thuật trong nước và quốc tế với các đêm diễn hoàng cung lung linh.",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    price: "Miễn phí vé / Một số chương trình có vé",
    status: "Sắp tới",
    featured: true,
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
    featured: true,
  },
  {
    id: "ev-3",
    name: "Lễ hội Khinh khí cầu Quốc tế Huế",
    category: "Lễ hội ngoài trời",
    startDate: "25/04/2026",
    endDate: "01/05/2026",
    location: "Quảng trường Ngọ Môn & Sân vận động Tự Do",
    description: "Chiêm ngưỡng hàng chục khinh khí cầu khổng lồ bay trên bầu trời cố đô, trải nghiệm ngắm nhìn toàn cảnh sông Hương và thành quách từ trên cao.",
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80",
    price: "180.000 đ / lượt bay",
    status: "Sắp tới",
    featured: true,
  },
  {
    id: "ev-4",
    name: "Lễ hội Điện Hòn Chén (Lễ vía Mẹ Thiên Y A Na)",
    category: "Lễ hội dân gian",
    startDate: "10/08/2026",
    endDate: "12/08/2026",
    location: "Điện Hòn Chén, núi Ngọc Trản, bờ sông Hương",
    description: "Lễ hội tín ngưỡng dân gian đặc sắc với đoàn thuyền rước lộng lẫy rực rỡ cờ hoa diễu hành trên sông Hương.",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    price: "Miễn phí",
    status: "Sắp tới",
    featured: false,
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
    featured: true,
  },
];

interface EventManagerProps {
  onNotify?: (msg: string) => void;
}

export default function EventManager({ onNotify }: EventManagerProps) {
  const [events, setEvents] = useState<HueEvent[]>(() => {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_EVENTS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HueEvent | null>(null);
  const [previewEvent, setPreviewEvent] = useState<HueEvent | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Lễ hội văn hóa",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    image: "",
    price: "Miễn phí",
    status: "Sắp tới" as "Đang diễn ra" | "Sắp tới" | "Đã kết thúc",
    featured: false,
  });

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const saveEvents = (items: HueEvent[]) => {
    setEvents(items);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("huesmart-events-updated"));
  };

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: "",
      category: "Lễ hội văn hóa",
      startDate: "15/11/2026",
      endDate: "20/11/2026",
      location: "Quảng trường Ngọ Môn, Cố đô Huế",
      description: "",
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
      price: "Miễn phí",
      status: "Sắp tới",
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: HueEvent) => {
    setEditingEvent(ev);
    setFormData({
      name: ev.name,
      category: ev.category,
      startDate: ev.startDate,
      endDate: ev.endDate,
      location: ev.location,
      description: ev.description,
      image: ev.image,
      price: ev.price,
      status: ev.status,
      featured: !!ev.featured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa sự kiện "${name}"?`)) {
      const next = events.filter((e) => e.id !== id);
      saveEvents(next);
      notify(`Đã xóa sự kiện "${name}"`);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sự kiện!");
      return;
    }

    if (editingEvent) {
      const updated = events.map((ev) =>
        ev.id === editingEvent.id ? { ...ev, ...formData } : ev
      );
      saveEvents(updated);
      notify(`Đã cập nhật sự kiện "${formData.name}"`);
    } else {
      const newEvent: HueEvent = {
        ...formData,
        id: `ev-${Date.now()}`,
      };
      saveEvents([newEvent, ...events]);
      notify(`Đã tạo sự kiện mới "${newEvent.name}"`);
    }
    setIsModalOpen(false);
  };

  const handleReset = () => {
    if (window.confirm("Khôi phục danh sách sự kiện mặc định của Festival Huế?")) {
      saveEvents(DEFAULT_EVENTS);
      notify("Đã khôi phục các sự kiện mặc định!");
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchSearch =
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "Tất cả" || ev.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [events, searchQuery, statusFilter]);

  return (
    <div className="admin-subview-panel">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: 14 }}>
        <div className="admin-page-title-wrap">
          <h1 className="admin-page-title">
            <Calendar size={26} />
            <span>Quản lý Sự kiện & Lễ hội Huế ({events.length})</span>
          </h1>
          <div className="admin-page-subtitle">
            Điều phối lịch trình Festival Huế, trình diễn văn hóa nghệ thuật và sự kiện du lịch
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleReset}
            title="Khôi phục danh sách sự kiện mẫu"
          >
            <RotateCcw size={15} />
            <span>Khôi phục mẫu</span>
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            <span>Tạo sự kiện mới</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-dest-toolbar">
        <div className="admin-dest-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên sự kiện, địa điểm tổ chức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đang diễn ra">Đang diễn ra</option>
            <option value="Sắp tới">Sắp tới</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Ảnh</th>
              <th>Tên sự kiện</th>
              <th>Thời gian diễn ra</th>
              <th>Địa điểm tổ chức</th>
              <th>Vé tham gia</th>
              <th>Trạng thái</th>
              <th style={{ width: 120, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((ev) => (
              <tr key={ev.id}>
                <td>
                  <img
                    src={ev.image}
                    alt={ev.name}
                    className="admin-table-thumb"
                    style={{ width: 44, height: 44, borderRadius: 8 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/hero-banner.jpg";
                    }}
                  />
                </td>
                <td>
                  <strong
                    style={{ color: "#1e1b4b", cursor: "pointer" }}
                    onClick={() => setPreviewEvent(ev)}
                  >
                    {ev.name}
                  </strong>
                  <div style={{ fontSize: 12, color: "#7c24a2", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Tag size={12} />
                    <span>{ev.category}</span>
                    {ev.featured && (
                      <span className="admin-tag admin-tag-amber" style={{ fontSize: 10, padding: "1px 6px" }}>
                        Nổi bật
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#334155" }}>
                    <Clock size={14} color="#64748b" />
                    <span>{ev.startDate} — {ev.endDate}</span>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: "#475569" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={14} color="#94a3b8" />
                    <span>{ev.location}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{ev.price}</td>
                <td>
                  <span
                    className={`admin-tag ${
                      ev.status === "Đang diễn ra"
                        ? "admin-tag-green"
                        : ev.status === "Sắp tới"
                        ? "admin-tag-purple"
                        : "admin-tag-blue"
                    }`}
                  >
                    {ev.status}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions" style={{ justifyContent: "center" }}>
                    <button
                      type="button"
                      className="admin-action-btn"
                      title="Xem chi tiết"
                      onClick={() => setPreviewEvent(ev)}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn"
                      title="Chỉnh sửa"
                      onClick={() => handleOpenEdit(ev)}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn delete"
                      title="Xóa sự kiện"
                      onClick={() => handleDelete(ev.id, ev.name)}
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
          <div className="admin-modal-card" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</h3>
              <button type="button" className="admin-action-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Tên sự kiện / Lễ hội (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Festival Huế 2026, Lễ hội Áo Dài..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Loại hình sự kiện</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Lễ hội văn hóa">Lễ hội văn hóa</option>
                      <option value="Nghệ thuật truyền thống">Nghệ thuật truyền thống</option>
                      <option value="Lễ hội ngoài trời">Lễ hội ngoài trời</option>
                      <option value="Lễ hội dân gian">Lễ hội dân gian</option>
                      <option value="Âm nhạc di sản">Âm nhạc di sản</option>
                      <option value="Ẩm thực xứ Huế">Ẩm thực xứ Huế</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "Đang diễn ra" | "Sắp tới" | "Đã kết thúc",
                        })
                      }
                    >
                      <option value="Đang diễn ra">Đang diễn ra</option>
                      <option value="Sắp tới">Sắp tới</option>
                      <option value="Đã kết thúc">Đã kết thúc</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Ngày bắt đầu (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: 07/06/2026"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Ngày kết thúc (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: 12/06/2026"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Địa điểm tổ chức (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Quảng trường Ngọ Môn, Bến Tòa Khâm..."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Giá vé tham gia</label>
                    <input
                      type="text"
                      placeholder="VD: Miễn phí hoặc 150.000 đ"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group" style={{ justifyContent: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 20 }}>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <span>Đánh dấu Sự kiện Nổi bật</span>
                    </label>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>URL Hình ảnh sự kiện</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Mô tả sự kiện</label>
                  <textarea
                    rows={3}
                    placeholder="Giới thiệu nội dung, các tiết mục đặc sắc, hoạt động du khách..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>{editingEvent ? "Lưu thay đổi" : "Tạo sự kiện"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Event Modal */}
      {previewEvent && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewEvent(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 600, overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div className="dest-preview-banner">
              <img src={previewEvent.image} alt={previewEvent.name} />
              <button type="button" className="close-preview-btn" onClick={() => setPreviewEvent(null)}>
                <X size={18} />
              </button>
              <div className="dest-preview-badge-overlay">
                <span className="category-chip">{previewEvent.category}</span>
                <span className="rating-chip">{previewEvent.status}</span>
              </div>
            </div>

            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20, color: "#1e1b4b" }}>{previewEvent.name}</h2>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748b" }}>
                <span>📅 {previewEvent.startDate} — {previewEvent.endDate}</span>
                <span>📍 {previewEvent.location}</span>
                <span>🎟️ {previewEvent.price}</span>
              </div>
              <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, background: "#faf8fd", padding: 12, borderRadius: 10 }}>
                {previewEvent.description}
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="button" className="admin-btn-primary" onClick={() => setPreviewEvent(null)}>
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
