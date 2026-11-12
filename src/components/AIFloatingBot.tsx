import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  CalendarPlus,
  RefreshCw,
  Minimize2
} from "lucide-react";
import { autoScheduleToItinerary, showItineraryToast } from "../services/itineraryService";
import "../styles/ai-assistant.css";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "huesmart-ai-widget-history";

const QUICK_SUGGESTIONS = [
  "Lịch trình Huế 2 ngày 1 đêm",
  "Đi Đại Nội nên mặc gì?",
  "Món ngon Huế nhất định phải thử",
  "Gợi ý điểm check-in hoàng hôn đẹp"
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getInitialMessage(): ChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    content: "Xin chào bạn! 🌸 Mình là **HueSmart AI** – Trợ lý du lịch ảo Cố đô Huế.\n\nMình có thể hỗ trợ bạn lên lịch trình, gợi ý quán ngon, góc chụp ảnh đẹp hoặc tư vấn giá vé lăng tẩm. Bạn cần hỗ trợ gì nè?"
  };
}

export default function AIFloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [getInitialMessage()];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, loading]);

  // Client-side smart fallback if server is offline or on production Vercel
  function getSmartFallbackReply(userText: string): string {
    const text = userText.toLowerCase();

    if (/lịch trình|2 ngày|3 ngày|kế hoạch|mấy ngày/.test(text)) {
      return [
        "🗓️ **Gợi ý lịch trình du lịch Huế 2 ngày 1 đêm:**",
        "",
        "• **Ngày 1 (Dấu ấn Cố đô & Hoàng cung):**",
        "  - Sáng (08:00): Tham quan **Đại Nội Huế** (Ngọ Môn, Điện Thái Hòa, Tử Cấm Thành).",
        "  - Trưa (11:30): Thưởng thức Cơm niêu hoặc Bún bò mụ Rơi.",
        "  - Chiều (15:00): Check-in Làng hương Thủy Xuân & Đồi Vọng Cảnh đón hoàng hôn.",
        "  - Tối (19:30): Đi thuyền rồng nghe Ca Huế trên sông Hương và thả hoa đăng.",
        "",
        "• **Ngày 2 (Lăng tẩm & Tâm linh xứ Huế):**",
        "  - Sáng (08:30): Tham quan **Lăng Khải Định** (kiến trúc Á - Âu tinh xảo) hoặc Lăng Tự Đức.",
        "  - Trưa (12:00): Trải nghiệm bánh bèo, nậm, lọc nức tiếng quán Bà Đỏ.",
        "  - Chiều (15:00): Viếng **Chùa Thiên Mụ** cổ kính bên dòng Hương Giang.",
        "",
        "💡 *Mẹo: Bạn có thể vào mục **Lập lịch trình** trên web để lưu trực tiếp nhé!*"
      ].join("\n");
    }

    if (/ăn|món|ẩm thực|bún bò|cơm hến|quán|bánh bèo|chè/.test(text)) {
      return [
        "🍜 **Top món ngon đặc sản Huế không thể bỏ lỡ:**",
        "",
        "1. **Bún bò Huế**: Nước dùng đậm đà hương sả ruốc (Gợi ý: Bún bò Mệ Kéo - 20 Bạch Đằng, Bún bò Bà Tuyết - 47 Nguyễn Công Trứ).",
        "2. **Cơm hến & Bún hến**: Đậm vị cay cay giòn giòn (Gợi ý: Cồn Hến - Vĩ Dạ hoặc Quán Hoa Đông).",
        "3. **Bánh bèo, nậm, lọc**: Vỏ bánh trong veo, tôm thịt thơm nức (Gợi ý: Quán Bà Đỏ - 08 Nguyễn Bỉnh Khiêm).",
        "4. **Chè Huế 20 món**: Chè bột lọc heo quay độc đáo (Gợi ý: Chè Hẻm - 1 Hùng Vương).",
        "",
        "Bạn muốn tìm quán ăn bình dân hay nhà hàng sân vườn sang trọng?"
      ].join("\n");
    }

    if (/mặc gì|trang phục|cổ phục|nhật bình|chụp ảnh/.test(text)) {
      return [
        "📸 **Tư vấn trang phục khi du lịch Huế:**",
        "",
        "• **Khi vào Đại Nội & Lăng tẩm**: Nên mặc trang phục lịch sự, kín đáo (quần/váy dài qua gối).",
        "• **Trải nghiệm Cổ phục Hoàng gia**: Thuê trang phục Cổ phục (áo Nhật Bình, áo Tấc, Áo Dài truyền thống) chụp ảnh cực kỳ tôn dáng và hợp bối cảnh rêu phong cổ kính.",
        "• **Màu sắc lên hình đẹp nhất**: Màu đỏ ruby, vàng hoàng gia, xanh lục bảo hoặc trắng thuần khiết."
      ].join("\n");
    }

    if (/giá vé|vé tham quan|chi phí|tiền/.test(text)) {
      return [
        "🎟️ **Bảng giá vé tham quan di tích Huế (tham khảo):**",
        "",
        "• **Đại Nội (Hoàng Cung)**: 200.000 đ / người lớn | 40.000 đ / trẻ em.",
        "• **Lăng Khải Định / Lăng Tự Đức / Lăng Minh Mạng**: 150.000 đ / lăng.",
        "• **Chùa Thiên Mụ, Đồi Vọng Cảnh**: Miễn phí vé vào cổng.",
        "• **Vé tuyến combo 3 điểm / 4 điểm**: Tiết kiệm từ 15% - 25% giá vé lẻ.",
        "",
        "💡 *Lưu ý: Giờ mở cửa di tích thường từ 07:30 đến 17:30 hàng ngày.*"
      ].join("\n");
    }

    return [
      "Dạ vâng! Mình đã ghi nhận câu hỏi của bạn. ✨",
      "",
      "Xứ Huế mùa này rất đẹp và có vô vàn điều thú vị để khám phá. Bạn có thể cho mình biết bạn dự định đi mấy ngày, đi cùng gia đình hay bạn bè để mình gợi ý chi tiết hơn nhé!",
      "",
      "👉 *Bạn cũng có thể thử hỏi:*",
      "• \"Gợi ý lịch trình 3 ngày\"",
      "• \"Quán ăn ngon gần Đại Nội\"",
      "• \"Các góc check-in chụp ảnh đẹp ở Huế\""
    ].join("\n");
  }

  async function handleSend(customText?: string) {
    const textToSend = (customText ?? input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: createId(),
      role: "user",
      content: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          mode: "chat",
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.reply) {
          setMessages((prev) => [
            ...prev,
            { id: createId(), role: "assistant", content: data.reply }
          ]);
          setLoading(false);
          return;
        }
      }
      throw new Error("Local server not available");
    } catch {
      // Seamless smart response fallback
      setTimeout(() => {
        const fallbackReply = getSmartFallbackReply(textToSend);
        setMessages((prev) => [
          ...prev,
          { id: createId(), role: "assistant", content: fallbackReply }
        ]);
        setLoading(false);
      }, 700);
    }
  }

  function handleQuickSchedule(title: string) {
    autoScheduleToItinerary({
      id: "dai-noi-hue",
      name: title,
      category: "Điểm đến nổi bật",
      address: "Đường 23/8, Thuận Hòa, Thành phố Huế"
    });
    showItineraryToast(`Đã thêm "${title}" vào kế hoạch du lịch!`);
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="hs-bot-floating-container">
        {!isOpen && (
          <div className="hs-bot-bubble-hint" onClick={() => setIsOpen(true)}>
            <span>Bạn cần gợi ý du lịch Huế? Chat với AI nhé!</span>
            <div className="hs-bot-bubble-arrow" />
          </div>
        )}

        <button
          type="button"
          className={`hs-bot-floating-btn ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Trợ lý AI HueSmart"
          title="Mở Trợ lý du lịch AI HueSmart"
        >
          {isOpen ? (
            <X size={26} color="#ffffff" />
          ) : (
            <>
              <div className="hs-bot-pulse" />
              <Sparkles className="hs-bot-icon-sparkle" size={14} />
              <MessageCircle size={28} color="#ffffff" />
              {unreadCount > 0 && <span className="hs-bot-badge">{unreadCount}</span>}
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="hs-bot-window">
          {/* Header */}
          <div className="hs-bot-window-header">
            <div className="hs-bot-header-info">
              <div className="hs-bot-avatar">
                <Sparkles size={18} color="#e6c58c" />
              </div>
              <div>
                <h4 className="hs-bot-title">HueSmart AI</h4>
                <div className="hs-bot-status">
                  <span className="hs-bot-status-dot" />
                  <span>Trợ lý Cố đô • Trực tuyến</span>
                </div>
              </div>
            </div>

            <div className="hs-bot-header-actions">
              <button
                type="button"
                className="hs-bot-action-btn"
                onClick={() => setMessages([getInitialMessage()])}
                title="Xóa đoạn chat làm mới"
              >
                <RefreshCw size={15} />
              </button>
              <button
                type="button"
                className="hs-bot-action-btn"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Quick suggestions row */}
          <div className="hs-bot-quick-chips">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                type="button"
                className="hs-bot-chip"
                onClick={() => handleSend(sug)}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="hs-bot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`hs-bot-message-row ${msg.role === "user" ? "user" : "bot"}`}
              >
                {msg.role === "assistant" && (
                  <div className="hs-bot-msg-avatar">
                    <Sparkles size={14} color="#b78b45" />
                  </div>
                )}

                <div className="hs-bot-msg-bubble">
                  <div className="hs-bot-msg-text">
                    {msg.content.split("\n").map((line, idx) => {
                      if (!line.trim()) return <br key={idx} />;

                      // Render bold text nicely
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={idx} style={{ margin: "3px 0" }}>
                          {parts.map((p, pIdx) => {
                            if (p.startsWith("**") && p.endsWith("**")) {
                              return <strong key={pIdx}>{p.slice(2, -2)}</strong>;
                            }
                            return p;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {msg.role === "assistant" && msg.content.includes("Đại Nội") && (
                    <div className="hs-bot-msg-actions">
                      <button
                        type="button"
                        className="hs-bot-msg-btn"
                        onClick={() => handleQuickSchedule("Đại Nội Huế")}
                      >
                        <CalendarPlus size={13} />
                        <span>Thêm Đại Nội vào Lịch trình</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="hs-bot-message-row bot">
                <div className="hs-bot-msg-avatar">
                  <Sparkles size={14} color="#b78b45" />
                </div>
                <div className="hs-bot-msg-bubble loading">
                  <div className="hs-bot-typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Footer */}
          <form
            className="hs-bot-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="hs-bot-input"
              placeholder="Nhắn tin hỏi AI về Huế..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="hs-bot-send-btn"
              disabled={loading || !input.trim()}
              title="Gửi"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
