
import {
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Heart,
  CalendarDays,
  CloudSun,
  Globe,
  ChevronDown,
  Waves,
  MapPinned,
  Zap,
  Users,
  Plus,
  Minus,
  Send,
  Mic,
  Sparkles,
  ShieldCheck,
  Utensils,
  Hotel,
  BriefcaseBusiness,
  Baby,
  Accessibility,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import "../styles/planner.css";

type Choice = {
  label: string;
  description?: string;
  icon?: typeof Waves;
};

const travelStyles: Choice[] = [
  {
    label: "Nhẹ nhàng - thư giãn",
    description: "Đi ít điểm, chill",
    icon: Waves,
  },
  {
    label: "Cân bằng",
    description: "Vừa tham quan vừa nghỉ",
    icon: MapPinned,
  },
  {
    label: "Khám phá nhiều",
    description: "Đi nhiều điểm, tối ưu thời gian",
    icon: Zap,
  },
];

const travelTypes = [
  "Văn hoá – lịch sử",
  "Sinh thái – thiên nhiên",
  "Du lịch cộng đồng",
  "Nghỉ dưỡng",
  "Du lịch trải nghiệm",
  "MICE tham quan",
  "Giáo dục – bảo tàng",
];

const companions = [
  { label: "Một mình", icon: Users },
  { label: "Cặp đôi", icon: Heart },
  { label: "Gia đình", icon: Users },
  { label: "Bạn bè/nhóm bạn", icon: Users },
  { label: "Có trẻ em", icon: Baby },
  { label: "Có người lớn tuổi", icon: Accessibility },
];

const budgets = ["Tiết kiệm", "Trung bình", "Cao cấp/Sang trọng"];

const extraOptions = [
  "Ưu tiên món ăn Huế",
  "Ưu tiên điểm check-in đẹp",
  "Hạn chế đi bộ nhiều",
  "Ưu tiên địa điểm miễn phí",
  "Có thời gian nghỉ trưa",
  "Tránh nơi quá đông người",
];

function ChoiceButton({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`hs-planner-choice ${
        selected ? "is-selected" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Counter({
  label,
  value,
  onChange,
  min = 0,
  max = 30,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="hs-planner-counter">
      <span className="hs-planner-counter-label">{label}</span>

      <div className="hs-planner-counter-control">
        <button
          type="button"
          aria-label={`Giảm ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus size={15} />
        </button>

        <span aria-live="polite">{value}</span>

        <button
          type="button"
          aria-label={`Tăng ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

export default function Planner() {
  const [style, setStyle] = useState("Cân bằng");

  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "Văn hoá – lịch sử",
  ]);

  const [selectedCompanions, setSelectedCompanions] = useState<string[]>([
    "Gia đình",
  ]);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [days, setDays] = useState(1);
  const [departure, setDeparture] = useState("");
  const [budget, setBudget] = useState("Trung bình");
  const [extras, setExtras] = useState<string[]>([]);
  const [showExtras, setShowExtras] = useState(false);
  const [request, setRequest] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [language, setLanguage] = useState("VI");

  const toggleItem = (
    item: string,
    selected: string[],
    setSelected: (value: string[]) => void,
  ) => {
    setSelected(
      selected.includes(item)
        ? selected.filter((value) => value !== item)
        : [...selected, item],
    );
  };

  const buildRequest = () => {
    const dateText = departure
      ? new Date(departure).toLocaleString("vi-VN", {
          dateStyle: "long",
          timeStyle: "short",
        })
      : "Chưa xác định ngày khởi hành";

    return [
      "Hãy lập kế hoạch du lịch khám phá Huế theo thông tin sau:",
      `Phong cách: ${style}.`,
      `Loại hình: ${
        selectedTypes.join(", ") || "Linh hoạt"
      }.`,
      `Người đồng hành: ${
        selectedCompanions.join(", ") || "Chưa chọn"
      }.`,
      `Số lượng: ${adults} người lớn, ${children} trẻ em.`,
      `Thời gian: ${days} ngày.`,
      `Ngày khởi hành: ${dateText}.`,
      `Ngân sách: ${budget}.`,
      `Ưu tiên: ${
        extras.join(", ") || "Không có yêu cầu bổ sung"
      }.`,
      `Yêu cầu riêng: ${
        request.trim() || "Đề xuất lịch trình phù hợp"
      }.`,
    ].join("\n");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (adults + children < 1) {
      setStatusMessage("Vui lòng chọn ít nhất một người tham gia.");
      return;
    }

    setRequest(buildRequest());

    setStatusMessage(
      "Đã tổng hợp yêu cầu chuyến đi. Đây là nội dung yêu cầu để bạn xem lại. Để AI tạo lịch trình thực tế, cần kết nối API backend.",
    );
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <main className="hs-planner-page">
      <header className="hs-planner-header">
        <nav
          className="hs-planner-top-nav"
          aria-label="Điều hướng chính"
        >
          <div className="hs-planner-nav-links">
            <Link to="/">Trang chủ</Link>

            <Link to="/planner" className="active">
              Trợ lý AI
            </Link>

            <Link to="/destinations">Khám phá</Link>

            <Link to="/map">Bản đồ</Link>
          </div>

          <Link
            to="/"
            className="hs-planner-brand"
            aria-label="HueSmart Travel"
          >
            <span className="hs-planner-brand-mark">H</span>

            <span className="hs-planner-brand-text">
              <strong>HỆ THỐNG ỨNG DỤNG AI</strong>
              <small>HỖ TRỢ RA QUYẾT ĐỊNH CHO DU KHÁCH</small>
            </span>
          </Link>

          <div className="hs-planner-header-actions">
            <span className="hs-planner-weather">
              <CloudSun size={27} />
              <span>23°C - 31°C</span>
            </span>

            <button
              type="button"
              className="hs-planner-language"
              onClick={() =>
                setLanguage(language === "VI" ? "EN" : "VI")
              }
              aria-label="Đổi ngôn ngữ hiển thị"
            >
              <Globe size={17} />
              {language}
              <ChevronDown size={15} />
            </button>

            <Link to="/account" className="hs-planner-login">
              Đăng nhập
            </Link>
          </div>
        </nav>

        <nav
          className="hs-planner-service-nav"
          aria-label="Dịch vụ du lịch"
        >
          <Link to="/planner" className="active">
            Lên kế hoạch chuyến đi
          </Link>

          <Link to="/accommodation">Lưu trú</Link>

          <Link to="/shopping">Ăn uống</Link>

          <Link to="/services">Dịch vụ</Link>
        </nav>
      </header>

      <div className="hs-planner-main">
        <motion.form
          className="hs-planner-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <section className="hs-planner-field-section">
            <h2>
              Bạn muốn đi du lịch theo kiểu gì <span>*</span>
            </h2>

            <div className="hs-planner-style-grid">
              {travelStyles.map((item) => {
                const Icon = item.icon ?? Compass;

                return (
                  <ChoiceButton
                    key={item.label}
                    selected={style === item.label}
                    onClick={() => setStyle(item.label)}
                    className="hs-planner-style-choice"
                  >
                    <Icon size={24} className="hs-planner-style-icon" />

                    <span className="hs-planner-style-copy">
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                  </ChoiceButton>
                );
              })}
            </div>
          </section>

          <section className="hs-planner-field-section">
            <h2>
              Loại hình du lịch <span>*</span>
            </h2>

            <div className="hs-planner-pills">
              {travelTypes.map((item) => (
                <ChoiceButton
                  key={item}
                  selected={selectedTypes.includes(item)}
                  onClick={() =>
                    toggleItem(item, selectedTypes, setSelectedTypes)
                  }
                >
                  {item}
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section className="hs-planner-field-section">
            <h2>
              Chuyến đi này bạn đi cùng ai <span>*</span>
            </h2>

            <div className="hs-planner-pills">
              {companions.map((item) => {
                const Icon = item.icon;

                return (
                  <ChoiceButton
                    key={item.label}
                    selected={selectedCompanions.includes(item.label)}
                    onClick={() =>
                      toggleItem(
                        item.label,
                        selectedCompanions,
                        setSelectedCompanions,
                      )
                    }
                  >
                    <Icon size={15} />
                    {item.label}
                  </ChoiceButton>
                );
              })}
            </div>
          </section>

          <section className="hs-planner-trip-details">
            <Counter
              label="Người lớn"
              value={adults}
              min={0}
              onChange={setAdults}
            />

            <Counter
              label="Trẻ em"
              value={children}
              min={0}
              onChange={setChildren}
            />

            <Counter
              label="Thời gian (ngày)"
              value={days}
              min={1}
              max={30}
              onChange={setDays}
            />

            <label className="hs-planner-date-field">
              <span>Ngày khởi hành</span>

              <input
                type="datetime-local"
                value={departure}
                onChange={(event) => setDeparture(event.target.value)}
              />
            </label>
          </section>

          <section className="hs-planner-field-section hs-planner-budget-section">
            <h2>Ngân sách</h2>

            <div className="hs-planner-budget-grid">
              {budgets.map((item) => (
                <ChoiceButton
                  key={item}
                  selected={budget === item}
                  onClick={() => setBudget(item)}
                  className="hs-planner-budget-choice"
                >
                  {item}
                </ChoiceButton>
              ))}
            </div>
          </section>

          <section className="hs-planner-extra-section">
            <button
              type="button"
              className="hs-planner-extra-toggle"
              onClick={() => setShowExtras(!showExtras)}
              aria-expanded={showExtras}
            >
              {showExtras ? <X size={21} /> : <Heart size={21} />}

              <span>Tùy chọn thêm</span>

              <ChevronDown
                size={17}
                className={showExtras ? "rotated" : ""}
              />
            </button>

            {showExtras && (
              <div className="hs-planner-extra-options">
                {extraOptions.map((item) => (
                  <label
                    key={item}
                    className="hs-planner-checkbox"
                  >
                    <input
                      type="checkbox"
                      checked={extras.includes(item)}
                      onChange={() =>
                        toggleItem(item, extras, setExtras)
                      }
                    />

                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          </section>

          <div className="hs-planner-submit-row">
            <button
              type="submit"
              className="hs-planner-generate-button"
            >
              <Sparkles size={18} />
              Tổng hợp yêu cầu chuyến đi
            </button>
          </div>
        </motion.form>

        <div className="hs-planner-privacy">
          <ShieldCheck size={15} />

          <p>
            Hãy hạn chế cung cấp thông tin cá nhân nhạy cảm.
            Thông tin trên giao diện này chưa được gửi đến máy chủ AI.
          </p>
        </div>

        <form
          className="hs-planner-chat"
          onSubmit={(event) => {
            event.preventDefault();

            if (!request.trim()) {
              setStatusMessage("Vui lòng nhập yêu cầu du lịch trước.");
              return;
            }

            setStatusMessage(
              "Yêu cầu đã được ghi nhận trên giao diện. Để AI tạo lịch trình thực tế, cần kết nối API backend.",
            );
          }}
        >
          <input
            value={request}
            onChange={(event) => setRequest(event.target.value)}
            onKeyDown={handleEnter}
            placeholder="Nhấn Enter để xác nhận hoặc nhập thêm yêu cầu..."
            aria-label="Nhập yêu cầu du lịch cho trợ lý AI"
          />

          <button
            type="button"
            className="hs-planner-mic"
            aria-label="Nhập yêu cầu bằng giọng nói chưa kích hoạt"
            title="Nhập giọng nói chưa được kết nối"
          >
            <Mic size={19} />
          </button>

          <button
            type="submit"
            className="hs-planner-send"
            aria-label="Gửi yêu cầu"
          >
            <Send size={18} />
          </button>
        </form>

        {statusMessage && (
          <div className="hs-planner-status" role="status">
            <Sparkles size={18} />

            <div>
              <strong>Trợ lý du lịch</strong>
              <p>{statusMessage}</p>

              {request.trim() && <pre>{request}</pre>}
            </div>

            <button
              type="button"
              onClick={() => setStatusMessage("")}
              aria-label="Đóng thông báo"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="hs-planner-shortcuts">
          <span>
            <Compass size={15} />
            Khám phá Huế
          </span>

          <span>
            <Hotel size={15} />
            Lưu trú
          </span>

          <span>
            <Utensils size={15} />
            Ẩm thực
          </span>

          <span>
            <BriefcaseBusiness size={15} />
            Dịch vụ
          </span>

          <span>
            <CalendarDays size={15} />
            Lịch trình cá nhân
          </span>
        </div>
      </div>
    </main>
  );
}
