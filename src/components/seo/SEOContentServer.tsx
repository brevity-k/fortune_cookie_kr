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

      <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
        <h2 className="text-lg font-semibold text-cookie-gold mb-4">자주 묻는 질문</h2>
        <div className="space-y-2">
          {content.faq.map((item) => (
            <details key={item.q} className="faq-details border border-white/5 rounded-lg overflow-hidden">
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
