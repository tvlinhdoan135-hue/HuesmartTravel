import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  MapPin,
  Star,
  Clock,
  RotateCcw,
  Download,
  Upload,
  LayoutGrid,
  List,
  Check,
  X,
  Sparkles,
  Copy,
  ChevronRight,
} from "lucide-react";
import {
  destinations as defaultDestinations,
  getAllDestinations,
  ADMIN_DESTINATIONS_KEY,
  ADMIN_OVERRIDES_KEY,
  ADMIN_DELETED_KEY,
  type TravelItem,
} from "../../data";

// Quick GPS Presets in Thừa Thiên Huế
const HUE_GPS_PRESETS = [
  { name: "Đại Nội Huế", lat: 16.4691, lng: 107.5796 },
  { name: "Chùa Thiên Mụ", lat: 16.4533, lng: 107.545 },
  { name: "Lăng Khải Định", lat: 16.3986, lng: 107.5906 },
  { name: "Lăng Tự Đức", lat: 16.4328, lng: 107.5658 },
  { name: "Cầu Tràng Tiền", lat: 16.4688, lng: 107.5927 },
  { name: "Đồi Vọng Cảnh", lat: 16.4258, lng: 107.5517 },
  { name: "Biển Lăng Cô", lat: 16.2308, lng: 108.0053 },
  { name: "Phá Tam Giang", lat: 16.5862, lng: 107.5358 },
];

// Sample Hue Tourist Images
const SAMPLE_HUE_IMAGES = [
  {
    label: "Đại Nội",
    url: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png",
  },
  {
    label: "Chùa Thiên Mụ",
    url: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Chua-Thien-Mu_1776821164.jpg",
  },
  {
    label: "Lăng Khải Định",
    url: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/74d44096-3627-4cf5-a5b5-5b71fdac2f9e_1793344049.jpg",
  },
  {
    label: "Đồi Vọng Cảnh",
    url: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/doi-vong-canh-hue-banner_1780994359.jpg",
  },
  {
    label: "Phá Tam Giang",
    url: "https://huetripo.hue.gov.vn/uploads/Media/2026/pha-tam-giang-9_1781749154.jpg",
  },
  {
    label: "Biển Lăng Cô",
    url: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/bai-bien-lang-co-hue_1779191369.jpg",
  },
];

const CATEGORIES = [
  "Tất cả",
  "Di tích",
  "Tâm linh",
  "Thiên nhiên",
  "Ẩm thực",
  "Khám phá",
  "Nông thôn",
  "Không gian công cộng",
  "Văn hoá",
];

interface DestinationManagerProps {
  onNotify?: (message: string) => void;
  onOpenAddModalDirect?: () => void;
}

