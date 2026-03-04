import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoginForm from './client';

export const metadata: Metadata = {
  title: '로그인',
  description: '맞춤 운세 서비스를 이용하려면 로그인하세요.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex flex-col star-field">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-14 pb-8 px-4">
        <Suspense fallback={<div className="text-text-muted text-sm">로딩 중...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
