
export type TravelItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  gallery?: string[];
  price: string;
  duration: string;
  rating: number;
  ratingCount?: number;
  openingHours?: string;
  details?: {
    heading: string;
    paragraphs?: string[];
    points?: {
      title: string;
      description: string;
    }[];
  }[];
  lat: number;
  lng: number;
};

export const PENDING_ITINERARY_DESTINATION_KEY =
  "huesmart-pending-itinerary-destination";

export const destinations: TravelItem[] = [
  {
    id: "1",
    name: "Đại Nội Huế",
    category: "Di tích",
    description: "Quần thể cung điện ghi dấu triều Nguyễn và di sản kiến trúc cung đình.",
    address: "Đường 23 tháng 8, Phường Phú Xuân, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Khamphahue-PhuongTienDiDenDaiNoi_1776758195.png",
    price: "200.000 đ - 200.000 đ",
    duration: "2–3 giờ",
    rating: 4.7,
    ratingCount: 517,
    openingHours: "07:30 - 17:30",
    details: [
      {
        heading: "1. Vị trí và lịch sử hình thành",
        paragraphs: [
          "Tọa lạc ngay trung tâm thành phố Huế, bên bờ Bắc sông Hương thơ mộng, Đại Nội được vua Gia Long bắt đầu khởi công xây dựng vào năm 1804 và hoàn thiện với quy mô đồ sộ dưới thời vua Minh Mạng (1833). Dù trải qua hơn hai thế kỷ với bao thăng trầm và biến cố lịch sử, Đại Nội Huế vẫn giữ được hồn cốt uy nghi, trở thành biểu tượng du lịch số 1 không thể bỏ qua khi đến vùng đất cố đô.",
        ],
      },
      {
        heading: "2. Quy mô và kiến trúc độc đáo",
        paragraphs: [
          "Quần thể kiến trúc Đại Nội rộng lớn với hơn 100 công trình lộng lẫy, được chia làm hai khu vực chính:",
          "Toàn bộ hệ thống cung điện được thiết kế theo nguyên tắc phong thủy phương Đông khắt khe, bố trí đối xứng qua trục chính (trục Dũng đạo), kết hợp hài hòa với hệ thống hồ nước, hào sâu, cây xanh và các khu vườn ngự uyển.",
        ],
        points: [
          {
            title: "Hoàng Thành",
            description:
              "Nơi thiết triều, tổ chức các nghi lễ trọng đại và là khu vực làm việc của các vị vua.",
          },
          {
            title: "Tử Cấm Thành",
            description:
              "Khu vực sinh hoạt riêng tư, biệt lập của nhà vua cùng hậu cung.",
          },
        ],
      },
      {
        heading: "3. Những điểm check-in và tham quan nổi bật",
        points: [
          {
            title: "Cổng Ngọ Môn",
            description:
              "Cửa chính lớn nhất nằm ở phía Nam của Đại Nội với kiến trúc Lầu Ngũ Phụng tuyệt đẹp, nơi từng chứng kiến nhiều sự kiện lịch sử quan trọng nhất của đất nước.",
          },
          {
            title: "Điện Thái Hòa",
            description:
              "Trung tâm quyền lực tuyệt đối của triều Nguyễn, nơi đặt ngai vàng chạm trổ rồng thiêng và là nơi diễn ra các đại lễ như đăng quang, sinh nhật vua.",
          },
          {
            title: "Thế Miếu & Cửu Đỉnh",
            description:
              "Khu vực thờ cúng linh thiêng các vị vua triều Nguyễn. Đặc biệt, Cửu Đỉnh (9 chiếc đỉnh đồng khổng lồ) là bảo vật quốc gia được chạm khắc vô cùng tinh xảo.",
          },
          {
            title: "Cung Diên Thọ & Cung Trường Sanh",
            description:
              "Nơi ở của các bậc Hoàng thái hậu và Thái hoàng thái hậu, mang đậm nét kiến trúc thanh tịnh, tao nhã.",
          },
        ],
      },
      {
        heading: "4. Trải nghiệm văn hóa không thể bỏ lỡ",
        paragraphs: [
          "Không chỉ là một “bảo tàng” kiến trúc sống động, Đại Nội còn mang đến cho du khách nhiều trải nghiệm văn hóa thú vị:",
        ],
        points: [
          {
            title: "Thưởng thức Nhã nhạc Cung đình Huế",
            description:
              "Lắng nghe âm sắc cung đình từng phục vụ vua chúa, đã được UNESCO công nhận là Di sản văn hóa phi vật thể của nhân loại.",
          },
          {
            title: "Hóa thân cùng cổ phục",
            description:
              "Chụp ảnh check-in trong trang phục truyền thống như Áo Tắc, Áo Nhật Bình giữa không gian cung điện rêu phong.",
          },
          {
            title: "Khám phá Đại Nội về đêm",
            description:
              "Tận hưởng không gian huyền ảo, lung linh ánh đèn cùng các hoạt cảnh tái hiện sinh hoạt hoàng cung xưa (theo lịch trình của Trung tâm Bảo tồn Di tích).",
          },
        ],
      },
    ],
    lat: 16.4698,
    lng: 107.577,
  },
  {
    id: "2",
    name: "Chùa Thiên Mụ (Chùa Linh Mụ)",
    category: "Tâm linh",
    description: "Ngôi chùa cổ bên dòng sông Hương, biểu tượng bình yên của xứ Huế.",
    address: "Đường Nguyễn Phúc Nguyên",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/Chua-Thien-Mu_1776821164.jpg",
    price: "Liên hệ",
    duration: "1 giờ",
    rating: 4.5,
    ratingCount: 134,
    openingHours: "07:30 - 17:30",
    lat: 16.4538,
    lng: 107.544,
  },
  {
    id: "3",
    name: "Lăng vua Khải Định",
    category: "Di tích",
    description: "Công trình lăng tẩm độc đáo kết hợp kiến trúc Á – Âu tinh xảo.",
    address: "Đường Đại Nam, Núi Châu Chữ Đại Nam, phường Thủy Xuân, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/74d44096-3627-4cf5-a5b5-5b71fdac2f9e_1793344049.jpg",
    price: "150.000 đ - 150.000 đ",
    duration: "1–2 giờ",
    rating: 4.5,
    ratingCount: 74,
    openingHours: "07:30 - 17:30",
    lat: 16.397,
    lng: 107.5905,
  },
  {
    id: "4",
    name: "Đồi Vọng Cảnh",
    category: "Thiên nhiên",
    description: "Điểm ngắm sông Hương và rừng thông thơ mộng từ trên cao.",
    address: "Huyền Trân Công Chúa, TP. Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/doi-vong-canh-hue-banner_1780994359.jpg",
    price: "Miễn phí",
    duration: "1 giờ",
    rating: 4.7,
    lat: 16.4295,
    lng: 107.561,
  },
  {
    id: "5",
    name: "Chợ Đông Ba",
    category: "Ẩm thực",
    description: "Không gian khám phá đặc sản, món ngon và nhịp sống địa phương.",
    address: "Trần Hưng Đạo, TP. Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/8539e433-3343-4b84-a7d2-cc7ebe77694a_1793343797.jpg",
    price: "Theo món",
    duration: "1–2 giờ",
    rating: 4.7,
    lat: 16.4737,
    lng: 107.585,
  },
  {
    id: "6",
    name: "Phá Tam Giang",
    category: "Thiên nhiên",
    description: "Đầm phá rộng lớn với cảnh hoàng hôn và đời sống ngư dân đặc sắc.",
    address: "Xã Quảng Điền",
    image: "https://huetripo.hue.gov.vn/uploads/Media/2026/pha-tam-giang-9_1781749154.jpg",
    price: "Liên hệ",
    duration: "Nửa ngày",
    rating: 4.6,
    ratingCount: 465,
    openingHours: "07:30 - 17:30",
    lat: 16.55,
    lng: 107.55,
  },
  {
    id: "7",
    name: "Lăng vua Tự Đức",
    category: "Di tích",
    description: "Khu lăng tẩm của vua Tự Đức tại phường Thủy Xuân, Huế.",
    address: "Dương Xuân Thượng -, phường Thủy Xuân, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/4c64b192-bf71-44f4-b9c3-120add19cbe7_1793343807.jpg",
    price: "150.000 đ - 150.000 đ",
    duration: "1–2 giờ",
    rating: 4.5,
    ratingCount: 252,
    openingHours: "07:30 - 17:30",
    lat: 16.433,
    lng: 107.568,
  },
  {
    id: "8",
    name: "Biển Lăng Cô",
    category: "Thiên nhiên",
    description: "Bãi tắm công cộng Lăng Cô, điểm đến ven biển tại Thành phố Huế.",
    address: "Bãi tắm công cộng Lăng Cô Thôn Bình An, Xã Chân Mây - Lăng Cô, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/bai-bien-lang-co-hue_1779191369.jpg",
    price: "Liên hệ",
    duration: "Tùy lịch trình",
    rating: 4.2,
    ratingCount: 56,
    openingHours: "05:30 - 22:30",
    lat: 16.203,
    lng: 108.073,
  },
  {
    id: "9",
    name: "Kinh Thành Huế",
    category: "Di tích",
    description: "Quần thể kinh thành ở trung tâm thành phố, phía bờ Bắc sông Hương.",
    address: "Trung tâm thành phố Huế (thuộc địa phận phường Phú Xuân), nằm ở bờ phía Bắc sông Hương",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/ae6658da-0e26-4cfe-839a-cd53ad973121_1793347683.jpg",
    price: "Liên hệ",
    duration: "2–3 giờ",
    rating: 4.5,
    ratingCount: 327,
    openingHours: "07:30 - 17:30",
    lat: 16.4698,
    lng: 107.577,
  },
  {
    id: "10",
    name: "Lăng vua Minh Mạng",
    category: "Di tích",
    description: "Khu lăng tẩm của vua Minh Mạng tại núi Cẩm Khê, phường Kim Long.",
    address: "Núi Cẩm Khê, Phường Kim Long, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/lang-minh-mang-hue-2_1624691360_1776344138.webp",
    price: "150.000 đ - 150.000 đ",
    duration: "1–2 giờ",
    rating: 4.5,
    ratingCount: 39,
    openingHours: "07:30 - 17:30",
    lat: 16.386,
    lng: 107.568,
  },
  {
    id: "11",
    name: "Núi Bạch Mã - Vườn quốc gia Bạch Mã",
    category: "Thiên nhiên",
    description: "Điểm đến thiên nhiên tại thôn Lộc Trì, xã Phú Lộc, Thành phố Huế.",
    address: "Thôn Lộc Trì, Xã Phú Lộc, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/vuon-quoc-gia-Bach-Ma-Hue-07_1624591388_1779192585.webp",
    price: "Liên hệ",
    duration: "Tùy lịch trình",
    rating: 5,
    ratingCount: 13,
    openingHours: "07:30 - 17:30",
    lat: 16.2,
    lng: 107.85,
  },
  {
    id: "12",
    name: "Đình Thương Bạc",
    category: "Di tích",
    description: "Địa điểm tham quan trên đường Trần Hưng Đạo, phường Phú Xuân.",
    address: "FH9P+664 Trần Hưng Đạo, Phường Phú Xuân, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/dinhthuongbac__6__1780998358.jpg",
    price: "Liên hệ",
    duration: "Khoảng 1 giờ",
    rating: 4.4,
    ratingCount: 186,
    openingHours: "07:30 - 21:30",
    lat: 16.474,
    lng: 107.584,
  },
  {
    id: "13",
    name: "Trung tâm Văn hóa Huyền Trân",
    category: "Di tích",
    description: "Điểm tham quan văn hóa tại số 151 Thiên Thai, phường An Cựu.",
    address: "151 Thiên Thai, Phường An Cựu, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/den_huyen_tran_1781058683.jpg",
    price: "Liên hệ",
    duration: "Khoảng 1 giờ",
    rating: 4.5,
    ratingCount: 134,
    openingHours: "07:30 - 17:30",
    lat: 16.429,
    lng: 107.58,
  },
  {
    id: "14",
    name: "Kỳ Đài",
    category: "Di tích",
    description: "Di tích nằm trên đường 23 tháng 8, phường Phú Xuân.",
    address: "Đường 23 tháng 8, Phường Phú Xuân, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/0ca396e9-6808-4cc2-b679-22071e9a482c_1793347148.jpg",
    price: "Liên hệ",
    duration: "Khoảng 1 giờ",
    rating: 4.7,
    ratingCount: 199,
    openingHours: "07:30 - 17:30",
    lat: 16.466,
    lng: 107.58,
  },
  {
    id: "15",
    name: "Nhà vườn An Hiên",
    category: "Di tích",
    description: "Nhà vườn tại số 58 đường Nguyễn Phúc Nguyên, Thành phố Huế.",
    address: "58 đường Nguyễn Phúc Nguyên",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/bbc70c71-b455-407b-9ceb-aa77457fa893_1793347803.jpg",
    price: "Liên hệ",
    duration: "Khoảng 1 giờ",
    rating: 4,
    ratingCount: 40,
    openingHours: "07:30 - 17:30",
    lat: 16.46,
    lng: 107.54,
  },
  {
    id: "16",
    name: "YesHue Eco",
    category: "Thiên nhiên",
    description: "Điểm du lịch sinh thái tại thôn Xuân Phú, Thành phố Huế.",
    address: "Thôn Xuân Phú",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/yesco_1781062946.jpg",
    price: "Liên hệ",
    duration: "Tùy lịch trình",
    rating: 4.5,
    ratingCount: 6,
    openingHours: "07:30 - 17:30",
    lat: 16.45,
    lng: 107.61,
  },
  {
    id: "17",
    name: "Đầm Chuồn",
    category: "Thiên nhiên",
    description: "Điểm tham quan đầm phá tại khu vực làng An Truyền, phường Mỹ Thượng.",
    address: "Đường vào làng An Truyền từ QL49B, Phường Mỹ Thượng, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/dam-chuon-hue_1780541968.jpg",
    price: "50.000 đ - 100.000 đ",
    duration: "Tùy lịch trình",
    rating: 4.1,
    ratingCount: 217,
    openingHours: "07:30 - 17:30",
    lat: 16.43,
    lng: 107.68,
  },
  {
    id: "18",
    name: "Suối nước nóng Thanh Tân",
    category: "Thiên nhiên",
    description: "Khu du lịch suối nước nóng tại Phong Sơn, phường Phong Thái.",
    address: "Phong Sơn, Phường Phong Thái, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/a31f3d0b-b7df-413a-9119-a15ea6e5fa5c_1793346544.jpg",
    price: "230.000 đ - 230.000 đ",
    duration: "Tùy lịch trình",
    rating: 4.5,
    ratingCount: 53,
    openingHours: "07:30 - 22:30",
    lat: 16.48,
    lng: 107.38,
  },
  {
    id: "19",
    name: "Điểm du lịch sinh thái cộng đồng làng A Nôr",
    category: "Nông thôn",
    description: "Điểm du lịch sinh thái cộng đồng tại thôn A Tia 2.",
    address: "Thôn A Tia 2",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/lang-a-Nor-dulichhue-10_1781003636.jpg",
    price: "Liên hệ",
    duration: "Tùy lịch trình",
    rating: 4.4,
    ratingCount: 51,
    openingHours: "07:30 - 18:30",
    lat: 16.27,
    lng: 107.74,
  },
  {
    id: "20",
    name: "Đầm An Cư (Lập An)",
    category: "Thiên nhiên",
    description: "Đầm An Cư, còn gọi là đầm Lập An, tại khu vực Chân Mây - Lăng Cô.",
    address: "Quốc lộ 1A đường Vi Thủ An, Xã Chân Mây - Lăng Cô, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/7957af85-89ad-4a47-8a71-cc704cb1c741_1781249857.jpg",
    price: "Liên hệ",
    duration: "Tùy lịch trình",
    rating: 4.3,
    ratingCount: 195,
    openingHours: "07:30 - 17:30",
    lat: 16.23,
    lng: 108.0,
  },
  {
    id: "21",
    name: "Đường đi bộ trên sông Hương",
    category: "Không gian công cộng",
    description: "Không gian đi bộ bên sông Hương tại phường Thuận Hóa.",
    address: "- Đường Đi Bộ Trên Sông Hương, Phường Thuận Hóa, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/duongibo_song_huong_1776830582.webp",
    price: "Liên hệ",
    duration: "Tùy lịch trình",
    rating: 0,
    ratingCount: 0,
    openingHours: "07:30 - 17:30",
    lat: 16.466,
    lng: 107.59,
  },
  {
    id: "22",
    name: "Nghinh Lương Đình",
    category: "Di tích",
    description: "Di tích bên đường Lê Duẩn, phường Phú Xuân, Thành phố Huế.",
    address: "- Lê Duẩn, Phường Phú Xuân, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/77f92cc3-565f-46de-8f87-d170274b6800_1793347315.jpg",
    price: "Liên hệ",
    duration: "Khoảng 1 giờ",
    rating: 4.8,
    ratingCount: 156,
    openingHours: "07:30 - 17:30",
    lat: 16.474,
    lng: 107.578,
  },
  {
    id: "23",
    name: "Nhà Thờ Chính Tòa Phủ Cam",
    category: "Tâm linh",
    description: "Nhà thờ chính tòa tại số 1 Đoàn Hữu Trưng, phường Thuận Hóa.",
    address: "1 Đoàn Hữu Trưng, Phường Thuận Hóa, Thành phố Huế",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/aa5db01d-78f5-450d-9180-fbb60f3fa6e9_1793345312.jpg",
    price: "Liên hệ",
    duration: "Khoảng 1 giờ",
    rating: 4.7,
    ratingCount: 124,
    openingHours: "07:30 - 17:30",
    lat: 16.45,
    lng: 107.59,
  },
  {
    id: "24",
    name: "Du lịch cộng đồng A Roàng",
    category: "Nông thôn",
    description: "Điểm du lịch cộng đồng tại khu vực A Roàng 2.",
    address: "A Roàng 2",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/aroang_1780974175.jpg",
    price: "Liên hệ",
    duration: "Tùy lịch trình",
    rating: 4.4,
    ratingCount: 32,
    openingHours: "07:30 - 22:30",
    lat: 16.14,
    lng: 107.67,
  },
  {
    id: "25",
    name: "Ga Huế",
    category: "Văn hoá",
    description: "Nhà ga tại số 01 Bùi Thị Xuân, Thành phố Huế.",
    address: "01 Bùi Thị Xuân",
    image: "https://huetripo.hue.gov.vn/uploads/DaPhuongTien/2026/10/e44cf509-cd49-4332-b368-5601f448911f_1793344105.jpg",
    price: "Liên hệ",
    duration: "Khoảng 1 giờ",
    rating: 3.8,
    ratingCount: 690,
    openingHours: "07:30 - 17:30",
    lat: 16.458,
    lng: 107.58,
  },
  {
    id: "26",
    name: "Khu Du Lịch Sinh Thái Thác Bồ Ghè",
    category: "Thiên nhiên",
    description: "Khu du lịch sinh thái tại khu vực Chân Mây - Lăng Cô.",
    address: "Chân Mây - Lăng Cô, Huế, Vietnam",
    image: "https://huetripo.hue.gov.vn/uploads/Media/2026/thach-boghe_1781680746.webp",
    price: "20.000 đ - 20.000 đ",
    duration: "Tùy lịch trình",
    rating: 4.1,
    ratingCount: 126,
    openingHours: "07:30 - 18:00",
    lat: 16.27,
    lng: 107.94,
  },
];

