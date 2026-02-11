'use client';

import { useCallback } from 'react';
import { Fortune } from '@/types/fortune';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fortunecookie.ai.kr';

export function useShareFortune() {
  const shareViaKakao = useCallback((fortune: Fortune) => {
    if (typeof window === 'undefined' || !window.Kakao) {
      alert('카카오톡 공유 기능을 사용하려면 카카오 앱 키 설정이 필요합니다.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_KEY;
      if (!kakaoKey) {
        alert('카카오톡 공유 기능을 사용하려면 카카오 앱 키 설정이 필요합니다.');
        return;
      }
      window.Kakao.init(kakaoKey);
    }

    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text: `🥠 포춘쿠키 운세\n\n${fortune.shareText}`,
      link: {
        mobileWebUrl: SITE_URL,
        webUrl: SITE_URL,
      },
    });
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

  return {
    shareViaKakao,
    shareViaWebShare,
    copyToClipboard,
    shareViaTwitter,
    canWebShare: typeof navigator !== 'undefined' && 'share' in navigator,
  };
}
