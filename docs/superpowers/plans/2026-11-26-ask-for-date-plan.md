# Ask For Date Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, zero-backend, Vietnamese-only open-source date-invitation website template (`Vite + React + TypeScript + Tailwind CSS`) that anyone can customize via a single config file and local images and deploy statically.

**Architecture:** A single-page editorial stationery experience structured into 4 sequential sections (`HeroSection`, `PlacesSection`, `DateCalendarSection`, and `ConfirmationTicket`), driven entirely by one typed configuration file (`src/config/dateConfig.ts`). All interactive flows (date selection, `.ics` calendar export, formatted message copy) run 100% client-side, with an optional non-blocking webhook adapter supporting Formspree/generic JSON and Discord webhooks.

**Tech Stack:** Vite, React 18+, TypeScript, Tailwind CSS, `lucide-react`, Vitest, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.

**Spec:** [docs/superpowers/specs/2026-11-26-ask-for-date-design.md](file:///d:/PersonalProjects/ask-for-date/docs/superpowers/specs/2026-11-26-ask-for-date-design.md)

## Global Constraints

- **Language:** 100% Vietnamese UI, calendar weekday/month labels, "Vé hẹn hò" copy, `.ics` labels, and `README.md`.
- **Zero-backend static build:** Must build cleanly to `dist/` with `npm run build` and run without `.env` secrets, database, or Node.js runtime.
- **Single-config customization:** All user-editable invitation content lives in `src/config/dateConfig.ts` and `public/images/`.
- **Curated fixed itinerary:** `PlacesSection` displays places as a fixed curated schedule (no place selection checkboxes).
- **Webhook safety:** `webhookUrl` supports Formspree/generic JSON and auto-formatted Discord webhooks only; never call Telegram Bot API directly from client code.
- **Mobile-first & Accessibility:** No horizontal scroll on `375px` viewports; minimum `44×44px` touch targets for calendar days, time slots, and buttons; text contrast `>= 4.5:1`; respect `prefers-reduced-motion`; Google Fonts (`Cormorant Infant` + `Be Vietnam Pro`) must load the `vietnamese` subset.

## Review Focus

- **Omitted optional config fields:** Leaving `mapUrl`, `tag`, `timeHint`, `timeSlots`, `webhookUrl`, or `messengerOrZaloUrl` undefined/empty must not crash or render empty boxes.
- **Non-blocking webhook failures:** Network errors, HTTP 4xx/5xx, or missing `webhookUrl` must never prevent the recipient from seeing `ConfirmationTicket` or downloading `.ics`.
- **Long Vietnamese text & special characters:** Multi-paragraph `heartfeltNote` or `replyNote` with Vietnamese diacritics, commas, semicolons, and newlines must wrap cleanly on `375px` mobile and escape properly in `.ics` output.
- **Empty or all-unavailable calendar dates:** If `availableDates` is empty (or contains no selectable dates), `DateCalendarSection` must display a clear Vietnamese fallback message instead of a broken calendar.
- **Subpath deployment (GitHub Pages):** Relative image paths in `public/images/` must resolve via `import.meta.env.BASE_URL` so assets load under `/repo-name/`.

---

### Task 1: Project Scaffolding, Design Tokens & Test Harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: Working Vite + React + TypeScript + Tailwind CSS + Vitest environment (`npm run build`, `npm test`).

- [ ] **Step 1: Initialize Vite + React + TypeScript + Tailwind + Vitest dependencies**

Create `package.json` with `react`, `react-dom`, `lucide-react` and devDependencies `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `@tailwindcss/vite`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@types/react`, `@types/react-dom`. Run `npm install`.

- [ ] **Step 2: Configure `vite.config.ts`, `tsconfig.json`, and `src/test/setup.ts`**

Configure `vite.config.ts` with `base: './'` (supporting GitHub Pages subpaths) and Vitest `environment: 'jsdom'`, `setupFiles: './src/test/setup.ts'`.

- [ ] **Step 3: Configure `index.html` and `src/index.css` design tokens**

In `index.html`, set `<html lang="vi">`, responsive viewport meta, and Google Fonts for `Cormorant Infant` (weights 500, 600, 700) and `Be Vietnam Pro` (weights 400, 500, 600) with `&subset=vietnamese`.
In `src/index.css`, define CSS custom properties and Tailwind `@theme` tokens for a warm stationery aesthetic:
- `--color-bg: #FAF7F2` (warm cream paper)
- `--color-surface: #FFFFFF`
- `--color-ink: #2D2420` (espresso ink)
- `--color-ink-muted: #6E5E56`
- `--color-accent: #B84A39` (terracotta rose, contrast >= 4.5:1 with white text)
- `--color-accent-soft: #F5E6E3`
- `--color-border: #E8DFD5`
Include `@media (prefers-reduced-motion: reduce)` rule disabling smooth scroll/transitions.

- [ ] **Step 4: Verify scaffold builds and test runner executes**

Create minimal `src/main.tsx` and `src/App.tsx`.
Run: `npm run build && npx vitest run --passWithNoTests`
Expected: Vite outputs `dist/` with exit code 0 and Vitest exits 0.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts index.html src/
git commit -m "chore: scaffold Vite React TypeScript Tailwind and Vitest"
```

---

### Task 2: Types, Sample Config, Placeholder Images & Asset Path Helper

**Files:**
- Create: `src/types/invite.ts`
- Create: `src/config/dateConfig.ts`
- Create: `src/utils/assetPath.ts`
- Create: `public/images/place-1.svg`
- Create: `public/images/place-2.svg`
- Create: `public/images/place-3.svg`
- Test: `src/utils/assetPath.test.ts`

**Interfaces:**
- Produces:
  - `DateInviteConfig`, `PlaceItem`, `CalendarConfig`, `ResponseConfig`, `DateSelectionPayload` in `src/types/invite.ts`
  - `dateConfig: DateInviteConfig` in `src/config/dateConfig.ts`
  - `resolveAssetPath(src: string, baseUrl?: string): string` in `src/utils/assetPath.ts`

- [ ] **Step 1: Write failing tests for `resolveAssetPath` and `dateConfig` shape**

In `src/utils/assetPath.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { resolveAssetPath } from './assetPath';
import { dateConfig } from '../config/dateConfig';

describe('resolveAssetPath', () => {
  it('returns external https URLs unchanged', () => {
    expect(resolveAssetPath('https://example.com/a.jpg', '/ask-for-date/')).toBe('https://example.com/a.jpg');
  });

  it('prepends BASE_URL to leading-slash local paths', () => {
    expect(resolveAssetPath('/images/place-1.svg', '/ask-for-date/')).toBe('/ask-for-date/images/place-1.svg');
  });

  it('normalizes relative paths without leading slash', () => {
    expect(resolveAssetPath('images/place-1.svg', './')).toBe('./images/place-1.svg');
  });
});

describe('dateConfig defaults', () => {
  it('provides non-empty Vietnamese sample data and valid YYYY-MM-DD dates', () => {
    expect(dateConfig.places.length).toBeGreaterThanOrEqual(2);
    expect(dateConfig.calendar.availableDates.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/assetPath.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/types/invite.ts`, `src/utils/assetPath.ts`, placeholder SVGs, and `src/config/dateConfig.ts`**

- `src/types/invite.ts`: Define `PlaceItem` (`id`, `name`, `description`, `image`, `mapUrl?`, `tag?`, `timeHint?`), `CalendarConfig` (`availableDates: string[]`, `timeSlots?: string[]`, `defaultMonth?: string`), `ResponseConfig` (`webhookUrl?: string`, `messengerOrZaloUrl?: string`), `DateInviteConfig` (`pageTitle`, `senderName`, `recipientName`, `introHeadline`, `heartfeltNote`, `places: PlaceItem[]`, `calendar: CalendarConfig`, `response: ResponseConfig`), and `DateSelectionPayload` (`date: string`, `timeSlot?: string`, `replyNote?: string`).
- `src/utils/assetPath.ts`: Implement `resolveAssetPath(src: string, baseUrl = import.meta.env.BASE_URL): string`.
- `public/images/place-{1,2,3}.svg`: Create 3 warm, lightweight SVG illustrations so the template looks complete offline out of the box.
- `src/config/dateConfig.ts`: Populate warm, natural Vietnamese sample copy with clear inline comments explaining every field (and future dates generated/listed cleanly).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/assetPath.test.ts`
Expected: PASS (all 4 assertions pass).

- [ ] **Step 5: Commit**

```bash
git add src/types/invite.ts src/utils/assetPath.ts src/utils/assetPath.test.ts src/config/dateConfig.ts public/images/
git commit -m "feat: add invite config types, sample data, and subpath asset resolver"
```

---

### Task 3: ICS Calendar Export & Confirmation Message Utilities

**Files:**
- Create: `src/utils/ics.ts`
- Create: `src/utils/message.ts`
- Test: `src/utils/ics.test.ts`
- Test: `src/utils/message.test.ts`

**Interfaces:**
- Consumes: `DateInviteConfig`, `DateSelectionPayload` from `src/types/invite.ts`
- Produces:
  - `buildIcsContent(selection: DateSelectionPayload, config: DateInviteConfig): string`
  - `downloadIcsFile(selection: DateSelectionPayload, config: DateInviteConfig): void`
  - `formatVietnameseDate(isoDate: string): string`
  - `formatConfirmationMessage(selection: DateSelectionPayload, config: DateInviteConfig): string`

- [ ] **Step 1: Write failing tests for ICS generation and message formatting**

In `src/utils/ics.test.ts`:
- Assert `buildIcsContent` starts with `BEGIN:VCALENDAR` and ends with `END:VCALENDAR`.
- Assert `DTSTART` uses `20261205T183000` when `date: '2026-12-05'` and `timeSlot: '18:30'` (and `DTSTART;VALUE=DATE:20261205` when `timeSlot` is omitted).
- Assert commas, semicolons, and newlines in `replyNote` / place descriptions are RFC 5545 escaped (`\,`, `\;`, `\n`).

In `src/utils/message.test.ts`:
- Assert `formatVietnameseDate('2026-12-05')` formats to readable Vietnamese (e.g., `Thứ Bảy, 05/12/2026`).
- Assert `formatConfirmationMessage` includes `recipientName`, formatted date, optional `timeSlot`, place names, and optional `replyNote` (without printing `undefined` when omitted).

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/utils/ics.test.ts src/utils/message.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/utils/ics.ts` and `src/utils/message.ts`**

- `src/utils/ics.ts`: Implement `escapeIcsText`, `buildIcsContent`, and `downloadIcsFile` (creating a `Blob` with `text/calendar;charset=utf-8` and triggering `<a download="hen-ho-YYYY-MM-DD.ics">`).
- `src/utils/message.ts`: Implement `formatVietnameseDate` (using UTC-safe `Date` parsing of `YYYY-MM-DD` so local timezone offsets never shift the day) and `formatConfirmationMessage`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/utils/ics.test.ts src/utils/message.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/ics.ts src/utils/ics.test.ts src/utils/message.ts src/utils/message.test.ts
git commit -m "feat: add ICS calendar generator and Vietnamese message formatter"
```

---

### Task 4: Optional Non-Blocking Webhook Sender

**Files:**
- Create: `src/utils/webhook.ts`
- Test: `src/utils/webhook.test.ts`

**Interfaces:**
- Consumes: `DateInviteConfig`, `DateSelectionPayload` from `src/types/invite.ts`, `formatVietnameseDate` from `src/utils/message.ts`
- Produces:
  - `WebhookResult` (`{ status: 'skipped' | 'sent' | 'failed'; error?: string }`)
  - `sendDateWebhook(webhookUrl: string | undefined, selection: DateSelectionPayload, config: DateInviteConfig): Promise<WebhookResult>`

- [ ] **Step 1: Write failing tests for `sendDateWebhook`**

In `src/utils/webhook.test.ts` (mocking `globalThis.fetch`):
- Returns `{ status: 'skipped' }` without calling `fetch` when `webhookUrl` is `undefined` or blank.
- Sends `{ content, embeds }` JSON when `webhookUrl` matches `discord.com/api/webhooks/` or `discordapp.com/api/webhooks/`.
- Sends standard JSON payload `{ recipientName, senderName, date, formattedDate, timeSlot, replyNote, places }` for Formspree/generic URLs.
- Returns `{ status: 'failed', error }` (does NOT throw) when `fetch` rejects or returns `ok: false`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/webhook.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `sendDateWebhook` in `src/utils/webhook.ts`**

Validate URL trim/empty, detect Discord webhook host, `POST` with `Content-Type: application/json` and `Accept: application/json`, catch all network/HTTP errors into `{ status: 'failed', error }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/webhook.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/webhook.ts src/utils/webhook.test.ts
git commit -m "feat: add non-blocking Formspree and Discord webhook sender"
```

---

### Task 5: Hero & Curated Places Itinerary Sections

**Files:**
- Create: `src/components/HeroSection.tsx`
- Create: `src/components/PlacesSection.tsx`
- Test: `src/components/HeroSection.test.tsx`
- Test: `src/components/PlacesSection.test.tsx`

**Interfaces:**
- Consumes: `DateInviteConfig`, `PlaceItem` from `src/types/invite.ts`, `resolveAssetPath` from `src/utils/assetPath.ts`
- Produces:
  - `HeroSection({ senderName, recipientName, introHeadline, heartfeltNote, onStartClick }: HeroSectionProps)`
  - `PlacesSection({ places }: { places: PlaceItem[] })`

- [ ] **Step 1: Write failing component tests for `HeroSection` and `PlacesSection`**

In `src/components/HeroSection.test.tsx`:
- Renders `recipientName`, `senderName`, `introHeadline`, and multi-line `heartfeltNote`.
- Calls `onStartClick` when clicking the CTA button.

In `src/components/PlacesSection.test.tsx`:
- Renders all places in order with image (`alt` = place name), title, and description.
- Renders optional `mapUrl` link ("Xem bản đồ") only when `mapUrl` is provided; omits it cleanly when absent.
- Renders optional `tag` and `timeHint` only when provided; does NOT render any selection checkboxes.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/HeroSection.test.tsx src/components/PlacesSection.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `HeroSection.tsx` and `PlacesSection.tsx`**

Before editing UI, read `.agents/skills/impeccable/reference/craft-floor.md` per `AGENTS.md`.
- `HeroSection.tsx`: Editorial stationery header with subtle couple pill (`Gửi {recipientName}`), Cormorant Infant display headline, readable `Be Vietnam Pro` heartfelt letter (`whitespace-pre-line`), and `min-h-[44px]` CTA button.
- `PlacesSection.tsx`: Numbered itinerary cards (`01`, `02`, ...), `aspect-[4/3]` image with `resolveAssetPath` + graceful error fallback, optional `tag`/`timeHint` metadata, and accessible external Google Maps link (`target="_blank" rel="noopener noreferrer"`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/HeroSection.test.tsx src/components/PlacesSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroSection.tsx src/components/HeroSection.test.tsx src/components/PlacesSection.tsx src/components/PlacesSection.test.tsx
git commit -m "feat: add HeroSection and fixed PlacesSection itinerary"
```

---

### Task 6: Interactive Vietnamese Date Calendar & Reply Form

**Files:**
- Create: `src/components/DateCalendarSection.tsx`
- Test: `src/components/DateCalendarSection.test.tsx`

**Interfaces:**
- Consumes: `CalendarConfig`, `DateSelectionPayload` from `src/types/invite.ts`, `formatVietnameseDate` from `src/utils/message.ts`
- Produces:
  - `DateCalendarSection({ calendar, onConfirm, isSubmitting }: DateCalendarSectionProps)`

- [ ] **Step 1: Write failing tests for `DateCalendarSection`**

In `src/components/DateCalendarSection.test.tsx`:
- Renders Vietnamese weekday headers (`T2` through `CN`) and navigates months via previous/next buttons.
- Disables dates not in `calendar.availableDates`; enables dates in `calendar.availableDates`.
- Selecting an available date enables the confirm button (or requires selecting a `timeSlot` when `timeSlots` is non-empty, or defaults cleanly if user picks one — specify: when `timeSlots` is non-empty, user picks a date and a time slot to enable confirm; when `timeSlots` is empty/undefined, picking a date alone enables confirm).
- Submitting calls `onConfirm({ date, timeSlot, replyNote })`.
- When `calendar.availableDates` is empty, renders a clear Vietnamese empty-state message.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/DateCalendarSection.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `DateCalendarSection.tsx`**

Build a 7-column Monday-first calendar grid (`min-h-[44px] min-w-[44px]` buttons) initialized to the month of `calendar.defaultMonth` or the earliest available date, with clear selected/available/disabled states, optional `timeSlots` pill selector, optional `replyNote` textarea, and primary submit button.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/DateCalendarSection.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/DateCalendarSection.tsx src/components/DateCalendarSection.test.tsx
git commit -m "feat: add interactive Vietnamese DateCalendarSection"
```

---

### Task 7: Confirmation "Vé hẹn hò" Ticket, App Integration & Vietnamese README

**Files:**
- Create: `src/components/ConfirmationTicket.tsx`
- Modify: `src/App.tsx`
- Create: `README.md`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `dateConfig` (`src/config/dateConfig.ts`), `HeroSection`, `PlacesSection`, `DateCalendarSection`, `downloadIcsFile` (`src/utils/ics.ts`), `formatConfirmationMessage` / `formatVietnameseDate` (`src/utils/message.ts`), `sendDateWebhook` (`src/utils/webhook.ts`)
- Produces:
  - `ConfirmationTicket({ selection, config, webhookStatus, onReset }: ConfirmationTicketProps)`
  - Complete integrated `App` and user-facing Vietnamese `README.md`

- [ ] **Step 1: Write failing integration test for `App` and `ConfirmationTicket`**

In `src/App.test.tsx`:
- Renders `dateConfig.introHeadline`, `dateConfig.places`, and the calendar.
- Selecting an available date (and time slot if configured), entering a reply note, and clicking confirm transitions to `ConfirmationTicket` ("Vé hẹn hò") showing the chosen date, places, and reply note.
- Clicking "Copy tin nhắn" copies `formatConfirmationMessage(...)` and shows "Đã copy!" feedback.
- Clicking "Chọn lại ngày khác" returns to the calendar view.
- If `webhookUrl` fails, `ConfirmationTicket` still renders normally with a subtle non-blocking note.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `ConfirmationTicket.tsx`, wire `App.tsx`, and write `README.md`**

- `ConfirmationTicket.tsx`: Perforated stationery ticket card displaying couple names, chosen date & time, curated itinerary summary, reply note, `.ics` download button, copy-to-clipboard button, optional `messengerOrZaloUrl` button ("Nhắn cho {senderName}"), non-blocking webhook status, and reset link.
- `App.tsx`: Sets `document.title = dateConfig.pageTitle`, composes `HeroSection` -> `PlacesSection` -> `DateCalendarSection` (or `ConfirmationTicket` after confirmation) inside a centered mobile-first editorial container (`max-w-2xl mx-auto px-4`).
- `README.md`: Clear Vietnamese guide covering:
  1. Giới thiệu & tính năng
  2. Cách cài đặt & chạy thử (`npm install`, `npm run dev`)
  3. Cách tùy biến nội dung (`src/config/dateConfig.ts` & `public/images/`)
  4. Cách bật thông báo tự động (Formspree / Discord Webhook — tùy chọn)
  5. Cách deploy miễn phí lên Vercel, Netlify, và GitHub Pages

- [ ] **Step 4: Run full test suite and production build**

Run: `npx vitest run && npm run build`
Expected: All unit and integration tests PASS; `vite build` succeeds with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ConfirmationTicket.tsx src/App.tsx src/App.test.tsx README.md
git commit -m "feat: add ConfirmationTicket, integrate App, and write Vietnamese README"
```
