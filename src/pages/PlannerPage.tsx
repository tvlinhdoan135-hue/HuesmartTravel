
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Printer,
  RefreshCw,
  Trash2,
  Users,
  Wallet,
  Heart,
  ExternalLink,
  CheckCircle2,
  ClipboardList,
  Copy,
  Search,
  Share2,
  Bookmark,
  Check,
  ChevronRight,
  MoreVertical,
  Plane,
  ChevronDown,
  Utensils,
  Sparkles,
} from "lucide-react";
import {
  getAllDestinations,
  PENDING_ITINERARY_DESTINATION_KEY,
  type TravelItem,
} from "../data";
import "../styles/PlannerPage.css";

type Interest = "Văn hóa" | "Ẩm thực" | "Check-in" | "Nghỉ dưỡng";

type Activity = {
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
};

type ItineraryDay = {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
};

type SavedTrip = {
  tripName?: string;
  startDate: string;
  endDate: string;
  travelers: number;
  interests: Interest[];
  budget: number;
  days: ItineraryDay[];
  checklist?: ChecklistItem[];
  expenses?: ExpenseItem[];
};

type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

type ExpenseItem = {
  id: string;
  category: "Ăn uống" | "Khách sạn" | "Di chuyển" | "Khác";
  amount: number;
  note: string;
};

const STORAGE_KEY = "huesmart-demo-itinerary";
const FAVORITES_KEY = "huesmart-favorites";

const INTERESTS: Interest[] = [
  "Văn hóa",
  "Ẩm thực",
  "Check-in",
  "Nghỉ dưỡng",
];

const DAY_TITLES = [
  "Khám phá di sản cố đô",
  "Trải nghiệm Huế thơ mộng",
  "Thư giãn và khám phá ẩm thực",
  "Khám phá thiên nhiên xứ Huế",
  "Khép lại hành trình đáng nhớ",
];