type DestinationDetails = NonNullable<TravelItem["details"]>;

function createDestinationDetails(
  overview: string,
  highlights: { title: string; description: string }[],
  visitAdvice: string
): DestinationDetails {
  return [
    {
      heading: "1. Khái quát về địa điểm",
      paragraphs: [overview],
    },
    {
      heading: "2. Điểm nổi bật",
      points: highlights,
    },
    {
      heading: "3. Gợi ý trải nghiệm",
      paragraphs: [
        visitAdvice,
        "Địa hình, thời tiết, giờ hoạt động và dịch vụ có thể thay đổi theo mùa hoặc đơn vị quản lý. Hãy xác nhận thông tin thực tế trước khi khởi hành.",
      ],
    },
  ];
}

const DESTINATION_DETAILS: Record<string, DestinationDetails> = {
  "2": createDestinationDetails(
    "Chùa Thiên Mụ, còn gọi là chùa Linh Mụ, nằm trên đồi Hà Khê bên dòng sông Hương. Đây là một trong những ngôi chùa gắn bó lâu đời với đời sống văn hóa và tín ngưỡng của người dân xứ Huế.",
    [
      {
        title: "Tháp Phước Duyên",
        description:
          "Ngọn tháp nhiều tầng là hình ảnh thường được nhắc đến khi nói về chùa Thiên Mụ và cảnh quan ven sông Hương.",
      },
      {
        title: "Không gian chùa",
        description:
          "Khuôn viên có các công trình thờ tự, sân vườn và nhiều góc nhìn hướng ra sông; du khách nên dành thời gian tham quan trong không khí yên tĩnh.",
      },
      {
        title: "Giá trị văn hóa",
        description:
          "Ngôi chùa là điểm gặp gỡ giữa kiến trúc Phật giáo, lịch sử địa phương và sinh hoạt tín ngưỡng ở Huế.",
      },
    ],
    "Có thể kết hợp tham quan chùa với hành trình dọc bờ sông Hương hoặc ghé các điểm lân cận. Khi vào khu vực thờ tự, nên mặc trang phục lịch sự, giữ trật tự và tôn trọng hoạt động của nhà chùa."
  ),
  "3": createDestinationDetails(
    "Lăng vua Khải Định nằm ở khu vực núi Châu Chữ, phường Thủy Xuân. Công trình được xây dựng trong giai đoạn 1920–1931, nổi bật bởi cách kết hợp hình thức kiến trúc cung đình Việt Nam với một số ảnh hưởng kiến trúc châu Âu.",
    [
      {
        title: "Đường lên lăng",
        description:
          "Các bậc cấp dẫn qua những sân nghi lễ và tượng quan, tạo nên trục tham quan đi dần lên khu điện thờ.",
      },
      {
        title: "Cung Thiên Định",
        description:
          "Không gian bên trong được biết đến với trang trí khảm sành sứ, thủy tinh nhiều màu và các họa tiết cầu kỳ.",
      },
      {
        title: "Sự giao thoa kiến trúc",
        description:
          "Quy mô và vật liệu trang trí khiến công trình có diện mạo khác biệt so với nhiều lăng tẩm khác ở Huế.",
      },
    ],
    "Nên mang giày dễ đi vì hành trình có nhiều bậc thang. Hãy dành thời gian quan sát các chi tiết trang trí và tuân thủ hướng dẫn tại khu di tích, đặc biệt ở những khu vực hạn chế chụp ảnh."
  ),
  "4": createDestinationDetails(
    "Đồi Vọng Cảnh là điểm cao xanh mát ở phía Tây Nam thành phố Huế, nhìn xuống những đoạn sông Hương uốn lượn qua rừng cây và vùng lăng tẩm. Nơi đây phù hợp với du khách muốn ngắm cảnh thiên nhiên và tìm một nhịp dừng yên tĩnh.",
    [
      {
        title: "Tầm nhìn hướng sông",
        description:
          "Từ các khoảng trống trên đồi có thể quan sát cảnh quan sông Hương và vùng cây xanh ven bờ.",
      },
      {
        title: "Rừng thông và lối dạo",
        description:
          "Không gian nhiều cây tạo cảm giác thoáng mát, thích hợp đi bộ nhẹ và nghỉ chân ngoài trời.",
      },
      {
        title: "Ánh sáng cuối ngày",
        description:
          "Buổi chiều thường là thời điểm được lựa chọn để ngắm cảnh; chất lượng tầm nhìn còn tùy thời tiết.",
      },
    ],
    "Ưu tiên giày bám tốt, mang nước uống và đi theo lối an toàn. Không trèo lên vách dốc hoặc đứng sát mép cao để chụp ảnh; hãy giữ vệ sinh và không để lại rác."
  ),
  "5": createDestinationDetails(
    "Chợ Đông Ba nằm gần trung tâm Huế, là nơi mua bán quen thuộc của người dân và điểm dừng chân để tìm hiểu nhịp sống địa phương. Khu chợ có nhiều quầy hàng thực phẩm, đặc sản, đồ dùng và sản phẩm phục vụ sinh hoạt hằng ngày.",
    [
      {
        title: "Ẩm thực địa phương",
        description:
          "Du khách có thể tìm các món ăn và thức quà Huế tại khu hàng ăn; từng quầy có thực đơn và mức giá riêng.",
      },
      {
        title: "Đặc sản và quà tặng",
        description:
          "Các quầy hàng thường bày bán sản phẩm địa phương, thực phẩm khô và quà lưu niệm.",
      },
      {
        title: "Không khí chợ truyền thống",
        description:
          "Dạo chợ là dịp quan sát hoạt động mua bán thường ngày và cách người dân lựa chọn hàng hóa.",
      },
    ],
    "Nên đi vào thời gian phù hợp với lịch hoạt động của chợ, hỏi giá trước khi mua và chuẩn bị tiền mặt mệnh giá nhỏ. Giữ tư trang cẩn thận và tránh cản lối đi trong giờ đông khách."
  ),
  "6": createDestinationDetails(
    "Phá Tam Giang là một vùng đầm phá rộng ở phía Bắc thành phố Huế, gắn với sinh kế sông nước của cư dân địa phương. Cảnh quan mặt nước, cửa lạch và hoạt động đánh bắt tạo nên nét riêng so với các điểm tham quan di tích trong nội đô.",
    [
      {
        title: "Cảnh quan đầm phá",
        description:
          "Không gian mặt nước mở rộng, thay đổi sắc độ theo ánh sáng và điều kiện thời tiết.",
      },
      {
        title: "Đời sống ngư dân",
        description:
          "Một số hành trình địa phương giới thiệu hoạt động nuôi trồng, đánh bắt và sinh hoạt ven phá.",
      },
      {
        title: "Ẩm thực vùng nước lợ",
        description:
          "Các quán địa phương có thể phục vụ hải sản và món ăn theo mùa; thực đơn, giá bán tùy từng cơ sở.",
      },
    ],
    "Nên hỏi rõ điểm đón, thời lượng và chi phí nếu đặt thuyền hoặc tour. Áo chống nắng, nước uống và áo phao phù hợp sẽ hữu ích; không tự ý xuống nước hoặc lên thuyền khi chưa có hướng dẫn."
  ),
  "7": createDestinationDetails(
    "Lăng vua Tự Đức là một quần thể lăng tẩm triều Nguyễn ở phường Thủy Xuân. Cảnh quan nơi đây kết hợp các công trình kiến trúc với hồ nước, cây xanh và những khoảng sân tạo nên không gian trầm lắng.",
    [
      {
        title: "Cảnh quan hồ và cây xanh",
        description:
          "Mặt nước và vườn cây là phần quan trọng tạo nên vẻ yên tĩnh của quần thể.",
      },
      {
        title: "Khu vực tẩm điện",
        description:
          "Các công trình thờ tự và kiến trúc nghi lễ giúp tìm hiểu quan niệm về không gian lăng tẩm thời Nguyễn.",
      },
      {
        title: "Dấu ấn nhà vua",
        description:
          "Tên gọi và các hạng mục trong quần thể gắn với cuộc đời, vai trò của vua Tự Đức trong lịch sử triều Nguyễn.",
      },
    ],
    "Nên đi bộ theo tuyến tham quan được hướng dẫn để không bỏ sót các khu vực chính. Mang giày thoải mái, tránh chạm vào hiện vật và kiểm tra thông báo của ban quản lý trước chuyến đi."
  ),
  "8": createDestinationDetails(
    "Biển Lăng Cô thuộc khu vực Chân Mây – Lăng Cô, nơi cảnh quan bãi biển nằm giữa dãy núi và vùng đầm phá. Đây là điểm dừng chân ven biển phù hợp để nghỉ ngơi, ngắm cảnh và thưởng thức ẩm thực địa phương.",
    [
      {
        title: "Bãi biển và đường bờ",
        description:
          "Bờ biển mở ra tầm nhìn rộng, màu nước và điều kiện tắm biển thay đổi theo mùa, thời tiết và sóng.",
      },
      {
        title: "Cảnh quan núi và đầm",
        description:
          "Vùng Lăng Cô có sự kết hợp giữa biển, núi và đầm nước, tạo nhiều góc ngắm cảnh trên hành trình.",
      },
      {
        title: "Hải sản địa phương",
        description:
          "Khu vực có các cơ sở phục vụ hải sản; nên hỏi rõ giá và cách tính trước khi gọi món.",
      },
    ],
    "Kiểm tra tình trạng biển và cảnh báo an toàn trước khi xuống nước, đặc biệt trong mùa mưa hoặc khi có sóng lớn. Dùng kem chống nắng, không bơi một mình và thu gom rác sau khi tham quan."
  ),
  "9": createDestinationDetails(
    "Kinh Thành Huế là hệ thống thành lũy bao quanh khu vực trung tâm của kinh đô triều Nguyễn xưa, nằm ở bờ Bắc sông Hương. Bên trong thành là nhiều lớp không gian lịch sử, trong đó có khu Đại Nội.",
    [
      {
        title: "Thành lũy và cửa thành",
        description:
          "Các đoạn tường thành, hào nước và cổng thành cho thấy cách tổ chức phòng vệ của kinh đô.",
      },
      {
        title: "Không gian đô thị lịch sử",
        description:
          "Khu vực bên trong và xung quanh thành kết nối nhiều di tích, đường phố và sinh hoạt hiện đại.",
      },
      {
        title: "Liên hệ với Đại Nội",
        description:
          "Đại Nội nằm trong tổng thể Kinh Thành, vì vậy có thể sắp xếp hai nội dung này trong cùng một chuyến tham quan.",
      },
    ],
    "Do khu vực rộng, hãy xác định trước cổng vào và các điểm muốn ghé trên bản đồ. Tôn trọng không gian dân cư, di tích và biển hướng dẫn; thời gian tham quan phụ thuộc tuyến đi thực tế."
  ),
  "10": createDestinationDetails(
    "Lăng vua Minh Mạng nằm trong khu vực núi Cẩm Khê, thuộc quần thể lăng tẩm phía Tây Nam Huế. Công trình được quy hoạch theo trục đối xứng, đặt các hạng mục kiến trúc trong mối liên hệ với hồ nước và cảnh quan tự nhiên.",
    [
      {
        title: "Bố cục theo trục",
        description:
          "Các sân, cổng và công trình được sắp xếp nối tiếp, thể hiện tính quy củ của kiến trúc cung đình.",
      },
      {
        title: "Sự hài hòa với thiên nhiên",
        description:
          "Hồ nước, cây xanh và địa hình tạo nên những khoảng nhìn rộng, thay đổi theo từng đoạn tham quan.",
      },
      {
        title: "Giá trị lịch sử",
        description:
          "Quần thể gắn với vua Minh Mạng và là một trong những lăng tẩm tiêu biểu của triều Nguyễn tại Huế.",
      },
    ],
    "Nên dành đủ thời gian đi bộ hết tuyến chính và nghỉ chân khi cần. Một số khu vực có sân rộng, bậc cấp hoặc đường ngoài trời nên chuẩn bị giày thoải mái và nước uống."
  ),
  "11": createDestinationDetails(
    "Núi Bạch Mã và Vườn quốc gia Bạch Mã là điểm đến thiên nhiên ở phía Nam thành phố Huế. Khu vực núi có rừng, khí hậu thay đổi theo độ cao và các tuyến khám phá dành cho du khách yêu thích cảnh quan ngoài trời.",
    [
      {
        title: "Hệ sinh thái rừng núi",
        description:
          "Cảnh quan rừng là điểm hấp dẫn chính; cần tuân thủ quy định bảo tồn và không tác động đến động thực vật.",
      },
      {
        title: "Tuyến đi bộ và ngắm cảnh",
        description:
          "Một số hoạt động yêu cầu đi bộ trên địa hình dốc hoặc đường rừng; độ khó tùy tuyến và điều kiện thực tế.",
      },
      {
        title: "Thời tiết vùng núi",
        description:
          "Sương mù, mưa và nhiệt độ có thể khác với khu vực đồng bằng, ảnh hưởng đến tầm nhìn và kế hoạch tham quan.",
      },
    ],
    "Cần kiểm tra quy định vào vườn, phương tiện được phép di chuyển và tình trạng các tuyến trước khi đi. Chuẩn bị giày trekking, áo mưa, nước uống; không đi khỏi đường cho phép hoặc tự tách đoàn."
  ),
  "12": createDestinationDetails(
    "Đình Thương Bạc là điểm di tích nằm trên đường Trần Hưng Đạo, phường Phú Xuân, gần khu vực trung tâm thành phố. Đây có thể là điểm dừng ngắn trong hành trình tìm hiểu các công trình lịch sử và không gian ven sông.",
    [
      {
        title: "Vị trí trong đô thị",
        description:
          "Địa điểm nằm giữa khu vực có nhiều hoạt động thường ngày, thuận tiện kết hợp với các điểm gần đó.",
      },
      {
        title: "Không gian di tích",
        description:
          "Quan sát kiến trúc và bảng giới thiệu tại chỗ để hiểu rõ hơn về tên gọi, niên đại và chức năng của công trình.",
      },
      {
        title: "Điểm dừng tìm hiểu lịch sử",
        description:
          "Đình có thể bổ sung góc nhìn về các di tích ít được biết đến bên cạnh những điểm tham quan lớn.",
      },
    ],
    "Thông tin chi tiết về giờ tiếp cận và khu vực mở cửa nên được xác nhận tại địa phương. Khi tham quan, giữ yên tĩnh, không tự ý đi vào khu vực đóng hoặc chạm vào cấu kiện."
  ),
  "13": createDestinationDetails(
    "Trung tâm Văn hóa Huyền Trân nằm trên đường Thiên Thai, phường An Cựu. Địa điểm gắn với câu chuyện lịch sử về công chúa Huyền Trân và là một không gian để tìm hiểu thêm về văn hóa, lịch sử vùng Thuận Hóa.",
    [
      {
        title: "Câu chuyện Huyền Trân",
        description:
          "Tên gọi gợi nhắc nhân vật lịch sử có vai trò trong câu chuyện mở rộng giao lưu giữa Đại Việt và vùng đất phương Nam.",
      },
      {
        title: "Không gian văn hóa",
        description:
          "Các hạng mục trưng bày hoặc sinh hoạt tại trung tâm có thể thay đổi theo chương trình tổ chức.",
      },
      {
        title: "Kết hợp tham quan",
        description:
          "Có thể bố trí điểm này trong hành trình khám phá các di tích và cảnh quan ở khu vực phía Nam thành phố.",
      },
    ],
    "Hãy kiểm tra lịch hoạt động hoặc sự kiện trước khi ghé thăm để biết khu vực nào đang mở cửa. Tôn trọng hướng dẫn tại nơi tổ chức và giữ gìn không gian văn hóa."
  ),
  "14": createDestinationDetails(
    "Kỳ Đài nằm ở phía Nam Kinh Thành Huế, gần trục đường 23 tháng 8. Cùng với khu vực quảng trường và thành lũy xung quanh, công trình là một dấu mốc dễ nhận biết trong cảnh quan cố đô.",
    [
      {
        title: "Cột cờ của kinh thành",
        description:
          "Kỳ Đài gắn với hoạt động treo cờ và các sự kiện lịch sử tại trung tâm kinh đô.",
      },
      {
        title: "Góc nhìn từ bên ngoài thành",
        description:
          "Khu vực quanh đài có thể kết hợp với chuyến tham quan Đại Nội và các cổng thành lân cận.",
      },
      {
        title: "Không gian công cộng",
        description:
          "Đây là điểm dừng thuận tiện để quan sát quy mô thành lũy và nhịp sống khu vực trung tâm.",
      },
    ],
    "Nên tham quan từ khu vực công cộng được phép và chú ý giao thông khi chụp ảnh. Giờ tiếp cận các khu vực bên trong có thể khác với việc quan sát công trình từ bên ngoài."
  ),
  "15": createDestinationDetails(
    "Nhà vườn An Hiên nằm trên đường Nguyễn Phúc Nguyên, gần khu vực Kim Long. Nhà vườn là một dạng không gian cư trú truyền thống ở Huế, kết hợp ngôi nhà chính với sân, vườn cây và lối đi trong khuôn viên.",
    [
      {
        title: "Kiến trúc nhà rường",
        description:
          "Ngôi nhà chính thể hiện cách tổ chức không gian sinh hoạt truyền thống; hãy quan sát kết cấu và chi tiết chạm khắc tại chỗ.",
      },
      {
        title: "Khu vườn xanh",
        description:
          "Cây cối, sân vườn và lối vào tạo khoảng chuyển tiếp yên tĩnh giữa đường phố và không gian nhà.",
      },
      {
        title: "Nếp sống và văn hóa Huế",
        description:
          "Nhà vườn giúp tìm hiểu mối liên hệ giữa kiến trúc, cảnh quan và sinh hoạt gia đình truyền thống.",
      },
    ],
    "Đây là không gian cần được gìn giữ; nên hỏi quy định tham quan, chụp ảnh và khu vực được phép vào. Đi nhẹ, nói khẽ và không chạm vào đồ đạc hay cây cảnh."
  ),
  "16": createDestinationDetails(
    "YesHue Eco được giới thiệu là điểm du lịch sinh thái tại thôn Xuân Phú. Trải nghiệm ở đây hướng đến không gian ngoài trời và hoạt động thư giãn gần gũi thiên nhiên; dịch vụ cụ thể phụ thuộc thời điểm vận hành.",
    [
      {
        title: "Không gian sinh thái",
        description:
          "Du khách có thể tìm hiểu cảnh quan và tiện ích thực tế tại khu vực khi đến nơi.",
      },
      {
        title: "Hoạt động theo nhóm",
        description:
          "Địa điểm sinh thái thường phù hợp cho chuyến đi gia đình hoặc nhóm bạn; cần hỏi trước về hoạt động đang được tổ chức.",
      },
      {
        title: "Dịch vụ theo thời điểm",
        description:
          "Tình trạng mở cửa, tiện ích và giá dịch vụ có thể thay đổi, vì vậy nên xác nhận trực tiếp trước khi di chuyển.",
      },
    ],
    "Liên hệ đơn vị vận hành để hỏi đường vào, đặt chỗ, dịch vụ hiện có và những vật dụng cần chuẩn bị. Tôn trọng quy định tại khu sinh thái và hạn chế đồ nhựa dùng một lần."
  ),
  "17": createDestinationDetails(
    "Đầm Chuồn thuộc hệ đầm phá Tam Giang – Cầu Hai, ở khu vực An Truyền, phường Mỹ Thượng. Cảnh quan mặt nước, nò sáo và sinh hoạt nuôi trồng thủy sản tạo nên nét đặc trưng của vùng đầm phá.",
    [
      {
        title: "Nò sáo và nghề thủy sản",
        description:
          "Các dụng cụ đánh bắt trên đầm phản ánh sinh kế gắn với mặt nước của cộng đồng địa phương.",
      },
      {
        title: "Cảnh bình minh và hoàng hôn",
        description:
          "Ánh sáng trên đầm thay đổi đẹp theo thời điểm; tầm nhìn thực tế phụ thuộc mây, mưa và mùa.",
      },
      {
        title: "Ẩm thực vùng phá",
        description:
          "Một số cơ sở địa phương phục vụ món ăn từ thủy sản; cần xác nhận thực đơn và giá trước khi gọi.",
      },
    ],
    "Nếu đi thuyền, hãy chọn đơn vị có trang bị an toàn và tuân theo hướng dẫn của người lái. Đường vào có thể nhỏ, nên kiểm tra tuyến di chuyển và thời tiết trước khi khởi hành."
  ),
  "18": createDestinationDetails(
    "Suối nước nóng Thanh Tân nằm ở khu vực Phong Sơn, phường Phong Thái. Điểm đến được biết đến với nguồn nước khoáng nóng và các dịch vụ nghỉ ngơi, thư giãn ngoài trời.",
    [
      {
        title: "Trải nghiệm nước khoáng nóng",
        description:
          "Các hình thức ngâm hoặc sử dụng dịch vụ phụ thuộc khu vực đang mở và quy định của đơn vị vận hành.",
      },
      {
        title: "Không gian nghỉ dưỡng",
        description:
          "Khu vực hướng đến trải nghiệm thư giãn kết hợp cảnh quan thiên nhiên, thích hợp bố trí thời gian nghỉ trong chuyến đi.",
      },
      {
        title: "Hoạt động và tiện ích",
        description:
          "Tiện ích, gói vé và dịch vụ có thể thay đổi theo ngày hoặc mùa; cần xem thông báo hiện hành trước khi đặt.",
      },
    ],
    "Hỏi rõ giá vé, các dịch vụ bao gồm và quy định sử dụng hồ trước chuyến đi. Người có tình trạng sức khỏe đặc biệt nên tham khảo ý kiến chuyên môn trước khi sử dụng dịch vụ nước nóng."
  ),
  "19": createDestinationDetails(
    "Điểm du lịch sinh thái cộng đồng làng A Nôr nằm tại thôn A Tia 2, thuộc khu vực miền núi phía Tây Huế. Mô hình du lịch cộng đồng tạo cơ hội để du khách tìm hiểu cảnh quan, sinh hoạt và văn hóa địa phương.",
    [
      {
        title: "Trải nghiệm cùng cộng đồng",
        description:
          "Các hoạt động tham quan hoặc giao lưu nên được sắp xếp thông qua người dân và đơn vị địa phương.",
      },
      {
        title: "Cảnh quan miền núi",
        description:
          "Địa hình và thời tiết vùng cao tạo trải nghiệm khác với khu vực đô thị; đường đi có thể thay đổi theo mùa.",
      },
      {
        title: "Văn hóa bản địa",
        description:
          "Tìm hiểu tập quán địa phương với thái độ tôn trọng, xin phép trước khi chụp ảnh người dân hoặc không gian riêng.",
      },
    ],
    "Nên liên hệ đầu mối địa phương để xác nhận đường đi, lưu trú và hoạt động đang có. Chuẩn bị đồ dùng phù hợp địa hình, không tự ý vào rừng hoặc khu vực sản xuất."
  ),
  "20": createDestinationDetails(
    "Đầm An Cư, còn gọi là đầm Lập An, nằm ở khu vực Chân Mây – Lăng Cô. Vùng đầm nằm giữa cảnh quan núi và biển, mang lại những góc nhìn rộng về mặt nước và đời sống ven đầm.",
    [
      {
        title: "Cảnh quan mặt đầm",
        description:
          "Mặt nước, dãy núi phía xa và ánh sáng trong ngày tạo nên khung cảnh đặc trưng của Lập An.",
      },
      {
        title: "Sinh kế ven đầm",
        description:
          "Hoạt động nuôi trồng thủy sản là một phần đời sống địa phương; du khách nên quan sát từ khu vực công cộng.",
      },
      {
        title: "Kết nối hành trình Lăng Cô",
        description:
          "Có thể kết hợp ngắm đầm với các điểm dừng ven biển trong khu vực, tùy điều kiện giao thông.",
      },
    ],
    "Cẩn thận khi dừng xe chụp ảnh và không đi xuống bãi bùn nếu chưa biết địa hình. Nếu dùng dịch vụ ăn uống hoặc thuyền, hỏi rõ giá, thời lượng và điều kiện an toàn."
  ),
  "21": createDestinationDetails(
    "Đường đi bộ trên sông Hương là không gian công cộng ven sông tại phường Thuận Hóa. Tuyến dạo bộ mang đến góc nhìn gần với dòng sông và kết nối với các khu vực sinh hoạt, cầu và cảnh quan trung tâm.",
    [
      {
        title: "Dạo bộ ven sông",
        description:
          "Không gian phù hợp cho việc đi bộ thư thả, ngắm sông và quan sát nhịp sống thành phố.",
      },
      {
        title: "Cảnh quan cầu và bờ sông",
        description:
          "Các điểm nhìn thay đổi theo từng đoạn tuyến; buổi tối có thể có ánh sáng và lượng người đông hơn.",
      },
      {
        title: "Hoạt động ngoài trời",
        description:
          "Tuyến có thể được người dân sử dụng để đi bộ hoặc tập thể dục; hãy đi đúng phần đường và nhường lối.",
      },
    ],
    "Giữ gìn vệ sinh, chú ý xe đạp và người đi bộ khác, đặc biệt vào thời điểm đông người. Theo dõi hướng dẫn địa phương nếu một đoạn tuyến đang sửa chữa hoặc tổ chức sự kiện."
  ),
  "22": createDestinationDetails(
    "Nghinh Lương Đình nằm bên bờ Bắc sông Hương, trên trục đường Lê Duẩn, gần khu vực Phú Văn Lâu và Kỳ Đài. Công trình là một điểm nhấn kiến trúc ven sông trong quần thể di tích cố đô.",
    [
      {
        title: "Kiến trúc đình ven sông",
        description:
          "Mái và kết cấu truyền thống tạo nên dáng vẻ đặc trưng, nổi bật giữa không gian mở bên bờ sông.",
      },
      {
        title: "Vị trí trong quần thể di tích",
        description:
          "Có thể kết hợp tham quan với Phú Văn Lâu, Kỳ Đài và các đoạn thành lũy lân cận.",
      },
      {
        title: "Góc nhìn sông Hương",
        description:
          "Vị trí gần bờ sông phù hợp để quan sát cảnh quan và chụp ảnh từ khu vực được phép.",
      },
    ],
    "Nên tham quan vào thời điểm thời tiết thuận lợi và lưu ý giao thông trên đường Lê Duẩn. Không bước lên cấu kiện hoặc khu vực có biển hạn chế để bảo vệ di tích."
  ),
  "23": createDestinationDetails(
    "Nhà thờ Chính tòa Phủ Cam nằm trên đường Đoàn Hữu Trưng, phường Thuận Hóa. Đây là công trình tôn giáo quan trọng của cộng đồng Công giáo địa phương, đồng thời là một điểm kiến trúc hiện đại nổi bật tại Huế.",
    [
      {
        title: "Kiến trúc nhà thờ",
        description:
          "Hình khối và các đường nét kiến trúc tạo diện mạo khác biệt so với các công trình cổ trong thành phố.",
      },
      {
        title: "Không gian sinh hoạt tôn giáo",
        description:
          "Nhà thờ vẫn là nơi hành lễ và sinh hoạt của cộng đồng, không chỉ là điểm tham quan.",
      },
      {
        title: "Góc nhìn từ khuôn viên",
        description:
          "Du khách có thể quan sát kiến trúc từ các khu vực được phép tiếp cận.",
      },
    ],
    "Kiểm tra lịch lễ nếu muốn vào bên trong; tránh tham quan hoặc chụp ảnh gây ảnh hưởng buổi lễ. Mặc trang phục lịch sự và làm theo hướng dẫn của giáo xứ."
  ),
  "24": createDestinationDetails(
    "Du lịch cộng đồng A Roàng nằm tại khu vực A Roàng 2, vùng miền núi phía Tây thành phố Huế. Hành trình hướng đến việc tìm hiểu thiên nhiên và đời sống cộng đồng thông qua sự kết nối với người dân địa phương.",
    [
      {
        title: "Không gian cộng đồng",
        description:
          "Các hoạt động nên được thống nhất trước với người dân hoặc đơn vị tổ chức để phù hợp phong tục và khả năng phục vụ.",
      },
      {
        title: "Cảnh quan miền núi",
        description:
          "Đường đi và thời tiết vùng cao có thể ảnh hưởng đáng kể đến lịch trình, nhất là trong mùa mưa.",
      },
      {
        title: "Tìm hiểu văn hóa địa phương",
        description:
          "Giao lưu có trách nhiệm giúp chuyến đi có ý nghĩa và đảm bảo lợi ích được chia sẻ với cộng đồng.",
      },
    ],
    "Liên hệ trước để xác nhận phương tiện, chỗ nghỉ, bữa ăn và hoạt động đang tổ chức. Tôn trọng phong tục, xin phép trước khi chụp ảnh và mang theo đồ dùng cá nhân cần thiết."
  ),
  "25": createDestinationDetails(
    "Ga Huế nằm tại số 01 Bùi Thị Xuân, là đầu mối đường sắt phục vụ việc đi lại đến và đi từ thành phố. Khu vực nhà ga cũng là điểm dừng để quan sát một phần kiến trúc và nhịp giao thông của Huế.",
    [
      {
        title: "Đầu mối giao thông",
        description:
          "Nhà ga phục vụ hành khách đi tàu; giờ tàu và dịch vụ phụ thuộc lịch khai thác hiện hành.",
      },
      {
        title: "Không gian nhà ga",
        description:
          "Khu vực có hoạt động lên xuống tàu thường xuyên; cần ưu tiên lối đi và hướng dẫn an toàn.",
      },
      {
        title: "Kết nối trung tâm thành phố",
        description:
          "Vị trí thuận tiện để tiếp tục di chuyển bằng các phương tiện trong thành phố.",
      },
    ],
    "Nếu đi tàu, hãy kiểm tra giờ chạy, mã vé và sân ga từ nguồn đường sắt chính thức. Không vào đường ray hoặc khu vực hạn chế; khi chỉ tham quan, giữ lối đi thông thoáng cho hành khách."
  ),
  "26": createDestinationDetails(
    "Khu Du Lịch Sinh Thái Thác Bồ Ghè được giới thiệu tại khu vực Chân Mây – Lăng Cô. Đây là điểm đến thiên nhiên gắn với cảnh quan suối và thác; trải nghiệm thực tế phụ thuộc mực nước, thời tiết và tình trạng vận hành.",
    [
      {
        title: "Cảnh quan thác và dòng suối",
        description:
          "Âm thanh và cảnh nước tạo không gian nghỉ ngơi ngoài trời; mực nước có thể thay đổi theo mùa.",
      },
      {
        title: "Hoạt động gần thiên nhiên",
        description:
          "Các hoạt động vui chơi, tắm suối hoặc dịch vụ tại chỗ cần tuân thủ quy định và cảnh báo an toàn.",
      },
      {
        title: "Điều kiện đường đi",
        description:
          "Đường vào khu vực thiên nhiên có thể trơn hoặc khó đi sau mưa; nên xác nhận tình trạng trước khi xuất phát.",
      },
    ],
    "Không xuống khu vực nước sâu hoặc dòng chảy mạnh, đặc biệt sau mưa lớn. Mang giày chống trượt, hỏi rõ vé và tiện ích đang hoạt động, đồng thời giữ sạch cảnh quan."
  ),
};

