# Thiết kế Website Mời Bạn Gái Đi Chơi (Ask For Date Template)

**Ngày:** 2026-11-26  
**Quy mô:** Dự án mới (Project)  
**Trạng thái:** Đã chốt yêu cầu (chờ duyệt để lập plan code)

---

## 1. Mục đích & Bối cảnh (Intent & Why)

Xây dựng một website thiệp mời đi chơi hoàn chỉnh, mang tính cá nhân hóa và giàu cảm xúc để gửi cho bạn gái, đồng thời đóng gói dưới dạng **template mã nguồn mở** để bất kỳ ai cũng có thể clone/fork về, chỉnh sửa nhanh thông tin cá nhân và deploy miễn phí để sử dụng.

---

## 2. Mục tiêu, Phi mục tiêu & Điều cần tránh

### Mục tiêu (Goals)
- **Trải nghiệm cảm xúc & mượt mà (Mobile-first):** Người nhận thường mở link trực tiếp từ Messenger/Zalo trên điện thoại, nên giao diện phải đẹp, ấm áp, dễ đọc và thao tác mượt trên màn hình nhỏ.
- **Đầy đủ 4 phần cốt lõi:**
  1. **Dòng tâm sự ngắn ở đầu (Hero & Note):** Tên người gửi/người nhận, tiêu đề lời mời và một đoạn tâm sự ngắn chân thành.
  2. **Ảnh địa điểm & mô tả (Places Showcase):** Hiển thị các địa điểm dự kiến kèm ảnh, tên địa điểm, mô tả ngắn, và link bản đồ (tùy chọn) như một lịch trình gợi ý cố định (bạn gái chỉ xem, không cần tick chọn địa điểm).
  3. **Lịch chọn ngày (Interactive Calendar):** Lịch theo tháng (tiếng Việt) cho phép người nhận chọn 1 ngày đi chơi trong danh sách ngày rảnh/gợi ý mà người gửi cấu hình sẵn, kèm khung giờ (tùy chọn) và lời nhắn ngắn.
  4. **Xác nhận & "Vé hẹn hò" (Confirmation Ticket):** Sau khi bấm xác nhận, hiển thị tấm vé tóm tắt buổi hẹn kèm:
     - Nút tải file lịch `.ics` để thêm vào Google Calendar / Apple Calendar.
     - Nút copy tin nhắn tóm tắt hoặc mở nhanh link nhắn tin (Messenger/Zalo nếu cấu hình).
     - Tùy chọn gửi thông báo tự động qua Webhook (Formspree / Discord Webhook / endpoint JSON bất kỳ) nếu người dùng điền URL trong config. *(Không gọi thẳng Telegram Bot API từ trình duyệt để tránh lộ bot token).*
- **Ai cũng dùng được (Template thân thiện):**
  - Toàn bộ giao diện, lịch, vé hẹn hò và `README.md` dùng **thuần tiếng Việt**.
  - Toàn bộ nội dung tùy biến nằm gọn trong 1 file TypeScript có type-checking (`src/config/dateConfig.ts`) và thư mục ảnh `public/images/`.
  - Có `README.md` hướng dẫn chi tiết từng bước từ cài đặt, sửa nội dung, thay ảnh đến deploy lên Vercel / Netlify / GitHub Pages.

### Phi mục tiêu (Non-goals)
- Không làm hệ thống SaaS đa người dùng (không có trang tạo link online trên web, không có đăng nhập/tài khoản).
- Không xây dựng backend server hay database riêng.
- Không tích hợp thanh toán hay đặt bàn thật.

### Điều cần tránh (Anti-goals)
- Không bắt người dùng phải cấu hình biến môi trường (`.env`), API key, hay database phức tạp mới chạy được.
- Không để giao diện vỡ khi người dùng thêm bớt số lượng địa điểm, viết tâm sự dài hơn mẫu, hoặc bỏ trống các trường tùy chọn.
- Không chặn hiển thị "Vé hẹn hò" nếu webhook chưa cấu hình hoặc gửi thất bại.

---

## 3. Ràng buộc kỹ thuật (Constraints)

- **100% Static Web App:** Build ra thư mục tĩnh (`dist/`), chạy tốt trên GitHub Pages, Vercel, Netlify mà không cần server Node.js lúc runtime.
- **An toàn cấu hình:** Nếu thiếu trường tùy chọn (link bản đồ, khung giờ, webhook, link mạng xã hội), UI tự động ẩn phần đó một cách tự nhiên.
- **Tương thích tên miền con (Subpath):** Cấu hình Vite hỗ trợ deploy lên GitHub Pages dạng `username.github.io/repo-name/` (qua `base` config hoặc hướng dẫn rõ trong README).

