import type { DateInviteConfig } from '../types/invite';

/**
 * FILE CẤU HÌNH DUY NHẤT BẠN CẦN CHỈNH SỬA
 * Thay đổi tên, lời chào, câu hỏi và link nhận phản hồi của riêng bạn tại đây.
 */
export const dateConfig: DateInviteConfig = {
  pageTitle: 'Một lời mời nhỏ gửi em',
  senderName: 'Anh',
  recipientName: 'Em',

  welcome: {
    greeting: 'Chào em,',
    note:
      'Anh biết dạo này cả hai đứa đều bận, nhưng mỗi lần nói chuyện với em đều làm một ngày của anh nhẹ nhàng hơn rất nhiều.\n\n' +
      'Anh có một câu hỏi nhỏ muốn gửi tới em, em bấm tiếp tục để xem nhé.',
    continueLabel: 'Tiếp tục',
  },

  question: {
    prompt: 'Em có muốn chúng mình có buổi hẹn đầu tiên không?',
    yesLabel: 'Có',
    noLabel: 'Không',
    dodgeMessages: [
      'Nút này hơi nhút nhát một chút, thử bấm lại xem?',
      'Hình như em bấm nhầm sang bên này rồi đó!',
      'Đừng từ chối mà, nút "Có" ở ngay cạnh đây nè.',
      'Hỏng mất tiêu rùi hay sao ấy nhỉ.',
    ],
  },

  calendar: {
    heading: 'Em chọn ngày mình gặp nhau nhé',
    subtitle: 'Em có thể chuyển qua lại các tháng để chọn ngày em thấy thoải mái nhất.',
    // Để trống [] để em chọn bất kỳ ngày nào từ hôm nay trở đi,
    // hoặc điền cụ thể ví dụ: ['2026-12-05', '2026-12-06']
    availableDates: [],
    disabledDates: [],
    timeSlots: ['Sáng', 'Chiều', 'Tối'],
    confirmLabel: 'Chốt ngày này nha',
  },

  confirmation: {
    heading: 'Vậy là mình có hẹn rồi nhé!',
    closingGreeting: 'Cảm ơn em đã đồng ý dành thời gian cho buổi hẹn đầu tiên của hai đứa.',
    placeDiscussionNote:
      'Về địa điểm đi chơi, anh sẽ gợi ý vài nơi hợp gu em rồi hai đứa mình cùng bàn luận và chọn sau nhé!',
  },

  response: {
    // Tùy chọn: Tự động đọc từ biến môi trường VITE_WEBHOOK_URL (trong .env.local hoặc Vercel/Netlify)
    // để không bị lộ link webhook khi push code lên GitHub công khai.
    webhookUrl: import.meta.env.VITE_WEBHOOK_URL ?? '',
    // Tùy chọn: Dán link Messenger (https://m.me/ten_cua_ban) hoặc Zalo (https://zalo.me/so_dien_thoai)
    messengerOrZaloUrl: '',
  },
};
