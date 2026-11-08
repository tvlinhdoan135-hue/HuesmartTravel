/**
 * HUESMART TRAVEL - ITINERARY & AUTO-SCHEDULING SERVICE
 * Dịch vụ tự động lên lịch trình du lịch thông minh
 */

export const ITINERARY_STORAGE_KEY = "huesmart-demo-itinerary";
export const PENDING_DESTINATION_KEY = "huesmart-pending-itinerary-destination";

export type Interest = "Văn hóa" | "Ẩm thực" | "Check-in" | "Nghỉ dưỡng";

export interface Activity {
  destinationId: string;
  time: string;
  note: string;
  estimatedCost: number;
  completed?: boolean;
  customName?: string;
  customCategory?: string;
  customAddress?: string;
  customImage?: string;
  customPrice?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ExpenseItem {
  id: string;
  category: "Ăn uống" | "Khách sạn" | "Di chuyển" | "Khác";
  amount: number;
  note: string;
}

export interface SavedTrip {
  tripName?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  interests: Interest[];
  budget: number;
  days: ItineraryDay[];
  checklist?: ChecklistItem[];
  expenses?: ExpenseItem[];
}

export interface SchedulableItem {
  id: string;
  name: string;
  category?: string;
  image?: string;
  address?: string;
  price?: string | number;
  duration?: string;
  rating?: number;
  date?: string;
  time?: string;
  dayIndex?: number;
  note?: string;
}

const DEFAULT_TITLES = [
  "Khám phá di sản cố đô",
  "Trải nghiệm Huế thơ mộng",
  "Thư giãn và khám phá ẩm thực",
  "Khám phá thiên nhiên xứ Huế",
  "Khép lại hành trình đáng nhớ",
  "Hành trình di sản mở rộng",
  "Khám phá đầm phá và biển cả",
];

function getTodayFormatted(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parsePriceToNumber(price: string | number | undefined): number {
  if (typeof price === "number") return price;
  if (!price) return 0;
  const text = String(price).toLowerCase();
  if (
    text.includes("miễn phí") ||
    text.includes("liên hệ") ||
    text.includes("theo món") ||
    text.includes("chưa cập nhật")
  ) {
    return 0;
  }
  const match = text.match(/[\d.]+/g);
  if (!match?.length) return 0;
  const nums = match.map((n) => Number(n.replace(/\./g, ""))).filter(Number.isFinite);
  return nums.length ? Math.min(...nums) : 0;
}

/**
 * Đọc lịch trình hiện tại từ localStorage hoặc tạo mới nếu chưa có
 */
export function getSavedItinerary(): SavedTrip {
  try {
    const raw = localStorage.getItem(ITINERARY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  // Khởi tạo lịch trình 3 ngày mặc định
  const start = getTodayFormatted();
  const end = addDaysToDate(start, 2);

  return {
    tripName: "Hành trình khám phá Cố đô Huế",
    startDate: start,
    endDate: end,
    travelers: 2,
    interests: ["Văn hóa", "Ẩm thực"],
    budget: 5000000,
    days: [
      {
        day: 1,
        date: start,
        title: DEFAULT_TITLES[0],
        activities: [],
      },
      {
        day: 2,
        date: addDaysToDate(start, 1),
        title: DEFAULT_TITLES[1],
        activities: [],
      },
      {
        day: 3,
        date: end,
        title: DEFAULT_TITLES[2],
        activities: [],
      },
    ],
    checklist: [
      { id: "c-1", text: "CCCD / Giấy tờ tùy thân", completed: false },
      { id: "c-2", text: "Trang phục lịch sự khi viếng Đại Nội & Lăng tẩm", completed: false },
      { id: "c-3", text: "Mũ / nón lá / ô che nắng", completed: false },
      { id: "c-4", text: "Thuốc tiêu hóa / thuốc cá nhân", completed: false },
      { id: "c-5", text: "Máy ảnh / sạc dự phòng", completed: false },
    ],
    expenses: [],
  };
}

/**
 * Lưu lịch trình vào localStorage và thông báo toàn app
 */
export function saveItinerary(trip: SavedTrip): void {
  try {
    localStorage.setItem(ITINERARY_STORAGE_KEY, JSON.stringify(trip));
    window.dispatchEvent(new CustomEvent("huesmart-itinerary-updated", { detail: trip }));
  } catch (error) {
    console.error("Lỗi khi lưu lịch trình:", error);
  }
}

/**
 * Tự động tính toán khung giờ phù hợp dựa trên danh mục địa điểm
 */
function determineBestTimeSlot(category: string | undefined, existingActivities: Activity[]): string {
  const cat = (category || "").toLowerCase();
  const takenTimes = new Set(existingActivities.map((a) => a.time));

  let preferredTimes = ["09:00", "14:00", "16:00", "11:30", "18:30"];

  if (cat.includes("ẩm thực") || cat.includes("ăn uống") || cat.includes("nhà hàng") || cat.includes("quán")) {
    preferredTimes = ["11:30", "18:30", "07:30", "15:30", "20:00"];
  } else if (cat.includes("lễ hội") || cat.includes("sự kiện") || cat.includes("nghệ thuật") || cat.includes("ca huế") || cat.includes("đêm")) {
    preferredTimes = ["19:00", "19:30", "20:00", "16:00", "09:00"];
  } else if (cat.includes("di tích") || cat.includes("đại nội") || cat.includes("lăng") || cat.includes("chùa") || cat.includes("văn hóa")) {
    preferredTimes = ["08:30", "09:00", "14:00", "15:00", "10:30"];
  } else if (cat.includes("khách sạn") || cat.includes("lưu trú") || cat.includes("resort") || cat.includes("homestay")) {
    preferredTimes = ["14:00", "12:00", "08:00", "18:00"];
  }

  for (const time of preferredTimes) {
    if (!takenTimes.has(time)) {
      return time;
    }
  }

  // Nếu các giờ quen thuộc đã có, tự động tạo giờ kế tiếp
  const lastTime = existingActivities[existingActivities.length - 1]?.time || "08:00";
  const [h, m] = lastTime.split(":").map(Number);
  const nextH = Math.min(21, (h || 8) + 2);
  const candidate = `${String(nextH).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
  return candidate;
}

export interface ScheduleResult {
  success: boolean;
  dayNumber: number;
  time: string;
  message: string;
  alreadyExists: boolean;
  trip: SavedTrip;
}

/**
 * HÀM CỐT LÕI: TỰ ĐỘNG THÊM ĐỊA ĐIỂM / TRẢI NGHIỆM / TOUR / SỰ KIỆN VÀO LỊCH TRÌNH
 */
export function autoScheduleToItinerary(
  item: SchedulableItem,
  options: {
    targetDay?: number; // 1-based day number (e.g. 1, 2, 3)
    customTime?: string;
    note?: string;
    showToastNotification?: boolean;
  } = {}
): ScheduleResult {
  const trip = getSavedItinerary();

  // Kiểm tra xem địa điểm này đã có trong lịch trình chưa
  for (let d = 0; d < trip.days.length; d++) {
    const existing = trip.days[d].activities.find((a) => a.destinationId === item.id);
    if (existing) {
      const msg = `"${item.name}" đã có trong Lịch trình (Ngày ${d + 1} - ${existing.time}).`;
      if (options.showToastNotification !== false) {
        showItineraryToast(msg, "info");
      }
      return {
        success: true,
        dayNumber: d + 1,
        time: existing.time,
        message: msg,
        alreadyExists: true,
        trip,
      };
    }
  }

  // Xác định ngày muốn thêm vào:
  // Nếu có targetDay chỉ định -> dùng ngày đó.
  // Nếu không -> chọn ngày có ít hoạt động nhất để phân bổ cân đối chuyến đi!
  let targetIndex = 0;
  if (options.targetDay && options.targetDay >= 1 && options.targetDay <= trip.days.length) {
    targetIndex = options.targetDay - 1;
  } else {
    let minActivities = Infinity;
    trip.days.forEach((day, index) => {
      if (day.activities.length < minActivities) {
        minActivities = day.activities.length;
        targetIndex = index;
      }
    });
  }

  // Đảm bảo target day tồn tại
  if (!trip.days[targetIndex]) {
    trip.days.push({
      day: trip.days.length + 1,
      date: addDaysToDate(trip.startDate, trip.days.length),
      title: DEFAULT_TITLES[trip.days.length % DEFAULT_TITLES.length],
      activities: [],
    });
    targetIndex = trip.days.length - 1;
  }

  const targetDay = trip.days[targetIndex];
  const time = options.customTime || item.time || determineBestTimeSlot(item.category, targetDay.activities);
  const cost = parsePriceToNumber(item.price) * (trip.travelers || 2);

  const newActivity: Activity = {
    destinationId: item.id,
    time,
    note: options.note || item.note || `Lên lịch khám phá ${item.name} (${item.category || "Điểm đến"}).`,
    estimatedCost: cost,
    completed: false,
    customName: item.name,
    customCategory: item.category,
    customAddress: item.address,
    customImage: item.image,
    customPrice: String(item.price || ""),
  };

  targetDay.activities.push(newActivity);
  targetDay.activities.sort((a, b) => a.time.localeCompare(b.time));

  // Tự động thêm vào chi phí dự kiến nếu có giá
  if (cost > 0) {
    if (!trip.expenses) trip.expenses = [];
    const expenseCategory = (item.category || "").toLowerCase().includes("ẩm thực")
      ? "Ăn uống"
      : (item.category || "").toLowerCase().includes("khách sạn")
      ? "Khách sạn"
      : "Khác";

    trip.expenses.push({
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: expenseCategory,
      amount: cost,
      note: `Vé / Phí tham quan: ${item.name}`,
    });
  }

  // Lưu lịch trình
  saveItinerary(trip);

  const dayNumber = targetIndex + 1;
  const successMsg = `Đã tự động thêm "${item.name}" vào Lịch trình Ngày ${dayNumber} (${time})!`;

  if (options.showToastNotification !== false) {
    showItineraryToast(successMsg, "success");
  }

  return {
    success: true,
    dayNumber,
    time,
    message: successMsg,
    alreadyExists: false,
    trip,
  };
}

/**
 * Tự động thêm cả một Tour du lịch (với tất cả các điểm dừng) vào Lịch trình
 */
export function scheduleTourToItinerary(tour: {
  id: string | number;
  name: string;
  price?: string | number;
  image?: string;
  itinerary?: Array<{ time?: string; title: string; description?: string; location?: string }>;
  duration?: string;
}): ScheduleResult {
  const trip = getSavedItinerary();
  const travelers = trip.travelers || 2;
  const tourCost = parsePriceToNumber(tour.price) * travelers;

  // Tìm ngày phù hợp
  let targetIndex = 0;
  let minActivities = Infinity;
  trip.days.forEach((day, index) => {
    if (day.activities.length < minActivities) {
      minActivities = day.activities.length;
      targetIndex = index;
    }
  });

  const targetDay = trip.days[targetIndex];

  // Thêm hoạt động Tour chính
  const mainTourActivity: Activity = {
    destinationId: `tour-${tour.id}`,
    time: "08:00",
    note: `Tham gia ${tour.name} (${tour.duration || "Trọn gói"}).`,
    estimatedCost: tourCost,
    completed: false,
    customName: tour.name,
    customCategory: "Tour du lịch",
    customAddress: "Khởi hành tại Huế",
    customImage: tour.image,
    customPrice: String(tour.price || ""),
  };

  targetDay.activities.push(mainTourActivity);

  // Nếu tour có các điểm dừng chi tiết trong itinerary, thêm tiếp các mốc giờ
  if (Array.isArray(tour.itinerary) && tour.itinerary.length > 0) {
    tour.itinerary.forEach((stop, i) => {
      const stopTime = stop.time || (i === 0 ? "09:30" : i === 1 ? "11:30" : i === 2 ? "14:30" : "16:30");
      targetDay.activities.push({
        destinationId: `tour-stop-${tour.id}-${i}`,
        time: stopTime,
        note: `[Điểm dừng Tour] ${stop.title}: ${stop.description || ""}`,
        estimatedCost: 0, // Đã tính trong gói tour
        completed: false,
        customName: stop.title,
        customCategory: "Điểm dừng Tour",
        customAddress: stop.location || "TP Huế",
        customImage: tour.image,
      });
    });
  }

  targetDay.activities.sort((a, b) => a.time.localeCompare(b.time));

  // Ghi nhận chi phí tour
  if (tourCost > 0) {
    if (!trip.expenses) trip.expenses = [];
    trip.expenses.push({
      id: `exp-tour-${Date.now()}`,
      category: "Khác",
      amount: tourCost,
      note: `Đặt tour: ${tour.name} (${travelers} khách)`,
    });
  }

  saveItinerary(trip);

  const dayNumber = targetIndex + 1;
  const msg = `Đã tự động thêm toàn bộ "${tour.name}" vào Lịch trình Ngày ${dayNumber}!`;
  showItineraryToast(msg, "success");

  return {
    success: true,
    dayNumber,
    time: "08:00",
    message: msg,
    alreadyExists: false,
    trip,
  };
}

/**
 * Hiển thị Toast thông báo tương tác khi tự động lên lịch
 */
export function showItineraryToast(message: string, type: "success" | "info" | "error" = "success") {
  // Dispatch custom window event
  window.dispatchEvent(
    new CustomEvent("huesmart-toast", {
      detail: {
        message,
        type,
        actionLabel: "Xem Lịch Trình",
        actionUrl: "/planner",
      },
    })
  );

  // Tạo visual fallback toast trên DOM nếu chưa có ToastContainer
  let toastContainer = document.getElementById("huesmart-global-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "huesmart-global-toast-container";
    toastContainer.style.position = "fixed";
    toastContainer.style.bottom = "24px";
    toastContainer.style.right = "24px";
    toastContainer.style.zIndex = "99999";
    toastContainer.style.display = "flex";
    toastContainer.style.flexDirection = "column";
    toastContainer.style.gap = "10px";
    toastContainer.style.pointerEvents = "none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.style.pointerEvents = "auto";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "12px";
  toast.style.padding = "14px 20px";
  toast.style.borderRadius = "14px";
  toast.style.boxShadow = "0 12px 35px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)";
  toast.style.fontFamily = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "600";
  toast.style.color = "#ffffff";
  toast.style.background =
    type === "success"
      ? "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)"
      : type === "info"
      ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
      : "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)";
  toast.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
  toast.style.transform = "translateY(20px) scale(0.95)";
  toast.style.opacity = "0";

  toast.innerHTML = `
    <span style="font-size: 18px;">${type === "success" ? "✨" : type === "info" ? "ℹ️" : "⚠️"}</span>
    <span style="flex: 1;">${message}</span>
    <a href="/planner" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; background: rgba(255, 255, 255, 0.2); hover: background: rgba(255, 255, 255, 0.3); color: #fff; text-decoration: none; border-radius: 8px; font-size: 12.5px; font-weight: 700;">
      Xem Lịch Trình →
    </a>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0) scale(1)";
    toast.style.opacity = "1";
  });

  // Tự ẩn sau 4.5 giây
  setTimeout(() => {
    toast.style.transform = "translateY(10px) scale(0.95)";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}
