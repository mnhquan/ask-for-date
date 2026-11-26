import type { DateInviteConfig, DateSelectionPayload } from '../types/invite';
import { formatVietnameseDate } from './message';

export interface WebhookResult {
  status: 'skipped' | 'sent' | 'failed';
  error?: string;
}

function isDiscordWebhook(url: string): boolean {
  return /discord(app)?\.com\/api\/webhooks\//i.test(url);
}

async function postWebhookPayload(
  webhookUrl: string | undefined,
  buildBody: (isDiscord: boolean) => Record<string, unknown>
): Promise<WebhookResult> {
  const trimmed = webhookUrl?.trim();
  if (!trimmed) {
    return { status: 'skipped' };
  }

  const payload = buildBody(isDiscordWebhook(trimmed));

  try {
    const response = await fetch(trimmed, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { status: 'failed', error: `HTTP ${response.status}` };
    }
    return { status: 'sent' };
  } catch (err) {
    return {
      status: 'failed',
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export async function sendDeclineWebhook(
  webhookUrl: string | undefined,
  config: DateInviteConfig
): Promise<WebhookResult> {
  return postWebhookPayload(webhookUrl, (isDiscord) =>
    isDiscord
      ? {
          content: `**${config.recipientName}** vừa bấm vào nút **${config.question.noLabel}** ở câu hỏi hẹn hò!`,
          embeds: [
            {
              title: 'Đã bấm lựa chọn "Không" (lần đầu)',
              color: 0x665850,
              fields: [
                { name: 'Câu hỏi', value: config.question.prompt, inline: false },
                {
                  name: 'Trạng thái',
                  value: 'Nút đã bắt đầu bay nhảy trên màn hình.',
                  inline: false,
                },
              ],
            },
          ],
        }
      : {
          event: 'declined_first_click',
          recipientName: config.recipientName,
          senderName: config.senderName,
          choice: config.question.noLabel,
          prompt: config.question.prompt,
        }
  );
}

export async function sendDateWebhook(
  webhookUrl: string | undefined,
  selection: DateSelectionPayload,
  config: DateInviteConfig
): Promise<WebhookResult> {
  const formattedDate = formatVietnameseDate(selection.date);

  return postWebhookPayload(webhookUrl, (isDiscord) =>
    isDiscord
      ? {
          content: `**${config.recipientName}** vừa đồng ý buổi hẹn đầu tiên với **${config.senderName}**!`,
          embeds: [
            {
              title: 'Lịch hẹn đã chốt',
              color: 0xb44332,
              fields: [
                { name: 'Ngày', value: formattedDate, inline: true },
                ...(selection.timeSlot?.trim()
                  ? [{ name: 'Khung giờ', value: selection.timeSlot.trim(), inline: true }]
                  : []),
                ...(selection.replyNote?.trim()
                  ? [{ name: 'Lời nhắn', value: selection.replyNote.trim(), inline: false }]
                  : []),
              ],
            },
          ],
        }
      : {
          recipientName: config.recipientName,
          senderName: config.senderName,
          date: selection.date,
          formattedDate,
          timeSlot: selection.timeSlot?.trim() || undefined,
          replyNote: selection.replyNote?.trim() || undefined,
          note: config.confirmation.placeDiscussionNote,
        }
  );
}
