import type { DateInviteConfig, DateSelectionPayload } from '../types/invite';

const WEEKDAYS_VI = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

export const MONTHS_VI = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export function parseIsoDateUTC(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatIsoDate(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function formatVietnameseDate(isoDate: string): string {
  const date = parseIsoDateUTC(isoDate);
  const weekday = WEEKDAYS_VI[date.getUTCDay()];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${weekday}, ${day}/${month}/${year}`;
}

export function formatConfirmationMessage(
  selection: DateSelectionPayload,
  config: DateInviteConfig
): string {
  const lines = [
    `${config.recipientName} đã đồng ý buổi hẹn đầu tiên với ${config.senderName}!`,
    `- Ngày đã chọn: ${formatVietnameseDate(selection.date)}`,
  ];

  if (selection.timeSlot?.trim()) {
    lines.push(`- Khung giờ: ${selection.timeSlot.trim()}`);
  }

  if (selection.replyNote?.trim()) {
    lines.push(`- Lời nhắn: "${selection.replyNote.trim()}"`);
  }

  lines.push('- Địa điểm: Hai đứa sẽ cùng bàn luận và chọn sau nhé.');
  return lines.join('\n');
}
