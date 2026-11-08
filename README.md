# HueSmart Travel

Nền tảng khám phá Huế, lập kế hoạch du lịch và quản trị nội dung. Frontend: React + TypeScript + Vite. Backend-as-a-Service: Supabase.

## 1. Yêu cầu
- Node.js LTS (khuyến nghị 22.x)
- npm
- Tài khoản Supabase

## 2. Chạy dự án
```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```
Mở URL Vite hiện trong Terminal, thường là http://localhost:5173.

## 3. Kết nối HueSmart AI với OpenAI
1. Tạo API key mới trong trang quản lý OpenAI. Nếu key đã được chia sẻ qua chat, email hoặc mã nguồn, hãy thu hồi key đó và tạo key mới.
2. Thêm key mới vào `.env` ở thư mục gốc:
   ```dotenv
   OPENAI_API_KEY=YOUR_NEW_OPENAI_API_KEY
   OPENAI_MODEL=gpt-5.5
   ```
   Không đặt key này trong `.env.local`, biến `VITE_*`, frontend hoặc Git.
3. Mở hai Terminal tại thư mục dự án. Chạy frontend trong Terminal thứ nhất:
   ```powershell
   npm run dev
   ```
4. Chạy backend trong Terminal thứ hai:
   ```powershell
   npm run dev:server
   ```
5. Mở `/assistant` trên trang web. Backend mặc định chạy tại `http://localhost:3001`; kiểm tra cấu hình tại `http://localhost:3001/api/health`.

## 4. Kết nối Supabase
1. Tạo project mới tại https://supabase.com/dashboard.
2. Mở Project Settings / Connect và lấy Project URL + publishable key (hoặc anon key tương thích).
3. Điền vào `.env.local`:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```
4. Vào SQL Editor của Supabase, mở `supabase/schema.sql`, dán toàn bộ và Run.
5. Trong Authentication > URL Configuration, đặt Site URL là URL localhost đang dùng và thêm redirect URL nếu cần.
6. Tạo tài khoản qua `/account`.
7. Để cấp quyền Admin, chạy câu SQL cuối file schema.sql và thay email bằng email của bạn.
8. Khởi động lại Vite sau khi thay đổi `.env.local`.

## 5. Các đường dẫn
- `/` Trang chủ
- `/destinations` Điểm tham quan
- `/destinations/:id` Chi tiết điểm tham quan
- `/services` Dịch vụ du lịch (nhóm danh mục)
- `/experiences` Trải nghiệm
- `/events` Sự kiện
- `/planner` Lập lịch trình
- `/assistant` Trợ lý AI du lịch
- `/favorites` Yêu thích
- `/about` Giới thiệu
- `/account` Đăng ký / đăng nhập
- `/admin` Quản trị điểm tham quan

## 6. Bảo mật
- Chỉ đặt URL và publishable/anon key ở frontend.
- Tuyệt đối không đưa `service_role` key vào biến `VITE_*`, mã nguồn frontend hoặc Git.
- RLS được bật trên các bảng trong schema. Admin được xác định qua `profiles.role`.
- Trong môi trường production, rà soát lại chính sách, giới hạn rate, xác minh email và quy trình cấp quyền Admin.
- `OPENAI_API_KEY` chỉ được dùng ở backend; không commit `.env` hoặc đưa key vào mã frontend.

## 7. Trạng thái hiện tại
Đây là nền móng chạy được để phát triển tiếp. Dữ liệu địa điểm và trải nghiệm trong `src/data.ts` là dữ liệu mẫu hiển thị ở frontend. Trang dịch vụ/sự kiện đang là khung danh mục; cần bổ sung dữ liệu thực tế và màn hình CRUD tương ứng. Bộ lập lịch hiện tạo gợi ý quy tắc đơn giản, chưa phải AI tạo sinh. Chưa tích hợp thanh toán, booking trực tiếp hoặc API bản đồ.
