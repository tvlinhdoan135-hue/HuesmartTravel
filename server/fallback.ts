
type TravelTopic =
  | "places"
  | "food"
  | "itinerary"
  | "budget"
  | "general";

function detectTopic(message: string): TravelTopic {
  const text = message.toLowerCase();

  if (/ăn gì|món ăn|ẩm thực|bún bò|cơm hến|bánh bèo/.test(text)) {
    return "food";
  }

  if (/lịch trình|mấy ngày|bao nhiêu ngày|đi đâu trước/.test(text)) {
    return "itinerary";
  }

  if (/chi phí|bao nhiêu tiền|ngân sách|tiết kiệm|giá vé/.test(text)) {
    return "budget";
  }

  if (/đại nội|lăng|chùa|thiên mụ|địa điểm|tham quan|đi đâu/.test(text)) {
    return "places";
  }

  return "general";
}

export function getTravelFallback(message: string): string {
  const topic = detectTopic(message);

  switch (topic) {
    case "places":
      return [
        "🏯 Gợi ý khám phá Huế",
        "",
        "• Đại Nội Huế: tìm hiểu kiến trúc và lịch sử triều Nguyễn.",
        "• Chùa Thiên Mụ: tham quan công trình tâm linh nổi tiếng.",
        "• Lăng Khải Định: khám phá kiến trúc kết hợp Á - Âu.",
        "• Sông Hương: phù hợp để thư giãn và ngắm cảnh.",
        "",
        "Bạn nên kiểm tra giờ mở cửa, giá vé và thời tiết trước khi đi.",
        "Bạn thích di tích lịch sử, tâm linh hay thiên nhiên?"
      ].join("\n");

    case "food":
      return [
        "🍜 Gợi ý ẩm thực Huế",
        "",
        "• Bún bò Huế",
        "• Cơm hến",
        "• Bánh bèo, bánh nậm, bánh lọc",
        "• Chè Huế",
        "",
        "Hãy hỏi người bán về thành phần nếu bạn có dị ứng thực phẩm.",
        "Bạn muốn tìm món ăn bình dân hay trải nghiệm đặc sản?"
      ].join("\n");

    case "itinerary":
      return [
        "🗓️ Gợi ý lịch trình Huế 2 ngày",
        "",
        "Ngày 1: Đại Nội Huế → chợ Đông Ba → thưởng thức ẩm thực Huế.",
        "Ngày 2: Lăng Khải Định → chùa Thiên Mụ → ngắm sông Hương.",
        "",
        "Đây là lịch trình tham khảo. Hãy kiểm tra giờ mở cửa và thời gian di chuyển trước khi khởi hành.",
        "Bạn có bao nhiêu ngày và đi cùng bao nhiêu người?"
      ].join("\n");

    case "budget":
      return [
        "💰 Cách lập ngân sách du lịch Huế",
        "",
        "1. Vé tham quan các địa điểm.",
        "2. Ăn uống mỗi ngày.",
        "3. Khách sạn hoặc nơi lưu trú.",
        "4. Chi phí thuê xe, taxi hoặc phương tiện khác.",
        "5. Khoản dự phòng phát sinh.",
        "",
        "Tôi chưa có giá vé hoặc giá dịch vụ theo thời gian thực.",
        "Hãy cho biết số ngày, số người và mức ngân sách để tôi gợi ý cách phân bổ."
      ].join("\n");

    default:
      return [
        "Xin chào! 👋 Tôi là trợ lý tư vấn dự phòng của HueSmart Travel.",
        "",
        "Tôi có thể giúp bạn:",
        "• Khám phá các địa điểm nổi bật ở Huế.",
        "• Tìm hiểu món ăn đặc sản.",
        "• Lên lịch trình du lịch.",
        "• Lập kế hoạch chi phí.",
        "",
        "Hãy thử hỏi: “Tôi nên đi Huế 2 ngày như thế nào?”"
      ].join("\n");
  }
}
