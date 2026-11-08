import {
  BarChart2,
  Users,
  DollarSign,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Sparkles,
} from "lucide-react";

interface AnalyticsManagerProps {
  onNotify?: (msg: string) => void;
}

export default function AnalyticsManager({ onNotify }: AnalyticsManagerProps) {
  const handleExportReport = () => {
    if (onNotify) {
      onNotify("Đang tạo và tải về báo cáo thống kê du lịch Huế tháng 11/2026...");
    }
  };

  return (
    <div className="admin-subview-panel">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: 14 }}>
        <div className="admin-page-title-wrap">
          <h1 className="admin-page-title">
            <BarChart2 size={26} />
            <span>Báo cáo Thống kê & Phân tích Du lịch Huế</span>
          </h1>
          <div className="admin-page-subtitle">
            Dữ liệu tổng hợp lượt khách, doanh thu vé di tích, xu hướng trải nghiệm và hành vi du khách
          </div>
        </div>

        <button
          type="button"
          className="admin-btn-primary"
          onClick={handleExportReport}
        >
          <Download size={16} />
          <span>Xuất báo cáo tổng hợp</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card card-purple">
          <div className="admin-stat-left">
            <div className="admin-stat-icon-wrap">
              <Users size={19} />
            </div>
            <div className="admin-stat-number">48.250</div>
            <div className="admin-stat-label-wrap">
              <span>Lượt khách tháng 11</span>
              <span className="admin-badge-trend">↑ +18.4%</span>
            </div>
          </div>
        </div>

        <div className="admin-stat-card card-green">
          <div className="admin-stat-left">
            <div className="admin-stat-icon-wrap">
              <DollarSign size={19} />
            </div>
            <div className="admin-stat-number">3,85 Tỷ</div>
            <div className="admin-stat-label-wrap">
              <span>Doanh thu vé tham quan</span>
              <span className="admin-badge-trend">↑ +14.2%</span>
            </div>
          </div>
        </div>

        <div className="admin-stat-card card-amber">
          <div className="admin-stat-left">
            <div className="admin-stat-icon-wrap">
              <Globe size={19} />
            </div>
            <div className="admin-stat-number">38% / 62%</div>
            <div className="admin-stat-label-wrap">
              <span>Khách quốc tế / Khách nội địa</span>
            </div>
          </div>
        </div>

        <div className="admin-stat-card card-pink">
          <div className="admin-stat-left">
            <div className="admin-stat-icon-wrap">
              <Sparkles size={19} />
            </div>
            <div className="admin-stat-number">4,8/5</div>
            <div className="admin-stat-label-wrap">
              <span>Mức độ hài lòng du khách</span>
              <span className="admin-badge-trend">↑ +0.3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Row 1: Categories & Devices */}
      <div className="admin-grid-row-2" style={{ marginTop: 20 }}>
        {/* Category Breakdown */}
        <div className="admin-card">
          <h3 style={{ margin: "0 0 16px 0", fontSize: 16, color: "#1e1b4b" }}>
            Phân bổ loại hình du lịch được quan tâm nhất
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <strong>Di tích lịch sử & Cung đình Huế</strong>
                <span style={{ fontWeight: 700, color: "#7c24a2" }}>52% (25.100 lượt)</span>
              </div>
              <div style={{ height: 8, background: "#f3e8ff", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "52%", background: "#7c24a2", borderRadius: 4 }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <strong>Ẩm thực & Đặc sản Cố đô</strong>
                <span style={{ fontWeight: 700, color: "#d946ef" }}>24% (11.580 lượt)</span>
              </div>
              <div style={{ height: 8, background: "#fce7f3", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "24%", background: "#d946ef", borderRadius: 4 }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <strong>Sinh thái, Đầm phá & Biển</strong>
                <span style={{ fontWeight: 700, color: "#16a34a" }}>14% (6.755 lượt)</span>
              </div>
              <div style={{ height: 8, background: "#dcfce7", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "14%", background: "#16a34a", borderRadius: 4 }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <strong>Tâm linh, Chùa cổ & Thiền viện</strong>
                <span style={{ fontWeight: 700, color: "#f59e0b" }}>10% (4.825 lượt)</span>
              </div>
              <div style={{ height: 8, background: "#fef3c7", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "10%", background: "#f59e0b", borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="admin-card">
          <h3 style={{ margin: "0 0 16px 0", fontSize: 16, color: "#1e1b4b" }}>
            Thiết bị truy cập cổng du lịch
          </h3>

          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", padding: "16px 0" }}>
            <div>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#f5effe", color: "#7c24a2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px auto" }}>
                <Smartphone size={24} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b" }}>68%</div>
              <div style={{ fontSize: 12.5, color: "#64748b" }}>Mobile</div>
            </div>

            <div>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px auto" }}>
                <Monitor size={24} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b" }}>26%</div>
              <div style={{ fontSize: 12.5, color: "#64748b" }}>Desktop / Laptop</div>
            </div>

            <div>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px auto" }}>
                <Tablet size={24} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b" }}>6%</div>
              <div style={{ fontSize: 12.5, color: "#64748b" }}>Tablet</div>
            </div>
          </div>

          <div style={{ background: "#faf8fd", padding: 12, borderRadius: 10, fontSize: 13, color: "#475569", border: "1px solid #ebdcfc", marginTop: 10 }}>
            💡 <strong>Nhận định:</strong> Du khách chủ yếu tra cứu thông tin và sử dụng bản đồ thông minh bằng thiết bị di động khi đang di chuyển trên địa bàn Huế.
          </div>
        </div>
      </div>

      {/* Top 5 Destinations Table */}
      <div style={{ marginTop: 20 }}>
        <div className="admin-card">
          <h3 style={{ margin: "0 0 14px 0", fontSize: 16, color: "#1e1b4b" }}>
            Top 5 địa điểm có lưu lượng truy cập và tìm kiếm cao nhất tháng
          </h3>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thứ hạng</th>
                  <th>Tên địa danh</th>
                  <th>Tổng lượt xem</th>
                  <th>Xu hướng tăng trưởng</th>
                  <th>Tỷ lệ tìm đường trên bản đồ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ color: "#f59e0b" }}>#1</strong></td>
                  <td><strong>Đại Nội Huế (Hoàng Thành & Tử Cấm Thành)</strong></td>
                  <td>42.500 lượt</td>
                  <td><span className="admin-badge-trend">↑ +24.5%</span></td>
                  <td>86% du khách bấm chỉ đường</td>
                </tr>
                <tr>
                  <td><strong style={{ color: "#94a3b8" }}>#2</strong></td>
                  <td><strong>Chùa Thiên Mụ & Tháp Phước Duyên</strong></td>
                  <td>31.200 lượt</td>
                  <td><span className="admin-badge-trend">↑ +18.2%</span></td>
                  <td>79% du khách bấm chỉ đường</td>
                </tr>
                <tr>
                  <td><strong style={{ color: "#d97706" }}>#3</strong></td>
                  <td><strong>Lăng Khải Định (Ứng Lăng)</strong></td>
                  <td>24.800 lượt</td>
                  <td><span className="admin-badge-trend">↑ +15.0%</span></td>
                  <td>82% du khách bấm chỉ đường</td>
                </tr>
                <tr>
                  <td><strong>#4</strong></td>
                  <td><strong>Đồi Vọng Cảnh & Làng hương Thủy Xuân</strong></td>
                  <td>16.400 lượt</td>
                  <td><span className="admin-badge-trend">↑ +28.4%</span></td>
                  <td>74% du khách bấm chỉ đường</td>
                </tr>
                <tr>
                  <td><strong>#5</strong></td>
                  <td><strong>Phá Tam Giang & Bến thuyền Cồn Tộc</strong></td>
                  <td>12.100 lượt</td>
                  <td><span className="admin-badge-trend">↑ +21.0%</span></td>
                  <td>68% du khách bấm chỉ đường</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
