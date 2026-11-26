import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CalendarStep } from './DateCalendarSection';

describe('CalendarStep edge cases', () => {
  it('renders graceful empty state when explicit availableDates are all disabled', () => {
    render(
      <CalendarStep
        calendar={{
          heading: 'Chọn ngày',
          availableDates: ['2026-12-05'],
          disabledDates: ['2026-12-05'],
          confirmLabel: 'Xác nhận',
        }}
        isSubmitting={false}
        onConfirm={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Hiện chưa có ngày nào trống trong lịch/i)
    ).toBeInTheDocument();
  });
});
