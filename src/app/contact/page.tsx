import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '문의하기',
  description: '포춘쿠키에 대한 문의사항을 남겨주세요',
};

export default function ContactPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pt-14 px-4 py-12">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-cookie-gold mb-8">
            문의하기
          </h1>

          <section className="mb-8">
            <p className="text-text-secondary leading-relaxed mb-6">
              포춘쿠키 서비스에 대한 문의사항, 제안, 버그 리포트 등이 있으시면
              아래 방법으로 연락해 주시기 바랍니다.
            </p>

            <div className="bg-bg-card/50 rounded-xl p-6 border border-white/5 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-cookie-gold mb-1">
                  이메일
                </h3>
                <p className="text-text-secondary">
                  contact@fortunecookie.kr
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-cookie-gold mb-1">
                  응답 시간
                </h3>
                <p className="text-text-secondary">
                  평일 기준 1~2영업일 이내 답변 드리겠습니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              자주 묻는 질문
            </h2>
            <div className="space-y-4">
              <div className="bg-bg-card/30 rounded-lg p-4 border border-white/5">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Q. 하루에 몇 번 운세를 볼 수 있나요?
                </h3>
                <p className="text-sm text-text-secondary">
                  A. 오늘의 운세는 하루에 한 번 제공되며, 다시 뽑기 기능을 통해
                  추가로 운세를 확인할 수 있습니다.
                </p>
              </div>
              <div className="bg-bg-card/30 rounded-lg p-4 border border-white/5">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Q. 운세를 친구에게 공유할 수 있나요?
                </h3>
                <p className="text-sm text-text-secondary">
                  A. 네! 카카오톡, 트위터, 링크 복사 등 다양한 방법으로
                  친구에게 운세를 공유할 수 있습니다.
                </p>
              </div>
              <div className="bg-bg-card/30 rounded-lg p-4 border border-white/5">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Q. 운세는 정확한가요?
                </h3>
                <p className="text-sm text-text-secondary">
                  A. 포춘쿠키의 운세는 재미와 긍정적인 에너지를 위한 것입니다.
                  실제 미래를 예측하지는 않으니 가벼운 마음으로 즐겨주세요!
                </p>
              </div>
              <div className="bg-bg-card/30 rounded-lg p-4 border border-white/5">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Q. 모바일에서도 이용할 수 있나요?
                </h3>
                <p className="text-sm text-text-secondary">
                  A. 네! 모바일 브라우저에서 최적화되어 있으며, 핸드폰을 흔들어서
                  쿠키를 깨는 특별한 기능도 지원합니다.
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
