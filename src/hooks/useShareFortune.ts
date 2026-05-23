'use client';

import { useCallback, useMemo } from 'react';
import { Fortune } from '@/types/fortune';
import { RATING_LABELS } from '@/lib/fortune-selector';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fortunecookie.ai.kr';

export function useShareFortune() {
  const shareViaKakao = useCallback((fortune: Fortune, giftUrl?: string) => {
    if (typeof window === 'undefined' || !window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오톡 공유 기능을 사용하려면 카카오 앱 키 설정이 필요합니다.');
      return;
    }

    const ratingLabel = RATING_LABELS[fortune.rating] || '평';
    const linkUrl = giftUrl || SITE_URL;

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `🥠 포춘쿠키: ${ratingLabel}`,
          description: fortune.shareText,
          imageUrl: `${SITE_URL}/api/fortune-card?message=${encodeURIComponent(fortune.message)}&rating=${fortune.rating}&emoji=${encodeURIComponent(fortune.emoji)}&category=${encodeURIComponent(fortune.category)}&w=800&h=400`,
          link: {
            mobileWebUrl: linkUrl,
            webUrl: linkUrl,
          },
        },
        buttons: [
          {
            title: '나도 포춘쿠키 열기',
            link: {
              mobileWebUrl: SITE_URL,
              webUrl: SITE_URL,
            },
          },
        ],
      });
    } catch (error) {
      console.error('[KakaoShare] Failed:', error);
      alert('카카오톡 공유에 실패했습니다. 다시 시도해주세요.');
    }
  }, []);

  const shareViaWebShare = useCallback(async (fortune: Fortune) => {
    if (!navigator.share) return false;

    try {
      await navigator.share({
        title: '포춘쿠키 운세',
        text: fortune.shareText,
        url: SITE_URL,
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const copyToClipboard = useCallback(async (fortune: Fortune) => {
    try {
      await navigator.clipboard.writeText(
        `${fortune.shareText}\n\n${SITE_URL}`
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  const shareViaTwitter = useCallback((fortune: Fortune) => {
    const text = encodeURIComponent(fortune.shareText);
    const url = encodeURIComponent(SITE_URL);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=600,height=400'
    );
  }, []);

  const downloadCard = useCallback(async (fortune: Fortune, streak: number = 0) => {
    const categoryLabels: Record<string, string> = {
      general: '총운', love: '사랑운', career: '재물운',
      health: '건강운', study: '학업운', relationship: '대인운',
    };
    const params = new URLSearchParams({
      message: fortune.message,
      rating: String(fortune.rating),
      emoji: fortune.emoji,
      luckyNumber: String(fortune.luckyNumber),
      luckyColor: fortune.luckyColor,
      category: categoryLabels[fortune.category] || '총운',
      streak: String(streak),
    });

    try {
      const res = await fetch(`/api/fortune-card?${params}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fortune-cookie.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(`/api/fortune-card?${params}`, '_blank');
    }
  }, []);

  const canWebShare = useMemo(() => typeof navigator !== 'undefined' && 'share' in navigator, []);

  return {
    shareViaKakao,
    shareViaWebShare,
    copyToClipboard,
    shareViaTwitter,
    downloadCard,
    canWebShare,
  };
}
