
import type { CSSProperties } from "react";
import {
  BedDouble,
  MapPin,
  Utensils,
  Landmark,
  Building2,
  BriefcaseBusiness,
  Bus,
  Wallet,
  Toilet,
  type LucideIcon,
} from "lucide-react";
import type { TravelItem } from "../data";
import "./MapFilterSidebar.css";

export type MapFilterId =
  | "stay"
  | "food"
  | "attraction"
  | "service"
  | "tour"
  | "transport"
  | "transaction"
  | "toilet";

type FilterCategory = {
  id: MapFilterId;
  label: string;
  icon: LucideIcon;
  color: string;
  keywords: string[];
};

export const MAP_FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: "stay",
    label: "Lưu trú",
    icon: BedDouble,
    color: "#d45c36",
    keywords: [
      "khach san",
      "homestay",
      "resort",
      "nha nghi",
      "luu tru",
      "hotel",
      "hostel",
      "villa",
    ],
  },
  {
    id: "food",
    label: "Ăn uống",
    icon: Utensils,
    color: "#079bd7",
    keywords: [
      "am thuc",
      "an uong",
      "nha hang",
      "quan an",
      "quan ca phe",
      "cafe",
      "ca phe",
      "bun bo",
      "mon an",
      "food",
      "restaurant",
    ],
  },
  {
    id: "attraction",
    label: "Điểm tham quan",
    icon: Landmark,
    color: "#8bbd00",
    keywords: [
      "di tich",
      "tam linh",
      "thien nhien",
      "kham pha",
      "tham quan",
      "diem den",
      "lang khai dinh",
      "dai noi",
      "chua",
      "lang tu duc",
      "cau",
      "bien",
      "phao dai",
      "cho dong ba",
      "pha tam giang",
    ],
  },
  {
    id: "service",
    label: "Cơ sở dịch vụ",
    icon: Building2,
    color: "#d33ac4",
    keywords: [
      "co so dich vu",
      "benh vien",
      "phong kham",
      "nha thuoc",
      "spa",
      "massage",
      "giat ui",
      "sua xe",
      "dich vu",
    ],
  },
  {
    id: "tour",
    label: "Lữ hành",
    icon: BriefcaseBusiness,
    color: "#b3a72a",
    keywords: [
      "lu hanh",
      "cong ty du lich",
      "tour",
      "huong dan vien",
      "dai ly du lich",
      "travel",
    ],
  },
  {
    id: "transport",
    label: "Vận chuyển",
    icon: Bus,
    color: "#c58a13",
    keywords: [
      "van chuyen",
      "ben xe",
      "ga hue",
      "san bay",
      "taxi",
      "cho thue xe",
      "xe buyt",
      "xe may",
      "xe dap",
      "ben tau",
    ],
  },
  {
    id: "transaction",
    label: "Điểm giao dịch",
    icon: Wallet,
    color: "#526d8c",
    keywords: [
      "diem giao dich",
      "atm",
      "ngan hang",
      "rut tien",
      "buu dien",
      "giao dich",
      "bank",
    ],
  },
  {
    id: "toilet",
    label: "Nhà vệ sinh",
    icon: Toilet,
    color: "#5b6670",
    keywords: ["nha ve sinh", "toilet", "wc"],
  },
];

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi")
    .trim();
}

export function matchesMapFilter(
  place: TravelItem,
  filterId: MapFilterId,
): boolean {
  const filter = MAP_FILTER_CATEGORIES.find(
    (item) => item.id === filterId,
  );

  if (!filter) {
    return false;
  }

  const searchable = normalize(
    `${place.category} ${place.name} ${place.description} ${place.address}`,
  );

  return filter.keywords.some((keyword) =>
    searchable.includes(normalize(keyword)),
  );
}

type MapFilterSidebarProps = {
  places: TravelItem[];
  selected: MapFilterId[];
  onChange: (selected: MapFilterId[]) => void;
};

export default function MapFilterSidebar({
  places,
  selected,
  onChange,
}: MapFilterSidebarProps) {
  const allSelected =
    selected.length === MAP_FILTER_CATEGORIES.length;

  function toggleAll() {
    onChange(
      allSelected ? [] : MAP_FILTER_CATEGORIES.map((item) => item.id),
    );
  }

  function toggleCategory(id: MapFilterId) {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    onChange(next);
  }

  const allIconStyle: CSSProperties = {
    "--filter-color": "#7c16f4",
  } as CSSProperties;

  return (
    <aside className="hs-filter-sidebar">
      <div className="hs-filter-heading">
        <h2>Lọc địa điểm</h2>

        <button
          type="button"
          className="hs-filter-close"
          title="Bỏ chọn tất cả danh mục"
          aria-label="Bỏ chọn tất cả danh mục"
          onClick={() => onChange([])}
        >
          ×
        </button>
      </div>

      <div className="hs-filter-list">
        <button
          type="button"
          className={`hs-filter-row ${allSelected ? "is-active" : ""}`}
          onClick={toggleAll}
          aria-pressed={allSelected}
        >
          <span
            className={`hs-filter-check ${allSelected ? "checked" : ""}`}
            aria-hidden="true"
          >
            {allSelected ? "✓" : ""}
          </span>

          <span className="hs-filter-icon" style={allIconStyle}>
            <MapPin size={19} fill="currentColor" />
          </span>

          <span className="hs-filter-label">Tất cả</span>

          <span className="hs-filter-count">{places.length}</span>
        </button>

        {MAP_FILTER_CATEGORIES.map((item) => {
          const Icon = item.icon;
          const checked = selected.includes(item.id);

          const count = places.filter((place) =>
            matchesMapFilter(place, item.id),
          ).length;

          const iconStyle: CSSProperties = {
            "--filter-color": item.color,
          } as CSSProperties;

          return (
            <button
              type="button"
              key={item.id}
              className={`hs-filter-row ${checked ? "is-active" : ""}`}
              onClick={() => toggleCategory(item.id)}
              aria-pressed={checked}
            >
              <span
                className={`hs-filter-check ${checked ? "checked" : ""}`}
                aria-hidden="true"
              >
                {checked ? "✓" : ""}
              </span>

              <span className="hs-filter-icon" style={iconStyle}>
                <Icon size={18} />
              </span>

              <span className="hs-filter-label">{item.label}</span>

              <span className="hs-filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="hs-filter-footer">
        Đang bật {selected.length}/{MAP_FILTER_CATEGORIES.length} danh mục
      </div>
    </aside>
  );
}