export interface HueExperience {
  id: string;
  title: string;
  tag: string;
  category: "all" | "culture" | "craft" | "food" | "nature" | "heritage";
  text: string;
  description: string;
  image: string;
  duration: string;
  location: string;
  priceText: string;
  rating: number;
  reviewCount: number;
  bestTime: string;
  highlights: string[];
  tips: string[];
  suitableFor: string;
}

export const experiences: HueExperience[] = [
  {
    id: "exp-1",
    title: "Nghe Ca Huế trên thuyền rồng & Thả hoa đăng sông Hương",
    tag: "Văn hóa & Âm nhạc",
    category: "culture",
    text: "Lắng nghe những làn điệu Nam Bình, Nam Ai da diết giữa dòng Hương Giang thơ mộng và thả hoa đăng cầu bình an dưới ánh trăng cố đô.",
    description: "Ca Huế là di sản văn hóa phi vật thể quốc gia kết hợp giữa âm nhạc cung đình và âm nhạc dân gian. Du khách sẽ bước lên chiếc thuyền rồng sơn son thếp vàng, trôi lững lờ trên mặt nước Hương Giang khi thành phố lên đèn. Dưới sự thể hiện tài hoa của các nghệ sĩ, nghệ nhân đàn tranh, tỳ bà, đàn bầu, bạn sẽ được thưởng thức trọn vẹn nét tao nhã xứ thần kinh và tự tay thả những chiếc hoa đăng lung linh mặt nước.",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/ca_hue_tren_song_huong-768x432_1781497131.jpg",
    duration: "1.5 - 2 giờ (19:00 - 21:00)",
    location: "Bến thuyền Tòa Khâm, Đường Lê Lợi, TP. Huế",
    priceText: "100.000đ - 180.000đ / khách",
    rating: 4.9,
    reviewCount: 320,
    bestTime: "19:00 hoặc 20:00 (Buổi tối hằng ngày)",
    highlights: [
      "Nghe biểu diễn trực tiếp các bản đàn cổ và dân ca Huế đặc sắc",
      "Du ngoạn thuyền rồng ngắm cầu Trường Tiền đổi màu huyền ảo",
      "Thực hiện nghi thức thả đèn hoa đăng truyền thống trên sông",
    ],
    tips: [
      "Nên đặt vé trước vào các dịp cuối tuần và lễ hội",
      "Có thể mua hoa đăng thêm tại bến thuyền hoặc trên thuyền",
      "Mang theo áo khoác mỏng nếu đi vào mùa thu đông vì gió sông se lạnh",
    ],
    suitableFor: "Gia đình, cặp đôi, du khách yêu âm nhạc truyền thống",
  },
  {
    id: "exp-2",
    title: "Khám phá Làng hương Thủy Xuân & Tự tay se nén hương trầm",
    tag: "Làng nghề thủ công",
    category: "craft",
    text: "Check-in bên những bó chông hương rực rỡ ngũ sắc và trải nghiệm nghề se hương cổ truyền hơn 700 năm bên chân đồi Vọng Cảnh.",
    description: "Nằm trên cung đường hướng lên lăng Tự Đức, làng hương Thủy Xuân nổi tiếng với không gian ngập tràn sắc màu rực rỡ của các bó hương xòe hoa. Nơi đây giữ trọn vẹn bí quyết làm hương trầm thanh khiết từ quế chi, hoa hồi, đinh hương và tùng bách. Bạn sẽ được các mệ, các dì hướng dẫn từng công đoạn trộn bột thảo mộc, se hương bằng tay và phơi hương dưới ánh nắng miền Trung.",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/LangHuongXuHue_2sa01_1776821456.jpg",
    duration: "2 - 3 giờ",
    location: "Đường Huyền Trân Công Chúa, Phường Thủy Xuân, TP. Huế",
    priceText: "Miễn phí tham quan (Trải nghiệm: 30.000đ)",
    rating: 4.95,
    reviewCount: 540,
    bestTime: "08:30 - 11:00 hoặc 14:30 - 17:00 (Ánh nắng đẹp nhất)",
    highlights: [
      "Background check-in chụp ảnh muôn sắc màu đẹp nhất Cố Đô",
      "Trực tiếp se nén hương trầm và mang thành phẩm về làm kỷ niệm",
      "Thuê cổ phục áo dài, nón lá chụp ảnh nghệ thuật ngay tại chỗ",
    ],
    tips: [
      "Mặc trang phục màu sáng hoặc màu trắng để nổi bật trên nền hương",
      "Kết hợp cùng chuyến tham quan Lăng Tự Đức và Đồi Vọng Cảnh",
      "Mua các sản phẩm hương nụ thảo mộc làm quà biếu gia đình",
    ],
    suitableFor: "Giới trẻ mê chụp ảnh, du khách quốc tế, người yêu làng nghề",
  },
  {
    id: "exp-3",
    title: "Thưởng Trà Cung Đình & Trà Sen Tây Hồ Tịnh Tâm",
    tag: "Ẩm thực & Trà đạo",
    category: "food",
    text: "Khám phá nghệ thuật ướp trà sen búp sớm mai từ thời các vua triều Nguyễn và thưởng ngoạn phong vị thanh tao trong không gian nhà rường.",
    description: "Trà sen Huế từ lâu được xem là đỉnh cao tao nhã của văn hóa ẩm thực cố đô. Truyền thuyết xưa kể rằng các cung nữ chèo thuyền ra hồ Tịnh Tâm lúc chập tối, bỏ nhúm trà thơm vào từng búp sen hé nở rồi buộc lại, sáng sớm hôm sau hứng từng giọt sương mai trên lá sen đun nước pha trà. Đến nay, bạn có thể thưởng thức chén trà sen đượm vị thanh khiết hòa cùng trà thảo mộc Cung Đình 16 vị bồi bổ sức khỏe.",
    image: "https://huetripo.hue.gov.vn/uploads/SanPham/2026/Khamphahue_TraCungDinhDucPhuongHue_1783928087.jpg",
    duration: "1.5 - 2 giờ",
    location: "Hồ Tịnh Tâm & Các quán trà đường Kim Long, TP. Huế",
    priceText: "80.000đ - 160.000đ / ấm",
    rating: 4.86,
    reviewCount: 215,
    bestTime: "07:00 - 09:30 sáng hoặc 16:30 - 18:30 hoàng hôn",
    highlights: [
      "Thưởng thức trà sen bách diệp chính gốc hồ Tịnh Tâm",
      "Lắng nghe trà sư thuyết minh phong cách ẩm trà hoàng cung",
      "Không gian thanh tịnh tĩnh tâm giữa hoa sen và tiếng đàn tranh",
    ],
    tips: [
      "Uống trà chậm rãi từng ngụm nhỏ để cảm nhận hậu vị ngọt thanh",
      "Dùng kèm mứt sen trần hoặc bánh phục linh để tròn vị cố đô",
    ],
    suitableFor: "Người tìm kiếm sự an yên, người yêu trà đạo và dưỡng sinh",
  },
  {
    id: "exp-4",
    title: "Hóa thân Hoàng Gia triều Nguyễn & Chụp ảnh Cổ phục (Việt phục)",
    tag: "Di sản & Hoàng cung",
    category: "heritage",
    text: "Khoác lên mình bộ áo Nhật Bình, Áo Tấc hoàng triều tinh xảo, dạo bước qua lầu son gác tía Tử Cấm Thành lưu lại những bức hình để đời.",
    description: "Trải nghiệm cổ phục Việt (Việt phục) đang là một trong những hoạt động được yêu thích nhất khi đến Huế. Với những bộ áo Nhật Bình thêu hoa văn ngũ hành rực rỡ của các bậc công chúa, hay tà Áo Tấc trang nghiêm của bậc vương công quý tộc, bạn sẽ như được du hành thời gian trở về thế kỷ 19 giữa không gian rêu phong của Hoàng Thành, Cung An Định hay Lăng Khải Định.",
    image: "https://huetripo.hue.gov.vn/uploads/Media/2026/KPCDH_1_1781247445.jpg",
    duration: "3 - 4 giờ",
    location: "Khu vực Đại Nội Huế, Cung An Định & Cửa Hiển Nhơn",
    priceText: "Từ 150.000đ - 350.000đ / bộ (kèm phụ kiện)",
    rating: 4.93,
    reviewCount: 420,
    bestTime: "07:30 - 10:00 sáng hoặc 15:00 - 17:30 chiều",
    highlights: [
      "Hàng trăm mẫu áo Nhật Bình, Áo Tấc, áo dài ngũ thân đúng quy chuẩn lịch sử",
      "Được trang điểm, vấn khăn và cung cấp quạt trầm, chuỗi ngọc hoàng gia",
      "Bộ ảnh kỷ niệm đậm chất di sản giữa kinh thành Huế nguy nga",
    ],
    tips: [
      "Nên chọn thuê ở các tiệm cổ phục uy tín quanh đường Đoàn Thị Điểm hoặc Đinh Tiên Hoàng",
      "Nên đi giày bệt hoặc guốc mộc thoải mái vì khuôn viên Đại Nội rất rộng",
    ],
    suitableFor: "Các bạn trẻ, cặp đôi chụp ảnh cưới, gia đình và nhóm bạn",
  },
  {
    id: "exp-5",
    title: "Đạp xe khám phá Làng cổ Thủy Biều & Ngâm chân lá thảo dược",
    tag: "Sinh thái & Làng quê",
    category: "nature",
    text: "Len lỏi dưới những vòm thanh trà trĩu quả, ghé thăm nhà rường cổ trăm năm và thư giãn với liệu pháp ngâm chân nước lá cung đình.",
    description: "Làng Thủy Biều nép mình bên khúc quanh hiền hòa của dòng sông Hương, nổi tiếng với giống bưởi thanh trà tiến vua ngọt thanh mát rượi. Đạp xe trên những con đường làng rợp bóng tre và hàng chè tàu xanh mướt, bạn sẽ viếng thăm những ngôi nhà rường cổ kính có tuổi đời hơn 150 năm, thưởng thức trà thanh trà và thư giãn đôi chân trong bồn nước ngâm lá thảo mộc tự nhiên theo bài thuốc dân gian.",
    image: "https://huetripo.hue.gov.vn/uploads/SanPham/2026/Khamphahue_ThanhTraXuHue_ThuyBieu-6_21_9_2021_08_29_47_719_SA_1783928276.jpg",
    duration: "Nửa ngày (3 - 4 giờ)",
    location: "Làng cổ Thủy Biều, Phường Thủy Biều, TP. Huế",
    priceText: "Từ 220.000đ - 380.000đ / người (kèm ăn nhẹ)",
    rating: 4.88,
    reviewCount: 180,
    bestTime: "14:00 - 18:00 (kết hợp ngắm hoàng hôn sông Hương)",
    highlights: [
      "Hít thở không khí trong lành của làng quê cố đô yên ả",
      "Tìm hiểu kiến trúc nhà rường bằng gỗ chạm trổ tinh xảo của các bậc quan lại xưa",
      "Liệu pháp ngâm chân thảo dược phục hồi sức sống cho cơ thể",
    ],
    tips: [
      "Mùa hoa thanh trà nở trắng muốt ngát hương vào khoảng tháng 2 - tháng 3",
      "Mùa quả chín rộ từ tháng 7 đến tháng 9 hằng năm",
    ],
    suitableFor: "Du khách thích du lịch chậm, sống xanh, hòa mình vào thiên nhiên",
  },
  {
    id: "exp-6",
    title: "Food Tour Ẩm thực Cố Đô: Bún bò, Bánh bèo & Chè 20 món",
    tag: "Ẩm thực bản địa",
    category: "food",
    text: "Hành trình nếm trọn hương vị cay nồng đặc trưng xứ Huế: từ bánh bèo chén tôm cháy đến chè bột lọc bọc heo quay độc nhất vô nhị.",
    description: "Huế sở hữu hơn 1.700 món ăn trên tổng số gần 3.000 món của cả nước. Tham gia chuyến du ngoạn ẩm thực này, bạn sẽ được thưởng thức tô bún bò Huế nước dùng ngọt thanh từ xương hầm và sả, khay bánh bèo - nậm - lọc nóng hổi chấm nước mắm ớt xanh cay xé lưỡi, và kết thúc buổi tối bằng ly chè bột lọc bọc heo quay trứ danh với vị ngọt mặn hài hòa khó quên.",
    image: "https://huetripo.hue.gov.vn/uploads/SanPham/2026/BeoNamLocHue_dacsanhue_18_4_2023_18_36_33_718_CH_1783938244.jpg",
    duration: "2.5 - 3.5 giờ",
    location: "Chợ Đông Ba, Phố ẩm thực Mai Thúc Loan, Cồn Hến",
    priceText: "150.000đ - 280.000đ / người",
    rating: 4.96,
    reviewCount: 710,
    bestTime: "16:30 - 21:00 hằng ngày",
    highlights: [
      "Nếm thử 8 - 10 món ăn đặc sản tiêu biểu của người Huế",
      "Khám phá các hàng quán gia truyền lâu đời ít khách du lịch biết",
      "Thử thách món chè bột lọc bọc heo quay đặc sản độc nhất vô nhị",
    ],
    tips: [
      "Người Huế ăn rất cay, hãy nhắc người bán gia giảm ớt nếu bạn không quen ăn cay",
      "Nên để bụng đói trước khi bắt đầu food tour để thưởng thức trọn vẹn",
    ],
    suitableFor: "Tín đồ ẩm thực, gia đình, nhóm bạn thích khám phá hương vị",
  },
  {
    id: "exp-7",
    title: "Chèo SUP đón bình minh sông Hương & Ngắm cầu Trường Tiền",
    tag: "Thể thao & Sông Hương",
    category: "nature",
    text: "Lướt nhẹ mái chèo giữa màn sương mờ ảo sớm mai Cố Đô, đón trọn những tia nắng vàng đầu tiên chiếu rọi cầu Trường Tiền trăm năm.",
    description: "Một cách thưởng ngoạn sông Hương hoàn toàn mới mẻ và tràn đầy năng lượng! Khi thành phố còn đang ngái ngủ, mặt nước sông phẳng lặng như tờ gương khổng lồ soi bóng cầu Trường Tiền và cầu Phú Xuân. Cảm giác nhẹ nhàng lướt ván SUP trên dòng sông thơ, hít căng lồng ngực bầu không khí trong trẻo mát lành sẽ mang đến cho bạn trải nghiệm Huế trẻ trung, năng động mà vô cùng thi vị.",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiem/2026/duongibo_song_huong_1776830582.webp",
    duration: "2 giờ (05:00 - 07:00 sáng)",
    location: "Bến Me, Công viên 3/2 ven sông Hương, TP. Huế",
    priceText: "Từ 150.000đ - 250.000đ / SUP (kèm áo phao & hướng dẫn)",
    rating: 4.91,
    reviewCount: 230,
    bestTime: "05:15 sáng (Khoảnh khắc bình minh đẹp nhất)",
    highlights: [
      "Ngắm bình minh sông Hương từ góc nhìn độc nhất vô nhị giữa lòng sông",
      "Được hướng dẫn viên cứu hộ đi cùng và chụp ảnh chèo SUP miễn phí",
      "Khởi đầu ngày mới tràn đầy sảng khoái và năng lượng tích cực",
    ],
    tips: [
      "Có người hướng dẫn cho người mới bắt đầu, không yêu cầu biết bơi",
      "Mang theo túi chống nước bảo vệ điện thoại khi chụp ảnh",
    ],
    suitableFor: "Người yêu thích thể thao, giới trẻ, người thích trải nghiệm độc lạ",
  },
  {
    id: "exp-8",
    title: "Tour Xe xích lô thong dong ngắm 24 cửa thành Đại Nội",
    tag: "Văn hóa & Thư thái",
    category: "culture",
    text: "Ngồi trên chiếc xích lô thong dong qua những con đường rợp bóng phượng bay, lắng nghe nhịp thở trầm lắng và tiếng chuông chùa Thiên Mụ.",
    description: "Xích lô từ lâu đã trở thành nét văn hóa đặc trưng gắn liền với vẻ đẹp bình yên của xứ Huế. Bác tài xích lô xứ Huế với giọng nói ngọt ngào kiêm luôn vai trò hướng dẫn viên nhiệt tình, đưa bạn đi chầm chậm qua các góc phố cổ, các cổng thành lịch sử uy nghi của Kinh thành Huế, ghé qua hồ Tịnh Tâm, hồ Tịnh Tự ngắm sen tàn sen nở và tận hưởng một buổi chiều không vội vã.",
    image: "https://huetripo.hue.gov.vn/uploads/DiaDiemDichVu/2026/XeXichLo_1781491252.jpg",
    duration: "1.5 - 2 giờ",
    location: "Khu vực Cột Cờ Phú Văn Lâu & Quanh thành nội",
    priceText: "120.000đ - 180.000đ / xe / giờ",
    rating: 4.85,
    reviewCount: 310,
    bestTime: "15:30 - 17:30 (Chiều mát)",
    highlights: [
      "Tận hưởng nhịp sống chậm đúng chất người Cố Đô",
      "Đi qua các ngõ ngách rợp bóng cây cổ thụ và bờ thành rêu phong",
      "Bác tài xích lô nhiệt tình chia sẻ những giai thoại lịch sử dân gian thú vị",
    ],
    tips: [
      "Nên thống nhất lộ trình và giá tiền trước khi bắt đầu chuyến đi",
      "Mang theo nón lá để vừa che nắng vừa tạo dáng chụp ảnh xinh xắn",
    ],
    suitableFor: "Du khách lớn tuổi, các gia đình có trẻ nhỏ, người thích sống chậm",
  },
  {
    id: "exp-9",
    title: "Khám phá Làng nghề nón lá bài thơ & Đúc đồng truyền thống",
    tag: "Làng nghề thủ công",
    category: "craft",
    text: "Mục sở thị đôi bàn tay tài hoa của các nghệ nhân chằm nón lá bài thơ Tây Hồ và kỹ nghệ đúc chuông Đại Hồng Chung thế kỷ 17.",
    description: "Nón lá bài thơ xứ Huế là một kiệt tác nghệ thuật thủ công tinh tế. Soi chiếc nón dưới ánh mặt trời, bạn sẽ thấy ẩn hiện bóng dáng cầu Trường Tiền cùng những câu thơ trữ tình được chằm tỉ mỉ giữa hai lớp lá sen, lá cọ. Bạn sẽ được ngồi trò chuyện cùng các mệ làng nghề, tự tay chằm từng đường kim mũi chỉ và mang chiếc nón độc bản về làm kỷ vật.",
    image: "https://huetripo.hue.gov.vn/uploads/SanPham/2026/khamphahue_nonhue5_1783686432.jpg",
    duration: "2 - 2.5 giờ",
    location: "Làng nón Tây Hồ, Phú Vang & Phường Đúc, TP. Huế",
    priceText: "Miễn phí tham quan (Trải nghiệm: 50.000đ)",
    rating: 4.86,
    reviewCount: 165,
    bestTime: "08:30 - 11:30 sáng",
    highlights: [
      "Chiêm ngưỡng nghệ thuật chằm nón bài thơ tinh xảo của các nghệ nhân",
      "Tự tay chằm nón lá và viết thư pháp câu thơ kỷ niệm",
      "Mua nón bài thơ và nón lá sen nguyên gốc làm quà lưu niệm",
    ],
    tips: [
      "Nên nhẹ tay khi cầm thử nón bài thơ vì nan nón chuốt rất thanh mảnh",
    ],
    suitableFor: "Người đam mê nghệ thuật thủ công, du khách nước ngoài, học sinh sinh viên",
  },
  {
    id: "exp-10",
    title: "Lớp học làm Bánh pháp lam & Bánh phục linh hoàng cung Huế",
    tag: "Ẩm thực & Trải nghiệm",
    category: "food",
    text: "Tự tay nhào nặn đậu xanh, tạo hình trái cây bóng bẩy và thưởng thức những chiếc bánh quý tộc từng dâng lên bàn tiệc các vị vua chúa.",
    description: "Bánh phục linh và bánh đậu xanh trái cây (bánh quý tộc) là đỉnh cao nghệ thuật tạo hình ẩm thực hoàng cung triều Nguyễn. Dưới sự hướng dẫn của nghệ nhân ẩm thực, từ bột đậu xanh mịn màng, bạn sẽ tự tay nặn thành những quả ớt, quả khế, trái xoài bé xinh rồi nhúng qua lớp rau câu bóng mượt rực rỡ sắc màu. Một trải nghiệm vừa khéo tay, vừa đậm đà phong vị vương giả cung đình.",
    image: "https://huetripo.hue.gov.vn/uploads/SanPham/2026/9/banhphuclinh_1790154653.jpg",
    duration: "2 - 3 giờ",
    location: "Các không gian văn hóa ẩm thực đường Nguyễn Huệ & Lê Huân",
    priceText: "Từ 200.000đ - 350.000đ / người (kèm hộp bánh mang về)",
    rating: 4.95,
    reviewCount: 260,
    bestTime: "09:00 sáng hoặc 14:30 chiều",
    highlights: [
      "Tự tay làm ra hộp bánh trái cây ngũ sắc cung đình mang về làm quà",
      "Tìm hiểu bí quyết làm bánh tiến vua từ nghệ nhân gia truyền",
      "Thưởng thức bánh nóng hổi cùng trà sen thơm lừng",
    ],
    tips: [
      "Rất thích hợp cho các gia đình có trẻ em rèn luyện tính khéo léo",
      "Bánh bảo quản được trong tủ mát từ 2 đến 3 ngày",
    ],
    suitableFor: "Gia đình có trẻ nhỏ, các bạn nữ yêu thích làm bánh và nấu ăn",
  },
];