---

## 4. Các phương án đã cân nhắc (Approaches)

1. **Vite + React + TypeScript + Tailwind CSS (Đã chọn):**
   - **Lý do chọn:** Tách component rõ ràng (Header tâm sự, Places, Calendar, Ticket), TypeScript kiểm tra lỗi ngay khi người dùng sửa file `dateConfig.ts`, xử lý trạng thái lịch tương tác sạch sẽ, dễ tạo hiệu ứng mượt mà và build ra file tĩnh rất nhẹ.
   - **Đánh đổi:** Người dùng muốn tùy biến cần cài Node.js (hoặc fork lên Vercel để Vercel tự build).
2. **HTML + CSS + Vanilla JavaScript thuần:**
   - **Ưu điểm:** Không cần Node.js hay bước build.
   - **Lý do loại:** Logic lịch chọn ngày, tạo file `.ics`, responsive gallery và validation config viết bằng JS thuần dễ rối và khó bảo trì hơn.
3. **Next.js / Astro:**
   - **Lý do loại:** Quá cồng kềnh cho một trang single-page thiệp mời tĩnh không dùng SSR/backend.

---

## 5. Kiến trúc & Luồng người dùng (Architecture & Flow)

### Cấu trúc thư mục dự kiến
- `src/types/invite.ts`: Định nghĩa TypeScript interfaces cho cấu hình lời mời và dữ liệu phản hồi.
- `src/config/dateConfig.ts`: File cấu hình duy nhất người dùng cần sửa (tâm sự, danh sách địa điểm, ngày gợi ý/cho phép chọn, khung giờ, webhook tùy chọn, text nút bấm).
- `src/components/`:
  - `HeroSection.tsx`: Tiêu đề, tên cặp đôi, dòng tâm sự ngắn ở đầu.
  - `PlacesSection.tsx`: Danh sách card địa điểm (ảnh, tên, mô tả, link Google Maps tùy chọn, trạng thái chọn nếu bật chế độ cho phép chọn địa điểm).
  - `DateCalendarSection.tsx`: Lịch chọn ngày tương tác + chọn khung giờ (nếu có) + ô nhập lời nhắn của bạn gái.
  - `ConfirmationTicket.tsx`: Màn hình "Vé hẹn hò" sau khi xác nhận, nút tải `.ics`, nút copy tin nhắn, nút mở link chat, trạng thái gửi webhook (nếu có).
- `src/utils/`:
  - `ics.ts`: Tạo và tải xuống file `.ics` chuẩn iCalendar từ ngày/giờ/địa điểm đã chọn.
  - `webhook.ts`: Gửi POST request nhẹ (JSON) tới webhook URL nếu được cấu hình; lỗi không làm gián đoạn trải nghiệm.
- `public/images/`: Chứa ảnh mẫu và ảnh người dùng thay thế (hỗ trợ cả URL ảnh online).

### Luồng cấu hình & dữ liệu chính (`DateInviteConfig`)
- **Thông tin chung:** `senderName`, `recipientName`, `pageTitle`, `introHeadline`, `heartfeltNote`.
- **Địa điểm (`places`):** Mảng các object `{ id, name, description, image, mapUrl?, tag?, timeHint? }` hiển thị theo thứ tự lịch trình gợi ý cố định.
- **Lịch (`calendar`):**
  - Danh sách ngày khả dụng (`availableDates: string[]` theo format `YYYY-MM-DD`) hoặc khoảng ngày (`startDate`, `endDate`, tùy chọn `disabledDates`).
  - Khung giờ gợi ý tùy chọn (`timeSlots?: string[]`, ví dụ `["18:00", "19:30"]`).
- **Phản hồi (`response`):**
  - `webhookUrl?: string` (Formspree / Discord Webhook / custom JSON endpoint).
  - `messengerOrZaloUrl?: string` (tùy chọn nút mở thẳng khung chat sau khi xác nhận).

---

## 6. Phần để người triển khai tự quyết định (Left to the Builder)

- Bảng màu, font chữ, phong cách thẩm mỹ cụ thể (đảm bảo tinh tế, ấm áp, lãng mạn).
- Thư viện icon (ví dụ `lucide-react`) và hiệu ứng chuyển động (CSS transitions hoặc `framer-motion`).
- Cách dựng component lịch (tự viết lưới lịch 7 cột với `date-fns` hoặc dùng thư viện nhẹ như `react-day-picker`).
- Nội dung mẫu (tiếng Việt tự nhiên, dễ thương) và ảnh placeholder đẹp để người khác xem demo chạy được ngay sau `npm run dev`.
