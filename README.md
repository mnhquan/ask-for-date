# Ask For Date — Thiệp mời hẹn hò đầu tiên

Website thiệp mời đi chơi mã nguồn mở, **thuần tiếng Việt**, chạy **tĩnh 100%** (không cần backend hay database). Bất kỳ ai cũng có thể clone/fork về, sửa đúng 1 file cấu hình và deploy miễn phí để gửi cho người mình thích.

## Luồng trải nghiệm

1. **Lời chào đầu tiên:** Hiển thị lời chào và đoạn tâm sự ngắn mở đầu, có nút **Tiếp tục**.
2. **Câu hỏi lời mời:** *"Em có muốn chúng mình có buổi hẹn đầu tiên không?"* với 2 nút **Có** và **Không** (nút **Không** sẽ bay nhảy né tránh trong khung hình mỗi khi bấm vào).
3. **Lịch chọn ngày:** Cho phép bấm chuyển tiếp/lùi giữa các tháng để chọn ngày phù hợp, chọn khung giờ gợi ý (tùy chọn) và viết lời nhắn nhỏ.
4. **Xác nhận & Gửi câu trả lời:** Hiển thị lời chào kết, chú thích rằng hai đứa sẽ cùng bàn luận và chọn địa điểm hẹn hò sau, kèm các nút:
   - **Lưu vào lịch (.ics)** cho Google Calendar / Apple Calendar.
   - **Gửi thông báo tự động** (tùy chọn qua Formspree hoặc Discord Webhook).

---

## Cách cài đặt & chạy thử trên máy

Yêu cầu: Đã cài [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).

```bash
# 1. Cài các thư viện cần thiết
npm install

# 2. Chạy bản xem thử trên trình duyệt
npm run dev
```

Mở link `http://localhost:5173` hiện trên terminal để xem giao diện.

---

## Cách tùy biến nội dung của riêng bạn

Bạn **chỉ cần sửa duy nhất 1 file**: `src/config/dateConfig.ts`.

Trong file này bạn có thể chỉnh:
- `pageTitle`, `senderName`, `recipientName`: Tên hiển thị trên tab trình duyệt và trong lời mời.
- `welcome`: Lời chào đầu tiên, đoạn tâm sự ngắn và chữ trên nút tiếp tục.
- `question`: Câu hỏi lời mời, chữ trên nút **Có / Không**, và danh sách câu trêu nhẹ khi nút **Không** bay nhảy.
- `calendar`:
  - `availableDates`: Để `[]` nếu muốn cho người nhận tự do chọn bất kỳ ngày nào từ hôm nay trở đi; hoặc điền danh sách ngày cụ thể dạng `['2026-12-05', '2026-12-06']`.
  - `disabledDates`: Các ngày bạn bận muốn khóa.
  - `timeSlots`: Danh sách khung giờ gợi ý (hoặc để `[]` nếu không cần chọn giờ).
- `confirmation`: Lời chào kết và chú thích bàn luận địa điểm sau.
- `response`:
  - `webhookUrl` *(tùy chọn)*: Mặc định đọc từ biến môi trường `VITE_WEBHOOK_URL`. Để không bị lộ link **Formspree** hoặc **Discord Webhook** khi đẩy code lên GitHub công khai:
    1. Tạo file `.env.local` (copy từ `.env.example`) và điền `VITE_WEBHOOK_URL=link_cua_ban` khi chạy trên máy.
    2. Khi deploy lên **Vercel / Netlify**, thêm biến `VITE_WEBHOOK_URL` trong mục **Environment Variables**.
  - `messengerOrZaloUrl` *(tùy chọn)*: Dán link `https://m.me/username` hoặc `https://zalo.me/so_dien_thoai` để hiện nút mở nhanh khung chat.

---

## Cách đưa lên mạng (Deploy miễn phí)

### Cách 1: Vercel hoặc Netlify (Dễ nhất)
1. Đẩy code lên GitHub cá nhân của bạn.
2. Vào [vercel.com](https://vercel.com) hoặc [netlify.com](https://netlify.com), chọn **Import Git Repository**.
3. Framework chọn **Vite**, Build Command là `npm run build`, Output Directory là `dist`. Bấm **Deploy** là có link gửi ngay!

### Cách 2: GitHub Pages
1. Chạy `npm run build` để tạo thư mục `dist/`.
2. Đẩy nội dung thư mục `dist/` lên nhánh `gh-pages` (hoặc dùng GitHub Actions). Project đã cấu hình sẵn `base: './'` trong `vite.config.ts` nên chạy tốt cả khi nằm ở subpath `username.github.io/ask-for-date/`.
