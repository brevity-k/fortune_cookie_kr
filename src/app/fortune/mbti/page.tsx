import type { Metadata } from "next";
import Link from "next/link";
import { MBTI_TYPES } from "@/types/mbti";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "MBTI 운세 - 16가지 MBTI 유형별 오늘의 포춘쿠키",
  description:
    "INTJ, ENFP, ISFJ 등 16가지 MBTI 유형별 오늘의 운세를 포춘쿠키로 확인하세요! 나의 성격 유형에 맞는 매일 새로운 무료 맞춤 운세를 제공합니다.",
  keywords: [
    "MBTI 운세",
    "MBTI 포춘쿠키",
    "ENFP 운세",
    "INTJ 운세",
    "성격유형 운세",
    "무료 운세",
  ],
  openGraph: {
    title: "MBTI 운세 - 16유형별 오늘의 포춘쿠키",
    description:
      "나의 MBTI에 맞는 맞춤 포춘쿠키 운세를 확인해보세요!",
  },
  alternates: {
    canonical: "/fortune/mbti",
  },
};

const GROUPS = [
  {
    name: "분석가형 (NT)",
    description: "논리적 사고와 전략적 분석을 중시하는 유형",
    types: ["intj", "intp", "entj", "entp"],
  },
  {
    name: "외교관형 (NF)",
    description: "이상주의와 공감 능력이 뛰어난 유형",
    types: ["infj", "infp", "enfj", "enfp"],
  },
  {
    name: "관리자형 (SJ)",
    description: "책임감과 안정성을 중시하는 유형",
    types: ["istj", "isfj", "estj", "esfj"],
  },
  {
    name: "탐험가형 (SP)",
    description: "행동력과 실용적 감각이 뛰어난 유형",
    types: ["istp", "isfp", "estp", "esfp"],
  },
];

export default function MBTIHubPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 pt-14">
        <section className="relative px-4 pt-8 pb-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-4xl mb-2 block">🧠</span>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              <span className="text-cookie-gold">MBTI</span> 포춘쿠키 운세
            </h1>
            <p className="text-sm text-text-muted mb-6 max-w-lg mx-auto">
              16가지 MBTI 성격 유형별 맞춤 포춘쿠키 운세를 확인하세요. 매일
              나의 유형에 맞는 새로운 운세 메시지, 행운의 숫자와 색이
              제공됩니다.
            </p>
          </div>
        </section>

        <section className="px-4 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {GROUPS.map((group) => (
              <div key={group.name}>
                <h2 className="text-sm font-semibold text-text-primary mb-1">
                  {group.name}
                </h2>
                <p className="text-xs text-text-muted mb-3">
                  {group.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {group.types.map((key) => {
                    const mbti = MBTI_TYPES.find((m) => m.key === key);
                    if (!mbti) return null;
                    return (
                      <Link
                        key={key}
                        href={`/fortune/mbti/${key}`}
                        className="bg-bg-card/30 rounded-xl p-4 border border-white/5 hover:border-cookie-gold/30 hover:bg-bg-card/50 transition-all group text-center"
                      >
                        <span className="text-2xl block mb-1.5">
                          {mbti.emoji}
                        </span>
                        <h3 className="text-sm font-bold text-text-primary group-hover:text-cookie-gold transition-colors">
                          {mbti.label}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">
                          {mbti.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-bg-card/30 rounded-xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-cookie-gold mb-3">
              MBTI별 포춘쿠키 운세란?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              MBTI(Myers-Briggs Type Indicator)는 칼 융의 심리 유형 이론에
              기반한 성격 유형 분류 체계로, 한국에서는 특히 높은 인기를
              누리고 있습니다. 외향(E)/내향(I), 감각(S)/직관(N),
              사고(T)/감정(F), 판단(J)/인식(P)의 네 가지 축으로 총 16가지
              성격 유형이 결정됩니다.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              포춘쿠키의 MBTI 운세는 매일 각 유형에 맞는 고유한 운세
              메시지를 제공합니다. 자신의 MBTI 유형을 선택하면 성격 특성에
              맞춘 행운의 숫자, 행운의 색과 함께 오늘 하루를 위한 운세를
              확인할 수 있습니다.
            </p>

            <h3 className="text-sm font-semibold text-text-primary mb-2">
              4가지 기질 그룹
            </h3>
            <ul className="space-y-2 mb-4">
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  <strong className="text-text-primary">분석가형(NT)</strong>:
                  INTJ, INTP, ENTJ, ENTP — 전략적 사고, 논리적 분석, 혁신을
                  추구하는 유형
                </span>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  <strong className="text-text-primary">외교관형(NF)</strong>:
                  INFJ, INFP, ENFJ, ENFP — 이상주의, 공감 능력, 인간관계를
                  중시하는 유형
                </span>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  <strong className="text-text-primary">관리자형(SJ)</strong>:
                  ISTJ, ISFJ, ESTJ, ESFJ — 안정성, 책임감, 전통을 중시하는
                  유형
                </span>
              </li>
              <li className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  <strong className="text-text-primary">탐험가형(SP)</strong>:
                  ISTP, ISFP, ESTP, ESFP — 행동력, 실용성, 즉흥적 감각이
                  뛰어난 유형
                </span>
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-text-primary mb-2">
              MBTI 운세 활용 팁
            </h3>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  자신의 MBTI 유형을 선택하여 매일 맞춤 운세를 확인해보세요.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  친구나 연인의 MBTI 운세도 함께 확인하면 대화 소재가
                  됩니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  MBTI 운세와 별자리 운세를 함께 보면 성격 유형과 점성술 두
                  가지 관점의 운세를 즐길 수 있습니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cookie-gold mt-0.5 shrink-0">•</span>
                <span>
                  궁합이 좋은 MBTI 유형의 운세도 확인하여 비교해보세요.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
