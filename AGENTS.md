# AGENTS.md — Hướng dẫn phối hợp Skills cho dự án `ask-for-date`

Tài liệu này quy định cách các AI agent làm việc trong dự án **Ask For Date** (website thiệp mời đi chơi mã nguồn mở, thuần tiếng Việt, chạy tĩnh 100%).

---

## 1. Nguồn sự thật ưu tiên (Source of Truth)

Trước khi thiết kế hoặc viết code, luôn đọc các file ngữ cảnh của dự án theo thứ tự ưu tiên sau:

1. `PRODUCT.md` — Quy định nền tảng (`web`), tech stack (`Vite + React + TypeScript + Tailwind CSS`), đối tượng sử dụng, và các ràng buộc không backend.
2. `docs/superpowers/specs/2026-11-26-ask-for-date-design.md` — Bản thiết kế chi tiết chức năng & kiến trúc.
3. `.impeccable/config.json` — Cấu hình workflow hiện tại (`"buildPath": "code"`).

> **Nguyên tắc ưu tiên:** Các quyết định trong `PRODUCT.md` và spec luôn thắng mọi gợi ý mặc định từ skill (ví dụ: giao diện **thuần tiếng Việt**, danh sách địa điểm cố định không cần chọn, không dùng backend/database, không lưu token Telegram trên frontend).

---

## 2. Phân vai & Phối hợp 2 Skills (`ui-ux-pro-max` + `impeccable`)

Dự án cài sẵn 2 bộ skill tại `.agents/skills/`. Hãy dùng đúng vai trò của từng skill theo 3 giai đoạn để bổ trợ cho nhau, tránh chạy chồng chéo:

### Giai đoạn 1: Nghiên cứu hệ thống thiết kế (`ui-ux-pro-max`)
Dùng `ui-ux-pro-max` làm **bộ não tra cứu dữ liệu thiết kế & chuẩn UX** trước khi chốt giao diện:
- Chạy script tra cứu cục bộ (dùng `python` / `python3` / `py -3`):
  ```bash
  python .agents/skills/ui-ux-pro-max/scripts/search.py "<từ khóa>" --design-system -p "Ask For Date"
  python .agents/skills/ui-ux-pro-max/scripts/search.py "<vấn đề UX>" --domain ux
  python .agents/skills/ui-ux-pro-max/scripts/search.py "<chi tiết kỹ thuật>" --stack react
  python .agents/skills/ui-ux-pro-max/scripts/search.py "<chi tiết Tailwind>" --stack html-tailwind
  ```
- **Lưu ý đặc thù tiếng Việt:** Khi chọn cặp font chữ từ `ui-ux-pro-max`, **bắt buộc kiểm tra font có hỗ trợ đầy đủ dấu tiếng Việt** (subset `vietnamese` trên Google Fonts).
- Tham khảo `.agents/skills/ui-ux-pro-max/references/pro-rules.md` cho các chuẩn bắt buộc: vùng chạm tối thiểu `44×44px`, độ tương phản `>= 4.5:1`, không scroll ngang trên mobile.

### Giai đoạn 2: Định hình thẩm mỹ & Triển khai UI (`impeccable`)
Dùng `impeccable` làm **đạo diễn nghệ thuật & kiểm soát độ hoàn thiện (craft)** khi bắt đầu code UI:
- Tuân thủ `"buildPath": "code"` trong `.impeccable/config.json`.
- Khi dựng giao diện mới, đọc `.agents/skills/impeccable/reference/new-work.md` và `new-work-world.md` để chuyển hóa kết quả tra cứu từ Giai đoạn 1 thành một thế giới thị giác nhất quán (lưu vào `DESIGN.md` nếu cần).
- **Bắt buộc:** Đọc `.agents/skills/impeccable/reference/craft-floor.md` ngay trước khi viết hoặc chỉnh sửa code UI để tránh các lỗi thẩm mỹ phổ biến.
- *(Ghi chú môi trường)*: Nếu `.agents/skills/impeccable/scripts/impeccable.cmd context` báo lỗi thiếu quyền ghi ra ổ `C:`, không thử tải lại ra ngoài workspace; tiếp tục đọc trực tiếp `PRODUCT.md`, `DESIGN.md` và các file reference trong `.agents/skills/impeccable/reference/`.

### Giai đoạn 3: Kiểm tra, Tinh chỉnh & Hoàn thiện (`impeccable` + `ui-ux-pro-max`)
Sau khi code xong UI, phối hợp cả 2 để rà soát chất lượng:
- Dùng các playbook tinh chỉnh của `impeccable` khi cần:
  - `critique` / `audit` — Đánh giá bố cục, phân cấp thị giác, accessibility và responsive.
  - `polish` / `delight` / `animate` — Trau chuốt chuyển động nhẹ nhàng, tinh tế cho thiệp mời (tôn trọng `prefers-reduced-motion`).
  - `harden` / `adapt` — Kiểm thử các trường hợp biên: mở trên màn hình điện thoại nhỏ (Messenger/Zalo in-app browser), người dùng nhập tâm sự dài, hoặc bỏ trống các trường tùy chọn (`mapUrl`, `timeSlots`, `webhookUrl`).
- Đối chiếu lại checklist cuối cùng trong `.agents/skills/ui-ux-pro-max/references/pro-rules.md`.

---

## 3. Quy ước bắt buộc của dự án

- **Dễ tùy biến cho người khác:** Mọi nội dung thiệp mời (tâm sự, địa điểm, ảnh, ngày rảnh, webhook) phải tập trung trong một file cấu hình có type rõ ràng (`src/config/dateConfig.ts`) và thư mục `public/images/`.
- **Mobile-first:** Trải nghiệm trên điện thoại (375px–430px) là ưu tiên số 1 vì người nhận thường mở link trực tiếp từ ứng dụng nhắn tin.
- **Tài liệu đầy đủ:** `README.md` viết bằng tiếng Việt rõ ràng để người không rành kỹ thuật vẫn sửa config và deploy được lên Vercel / Netlify / GitHub Pages.
