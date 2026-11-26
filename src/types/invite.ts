export interface WelcomeConfig {
  greeting: string;
  note: string;
  continueLabel: string;
}

export interface QuestionConfig {
  prompt: string;
  yesLabel: string;
  noLabel: string;
  dodgeMessages?: string[];
}

export interface CalendarConfig {
  heading: string;
  subtitle?: string;
  /**
   * Nếu để trống hoặc không truyền, người nhận có thể chọn bất kỳ ngày nào từ hôm nay trở đi.
   * Nếu điền danh sách YYYY-MM-DD, chỉ những ngày này mới được chọn.
   */
  availableDates?: string[];
  /** Các ngày bận muốn khóa (định dạng YYYY-MM-DD). */
  disabledDates?: string[];
  /** Các khung giờ gợi ý (tùy chọn). Để trống nếu không cần chọn giờ. */
  timeSlots?: string[];
  confirmLabel: string;
}

export interface ConfirmationConfig {
  heading: string;
  closingGreeting: string;
  placeDiscussionNote: string;
}

export interface ResponseConfig {
  /** Link Formspree, Discord Webhook hoặc JSON endpoint tùy chọn để nhận thông báo tự động. */
  webhookUrl?: string;
  /** Link Messenger (m.me/username) hoặc Zalo (zalo.me/sdt) để mở nhanh khung chat. */
  messengerOrZaloUrl?: string;
}

export interface DateInviteConfig {
  pageTitle: string;
  senderName: string;
  recipientName: string;
  welcome: WelcomeConfig;
  question: QuestionConfig;
  calendar: CalendarConfig;
  confirmation: ConfirmationConfig;
  response: ResponseConfig;
}

export interface DateSelectionPayload {
  date: string;
  timeSlot?: string;
  replyNote?: string;
}
