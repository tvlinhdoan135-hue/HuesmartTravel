import { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

export interface HueArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  views: number;
  status: "Đã xuất bản" | "Bản nháp";
  image: string;
  summary: string;
  content: string;
}

export const ARTICLES_STORAGE_KEY = "huesmart-admin-articles";

const DEFAULT_ARTICLES: HueArticle[] = [
  {
    id: "art-1",
    title: "Top 10 món ngon đặc sắc không thể bỏ lỡ khi đặt chân đến Huế",
    category: "Ẩm thực xứ Huế",
    author: "BTV Hồng Thủy",
    date: "05/11/2026",
    views: 18420,
    status: "Đã xuất bản",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    summary: "Từ bún bò Huế đậm đà nước dùng ruốc sả, các loại bánh bèo nậm lọc thanh tao cho tới chè bột lọc bọc heo quay trứ danh.",
    content: "Huế từ lâu đã được mệnh danh là kinh đô ẩm thực của dải đất hình chữ S. Với hơn một nghìn món ăn được lưu truyền từ chốn cung đình quý tộc cho tới ẩm thực bình dị dân gian ven đường...",
  },
  {
    id: "art-2",
    title: "Cẩm nang khám phá trọn vẹn Quần thể Di tích Cố đô Huế trong 48 giờ",
    category: "Cẩm nang du lịch",
    author: "Nguyễn Văn Hùng",
    date: "01/11/2026",
    views: 12530,
    status: "Đã xuất bản",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png",
    summary: "Lộ trình chi tiết từng khung giờ tham quan Ngọ Môn, Điện Thái Hòa, Lăng Tự Đức, Lăng Khải Định và các địa điểm chụp ảnh áo dài đẹp nhất.",
    content: "Thời điểm lý tưởng nhất để bắt đầu ngày mới tại Huế là 7h30 sáng khi tiết trời còn mát lành và vạt nắng sớm rọi qua cổng Ngọ Môn...",
  },
  {
    id: "art-3",
    title: "Lãng đãng hoàng hôn đầm phá Tam Giang — Vẻ đẹp bình yên giữa lòng miền Trung",
    category: "Trải nghiệm bản địa",
    author: "Trần Minh Quang",
    date: "26/10/2026",
    views: 8940,
    status: "Đã xuất bản",
    image: "https://huetripo.hue.gov.vn/uploads/Media/2026/pha-tam-giang-9_1781749154.jpg",
    summary: "Trải nghiệm chèo sup ngắm ráng chiều vàng rực, thưởng thức tôm nhảy đầm phá và đón gió chiều mát rượi.",
    content: "Phá Tam Giang là hệ đầm phá nước lợ lớn nhất Đông Nam Á, nơi du khách có thể tạm rời xa ồn ào phố thị để hòa mình cùng thiên nhiên sông nước thanh bình...",
  },
  {
    id: "art-4",
    title: "Nghệ thuật khảm sành sứ độc bản tại Lăng Vua Khải Định",
    category: "Văn hóa - Lịch sử",
    author: "Nhà nghiên cứu Huế học",
    date: "20/10/2026",
    views: 6710,
    status: "Bản nháp",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/74d44096-3627-4cf5-a5b5-5b71fdac2f9e_1793344049.jpg",
    summary: "Tìm hiểu bí mật đằng sau hàng vạn mảnh bát đĩa cổ được bàn tay nghệ nhân Việt ghép thành những bức tranh phù điêu tráng lệ.",
    content: "Không một công trình lăng tẩm nào tại Việt Nam lại sở hữu nghệ thuật ghép sành sứ đỉnh cao và độc đáo như Ứng Lăng (Lăng Khải Định)...",
  },
];

interface ArticleManagerProps {
  onNotify?: (msg: string) => void;
}

