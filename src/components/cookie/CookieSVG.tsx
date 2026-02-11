'use client';

import { CookieState } from '@/types/fortune';

interface CookieSVGProps {
  state: CookieState;
  longPressProgress?: number; // 0-1
}

export default function CookieSVG({ state, longPressProgress = 0 }: CookieSVGProps) {
  if (state === 'broken') {
    return <BrokenCookieSVG />;
  }

  return (
    <svg
      viewBox="0 0 200 140"
      className="w-full h-full"
      role="img"
      aria-label="포춘쿠키"
    >
      {/* Cookie shadow */}
      <ellipse
        cx="100"
        cy="130"
        rx="60"
        ry="8"
        fill="rgba(0,0,0,0.3)"
        className="transition-all duration-300"
      />

      {/* Cookie body */}
      <g className="transition-transform duration-200">
        {/* Main cookie shape */}
        <path
          d="M30 80 C30 40, 70 20, 100 20 C130 20, 170 40, 170 80 C170 90, 160 100, 140 105 C120 110, 100 100, 100 100 C100 100, 80 110, 60 105 C40 100, 30 90, 30 80Z"
          fill="url(#cookieGradient)"
          stroke="#B8895A"
          strokeWidth="1.5"
        />

        {/* Cookie fold line */}
        <path
          d="M60 100 Q80 85 100 95 Q120 85 140 100"
          fill="none"
          stroke="#B8895A"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Cookie texture dots */}
        <circle cx="65" cy="55" r="2" fill="#C49660" opacity="0.4" />
        <circle cx="85" cy="45" r="1.5" fill="#C49660" opacity="0.3" />
        <circle cx="115" cy="48" r="2" fill="#C49660" opacity="0.4" />
        <circle cx="135" cy="58" r="1.5" fill="#C49660" opacity="0.3" />
        <circle cx="90" cy="70" r="1.5" fill="#C49660" opacity="0.3" />
        <circle cx="110" cy="68" r="2" fill="#C49660" opacity="0.4" />

        {/* Crack lines based on state */}
        {(state === 'crack-1' || state === 'crack-2') && (
          <path
            d="M95 35 L98 55 L92 65 L100 80"
            fill="none"
            stroke="#8B6914"
            strokeWidth="1.5"
            className="animate-crack-spread"
            strokeLinecap="round"
          />
        )}

        {state === 'crack-2' && (
          <>
            <path
              d="M110 40 L105 58 L112 72"
              fill="none"
              stroke="#8B6914"
              strokeWidth="1.5"
              className="animate-crack-spread"
              strokeLinecap="round"
            />
            <path
              d="M80 50 L88 62 L82 75"
              fill="none"
              stroke="#8B6914"
              strokeWidth="1"
              className="animate-crack-spread"
              strokeLinecap="round"
            />
          </>
        )}

        {state === 'breaking' && (
          <>
            <path
              d="M100 20 L98 50 L95 70 L100 100"
              fill="none"
              stroke="#8B6914"
              strokeWidth="2"
              className="animate-crack-spread"
              strokeLinecap="round"
            />
            <path
              d="M75 45 L90 60 L85 80"
              fill="none"
              stroke="#8B6914"
              strokeWidth="1.5"
              className="animate-crack-spread"
              strokeLinecap="round"
            />
            <path
              d="M125 45 L110 62 L115 82"
              fill="none"
              stroke="#8B6914"
              strokeWidth="1.5"
              className="animate-crack-spread"
              strokeLinecap="round"
            />
          </>
        )}
      </g>

      {/* Fortune paper peeking out */}
      <path
        d="M85 95 L80 110 L120 110 L115 95"
        fill="#FFF8E7"
        stroke="#E8D5B0"
        strokeWidth="0.5"
        opacity={state === 'idle' ? 0.3 : 0.6}
      />

      {/* Long press progress ring */}
      {longPressProgress > 0 && (
        <circle
          cx="100"
          cy="70"
          r="65"
          fill="none"
          stroke="#FFD700"
          strokeWidth="3"
          strokeDasharray={`${longPressProgress * 408} 408`}
          strokeLinecap="round"
          opacity="0.6"
          transform="rotate(-90 100 70)"
        />
      )}

      {/* Gradients */}
      <defs>
        <radialGradient id="cookieGradient" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#E8C090" />
          <stop offset="50%" stopColor="#D4A574" />
          <stop offset="100%" stopColor="#B8895A" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function BrokenCookieSVG() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="w-full h-full"
      role="img"
      aria-label="깨진 포춘쿠키"
    >
      {/* Shadow */}
      <ellipse cx="100" cy="130" rx="70" ry="6" fill="rgba(0,0,0,0.2)" />

      {/* Left half */}
      <g className="origin-center" style={{ transform: 'translateX(-15px) rotate(-12deg)' }}>
        <path
          d="M30 80 C30 40, 70 20, 100 20 L98 50 L95 70 L100 100 C100 100, 80 110, 60 105 C40 100, 30 90, 30 80Z"
          fill="url(#cookieGradientLeft)"
          stroke="#B8895A"
          strokeWidth="1.5"
        />
        <circle cx="65" cy="55" r="2" fill="#C49660" opacity="0.4" />
        <circle cx="85" cy="45" r="1.5" fill="#C49660" opacity="0.3" />
      </g>

      {/* Right half */}
      <g className="origin-center" style={{ transform: 'translateX(15px) rotate(12deg)' }}>
        <path
          d="M100 20 C130 20, 170 40, 170 80 C170 90, 160 100, 140 105 C120 110, 100 100, 100 100 L95 70 L98 50 L100 20Z"
          fill="url(#cookieGradientRight)"
          stroke="#B8895A"
          strokeWidth="1.5"
        />
        <circle cx="115" cy="48" r="2" fill="#C49660" opacity="0.4" />
        <circle cx="135" cy="58" r="1.5" fill="#C49660" opacity="0.3" />
      </g>

      {/* Crumbs */}
      <circle cx="80" cy="120" r="3" fill="#D4A574" opacity="0.6" />
      <circle cx="95" cy="125" r="2" fill="#D4A574" opacity="0.5" />
      <circle cx="112" cy="122" r="2.5" fill="#D4A574" opacity="0.6" />
      <circle cx="125" cy="118" r="1.5" fill="#D4A574" opacity="0.4" />

      <defs>
        <radialGradient id="cookieGradientLeft" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#E8C090" />
          <stop offset="100%" stopColor="#B8895A" />
        </radialGradient>
        <radialGradient id="cookieGradientRight" cx="60%" cy="30%">
          <stop offset="0%" stopColor="#E8C090" />
          <stop offset="100%" stopColor="#B8895A" />
        </radialGradient>
      </defs>
    </svg>
  );
}
