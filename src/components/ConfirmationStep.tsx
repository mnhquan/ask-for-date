import { CalendarPlus, CheckCircle2, MapPin, MessageCircle, RotateCcw } from 'lucide-react';
import type { DateInviteConfig, DateSelectionPayload } from '../types/invite';
import { downloadIcsFile } from '../utils/ics';
import { formatVietnameseDate } from '../utils/message';
import type { WebhookResult } from '../utils/webhook';
import { CelebrationHearts } from './FloatingHearts';

interface ConfirmationStepProps {
  selection: DateSelectionPayload;
  config: DateInviteConfig;
  webhookResult: WebhookResult | null;
  onReset: () => void;
}

export function ConfirmationStep({
  selection,
  config,
  webhookResult,
  onReset,
}: ConfirmationStepProps) {
  const chatUrl = config.response.messengerOrZaloUrl?.trim();

  return (
    <section
      aria-labelledby="confirm-heading"
      className="animate-gentle-enter rounded-2xl border border-border bg-surface p-6 sm:p-10"
    >
      <div className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CelebrationHearts />
        <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
      </div>

      <h1
        id="confirm-heading"
        className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-ink leading-tight"
      >
        {config.confirmation.heading}
      </h1>

      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        {config.confirmation.closingGreeting}
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-accent/40 bg-paper p-5 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-sm text-ink-muted">Ngày hẹn đã chọn</span>
          <span className="text-base font-semibold text-ink tabular-nums">
            {formatVietnameseDate(selection.date)}
          </span>
        </div>

        {selection.timeSlot && (
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border/70 pt-3">
            <span className="text-sm text-ink-muted">Khung giờ</span>
            <span className="text-base font-medium text-ink">{selection.timeSlot}</span>
          </div>
        )}

        {selection.replyNote && (
          <div className="border-t border-border/70 pt-3">
            <span className="text-sm text-ink-muted">Lời nhắn của {config.recipientName}</span>
            <p className="mt-1 text-sm sm:text-base italic text-ink whitespace-pre-line">
              "{selection.replyNote}"
            </p>
          </div>
        )}

        <div className="flex items-start gap-2.5 border-t border-border/70 pt-3 text-sm text-ink">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <p className="leading-relaxed">{config.confirmation.placeDiscussionNote}</p>
        </div>
      </div>

      {webhookResult?.status === 'sent' && (
        <p className="mt-4 text-xs sm:text-sm text-ink-muted">
          Đã gửi câu trả lời tự động cho {config.senderName} rồi nhé.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => downloadIcsFile(selection, config)}
          className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm sm:text-base font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
        >
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          <span>Lưu vào lịch (.ics)</span>
        </button>

        {chatUrl && (
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-border bg-paper px-5 py-2.5 text-sm sm:text-base font-medium text-ink transition-colors duration-200 hover:bg-surface-subtle"
          >
            <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Mở khung chat gửi cho {config.senderName}</span>
          </a>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-4 text-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 px-3 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Chọn lại ngày khác</span>
        </button>
      </div>
    </section>
  );
}