export const serviceGroups = [
  {
    title: "Khách sạn & lưu trú",
    description: "Tìm nơi nghỉ phù hợp với hành trình.",
    icon: "hotel",
  },
  {
    title: "Nhà hàng & ẩm thực",
    description: "Khám phá hương vị địa phương.",
    icon: "utensils",
  },
  {
    title: "Tour & trải nghiệm",
    description: "Chọn hành trình khám phá cùng hướng dẫn viên.",
    icon: "compass",
  },
  {
    title: "Di chuyển",
    description: "Thông tin phương tiện và thuê xe.",
    icon: "car",
  },
  {
    title: "Mua sắm đặc sản",
    description: "Quà tặng và sản phẩm địa phương.",
    icon: "shopping-bag",
  },
  {
    title: "Sự kiện & lễ hội",
    description: "Cập nhật hoạt động văn hóa tại Huế.",
    icon: "calendar-days",
  },
  
];

 // ===============================
// QUẢN LÝ ĐỊA ĐIỂM TỪ ADMIN
// ===============================

export const ADMIN_DESTINATIONS_KEY = "huesmart-admin-destinations";
export const ADMIN_OVERRIDES_KEY = "huesmart-admin-overrides";
export const ADMIN_DELETED_KEY = "huesmart-admin-deleted";