export default function DestinationManager({
  onNotify,
}: DestinationManagerProps) {
  // Master list loaded via getAllDestinations()
  const [destinations, setDestinations] = useState<TravelItem[]>(() =>
    getAllDestinations()
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [sortBy, setSortBy] = useState<"rating" | "name" | "newest">("rating");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TravelItem | null>(null);
  const [previewItem, setPreviewItem] = useState<TravelItem | null>(null);
  const [formTab, setFormTab] = useState<"basic" | "media" | "details">("basic");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Di tích",
    description: "",
    address: "",
    image: "",
    gallery: [] as string[],
    price: "Miễn phí",
    duration: "1–2 giờ",
    openingHours: "07:30 - 17:30",
    rating: 4.8,
    ratingCount: 120,
    lat: 16.4637,
    lng: 107.5909,
    detailHeading: "Điểm nổi bật & Trải nghiệm",
    detailContent: "",
  });

  const notify = (msg: string) => {
    if (onNotify) {
      onNotify(msg);
    } else {
      alert(msg);
    }
  };

  // Synchronize and persist changes across the application
  const refreshData = () => {
    const fresh = getAllDestinations();
    setDestinations(fresh);
    window.dispatchEvent(new Event("huesmart-destinations-updated"));
  };

  // Check if an item is an original default destination
  const isDefaultItem = (id: string) =>
    defaultDestinations.some((d) => d.id === id);

  // ===============================
  // CRUD OPERATIONS
  // ===============================

  // Open Form to Add New
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTab("basic");
    setFormData({
      name: "",
      category: "Di tích",
      description: "",
      address: "Thành phố Huế",
      image: SAMPLE_HUE_IMAGES[0].url,
      gallery: [],
      price: "Miễn phí",
      duration: "1–2 giờ",
      openingHours: "07:30 - 17:30",
      rating: 4.8,
      ratingCount: 50,
      lat: 16.4637,
      lng: 107.5909,
      detailHeading: "Điểm nổi bật & Trải nghiệm",
      detailContent:
        "Địa điểm tham quan nổi bật tại Cố đô Huế với cảnh quan thanh tịnh, bề dày lịch sử và kiến trúc truyền thống ấn tượng.",
    });
    setIsFormModalOpen(true);
  };

  // Open Form to Edit
  const handleOpenEdit = (item: TravelItem) => {
    setEditingItem(item);
    setFormTab("basic");
    const firstDetail = item.details?.[0];
    setFormData({
      name: item.name,
      category: item.category || "Di tích",
      description: item.description || "",
      address: item.address || "",
      image: item.image || "",
      gallery: item.gallery || [],
      price: item.price || "Miễn phí",
      duration: item.duration || "1–2 giờ",
      openingHours: item.openingHours || "07:30 - 17:30",
      rating: item.rating || 4.5,
      ratingCount: item.ratingCount || 100,
      lat: item.lat || 16.4637,
      lng: item.lng || 107.5909,
      detailHeading: firstDetail?.heading || "Điểm nổi bật & Trải nghiệm",
      detailContent:
        firstDetail?.paragraphs?.join("\n\n") ||
        firstDetail?.points?.map((p) => `• ${p.title}: ${p.description}`).join("\n") ||
        item.description ||
        "",
    });
    setIsFormModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên địa điểm!");
      return;
    }
    if (!formData.address.trim()) {
      alert("Vui lòng nhập địa chỉ địa điểm!");
      return;
    }

    const detailsData = formData.detailContent.trim()
      ? [
          {
            heading: formData.detailHeading || "Giới thiệu & Điểm nhấn",
            paragraphs: formData.detailContent
              .split("\n\n")
              .filter((p) => p.trim().length > 0),
          },
        ]
      : undefined;

    if (editingItem) {
      // EDIT EXISTING ITEM
      if (isDefaultItem(editingItem.id)) {
        // Save override for default destination
        try {
          const overrides: Partial<TravelItem>[] = JSON.parse(
            localStorage.getItem(ADMIN_OVERRIDES_KEY) || "[]"
          );
          const updatedOverrides = overrides.filter(
            (o) => String(o.id) !== String(editingItem.id)
          );
          updatedOverrides.push({
            id: editingItem.id,
            name: formData.name.trim(),
            category: formData.category,
            description: formData.description.trim(),
            address: formData.address.trim(),
            image: formData.image.trim(),
            gallery: formData.gallery,
            price: formData.price.trim(),
            duration: formData.duration.trim(),
            openingHours: formData.openingHours.trim(),
            rating: Number(formData.rating),
            ratingCount: Number(formData.ratingCount),
            lat: Number(formData.lat),
            lng: Number(formData.lng),
            details: detailsData,
          });
          localStorage.setItem(
            ADMIN_OVERRIDES_KEY,
            JSON.stringify(updatedOverrides)
          );
        } catch (err) {
          console.error(err);
        }
      } else {
        // Custom destination: update in custom list
        try {
          const customItems: Partial<TravelItem>[] = JSON.parse(
            localStorage.getItem(ADMIN_DESTINATIONS_KEY) || "[]"
          );
          const nextCustom = customItems.map((c) =>
            String(c.id) === String(editingItem.id)
              ? {
                  ...c,
                  name: formData.name.trim(),
                  category: formData.category,
                  description: formData.description.trim(),
                  address: formData.address.trim(),
                  image: formData.image.trim(),
                  gallery: formData.gallery,
                  price: formData.price.trim(),
                  duration: formData.duration.trim(),
                  openingHours: formData.openingHours.trim(),
                  rating: Number(formData.rating),
                  ratingCount: Number(formData.ratingCount),
                  lat: Number(formData.lat),
                  lng: Number(formData.lng),
                  details: detailsData,
                }
              : c
          );
          localStorage.setItem(
            ADMIN_DESTINATIONS_KEY,
            JSON.stringify(nextCustom)
          );
        } catch (err) {
          console.error(err);
        }
      }
      notify(`Đã cập nhật thông tin địa điểm "${formData.name}"`);
    } else {
      // CREATE NEW ITEM
      const newId = `custom-${Date.now()}`;
      const newItem: TravelItem = {
        id: newId,
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        address: formData.address.trim(),
        image:
          formData.image.trim() ||
          "/images/hero-banner.jpg",
        gallery: formData.gallery,
        price: formData.price.trim() || "Miễn phí",
        duration: formData.duration.trim() || "1–2 giờ",
        openingHours: formData.openingHours.trim() || "07:30 - 17:30",
        rating: Number(formData.rating) || 4.8,
        ratingCount: Number(formData.ratingCount) || 1,
        lat: Number(formData.lat) || 16.4637,
        lng: Number(formData.lng) || 107.5909,
        details: detailsData,
      };

      try {
        const customItems: TravelItem[] = JSON.parse(
          localStorage.getItem(ADMIN_DESTINATIONS_KEY) || "[]"
        );
        localStorage.setItem(
          ADMIN_DESTINATIONS_KEY,
          JSON.stringify([newItem, ...customItems])
        );
      } catch (err) {
        console.error(err);
      }
      notify(`Đã thêm mới thành công địa điểm "${newItem.name}"`);
    }

    setIsFormModalOpen(false);
    refreshData();
  };

  // Delete Destination
  const handleDelete = (item: TravelItem) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa địa điểm "${item.name}" khỏi hệ sinh thái du lịch Huế?`
      )
    ) {
      return;
    }

    if (isDefaultItem(item.id)) {
      // Add to deleted set
      try {
        const deleted: string[] = JSON.parse(
          localStorage.getItem(ADMIN_DELETED_KEY) || "[]"
        );
        if (!deleted.includes(item.id)) {
          deleted.push(item.id);
          localStorage.setItem(ADMIN_DELETED_KEY, JSON.stringify(deleted));
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Remove from custom list
      try {
        const customItems: TravelItem[] = JSON.parse(
          localStorage.getItem(ADMIN_DESTINATIONS_KEY) || "[]"
        );
        const filtered = customItems.filter(
          (c) => String(c.id) !== String(item.id)
        );
        localStorage.setItem(
          ADMIN_DESTINATIONS_KEY,
          JSON.stringify(filtered)
        );
      } catch (err) {
        console.error(err);
      }
    }

    notify(`Đã xóa địa điểm "${item.name}"`);
    refreshData();
  };

  // Reset to original Hue dataset
  const handleResetToDefault = () => {
    if (
      window.confirm(
        "Bạn có chắc muốn khôi phục toàn bộ danh sách điểm đến về dữ liệu mặc định ban đầu của Cố đô Huế?"
      )
    ) {
      localStorage.removeItem(ADMIN_DESTINATIONS_KEY);
      localStorage.removeItem(ADMIN_OVERRIDES_KEY);
      localStorage.removeItem(ADMIN_DELETED_KEY);
      refreshData();
      notify("Đã khôi phục dữ liệu điểm đến về mặc định!");
    }
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(destinations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `HueSmart_Destinations_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify("Đã xuất tệp dữ liệu điểm đến JSON thành công!");
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            localStorage.setItem(
              ADMIN_DESTINATIONS_KEY,
              JSON.stringify(parsed)
            );
            refreshData();
            notify(`Đã nhập thành công ${parsed.length} địa điểm từ file JSON!`);
          } else {
            alert("File JSON không hợp lệ! Định dạng phải là một mảng danh sách.");
          }
        } catch {
          alert("Không thể đọc tệp JSON. Vui lòng kiểm tra lại cấu trúc file!");
        }
      };
    }
  };

  // Copy GPS to clipboard
  const handleCopyGPS = (lat: number, lng: number) => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    notify(`Đã sao chép tọa độ: ${lat}, ${lng}`);
  };

  // ===============================
  // STATS CALCULATIONS
  // ===============================
  const stats = useMemo(() => {
    const total = destinations.length;
    const heritageCount = destinations.filter(
      (d) => d.category === "Di tích"
    ).length;
    const spiritualCount = destinations.filter(
      (d) => d.category === "Tâm linh"
    ).length;
    const natureCount = destinations.filter(
      (d) => d.category === "Thiên nhiên"
    ).length;
    const otherCount = total - (heritageCount + spiritualCount + natureCount);
    return { total, heritageCount, spiritualCount, natureCount, otherCount };
  }, [destinations]);

  // ===============================
  // FILTERED & SORTED DATA
  // ===============================
  const filteredList = useMemo(() => {
    return destinations
      .filter((item) => {
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);

        const matchCat =
          selectedCategory === "Tất cả" || item.category === selectedCategory;

        const isFree =
          item.price.toLowerCase().includes("miễn phí") ||
          item.price.includes("0 đ") ||
          item.price.trim() === "0";

        const matchPrice =
          priceFilter === "all" ||
          (priceFilter === "free" && isFree) ||
          (priceFilter === "paid" && !isFree);

        return matchSearch && matchCat && matchPrice;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "name") return a.name.localeCompare(b.name, "vi");
        return String(b.id).localeCompare(String(a.id));
      });
  }, [destinations, searchQuery, selectedCategory, priceFilter, sortBy]);

  return (
    <div className="admin-dest-manager">
      {/* ========================================================
          1. HEADER & KPI OVERVIEW FOR DESTINATIONS
      ======================================================== */}
      <div className="admin-page-header">
        <div className="admin-page-title-wrap">
          <h1 className="admin-page-title">
            <MapPin size={26} />
            <span>Quản lý Địa điểm Du lịch Huế</span>
          </h1>
          <div className="admin-page-subtitle">
            Hệ sinh thái di tích, danh lam thắng cảnh, tâm linh, ẩm thực và điểm trải nghiệm tại Cố đô
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleExportJSON}
            title="Xuất sao lưu danh sách địa điểm thành file JSON"
          >
            <Download size={15} />
            <span>Xuất JSON</span>
          </button>

          <label
            className="admin-btn-secondary"
            style={{ cursor: "pointer", margin: 0 }}
            title="Nhập danh sách địa điểm từ file JSON"
          >
            <Upload size={15} />
            <span>Nhập JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              style={{ display: "none" }}
            />
          </label>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={16} />
            <span>Thêm địa điểm mới</span>
          </button>
        </div>
      </div>

      {/* Mini KPI Cards for Destinations */}
      <div className="admin-dest-stats-grid">
        <div className="admin-dest-stat-pill">
          <span className="dest-stat-icon purple">
            <MapPin size={18} />
          </span>
          <div>
            <div className="dest-stat-val">{stats.total}</div>
            <div className="dest-stat-lbl">Tổng số địa điểm</div>
          </div>
        </div>

        <div className="admin-dest-stat-pill">
          <span className="dest-stat-icon amber">
            <Sparkles size={18} />
          </span>
          <div>
            <div className="dest-stat-val">{stats.heritageCount}</div>
            <div className="dest-stat-lbl">Di tích & Cung đình</div>
          </div>
        </div>

        <div className="admin-dest-stat-pill">
          <span className="dest-stat-icon blue">
            <Star size={18} />
          </span>
          <div>
            <div className="dest-stat-val">{stats.spiritualCount}</div>
            <div className="dest-stat-lbl">Tâm linh & Chùa cổ</div>
          </div>
        </div>

        <div className="admin-dest-stat-pill">
          <span className="dest-stat-icon green">
            <Clock size={18} />
          </span>
          <div>
            <div className="dest-stat-val">{stats.natureCount}</div>
            <div className="dest-stat-lbl">Thiên nhiên & Sinh thái</div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. FILTER & TOOLBAR BAR
      ======================================================== */}
      <div className="admin-dest-toolbar">
        {/* Search */}
        <div className="admin-dest-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên địa điểm, địa chỉ, lịch sử..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="admin-dest-filter-group">
          <select
            className="admin-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "Tất cả" ? "Tất cả danh mục" : c}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            className="admin-select"
            value={priceFilter}
            onChange={(e) =>
              setPriceFilter(e.target.value as "all" | "free" | "paid")
            }
          >
            <option value="all">Mọi mức giá</option>
            <option value="free">Miễn phí vé</option>
            <option value="paid">Có thu vé</option>
          </select>

          {/* Sort By */}
          <select
            className="admin-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "rating" | "name" | "newest")
            }
          >
            <option value="rating">Đánh giá cao nhất</option>
            <option value="name">Tên từ A-Z</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>

        {/* View Mode Toggle & Reset */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="admin-view-toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Xem dạng bảng chi tiết"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Xem dạng lưới thẻ ảnh"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <button
            type="button"
            className="admin-icon-btn"
            onClick={handleResetToDefault}
            title="Khôi phục dữ liệu gốc Cố đô Huế"
            style={{ border: "1px solid #ebdcfc" }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Search results counter */}
      <div className="admin-dest-results-count">
        Đang hiển thị <strong>{filteredList.length}</strong> / {destinations.length} địa điểm
      </div>

      {/* ========================================================
          3. MAIN CONTENT: TABLE VIEW OR GRID VIEW
      ======================================================== */}
      {viewMode === "table" ? (
        <div className="admin-subview-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>Hình ảnh</th>
                  <th style={{ minWidth: 180 }}>Tên địa điểm & GPS</th>
                  <th>Danh mục</th>
                  <th style={{ minWidth: 200 }}>Địa chỉ</th>
                  <th>Giá vé</th>
                  <th>Thời gian</th>
                  <th>Đánh giá</th>
                  <th>Nguồn</th>
                  <th style={{ width: 140, textAlign: "center" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((dest) => {
                  const isDefault = isDefaultItem(dest.id);
                  return (
                    <tr key={dest.id}>
                      {/* Image Thumbnail with Preview Trigger */}
                      <td>
                        <div
                          className="table-thumb-wrap"
                          onClick={() => setPreviewItem(dest)}
                          title="Bấm để xem ảnh lớn"
                        >
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="admin-table-thumb"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/hero-banner.jpg";
                            }}
                          />
                        </div>
                      </td>

                      {/* Name & Coordinates */}
                      <td>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#1e1b4b",
                            cursor: "pointer",
                          }}
                          onClick={() => setPreviewItem(dest)}
                          title="Bấm xem chi tiết"
                        >
                          {dest.name}
                        </div>
                        <div
                          className="table-gps-badge"
                          onClick={() => handleCopyGPS(dest.lat, dest.lng)}
                          title="Bấm để sao chép tọa độ GPS"
                        >
                          <span>
                            {dest.lat.toFixed(4)}, {dest.lng.toFixed(4)}
                          </span>
                          <Copy size={11} />
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span
                          className={`admin-tag ${
                            dest.category === "Di tích"
                              ? "admin-tag-purple"
                              : dest.category === "Tâm linh"
                              ? "admin-tag-amber"
                              : dest.category === "Thiên nhiên"
                              ? "admin-tag-green"
                              : "admin-tag-blue"
                          }`}
                        >
                          {dest.category}
                        </span>
                      </td>

                      {/* Address */}
                      <td style={{ fontSize: 13, color: "#475569" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
                          <MapPin
                            size={14}
                            color="#94a3b8"
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          <span>{dest.address}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ fontWeight: 600, color: "#334155" }}>
                        {dest.price || "Miễn phí"}
                      </td>

                      {/* Duration */}
                      <td style={{ color: "#64748b" }}>
                        {dest.duration || "1–2 giờ"}
                      </td>

                      {/* Rating */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <strong style={{ color: "#b45309" }}>{dest.rating}</strong>
                          {dest.ratingCount ? (
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>
                              ({dest.ratingCount})
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Source badge */}
                      <td>
                        <span
                          className="source-badge"
                          title={isDefault ? "Địa điểm gốc trong hệ thống Cố đô Huế" : "Địa điểm do Admin thêm thủ công"}
                        >
                          {isDefault ? "Hệ thống" : "Tùy chỉnh"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div
                          className="admin-table-actions"
                          style={{ justifyContent: "center" }}
                        >
                          <button
                            type="button"
                            className="admin-action-btn"
                            title="Xem trước chi tiết"
                            onClick={() => setPreviewItem(dest)}
                          >
                            <Eye size={15} />
                          </button>

                          <Link
                            to={`/map?id=${dest.id}`}
                            className="admin-action-btn"
                            title="Định vị trên Bản đồ"
                            target="_blank"
                          >
                            <MapPin size={15} />
                          </Link>

                          <button
                            type="button"
                            className="admin-action-btn"
                            title="Chỉnh sửa thông tin"
                            onClick={() => handleOpenEdit(dest)}
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            className="admin-action-btn delete"
                            title="Xóa địa điểm"
                            onClick={() => handleDelete(dest)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "40px 20px" }}>
                      <div style={{ color: "#64748b", fontSize: 14 }}>
                        Không tìm thấy địa điểm nào phù hợp với điều kiện tìm kiếm.
                      </div>
                      <button
                        type="button"
                        className="admin-btn-secondary"
                        style={{ marginTop: 12, display: "inline-flex" }}
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("Tất cả");
                          setPriceFilter("all");
                        }}
                      >
                        Đặt lại bộ lọc
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="admin-dest-card-grid">
          {filteredList.map((dest) => (
            <div key={dest.id} className="admin-dest-grid-card">
              <div className="dest-card-image-wrap">
                <img
                  src={dest.image}
                  alt={dest.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/hero-banner.jpg";
                  }}
                />
                <span className="dest-card-category-badge">{dest.category}</span>
                <div className="dest-card-rating-badge">
                  <Star size={12} fill="#ffffff" color="#ffffff" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              <div className="dest-card-body">
                <h3 className="dest-card-title">{dest.name}</h3>
                <p className="dest-card-address">
                  <MapPin size={13} />
                  <span>{dest.address}</span>
                </p>
                <p className="dest-card-desc">{dest.description}</p>

                <div className="dest-card-meta">
                  <span className="dest-card-price">{dest.price}</span>
                  <span className="dest-card-time">{dest.duration}</span>
                </div>

                <div className="dest-card-footer">
                  <button
                    type="button"
                    className="admin-action-btn"
                    onClick={() => setPreviewItem(dest)}
                    title="Xem chi tiết"
                  >
                    <Eye size={15} />
                  </button>
                  <Link
                    to={`/map?id=${dest.id}`}
                    className="admin-action-btn"
                    title="Xem trên bản đồ"
                    target="_blank"
                  >
                    <MapPin size={15} />
                  </Link>
                  <button
                    type="button"
                    className="admin-action-btn"
                    onClick={() => handleOpenEdit(dest)}
                    title="Chỉnh sửa"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    className="admin-action-btn delete"
                    onClick={() => handleDelete(dest)}
                    title="Xóa địa điểm"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          4. FORM MODAL: THÊM / CHỈNH SỬA ĐỊA ĐIỂM
      ======================================================== */}
      {isFormModalOpen && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setIsFormModalOpen(false)}
        >
          <div
            className="admin-modal-card"
            style={{ maxWidth: 750 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="admin-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: "#240a43" }}>
                  {editingItem ? `Chỉnh sửa: ${editingItem.name}` : "Thêm mới địa điểm du lịch Huế"}
                </h3>
                <p style={{ margin: "3px 0 0 0", fontSize: 12.5, color: "#64748b" }}>
                  Cung cấp đầy đủ thông tin để hiển thị trên bản đồ và cẩm nang du lịch
                </p>
              </div>

              <button
                type="button"
                className="admin-action-btn"
                onClick={() => setIsFormModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="admin-modal-nav-tabs">
              <button
                type="button"
                className={`tab-btn ${formTab === "basic" ? "active" : ""}`}
                onClick={() => setFormTab("basic")}
              >
                1. Thông tin cơ bản
              </button>
              <button
                type="button"
                className={`tab-btn ${formTab === "media" ? "active" : ""}`}
                onClick={() => setFormTab("media")}
              >
                2. Hình ảnh & Tọa độ
              </button>
              <button
                type="button"
                className={`tab-btn ${formTab === "details" ? "active" : ""}`}
                onClick={() => setFormTab("details")}
              >
                3. Nội dung & Điểm nhấn
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="admin-modal-body">
                {/* TAB 1: BASIC INFO */}
                {formTab === "basic" && (
                  <>
                    <div className="admin-form-group">
                      <label>Tên địa điểm du lịch (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Cung An Định, Lăng Tự Đức, Cầu Tràng Tiền..."
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="admin-form-grid-2">
                      <div className="admin-form-group">
                        <label>Danh mục phân loại</label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                        >
                          {CATEGORIES.filter((c) => c !== "Tất cả").map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-form-group">
                        <label>Giá vé tham quan</label>
                        <input
                          type="text"
                          placeholder="VD: 50.000 đ hoặc Miễn phí"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Địa chỉ chi tiết (*)</label>
                      <input
                        type="text"
                        required
                        placeholder="Số nhà, tên đường, phường/xã, TP Huế..."
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="admin-form-grid-2">
                      <div className="admin-form-group">
                        <label>Giờ mở cửa đón khách</label>
                        <input
                          type="text"
                          placeholder="VD: 07:30 - 17:30 (Hằng ngày)"
                          value={formData.openingHours}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              openingHours: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Thời lượng gợi ý</label>
                        <input
                          type="text"
                          placeholder="VD: 1–2 giờ hoặc 2–3 giờ"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="admin-form-grid-2">
                      <div className="admin-form-group">
                        <label>Điểm đánh giá mặc định (0 - 5 sao)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.rating}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              rating: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Số lượt đánh giá ban đầu</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.ratingCount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ratingCount: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label>Mô tả tóm tắt ngắn</label>
                      <textarea
                        rows={2}
                        placeholder="Tóm tắt 1-2 câu về địa điểm thu hút du khách..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {/* TAB 2: MEDIA & GPS */}
                {formTab === "media" && (
                  <>
                    <div className="admin-form-group">
                      <label>URL Hình ảnh đại diện chính (*)</label>
                      <input
                        type="url"
                        required
                        placeholder="https://... (URL hình ảnh chất lượng cao)"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                      />
                    </div>

                    {/* Image Preview & Quick Suggestions */}
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 4 }}>
                      <div className="form-image-preview-box">
                        <img
                          src={formData.image || "/images/hero-banner.jpg"}
                          alt="Xem trước hình ảnh"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/hero-banner.jpg";
                          }}
                        />
                        <span className="preview-label">Xem trước ảnh đại diện</span>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                          Ảnh mẫu gợi ý về Huế:
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {SAMPLE_HUE_IMAGES.map((sample) => (
                            <button
                              key={sample.label}
                              type="button"
                              className="sample-img-pill"
                              onClick={() =>
                                setFormData({ ...formData, image: sample.url })
                              }
                            >
                              {sample.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* GPS Coordinates */}
                    <div style={{ marginTop: 14 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>
                        Tọa độ bản đồ du lịch (GPS Coordinates)
                      </label>

                      <div className="admin-form-grid-2">
                        <div className="admin-form-group">
                          <label style={{ fontSize: 12, color: "#64748b" }}>Vĩ độ (Latitude)</label>
                          <input
                            type="number"
                            step="any"
                            value={formData.lat}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lat: parseFloat(e.target.value) || 16.4637,
                              })
                            }
                          />
                        </div>

                        <div className="admin-form-group">
                          <label style={{ fontSize: 12, color: "#64748b" }}>Kinh độ (Longitude)</label>
                          <input
                            type="number"
                            step="any"
                            value={formData.lng}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lng: parseFloat(e.target.value) || 107.5909,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Quick GPS Presets */}
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                          Chọn nhanh tọa độ các địa danh nổi tiếng:
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {HUE_GPS_PRESETS.map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              className="preset-gps-pill"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  lat: p.lat,
                                  lng: p.lng,
                                })
                              }
                            >
                              📍 {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 3: DETAILS & HIGHLIGHTS */}
                {formTab === "details" && (
                  <>
                    <div className="admin-form-group">
                      <label>Tiêu đề phần giới thiệu chi tiết</label>
                      <input
                        type="text"
                        placeholder="VD: Lịch sử hình thành & Kiến trúc độc đáo"
                        value={formData.detailHeading}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            detailHeading: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Nội dung thuyết minh chi tiết</label>
                      <textarea
                        rows={6}
                        placeholder="Viết nội dung giới thiệu lịch sử, những điểm chụp ảnh đẹp, lưu ý khi viếng thăm (mỗi đoạn cách nhau một dòng trống)..."
                        value={formData.detailContent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            detailContent: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Hủy bỏ
                </button>

                {formTab !== "details" ? (
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() =>
                      setFormTab(formTab === "basic" ? "media" : "details")
                    }
                  >
                    <span>Tiếp tục</span>
                    <ChevronRight size={15} />
                  </button>
                ) : null}

                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>{editingItem ? "Lưu thay đổi" : "Thêm địa điểm"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: XEM TRƯỚC CHI TIẾT ĐỊA ĐIỂM (PREVIEW)
      ======================================================== */}
      {previewItem && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="admin-modal-card"
            style={{ maxWidth: 680, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Cover Banner */}
            <div className="dest-preview-banner">
              <img
                src={previewItem.image}
                alt={previewItem.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/hero-banner.jpg";
                }}
              />
              <button
                type="button"
                className="close-preview-btn"
                onClick={() => setPreviewItem(null)}
              >
                <X size={18} />
              </button>
              <div className="dest-preview-badge-overlay">
                <span className="category-chip">{previewItem.category}</span>
                <span className="rating-chip">★ {previewItem.rating}</span>
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: "#1e1b4b", fontWeight: 800 }}>
                  {previewItem.name}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13, marginTop: 4 }}>
                  <MapPin size={14} color="#7c24a2" />
                  <span>{previewItem.address}</span>
                </div>
              </div>

              {/* Fast metadata pills */}
              <div className="dest-preview-meta-row">
                <div className="meta-pill">
                  <span className="lbl">Giá vé:</span>
                  <strong>{previewItem.price || "Miễn phí"}</strong>
                </div>
                <div className="meta-pill">
                  <span className="lbl">Thời gian:</span>
                  <strong>{previewItem.duration || "1–2 giờ"}</strong>
                </div>
                <div className="meta-pill">
                  <span className="lbl">Giờ mở cửa:</span>
                  <strong>{previewItem.openingHours || "07:30 - 17:30"}</strong>
                </div>
                <div className="meta-pill">
                  <span className="lbl">Tọa độ GPS:</span>
                  <strong>
                    {previewItem.lat.toFixed(4)}, {previewItem.lng.toFixed(4)}
                  </strong>
                </div>
              </div>

              <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, background: "#faf8fd", padding: 14, borderRadius: 12, border: "1px solid #ebdcfc" }}>
                {previewItem.description}
              </div>

              {/* Detailed Points if available */}
              {previewItem.details?.[0] && (
                <div style={{ marginTop: 4 }}>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: 15, color: "#240a43" }}>
                    {previewItem.details[0].heading}
                  </h4>
                  {previewItem.details[0].paragraphs?.map((p, idx) => (
                    <p key={idx} style={{ fontSize: 13.5, color: "#475569", margin: "4px 0" }}>
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #f1edf7" }}>
                <Link
                  to={`/map?id=${previewItem.id}`}
                  className="admin-btn-secondary"
                  target="_blank"
                >
                  <MapPin size={15} />
                  <span>Mở trên bản đồ du lịch</span>
                </Link>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      const item = previewItem;
                      setPreviewItem(null);
                      handleOpenEdit(item);
                    }}
                  >
                    <Edit3 size={15} />
                    <span>Chỉnh sửa</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() => setPreviewItem(null)}
                  >
                    <span>Hoàn tất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
