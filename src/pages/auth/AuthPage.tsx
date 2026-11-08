import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  LogOut,
  Globe,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  MapPin,
  Heart,
  ShieldCheck,
  Send,
} from "lucide-react";
import "./AuthPage.css";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { recordUserRegistration } from "../../lib/users";

// Stylized Hue Imperial Gate (Ngọ Môn) SVG matching the design
export function HueImperialGateIcon({
  size = 36,
  className = "auth-gate-svg",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.75)}
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top ridge and curved eaves */}
      <path
        d="M24 2C26.5 2 35 3.5 38 6C34 6.2 32 6.5 32 8H16C16 6.5 14 6.2 10 6C13 3.5 21.5 2 24 2Z"
        fill="currentColor"
      />
      {/* Upper pavilion columns & windows */}
      <rect
        x="17"
        y="8"
        width="14"
        height="6"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <rect x="19" y="9.5" width="2.5" height="4.5" rx="0.5" fill="#ffffff" />
      <rect x="23" y="9.5" width="2" height="4.5" rx="0.5" fill="#ffffff" />
      <rect x="26.5" y="9.5" width="2.5" height="4.5" rx="0.5" fill="#ffffff" />
      {/* Middle wide flared eaves */}
      <path
        d="M24 13.5C28 13.5 42 15 46 18C41 18.2 38 18.8 38 21H10C10 18.8 7 18.2 2 18C6 15 20 13.5 24 13.5Z"
        fill="currentColor"
      />
      {/* Platform */}
      <rect x="8" y="21" width="32" height="2" fill="currentColor" />
      {/* Lower stone masonry base */}
      <path d="M7 23H41V35H7V23Z" fill="currentColor" />
      {/* Center main portal arch */}
      <path
        d="M21 35V27C21 25.3431 22.3431 24 24 24C25.6569 24 27 25.3431 27 27V35H21Z"
        fill="#ffffff"
      />
      {/* Left portal arch */}
      <path
        d="M11 35V29C11 27.8954 11.8954 27 13 27C14.1046 27 15 27.8954 15 29V35H11Z"
        fill="#ffffff"
      />
      {/* Right portal arch */}
      <path
        d="M33 35V29C33 27.8954 33.8954 27 35 27C36.1046 27 37 27.8954 37 29V35H33Z"
        fill="#ffffff"
      />
    </svg>
  );
}

// Social Login SVGs
function GoogleIcon() {
  return (
    <svg className="auth-social-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="auth-social-icon" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="auth-social-icon" viewBox="0 0 24 24" fill="#000000" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.34c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.12 1.82-.98 2.93 1.07.08 2.14-.49 2.79-1.27z" />
    </svg>
  );
}

interface StoredUser {
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
}

interface AuthPageProps {
  initialMode?: "register" | "login";
}

