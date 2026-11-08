
import "./MapPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import {
  Search,
  MapPin,
  Navigation,
  Compass,
  X,
  Clock,
  Star,
  Ticket,
  Landmark,
  TreePine,
  Utensils,
  Flower2,
  LayoutGrid,
  ArrowRight,
  LocateFixed,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

import { getAllDestinations, type TravelItem } from "../data";

type MapCategory = "Tất cả" | string;

const categoryColors: Record<string, string> = {
  "Di tích": "#086b50",
  "Tâm linh": "#9360df",
  "Thiên nhiên": "#45a967",
  "Ẩm thực": "#f59e0b",
  "Khám phá": "#0f766e",
};

const categoryIcons: Record<string, typeof Compass> = {
  "Di tích": Landmark,
  "Tâm linh": Flower2,
  "Thiên nhiên": TreePine,
  "Ẩm thực": Utensils,
  "Khám phá": Compass,
};

const DEFAULT_CENTER: [number, number] = [16.4637, 107.5909];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi")
    .trim();
}

function FlyToPlace({ place }: { place: TravelItem | null }) {
  const map = useMap();

  useEffect(() => {
    if (place) {
      map.flyTo(
        [Number(place.lat), Number(place.lng)],
        15,
        { duration: 1.1 }
      );
    }
  }, [map, place]);

  return null;
}