const TIME_SLOTS = ["08:00", "10:00", "14:00", "16:00", "18:00"];
const MAP_MARKER_POSITIONS = [
  { left: "24%", top: "26%" },
  { left: "68%", top: "22%" },
  { left: "76%", top: "68%" },
  { left: "42%", top: "73%" },
  { left: "20%", top: "62%" },
];

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "id-card", text: "CCCD hoặc giấy tờ tùy thân", completed: false },
  { id: "clothes", text: "Quần áo và đồ dùng cá nhân", completed: false },
  { id: "charger", text: "Điện thoại và bộ sạc", completed: false },
  { id: "medicine", text: "Thuốc và vật dụng y tế cần thiết", completed: false },
  { id: "booking", text: "Kiểm tra đặt phòng và vé", completed: false },
];

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBudgetInput(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function parsePrice(price: string): number {
  const text = String(price ?? "").toLowerCase();

  if (
    text.includes("miễn phí") ||
    text.includes("liên hệ") ||
    text.includes("theo món") ||
    text.includes("chưa cập nhật")
  ) {
    return 0;
  }

  const numbers = text.match(/[\d.]+/g);

  if (!numbers?.length) return 0;

  const values = numbers
    .map((number) => Number(number.replace(/\./g, "")))
    .filter(Number.isFinite);

  return values.length ? Math.min(...values) : 0;
}

function addDays(date: string, amount: number) {
  const result = new Date(`${date}T12:00:00`);
  result.setDate(result.getDate() + amount);

  const year = result.getFullYear();
  const month = String(result.getMonth() + 1).padStart(2, "0");
  const day = String(result.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  if (!date) return "Chưa chọn ngày";

  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function getDayCount(startDate: string, endDate: string) {
  if (!startDate || !endDate || endDate < startDate) return 1;

  const difference =
    new Date(`${endDate}T12:00:00`).getTime() -
    new Date(`${startDate}T12:00:00`).getTime();

  return Math.max(1, Math.round(difference / 86400000) + 1);
}

function getInterestScore(item: TravelItem, interests: Interest[]) {
  const text =
    `${item.name} ${item.category} ${item.description} ${item.address}`.toLowerCase();

  let score = item.rating || 0;

  if (
    interests.includes("Văn hóa") &&
    /di tích|tâm linh|văn hóa|đình|đại nội|kinh thành|lăng|chùa|nhà thờ|ga huế|kỳ đài/.test(text)
  ) {
    score += 5;
  }

  if (
    interests.includes("Ẩm thực") &&
    /ẩm thực|chợ|ăn uống|đặc sản|bún|bánh|món ăn|nhà hàng/.test(text)
  ) {
    score += 5;
  }

  if (
    interests.includes("Check-in") &&
    /thiên nhiên|biển|núi|đồi|sông|cầu|thác|đầm|phá|cảnh|vườn/.test(text)
  ) {
    score += 5;
  }

  if (
    interests.includes("Nghỉ dưỡng") &&
    /suối nước nóng|biển|sinh thái|lăng cô|thanh tân|tam giang|vọng cảnh/.test(text)
  ) {
    score += 5;
  }

  return score;
}

function getEstimatedCost(item: TravelItem, travelers: number) {
  return parsePrice(item.price) * travelers;
}

function createDemoItinerary(
  allDestinations: TravelItem[],
  startDate: string,
  dayCount: number,
  travelers: number,
  interests: Interest[],
): ItineraryDay[] {
  const maxPlaces = Math.min(dayCount * 3, allDestinations.length);

  const ranked = [...allDestinations].sort((a, b) => {
    const scoreDifference =
      getInterestScore(b, interests) - getInterestScore(a, interests);

    if (scoreDifference !== 0) return scoreDifference;
    return b.rating - a.rating;
  });

  const selected = ranked.slice(0, maxPlaces);

  const days: ItineraryDay[] = Array.from(
    { length: dayCount },
    (_, index) => ({
      day: index + 1,
      date: addDays(startDate, index),
      title: DAY_TITLES[index % DAY_TITLES.length],
      activities: [],
    }),
  );

  selected.forEach((destination, index) => {
    const dayIndex = index % dayCount;
    const day = days[dayIndex];

    day.activities.push({
      destinationId: destination.id,
      time: TIME_SLOTS[day.activities.length % TIME_SLOTS.length],
      note: `Tham quan ${destination.name}, khám phá nét đặc trưng của Huế.`,
      estimatedCost: getEstimatedCost(destination, travelers),
      completed: false,
    });
  });

  days.forEach((day) => {
    day.activities.sort((a, b) => a.time.localeCompare(b.time));
  });

  return days;
}

function readSavedTrip(): SavedTrip | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SavedTrip;

    if (!Array.isArray(parsed.days) || !Array.isArray(parsed.interests)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export default function PlannerPage() {
  const location = useLocation();
  const allDestinations = useMemo(() => getAllDestinations(), []);
  const [tripName, setTripName] = useState(
    () => readSavedTrip()?.tripName || "Khám phá Huế cổ kính",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState<
    "all" | "active" | "saved" | "completed"
  >("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      return (JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]",
      ) as (string | number)[]).map(String);
    } catch {
      return [];
    }
  });

  const [startDate, setStartDate] = useState(() => {
    const saved = readSavedTrip();
    return saved?.startDate || addDays(new Date().toISOString().slice(0, 10), 1);
  });

  const [endDate, setEndDate] = useState(() => {
    const saved = readSavedTrip();
    return saved?.endDate || addDays(new Date().toISOString().slice(0, 10), 3);
  });

  const [travelers, setTravelers] = useState(
    () => readSavedTrip()?.travelers || 2,
  );

  const [budget, setBudget] = useState(
    () => readSavedTrip()?.budget ?? 3200000,
  );
  const [budgetInput, setBudgetInput] = useState(() =>
    formatBudgetInput(budget),
  );

  const [interests, setInterests] = useState<Interest[]>(
    () => readSavedTrip()?.interests || ["Văn hóa", "Ẩm thực"],
  );

  const [days, setDays] = useState<ItineraryDay[]>(
    () => readSavedTrip()?.days || [],
  );

  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    () => readSavedTrip()?.checklist || DEFAULT_CHECKLIST,
  );

  const [expenses, setExpenses] = useState<ExpenseItem[]>(
    () => readSavedTrip()?.expenses || [],
  );

  const [selectedId, setSelectedId] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);
  const [notice, setNotice] = useState("");
  const [newChecklistText, setNewChecklistText] = useState("");
  const [expenseCategory, setExpenseCategory] =
    useState<ExpenseItem["category"]>("Ăn uống");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseNote, setExpenseNote] = useState("");

  const totalDays = getDayCount(startDate, endDate);

  useEffect(() => {
    if (location.hash !== "#itinerary") return;

    document.getElementById("planner-itinerary")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [location.hash]);

  const plannedIds = useMemo(
    () =>
      new Set(
        days.flatMap((day) =>
          day.activities.map((activity) => activity.destinationId),
        ),
      ),
    [days],
  );

  const plannedDestinations = useMemo(
    () =>
      days.flatMap((day) =>
        day.activities
          .map((activity) => ({
            activity,
            destination: allDestinations.find(
              (item) => item.id === activity.destinationId,
            ) || {
              id: activity.destinationId,
              name: activity.customName || activity.note.replace(/^Tự thêm địa điểm |^Lên lịch khám phá |^Tham gia /i, "") || "Điểm đến Huế",
              category: activity.customCategory || "Trải nghiệm",
              address: activity.customAddress || "Thành phố Huế",
              image: activity.customImage || "/images/hero-banner.jpg",
              price: activity.customPrice || (activity.estimatedCost ? `${activity.estimatedCost.toLocaleString("vi-VN")} đ` : "Miễn phí"),
              rating: 5,
              duration: "2 giờ",
              description: activity.note,
              lat: 16.4637,
              lng: 107.5909,
            },
          }))
          .filter(
            (
              item,
            ): item is { activity: Activity; destination: TravelItem } =>
              Boolean(item.destination),
          ),
      ),
    [days, allDestinations],
  );

  const availableDestinations = allDestinations.filter(
    (item) => !plannedIds.has(item.id),
  );

  const totalCost = plannedDestinations.reduce(
    (sum, item) => sum + item.activity.estimatedCost,
    0,
  );

  const unknownPriceCount = plannedDestinations.filter(
    (item) => parsePrice(item.destination.price) === 0,
  ).length;

  const extraExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = totalCost + extraExpenses;
  const remainingBudget = budget - grandTotal;
  const averagePerPerson = travelers > 0 ? grandTotal / travelers : 0;

  const completedActivities = plannedDestinations.filter(
    (item) => item.activity.completed,
  ).length;

  const completionRate =
    plannedDestinations.length > 0
      ? Math.round((completedActivities / plannedDestinations.length) * 100)
      : 0;

  useEffect(() => {
    try {
      const savedTrip: SavedTrip = {
        tripName,
        startDate,
        endDate,
        travelers,
        interests,
        budget,
        days,
        checklist,
        expenses,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTrip));
    } catch {
      setNotice("Không thể lưu lịch trình trên trình duyệt.");
    }
  }, [tripName, startDate, endDate, travelers, interests, budget, days, checklist, expenses]);

  useEffect(() => {
    let destinationId: string | null;

    try {
      destinationId = localStorage.getItem(
        PENDING_ITINERARY_DESTINATION_KEY,
      );
      if (!destinationId) return;
      localStorage.removeItem(PENDING_ITINERARY_DESTINATION_KEY);
    } catch {
      setNotice("Không thể đọc địa điểm cần thêm vào lịch trình.");
      return;
    }

    const destination = allDestinations.find(
      (item) => item.id === destinationId,
    );

    if (!destination) {
      setNotice("Không tìm thấy địa điểm cần thêm vào lịch trình.");
      return;
    }

    if (
      days.some((day) =>
        day.activities.some(
          (activity) => activity.destinationId === destination.id,
        ),
      )
    ) {
      setNotice(`${destination.name} đã có trong lịch trình.`);
      return;
    }

    setSelectedDay(0);
    setDays((current) => {
      const firstDay = current[0] ?? {
        day: 1,
        date: startDate,
        title: DAY_TITLES[0],
        activities: [],
      };

      const activity: Activity = {
        destinationId: destination.id,
        time: "16:00",
        note: `Đã thêm ${destination.name} từ trang điểm tham quan.`,
        estimatedCost: getEstimatedCost(destination, travelers),
        completed: false,
      };

      const updatedFirstDay = {
        ...firstDay,
        activities: [...firstDay.activities, activity].sort((a, b) =>
          a.time.localeCompare(b.time),
        ),
      };

      return current.length > 0
        ? [updatedFirstDay, ...current.slice(1)]
        : [updatedFirstDay];
    });
    setNotice(`Đã thêm ${destination.name} vào ngày 1 của lịch trình.`);
  }, []);

  useEffect(() => {
    const syncFavorites = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem(FAVORITES_KEY) || "[]",
        ) as (string | number)[];
        setFavoriteIds(saved.map(String));
      } catch {
        setNotice("Không thể đọc danh sách yêu thích.");
      }
    };

    window.addEventListener("storage", syncFavorites);
    window.addEventListener("huesmart-favorites-updated", syncFavorites);

    const syncItinerary = () => {
      const saved = readSavedTrip();
      if (saved && Array.isArray(saved.days)) {
        setDays(saved.days);
        if (saved.tripName) setTripName(saved.tripName);
        if (saved.startDate) setStartDate(saved.startDate);
        if (saved.endDate) setEndDate(saved.endDate);
        if (saved.travelers) setTravelers(saved.travelers);
        if (saved.budget) {
          setBudget(saved.budget);
          setBudgetInput(formatBudgetInput(saved.budget));
        }
        if (saved.checklist) setChecklist(saved.checklist);
        if (saved.expenses) setExpenses(saved.expenses);
        setNotice("Lịch trình đã được tự động cập nhật!");
      }
    };

    window.addEventListener("huesmart-itinerary-updated", syncItinerary);

    return () => {
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener("huesmart-favorites-updated", syncFavorites);
      window.removeEventListener("huesmart-itinerary-updated", syncItinerary);
    };
  }, []);

  useEffect(() => {
    setDays((current) => {
      if (current.length === 0) return current;

      return current.map((day, index) => ({
        ...day,
        day: index + 1,
        date: addDays(startDate, index),
      }));
    });
  }, [startDate]);

  function toggleInterest(interest: Interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  function generateItinerary() {
    if (!startDate || !endDate || endDate < startDate) {
      setNotice("Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.");
      return;
    }

    if (totalDays > 14) {
      setNotice("Bản demo hỗ trợ lịch trình tối đa 14 ngày.");
      return;
    }

    if (allDestinations.length === 0) {
      setNotice("Chưa có dữ liệu địa điểm. Hãy kiểm tra file dữ liệu.");
      return;
    }

    setDays(
      createDemoItinerary(
        allDestinations,
        startDate,
        totalDays,
        travelers,
        interests,
      ),
    );

    setNotice("Đã tạo lịch trình demo từ dữ liệu địa điểm Huế.");
  }

  function addDestination() {
    if (!selectedId) {
      setNotice("Vui lòng chọn một địa điểm.");
      return;
    }

    if (plannedIds.has(selectedId)) {
      setNotice("Địa điểm này đã có trong lịch trình.");
      return;
    }

    const destination = allDestinations.find((item) => item.id === selectedId);

    if (!destination) {
      setNotice("Không tìm thấy địa điểm.");
      return;
    }

    setDays((current) => {
      const result =
        current.length > 0
          ? current.map((day) => ({
              ...day,
              activities: [...day.activities],
            }))
          : [
              {
                day: 1,
                date: startDate,
                title: DAY_TITLES[0],
                activities: [],
              },
            ];

      const targetIndex = Math.min(selectedDay, result.length - 1);

      result[targetIndex].activities.push({
        destinationId: destination.id,
        time: "16:00",
        note: `Tự thêm địa điểm ${destination.name}.`,
        estimatedCost: getEstimatedCost(destination, travelers),
        completed: false,
      });

      result[targetIndex].activities.sort((a, b) =>
        a.time.localeCompare(b.time),
      );

      return result;
    });

    setSelectedId("");
    setNotice(`Đã thêm ${destination.name} vào lịch trình.`);
  }

  function updateActivity(
    destinationId: string,
    changes: Partial<Activity>,
  ) {
    setDays((current) =>
      current.map((day) => ({
        ...day,
        activities: day.activities.map((activity) =>
          activity.destinationId === destinationId
            ? { ...activity, ...changes }
            : activity,
        ),
      })),
    );
  }

  function moveActivityToDay(destinationId: string, targetDayIndex: number) {
    setDays((current) => {
      const next = current.map((day) => ({
        ...day,
        activities: [...day.activities],
      }));

      const sourceIndex = next.findIndex((day) =>
        day.activities.some(
          (activity) => activity.destinationId === destinationId,
        ),
      );

      if (
        sourceIndex < 0 ||
        targetDayIndex < 0 ||
        targetDayIndex >= next.length ||
        sourceIndex === targetDayIndex
      ) {
        return current;
      }

      const source = next[sourceIndex];
      const activityIndex = source.activities.findIndex(
        (activity) => activity.destinationId === destinationId,
      );

      const [activity] = source.activities.splice(activityIndex, 1);
      next[targetDayIndex].activities.push(activity);
      next[targetDayIndex].activities.sort((a, b) =>
        a.time.localeCompare(b.time),
      );

      return next;
    });
  }

  function moveDestination(
    dayIndex: number,
    activityIndex: number,
    direction: -1 | 1,
  ) {
    setDays((current) =>
      current.map((day, index) => {
        if (index !== dayIndex) return day;

        const activities = [...day.activities];
        const nextIndex = activityIndex + direction;

        if (nextIndex < 0 || nextIndex >= activities.length) return day;

        [activities[activityIndex], activities[nextIndex]] = [
          activities[nextIndex],
          activities[activityIndex],
        ];

        return { ...day, activities };
      }),
    );
  }

  function removeDestination(destinationId: string) {
    setDays((current) =>
      current.map((day) => ({
        ...day,
        activities: day.activities.filter(
          (activity) => activity.destinationId !== destinationId,
        ),
      })),
    );

    setNotice("Đã xóa địa điểm khỏi lịch trình.");
  }

  function removeActivityFromDay(dayIndex: number, activityIndex: number, activityName?: string) {
    setDays((current) =>
      current.map((day, dIdx) => {
        if (dIdx !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.filter((_, aIdx) => aIdx !== activityIndex),
        };
      })
    );

    setNotice(`Đã xóa ${activityName ? `"${activityName}"` : "địa điểm"} khỏi Ngày ${dayIndex + 1}.`);
  }

  function clearDayActivities(dayIndex: number) {
    if (!window.confirm(`Bạn có chắc muốn xóa tất cả địa điểm trong Ngày ${dayIndex + 1}?`)) {
      return;
    }
    setDays((current) =>
      current.map((day, idx) =>
        idx === dayIndex ? { ...day, activities: [] } : day
      )
    );
    setNotice(`Đã xóa tất cả địa điểm trong Ngày ${dayIndex + 1}.`);
  }

  function addDay() {
    if (days.length >= 14) {
      setNotice("Bản demo hỗ trợ tối đa 14 ngày.");
      return;
    }

    const nextNumber = days.length + 1;

    setDays((current) => [
      ...current,
      {
        day: nextNumber,
        date: addDays(startDate, nextNumber - 1),
        title: DAY_TITLES[(nextNumber - 1) % DAY_TITLES.length],
        activities: [],
      },
    ]);

    setEndDate(addDays(startDate, nextNumber - 1));
    setNotice(`Đã thêm ngày ${nextNumber} vào lịch trình.`);
  }

  function removeDay(dayIndex: number) {
    if (days.length <= 1) {
      setNotice("Lịch trình cần có ít nhất một ngày.");
      return;
    }

    if (
      !window.confirm(
        `Xóa ngày ${dayIndex + 1}? Các địa điểm của ngày này sẽ bị xóa khỏi lịch trình.`,
      )
    ) {
      return;
    }

    setDays((current) =>
      current
        .filter((_, index) => index !== dayIndex)
        .map((day, index) => ({
          ...day,
          day: index + 1,
          date: addDays(startDate, index),
        })),
    );

    const nextEndDate = addDays(startDate, days.length - 2);
    setEndDate(nextEndDate);
    setNotice("Đã xóa ngày khỏi lịch trình.");
  }

  function addChecklistItem() {
    const text = newChecklistText.trim();

    if (!text) {
      setNotice("Hãy nhập nội dung cần chuẩn bị.");
      return;
    }

    setChecklist((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        text,
        completed: false,
      },
    ]);

    setNewChecklistText("");
  }

  function addExpense() {
    const amount = Number(expenseAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice("Nhập số tiền hợp lệ lớn hơn 0.");
      return;
    }

    setExpenses((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        category: expenseCategory,
        amount,
        note: expenseNote.trim(),
      },
    ]);

    setExpenseAmount("");
    setExpenseNote("");
    setNotice("Đã thêm khoản chi.");
  }

  function clearItinerary() {
    if (!window.confirm("Bạn có chắc muốn xóa toàn bộ lịch trình hiện tại?")) {
      return;
    }

    setDays([]);
    setExpenses([]);

    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("huesmart-itinerary-updated", { detail: null }));
    } catch {
      // Trạng thái giao diện vẫn được xóa.
    }

    setNotice("Đã xóa lịch trình và các khoản chi.");
  }

  function duplicateItinerary() {
    if (days.length === 0) {
      setNotice("Hãy tạo lịch trình trước khi nhân bản.");
      return;
    }

    const newStartDate = addDays(endDate, 1);
    const newEndDate = addDays(newStartDate, totalDays - 1);

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setDays((current) =>
      current.map((day, index) => ({
        ...day,
        day: index + 1,
        date: addDays(newStartDate, index),
        activities: day.activities.map((activity) => ({
          ...activity,
          completed: false,
        })),
      })),
    );
    setExpenses([]);
    setNotice("Đã nhân bản lịch trình cho chuyến đi mới.");
  }

  function openMap(destination: TravelItem) {
    const query =
      destination.lat != null && destination.lng != null
        ? `${destination.lat},${destination.lng}`
        : destination.name;

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function saveAsFavorite(destination: TravelItem) {
    try {
      const saved = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || "[]",
      ) as (string | number)[];

      const id = /^\d+$/.test(destination.id)
        ? Number(destination.id)
        : destination.id;

      const exists = saved.some(
        (value) => String(value) === destination.id,
      );

      const next = exists
        ? saved.filter((value) => String(value) !== destination.id)
        : [...saved, id];

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      setFavoriteIds(next.map(String));
      window.dispatchEvent(new Event("huesmart-favorites-updated"));

      setNotice(exists ? "Đã bỏ khỏi yêu thích." : "Đã lưu vào yêu thích.");
    } catch {
      setNotice("Không thể cập nhật danh sách yêu thích.");
    }
  }

  async function shareItinerary() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Đã sao chép liên kết lịch trình.");
    } catch {
      setNotice("Không thể sao chép liên kết. Hãy sao chép địa chỉ trang từ thanh trình duyệt.");
    }
  }

  return (
    <main className="planner-page">
      <section className="planner-hero">
        <div className="planner-hero-content">
          <h1>Quản lý lịch trình cá nhân</h1>
          <p>
            Tự do khám phá – Tạo nên hành trình của riêng bạn tại Huế
          </p>
        </div>
      </section>

      <div className="planner-toolbar">
        <label className="planner-search">
          <Search size={18} />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Tìm kiếm địa điểm trong lịch trình..."
            aria-label="Tìm kiếm địa điểm trong lịch trình"
          />
        </label>
        <div className="planner-toolbar-actions">
          <button
            type="button"
            className="planner-primary-button"
            onClick={generateItinerary}
          >
            <Plus size={17} /> Tạo mới
          </button>
          <button
            type="button"
            className={`planner-filter-button ${activityFilter === "active" ? "active" : ""}`}
            onClick={() =>
              setActivityFilter(activityFilter === "active" ? "all" : "active")
            }
          >
            <Clock size={15} /> Đang thực hiện
          </button>
          <button
            type="button"
            className={`planner-filter-button ${activityFilter === "saved" ? "active" : ""}`}
            onClick={() =>
              setActivityFilter(activityFilter === "saved" ? "all" : "saved")
            }
          >
            <Bookmark size={15} /> Đã lưu
          </button>
          <button
            type="button"
            className={`planner-filter-button ${activityFilter === "completed" ? "active" : ""}`}
            onClick={() =>
              setActivityFilter(activityFilter === "completed" ? "all" : "completed")
            }
          >
            <Check size={15} /> Đã hoàn thành
          </button>
        </div>
      </div>

      <div className="planner-layout">
        <aside className="planner-panel planner-form">
          <div className="planner-panel-title">
            <Plane size={21} />
            <h2>Thông tin chuyến đi</h2>
          </div>

          <label className="planner-label" htmlFor="planner-trip-name">
            Tên chuyến đi
          </label>
          <input
            id="planner-trip-name"
            value={tripName}
            onChange={(event) => setTripName(event.target.value)}
            placeholder="Đặt tên cho chuyến đi"
            maxLength={70}
          />

          <label className="planner-label" htmlFor="planner-start">
            <CalendarDays size={17} /> Thời gian
          </label>
          <div className="planner-date-range">
            <input
              id="planner-start"
              type="date"
              value={startDate}
              onChange={(event) => {
                const value = event.target.value;
                setStartDate(value);

                if (!endDate || endDate < value) setEndDate(value);
              }}
            />
            <ChevronRight size={17} aria-hidden="true" />
            <input
              id="planner-end"
              type="date"
              min={startDate}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              aria-label="Ngày kết thúc"
            />
          </div>

          <label className="planner-label" htmlFor="planner-travelers">
            <Users size={17} /> Số lượng người
          </label>
          <select
            id="planner-travelers"
            value={travelers}
            onChange={(event) => {
              const value = Number(event.target.value);
              setTravelers(value);

              setDays((current) =>
                current.map((day) => ({
                  ...day,
                  activities: day.activities.map((activity) => {
                    const destination = allDestinations.find(
                      (item) => item.id === activity.destinationId,
                    );

                    return destination
                      ? {
                          ...activity,
                          estimatedCost: getEstimatedCost(destination, value),
                        }
                      : activity;
                  }),
                })),
              );
            }}
          >
            {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((number) => (
              <option key={number} value={number}>
                {number} người
              </option>
            ))}
          </select>

          <label className="planner-label" htmlFor="planner-budget">
            <Wallet size={17} /> Ngân sách dự kiến
          </label>
          <input
            id="planner-budget"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={budgetInput}
            placeholder="Ví dụ: 3.500.000"
            aria-describedby="planner-budget-hint"
            onChange={(event) => {
              const value = event.target.value;
              setBudgetInput(value);
              const digits = value.replace(/\D/g, "");
              const amount = digits ? Number(digits) : 0;
              if (Number.isSafeInteger(amount)) setBudget(amount);
            }}
            onBlur={() => {
              const digits = budgetInput.replace(/\D/g, "");
              const amount = digits ? Number(digits) : 0;
              if (Number.isSafeInteger(amount)) {
                setBudget(amount);
                setBudgetInput(amount ? formatBudgetInput(amount) : "");
              }
            }}
          />
          <small id="planner-budget-hint" className="planner-budget-input-hint">
            Nhập số tiền tùy ý bằng VND.
          </small>

          <div className="planner-label">Sở thích của bạn</div>
          <div className="planner-interests">
            {INTERESTS.map((interest) => (
              <button
                type="button"
                key={interest}
                className={
                  interests.includes(interest)
                    ? "planner-chip active"
                    : "planner-chip"
                }
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>

          <div className="planner-sidebar-total">
            <Wallet size={23} />
            <div>
              <span>Tổng chi phí dự kiến</span>
              <strong>{formatMoney(grandTotal)}</strong>
              <small>Ngân sách: {formatMoney(budget)}</small>
            </div>
          </div>

          <button
            type="button"
            className="planner-primary-button planner-sidebar-refresh"
            onClick={generateItinerary}
          >
            <RefreshCw size={18} />
            Cập nhật lịch trình
          </button>

          <p className="planner-demo-note">
            Lịch trình gợi ý được tạo từ dữ liệu địa điểm hiện có.
          </p>
        </aside>

        <section
          className="planner-results"
          id="planner-itinerary"
          aria-label="Lịch trình của tôi"
        >
          <div className="planner-results-heading">
            <div>
              <span className="planner-eyebrow">LỊCH TRÌNH CỦA TÔI</span>
              <h2>{tripName || "Khám phá Huế"}</h2>
            </div>

            <div className="planner-heading-actions">
              <button
                type="button"
                className="planner-secondary-button"
                onClick={() =>
                  document.getElementById("planner-trip-name")?.focus()
                }
              >
                <CalendarDays size={16} /> Chỉnh sửa
              </button>
              <button
                type="button"
                className="planner-secondary-button"
                onClick={shareItinerary}
              >
                <Share2 size={16} /> Chia sẻ
              </button>
              <button
                type="button"
                className="planner-secondary-button"
                onClick={() => window.print()}
              >
                <Printer size={16} /> Xuất PDF
              </button>
              <button
                type="button"
                className="planner-icon-button"
                aria-label="Nhân bản lịch trình"
                title="Nhân bản lịch trình"
                onClick={duplicateItinerary}
              >
                <Copy size={16} />
                <MoreVertical size={15} />
              </button>
            </div>
          </div>

          <div className="planner-current-date">
            <span>Ngày {selectedDay + 1}</span>
            <strong>{formatDate(days[selectedDay]?.date || startDate)}</strong>
            <small>{totalDays} ngày · {travelers} người</small>
          </div>

          {notice && (
            <div className="planner-notice" role="status">
              {notice}
            </div>
          )}

          {days.length === 0 ? (
            <div className="planner-empty">
              <CalendarDays size={42} />
              <h3>Bắt đầu lên kế hoạch khám phá Huế</h3>
              <p>
                Chọn ngày đi, số người và sở thích, sau đó nhấn nút tạo
                lịch trình.
              </p>
              <button
                type="button"
                className="planner-primary-button"
                onClick={generateItinerary}
              >
                Tạo lịch trình mẫu
              </button>
            </div>
          ) : (
            days.map((day, dayIndex) => {
              const dayCost = day.activities.reduce(
                (sum, activity) => sum + activity.estimatedCost,
                0,
              );

              return (
                <article
                  className="planner-day-card"
                  key={`${day.day}-${day.date}`}
                >
                  <header className="planner-day-heading">
                    <div className="planner-day-number">
                      <span>Ngày</span>
                      <strong>{day.day}</strong>
                    </div>

                    <div className="planner-day-title">
                      <h3>{day.title}</h3>
                      <p>
                        <CalendarDays size={14} />
                        {formatDate(day.date)}
                      </p>
                    </div>

                    <div className="planner-day-cost">
                      {formatMoney(dayCost)}
                    </div>
                  </header>

                  {day.activities.length === 0 ? (
                    <p className="planner-day-empty">
                      Chưa có địa điểm. Bạn có thể thêm địa điểm ở bên dưới.
                    </p>
                  ) : (
                    <div className="planner-activities">
                      {day.activities.map((activity, activityIndex) => {
                        const destination: TravelItem = allDestinations.find(
                          (item) => item.id === activity.destinationId,
                        ) || {
                          id: activity.destinationId,
                          name: activity.customName || activity.note.replace(/^Tự thêm địa điểm |^Lên lịch khám phá |^Tham gia /i, "") || "Điểm đến Huế",
                          category: activity.customCategory || "Trải nghiệm",
                          address: activity.customAddress || "Thành phố Huế",
                          image: activity.customImage || "/images/hero-banner.jpg",
                          price: activity.customPrice || (activity.estimatedCost ? `${activity.estimatedCost.toLocaleString("vi-VN")} đ` : "Miễn phí"),
                          rating: 5,
                          duration: "2 giờ",
                          description: activity.note,
                          lat: 16.4637,
                          lng: 107.5909,
                        };

                        const query = searchQuery.trim().toLocaleLowerCase("vi");
                        const matchesQuery =
                          !query ||
                          `${destination.name} ${destination.category} ${destination.address}`
                            .toLocaleLowerCase("vi")
                            .includes(query);
                        const matchesFilter =
                          activityFilter === "all" ||
                          (activityFilter === "active" && !activity.completed) ||
                          (activityFilter === "completed" &&
                            activity.completed) ||
                          (activityFilter === "saved" &&
                            favoriteIds.includes(destination.id));

                        if (!matchesQuery || !matchesFilter) return null;

                        const detailLink = destination.id.startsWith("tour-")
                          ? "/tours"
                          : destination.id.startsWith("ev-")
                          ? "/events"
                          : destination.id.startsWith("food-") || destination.id.startsWith("rest-")
                          ? "/services"
                          : `/destinations/${destination.id}`;

                        return (
                          <div
                            className="planner-activity"
                            key={`${day.day}-${destination.id}-${activityIndex}`}
                          >
                            <img
                              src={destination.image}
                              alt={destination.name}
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src =
                                  "/images/hero-banner.jpg";
                              }}
                            />

                            <div className="planner-activity-info">
                              <div className="planner-activity-heading">
                                <span className="planner-activity-time">
                                  <Clock size={14} /> {activity.time}
                                </span>
                                <h4
                                  className={
                                    activity.completed ? "is-completed" : ""
                                  }
                                >
                                  {destination.name}
                                </h4>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                                  <a
                                    className="planner-activity-detail-link"
                                    href={detailLink}
                                  >
                                    Chi tiết <ChevronRight size={14} />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeActivityFromDay(dayIndex, activityIndex, destination.name);
                                    }}
                                    title={`Xóa "${destination.name}" khỏi Ngày ${dayIndex + 1}`}
                                    aria-label={`Xóa ${destination.name}`}
                                    style={{
                                      background: "#fee2e2",
                                      color: "#ef4444",
                                      border: "1px solid #fca5a5",
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "8px",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = "#ef4444";
                                      e.currentTarget.style.color = "#ffffff";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = "#fee2e2";
                                      e.currentTarget.style.color = "#ef4444";
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <p className="planner-address">
                                <MapPin size={13} />
                                {destination.address}
                              </p>

                              <details className="planner-activity-edit">
                                <summary>
                                  Chỉnh sửa hoạt động
                                  <ChevronDown size={15} />
                                </summary>
                              <label className="planner-edit-field">
                                Giờ tham quan
                                <input
                                  type="time"
                                  value={activity.time}
                                  onChange={(event) =>
                                    updateActivity(destination.id, {
                                      time: event.target.value,
                                    })
                                  }
                                />
                              </label>

                              <label className="planner-edit-field">
                                Ghi chú
                                <textarea
                                  rows={2}
                                  value={activity.note}
                                  placeholder="Ghi chú cho địa điểm..."
                                  onChange={(event) =>
                                    updateActivity(destination.id, {
                                      note: event.target.value,
                                    })
                                  }
                                />
                              </label>

                              <label className="planner-completed">
                                <input
                                  type="checkbox"
                                  checked={Boolean(activity.completed)}
                                  onChange={(event) =>
                                    updateActivity(destination.id, {
                                      completed: event.target.checked,
                                    })
                                  }
                                />
                                Đã tham quan
                              </label>

                              <label className="planner-edit-field">
                                Chuyển sang ngày
                                <select
                                  value={dayIndex}
                                  onChange={(event) =>
                                    moveActivityToDay(
                                      destination.id,
                                      Number(event.target.value),
                                    )
                                  }
                                >
                                  {days.map((targetDay, targetIndex) => (
                                    <option
                                      key={targetDay.day}
                                      value={targetIndex}
                                    >
                                      Ngày {targetDay.day} —{" "}
                                      {formatDate(targetDay.date)}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <div className="planner-activity-actions">
                                <button
                                  type="button"
                                  title="Chuyển lên trên"
                                  aria-label="Chuyển lên trên"
                                  disabled={activityIndex === 0}
                                  onClick={() =>
                                    moveDestination(
                                      dayIndex,
                                      activityIndex,
                                      -1,
                                    )
                                  }
                                >
                                  ↑
                                </button>

                                <button
                                  type="button"
                                  title="Chuyển xuống dưới"
                                  aria-label="Chuyển xuống dưới"
                                  disabled={
                                    activityIndex === day.activities.length - 1
                                  }
                                  onClick={() =>
                                    moveDestination(
                                      dayIndex,
                                      activityIndex,
                                      1,
                                    )
                                  }
                                >
                                  ↓
                                </button>

                                <button
                                  type="button"
                                  title="Mở Google Maps"
                                  aria-label="Mở Google Maps"
                                  onClick={() => openMap(destination)}
                                >
                                  <ExternalLink size={14} />
                                </button>

                                <button
                                  type="button"
                                  title="Lưu yêu thích"
                                  aria-label="Lưu yêu thích"
                                  onClick={() => saveAsFavorite(destination)}
                                >
                                  <Heart size={14} />
                                </button>

                                <button
                                  type="button"
                                  title="Xóa địa điểm"
                                  aria-label="Xóa địa điểm"
                                  onClick={() =>
                                    removeDestination(destination.id)
                                  }
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              </details>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <footer className="planner-day-footer">
                    <span>{day.activities.length} địa điểm</span>
                    <span>Chi phí dự kiến: {formatMoney(dayCost)}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {day.activities.length > 0 && (
                        <button
                          type="button"
                          className="planner-text-button"
                          onClick={() => clearDayActivities(dayIndex)}
                          title="Xóa tất cả địa điểm trong ngày này"
                          style={{ color: "#ef4444" }}
                        >
                          Xóa hết địa điểm ngày này
                        </button>
                      )}
                      <button
                        type="button"
                        className="planner-text-button"
                        onClick={() => removeDay(dayIndex)}
                      >
                        Xóa ngày
                      </button>
                    </div>
                  </footer>
                </article>
              );
            })
          )}

          <div className="planner-day-controls">
            <button
              type="button"
              className="planner-secondary-button"
              onClick={addDay}
              disabled={days.length >= 14}
            >
              <Plus size={17} /> Thêm ngày
            </button>
          </div>

          {days.length > 0 && (
            <section className="planner-add-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0 }}>
                  <Plus size={19} /> Thêm địa điểm vào lịch trình
                </h3>
                <button
                  type="button"
                  onClick={generateItinerary}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "#f3e8ff",
                    color: "#6d28d9",
                    border: "1px solid #ddd6fe",
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  title="Tự động xếp địa điểm vào tất cả các ngày"
                >
                  <Sparkles size={14} />
                  <span>Tự động lên lịch thông minh</span>
                </button>
              </div>

              <div className="planner-add-row">
                <select
                  value={selectedDay}
                  onChange={(event) => setSelectedDay(Number(event.target.value))}
                >
                  {days.map((day, index) => (
                    <option key={day.day} value={index}>
                      Ngày {day.day} — {formatDate(day.date)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedId}
                  onChange={(event) => setSelectedId(event.target.value)}
                >
                  <option value="">Chọn địa điểm</option>
                  {availableDestinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name} · {destination.category}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="planner-primary-button"
                  onClick={addDestination}
                  disabled={!availableDestinations.length}
                >
                  <Plus size={17} /> Thêm vào ngày {selectedDay + 1}
                </button>
              </div>

              {availableDestinations.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed #e2e8f0" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Gợi ý lên lịch nhanh vào Ngày {selectedDay + 1}:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {availableDestinations.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(item.id);
                          // Trigger add
                          setTimeout(() => {
                            const btn = document.getElementById("planner-quick-add-btn");
                            btn?.click();
                          }, 50);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 10px",
                          borderRadius: 20,
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          fontSize: 12,
                          color: "#334155",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#8b5cf6";
                          e.currentTarget.style.color = "#6d28d9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          e.currentTarget.style.color = "#334155";
                        }}
                      >
                        <Plus size={12} />
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    id="planner-quick-add-btn"
                    type="button"
                    style={{ display: "none" }}
                    onClick={addDestination}
                  />
                </div>
              )}
            </section>
          )}
        </section>

        <aside className="planner-summary">
          <section className="planner-panel planner-map-panel">
            <div className="planner-panel-title">
              <MapPin size={20} />
              <h2>Bản đồ hành trình</h2>
            </div>

            {plannedDestinations.length === 0 ? (
              <div className="planner-map-placeholder">
                <MapPin size={32} />
                <p>Bản đồ sẽ có địa điểm sau khi tạo lịch trình.</p>
              </div>
            ) : (
              <div className="planner-map-preview">
                <svg
                  className="planner-map-route"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <polyline
                    points={plannedDestinations
                      .slice(0, MAP_MARKER_POSITIONS.length)
                      .map((_, index) => {
                        const position = MAP_MARKER_POSITIONS[index];
                        return `${parseFloat(position.left)},${parseFloat(position.top)}`;
                      })
                      .join(" ")}
                  />
                </svg>
                {plannedDestinations
                  .slice(0, MAP_MARKER_POSITIONS.length)
                  .map(({ destination }, index) => (
                  <button
                    type="button"
                    key={destination.id}
                    onClick={() => openMap(destination)}
                    className="planner-map-place"
                    style={MAP_MARKER_POSITIONS[index]}
                    title={`Mở bản đồ: ${destination.name}`}
                  >
                    <img src={destination.image} alt="" />
                    <span>{destination.name}</span>
                  </button>
                  ))}
                <span className="planner-map-caption">
                  Sơ đồ minh họa · {plannedDestinations.length} điểm đến
                </span>
              </div>
            )}
          </section>

          <section className="planner-panel planner-budget-panel">
            <div className="planner-panel-title">
              <Wallet size={20} />
              <h2>Dự toán chi phí</h2>
            </div>

            <div className="planner-budget-total">
              {formatMoney(grandTotal)}
            </div>

            <p className="planner-budget-subtitle">
              (cho {travelers} người)
            </p>

            <div className="planner-budget-line">
              <span><MapPin size={14} /> Vé tham quan</span>
              <strong>{formatMoney(totalCost)}</strong>
            </div>

            <div className="planner-budget-line">
              <span><Utensils size={14} /> Chi phí phát sinh</span>
              <strong>{formatMoney(extraExpenses)}</strong>
            </div>

            <div className="planner-budget-line">
              <span>Địa điểm chưa rõ giá</span>
              <strong>{unknownPriceCount}</strong>
            </div>

            <div className="planner-budget-line">
              <span>Ngân sách</span>
              <strong>{formatMoney(budget)}</strong>
            </div>

            <div className="planner-budget-line">
              <span>
                {remainingBudget >= 0 ? "Ngân sách còn lại" : "Vượt ngân sách"}
              </span>
              <strong className={remainingBudget < 0 ? "planner-over-budget" : ""}>
                {formatMoney(Math.abs(remainingBudget))}
              </strong>
            </div>

            <div className="planner-progress">
              <div
                className={
                  remainingBudget < 0
                    ? "planner-progress-fill over"
                    : "planner-progress-fill"
                }
                style={{
                  width: `${Math.min(100, budget > 0 ? (grandTotal / budget) * 100 : 0)}%`,
                }}
              />
            </div>

            <div className="planner-budget-line">
              <span>Bình quân / người</span>
              <strong>{formatMoney(averagePerPerson)}</strong>
            </div>

            <p className="planner-budget-warning">
              Giá vé dựa trên dữ liệu địa điểm. Chi phí ăn uống, khách sạn và
              di chuyển cần được nhập riêng; giá chưa cập nhật không được
              tính vào tổng vé.
            </p>
          </section>

          <section className="planner-panel">
            <div className="planner-panel-title">
              <CheckCircle2 size={20} />
              <h2>Tiến độ chuyến đi</h2>
            </div>

            <div className="planner-progress">
              <div
                className="planner-progress-fill"
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <p className="planner-budget-subtitle">
              {completedActivities}/{plannedDestinations.length} địa điểm đã
              tham quan ({completionRate}%)
            </p>
          </section>

          <section className="planner-panel">
            <div className="planner-panel-title">
              <ClipboardList size={20} />
              <h2>Checklist chuẩn bị</h2>
            </div>

            <div className="planner-checklist">
              {checklist.map((item) => (
                <div className="planner-checklist-item" key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(event) =>
                        setChecklist((current) =>
                          current.map((entry) =>
                            entry.id === item.id
                              ? { ...entry, completed: event.target.checked }
                              : entry,
                          ),
                        )
                      }
                    />
                    <span className={item.completed ? "is-completed" : ""}>
                      {item.text}
                    </span>
                  </label>

                  <button
                    type="button"
                    aria-label={`Xóa ${item.text}`}
                    onClick={() =>
                      setChecklist((current) =>
                        current.filter((entry) => entry.id !== item.id),
                      )
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <form
              className="planner-checklist-add"
              onSubmit={(event) => {
                event.preventDefault();
                addChecklistItem();
              }}
            >
              <input
                value={newChecklistText}
                onChange={(event) => setNewChecklistText(event.target.value)}
                placeholder="Thêm việc cần chuẩn bị..."
                aria-label="Việc cần chuẩn bị"
              />
              <button type="submit" aria-label="Thêm checklist">
                <Plus size={17} />
              </button>
            </form>
          </section>

          <section className="planner-panel">
            <div className="planner-panel-title">
              <Wallet size={20} />
              <h2>Chi phí phát sinh</h2>
            </div>

            <label className="planner-edit-field">
              Loại chi phí
              <select
                value={expenseCategory}
                onChange={(event) =>
                  setExpenseCategory(event.target.value as ExpenseItem["category"])
                }
              >
                <option>Ăn uống</option>
                <option>Khách sạn</option>
                <option>Di chuyển</option>
                <option>Khác</option>
              </select>
            </label>

            <label className="planner-edit-field">
              Số tiền (VND)
              <input
                type="number"
                min="0"
                value={expenseAmount}
                onChange={(event) => setExpenseAmount(event.target.value)}
                placeholder="Ví dụ: 150000"
              />
            </label>

            <label className="planner-edit-field">
              Ghi chú
              <input
                value={expenseNote}
                onChange={(event) => setExpenseNote(event.target.value)}
                placeholder="Ví dụ: bữa trưa"
              />
            </label>

            <button
              type="button"
              className="planner-primary-button planner-full-button"
              onClick={addExpense}
            >
              <Plus size={16} /> Thêm khoản chi
            </button>

            {expenses.length > 0 && (
              <div className="planner-expense-list">
                {expenses.map((expense) => (
                  <div className="planner-expense-item" key={expense.id}>
                    <div>
                      <strong>{expense.category}</strong>
                      <p>{expense.note || "Không có ghi chú"}</p>
                      <span>{formatMoney(expense.amount)}</span>
                    </div>

                    <button
                      type="button"
                      aria-label="Xóa khoản chi"
                      onClick={() =>
                        setExpenses((current) =>
                          current.filter((item) => item.id !== expense.id),
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            <button
              type="button"
              className="planner-secondary-button planner-full-button"
              onClick={clearItinerary}
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                border: "1px solid #fca5a5",
                fontWeight: 600,
              }}
              title="Xóa toàn bộ các ngày và địa điểm trong lịch trình"
            >
              <Trash2 size={16} /> Xóa toàn bộ lịch trình
            </button>
            <button
              type="button"
              className="planner-secondary-button planner-full-button"
              onClick={generateItinerary}
              style={{
                background: "#f3e8ff",
                color: "#6d28d9",
                border: "1px solid #ddd6fe",
                fontWeight: 600,
              }}
              title="Tự động tạo lịch trình mẫu mới"
            >
              <Sparkles size={16} /> Tạo lại lịch trình mẫu
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
