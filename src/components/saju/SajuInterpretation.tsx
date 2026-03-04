'use client';

import type { FiveElementAnalysis, Element, YinYang } from '@/lib/saju/types';

const ELEMENT_KOREAN: Record<Element, string> = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};

const DAY_MASTER_TRAITS: Record<Element, Record<YinYang, { title: string; personality: string; strengths: string; advice: string }>> = {
  wood: {
    yang: {
      title: '갑목(甲木) — 큰 나무',
      personality: '당신은 큰 나무처럼 곧고 정직한 성품을 지녔습니다. 리더십이 강하고 진취적이며, 한번 정한 목표를 향해 꾸준히 성장합니다.',
      strengths: '결단력, 추진력, 정의감이 뛰어나며 어려운 환경에서도 굴하지 않는 강인함이 있습니다.',
      advice: '유연성을 기르세요. 나무도 바람에 흔들려야 부러지지 않습니다.',
    },
    yin: {
      title: '을목(乙木) — 꽃과 풀',
      personality: '당신은 부드럽고 유연한 성품을 가졌습니다. 환경에 잘 적응하며, 사람들과의 관계에서 조화를 이루는 능력이 탁월합니다.',
      strengths: '적응력, 협조성, 예술적 감각이 뛰어나며 섬세한 관찰력을 지녔습니다.',
      advice: '자신만의 뿌리를 단단히 하세요. 주관이 확실할 때 더 빛납니다.',
    },
  },
  fire: {
    yang: {
      title: '병화(丙火) — 태양',
      personality: '당신은 태양처럼 밝고 열정적입니다. 주변을 환하게 비추는 존재감이 있으며, 긍정적인 에너지로 사람들을 이끕니다.',
      strengths: '열정, 표현력, 사교성이 뛰어나며 창의적인 아이디어가 풍부합니다.',
      advice: '때로는 쉬어가는 것도 중요합니다. 태양도 밤에는 쉽니다.',
    },
    yin: {
      title: '정화(丁火) — 촛불',
      personality: '당신은 촛불처럼 따뜻하고 섬세합니다. 깊은 통찰력과 직관력을 가졌으며, 조용히 주변을 밝히는 힘이 있습니다.',
      strengths: '직관력, 분석력, 예리한 판단력이 돋보이며 학문이나 연구에 재능이 있습니다.',
      advice: '자신감을 가지세요. 작은 불꽃도 어둠을 밝힐 수 있습니다.',
    },
  },
  earth: {
    yang: {
      title: '무토(戊土) — 큰 산',
      personality: '당신은 산처럼 듬직하고 안정적입니다. 신뢰감을 주며, 묵묵히 자리를 지키는 든든한 존재입니다.',
      strengths: '신뢰성, 포용력, 안정감이 뛰어나며 중재자 역할을 잘 해냅니다.',
      advice: '변화를 두려워하지 마세요. 산도 계절에 따라 옷을 갈아입습니다.',
    },
    yin: {
      title: '기토(己土) — 논밭',
      personality: '당신은 비옥한 토양처럼 만물을 품는 넓은 마음을 가졌습니다. 실용적이고 현실적인 감각이 뛰어납니다.',
      strengths: '포용력, 실용성, 세심함이 돋보이며 사람을 키우는 재능이 있습니다.',
      advice: '자신에게도 영양분을 주세요. 남을 위하는 만큼 자신도 소중히 여기세요.',
    },
  },
  metal: {
    yang: {
      title: '경금(庚金) — 강철',
      personality: '당신은 강철처럼 강인하고 결단력이 있습니다. 정의감이 강하며, 옳고 그름을 분명히 가립니다.',
      strengths: '결단력, 실행력, 정의감이 뛰어나며 어떤 상황에서도 흔들리지 않는 의지가 있습니다.',
      advice: '부드러움도 힘입니다. 강철도 열을 가하면 원하는 형태로 만들 수 있습니다.',
    },
    yin: {
      title: '신금(辛金) — 보석',
      personality: '당신은 보석처럼 섬세하고 아름다운 감성을 지녔습니다. 완벽주의적 성향이 있으며, 높은 미적 감각을 가졌습니다.',
      strengths: '심미안, 정밀함, 예술성이 뛰어나며 세련된 감각으로 주변을 아름답게 만듭니다.',
      advice: '작은 흠에 너무 연연하지 마세요. 보석의 가치는 흠으로 결정되지 않습니다.',
    },
  },
  water: {
    yang: {
      title: '임수(壬水) — 바다',
      personality: '당신은 바다처럼 넓고 깊은 마음을 가졌습니다. 지혜롭고 총명하며, 어떤 상황에서도 길을 찾아냅니다.',
      strengths: '지혜, 포용력, 적응력이 뛰어나며 큰 그림을 보는 안목이 있습니다.',
      advice: '방향을 정하세요. 바다도 조류가 있어야 생명이 번성합니다.',
    },
    yin: {
      title: '계수(癸水) — 이슬비',
      personality: '당신은 이슬비처럼 조용하지만 깊은 영향력을 가졌습니다. 감수성이 풍부하고 직관력이 뛰어납니다.',
      strengths: '감수성, 직관력, 창의성이 돋보이며 깊은 사색을 통해 통찰을 얻습니다.',
      advice: '자신을 과소평가하지 마세요. 이슬비도 대지를 적시는 힘이 있습니다.',
    },
  },
};

