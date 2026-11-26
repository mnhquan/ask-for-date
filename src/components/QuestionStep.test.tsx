import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QuestionStep } from './QuestionStep';

describe('QuestionStep dodging No button', () => {
  it('portals the No button to document.body and triggers onFirstNoClick only once', async () => {
    const user = userEvent.setup();
    const onFirstNoClick = vi.fn();

    render(
      <QuestionStep
        question={{
          prompt: 'Em có muốn chúng mình có buổi hẹn đầu tiên không?',
          yesLabel: 'Có',
          noLabel: 'Không',
          dodgeMessages: ['Thử lại nha!'],
        }}
        onAccept={vi.fn()}
        onFirstNoClick={onFirstNoClick}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Không' }));

    const movedBtn = screen.getByRole('button', { name: 'Không' });
    expect(movedBtn.parentElement).toBe(document.body);
    expect(movedBtn.style.position).toBe('fixed');

    const left = parseInt(movedBtn.style.left, 10);
    const top = parseInt(movedBtn.style.top, 10);
    expect(left).toBeGreaterThanOrEqual(16);
    expect(top).toBeGreaterThanOrEqual(16);

    // Click No two more times -> onFirstNoClick still called only once
    await user.click(movedBtn);
    await user.click(screen.getByRole('button', { name: 'Không' }));
    expect(onFirstNoClick).toHaveBeenCalledTimes(1);
  });
});
