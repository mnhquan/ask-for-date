import { afterEach, describe, expect, it, vi } from 'vitest';
import { dateConfig } from '../config/dateConfig';
import { sendDateWebhook, sendDeclineWebhook } from './webhook';

describe('sendDateWebhook', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('skips when webhookUrl is empty', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const result = await sendDateWebhook('', { date: '2026-12-05' }, dateConfig);
    expect(result).toEqual({ status: 'skipped' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('formats Discord embed payload for Discord webhook URLs', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));

    const result = await sendDateWebhook(
      'https://discord.com/api/webhooks/123/abc',
      { date: '2026-12-05', timeSlot: 'Tối (19:00)' },
      dateConfig
    );

    expect(result).toEqual({ status: 'sent' });
    const body = JSON.parse((fetchSpy.mock.calls[0]?.[1]?.body as string) ?? '{}');
    expect(body.content).toContain(dateConfig.recipientName);
    expect(body.embeds?.[0]?.fields?.[0]?.value).toContain('05/12/2026');
  });

  it('returns failed without throwing on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network down'));
    const result = await sendDateWebhook(
      'https://formspree.io/f/demo',
      { date: '2026-12-05' },
      dateConfig
    );
    expect(result).toEqual({ status: 'failed', error: 'Network down' });
  });
});

describe('sendDeclineWebhook', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends Discord notification when user clicks Không', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));

    const result = await sendDeclineWebhook(
      'https://discord.com/api/webhooks/123/abc',
      dateConfig
    );

    expect(result).toEqual({ status: 'sent' });
    const body = JSON.parse((fetchSpy.mock.calls[0]?.[1]?.body as string) ?? '{}');
    expect(body.content).toContain(dateConfig.question.noLabel);
    expect(body.embeds?.[0]?.title).toContain('Không');
  });
});
