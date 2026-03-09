import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '맞춤 운세 서비스',
  description: '매일 나만을 위한 운세를 받아보세요. 사주/별자리 차트를 기반으로 당신의 이야기를 알수록 더 깊어지는 AI 운세.',
  alternates: { canonical: '/premium' },
};

const features = [
  {
    emoji: '🔮',
    title: '매일 새로운 맞춤 운세',
    desc: '당신의 사주 원국 또는 출생 차트를 기반으로 매일 달라지는 운세를 받아보세요.',
  },
  {
    emoji: '🎯',
    title: '당신을 알수록 깊어지는 운세',
    desc: '요즘 고민, 관심사를 공유할수록 운세가 놀라울 정도로 정확해집니다.',
  },
  {
    emoji: '📊',
    title: '분야별 상세 운세',
    desc: '사랑, 직업, 건강 — 각 분야별로 상세한 오늘의 운세를 확인하세요.',
  },
  {
    emoji: '📅',
    title: '월간 운세 리포트',
    desc: '이번 달의 전체적인 흐름과 주의할 점을 한눈에 파악하세요.',
  },
];

const plans = [
  {
    label: '월간',
    price: '9,900',
    period: '월',
    note: null,
    highlight: false,
  },
  {
    label: '연간',
    price: '99,000',
    period: '년',
    note: '월 8,250원 — 17% 할인',
    highlight: true,
  },
];

export default function PremiumPage() {
  return (
    <div className="min-h-dvh flex flex-col star-field">
      <Header />
      <main className="flex-1 pt-14">
        {/* Hero */}
        <section className="px-4 py-12 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-5xl">🥠</div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              나만의 맞춤 운세
            </h1>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed">
              매일 나만을 위한 운세를 받아보세요.<br />
              당신의 이야기를 알수록 더 깊어지는 운세.
            </p>
            <p className="text-sm text-text-muted">7일 무료 체험</p>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 pb-12">
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-bg-card/40 border border-white/5 rounded-xl p-5 space-y-2"
              >
                <div className="text-2xl">{f.emoji}</div>
                <h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="px-4 pb-12">
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-lg font-bold text-text-primary text-center">요금제</h2>
            <div className="grid grid-cols-2 gap-3">
              {plans.map((plan) => (
                <div
                  key={plan.label}
                  className={`rounded-xl p-4 text-center space-y-1 border ${
                    plan.highlight
                      ? 'bg-cookie-gold/10 border-cookie-gold/30'
                      : 'bg-bg-card/40 border-white/5'
                  }`}
                >
                  {plan.highlight && (
                    <span className="text-[10px] font-bold text-cookie-gold bg-cookie-gold/10 rounded-full px-2 py-0.5">
                      추천
                    </span>
                  )}
                  <p className="text-xs text-text-muted">{plan.label}</p>
                  <p className="text-xl font-bold text-text-primary">
                    ₩{plan.price}
                    <span className="text-xs text-text-muted font-normal">/{plan.period}</span>
                  </p>
                  {plan.note && (
                    <p className="text-[10px] text-cookie-gold">{plan.note}</p>
                  )}
                </div>
              ))}
            </div>
            <Link
              href="/login?redirect=/my-fortune"
              className="block w-full text-center bg-cookie-gold text-bg-primary font-bold py-3.5 rounded-xl hover:bg-gold-sparkle transition-colors"
            >
              7일 무료로 시작하기
            </Link>
            <p className="text-[10px] text-text-muted/70 text-center">
              무료 체험 후 자동 결제됩니다. 언제든 해지 가능.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 pb-16">
          <div className="max-w-md mx-auto space-y-6">
            <h2 className="text-lg font-bold text-text-primary text-center">어떻게 작동하나요?</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: '차트 분석', desc: '사주 또는 출생 차트를 기반으로 기본 운세를 생성합니다.' },
                { step: '2', title: '당신의 이야기', desc: '요즘 고민이나 관심사를 간단히 공유하세요. (선택사항)' },
                { step: '3', title: '맞춤 운세', desc: '차트 데이터와 당신의 상황이 결합된 깊이 있는 운세를 받아보세요.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-cookie-gold/20 border border-cookie-gold/30 flex items-center justify-center text-sm font-bold text-cookie-gold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                    <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
