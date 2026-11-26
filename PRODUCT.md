# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript + Tailwind CSS (Static build, deployable to Vercel, Netlify, or GitHub Pages).

## Users

- **Primary creator / sender:** Individuals (developers or tech-comfortable users in Vietnam) who want to invite their girlfriend on a first date by cloning/forking an open-source template, customizing a single config file, and deploying a personal link.
- **Primary recipient:** The girlfriend receiving the link (typically opened on mobile via Messenger or Zalo), who walks through the interactive invitation flow and sends back her chosen date.

## Product Purpose

Provide a complete, ready-to-use, open-source Vietnamese first-date invitation website template that turns asking someone out into a playful, warm, multi-step web experience — while remaining effortless for anyone else to customize and deploy without a backend or database.

## Positioning

A zero-backend, single-config-file static invitation template tailored specifically for Vietnamese couples with a playful 4-step flow: heartfelt greeting, interactive "Yes/No" invitation (with a dodging "No" button), monthly date-picking calendar, and a warm confirmation note explaining that date spots will be decided together afterward, with `.ics` export, chat copy/deep-link, and optional Formspree/Discord webhook notification.

## Operating Context

- **Creator workflow:** Clone/fork repository -> edit `src/config/dateConfig.ts` -> run `npm run build` or deploy directly to Vercel / Netlify / GitHub Pages.
- **Recipient workflow:**
  1. **Lời chào đầu tiên:** Đọc lời chào & dòng tâm sự ngắn, bấm **"Tiếp tục"**.
  2. **Câu hỏi lời mời:** *"Em có muốn chúng mình có buổi hẹn đầu tiên không?"* với 2 nút **Có** và **Không** (nút **Không** bay nhảy né tránh trong khung hình mỗi khi người dùng bấm/chạm vào).
  3. **Lịch chọn ngày:** Sau khi bấm **Có**, chọn ngày phù hợp trên lịch (có thể bấm chuyển tiếp/lùi giữa các tháng), tùy chọn khung giờ và lời nhắn ngắn.
  4. **Xác nhận & Gửi câu trả lời:** Hiển thị lời chào kết và chú thích *"Mình sẽ cùng bàn luận và chọn địa điểm hẹn hò sau nhé"* cùng tóm tắt ngày đã chọn, tải file lịch `.ics`, copy/gửi tin nhắn qua Messenger/Zalo, hoặc gửi tự động qua webhook tùy chọn.

## Capabilities and Constraints

- **Language:** Vietnamese-only UI, calendar labels, confirmation copy, `.ics` labels, and `README.md`.
- **No places/photos gallery:** Places and photos are intentionally omitted; date locations are discussed together after the date is confirmed.
- **Dodging "No" button:** Must work reliably on both mobile touch/click and desktop, staying bounded inside the safe viewport area without causing horizontal overflow.
- **Calendar:** Interactive monthly calendar with forward/backward month navigation; supports choosing any future date by default or restricting to sender-configured `availableDates`, plus optional `timeSlots` and reply note.
- **Confirmation & Notification:** Purely static frontend; generates a downloadable `.ics` file and formatted message to copy/open Messenger or Zalo. Optional `webhookUrl` supports Formspree / generic JSON POST and auto-formatted Discord webhooks (no direct Telegram Bot API in client-side code).
- **Zero-backend constraint:** Must work completely without `.env` secrets, server runtime, or database; omitting optional fields degrades gracefully.
- **Subpath deployment:** Must support deploying under a subpath (e.g. GitHub Pages `username.github.io/repo-name/`).

## Evidence on Hand

- Confirmed user requirements and `AGENTS.md` workflow (`ui-ux-pro-max` + `impeccable` with `buildPath: "code"`).
- No existing application source code yet (template will ship with warm Vietnamese sample copy).

## Product Principles

1. **Zero-friction customization:** Any user can personalize the entire website by editing one typed config file (`src/config/dateConfig.ts`), without touching component code.
2. **Mobile-first intimacy:** Designed primarily for how links are actually opened — on a phone screen from Messenger or Zalo, with gentle motion and `>= 44px` touch targets.
3. **Graceful without infrastructure:** Every core flow works 100% offline/static even if no webhook or external service is configured.
4. **Never block the moment:** Optional integrations (like webhooks) must never fail-block the recipient from seeing their confirmation and sending their reply.
