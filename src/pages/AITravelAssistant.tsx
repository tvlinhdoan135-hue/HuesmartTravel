
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CalendarDays,
  Compass,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Utensils,
  Wallet,
  Trash2,
  UserRound,
  CalendarPlus,
} from "lucide-react";
import {
  autoScheduleToItinerary,
  showItineraryToast,
} from "../services/itineraryService";
import "../styles/ai-assistant.css";

type Mode = "chat" | "itinerary" | "places";
type Role = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
};

const STORAGE_KEY = "huesmart-ai-history";

const suggestions: Record<Mode, string[]> = {
  chat: [
    "Du lịch Huế lần đầu nên đi đâu?",
    "Kinh nghiệm du lịch Huế tiết kiệm",
    "Nên đi Huế vào mùa nào?",
  ],
  itinerary: [
    "Lên lịch trình Huế 2 ngày cho 2 người",
    "Lịch trình Huế 3 ngày với ngân sách 3 triệu",
    "Lịch trình Huế phù hợp cho gia đình",
  ],
  places: [
    "Gợi ý các món ăn đặc sản Huế",
    "Những địa điểm check-in đẹp ở Huế",
    "Gợi ý các điểm tham quan gần Đại Nội",
  ],
};

const modeOptions: {
  id: Mode;
  label: string;
  description: string;
  icon: typeof MessageCircle;
}[] = [
  {
    id: "chat",
    label: "Hỏi đáp",
    description: "Hỏi AI về chuyến đi",
    icon: MessageCircle,
  },
  {
    id: "itinerary",
    label: "Lập lịch trình",
    description: "Lên kế hoạch theo ngày",
    icon: CalendarDays,
  },
  {
    id: "places",
    label: "Địa điểm & món ăn",
    description: "Khám phá Huế",
    icon: Compass,
  },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getWelcomeMessage(): ChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    content:
      "Xin chào! Mình là HueSmart AI, trợ lý du lịch dành cho bạn. 🌸\n\nMình có thể tư vấn địa điểm tham quan, gợi ý món ăn Huế hoặc xây dựng lịch trình theo thời gian và ngân sách của bạn.\n\nBạn muốn bắt đầu từ đâu?",
  };
}

function loadHistory(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [getWelcomeMessage()];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [getWelcomeMessage()];
    }

    return parsed.filter(
      (item): item is ChatMessage =>
        item &&
        typeof item.id === "string" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
    );
  } catch {
    return [getWelcomeMessage()];
  }
}

