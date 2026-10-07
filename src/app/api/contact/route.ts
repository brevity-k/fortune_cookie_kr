import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactRatelimit } from '@/lib/rate-limit';
import { getResendKey, SITE_URL } from '@/lib/env';
import { enforceRateLimit } from '@/lib/api-helpers';

const OWNER_EMAIL = 'fortune0.kr@gmail.com';
const FROM_EMAIL = 'Fortune Cookie <onboarding@resend.dev>';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const resendKey = getResendKey();
    if (!resendKey) {
      return NextResponse.json(
        { error: '이메일 서비스가 설정되지 않았습니다.' },
        { status: 503 }
      );
    }

    // 5 req/hour per IP
    const limited = await enforceRateLimit(request, contactRatelimit, '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
    if (limited) return limited;

    const resend = new Resend(resendKey);
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const name = typeof body?.name === 'string' ? body.name : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const message = typeof body?.message === 'string' ? body.message : '';

    if (!name.trim() || !email || !message.trim()) {
      return NextResponse.json(
        { error: '모든 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      return NextResponse.json(
        { error: '입력이 너무 깁니다.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Resend reports API failures in `error` rather than throwing.
    const [notification, autoReply] = await Promise.all([
      // Send notification to site owner
      resend.emails.send({
        from: FROM_EMAIL,
        to: OWNER_EMAIL,
        subject: `포춘쿠키 문의: ${name.replace(/\s+/g, ' ').trim()}`,
        html: `
          <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #D4A574; border-bottom: 2px solid #D4A574; padding-bottom: 12px;">
              새로운 문의가 도착했습니다
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 80px;">이름</td>
                <td style="padding: 8px 12px;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: bold; color: #555;">이메일</td>
                <td style="padding: 8px 12px;">
                  <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
                </td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #f9f5f0; border-radius: 8px; border-left: 4px solid #D4A574;">
              <p style="margin: 0 0 8px; font-weight: bold; color: #555;">문의 내용</p>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
            </div>
          </div>
        `,
      }),
      // Auto-reply to the sender. It goes to an unverified address, so it must not echo
      // any user-supplied text (otherwise the form becomes a spam relay).
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: '포춘쿠키 문의 접수 안내',
        html: `
          <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="text-align: center; padding: 20px 0;">
              <span style="font-size: 48px;">🥠</span>
            </div>
            <h2 style="color: #D4A574; text-align: center; margin-bottom: 24px;">
              문의가 접수되었습니다
            </h2>
            <p style="color: #333; line-height: 1.8;">
              안녕하세요!<br><br>
              포춘쿠키에 문의해 주셔서 감사합니다.<br>
              보내주신 내용을 확인 후 <strong>평일 기준 1~2영업일 이내</strong>에 답변 드리겠습니다.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #999; font-size: 13px; text-align: center;">
              이 메일은 자동 발송된 메일입니다.<br>
              <a href="${SITE_URL}" style="color: #D4A574;">${new URL(SITE_URL).host}</a>
            </p>
          </div>
        `,
      }),
    ]);

    if (notification.error) {
      console.error('Contact form notification failed:', notification.error);
      return NextResponse.json(
        { error: '메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }
    if (autoReply.error) {
      // The owner already has the message; a failed acknowledgement isn't worth failing the request.
      console.error('Contact form auto-reply failed:', autoReply.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: '메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
