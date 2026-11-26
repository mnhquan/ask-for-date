import { describe, expect, it } from 'vitest';
import { dateConfig } from '../config/dateConfig';
import { formatConfirmationMessage, formatVietnameseDate } from './message';

describe('formatVietnameseDate', () => {
  it('formats ISO date to Vietnamese weekday and DD/MM/YYYY', () => {
    expect(formatVietnameseDate('2026-12-05')).toBe('Thứ Bảy, 05/12/2026');
  });
});

describe('formatConfirmationMessage', () => {
  it('formats message cleanly with optional timeSlot and replyNote', () => {
    const msg = formatConfirmationMessage(
      { date: '2026-12-05', timeSlot: 'Tối (19:00)', replyNote: 'Hẹn anh tối thứ 7 nhé!' },
      dateConfig
    );
    expect(msg).toContain('Thứ Bảy, 05/12/2026');
    expect(msg).toContain('Tối (19:00)');
    expect(msg).toContain('Hẹn anh tối thứ 7 nhé!');
    expect(msg).toContain('bàn luận');
  });

  it('omits undefined fields when optional values are absent', () => {
    const msg = formatConfirmationMessage({ date: '2026-12-05' }, dateConfig);
    expect(msg).not.toContain('undefined');
    expect(msg).not.toContain('Khung giờ');
  });
});
