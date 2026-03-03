import type { SEOContent } from '@/data/seo/category-content';

interface SEOContentServerProps {
  title: string;
  content: SEOContent;
}

export default function SEOContentServer({ title, content }: SEOContentServerProps) {
  return (
    <section className="px-4 py-8 max-w-2xl mx-auto space-y-6">
      <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-cookie-gold mb-3">{title} 특징</h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">{content.description}</p>
        <ul className="space-y-2 mb-4">
          {content.traits.map((trait) => (
            <li key={trait} className="text-sm text-text-secondary flex items-start gap-2">
              <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
              <span>{trait}</span>
            </li>
          ))}
        </ul>
        <h3 className="text-sm font-semibold text-text-primary mb-2">궁합</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">{content.compatibility}</p>
        <h3 className="text-sm font-semibold text-text-primary mb-2">오늘의 팁</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{content.tip}</p>
      </div>

      {content.guide && (
        <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-cookie-gold mb-3">{title} 운세 가이드</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{content.guide}</p>
        </div>
      )}

      {content.sampleMessages && content.sampleMessages.length > 0 && (
        <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-cookie-gold mb-3">{title} 운세 예시</h2>
          <p className="text-sm text-text-muted mb-4">포춘쿠키에서 만날 수 있는 {title} 메시지 예시입니다.</p>
          <ul className="space-y-3">
            {content.sampleMessages.map((msg) => (
              <li key={msg} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">🥠</span>
                <span className="italic">&quot;{msg}&quot;</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-cookie-gold mb-4">자주 묻는 질문</h2>
        <div className="space-y-2">
          {content.faq.map((item, index) => (
            <details
              key={item.q}
              className="faq-details border border-white/5 rounded-lg overflow-hidden"
              {...(index === 0 ? { open: true } : {})}
            >
              <summary className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors cursor-pointer text-sm font-medium text-text-primary">
                <span>{item.q}</span>
                <span className="faq-marker text-text-muted text-lg shrink-0">+</span>
              </summary>
              <div className="px-4 pb-3">
                <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
