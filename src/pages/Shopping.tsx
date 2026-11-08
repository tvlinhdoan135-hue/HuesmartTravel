
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  MapPin,
  Heart,
  ShoppingBag,
  Gift,
  Utensils,
  Coffee,
  Leaf,
  Sparkles,
  X,
} from "lucide-react";
import "../styles/Shopping.css";

type ProductCategory =
  | "Đặc sản"
  | "Quà lưu niệm"
  | "Sản phẩm OCOP"
  | "Thủ công mỹ nghệ"
  | "Thực phẩm"
  | "Đồ uống";

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  image: string;
  price: number;
  shops: number;
  description: string;
  date: number;
  detailUrl?: string;
  priceMax?: number;
  sellers?: {
    name: string;
    address: string;
    phone?: string;
    opens?: string;
    closes?: string;
    type?: string;
    url: string;
  }[];
  detailSections?: {
    title: string;
    paragraphs: string[];
  }[];
};

const categories = [
  "Tất cả",
  "Đặc sản",
  "Quà lưu niệm",
  "Sản phẩm OCOP",
  "Thủ công mỹ nghệ",
  "Thực phẩm",
  "Đồ uống",
] as const;

export const products: Product[] = [
  {
    id: 1,
    name: "Bánh Phục Linh",
    category: "Đặc sản",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/9/banhphuclinh_1790154653.jpg",
    price: 50000,
    shops: 1,
    priceMax: 100000,
    description:
      "Bánh Phục Linh là thức bánh truyền thống Huế làm từ bột bình tinh và đường. Bánh nhỏ, hoa văn ép khuôn tinh tế, vị ngọt dịu, khô mịn và tan nhẹ trong miệng; thường dùng cùng trà nóng.",
    date: 6,
    detailUrl:
      "https://huetripo.hue.gov.vn/co-so-dich-vu/dac-san-hang-luu-niem/dac-san/banh-phuc-linh-051882",
    sellers: [
      {
        name: "Công ty TNHH Thiên Hương",
        address: "20 Chi Lăng",
        phone: "0903 586 895",
        opens: "07:30",
        closes: "20:30",
        type: "Cửa hàng đặc sản và quà tặng",
        url: "/co-so-dich-vu/cua-hang-dac-san-va-qua-tang/cong-ty-tnhh-thien-huong-391171",
      },
    ],
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Bánh Phục Linh là thức bánh truyền thống thanh nhã của Huế. Bánh nhỏ, được ép khuôn với hoa văn tinh tế, có vị ngọt dịu, khô mịn và tan nhẹ trong miệng. Người Huế thường thưởng thức bánh cùng trà nóng.",
        ],
      },
      {
        title: "Lịch sử và nguồn gốc",
        paragraphs: [
          "Bánh đã hiện diện lâu đời trong nếp ẩm thực Huế, từng được dùng trong các gia đình, phủ đệ và dịp lễ Tết. Qua thời gian, món bánh được lưu truyền trong dân gian và trở thành hương vị gợi nhớ Huế xưa.",
          "Tên gọi và thời điểm xuất hiện chính xác chưa được xác định rõ trong các tư liệu hiện có.",
        ],
      },
      {
        title: "Nguyên liệu",
        paragraphs: [
          "Bánh Phục Linh truyền thống thường làm từ bột bình tinh (bột huỳnh tinh) và đường. Tùy cách làm của từng cơ sở, hương vị có thể được điều chỉnh.",
          "Chất lượng bột góp phần tạo nên độ mịn và khả năng tan nhẹ đặc trưng của bánh.",
        ],
      },
      {
        title: "Cách chế biến",
        paragraphs: [
          "Bột được xử lý đến độ khô mịn phù hợp, trộn với đường rồi nén vào khuôn nhỏ. Người làm bánh cần khéo léo lấy bánh ra để giữ nguyên hình dáng và hoa văn.",
          "Khuôn thường có họa tiết hoa lá hoặc chữ mang ý nghĩa tốt lành như Phúc, Lộc, Thọ, Song Hỷ.",
        ],
      },
      {
        title: "Giá trị văn hóa",
        paragraphs: [
          "Từ nguyên liệu mộc mạc đến cách tạo hình tinh tế, Bánh Phục Linh thể hiện nét thanh nhã trong ẩm thực Huế. Việc gìn giữ kỹ thuật làm bánh và khuôn bánh truyền thống cũng góp phần lưu giữ ký ức văn hóa qua nhiều thế hệ.",
        ],
      },
      {
        title: "Gợi ý thưởng thức",
        paragraphs: [
          "Thưởng thức bánh cùng một tách trà nóng giúp cảm nhận rõ vị ngọt nhẹ và kết cấu tan mềm. Bánh cũng là món quà gọn nhẹ, mang dấu ấn ẩm thực địa phương.",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Sen Huế",
    category: "Thực phẩm",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/8/hat-sen-tuoi-600x600_1786326265.png",
    price: 200000,
    shops: 4,
    priceMax: 250000,
    description:
      "Sen Huế gắn với cảnh quan và văn hóa ẩm thực Cố đô. Hạt sen được dùng trong chè và các món ăn truyền thống; hoa sen còn được dùng để ướp trà.",
    date: 5,
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Sen Huế là hình ảnh đặc trưng gắn liền với cảnh quan, đời sống văn hóa và nghệ thuật ẩm thực của vùng đất Cố đô. Hoa sen tạo nên vẻ đẹp thanh bình cho hồ nước, khu vườn và không gian di tích, đồng thời được sử dụng trong nhiều sản phẩm ẩm thực truyền thống.",
        ],
      },
      {
        title: "Sen trong văn hóa Huế",
        paragraphs: [
          "Trong văn hóa truyền thống, hoa sen gắn với hình ảnh thanh khiết, tao nhã và bình dị. Tại Huế, sen đặc biệt gắn với không gian hồ Tịnh Tâm và các khu vườn truyền thống.",
        ],
      },
      {
        title: "Sen trong ẩm thực",
        paragraphs: [
          "Hạt sen được dùng để chế biến chè sen và nhiều món ăn truyền thống. Hoa sen còn được dùng để ướp trà, tạo hương thơm nhẹ nhàng.",
        ],
      },
      {
        title: "Giá trị văn hóa và du lịch",
        paragraphs: [
          "Du khách có thể tìm hiểu về sen qua cảnh sắc mùa sen, trà sen và các món ăn từ sen. Hình ảnh hoa sen, hồ sen và sản phẩm từ sen góp phần tạo nên nét thanh tao riêng của văn hóa Huế.",
        ],
      },
    ],
    sellers: [
      {
        name: "Công ty TNHH Thiên Hương",
        address: "20 Chi Lăng",
        phone: "0903 586 895",
        opens: "07:30",
        closes: "20:30",
        type: "Cửa hàng đặc sản và quà tặng",
        url: "/co-so-dich-vu/cua-hang-dac-san-va-qua-tang/cong-ty-tnhh-thien-huong-391171",
      },
      {
        name: "Chợ Đông Ba Huế",
        address: "2 Trần Hưng Đạo, Phú Xuân, Huế",
        opens: "06:30",
        closes: "19:00",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-dong-ba-hue-759007",
      },
      {
        name: "Đặc Sản Cố Đô - Lý Hùng",
        address: "62B Nguyễn Phúc Nguyên, phường Kim Long",
        phone: "(+84) 905 515 919; (+84) 935 613 978",
        opens: "07:30",
        closes: "21:00",
        type: "Cửa hàng",
        url: "/co-so-dich-vu/cua-hang/dac-san-co-do-ly-hung-117104",
      },
      {
        name: "Hạt sen cô Tâm",
        address: "290 Đinh Tiên Hoàng, phường Phú Xuân",
        phone: "(+84) 346 918 569; (+84) 389 706 406",
        opens: "07:30",
        closes: "21:00",
        type: "Cửa hàng",
        url: "/co-so-dich-vu/cua-hang/hat-sen-co-tam-893815",
      },
    ],
  },
  {
    id: 3,
    name: "Bánh Nậm (cấp đông)",
    category: "Thực phẩm",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/BeoNamLocHue_dacsanhue_18_4_2023_18_36_33_718_CH_1783938244.jpg",
    price: 30000,
    shops: 0,
    priceMax: 35000,
    description:
      "Bánh Nậm là món bánh truyền thống Huế làm từ bột gạo, nhân tôm thịt và gói lá. Sản phẩm được giới thiệu ở dạng cấp đông.",
    date: 4,
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Bánh Nậm là món bánh truyền thống tiêu biểu của ẩm thực Huế, thường có lớp bột gạo mỏng, nhân tôm thịt và được gói thành chiếc bánh dẹt nhỏ.",
        ],
      },
      {
        title: "Nguyên liệu",
        paragraphs: [
          "Nguyên liệu thường gồm bột gạo, tôm, thịt heo, hành lá, gia vị và lá dùng để gói. Nhân tôm thịt được nêm nếm riêng; bột gạo được khuấy đến độ sánh phù hợp trước khi tráng mỏng.",
        ],
      },
      {
        title: "Cách chế biến",
        paragraphs: [
          "Bột được phết thành lớp mỏng trên lá, thêm nhân tôm thịt rồi gấp lại và hấp chín. Bánh đạt độ mềm, mịn với phần nhân phân bố đều.",
          "Cách gói bánh đòi hỏi sự khéo léo để bánh phẳng, gọn và đều nhau.",
        ],
      },
      {
        title: "Hương vị và cách thưởng thức",
        paragraphs: [
          "Bánh có vị mềm nhẹ của bột gạo kết hợp với phần nhân đậm đà. Bánh thường được dùng khi còn nóng hoặc ấm, ăn cùng nước mắm pha.",
        ],
      },
      {
        title: "Giá trị văn hóa",
        paragraphs: [
          "Bánh Nậm cùng bánh Bèo, bánh Lọc và nhiều món bánh dân gian khác làm nên nét riêng của ẩm thực Huế, với cách chế biến tỉ mỉ và hương vị hài hòa.",
        ],
      },
      {
        title: "Lưu ý khi mua",
        paragraphs: [
          "Dữ liệu Huế TRIPO hiện chưa ghi nhận địa chỉ bán cho sản phẩm này. Vui lòng kiểm tra thông tin bao bì, hướng dẫn bảo quản và chế biến đối với sản phẩm cấp đông.",
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Chả cua Huế",
    category: "Thực phẩm",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/chacuahue_1783938007.jpg",
    price: 150000,
    shops: 2,
    priceMax: 200000,
    description:
      "Chả cua Huế nổi bật với vị ngọt tự nhiên của thịt cua và độ dai giòn. Chả thường được dùng trong bún bò Huế, canh bún hoặc món lẩu.",
    date: 3,
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Chả cua Huế là đặc sản của xứ Cố đô, nổi bật với vị ngọt tự nhiên của thịt cua và kết cấu dai giòn. Đây là nguyên liệu thường dùng trong bún bò Huế, canh bún hoặc các món lẩu.",
        ],
      },
      {
        title: "Nguyên liệu và cách chế biến",
        paragraphs: [
          "Theo thông tin giới thiệu sản phẩm, chả thường được làm từ thịt cua, thịt heo, mỡ và gia vị; hỗn hợp được quết, tạo hình rồi hấp chín.",
        ],
      },
      {
        title: "Gợi ý sử dụng",
        paragraphs: [
          "Có thể dùng chả cua làm nguyên liệu cho món nước hoặc món lẩu. Hãy xem hướng dẫn bảo quản và chế biến trên sản phẩm khi mua.",
        ],
      },
    ],
    sellers: [
      {
        name: "Chợ Tây Lộc",
        address: "209 Nguyễn Trãi",
        opens: "06:30",
        closes: "18:30",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-tay-loc-815306",
      },
      {
        name: "Chợ Đông Ba Huế",
        address: "2 Trần Hưng Đạo, Phú Xuân, Huế",
        opens: "06:30",
        closes: "19:00",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-dong-ba-hue-759007",
      },
    ],
  },
  {
    id: 5,
    name: "Kẹo mè xửng",
    category: "Đặc sản",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/mexung2_1783929847.jpg",
    price: 65000,
    shops: 5,
    priceMax: 100000,
    description:
      "Kẹo mè xửng kết hợp mạch nha, đường, đậu phộng và mè rang; thường được đóng gói gọn để thưởng thức hoặc làm quà.",
    date: 2,
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Kẹo mè xửng là đặc sản Huế với vị thơm, béo và bùi từ các nguyên liệu truyền thống như mạch nha, đường, đậu phộng và mè (vừng).",
          "Kẹo thường được đóng gói gọn, tiện mang theo và làm quà. Giá tham khảo thay đổi theo quy cách và thương hiệu.",
        ],
      },
      {
        title: "Hương vị và cách thưởng thức",
        paragraphs: [
          "Vị ngọt dẻo của kẹo hòa cùng mùi thơm của mè và độ bùi của đậu phộng. Có thể dùng kèm trà nóng.",
        ],
      },
    ],
    sellers: [
      {
        name: "CSSX Mè Xửng Nam Thuận",
        address: "201 Huỳnh Thúc Kháng",
        opens: "07:30",
        closes: "20:30",
        type: "Cửa hàng đặc sản và quà tặng",
        url: "/co-so-dich-vu/cua-hang-dac-san-va-qua-tang/cssx-me-xung-nam-thuan-877704",
      },
      {
        name: "Đặc Sản Cố Đô - Lý Hùng",
        address: "62B Nguyễn Phúc Nguyên, phường Kim Long",
        phone: "(+84) 905 515 919; (+84) 935 613 978",
        opens: "07:30",
        closes: "21:00",
        type: "Cửa hàng",
        url: "/co-so-dich-vu/cua-hang/dac-san-co-do-ly-hung-117104",
      },
      {
        name: "Công ty TNHH Thiên Hương",
        address: "20 Chi Lăng",
        phone: "0903 586 895",
        opens: "07:30",
        closes: "20:30",
        type: "Cửa hàng đặc sản và quà tặng",
        url: "/co-so-dich-vu/cua-hang-dac-san-va-qua-tang/cong-ty-tnhh-thien-huong-391171",
      },
      {
        name: "Chợ An Cựu",
        address: "89 Hùng Vương",
        opens: "06:30",
        closes: "18:30",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-an-cuu-731025",
      },
      {
        name: "Chợ Đông Ba Huế",
        address: "2 Trần Hưng Đạo, Phú Xuân, Huế",
        opens: "06:30",
        closes: "19:00",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-dong-ba-hue-759007",
      },
    ],
  },
  {
    id: 6,
    name: "Trà cung đình Huế",
    category: "Đồ uống",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/Khamphahue_TraCungDinhDucPhuongHue_1783928087.jpg",
    price: 40000,
    shops: 2,
    priceMax: 80000,
    description:
      "Trà cung đình Huế là trà thảo mộc, có thể gồm hoa cúc, cam thảo, đinh hương, hoa lài, cỏ ngọt và các thành phần khác tùy sản phẩm.",
    date: 1,
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Trà cung đình Huế là trà thảo mộc gắn với văn hóa thưởng trà của Cố đô. Thành phần được giới thiệu có thể gồm hoa cúc, cam thảo, đinh hương, hoa lài, cỏ ngọt và các loại thảo mộc khác.",
          "Sản phẩm được đóng gói để sử dụng hoặc làm quà. Thành phần thực tế có thể khác nhau tùy nhà sản xuất; hãy kiểm tra nhãn sản phẩm trước khi sử dụng.",
        ],
      },
      {
        title: "Gợi ý thưởng thức",
        paragraphs: [
          "Pha trà theo hướng dẫn của nhà sản xuất. Có thể dùng trà trong những phút thư giãn hoặc thưởng thức cùng đặc sản Huế.",
        ],
      },
    ],
    sellers: [
      {
        name: "Chợ Đông Ba Huế",
        address: "2 Trần Hưng Đạo, Phú Xuân, Huế",
        opens: "06:30",
        closes: "19:00",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-dong-ba-hue-759007",
      },
      {
        name: "Cơ sở sản xuất Trà Cung Đình Huế",
        address: "24 Nguyễn Huệ, Thuận Hóa, Huế",
        opens: "07:00",
        closes: "18:00",
        type: "Cửa hàng",
        url: "/co-so-dich-vu/cua-hang/co-so-san-xuat-tra-cung-dinh-hue-785783",
      },
    ],
  },
  {
    id: 7,
    name: "Nón bài thơ",
    category: "Quà lưu niệm",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/khamphahue_nonhue5_1783686432.jpg",
    price: 100000,
    priceMax: 300000,
    shops: 2,
    description:
      "Nón bài thơ là sản phẩm thủ công truyền thống đặc trưng của Huế, được làm từ những lớp lá nón mỏng và chọn lọc kỹ.",
    date: 7,
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Nón bài thơ là sản phẩm thủ công truyền thống gắn với hình ảnh duyên dáng của Huế. Nón được làm từ những lớp lá mỏng, mềm và chọn lọc kỹ; một số sản phẩm có họa tiết ẩn hiện khi soi dưới ánh sáng.",
        ],
      },
      {
        title: "Nét thủ công",
        paragraphs: [
          "Người làm nón cần tỉ mỉ ở các công đoạn tạo khung, sắp lá, bắt vành và khâu nón. Mẫu mã và cách trang trí có thể khác nhau theo nghệ nhân và sản phẩm.",
        ],
      },
      {
        title: "Lưu ý khi chọn mua",
        paragraphs: [
          "Nón bài thơ được giới thiệu với nhiều mức giá tùy loại. Nên hỏi cửa hàng về chất liệu, họa tiết và cách bảo quản trước khi mua.",
        ],
      },
    ],
    sellers: [
      {
        name: "Không gian Văn hóa Lục Bộ",
        address: "53 Hai Bà Trưng, Thuận Hóa, Huế",
        phone: "0919 404 689",
        opens: "07:30",
        closes: "17:30",
        type: "Cửa hàng",
        url: "/co-so-dich-vu/cua-hang/khong-gian-van-hoa-luc-bo-862610",
      },
      {
        name: "Chợ Đông Ba Huế",
        address: "2 Trần Hưng Đạo, Phú Xuân, Huế",
        opens: "06:30",
        closes: "19:00",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-dong-ba-hue-759007",
      },
    ],
  },
  {
    id: 8,
    name: "Tranh sơn mài mỹ nghệ",
    category: "Quà lưu niệm",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/huetourism_lang-le-son-mai-2_1783686563.jpg",
    price: 300000,
    priceMax: 1000000,
    shops: 1,
    description:
      "Tranh sơn mài mỹ nghệ là lựa chọn trang trí và quà lưu niệm mang dấu ấn nghệ thuật thủ công truyền thống.",
    date: 8,
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Tranh sơn mài mỹ nghệ phù hợp với người yêu thích nghệ thuật truyền thống và muốn trang trí không gian sống hoặc làm việc bằng một tác phẩm thủ công.",
          "Đây cũng là món quà lưu niệm có ý nghĩa dành tặng người thân, bạn bè hoặc đối tác. Kích thước, họa tiết và giá bán tùy từng sản phẩm.",
        ],
      },
      {
        title: "Lưu ý khi chọn mua",
        paragraphs: [
          "Nên xem trực tiếp màu sắc, bề mặt, kích thước và cách bảo quản của tranh tại cửa hàng trước khi quyết định.",
        ],
      },
    ],
    sellers: [
      {
        name: "Đồ lưu niệm Asia (Nghĩa Collection Souvenir)",
        address: "21 Võ Thị Sáu, phường Thuận Hóa, thành phố Huế",
        phone: "(+84) 78 777 9289",
        opens: "08:30",
        closes: "22:00",
        type: "Cửa hàng",
        url: "/co-so-dich-vu/cua-hang/do-luu-niem-asia-nghia-collection-souvenir-137174",
      },
    ],
  },
  {
    id: 9,
    name: "Thanh trà Huế",
    category: "Đặc sản",
    image:
      "https://huetripo.hue.gov.vn/uploads/SanPham/2026/Khamphahue_ThanhTraXuHue_ThuyBieu-6_21_9_2021_08_29_47_719_SA_1783928276.jpg",
    price: 25000,
    priceMax: 30000,
    shops: 3,
    description:
      "Thanh trà Huế là trái cây đặc sản có vị ngọt thanh, hơi chua nhẹ, thường vào mùa thu.",
    date: 9,
    detailSections: [
      {
        title: "Giới thiệu",
        paragraphs: [
          "Thanh trà Huế là trái cây đặc sản của vùng đất Cố đô, thường xuất hiện vào mùa thu. Quả có vị ngọt thanh, không gắt và hơi chua nhẹ.",
          "Giá và chất lượng có thể thay đổi theo mùa, kích cỡ và điểm bán. Giá trên trang là mức tham khảo.",
        ],
      },
      {
        title: "Gợi ý chọn mua",
        paragraphs: [
          "Thông tin Huế TRIPO gợi ý chọn quả tròn đều, cầm chắc tay, vỏ xanh vàng hoặc vàng và có mùi thơm. Nên hỏi người bán về mùa thu hoạch và nguồn gốc sản phẩm.",
        ],
      },
      {
        title: "Địa chỉ tham khảo",
        paragraphs: [
          "Có thể tìm mua tại các chợ địa phương hoặc hỏi các nhà vườn ở khu vực Thủy Biều vào mùa thanh trà.",
        ],
      },
    ],
    sellers: [
      {
        name: "Chợ Bến Ngự",
        address: "Phan Bội Châu",
        opens: "06:30",
        closes: "18:30",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-ben-ngu-033595",
      },
      {
        name: "Chợ An Cựu",
        address: "89 Hùng Vương",
        opens: "06:30",
        closes: "18:30",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-an-cuu-731025",
      },
      {
        name: "Chợ Đông Ba Huế",
        address: "2 Trần Hưng Đạo, Phú Xuân, Huế",
        opens: "06:30",
        closes: "19:00",
        type: "Chợ",
        url: "/co-so-dich-vu/cho-/cho-dong-ba-hue-759007",
      },
    ],
  },
];

