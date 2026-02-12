import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const message = searchParams.get('message') || '오늘의 운세';
  const rating = parseInt(searchParams.get('rating') || '3', 10);
  const emoji = searchParams.get('emoji') || '🥠';
  const luckyNumber = searchParams.get('luckyNumber') || '7';
  const luckyColor = searchParams.get('luckyColor') || '금색';
  const category = searchParams.get('category') || '총운';
  const streak = parseInt(searchParams.get('streak') || '0', 10);
  const width = Math.min(parseInt(searchParams.get('w') || '1080', 10), 1080);
  const height = Math.min(parseInt(searchParams.get('h') || '1920', 10), 1920);
  const isCompact = width <= 800;

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const labels: Record<number, string> = { 1: '흉', 2: '소흉', 3: '평', 4: '소길', 5: '대길' };
  const ratingLabel = labels[rating] || '평';

  if (isCompact) {
    // Compact landscape layout for Kakao/OG share cards
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1A0F2E 0%, #2D1B4E 50%, #1A0F2E 100%)',
            position: 'relative',
            overflow: 'hidden',
            padding: '30px 40px',
          }}
        >
          {/* Decorative border */}
          <div
            style={{
              position: 'absolute',
              inset: 12,
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: 16,
              display: 'flex',
            }}
          />

          {/* Left: emoji + rating */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 36 }}>
            <div style={{ fontSize: 64, marginBottom: 12, display: 'flex' }}>{emoji}</div>
            <div style={{ fontSize: 20, color: '#FFD700', display: 'flex' }}>{stars}</div>
            <div style={{ fontSize: 18, color: '#FFD700', fontWeight: 700, marginTop: 4, display: 'flex' }}>{ratingLabel}</div>
          </div>

          {/* Right: message + info */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                padding: '4px 14px',
                borderRadius: 12,
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: 12,
                alignSelf: 'flex-start',
              }}
            >
              {category}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#FFF8E7',
                lineHeight: 1.4,
                marginBottom: 16,
                display: 'flex',
              }}
            >
              {message}
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)', display: 'flex' }}>행운의 숫자</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#FFD700', display: 'flex' }}>{luckyNumber}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)', display: 'flex' }}>행운의 색</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#FFD700', display: 'flex' }}>{luckyColor}</div>
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              right: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              color: 'rgba(255, 215, 0, 0.4)',
            }}
          >
            🥠 fortunecookie.ai.kr
          </div>
        </div>
      ),
      { width, height }
    );
  }

  // Full portrait layout for image download / Instagram stories
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A0F2E 0%, #2D1B4E 50%, #1A0F2E 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '60px 50px',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            inset: 20,
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: 24,
            display: 'flex',
          }}
        />

        {/* Decorative stars */}
        <div style={{ position: 'absolute', top: 50, left: 60, fontSize: 28, opacity: 0.5, display: 'flex' }}>✨</div>
        <div style={{ position: 'absolute', top: 120, right: 80, fontSize: 22, opacity: 0.4, display: 'flex' }}>⭐</div>
        <div style={{ position: 'absolute', bottom: 180, left: 50, fontSize: 20, opacity: 0.3, display: 'flex' }}>✦</div>
        <div style={{ position: 'absolute', bottom: 100, right: 60, fontSize: 24, opacity: 0.4, display: 'flex' }}>✨</div>

        {/* Streak badge */}
        {streak > 1 && (
          <div
            style={{
              position: 'absolute',
              top: 50,
              right: 50,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 20,
              background: 'rgba(255, 215, 0, 0.15)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              fontSize: 20,
              color: '#FFD700',
            }}
          >
            🔥 연속 {streak}일째
          </div>
        )}

        {/* Category */}
        <div
          style={{
            display: 'flex',
            padding: '8px 20px',
            borderRadius: 20,
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            fontSize: 22,
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: 30,
          }}
        >
          {category}
        </div>

        {/* Fortune emoji */}
        <div style={{ fontSize: 100, marginBottom: 30, display: 'flex' }}>{emoji}</div>

        {/* Message */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: '#FFF8E7',
            textAlign: 'center',
            lineHeight: 1.5,
            marginBottom: 40,
            maxWidth: 900,
            display: 'flex',
          }}
        >
          {message}
        </div>

        {/* Rating */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 30,
          }}
        >
          <div style={{ fontSize: 32, color: '#FFD700', display: 'flex' }}>{stars}</div>
          <div style={{ fontSize: 24, color: '#FFD700', fontWeight: 700, display: 'flex' }}>{ratingLabel}</div>
        </div>

        {/* Lucky info */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.5)', marginBottom: 4, display: 'flex' }}>행운의 숫자</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#FFD700', display: 'flex' }}>{luckyNumber}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.5)', marginBottom: 4, display: 'flex' }}>행운의 색</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#FFD700', display: 'flex' }}>{luckyColor}</div>
          </div>
        </div>

        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 20,
            color: 'rgba(255, 215, 0, 0.5)',
          }}
        >
          🥠 fortunecookie.ai.kr
        </div>
      </div>
    ),
    { width, height }
  );
}
