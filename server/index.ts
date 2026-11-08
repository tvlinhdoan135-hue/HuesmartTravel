import { getTravelFallback } from "./fallback.js";
import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const apiKey = process.env.OPENAI_API_KEY?.trim();

const openai = apiKey
  ? new OpenAI({
      apiKey,
      timeout: 60000,
      maxRetries: 1,
    })
  : null;

app.use(
  cors({
    origin: [
      FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
  }),
);

app.use(express.json({ limit: "100kb" }));

type ChatMode = "chat" | "itinerary" | "places";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message?: string;
  mode?: ChatMode;
  history?: ChatMessage[];
}

const SYSTEM_INSTRUCTIONS = `
Bạn là HueSmart AI, trợ lý du lịch thông minh chuyên về Huế, Việt Nam.

Nhiệm vụ:
- Tư vấn điểm tham quan, ẩm thực, lưu trú và trải nghiệm tại Huế.
- Lập lịch trình du lịch theo số ngày và ngân sách.
- Gợi ý địa điểm theo sở thích của khách.
- Trả lời bằng tiếng Việt, thân thiện, rõ ràng và có cấu trúc.
- Khi lập lịch trình, chia theo ngày và buổi sáng, chiều, tối nếu phù hợp.
- Ghi rõ chi phí là ước tính nếu chưa có dữ liệu giá xác thực.
- Không tự khẳng định giờ mở cửa, giá vé hoặc tình trạng hoạt động hiện tại nếu chưa xác minh.
- Nếu thiếu thông tin, đưa ra gợi ý hợp lý và hỏi thêm khi cần thiết.
`;

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: "HueSmart AI",
    configured: Boolean(openai),
    port: PORT,
    model: process.env.OPENAI_MODEL || "gpt-5.5",
  });
});

app.post(
  "/api/chat",
  async (req: Request<unknown, unknown, ChatRequest>, res: Response) => {
    try {
      const message =
        typeof req.body?.message === "string"
          ? req.body.message.trim()
          : "";

      const mode = req.body?.mode ?? "chat";

      if (!message) {
        res.status(400).json({
          success: false,
          error: "Vui lòng nhập nội dung cần tư vấn.",
        });
        return;
      }

      if (message.length > 5000) {
        res.status(400).json({
          success: false,
          error: "Tin nhắn quá dài. Vui lòng rút ngắn nội dung.",
        });
        return;
      }

      if (!["chat", "itinerary", "places"].includes(mode)) {
        res.status(400).json({
          success: false,
          error: "Chế độ tư vấn không hợp lệ.",
        });
        return;
      }

      if (!openai) {
        res.status(503).json({
          success: false,
          error:
            "Chưa cấu hình OPENAI_API_KEY. Kiểm tra file .env ở thư mục gốc dự án.",
          code: "MISSING_API_KEY",
        });
        return;
      }

      const history: ChatMessage[] = Array.isArray(req.body?.history)
        ? req.body.history
            .filter(
              (item): item is ChatMessage =>
                item !== null &&
                typeof item === "object" &&
                (item.role === "user" ||
                  item.role === "assistant") &&
                typeof item.content === "string",
            )
            .slice(-10)
            .map((item) => ({
              role: item.role,
              content: item.content.slice(0, 3000),
            }))
        : [];

      const modeInstructions: Record<ChatMode, string> = {
        chat: "Trả lời câu hỏi du lịch của người dùng.",
        itinerary:
          "Tập trung lập lịch trình theo ngày, thời gian, địa điểm và ngân sách.",
        places:
          "Tập trung đề xuất và so sánh địa điểm tham quan, ăn uống và trải nghiệm.",
      };

      const conversation = [
        ...history,
        {
          role: "user" as const,
          content: message,
        },
      ];

      const model = process.env.OPENAI_MODEL || "gpt-5.5";

      console.log(`[HueSmart AI] Đang gọi model: ${model}`);

      const response = await openai.responses.create({
        model,
        instructions:
          `${SYSTEM_INSTRUCTIONS}\n\n` +
          `Chế độ hiện tại: ${modeInstructions[mode]}`,
        input: conversation.map((item) => ({
          role: item.role,
          content: item.content,
        })),
      });

      const reply = response.output_text?.trim();

      if (!reply) {
        console.error("[HueSmart AI] API trả về nội dung rỗng.");

        res.status(502).json({
          success: false,
          error: "AI chưa tạo được câu trả lời. Vui lòng thử lại.",
          code: "EMPTY_AI_RESPONSE",
        });
        return;
      }

      console.log("[HueSmart AI] Trả lời thành công.");

      res.json({
        success: true,
        reply,
      });
    } catch (error: unknown) {
      if (error instanceof OpenAI.APIError) {
        const status = error.status || 500;
        const code = String(error.code || error.type || "OPENAI_API_ERROR");

        // Ghi lỗi để chẩn đoán, tuyệt đối không ghi API key.
        console.error("[HueSmart AI] OpenAI API error:", {
          status,
          code,
          message: error.message,
        });

        let friendlyMessage =
          "Dịch vụ AI gặp lỗi. Vui lòng kiểm tra cấu hình API và thử lại.";

        if (status === 401) {
          friendlyMessage =
            "OpenAI từ chối xác thực API key. Hãy kiểm tra key mới trong file .env.";
        } else if (status === 403) {
          friendlyMessage =
            "API key hoặc Project chưa có quyền truy cập tài nguyên/model được yêu cầu.";
        } else if (status === 404) {
          friendlyMessage =
            "Không tìm thấy model hoặc endpoint. Hãy kiểm tra OPENAI_MODEL trong file .env.";
        } else if (status === 429) {
          friendlyMessage =
            "API đang bị giới hạn tốc độ hoặc hết hạn mức. Hãy kiểm tra Usage và Billing của OpenAI.";
        } else if (status >= 500) {
          friendlyMessage =
            "Dịch vụ OpenAI đang gặp sự cố. Vui lòng thử lại sau.";
        }

        res.status(status).json({
          success: false,
          error: friendlyMessage,
          code,
          status,
        });
        return;
      }

      if (error instanceof OpenAI.APIConnectionError) {
        console.error("[HueSmart AI] Lỗi kết nối OpenAI:", error.message);

        res.status(502).json({
          success: false,
          error:
            "Không kết nối được OpenAI. Hãy kiểm tra Internet, proxy hoặc tường lửa trên máy tính.",
          code: "OPENAI_CONNECTION_ERROR",
        });
        return;
      }

      console.error(
        "[HueSmart AI] Lỗi không xác định:",
        error instanceof Error ? error.message : "Unknown error",
      );

      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không xác định ở backend.",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
);

app.listen(PORT, () => {
  console.log(`HueSmart AI backend: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`OpenAI API key: ${openai ? "Đã đọc cấu hình" : "Chưa cấu hình"}`);
  console.log(`Model: ${process.env.OPENAI_MODEL || "gpt-5.5"}`);
});