type SortOption =
  | "Mặc định"
  | "Mới nhất"
  | "Cũ nhất"
  | "Giá từ thấp - cao"
  | "Giá từ cao - thấp";

const sortOptions: SortOption[] = [
  "Mặc định",
  "Mới nhất",
  "Cũ nhất",
  "Giá từ thấp - cao",
  "Giá từ cao - thấp",
];

const money = (value: number) =>
  `${value.toLocaleString("vi-VN")} đ`;

export default function Shopping() {
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Tất cả");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("Mặc định");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("huetravel-shopping-favorites") || "[]",
      ) as number[];
    } catch {
      return [];
    }
  });
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");

    const result = products.filter((product) => {
      const matchesCategory =
        category === "Tất cả" || product.category === category;

      const matchesSearch =
        !keyword ||
        `${product.name} ${product.category} ${product.description}`
          .toLocaleLowerCase("vi")
          .includes(keyword);

      return (
        matchesCategory &&
        matchesSearch &&
        product.price <= maxPrice
      );
    });

    switch (sort) {
      case "Mới nhất":
        return result.sort((a, b) => b.date - a.date);
      case "Cũ nhất":
        return result.sort((a, b) => a.date - b.date);
      case "Giá từ thấp - cao":
        return result.sort((a, b) => a.price - b.price);
      case "Giá từ cao - thấp":
        return result.sort((a, b) => b.price - a.price);
      default:
        return result;
    }
  }, [category, search, sort, maxPrice]);

  function toggleFavorite(id: number) {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      try {
        localStorage.setItem(
          "huetravel-shopping-favorites",
          JSON.stringify(next),
        );
      } catch {
        // Tiếp tục sử dụng danh sách yêu thích trong phiên hiện tại.
      }

      return next;
    });
  }

  return (
    <main className="shopping-page">
      <section className="shopping-hero">
        <div className="shopping-hero-overlay" />
        <div className="shopping-hero-content">
          <span className="shopping-eyebrow">
            <ShoppingBag size={15} /> QUÀ TẶNG TỪ CỐ ĐÔ
          </span>
          <h1>Mua sắm</h1>
          <p>
            Khám phá những đặc sản, sản phẩm OCOP, thủ công mỹ nghệ
            và các vật phẩm lưu niệm mang đậm nét văn hóa Cố đô Huế.
          </p>

          <form
            className="shopping-search"
            onSubmit={(event) => {
              event.preventDefault();
              document
                .getElementById("shopping-products")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm đặc sản, quà lưu niệm..."
              aria-label="Tìm kiếm sản phẩm"
            />
            {search && (
              <button
                type="button"
                className="shopping-clear"
                onClick={() => setSearch("")}
                aria-label="Xóa tìm kiếm"
              >
                <X size={17} />
              </button>
            )}
            <button type="submit" aria-label="Tìm kiếm">
              <Search size={21} />
            </button>
          </form>
        </div>
      </section>

      <section className="shopping-content" id="shopping-products">
        <div className="shopping-heading">
          <div className="shopping-heading-title">
            <span />
            <div>
              <h2>Đặc sản & quà lưu niệm</h2>
              <p>
                Tìm kiếm những món quà mang dấu ấn văn hóa Huế
              </p>
            </div>
          </div>
          <span className="shopping-total">
            {filteredProducts.length} sản phẩm
          </span>
        </div>

        <div className="shopping-categories">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={`shopping-category ${
                category === item ? "active" : ""
              }`}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item === "Tất cả" && <Sparkles size={15} />}
              {item === "Đặc sản" && <Utensils size={15} />}
              {item === "Quà lưu niệm" && <Gift size={15} />}
              {item === "Sản phẩm OCOP" && <ShoppingBag size={15} />}
              {item === "Thủ công mỹ nghệ" && <Sparkles size={15} />}
              {item === "Thực phẩm" && <Leaf size={15} />}
              {item === "Đồ uống" && <Coffee size={15} />}
              {item}
            </button>
          ))}
        </div>

        <div className="shopping-toolbar">
          <button
            type="button"
            className={`shopping-filter-button ${
              showFilters ? "active" : ""
            }`}
            onClick={() => setShowFilters((value) => !value)}
          >
            <SlidersHorizontal size={17} />
            Bộ lọc
            <span>{filteredProducts.length}</span>
          </button>

          <div className="shopping-sort">
            <strong>Sắp xếp theo</strong>
            {sortOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={sort === option ? "active" : ""}
                onClick={() => setSort(option)}
              >
                {option === "Mặc định" ? "Tất cả" : option}
              </button>
            ))}
          </div>
        </div>

        {showFilters && (
          <div className="shopping-filter-panel">
            <label htmlFor="max-price">
              Giá tối đa: <strong>{money(maxPrice)}</strong>
            </label>
            <input
              id="max-price"
              type="range"
              min={30000}
              max={1000000}
              step={10000}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
            />
            <button
              type="button"
              onClick={() => {
                setMaxPrice(1000000);
                setCategory("Tất cả");
                setSearch("");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {filteredProducts.length ? (
          <div className="shopping-grid">
            {filteredProducts.map((product) => (
              <article className="shopping-card" key={product.id}>
                <div className="shopping-card-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="shopping-product-badge">
                    {product.category}
                  </span>
                  <button
                    type="button"
                    className={`shopping-favorite ${
                      favorites.includes(product.id) ? "active" : ""
                    }`}
                    onClick={() => toggleFavorite(product.id)}
                    aria-label="Thêm hoặc bỏ yêu thích"
                    title="Yêu thích"
                  >
                    <Heart
                      size={19}
                      fill={
                        favorites.includes(product.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <div className="shopping-card-body">
                  <h3>{product.name}</h3>
                  <p className="shopping-shop-count">
                    <MapPin size={15} />
                    {product.shops} địa chỉ mua hàng
                  </p>
                  <p className="shopping-price">
                    Giá từ <strong>{money(product.price)}</strong>
                  </p>
                  <Link
                    to={`/shopping/${product.id}`}
                    className="shopping-detail-button"
                  >
                    Xem chi tiết <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="shopping-empty">
            <ShoppingBag size={35} />
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Thử từ khóa hoặc danh mục khác.</p>
            <button
              type="button"
              onClick={() => {
                setCategory("Tất cả");
                setSearch("");
                setMaxPrice(1000000);
                setSort("Mặc định");
              }}
            >
              Hiển thị tất cả
            </button>
          </div>
        )}

        <footer className="shopping-footer">
          Đặc sản Huế · Quà tặng từ miền di sản
        </footer>
      </section>

    </main>
  );
}
