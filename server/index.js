
import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100kb" }));

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;

const travelInstructions = `
Bạn là HueSmart AI, trợ lý du lịch chuyên về Huế, Việt Nam.

NHIỆM VỤ:
1. Trả lời câu hỏi về du lịch Huế bằng tiếng Việt thân thiện, dễ hiểu.
2. Hỗ trợ lập lịch trình theo số ngày, số người, sở thích và ngân sách.
3. Tư vấn di tích, cảnh đẹp, ẩm thực, lưu trú và phương tiện.
4. Trình bày lịch trình theo từng ngày, gồm buổi sáng, buổi trưa,
   buổi chiều và buổi tối khi phù hợp.
5. Nếu người dùng chưa cung cấp ngân sách hoặc thời gian,
   hãy đưa ra gợi ý sơ bộ và hỏi thêm khi cần thiết.

NGUYÊN TẮC:
- Không tự nhận đã đặt phòng, đặt tour hoặc mua vé.
- Không bịa giá vé, giờ mở cửa, tình trạng hoạt động hay thời tiết hiện tại.
- Nếu không chắc thông tin thay đổi theo thời gian, hãy nói rõ cần kiểm tra
  nguồn chính thức trước khi đi.
- Ước tính chi phí phải ghi rõ là tham khảo, không phải báo giá xác nhận.
- Ưu tiên lịch trình hợp lý về vị trí, thời gian và ngân sách.
- Dùng tiêu đề, danh sách và đoạn văn ngắn để dễ đọc.
- Không yêu cầu người dùng gửi mật khẩu, thông tin thanh toán
  hoặc dữ liệu cá nhân nhạy cảm.
`;

const modeInstructions = {
  chat: `
Chế độ: HỎI ĐÁP DU LỊCH.
Trả lời trực tiếp câu hỏi của người dùng.
`,

  itinerary: `
Chế độ: LẬP LỊCH TRÌNH.
Tạo kế hoạch du lịch thực tế theo số ngày và ngân sách.
Nêu điểm đến, hoạt động, gợi ý di chuyển và chi phí tham khảo.
Nếu thiếu dữ liệu, hãy nêu giả định bạn đang sử dụng.
`,

  places: `
Chế độ: TƯ VẤN ĐỊA ĐIỂM VÀ ẨM THỰC.
Gợi ý điểm tham quan, món ăn đặc trưng Huế và cách kết hợp các địa điểm.
Không khẳng định quán đang mở cửa hoặc còn chỗ nếu chưa được xác minh.
`,
};

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    service: "HueSmart AI",
    configured: Boolean(openai),
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        success: false,
        message:
          "Backend chưa có OPENAI_API_KEY. Hãy kiểm tra file .env.",
      });
    }

    const { message, history = [], mode = "chat" } = req.body ?? {};

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Tin nhắn phải có nội dung và không vượt quá 5000 ký tự.",
      });
    }

    if (!["chat", "itinerary", "places"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Chế độ trợ lý không hợp lệ.",
      });
    }

    if (!Array.isArray(history) || history.length > 12) {
      return res.status(400).json({
        success: false,
        message: "Lịch sử trò chuyện không hợp lệ.",
      });
    }

    const validHistory = history
      .filter(
        (item) =>
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string"
      )
      .slice(-12)
      .map((item) => ({
        role: item.role,
        content: item.content.slice(0, 4000),
      }));

    const input = [
      ...validHistory,
      {
        role: "user",
        content: message.trim(),
      },
    ];

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions:
        travelInstructions + "\n" + modeInstructions[mode],
      input,
      max_output_tokens: 1800,
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: "AI chưa tạo được câu trả lời. Vui lòng thử lại.",
      });
    }

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "HueSmart AI error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return res.status(500).json({
      success: false,
      message:
        "Không thể kết nối AI lúc này. Hãy kiểm tra API key, hạn mức API và thử lại.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HueSmart AI backend: http://localhost:${PORT}`);
});