const DEFAULT_IMAGE =
  "/images/hero-banner.jpg";

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function normalizeDestination(
  item: Partial<TravelItem>,
  index: number
): TravelItem {
  return {
    id: String(item.id ?? `custom-${Date.now()}-${index}`),
    name: typeof item.name === "string" ? item.name : "Địa điểm mới",
    category: typeof item.category === "string" ? item.category : "Khám phá",
    description:
      typeof item.description === "string"
        ? item.description
        : "Đang cập nhật thông tin.",
    address: typeof item.address === "string" ? item.address : "Thành phố Huế",
    image:
      typeof item.image === "string" && item.image.trim()
        ? item.image
        : DEFAULT_IMAGE,
    price: String(item.price ?? "Chưa cập nhật"),
    duration: String(item.duration ?? "1 giờ"),
    rating: Number.isFinite(Number(item.rating)) ? Number(item.rating) : 0,
    ratingCount: Number.isFinite(Number(item.ratingCount))
      ? Number(item.ratingCount)
      : undefined,
    openingHours:
      typeof item.openingHours === "string"
        ? item.openingHours
        : undefined,
    details:
      Array.isArray(item.details) && item.details.length > 0
        ? item.details
        : DESTINATION_DETAILS[String(item.id)] ?? item.details,
    lat: Number.isFinite(Number(item.lat)) ? Number(item.lat) : 16.4637,
    lng: Number.isFinite(Number(item.lng)) ? Number(item.lng) : 107.5909,
  };
}

