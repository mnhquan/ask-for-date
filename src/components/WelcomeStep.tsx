import { ArrowRight, Heart } from 'lucide-react';
import type { WelcomeConfig } from '../types/invite';

interface WelcomeStepProps {
  welcome: WelcomeConfig;
  senderName: string;
  onContinue: () => void;
}

export function WelcomeStep({ welcome, senderName, onContinue }: WelcomeStepProps) {
  return (
    <section
      aria-labelledby="welcome-heading"
      className="animate-gentle-enter rounded-2xl border border-border bg-surface p-6 sm:p-10"
    >
      <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Heart className="h-5 w-5" aria-hidden="true" />
      </div>

      <h1
        id="welcome-heading"
        className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-ink leading-tight"
      >
        {welcome.greeting}
      </h1>

      <p className="mt-5 text-base sm:text-[17px] leading-[1.7] text-ink-muted whitespace-pre-line">
        {welcome.note}
      </p>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
        <span className="text-sm text-ink-muted">— {senderName}</span>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm sm:text-base font-medium text-white transition-colors duration-200 hover:bg-accent-hover active:scale-[0.98]"
        >
          <span>{welcome.continueLabel}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
