import { useState, useMemo, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Trash2,
  Edit3,
  Check,
  X,
  Lock,
  Unlock,
  RotateCcw,
  RefreshCw,
  Globe,
  Sparkles,
} from "lucide-react";
import {
  type SystemUser,
  USERS_STORAGE_KEY,
  DEFAULT_USERS,
  getStoredSystemUsers,
  generateInitialsAvatar,
} from "../../lib/users";

export type { SystemUser };
export { USERS_STORAGE_KEY };

interface UserManagerProps {
  onNotify?: (msg: string) => void;
}

export default function UserManager({ onNotify }: UserManagerProps) {
  const [users, setUsers] = useState<SystemUser[]>(() => {
    return getStoredSystemUsers();
  });

  // Lắng nghe cập nhật tài khoản đăng ký theo thời gian thực từ trang /register hoặc tab khác
  useEffect(() => {
    const handleSync = () => {
      setUsers(getStoredSystemUsers());
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("huesmart-users-updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("huesmart-users-updated", handleSync);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Du khách" as SystemUser["role"],
    status: "Hoạt động" as SystemUser["status"],
  });

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const saveUsers = (items: SystemUser[]) => {
    setUsers(items);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("huesmart-users-updated"));
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Du khách",
      status: "Hoạt động",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: SystemUser) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (u: SystemUser) => {
    const nextStatus: SystemUser["status"] =
      u.status === "Hoạt động" ? "Bị khóa" : "Hoạt động";
    const updated: SystemUser[] = users.map((item) =>
      item.id === u.id ? { ...item, status: nextStatus } : item
    );
    saveUsers(updated);
    notify(`Đã chuyển trạng thái tài khoản ${u.name} thành "${nextStatus}"`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${name}"?`)) {
      const next = users.filter((u) => u.id !== id);
      saveUsers(next);
      notify(`Đã xóa tài khoản "${name}"`);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Vui lòng điền họ tên và email!");
      return;
    }

    if (editingUser) {
      const updated = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      );
      saveUsers(updated);
      notify(`Đã cập nhật tài khoản "${formData.name}"`);
    } else {
      const newUser: SystemUser = {
        ...formData,
        id: `u-${Date.now()}`,
        joinedDate: "Hôm nay",
        avatar: generateInitialsAvatar(formData.name),
        source: "admin_created",
      };
      saveUsers([newUser, ...users]);
      notify(`Đã thêm người dùng mới "${newUser.name}"`);
    }
    setIsModalOpen(false);
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q);
      const matchRole =
        roleFilter === "Tất cả" ||
        (roleFilter === "Đăng ký trực tuyến" &&
          (u.source === "online_signup" || u.source === "social")) ||
        u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, roleFilter]);

  const onlineCount = useMemo(() => {
    return users.filter(
      (u) => u.source === "online_signup" || u.source === "social"
    ).length;
  }, [users]);

  return (
    <div className="admin-subview-panel">
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: 14 }}>
        <div className="admin-page-title-wrap">
          <h1 className="admin-page-title">
            <Users size={26} />
            <span>Quản lý Người dùng & Phân quyền ({users.length})</span>
          </h1>
          <div className="admin-page-subtitle">
            Cập nhật tự động tất cả tài khoản du khách đăng ký trực tuyến và phân quyền quản trị
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              const fresh = getStoredSystemUsers();
              setUsers(fresh);
              notify(`Đã đồng bộ dữ liệu mới nhất (${fresh.length} tài khoản)!`);
            }}
            title="Đồng bộ danh sách người dùng đăng ký mới"
          >
            <RefreshCw size={15} />
            <span>Làm mới ({users.length})</span>
          </button>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              saveUsers(DEFAULT_USERS);
              notify("Đã khôi phục danh sách người dùng mặc định!");
            }}
          >
            <RotateCcw size={15} />
            <span>Khôi phục mẫu</span>
          </button>

          <button type="button" className="admin-btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Thêm tài khoản mới</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-dest-toolbar">
        <div className="admin-dest-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm theo họ tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            className="admin-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="Tất cả">Tất cả tài khoản ({users.length})</option>
            <option value="Đăng ký trực tuyến">
              ✨ Đăng ký trực tuyến ({onlineCount})
            </option>
            <option value="Du khách">Du khách</option>
            <option value="Hướng dẫn viên">Hướng dẫn viên</option>
            <option value="Biên tập viên">Biên tập viên</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>Ảnh</th>
              <th>Họ và tên & Nguồn</th>
              <th>Email liên hệ</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th style={{ width: 130, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="admin-table-thumb"
                    style={{ width: 38, height: 38, borderRadius: "50%" }}
                  />
                </td>
                <td>
                  <strong>{u.name}</strong>
                  {u.source === "online_signup" && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#7c3aed",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 2,
                      }}
                    >
                      <Sparkles size={11} /> Đăng ký từ Web
                    </div>
                  )}
                  {u.source === "social" && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#2563eb",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 2,
                      }}
                    >
                      <Globe size={11} /> Đăng ký Mạng xã hội
                    </div>
                  )}
                </td>
                <td style={{ color: "#475569", fontSize: 13 }}>{u.email}</td>
                <td style={{ color: "#64748b", fontSize: 13 }}>{u.phone}</td>
                <td>
                  <span
                    className={`admin-tag ${
                      u.role === "Admin"
                        ? "admin-tag-purple"
                        : u.role === "Hướng dẫn viên"
                        ? "admin-tag-amber"
                        : "admin-tag-blue"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`admin-tag ${
                      u.status === "Hoạt động" ? "admin-tag-green" : "admin-tag-red"
                    }`}
                    style={u.status === "Bị khóa" ? { background: "#fee2e2", color: "#dc2626" } : {}}
                  >
                    {u.status}
                  </span>
                </td>
                <td style={{ color: "#64748b", fontSize: 12.5 }}>{u.joinedDate}</td>
                <td>
                  <div className="admin-table-actions" style={{ justifyContent: "center" }}>
                    <button
                      type="button"
                      className="admin-action-btn"
                      title={u.status === "Hoạt động" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                      onClick={() => handleToggleStatus(u)}
                    >
                      {u.status === "Hoạt động" ? <Lock size={15} /> : <Unlock size={15} color="#16a34a" />}
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn"
                      title="Chỉnh sửa"
                      onClick={() => handleOpenEdit(u)}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn delete"
                      title="Xóa tài khoản"
                      onClick={() => handleDelete(u.id, u.name)}
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
          <div className="admin-modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h3>
              <button type="button" className="admin-action-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Họ và tên (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Lê Thị Thu Hà..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Email tài khoản (*)</label>
                  <input
                    type="email"
                    required
                    placeholder="VD: user@gmail.com..."
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="VD: 0905 123 456..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="admin-form-grid-2">
                  <div className="admin-form-group">
                    <label>Phân quyền vai trò</label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value as SystemUser["role"] })
                      }
                    >
                      <option value="Du khách">Du khách</option>
                      <option value="Hướng dẫn viên">Hướng dẫn viên</option>
                      <option value="Biên tập viên">Biên tập viên</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as SystemUser["status"] })
                      }
                    >
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Bị khóa">Bị khóa</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>{editingUser ? "Cập nhật" : "Tạo tài khoản"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
