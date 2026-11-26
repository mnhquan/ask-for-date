import { describe, expect, it } from 'vitest';
import { dateConfig } from '../config/dateConfig';
import { buildIcsContent } from './ics';

describe('buildIcsContent', () => {
  it('generates valid VCALENDAR with extracted time from timeSlot', () => {
    const ics = buildIcsContent(
      { date: '2026-12-05', timeSlot: 'Tối (19:00)', replyNote: 'Gặp nhau nhé, vui quá; hihi\nHẹn!' },
      dateConfig
    );
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain('DTSTART:20261205T190000');
    expect(ics).toContain('DTEND:20261205T210000');
    expect(ics).toContain('Gặp nhau nhé\\, vui quá\\; hihi\\nHẹn!');
  });

  it('uses all-day DATE format when timeSlot has no HH:MM', () => {
    const ics = buildIcsContent({ date: '2026-12-05' }, dateConfig);
    expect(ics).toContain('DTSTART;VALUE=DATE:20261205');
  });
});