export function experienceToTravelItem(exp: HueExperience): TravelItem {
  return {
    id: exp.id,
    name: exp.title,
    category: exp.tag,
    description: exp.text || exp.description,
    address: exp.location,
    image: exp.image,
    price: exp.priceText,
    duration: exp.duration,
    rating: exp.rating,
    ratingCount: exp.reviewCount,
    details: [
      {
        heading: exp.title,
        paragraphs: [exp.description],
      },
    ],
    lat: 16.4637,
    lng: 107.5909,
  };
}

export const getAllDestinations = (): TravelItem[] => {
  if (typeof window === "undefined") {
    return destinations.map((item, index) => normalizeDestination(item, index));
  }

  const overrides = readArray<Partial<TravelItem>>(ADMIN_OVERRIDES_KEY);
  const deletedIds = readArray<string>(ADMIN_DELETED_KEY);
  const customItems = readArray<Partial<TravelItem>>(ADMIN_DESTINATIONS_KEY);

  const overrideMap = new Map(
    overrides.map((item) => [String(item.id), item])
  );

  const deletedSet = new Set(deletedIds.map(String));

  const defaultItems = destinations
    .filter((item) => !deletedSet.has(item.id))
    .map((item) =>
      normalizeDestination(
        { ...item, ...(overrideMap.get(item.id) ?? {}) },
        0
      )
    );

  const customIds = new Set<string>();

  const normalizedCustomItems = customItems
    .map((item, index) => normalizeDestination(item, index))
    .filter((item) => {
      if (deletedSet.has(item.id) || customIds.has(item.id)) return false;
      customIds.add(item.id);
      return !destinations.some((base) => base.id === item.id);
    });

  const experienceItems = experiences.map(experienceToTravelItem);

  return [...defaultItems, ...normalizedCustomItems, ...experienceItems];
};
