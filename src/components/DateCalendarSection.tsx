import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Send } from 'lucide-react';
import type { CalendarConfig, DateSelectionPayload } from '../types/invite';
import { formatIsoDate, formatVietnameseDate, MONTHS_VI } from '../utils/message';

interface CalendarStepProps {
  calendar: CalendarConfig;
  initialSelection?: DateSelectionPayload | null;
  isSubmitting: boolean;
  onConfirm: (selection: DateSelectionPayload) => void;
}

const WEEKDAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function getTodayIso(): string {
  const now = new Date();
  return formatIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
}

function getInitialMonth(
  initialDate?: string,
  availableDates?: string[]
): { year: number; month: number } {
  if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
    const [y, m] = initialDate.split('-').map(Number);
    return { year: y, month: m - 1 };
  }
  const firstAvailable =
    availableDates && availableDates.length > 0 ? [...availableDates].sort()[0] : null;
  if (firstAvailable && /^\d{4}-\d{2}-\d{2}$/.test(firstAvailable)) {
    const [y, m] = firstAvailable.split('-').map(Number);
    return { year: y, month: m - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function CalendarStep({
  calendar,
  initialSelection,
  isSubmitting,
  onConfirm,
}: CalendarStepProps) {
  const todayIso = useMemo(() => getTodayIso(), []);
  const initial = useMemo(
    () => getInitialMonth(initialSelection?.date, calendar.availableDates),
    [initialSelection?.date, calendar.availableDates]
  );

  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const [selectedDate, setSelectedDate] = useState<string>(initialSelection?.date ?? '');
  const [selectedSlot, setSelectedSlot] = useState<string>(initialSelection?.timeSlot ?? '');
  const [replyNote, setReplyNote] = useState<string>(initialSelection?.replyNote ?? '');

  const hasExplicitList = calendar.availableDates !== undefined && calendar.availableDates.length > 0;
  const availableList = useMemo(
    () => (calendar.availableDates ?? []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)),
    [calendar.availableDates]
  );
  const availableSet = useMemo(
    () => (hasExplicitList ? new Set(availableList) : null),
    [hasExplicitList, availableList]
  );

  const disabledSet = useMemo(
    () => new Set(calendar.disabledDates ?? []),
    [calendar.disabledDates]
  );

  const selectableExplicitDates = useMemo(
    () => availableList.filter((d) => !disabledSet.has(d)).sort(),
    [availableList, disabledSet]
  );

  const noSelectableDatesAtAll = hasExplicitList && selectableExplicitDates.length === 0;

  const timeSlots = calendar.timeSlots?.filter((s) => s.trim().length > 0) ?? [];
  const requiresTimeSlot = timeSlots.length > 0;

  const isDateSelectable = (iso: string): boolean => {
    if (disabledSet.has(iso)) return false;
    if (availableSet) return availableSet.has(iso);
    return iso >= todayIso;
  };

  const daysGrid = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const jsDay = firstDayOfMonth.getDay();
    const mondayOffset = jsDay === 0 ? 6 : jsDay - 1;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{ day: number; iso: string } | null> = [];
    for (let i = 0; i < mondayOffset; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ day, iso: formatIsoDate(viewYear, viewMonth, day) });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const monthHasSelectableDay = useMemo(
    () => daysGrid.some((cell) => cell !== null && isDateSelectable(cell.iso)),
    [daysGrid, availableSet, disabledSet, todayIso]
  );

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToAvailable = () => {
    const target = selectableExplicitDates[0] ?? todayIso;
    const [y, m] = target.split('-').map(Number);
    setViewYear(y);
    setViewMonth(m - 1);
  };

  const canConfirm =
    Boolean(selectedDate) && (!requiresTimeSlot || Boolean(selectedSlot)) && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canConfirm) return;
    onConfirm({
      date: selectedDate,
      timeSlot: selectedSlot || undefined,
      replyNote: replyNote.trim() || undefined,
    });
  };

  return (
    <section
      aria-labelledby="calendar-heading"
      className="animate-gentle-enter rounded-2xl border border-border bg-surface p-5 sm:p-9"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CalendarIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1
            id="calendar-heading"
            className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-ink leading-tight"
          >
            {calendar.heading}
          </h1>
          {calendar.subtitle && (
            <p className="mt-1 text-sm text-ink-muted">{calendar.subtitle}</p>
          )}
        </div>
      </div>

      {noSelectableDatesAtAll ? (
        <div className="rounded-xl border border-border bg-paper p-5 text-center text-sm text-ink-muted">
          Hiện chưa có ngày nào trống trong lịch, em nhắn tin cho anh để hai đứa tự hẹn ngày nhé.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border bg-paper/60 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Tháng trước"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:bg-surface-subtle"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              <h2 className="text-base sm:text-lg font-semibold text-ink tabular-nums">
                {MONTHS_VI[viewMonth]} {viewYear}
              </h2>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Tháng sau"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:bg-surface-subtle"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAY_HEADERS.map((label) => (
                <div key={label} className="py-1.5 text-xs font-medium text-ink-muted">
                  {label}
                </div>
              ))}

              {daysGrid.map((cell, index) => {
                if (!cell) {
                  return <div key={`empty-${index}`} className="min-h-[44px]" />;
                }

                const selectable = isDateSelectable(cell.iso);
                const isSelected = selectedDate === cell.iso;
                const isToday = cell.iso === todayIso;

                return (
                  <button
                    key={cell.iso}
                    type="button"
                    disabled={!selectable}
                    onClick={() => setSelectedDate(cell.iso)}
                    aria-label={formatVietnameseDate(cell.iso)}
                    aria-pressed={isSelected}
                    className={[
                      'min-h-[44px] w-full rounded-xl text-sm font-medium tabular-nums transition-colors duration-150',
                      selectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-35',
                      isSelected
                        ? 'bg-accent text-white'
                        : selectable
                          ? 'bg-surface text-ink hover:bg-accent-soft hover:text-accent'
                          : 'text-ink-muted',
                      isToday && !isSelected ? 'ring-1 ring-accent/60' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            {!monthHasSelectableDay && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-ink-muted">
                <span>Tháng này không có ngày phù hợp.</span>
                <button
                  type="button"
                  onClick={handleJumpToAvailable}
                  className="min-h-[36px] cursor-pointer font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
                >
                  Về tháng có ngày trống
                </button>
              </div>
            )}
          </div>

          {selectedDate && (
            <p className="rounded-xl bg-accent-soft/70 px-4 py-2.5 text-sm font-medium text-ink">
              Ngày đang chọn: <span className="text-accent">{formatVietnameseDate(selectedDate)}</span>
            </p>
          )}

          {requiresTimeSlot && (
            <div>
              <div className="mb-2.5 flex items-center gap-2 text-sm font-medium text-ink">
                <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>Khung giờ em thấy tiện nhất</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => {
                  const active = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      aria-pressed={active}
                      className={[
                        'min-h-[44px] cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150',
                        active
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-surface text-ink hover:bg-surface-subtle',
                      ].join(' ')}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="reply-note" className="mb-2 block text-sm font-medium text-ink">
              Lời nhắn nhỏ (không bắt buộc)
            </label>
            <textarea
              id="reply-note"
              rows={3}
              value={replyNote}
              onChange={(e) => setReplyNote(e.target.value)}
              placeholder="Ví dụ: Tối hôm đó em rảnh từ 7h nha..."
              className="w-full rounded-xl border border-border bg-paper/50 px-4 py-3 text-sm sm:text-base text-ink placeholder:text-ink-muted/70 focus:border-accent focus:bg-surface focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!canConfirm}
            className={[
              'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-colors duration-200',
              canConfirm
                ? 'cursor-pointer bg-accent text-white hover:bg-accent-hover active:scale-[0.99]'
                : 'cursor-not-allowed bg-border text-ink-muted',
            ].join(' ')}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>{isSubmitting ? 'Đang gửi...' : calendar.confirmLabel}</span>
          </button>
        </form>
      )}
    </section>
  );
}