export default function ArticleManager({ onNotify }: ArticleManagerProps) {
  const [articles, setArticles] = useState<HueArticle[]>(() => {
    try {
      const saved = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ARTICLES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<HueArticle | null>(null);
  const [previewArticle, setPreviewArticle] = useState<HueArticle | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Cẩm nang du lịch",
    author: "Ban Biên tập HueSmart",
    summary: "",
    content: "",
    image: "",
    status: "Đã xuất bản" as HueArticle["status"],
  });

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const saveArticles = (items: HueArticle[]) => {
    setArticles(items);
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(items));
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      category: "Cẩm nang du lịch",
      author: "Ban Biên tập HueSmart",
      summary: "",
      content: "",
      image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png",
      status: "Đã xuất bản",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: HueArticle) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      category: art.category,
      author: art.author,
      summary: art.summary,
      content: art.content,
      image: art.image,
      status: art.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) {
      const next = articles.filter((a) => a.id !== id);
      saveArticles(next);
      notify(`Đã xóa bài viết "${title}"`);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết!");
      return;
    }

    if (editingArticle) {
      const updated = articles.map((a) =>
        a.id === editingArticle.id ? { ...a, ...formData } : a
      );
      saveArticles(updated);
      notify(`Đã cập nhật bài viết "${formData.title}"`);
    } else {
      const newArticle: HueArticle = {
        ...formData,
        id: `art-${Date.now()}`,
        date: "Hôm nay",
        views: 1,
      };
      saveArticles([newArticle, ...articles]);
      notify(`Đã đăng bài viết mới "${newArticle.title}"`);
    }
    setIsModalOpen(false);
  };

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q);
      const matchCat =
        categoryFilter === "Tất cả" || a.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [articles, searchQuery, categoryFilter]);

  return (
    <div className="admin-subview-panel">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: 14 }}>
        <div className="admin-page-title-wrap">
          <h1 className="admin-page-title">
            <FileText size={26} />
            <span>Quản lý Bài viết & Cẩm nang du lịch Huế ({articles.length})</span>
          </h1>
          <div className="admin-page-subtitle">
            Biên tập các bài hướng dẫn, cẩm nang ăn uống, review điểm đến và di sản văn hóa
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              saveArticles(DEFAULT_ARTICLES);
              notify("Đã khôi phục danh sách bài viết mẫu!");
            }}
          >
            <RotateCcw size={15} />
            <span>Khôi phục mẫu</span>
          </button>

          <button type="button" className="admin-btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Đăng bài viết mới</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-dest-toolbar">
        <div className="admin-dest-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tác giả, nội dung tóm tắt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="Tất cả">Tất cả chuyên mục</option>
            <option value="Cẩm nang du lịch">Cẩm nang du lịch</option>
            <option value="Ẩm thực xứ Huế">Ẩm thực xứ Huế</option>
            <option value="Văn hóa - Lịch sử">Văn hóa - Lịch sử</option>
            <option value="Trải nghiệm bản địa">Trải nghiệm bản địa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Ảnh</th>
              <th>Tiêu đề bài viết</th>
              <th>Chuyên mục</th>
              <th>Tác giả</th>
              <th>Lượt xem</th>
              <th>Ngày đăng</th>
              <th>Trạng thái</th>
              <th style={{ width: 120, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((art) => (
              <tr key={art.id}>
                <td>
                  <img
                    src={art.image}
                    alt={art.title}
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
                    onClick={() => setPreviewArticle(art)}
                  >
                    {art.title}
                  </strong>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {art.summary}
                  </div>
                </td>
                <td>
                  <span className="admin-tag admin-tag-purple">{art.category}</span>
                </td>
                <td style={{ fontSize: 13, color: "#475569" }}>{art.author}</td>
                <td style={{ fontWeight: 600, color: "#7c24a2" }}>
                  {art.views.toLocaleString()} lượt
                </td>
                <td style={{ fontSize: 12.5, color: "#64748b" }}>{art.date}</td>
                <td>
                  <span
                    className={`admin-tag ${
                      art.status === "Đã xuất bản" ? "admin-tag-green" : "admin-tag-amber"
                    }`}
                  >
                    {art.status}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions" style={{ justifyContent: "center" }}>
                    <button
                      type="button"
                      className="admin-action-btn"
                      title="Xem trước bài viết"
                      onClick={() => setPreviewArticle(art)}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn"
                      title="Chỉnh sửa"
                      onClick={() => handleOpenEdit(art)}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn delete"
                      title="Xóa bài viết"
                      onClick={() => handleDelete(art.id, art.title)}
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
          <div className="admin-modal-card" style={{ maxWidth: 660 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingArticle ? "Chỉnh sửa bài viết" : "Đăng bài viết mới"}</h3>
              <button type="button" className="admin-action-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Tiêu đề bài viết (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Top 10 món ngon đặc sắc tại Huế..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Chuyên mục</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Cẩm nang du lịch">Cẩm nang du lịch</option>
                      <option value="Ẩm thực xứ Huế">Ẩm thực xứ Huế</option>
                      <option value="Văn hóa - Lịch sử">Văn hóa - Lịch sử</option>
                      <option value="Trải nghiệm bản địa">Trải nghiệm bản địa</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as HueArticle["status"],
                        })
                      }
                    >
                      <option value="Đã xuất bản">Đã xuất bản (Công khai)</option>
                      <option value="Bản nháp">Lưu bản nháp</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Tác giả / Nguồn bài viết</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>URL Ảnh bìa bài viết</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Tóm tắt ngắn (Sapo)</label>
                  <textarea
                    rows={2}
                    placeholder="Tóm tắt 1-2 câu ngắn gọn xuất hiện ở danh sách bài viết..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Nội dung chi tiết bài viết</label>
                  <textarea
                    rows={6}
                    placeholder="Nội dung bài viết giới thiệu kinh nghiệm, lịch sử, các điểm check-in..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>{editingArticle ? "Cập nhật bài viết" : "Xuất bản bài viết"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewArticle && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewArticle(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <div className="dest-preview-banner">
              <img src={previewArticle.image} alt={previewArticle.title} />
              <button type="button" className="close-preview-btn" onClick={() => setPreviewArticle(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
                <span className="admin-tag admin-tag-purple">{previewArticle.category}</span>
                <span style={{ color: "#64748b" }}>Tác giả: {previewArticle.author} · {previewArticle.date}</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 20, color: "#1e1b4b" }}>{previewArticle.title}</h2>
              <p style={{ fontStyle: "italic", color: "#64748b", margin: 0, fontSize: 13.5 }}>
                "{previewArticle.summary}"
              </p>
              <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, background: "#faf8fd", padding: 14, borderRadius: 10 }}>
                {previewArticle.content}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="button" className="admin-btn-primary" onClick={() => setPreviewArticle(null)}>
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