export default function AuthPage({ initialMode = "register" }: AuthPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode state: 'register' or 'login'
  const modeFromQuery = searchParams.get("mode");
  const [mode, setMode] = useState<"register" | "login">(() => {
    if (modeFromQuery === "login") return "login";
    if (modeFromQuery === "register") return "register";
    return initialMode;
  });

  // Current logged in user state
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(() => {
    try {
      const stored = localStorage.getItem("huesmart-user");
      if (stored) return JSON.parse(stored);
      const demoUser = localStorage.getItem("huesmart-demo-user");
      if (demoUser) {
        return {
          fullName: demoUser.split("@")[0].toUpperCase(),
          email: demoUser,
          role: "Thành viên thân thiết",
        };
      }
    } catch {
      // fallback
    }
    return null;
  });

  // Form input states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback & Loading
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success" | "info"; message: string } | null>(null);

  // Modals state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Language Dropdown
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState("Tiếng Việt");

  const languages = [
    { code: "vi", label: "Tiếng Việt" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ja", label: "日本語" },
  ];

  // Auto clear alerts after 6 seconds
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), 6000);
    return () => clearTimeout(timer);
  }, [alert]);

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setAlert({ type: "error", message: "Vui lòng nhập họ và tên của bạn." });
      return;
    }

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setAlert({ type: "error", message: "Vui lòng nhập địa chỉ email hợp lệ." });
      return;
    }

    if (cleanPhone && !/^[0-9+() -]{9,15}$/.test(cleanPhone)) {
      setAlert({ type: "error", message: "Số điện thoại không đúng định dạng." });
      return;
    }

    if (password.length < 6) {
      setAlert({ type: "error", message: "Mật khẩu phải có tối thiểu 6 ký tự." });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Xác nhận mật khẩu không trùng khớp." });
      return;
    }

    if (!agreedTerms) {
      setAlert({
        type: "error",
        message: "Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.",
      });
      return;
    }

    setLoading(true);

    try {
      // If Supabase is available
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
            },
          },
        });
        if (error) {
          throw new Error(error.message);
        }
      }

      // Save local user profile
      const newUser: StoredUser = {
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: "Thành viên thân thiết",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("huesmart-user", JSON.stringify(newUser));
      localStorage.setItem("huesmart-demo-user", cleanEmail);
      setCurrentUser(newUser);

      // Đồng bộ ngay lập tức vào Quản lý người dùng hệ thống Admin (/admin)
      recordUserRegistration({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: "Du khách",
        source: "online_signup",
      });

      setAlert({
        type: "success",
        message: `Chào mừng ${cleanName}! Tài khoản HueSmart của bạn đã được tạo thành công.`,
      });

      // Clear sensitive form fields
      setPassword("");
      setConfirmPassword("");

      // Redirect after 1.5s
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err?.message || "Không thể tạo tài khoản. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setAlert({ type: "error", message: "Vui lòng nhập email hợp lệ." });
      return;
    }

    if (password.length < 6) {
      setAlert({ type: "error", message: "Mật khẩu phải có ít nhất 6 ký tự." });
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });
        if (error) throw new Error(error.message);
      }

      // Check existing user or construct from email
      let userObj: StoredUser = {
        fullName: cleanEmail.split("@")[0].toUpperCase(),
        email: cleanEmail,
        role: "Thành viên thân thiết",
      };

      try {
        const existing = localStorage.getItem("huesmart-user");
        if (existing) {
          const parsed = JSON.parse(existing);
          if (parsed.email === cleanEmail) {
            userObj = parsed;
          }
        }
      } catch {
        // fallback
      }

      localStorage.setItem("huesmart-user", JSON.stringify(userObj));
      localStorage.setItem("huesmart-demo-user", cleanEmail);
      setCurrentUser(userObj);

      setAlert({
        type: "success",
        message: `Chào mừng bạn quay trở lại, ${userObj.fullName}!`,
      });

      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err?.message || "Email hoặc mật khẩu không chính xác.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Social Login (Demo simulation)
  const handleSocialLogin = (provider: "Google" | "Facebook" | "Apple") => {
    setLoading(true);
    setAlert({ type: "info", message: `Đang kết nối xác thực qua ${provider}...` });

    setTimeout(() => {
      const demoEmail = `guest.${provider.toLowerCase()}@huesmart.vn`;
      const newUser: StoredUser = {
        fullName: `Khách du lịch (${provider})`,
        email: demoEmail,
        role: "Thành viên thân thiết",
      };
      localStorage.setItem("huesmart-user", JSON.stringify(newUser));
      localStorage.setItem("huesmart-demo-user", demoEmail);
      setCurrentUser(newUser);

      // Đồng bộ vào Admin User Manager
      recordUserRegistration({
        name: newUser.fullName,
        email: demoEmail,
        role: "Du khách",
        source: "social",
      });

      setLoading(false);
      setAlert({
        type: "success",
        message: `Đăng nhập thành công bằng ${provider}!`,
      });
      setTimeout(() => navigate("/"), 1200);
    }, 900);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("huesmart-user");
    localStorage.removeItem("huesmart-demo-user");
    setCurrentUser(null);
    setAlert({ type: "info", message: "Bạn đã đăng xuất khỏi hệ thống." });
  };

  // Demo autofill helper
  const handleQuickFill = () => {
    setFullName("Nguyễn Hoàng Nam");
    setEmail("hoangnam.hue@gmail.com");
    setPhone("0912 345 678");
    setPassword("HueSmart@2026");
    setConfirmPassword("HueSmart@2026");
    setAgreedTerms(true);
    setAlert({
      type: "info",
      message: "Đã điền mẫu thông tin! Bạn có thể nhấn 'Tạo tài khoản' ngay.",
    });
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setAlert({ type: "error", message: "Vui lòng nhập địa chỉ email hợp lệ để khôi phục." });
      return;
    }
    setForgotSent(true);
  };

  return (
    <div className="auth-viewport">
      {/* Topbar: Imperial Brand Logo & Language Switcher */}
      <header className="auth-topbar">
        <Link to="/" className="auth-brand" title="Về trang chủ HueSmart Travel">
          <div className="auth-brand-icon">
            <HueImperialGateIcon size={38} />
          </div>
          <div className="auth-brand-text">
            <span className="auth-brand-title">HueSmart Travel</span>
            <span className="auth-brand-tagline">DISCOVER THE IMPERIAL CITY</span>
          </div>
        </Link>

        {/* Language selector capsule */}
        <div className="auth-lang-wrapper">
          <button
            type="button"
            className="auth-lang-btn"
            onClick={() => setShowLangDropdown((v) => !v)}
            aria-label="Chọn ngôn ngữ"
            aria-expanded={showLangDropdown}
          >
            <Globe size={16} color="#6b21a8" />
            <span>{currentLang}</span>
            <ChevronDown
              size={14}
              className={`auth-lang-chevron ${showLangDropdown ? "rotate" : ""}`}
            />
          </button>

          {showLangDropdown && (
            <div className="auth-lang-dropdown">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`auth-lang-item ${currentLang === lang.label ? "active" : ""}`}
                  onClick={() => {
                    setCurrentLang(lang.label);
                    setShowLangDropdown(false);
                  }}
                >
                  <span>{lang.label}</span>
                  {currentLang === lang.label && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Container: Left Typography & Right Floating Card */}
      <main className="auth-main-container">
        {/* Left Hero Typography Section */}
        <section className="auth-hero-section">
          <h1 className="auth-script-title">Khám phá Huế</h1>
          <h2 className="auth-serif-title">Cùng HueSmart Travel</h2>

          {/* Decorative Calligraphy Brush Stroke */}
          <div className="auth-brush-stroke-wrap" aria-hidden="true">
            <svg
              className="auth-brush-svg"
              viewBox="0 0 220 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 8.5C48 3.5 125 3 217 7.5C170 10.5 90 12 3 8.5Z"
                fill="url(#brushGrad)"
              />
              <defs>
                <linearGradient id="brushGrad" x1="3" y1="7" x2="217" y2="7" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7e22ce" stopOpacity="0.85" />
                  <stop offset="0.6" stopColor="#a855f7" stopOpacity="0.65" />
                  <stop offset="1" stopColor="#d8b4fe" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <p className="auth-slogan">
            <span>Lưu giữ hành trình,</span>
            <span>lan tỏa vẻ đẹp cố đô</span>
          </p>

          <Link to="/" className="auth-back-link">
            <ArrowLeft size={15} />
            <span>Trở về trang chủ</span>
          </Link>
        </section>

        {/* Right Floating Card */}
        <section className="auth-card-wrap">
          <div className="auth-card">
            {/* If user is already logged in, show user profile view */}
            {currentUser ? (
              <div className="auth-user-profile">
                <div className="auth-user-avatar-lg">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="auth-user-name">{currentUser.fullName}</h3>
                  <div className="auth-user-meta">{currentUser.email}</div>
                  {currentUser.phone && <div className="auth-user-meta">📱 {currentUser.phone}</div>}
                  <span className="auth-user-badge">
                    <ShieldCheck size={14} /> {currentUser.role || "Thành viên thân thiết"}
                  </span>
                </div>

                <div className="auth-user-actions">
                  <Link to="/" className="auth-submit-btn" style={{ textDecoration: "none" }}>
                    <Compass size={18} /> Khám phá Cố Đô ngay
                  </Link>

                  <Link to="/planner" className="auth-btn-secondary">
                    <MapPin size={16} /> Lập kế hoạch du lịch
                  </Link>

                  <Link to="/favorites" className="auth-btn-secondary">
                    <Heart size={16} /> Danh sách yêu thích
                  </Link>

                  <button type="button" onClick={handleLogout} className="auth-btn-secondary">
                    <LogOut size={16} /> Đăng xuất tài khoản
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Avatar Badge with Horizontal Lines */}
                <div className="auth-avatar-row">
                  <div className="auth-avatar-line" />
                  <div className="auth-avatar-badge">
                    <User size={24} />
                  </div>
                  <div className="auth-avatar-line" />
                </div>

                {/* Card Title & Subtitle */}
                <h2 className="auth-title">
                  {mode === "register" ? "Tạo tài khoản" : "Đăng nhập"}
                </h2>
                <p className="auth-subtitle">
                  {mode === "register"
                    ? "Bắt đầu hành trình khám phá Huế cùng chúng tôi!"
                    : "Chào mừng bạn quay lại với HueSmart Travel!"}
                </p>

                {/* Status Alert Banner */}
                {alert && (
                  <div className={`auth-alert ${alert.type}`} role="alert">
                    {alert.type === "success" && <CheckCircle2 size={16} className="shrink-0" />}
                    {alert.type === "error" && <AlertCircle size={16} className="shrink-0" />}
                    {alert.type === "info" && <ShieldCheck size={16} className="shrink-0" />}
                    <span>{alert.message}</span>
                  </div>
                )}

                {/* Form: Register Mode */}
                {mode === "register" ? (
                  <form className="auth-form" onSubmit={handleRegister} noValidate>
                    {/* Họ và tên */}
                    <div className="auth-input-group">
                      <span className="auth-input-icon">
                        <User size={18} />
                      </span>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        required
                      />
                    </div>

                    {/* Email của bạn */}
                    <div className="auth-input-group">
                      <span className="auth-input-icon">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="auth-input"
                        placeholder="Email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>

                    {/* Số điện thoại */}
                    <div className="auth-input-group">
                      <span className="auth-input-icon">
                        <Phone size={18} />
                      </span>
                      <input
                        type="tel"
                        className="auth-input"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                      />
                    </div>

                    {/* Mật khẩu */}
                    <div className="auth-input-group">
                      <span className="auth-input-icon">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="auth-input"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="auth-input-group">
                      <span className="auth-input-icon">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="auth-input"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Checkbox Đồng ý điều khoản & chính sách */}
                    <label className="auth-terms-row">
                      <input
                        type="checkbox"
                        className="auth-checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                      />
                      <span>
                        Tôi đồng ý với{" "}
                        <button
                          type="button"
                          className="auth-terms-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTermsModal(true);
                          }}
                        >
                          Điều khoản sử dụng
                        </button>{" "}
                        và{" "}
                        <button
                          type="button"
                          className="auth-terms-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPrivacyModal(true);
                          }}
                        >
                          Chính sách bảo mật
                        </button>
                      </span>
                    </label>

                    {/* Submit Button */}
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                      <UserPlus size={18} />
                      <span>{loading ? "Đang xử lý..." : "Tạo tài khoản"}</span>
                    </button>
                  </form>
                ) : (
                  /* Form: Login Mode */
                  <form className="auth-form" onSubmit={handleLogin} noValidate>
                    {/* Email */}
                    <div className="auth-input-group">
                      <span className="auth-input-icon">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="auth-input"
                        placeholder="Email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="auth-input-group">
                      <span className="auth-input-icon">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="auth-input"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="auth-eye-btn"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Remember me & Forgot Password */}
                    <div className="auth-login-extra">
                      <label className="auth-remember-label">
                        <input
                          type="checkbox"
                          className="auth-checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Ghi nhớ đăng nhập</span>
                      </label>

                      <button
                        type="button"
                        className="auth-forgot-btn"
                        onClick={() => setShowForgotModal(true)}
                      >
                        Quên mật khẩu?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                      <LogIn size={18} />
                      <span>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</span>
                    </button>
                  </form>
                )}

                {/* Social Login Divider */}
                <div className="auth-divider">
                  <span>
                    {mode === "register" ? "Hoặc đăng ký bằng" : "Hoặc đăng nhập bằng"}
                  </span>
                </div>

                {/* Social Login Options */}
                <div className="auth-social-row">
                  <button
                    type="button"
                    className="auth-social-btn"
                    onClick={() => handleSocialLogin("Google")}
                    title="Đăng ký bằng Google"
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    className="auth-social-btn"
                    onClick={() => handleSocialLogin("Facebook")}
                    title="Đăng ký bằng Facebook"
                  >
                    <FacebookIcon />
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    className="auth-social-btn"
                    onClick={() => handleSocialLogin("Apple")}
                    title="Đăng ký bằng Apple"
                  >
                    <AppleIcon />
                    <span>Apple</span>
                  </button>
                </div>

                {/* Mode Switch Footer */}
                <div className="auth-switch-footer">
                  {mode === "register" ? (
                    <>
                      <span>Đã có tài khoản?</span>
                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() => {
                          setMode("login");
                          setAlert(null);
                        }}
                      >
                        Đăng nhập &rsaquo;
                      </button>
                    </>
                  ) : (
                    <>
                      <span>Chưa có tài khoản?</span>
                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() => {
                          setMode("register");
                          setAlert(null);
                        }}
                      >
                        Đăng ký ngay &rsaquo;
                      </button>
                    </>
                  )}
                </div>

                {/* Quick Autofill hint for testing */}
                <div className="auth-demo-hint">
                  <button
                    type="button"
                    className="auth-demo-btn"
                    onClick={handleQuickFill}
                  >
                    ⚡ Điền nhanh thông tin mẫu để thử nghiệm
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Modal: Điều khoản sử dụng */}
      {showTermsModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowTermsModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">Điều khoản sử dụng HueSmart Travel</h3>
              <button
                type="button"
                className="auth-modal-close"
                onClick={() => setShowTermsModal(false)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            <div className="auth-modal-body">
              <h4>1. Mục đích và phạm vi dịch vụ</h4>
              <p>
                HueSmart Travel cung cấp nền tảng số hỗ trợ du khách khám phá di sản, văn hóa, ẩm thực
                và lên lịch trình du lịch thông minh tại Quần thể di tích Cố đô Huế và các vùng phụ cận.
              </p>
              <h4>2. Tài khoản người dùng</h4>
              <p>
                Người dùng chịu trách nhiệm bảo mật thông tin đăng nhập cá nhân, không chia sẻ cho bên thứ ba
                và tuân thủ các quy tắc ứng xử văn minh trong cộng đồng du lịch cố đô.
              </p>
              <h4>3. Bảo vệ di sản và cảnh quan</h4>
              <p>
                Chúng tôi khuyến khích du khách tôn trọng di tích lịch sử, bảo vệ môi trường, không vứt rác bừa bãi
                và tuân theo các chỉ dẫn tại các điểm tham quan Hoàng Thành, lăng tẩm và chùa chiền.
              </p>
              <h4>4. Quyền sở hữu trí tuệ</h4>
              <p>
                Mọi nội dung, hình ảnh, bài thuyết minh và bản đồ số trên nền tảng HueSmart Travel đều thuộc quyền
                sở hữu của ban quản trị hoặc các đối tác được cấp phép.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Chính sách bảo mật */}
      {showPrivacyModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowPrivacyModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">Chính sách bảo mật thông tin</h3>
              <button
                type="button"
                className="auth-modal-close"
                onClick={() => setShowPrivacyModal(false)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            <div className="auth-modal-body">
              <h4>1. Thu thập dữ liệu</h4>
              <p>
                Chúng tôi chỉ thu thập thông tin cơ bản như họ tên, email, số điện thoại để tạo tài khoản,
                cá nhân hóa lịch trình du lịch và gửi thông báo quan trọng về các sự kiện lễ hội tại Huế.
              </p>
              <h4>2. Bảo mật thông tin cá nhân</h4>
              <p>
                Mọi dữ liệu tài khoản được mã hóa và lưu trữ an toàn theo tiêu chuẩn bảo mật hiện đại. Chúng tôi
                cam kết không bán hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ đơn vị quảng cáo bên thứ ba nào.
              </p>
              <h4>3. Quyền của người dùng</h4>
              <p>
                Bạn có quyền chỉnh sửa, cập nhật hoặc yêu cầu xóa bỏ tài khoản và dữ liệu cá nhân bất kỳ lúc nào
                trong phần cài đặt tài khoản.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Quên mật khẩu */}
      {showForgotModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">Khôi phục mật khẩu</h3>
              <button
                type="button"
                className="auth-modal-close"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            <div className="auth-modal-body">
              {forgotSent ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <CheckCircle2 size={48} color="#16a34a" style={{ margin: "0 auto 12px" }} />
                  <h4>Đã gửi liên kết khôi phục!</h4>
                  <p>
                    Vui lòng kiểm tra hòm thư <b>{forgotEmail}</b> để nhận hướng dẫn đặt lại mật khẩu mới.
                  </p>
                  <button
                    type="button"
                    className="auth-submit-btn"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                    }}
                    style={{ marginTop: 16 }}
                  >
                    Đã hiểu
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p>
                    Nhập địa chỉ email đăng ký tài khoản của bạn, chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu trong giây lát.
                  </p>
                  <div className="auth-input-group" style={{ margin: "16px 0" }}>
                    <span className="auth-input-icon">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="auth-input"
                      placeholder="ban@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="auth-submit-btn">
                    <Send size={16} /> Gửi liên kết xác nhận
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
