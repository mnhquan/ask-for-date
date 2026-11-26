import { useEffect, useState } from 'react';
import { CalendarStep } from './components/DateCalendarSection';
import { ConfirmationStep } from './components/ConfirmationStep';
import { FloatingHearts } from './components/FloatingHearts';
import { QuestionStep } from './components/QuestionStep';
import { WelcomeStep } from './components/WelcomeStep';
import { dateConfig } from './config/dateConfig';
import type { DateSelectionPayload } from './types/invite';
import { sendDateWebhook, sendDeclineWebhook, type WebhookResult } from './utils/webhook';

type Step = 'welcome' | 'question' | 'calendar' | 'confirmed';
const STEPS: Step[] = ['welcome', 'question', 'calendar', 'confirmed'];

export default function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [selection, setSelection] = useState<DateSelectionPayload | null>(null);
  const [webhookResult, setWebhookResult] = useState<WebhookResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = dateConfig.pageTitle;
  }, []);

  const handleConfirmDate = async (payload: DateSelectionPayload) => {
    setIsSubmitting(true);
    const result = await sendDateWebhook(
      dateConfig.response.webhookUrl,
      payload,
      dateConfig
    );
    setSelection(payload);
    setWebhookResult(result);
    setIsSubmitting(false);
    setStep('confirmed');
  };

  const currentIndex = STEPS.indexOf(step);

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8 sm:py-12">
      <FloatingHearts />
      <div className="relative z-10 w-full max-w-xl">
        <div
          role="progressbar"
          aria-label={`Bước ${currentIndex + 1} trên ${STEPS.length}`}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={currentIndex + 1}
          className="mb-4 flex items-center justify-center gap-2"
        >
          {STEPS.map((s, idx) => (
            <span
              key={s}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                idx === currentIndex
                  ? 'w-7 bg-accent'
                  : idx < currentIndex
                    ? 'w-2.5 bg-accent/45'
                    : 'w-2.5 bg-border',
              ].join(' ')}
            />
          ))}
        </div>

        {step === 'welcome' && (
          <WelcomeStep
            welcome={dateConfig.welcome}
            senderName={dateConfig.senderName}
            onContinue={() => setStep('question')}
          />
        )}

        {step === 'question' && (
          <QuestionStep
            question={dateConfig.question}
            onAccept={() => setStep('calendar')}
            onFirstNoClick={() => {
              void sendDeclineWebhook(dateConfig.response.webhookUrl, dateConfig);
            }}
          />
        )}

        {step === 'calendar' && (
          <CalendarStep
            calendar={dateConfig.calendar}
            initialSelection={selection}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirmDate}
          />
        )}

        {step === 'confirmed' && selection && (
          <ConfirmationStep
            selection={selection}
            config={dateConfig}
            webhookResult={webhookResult}
            onReset={() => setStep('calendar')}
          />
        )}
      </div>
    </main>
  );
}
