import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '포춘쿠키 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pt-14 px-4 py-12">
        <article className="max-w-2xl mx-auto prose-invert">
          <h1 className="text-3xl font-bold text-cookie-gold mb-8">
            개인정보처리방침
          </h1>
          <p className="text-sm text-text-muted mb-8">
            시행일: 2026년 2월 10일
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              1. 수집하는 개인정보 항목
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              포춘쿠키(이하 &apos;서비스&apos;)는 서비스 제공을 위해 최소한의 정보를 수집합니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>자동으로 수집되는 정보: 접속 IP, 브라우저 유형, 접속 시간, 페이지 방문 기록</li>
              <li>쿠키(Cookie): 서비스 이용 편의를 위한 웹 쿠키</li>
              <li>Google Analytics: 익명화된 이용 통계 (구글 개인정보 처리방침에 따름)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              2. 개인정보의 수집 및 이용 목적
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>서비스 제공 및 운영</li>
              <li>서비스 개선을 위한 통계 분석</li>
              <li>광고 서비스 제공 (Google AdSense)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              3. 개인정보의 보유 및 이용기간
            </h2>
            <p className="text-text-secondary leading-relaxed">
              수집된 정보는 서비스 이용 기간 동안 보유되며, 이용 목적이 달성된 후에는
              지체 없이 파기합니다. 단, 관련 법령에 의해 보존이 필요한 경우
              해당 기간 동안 보관합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="text-text-secondary leading-relaxed">
              서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 법령에 의해 요구되는 경우에는 예외로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              5. 광고 관련 안내
            </h2>
            <p className="text-text-secondary leading-relaxed">
              본 서비스는 Google AdSense를 통해 광고를 게재합니다.
              Google은 사용자의 관심사에 기반한 광고를 표시하기 위해 쿠키를 사용할 수 있습니다.
              Google의 광고 쿠키 사용에 대한 자세한 내용은 Google 광고 개인정보 보호 FAQ를
              참조하시기 바랍니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              6. 쿠키(Cookie) 사용
            </h2>
            <p className="text-text-secondary leading-relaxed">
              서비스는 이용자의 편의를 위해 쿠키를 사용합니다.
              이용자는 웹 브라우저 설정을 통해 쿠키 허용 여부를 결정할 수 있습니다.
              쿠키를 거부할 경우 서비스 이용에 일부 제한이 있을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              7. 개인정보 관련 문의
            </h2>
            <p className="text-text-secondary leading-relaxed">
              개인정보 관련 문의사항이 있으시면 문의 페이지를 통해 연락해 주시기 바랍니다.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
