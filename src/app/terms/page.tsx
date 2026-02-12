import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '이용약관',
  description: '포춘쿠키 이용약관',
  openGraph: {
    title: '이용약관 | 포춘쿠키',
    description: '포춘쿠키 이용약관',
  },
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pt-14 px-4 py-12">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-cookie-gold mb-8">
            이용약관
          </h1>
          <p className="text-sm text-text-muted mb-8">
            시행일: 2026년 2월 10일
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              제1조 (목적)
            </h2>
            <p className="text-text-secondary leading-relaxed">
              이 약관은 포춘쿠키(이하 &apos;서비스&apos;)가 제공하는 온라인 운세
              서비스의 이용 조건 및 절차, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              제2조 (서비스의 내용)
            </h2>
            <p className="text-text-secondary leading-relaxed">
              서비스는 온라인 포춘쿠키를 통한 운세 메시지 제공, 카테고리별 운세,
              운세 관련 콘텐츠 등을 포함합니다. 서비스의 구체적인 내용은
              서비스 제공자의 사정에 따라 변경될 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              제3조 (서비스 이용)
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>서비스는 무료로 제공됩니다.</li>
              <li>별도의 회원가입 없이 이용할 수 있습니다.</li>
              <li>서비스는 24시간 운영을 원칙으로 하나, 시스템 점검 등의 사유로 일시 중단될 수 있습니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              제4조 (면책 조항)
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>
                서비스에서 제공하는 운세 메시지는 오락 목적으로만 제공되며,
                실제 미래를 예측하거나 보장하지 않습니다.
              </li>
              <li>
                이용자가 운세 메시지를 근거로 한 의사결정에 대해 서비스는
                어떠한 책임도 지지 않습니다.
              </li>
              <li>
                서비스는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등
                불가항력적인 사유로 서비스를 제공할 수 없는 경우에는
                책임을 지지 않습니다.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              제5조 (저작권)
            </h2>
            <p className="text-text-secondary leading-relaxed">
              서비스에 게시된 모든 콘텐츠(운세 메시지, 이미지, 디자인 등)의
              저작권은 서비스 제공자에게 있으며, 무단 복제, 배포, 전송을 금지합니다.
              다만, 서비스가 제공하는 공유 기능을 통한 개인적인 공유는 허용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              제6조 (약관의 변경)
            </h2>
            <p className="text-text-secondary leading-relaxed">
              서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은
              서비스 내에 공지함으로써 효력이 발생합니다.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