const STRENGTH_INTERPRETATION: Record<string, { description: string; advice: string }> = {
  strong: {
    description: '신강(身強)은 일간의 기운이 강한 상태입니다. 자기 주장이 강하고 독립적이며, 자신의 능력을 발휘할 기회가 많습니다.',
    advice: '기운을 적절히 발산하는 것이 중요합니다. 용신이 가리키는 방향으로 에너지를 활용하세요.',
  },
  weak: {
    description: '신약(身弱)은 일간의 기운이 약한 상태입니다. 협력을 통해 성과를 이루며, 주변의 도움을 잘 활용하는 지혜가 있습니다.',
    advice: '용신이 가리키는 오행을 보강하면 운의 균형이 좋아집니다. 해당 방위, 색상, 직업군이 도움이 됩니다.',
  },
};

const ELEMENT_TIPS: Record<Element, { direction: string; color: string; season: string }> = {
  wood: { direction: '동쪽', color: '초록색, 청록색', season: '봄' },
  fire: { direction: '남쪽', color: '빨간색, 보라색', season: '여름' },
  earth: { direction: '중앙', color: '노란색, 갈색', season: '환절기' },
  metal: { direction: '서쪽', color: '흰색, 금색', season: '가을' },
  water: { direction: '북쪽', color: '검은색, 파란색', season: '겨울' },
};

interface SajuInterpretationProps {
  analysis: FiveElementAnalysis;
}

export default function SajuInterpretation({ analysis }: SajuInterpretationProps) {
  const { dayMaster, dayMasterYinYang, isStrong, favorableElement } = analysis;
  const traits = DAY_MASTER_TRAITS[dayMaster][dayMasterYinYang];
  const strength = STRENGTH_INTERPRETATION[isStrong ? 'strong' : 'weak'];
  const tips = ELEMENT_TIPS[favorableElement];

  return (
    <div className="space-y-4">
      {/* Day Master Personality */}
      <div className="bg-bg-card/30 rounded-xl p-5 border border-white/5">
        <h3 className="text-sm font-semibold text-cookie-gold mb-3">일간 해석</h3>
        <h4 className="text-base font-bold text-text-primary mb-2">{traits.title}</h4>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">{traits.personality}</p>
        <div className="space-y-2">
          <div>
            <span className="text-xs font-semibold text-text-muted">강점</span>
            <p className="text-sm text-text-secondary leading-relaxed">{traits.strengths}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-text-muted">조언</span>
            <p className="text-sm text-text-secondary leading-relaxed">{traits.advice}</p>
          </div>
        </div>
      </div>

      {/* Strength Analysis */}
      <div className="bg-bg-card/30 rounded-xl p-5 border border-white/5">
        <h3 className="text-sm font-semibold text-cookie-gold mb-3">
          {isStrong ? '신강(身強)' : '신약(身弱)'} 분석
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-2">{strength.description}</p>
        <p className="text-sm text-text-secondary leading-relaxed">{strength.advice}</p>
      </div>

      {/* Favorable Element Tips */}
      <div className="bg-bg-card/30 rounded-xl p-5 border border-white/5">
        <h3 className="text-sm font-semibold text-cookie-gold mb-3">
          용신(用神): {ELEMENT_KOREAN[favorableElement]}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          {ELEMENT_KOREAN[favorableElement]}의 기운을 보강하면 운의 균형이 좋아집니다.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <span className="text-xs text-text-muted block mb-1">방위</span>
            <span className="text-sm text-text-primary font-medium">{tips.direction}</span>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <span className="text-xs text-text-muted block mb-1">색상</span>
            <span className="text-sm text-text-primary font-medium">{tips.color}</span>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <span className="text-xs text-text-muted block mb-1">계절</span>
            <span className="text-sm text-text-primary font-medium">{tips.season}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted/50 text-center">
        본 해석은 사주명리학의 기본 원리에 따른 일반적인 해석이며, 참고용입니다.
      </p>
    </div>
  );
}
