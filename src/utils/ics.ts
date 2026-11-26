import type { DateInviteConfig, DateSelectionPayload } from '../types/invite';

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function extractTimeFromSlot(timeSlot?: string): { hour: number; minute: number } | null {
  if (!timeSlot) return null;
  const match = timeSlot.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function pad2(num: number): string {
  return String(num).padStart(2, '0');
}

export function buildIcsContent(
  selection: DateSelectionPayload,
  config: DateInviteConfig
): string {
  const dateCompact = selection.date.replace(/-/g, '');
  const time = extractTimeFromSlot(selection.timeSlot);

  const dtStartLine = time
    ? `DTSTART:${dateCompact}T${pad2(time.hour)}${pad2(time.minute)}00`
    : `DTSTART;VALUE=DATE:${dateCompact}`;

  const dtEndLine = time
    ? `DTEND:${dateCompact}T${pad2((time.hour + 2) % 24)}${pad2(time.minute)}00`
    : `DTEND;VALUE=DATE:${dateCompact}`;

  const summary = `Buổi hẹn đầu tiên - ${config.senderName} & ${config.recipientName}`;
  const descriptionParts = [config.confirmation.placeDiscussionNote];
  if (selection.replyNote?.trim()) {
    descriptionParts.push(`Lời nhắn: ${selection.replyNote.trim()}`);
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ask For Date//VI',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:ask-for-date-${dateCompact}@local`,
    `DTSTAMP:${dateCompact}T000000Z`,
    dtStartLine,
    dtEndLine,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(descriptionParts.join('\n\n'))}`,
    'LOCATION:Sẽ cùng bàn luận và chọn sau',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

export function downloadIcsFile(
  selection: DateSelectionPayload,
  config: DateInviteConfig
): void {
  const content = buildIcsContent(selection, config);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `buoi-hen-${selection.date}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
