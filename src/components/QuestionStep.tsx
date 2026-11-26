import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarHeart, Sparkles } from 'lucide-react';
import type { QuestionConfig } from '../types/invite';

interface QuestionStepProps {
  question: QuestionConfig;
  onAccept: () => void;
  onFirstNoClick?: () => void;
}

interface FloatingPosition {
  left: number;
  top: number;
}

function getViewportSize(): { width: number; height: number } {
  if (typeof document === 'undefined') {
    return { width: 375, height: 667 };
  }
  return {
    width: document.documentElement.clientWidth || window.innerWidth || 375,
    height: document.documentElement.clientHeight || window.innerHeight || 667,
  };
}

function clampPosition(
  left: number,
  top: number,
  btnWidth: number,
  btnHeight: number
): FloatingPosition {
  const padding = 16;
  const { width: viewportW, height: viewportH } = getViewportSize();
  const maxLeft = Math.max(padding, viewportW - btnWidth - padding);
  const maxTop = Math.max(padding, viewportH - btnHeight - padding);

  return {
    left: Math.round(Math.min(Math.max(padding, left), maxLeft)),
    top: Math.round(Math.min(Math.max(padding, top), maxTop)),
  };
}

export function QuestionStep({ question, onAccept, onFirstNoClick }: QuestionStepProps) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPos, setNoPos] = useState<FloatingPosition | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const hasReportedNoRef = useRef(false);

  const moveNoButton = useCallback(() => {
    if (!hasReportedNoRef.current) {
      hasReportedNoRef.current = true;
      onFirstNoClick?.();
    }

    const rect = noButtonRef.current?.getBoundingClientRect();
    const btnWidth = rect?.width && rect.width > 0 ? rect.width : 112;
    const btnHeight = rect?.height && rect.height > 0 ? rect.height : 44;
    const padding = 16;
    const { width: viewportW, height: viewportH } = getViewportSize();

    const maxLeft = Math.max(padding, viewportW - btnWidth - padding);
    const maxTop = Math.max(padding, viewportH - btnHeight - padding);

    let nextLeft = padding + Math.random() * (maxLeft - padding);
    let nextTop = padding + Math.random() * (maxTop - padding);

    if (noPos) {
      const dist = Math.hypot(nextLeft - noPos.left, nextTop - noPos.top);
      if (dist < 64 && maxLeft > padding + 80) {
        nextLeft = noPos.left > viewportW / 2 ? padding + 12 : maxLeft - 12;
      }
    }

    setNoPos(clampPosition(nextLeft, nextTop, btnWidth, btnHeight));
    setDodgeCount((c) => c + 1);
  }, [noPos, onFirstNoClick]);

  useEffect(() => {
    if (!noPos) return;
    const handleResize = () => {
      const rect = noButtonRef.current?.getBoundingClientRect();
      const btnWidth = rect?.width && rect.width > 0 ? rect.width : 112;
      const btnHeight = rect?.height && rect.height > 0 ? rect.height : 44;
      setNoPos((prev) => (prev ? clampPosition(prev.left, prev.top, btnWidth, btnHeight) : null));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [noPos]);

  const messages = question.dodgeMessages ?? [];
  const activeMessage =
    dodgeCount > 0 && messages.length > 0
      ? messages[(dodgeCount - 1) % messages.length]
      : '';

  const noButton = (
    <button
      ref={noButtonRef}
      type="button"
      onClick={moveNoButton}
      style={
        noPos
          ? {
              position: 'fixed',
              left: `${noPos.left}px`,
              top: `${noPos.top}px`,
              zIndex: 50,
            }
          : undefined
      }
      className="inline-flex min-h-[44px] min-w-[112px] cursor-pointer items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-base font-medium text-ink-muted transition-[left,top,background-color] duration-300 ease-out hover:bg-surface-subtle"
    >
      {question.noLabel}
    </button>
  );

  return (
    <section
      aria-labelledby="question-heading"
      className="animate-gentle-enter rounded-2xl border border-border bg-surface p-6 sm:p-10 text-center"
    >
      <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CalendarHeart className="h-6 w-6" aria-hidden="true" />
      </div>

      <h1
        id="question-heading"
        className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-ink leading-snug text-balance"
      >
        {question.prompt}
      </h1>

      <p
        aria-live="polite"
        className="mt-4 min-h-[24px] text-sm text-accent transition-opacity duration-200"
      >
        {activeMessage}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onAccept}
          className="inline-flex min-h-[44px] min-w-[136px] cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-accent-hover active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span>{question.yesLabel}</span>
        </button>

        {!noPos && noButton}
      </div>

      {noPos && typeof document !== 'undefined' && createPortal(noButton, document.body)}
    </section>
  );
}
