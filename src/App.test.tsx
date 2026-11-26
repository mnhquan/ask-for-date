import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { dateConfig } from './config/dateConfig';

describe('Ask For Date full 4-step flow', () => {
  it('walks through welcome -> dodging No -> Yes -> calendar month nav -> confirmation', async () => {
    const user = userEvent.setup();

    render(<App />);

    // Step 1: Welcome
    expect(screen.getByRole('heading', { name: dateConfig.welcome.greeting })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: dateConfig.welcome.continueLabel }));

    // Step 2: Question with dodging No button
    expect(screen.getByRole('heading', { name: dateConfig.question.prompt })).toBeInTheDocument();
    const noBtn = screen.getByRole('button', { name: dateConfig.question.noLabel });
    await user.click(noBtn);
    expect(screen.getByRole('button', { name: dateConfig.question.noLabel }).style.position).toBe(
      'fixed'
    );
    expect(screen.getByRole('heading', { name: dateConfig.question.prompt })).toBeInTheDocument();

    // Click Yes -> Calendar
    await user.click(screen.getByRole('button', { name: dateConfig.question.yesLabel }));
    expect(screen.getByRole('heading', { name: dateConfig.calendar.heading })).toBeInTheDocument();

    // Navigate to next month and pick day 15
    await user.click(screen.getByRole('button', { name: 'Tháng sau' }));
    const day15 = screen.getByRole('button', { name: /15\// });
    await user.click(day15);

    if (dateConfig.calendar.timeSlots && dateConfig.calendar.timeSlots.length > 0) {
      await user.click(screen.getByRole('button', { name: dateConfig.calendar.timeSlots[0] }));
    }

    await user.type(screen.getByLabelText(/Lời nhắn nhỏ/i), 'Em rảnh tối hôm đó nha!');
    await user.click(screen.getByRole('button', { name: dateConfig.calendar.confirmLabel }));

    // Step 4: Confirmation with place discussion note (no copy button)
    expect(await screen.findByRole('heading', { name: dateConfig.confirmation.heading })).toBeInTheDocument();
    expect(screen.getByText(dateConfig.confirmation.placeDiscussionNote)).toBeInTheDocument();
    expect(screen.getByText(/Em rảnh tối hôm đó nha!/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Copy/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lưu vào lịch (.ics)' })).toBeInTheDocument();
  });
});
