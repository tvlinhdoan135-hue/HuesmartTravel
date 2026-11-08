import { useState } from "react";
import {
  Settings,
  Check,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import {
  ADMIN_DESTINATIONS_KEY,
  ADMIN_OVERRIDES_KEY,
  ADMIN_DELETED_KEY,
} from "../../data";
import { EVENTS_STORAGE_KEY } from "./EventManager";
import { ITINERARIES_STORAGE_KEY } from "./ItineraryManager";
import { USERS_STORAGE_KEY } from "./UserManager";
import { REVIEWS_STORAGE_KEY } from "./ReviewManager";
import { ARTICLES_STORAGE_KEY } from "./ArticleManager";

export const SETTINGS_STORAGE_KEY = "huesmart-admin-settings";

export interface SystemSettingsData {
  portalName: string;
  portalSubtitle: string;
  hotline: string;
  email: string;
  address: string;
  copyright: string;
  mapDefaultLat: number;
  mapDefaultLng: number;
  mapDefaultZoom: number;
  mapTileLayer: string;
  aiAssistantEnabled: boolean;
  aiGreeting: string;
}

const DEFAULT_SETTINGS: SystemSettingsData = {
  portalName: "HueSmart Travel",
  portalSubtitle: "Discover the Imperial City — Nền tảng Du lịch Thông minh Cố đô Huế",
  hotline: "1900 8888 / 0234 3822 532",
  email: "admin@huesmart-travel.gov.vn",
  address: "Số 04 Hoàng Hoa Thám, Phường Vĩnh Ninh, Thành phố Huế",
  copyright: "© 2026 HueSmart Travel · Sở Du lịch Tỉnh Thừa Thiên Huế",
  mapDefaultLat: 16.4637,
  mapDefaultLng: 107.5909,
  mapDefaultZoom: 14,
  mapTileLayer: "heritage",
  aiAssistantEnabled: true,
  aiGreeting: "Xin chào! Tôi là Trợ lý Du lịch Thông minh HueSmart. Tôi có thể gợi ý địa điểm, ẩm thực và lịch trình Huế cho bạn hôm nay?",
};

interface SettingsManagerProps {
  onNotify?: (msg: string) => void;
}

export default function SettingsManager({ onNotify }: SettingsManagerProps) {
  const [settingsTab, setSettingsTab] = useState<"general" | "map" | "ai" | "data">("general");

  const [settings, setSettings] = useState<SystemSettingsData>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    notify("Đã lưu toàn bộ cài đặt hệ thống thành công!");
  };

  // Full System Backup
  const handleFullBackup = () => {
    const fullBackup = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      settings,
      destinations: JSON.parse(localStorage.getItem(ADMIN_DESTINATIONS_KEY) || "[]"),
      overrides: JSON.parse(localStorage.getItem(ADMIN_OVERRIDES_KEY) || "[]"),
      deleted: JSON.parse(localStorage.getItem(ADMIN_DELETED_KEY) || "[]"),
      events: JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || "[]"),
      itineraries: JSON.parse(localStorage.getItem(ITINERARIES_STORAGE_KEY) || "[]"),
      users: JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || "[]"),
      reviews: JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || "[]"),
      articles: JSON.parse(localStorage.getItem(ARTICLES_STORAGE_KEY) || "[]"),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `HueSmart_Full_System_Backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify("Đã tải xuống file sao lưu toàn bộ hệ thống HueSmart Travel!");
  };

  // Full Restore
  const handleFullRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === "object") {
            if (parsed.settings) {
              setSettings(parsed.settings);
              localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed.settings));
            }
            if (parsed.destinations) localStorage.setItem(ADMIN_DESTINATIONS_KEY, JSON.stringify(parsed.destinations));
            if (parsed.overrides) localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(parsed.overrides));
            if (parsed.deleted) localStorage.setItem(ADMIN_DELETED_KEY, JSON.stringify(parsed.deleted));
            if (parsed.events) localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(parsed.events));
            if (parsed.itineraries) localStorage.setItem(ITINERARIES_STORAGE_KEY, JSON.stringify(parsed.itineraries));
            if (parsed.users) localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed.users));
            if (parsed.reviews) localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(parsed.reviews));
            if (parsed.articles) localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(parsed.articles));

            window.dispatchEvent(new Event("huesmart-destinations-updated"));
            window.dispatchEvent(new Event("huesmart-events-updated"));
            notify("Đã khôi phục toàn bộ hệ thống từ file sao lưu thành công!");
          }
        } catch {
          alert("File sao lưu không hợp lệ!");
        }
      };
    }
  };

  // Clear cache
  const handleClearCache = () => {
    if (window.confirm("Bạn có chắc muốn xóa bộ nhớ tạm trình duyệt? (Dữ liệu đã lưu sẽ không bị mất)")) {
      sessionStorage.clear();
      notify("Đã dọn sạch bộ nhớ đệm (Cache) hệ thống!");
    }
  };

  return (
    <div className="admin-subview-panel">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: 14 }}>
        <div className="admin-page-title-wrap">
          <h1 className="admin-page-title">
            <Settings size={26} />
            <span>Cài đặt & Cấu hình Hệ thống</span>
          </h1>
          <div className="admin-page-subtitle">
            Tùy biến thương hiệu, tọa độ bản đồ số, trợ lý AI và sao lưu dữ liệu toàn bộ nền tảng
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-modal-nav-tabs" style={{ borderRadius: 12, border: "1px solid #ebdcfc" }}>
        <button
          type="button"
          className={`tab-btn ${settingsTab === "general" ? "active" : ""}`}
          onClick={() => setSettingsTab("general")}
        >
          Thông tin chung
        </button>
        <button
          type="button"
          className={`tab-btn ${settingsTab === "map" ? "active" : ""}`}
          onClick={() => setSettingsTab("map")}
        >
          Bản đồ số du lịch
        </button>
        <button
          type="button"
          className={`tab-btn ${settingsTab === "ai" ? "active" : ""}`}
          onClick={() => setSettingsTab("ai")}
        >
          Trợ lý AI Assistant
        </button>
        <button
          type="button"
          className={`tab-btn ${settingsTab === "data" ? "active" : ""}`}
          onClick={() => setSettingsTab("data")}
        >
          Sao lưu & Phục hồi dữ liệu
        </button>
      </div>

      <form onSubmit={handleSaveSettings} style={{ marginTop: 16 }}>
        {/* Tab 1: General */}
        {settingsTab === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
            <div className="admin-form-group">
              <label>Tên cổng thông tin du lịch</label>
              <input
                type="text"
                value={settings.portalName}
                onChange={(e) => setSettings({ ...settings, portalName: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Khẩu hiệu / Slogan</label>
              <input
                type="text"
                value={settings.portalSubtitle}
                onChange={(e) => setSettings({ ...settings, portalSubtitle: e.target.value })}
              />
            </div>

            <div className="admin-form-grid-2">
              <div className="admin-form-group">
                <label>Hotline hỗ trợ du khách 24/7</label>
                <input
                  type="text"
                  value={settings.hotline}
                  onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Email liên hệ ban quản lý</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Địa chỉ văn phòng quản lý</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Dòng chữ bản quyền chân trang (Footer Copyright)</label>
              <input
                type="text"
                value={settings.copyright}
                onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Map */}
        {settingsTab === "map" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
            <div className="admin-form-grid-2">
              <div className="admin-form-group">
                <label>Vĩ độ trung tâm Huế (Default Lat)</label>
                <input
                  type="number"
                  step="any"
                  value={settings.mapDefaultLat}
                  onChange={(e) => setSettings({ ...settings, mapDefaultLat: parseFloat(e.target.value) || 16.4637 })}
                />
              </div>

              <div className="admin-form-group">
                <label>Kinh độ trung tâm Huế (Default Lng)</label>
                <input
                  type="number"
                  step="any"
                  value={settings.mapDefaultLng}
                  onChange={(e) => setSettings({ ...settings, mapDefaultLng: parseFloat(e.target.value) || 107.5909 })}
                />
              </div>
            </div>

            <div className="admin-form-grid-2">
              <div className="admin-form-group">
                <label>Mức độ phóng to ban đầu (Default Zoom: 10 - 18)</label>
                <input
                  type="number"
                  min="10"
                  max="18"
                  value={settings.mapDefaultZoom}
                  onChange={(e) => setSettings({ ...settings, mapDefaultZoom: parseInt(e.target.value) || 14 })}
                />
              </div>

              <div className="admin-form-group">
                <label>Lớp bản đồ mặc định</label>
                <select
                  value={settings.mapTileLayer}
                  onChange={(e) => setSettings({ ...settings, mapTileLayer: e.target.value })}
                >
                  <option value="heritage">Bản đồ Di sản (OpenStreetMap Việt hóa)</option>
                  <option value="standard">Bản đồ Tiêu chuẩn</option>
                  <option value="satellite">Bản đồ Vệ tinh</option>
                </select>
              </div>
            </div>

            <div style={{ background: "#faf8fd", padding: 14, borderRadius: 12, border: "1px solid #ebdcfc", fontSize: 13, color: "#475569" }}>
              📍 <strong>Lưu ý:</strong> Khi du khách mở trang Bản đồ tương tác (`/map`), bản đồ sẽ tự động định vị về đúng tọa độ và mức zoom bạn cài đặt tại đây.
            </div>
          </div>
        )}

        {/* Tab 3: AI Assistant */}
        {settingsTab === "ai" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
            <div className="admin-form-group">
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={settings.aiAssistantEnabled}
                  onChange={(e) => setSettings({ ...settings, aiAssistantEnabled: e.target.checked })}
                />
                <span style={{ fontWeight: 700, color: "#1e1b4b" }}>
                  Kích hoạt Trợ lý ảo AI Travel Assistant hỗ trợ gợi ý lịch trình
                </span>
              </label>
            </div>

            <div className="admin-form-group">
              <label>Lời chào mặc định khi mở khung chat AI</label>
              <textarea
                rows={3}
                value={settings.aiGreeting}
                onChange={(e) => setSettings({ ...settings, aiGreeting: e.target.value })}
              />
            </div>

            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: 14, borderRadius: 12, fontSize: 13, color: "#166534" }}>
              🤖 <strong>Trạng thái AI:</strong> Đang hoạt động ở chế độ phân tích ngữ cảnh địa danh Huế thời gian thực, có khả năng gợi ý hành trình 1 ngày, 2 ngày, quán ăn ngon và mẹo du lịch tiết kiệm.
            </div>
          </div>
        )}

        {/* Tab 4: Backup & Data */}
        {settingsTab === "data" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 720 }}>
            <div style={{ background: "#ffffff", padding: 18, borderRadius: 14, border: "1px solid #ebdcfc", boxShadow: "0 2px 8px rgba(74, 21, 110, 0.04)" }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: 16, color: "#1e1b4b" }}>Sao lưu toàn bộ dữ liệu (Full Backup)</h3>
              <p style={{ margin: "0 0 14px 0", fontSize: 13, color: "#64748b" }}>
                Tải về toàn bộ cơ sở dữ liệu gồm Điểm đến, Sự kiện, Lịch trình, Tài khoản người dùng, Bài viết và Cài đặt thành 1 file JSON duy nhất để lưu trữ an toàn.
              </p>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleFullBackup}
              >
                <Download size={16} />
                <span>Tải tệp sao lưu Full Backup</span>
              </button>
            </div>

            <div style={{ background: "#ffffff", padding: 18, borderRadius: 14, border: "1px solid #ebdcfc", boxShadow: "0 2px 8px rgba(74, 21, 110, 0.04)" }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: 16, color: "#1e1b4b" }}>Khôi phục từ tệp sao lưu (Full Restore)</h3>
              <p style={{ margin: "0 0 14px 0", fontSize: 13, color: "#64748b" }}>
                Chọn tệp JSON sao lưu trước đó để nạp lại toàn bộ dữ liệu hệ thống.
              </p>
              <label className="admin-btn-secondary" style={{ display: "inline-flex", cursor: "pointer" }}>
                <Upload size={16} />
                <span>Chọn tệp sao lưu để khôi phục</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFullRestore}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div style={{ background: "#fff9ee", padding: 18, borderRadius: 14, border: "1px solid #fee6be" }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: 16, color: "#92400e" }}>Dọn dẹp bộ nhớ đệm (Cache Cleaning)</h3>
              <p style={{ margin: "0 0 14px 0", fontSize: 13, color: "#78350f" }}>
                Xóa sạch các phiên làm việc tạm và giải phóng bộ nhớ trình duyệt mà không làm mất dữ liệu.
              </p>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={handleClearCache}
              >
                <Trash2 size={16} />
                <span>Dọn dẹp Cache ngay</span>
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1edf7" }}>
          <button type="submit" className="admin-btn-primary">
            <Check size={16} />
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