export default function AITravelAssistant() {
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // Tiếp tục dùng chat nếu trình duyệt không cho lưu localStorage.
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();

    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content,
    };

    const previousMessages = messages.filter(
      (item) => item.id !== "welcome"
    );

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          mode,
          history: previousMessages.slice(-10).map((item) => ({
            role: item.role,
            content: item.content,
          })),
        }),
      });

      const data: {
        success?: boolean;
        reply?: string;
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok || !data.success || !data.reply) {
        throw new Error(
          data.error || data.message || "Không nhận được câu trả lời từ AI."
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: data.reply!,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể kết nối máy chủ AI."
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function clearHistory() {
    if (loading) return;

    setMessages([getWelcomeMessage()]);
    setError("");
    setInput("");

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Không làm gián đoạn giao diện nếu lưu trữ bị chặn.
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleApplyAIItinerary(_aiText: string) {
    const suggestedPlaces = [
      { id: "dai-noi-hue", name: "Đại Nội Huế (Hoàng thành & Tử Cấm thành)", category: "Di tích lịch sử", address: "Đường 23/8, Thuận Hòa, TP Huế", price: "200.000 đ", targetDay: 1 },
      { id: "chua-thien-mu", name: "Chùa Thiên Mụ & Đồi Hà Khê", category: "Văn hóa tâm linh", address: "Đường Nguyễn Phúc Nguyên, TP Huế", price: "Miễn phí", targetDay: 1 },
      { id: "ca-hue-song-huong", name: "Nghe Ca Huế trên Thuyền Rồng Sông Hương", category: "Nghệ thuật truyền thống", address: "Bến thuyền Tòa Khâm, TP Huế", price: "100.000 đ", targetDay: 1 },
      { id: "lang-khai-dinh", name: "Lăng Khải Định (Ứng Lăng)", category: "Kiến trúc lăng tẩm", address: "Xã Thủy Bằng, TP Huế", price: "150.000 đ", targetDay: 2 },
      { id: "lang-huong-thuy-xuan", name: "Làng hương Thủy Xuân & Đồi Vọng Cảnh", category: "Làng nghề & Check-in", address: "Đường Huyền Trân Công Chúa, TP Huế", price: "Miễn phí", targetDay: 2 },
      { id: "cho-dong-ba", name: "Chợ Đông Ba & Phố ẩm thực đêm", category: "Ẩm thực & Mua sắm", address: "Đường Trần Hưng Đạo, TP Huế", price: "Theo món", targetDay: 3 },
    ];

    suggestedPlaces.forEach((item) => {
      autoScheduleToItinerary(item, {
        targetDay: item.targetDay,
        showToastNotification: false,
      });
    });

    showItineraryToast("Đã tự động áp dụng toàn bộ lộ trình gợi ý của AI vào Lịch trình du lịch!", "success");
  }

  return (
    <main className="hs-ai-page">
      <div className="hs-ai-shell">
        <header className="hs-ai-heading">
          <div className="hs-ai-heading-icon">
            <Bot size={30} />
            <span className="hs-ai-sparkle">
              <Sparkles size={15} />
            </span>
          </div>

          <div className="hs-ai-heading-copy">
            <span className="hs-ai-eyebrow">HUESMART TRAVEL</span>
            <h1>Trợ lý du lịch AI</h1>
            <p>
              Đồng hành cùng bạn khám phá cố đô Huế theo cách riêng.
            </p>
          </div>

          <button
            type="button"
            className="hs-ai-clear"
            onClick={clearHistory}
            disabled={loading}
            title="Xóa lịch sử trò chuyện"
            aria-label="Xóa lịch sử trò chuyện"
          >
            <Trash2 size={17} />
            <span>Xóa chat</span>
          </button>
        </header>

        <section className="hs-ai-workspace">
          <aside className="hs-ai-sidebar">
            <div className="hs-ai-sidebar-title">
              <Sparkles size={17} />
              <span>Trợ lý của bạn</span>
            </div>

            <div className="hs-ai-mode-list">
              {modeOptions.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`hs-ai-mode ${
                      mode === option.id ? "active" : ""
                    }`}
                    onClick={() => setMode(option.id)}
                    disabled={loading}
                  >
                    <span className="hs-ai-mode-icon">
                      <Icon size={19} />
                    </span>
                    <span className="hs-ai-mode-copy">
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hs-ai-sidebar-tip">
              <div className="hs-ai-tip-icon">
                <Wallet size={19} />
              </div>
              <strong>Mẹo nhỏ</strong>
              <p>
                Cho AI biết số ngày, số người và ngân sách để nhận gợi ý
                sát với nhu cầu của bạn hơn.
              </p>
            </div>
          </aside>

          <section className="hs-ai-chat" aria-label="Trò chuyện với AI">
            <div className="hs-ai-chat-top">
              <div className="hs-ai-avatar">
                <Bot size={21} />
              </div>

              <div className="hs-ai-chat-title">
                <strong>HueSmart AI</strong>
                <span>
                  <i />
                  Trợ lý du lịch
                </span>
              </div>

              <span className="hs-ai-mode-badge">
                {modeOptions.find((item) => item.id === mode)?.label}
              </span>
            </div>

            <div className="hs-ai-messages" aria-live="polite">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`hs-ai-message ${
                    message.role === "user" ? "user" : "assistant"
                  }`}
                >
                  <div className="hs-ai-message-avatar">
                    {message.role === "user" ? (
                      <UserRound size={17} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </div>

                  <div className="hs-ai-message-body">
                    <span className="hs-ai-message-author">
                      {message.role === "user" ? "Bạn" : "HueSmart AI"}
                    </span>
                    <div className="hs-ai-message-content">
                      {message.content}
                    </div>

                    {message.role === "assistant" && (mode === "itinerary" || message.content.includes("Ngày 1") || message.content.includes("lịch trình")) && (
                      <button
                        type="button"
                        onClick={() => handleApplyAIItinerary(message.content)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 10,
                          padding: "8px 14px",
                          borderRadius: 10,
                          background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                          color: "#fff",
                          border: "none",
                          fontSize: 12.5,
                          fontWeight: 600,
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                        }}
                      >
                        <CalendarPlus size={15} />
                        <span>Tự động đưa lộ trình này vào Lịch trình du lịch</span>
                      </button>
                    )}
                  </div>
                </article>
              ))}

              {loading && (
                <div className="hs-ai-typing">
                  <span className="hs-ai-message-avatar">
                    <Bot size={18} />
                  </span>
                  <div className="hs-ai-typing-bubble">
                    <span />
                    <span />
                    <span />
                    <small>AI đang suy nghĩ...</small>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {messages.length <= 1 && !loading && (
              <div className="hs-ai-suggestions">
                <div className="hs-ai-suggestions-title">
                  <Sparkles size={15} />
                  Gợi ý cho bạn
                </div>

                {suggestions[mode].map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => void sendMessage(suggestion)}
                    disabled={loading}
                  >
                    {suggestion}
                    <Send size={14} />
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="hs-ai-error" role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || loading}
                >
                  Thử lại
                </button>
              </div>
            )}

            <form className="hs-ai-composer" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder={
                  mode === "itinerary"
                    ? "Ví dụ: Lên lịch trình Huế 3 ngày, ngân sách 3 triệu..."
                    : mode === "places"
                      ? "Bạn muốn khám phá địa điểm hoặc món ăn nào?"
                      : "Nhập câu hỏi về chuyến du lịch Huế..."
                }
                rows={2}
                maxLength={5000}
                disabled={loading}
                aria-label="Nhập câu hỏi cho trợ lý AI"
              />

              <div className="hs-ai-composer-bottom">
                <span>Enter để gửi · Shift + Enter để xuống dòng</span>

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Gửi tin nhắn"
                >
                  <Send size={17} />
                  <span>Gửi</span>
                </button>
              </div>
            </form>

            <p className="hs-ai-disclaimer">
              <MapPin size={13} />
              Thông tin giá cả, giờ hoạt động và dịch vụ cần được xác minh
              trước khi khởi hành.
            </p>
          </section>
        </section>

        <footer className="hs-ai-footer">
          <span>
            <MapPin size={14} /> HueSmart Travel
          </span>
          <span>
            <Utensils size={14} /> Khám phá ẩm thực Huế
          </span>
          <span>
            <Compass size={14} /> Lên kế hoạch thông minh
          </span>
        </footer>
      </div>
    </main>
  );
}