function MapSizeUpdater() {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function MapControls() {
  const map = useMap();

  function locateHue() {
    map.flyTo(DEFAULT_CENTER, 13, { duration: 1 });
  }

  return (
    <button
      type="button"
      className="hs-map-locate"
      onClick={locateHue}
      title="Đưa bản đồ về trung tâm Huế"
      aria-label="Đưa bản đồ về trung tâm Huế"
    >
      <LocateFixed size={19} />
    </button>
  );
}

export default function MapPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<MapCategory>("Tất cả");

  const [places, setPlaces] = useState<TravelItem[]>(() =>
    getAllDestinations()
  );

  const [selectedPlace, setSelectedPlace] =
    useState<TravelItem | null>(() => getAllDestinations()[0] ?? null);

  // Đồng bộ khi dữ liệu địa điểm được cập nhật từ trang Admin.
  useEffect(() => {
    const refreshDestinations = () => {
      const updatedPlaces = getAllDestinations();

      setPlaces(updatedPlaces);

      setSelectedPlace((current) => {
        if (!current) return updatedPlaces[0] ?? null;

        return (
          updatedPlaces.find((place) => place.id === current.id) ??
          updatedPlaces[0] ??
          null
        );
      });
    };

    window.addEventListener(
      "huesmart-destinations-updated",
      refreshDestinations
    );
    window.addEventListener("storage", refreshDestinations);

    refreshDestinations();

    return () => {
      window.removeEventListener(
        "huesmart-destinations-updated",
        refreshDestinations
      );
      window.removeEventListener("storage", refreshDestinations);
    };
  }, []);

  const categories = useMemo(
    () => [
      "Tất cả",
      ...Array.from(new Set(places.map((place) => place.category))),
    ],
    [places]
  );

  const filteredPlaces = useMemo(() => {
    const search = normalizeText(keyword);

    return places.filter((place) => {
      const matchCategory =
        category === "Tất cả" || place.category === category;

      const searchableText = normalizeText(
        `${place.name} ${place.address} ${place.description} ${place.category}`
      );

      return matchCategory && searchableText.includes(search);
    });
  }, [places, category, keyword]);

  // Nếu địa điểm đang chọn không còn thuộc kết quả lọc,
  // chuyển sang địa điểm đầu tiên phù hợp.
  useEffect(() => {
    if (
      selectedPlace &&
      !filteredPlaces.some((place) => place.id === selectedPlace.id)
    ) {
      setSelectedPlace(filteredPlaces[0] ?? null);
    }

    if (!selectedPlace && filteredPlaces.length > 0) {
      setSelectedPlace(filteredPlaces[0]);
    }
  }, [filteredPlaces, selectedPlace]);

  const openDirections = (place: TravelItem) => {
    const lat = Number(place.lat);
    const lng = Number(place.lng);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      window.alert("Địa điểm này chưa có tọa độ GPS hợp lệ.");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  function selectPlace(place: TravelItem) {
    setSelectedPlace(place);
  }

  return (
    <main className="hs-map-page">
      {/* BANNER */}
      <section className="hs-map-hero">
        <div className="hs-map-hero-image" />

        <div className="hs-map-hero-inner">
          <div className="hs-map-hero-copy">
            <span className="hs-map-pin-heading">
              <MapPin size={30} fill="currentColor" />
            </span>

            <div>
              <span className="hs-map-eyebrow">
                HUESMART TRAVEL · INTERACTIVE MAP
              </span>

              <h1>
                Tìm kiếm và khám phá
                <br />
                <span>các địa điểm nổi bật tại Cố đô Huế</span>
              </h1>

              <p>
                Khám phá di sản, trải nghiệm văn hóa và tận hưởng vẻ đẹp
                của Huế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TÌM KIẾM VÀ BỘ LỌC */}
      <section className="hs-map-search-panel">
        <form
          className="hs-map-search-form"
          onSubmit={(event) => {
            event.preventDefault();

            if (filteredPlaces[0]) {
              selectPlace(filteredPlaces[0]);
            }
          }}
        >
          <div className="hs-map-search-input">
            <Search size={21} />

            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm địa điểm, khu vực..."
              aria-label="Tìm địa điểm"
            />

            {keyword && (
              <button
                type="button"
                className="hs-map-clear"
                onClick={() => setKeyword("")}
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <button type="submit" className="hs-map-search-button">
            <Navigation size={18} />
            <span>Tìm kiếm</span>
          </button>
        </form>

        <div className="hs-map-category-list">
          {categories.map((item) => {
            const Icon =
              item === "Tất cả"
                ? LayoutGrid
                : categoryIcons[item] ?? MapPin;

            return (
              <button
                type="button"
                key={item}
                className={
                  category === item
                    ? "hs-map-category active"
                    : "hs-map-category"
                }
                onClick={() => setCategory(item)}
              >
                <Icon size={17} />
                {item}
              </button>
            );
          })}
        </div>

        <div className="hs-map-discovery-row">
          <div className="hs-map-count">
            <MapPin size={17} />
            <span>
              Tìm thấy <strong>{filteredPlaces.length}</strong> địa điểm
            </span>
          </div>

          <span className="hs-map-discovery-divider" />

          <span className="hs-map-discovery-label">
            Địa điểm khám phá:
          </span>

          <div className="hs-map-quick-list">
            {filteredPlaces.slice(0, 8).map((place) => (
              <button
                type="button"
                key={place.id}
                className={
                  selectedPlace?.id === place.id
                    ? "hs-map-quick-chip active"
                    : "hs-map-quick-chip"
                }
                onClick={() => selectPlace(place)}
                title={place.name}
              >
                {place.name}
              </button>
            ))}

            {filteredPlaces.length === 0 && (
              <span className="hs-map-no-results">
                Không có địa điểm phù hợp
              </span>
            )}
          </div>
        </div>
      </section>

      {/* BẢN ĐỒ VÀ THẺ ĐỊA ĐIỂM */}
      <section className="hs-map-workspace">
        <div className="hs-map-canvas">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={13}
            scrollWheelZoom
            zoomControl
            className="hs-map-leaflet"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapSizeUpdater />
            <FlyToPlace place={selectedPlace} />
            <MapControls />

            {filteredPlaces.map((place) => {
              const color =
                categoryColors[place.category] ?? "#0f766e";
              const isSelected = selectedPlace?.id === place.id;

              return (
                <CircleMarker
                  key={place.id}
                  center={[
                    Number.isFinite(Number(place.lat))
                      ? Number(place.lat)
                      : DEFAULT_CENTER[0],
                    Number.isFinite(Number(place.lng))
                      ? Number(place.lng)
                      : DEFAULT_CENTER[1],
                  ]}
                  radius={isSelected ? 12 : 8}
                  pathOptions={{
                    color: "#ffffff",
                    weight: isSelected ? 4 : 3,
                    fillColor: color,
                    fillOpacity: 1,
                  }}
                  eventHandlers={{
                    click: () => selectPlace(place),
                  }}
                >
                  <Popup>
                    <div className="hs-map-popup">
                      <strong>{place.name}</strong>
                      <span>{place.category}</span>
                      <p>{place.description}</p>
                      <small>{place.address}</small>

                      <button
                        type="button"
                        onClick={() => openDirections(place)}
                      >
                        <Navigation size={14} />
                        Chỉ đường
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          <div className="hs-map-legend">
            {[
              "Di tích",
              "Tâm linh",
              "Thiên nhiên",
              "Ẩm thực",
            ].map((item) => {
              const Icon = categoryIcons[item];

              return (
                <span key={item}>
                  <i
                    style={{
                      background: categoryColors[item],
                    }}
                  >
                    <Icon size={12} />
                  </i>
                  {item}
                </span>
              );
            })}
          </div>

          <div className="hs-map-attribution">
            Leaflet · OpenStreetMap
          </div>
        </div>

        <aside className="hs-map-detail-panel">
          {selectedPlace ? (
            <>
              <div className="hs-map-detail-heading">
                <div className="hs-map-detail-title-icon">
                  {(() => {
                    const Icon =
                      categoryIcons[selectedPlace.category] ?? Compass;

                    return <Icon size={25} />;
                  })()}
                </div>

                <div className="hs-map-detail-title">
                  <span>{selectedPlace.category}</span>
                  <h2>{selectedPlace.name}</h2>
                </div>

                <button
                  type="button"
                  className="hs-map-next-place"
                  title="Chọn địa điểm tiếp theo"
                  aria-label="Chọn địa điểm tiếp theo"
                  onClick={() => {
                    const currentIndex = filteredPlaces.findIndex(
                      (place) => place.id === selectedPlace.id
                    );
                    const nextIndex =
                      (currentIndex + 1) % filteredPlaces.length;

                    if (filteredPlaces[nextIndex]) {
                      selectPlace(filteredPlaces[nextIndex]);
                    }
                  }}
                  disabled={filteredPlaces.length < 2}
                >
                  <ArrowRight size={21} />
                </button>
              </div>

              <div className="hs-map-detail-image-wrap">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="hs-map-detail-image"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
                <span className="hs-map-image-badge">
                  <MapPin size={13} />
                  Khám phá Huế
                </span>
              </div>

              <p className="hs-map-detail-description">
                {selectedPlace.description ||
                  "Khám phá vẻ đẹp và những giá trị văn hóa của địa điểm này."}
              </p>

              <div className="hs-map-detail-address">
                <MapPin size={17} />
                <span>{selectedPlace.address || "Chưa cập nhật địa chỉ"}</span>
              </div>

              <div className="hs-map-detail-meta">
                <div>
                  <span className="hs-map-meta-icon">
                    <Star size={15} />
                  </span>
                  <span>
                    <small>Đánh giá</small>
                    <strong>
                      {Number(selectedPlace.rating) > 0
                        ? `${selectedPlace.rating}/5`
                        : "Chưa có"}
                    </strong>
                  </span>
                </div>

                <div>
                  <span className="hs-map-meta-icon">
                    <Clock size={15} />
                  </span>
                  <span>
                    <small>Thời gian</small>
                    <strong>
                      {selectedPlace.duration || "Chưa cập nhật"}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="hs-map-detail-price">
                <Ticket size={17} />
                <span>Chi phí tham khảo</span>
                <strong>
                  {selectedPlace.price || "Chưa cập nhật"}
                </strong>
              </div>

              <div className="hs-map-detail-actions">
                <Link
                  to={`/destinations/${selectedPlace.id}`}
                  className="hs-map-detail-link"
                >
                  Xem chi tiết
                  <ArrowRight size={16} />
                </Link>

                <button
                  type="button"
                  className="hs-map-directions"
                  onClick={() => openDirections(selectedPlace)}
                >
                  <Navigation size={16} />
                  Chỉ đường
                </button>
              </div>
            </>
          ) : (
            <div className="hs-map-empty-detail">
              <span>
                <MapPin size={30} />
              </span>
              <h3>Chưa có địa điểm phù hợp</h3>
              <p>
                Thử thay đổi từ khóa hoặc chọn một danh mục khác để tiếp
                tục khám phá.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  setCategory("Tất cả");
                }}
              >
                Xem tất cả địa điểm
              </button>
            </div>
          )}
        </aside>
      </section>

      <footer className="hs-map-footer">
        <Compass size={16} />
        <span>
          Dữ liệu địa điểm được lấy từ HueSmart Travel. Tọa độ GPS và chi phí
          mang tính tham khảo, cần được xác minh trước khi sử dụng chính thức.
        </span>
      </footer>
    </main>
  );
}
