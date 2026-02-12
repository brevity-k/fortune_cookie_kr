'use client';

import { useState } from 'react';
import { Fortune } from '@/types/fortune';
import { useShareFortune } from '@/hooks/useShareFortune';
import { trackShare } from '@/lib/analytics';

interface FortuneShareProps {
  fortune: Fortune;
  streak?: number;
}

export default function FortuneShare({ fortune, streak = 0 }: FortuneShareProps) {
  const { shareViaKakao, shareViaWebShare, copyToClipboard, shareViaTwitter, downloadCard } =
    useShareFortune();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [kakaoSharing, setKakaoSharing] = useState(false);

  const handleKakaoShare = () => {
    setKakaoSharing(true);
    trackShare('kakao');
    // sendDefault is sync — reset after popup opens or timeout
    setTimeout(() => {
      shareViaKakao(fortune);
      setKakaoSharing(false);
    }, 0);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(fortune);
    if (success) {
      trackShare('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {/* Kakao Share */}
      <button
        onClick={handleKakaoShare}
        disabled={kakaoSharing}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FEE500] text-[#191919] text-sm font-medium hover:brightness-95 transition disabled:opacity-70"
      >
        {kakaoSharing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="2" className="animate-spin">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
            <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.56-.96 3.6-.99 3.82 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.55.08 1.13.12 1.72.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
          </svg>
        )}
        {kakaoSharing ? '준비 중...' : '카카오톡'}
      </button>

      {/* Web Share (mobile) */}
      <button
        onClick={() => { trackShare('webshare'); shareViaWebShare(fortune); }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-bg-card border border-white/10 text-text-secondary text-sm hover:text-cookie-gold transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        공유하기
      </button>

      {/* Twitter */}
      <button
        onClick={() => { trackShare('twitter'); shareViaTwitter(fortune); }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-bg-card border border-white/10 text-text-secondary text-sm hover:text-cookie-gold transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        트위터
      </button>

      {/* Image Download */}
      <button
        onClick={async () => {
          setDownloading(true);
          trackShare('download');
          await downloadCard(fortune, streak);
          setDownloading(false);
        }}
        disabled={downloading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-bg-card border border-white/10 text-text-secondary text-sm hover:text-cookie-gold transition disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {downloading ? '저장 중...' : '이미지 저장'}
      </button>

      {/* Copy */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-bg-card border border-white/10 text-text-secondary text-sm hover:text-cookie-gold transition"
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            복사됨!
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            복사
          </>
        )}
      </button>
    </div>
  );
}
