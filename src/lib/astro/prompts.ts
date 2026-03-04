import type { NatalChart } from './types';
import { formatChart } from './format';

export function buildInterpretationPrompt(chart: NatalChart): string {
  const formatted = formatChart(chart);

  const sun = formatted.planets.find((p) => p.planet === 'Sun');
  const moon = formatted.planets.find((p) => p.planet === 'Moon');
  const mercury = formatted.planets.find((p) => p.planet === 'Mercury');
  const venus = formatted.planets.find((p) => p.planet === 'Venus');
  const mars = formatted.planets.find((p) => p.planet === 'Mars');
  const asc = formatted.ascendant;
  const mc = formatted.midheaven;

  return `당신은 서양 점성학 전문가입니다. 아래 출생 차트 데이터를 바탕으로 따뜻하고 통찰력 있는 성격 분석을 작성하세요.

태양: ${sun?.signKorean} ${sun?.degree} (${sun?.house}하우스)${sun?.retrograde ? ' 역행' : ''}
달: ${moon?.signKorean} ${moon?.degree} (${moon?.house}하우스)${moon?.retrograde ? ' 역행' : ''}
상승점(ASC): ${asc.signKorean} ${asc.degree}
수성: ${mercury?.signKorean} ${mercury?.degree} (${mercury?.house}하우스)${mercury?.retrograde ? ' 역행' : ''}
금성: ${venus?.signKorean} ${venus?.degree} (${venus?.house}하우스)${venus?.retrograde ? ' 역행' : ''}
화성: ${mars?.signKorean} ${mars?.degree} (${mars?.house}하우스)${mars?.retrograde ? ' 역행' : ''}
미드헤븐: ${mc.signKorean} ${mc.degree}

원소 균형: 불 ${chart.elements.fire}, 흙 ${chart.elements.earth}, 바람 ${chart.elements.air}, 물 ${chart.elements.water}
양상 균형: 활동궁 ${chart.modalities.cardinal}, 고정궁 ${chart.modalities.fixed}, 변통궁 ${chart.modalities.mutable}

각 항목당 2-3문장을 작성하세요. 전문 용어를 쉽게 풀어 설명하고, 따뜻하고 격려하는 톤으로 작성하되 차트 데이터에 근거하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "personality": "성격과 정체성 (태양 기반)",
  "emotions": "감정과 내면 (달 기반)",
  "communication": "소통과 사고 (수성 기반)",
  "love": "사랑과 관계 (금성 기반)",
  "ambition": "야망과 행동력 (화성 기반)",
  "career": "직업과 성취 (미드헤븐 기반)",
  "balance": "에너지 균형 (원소/양상 기반)"
}`;
}
