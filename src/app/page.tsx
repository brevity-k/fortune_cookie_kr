import type { Metadata } from 'next';
import HomeClient from './client';

export const metadata: Metadata = {
  title: '포춘쿠키 - 오늘의 운세 | 무료 포춘쿠키 운세',
  description:
    '포춘쿠키를 깨고 오늘의 운세를 확인하세요! 사랑운, 재물운, 건강운, 학업운, 대인운 등 다양한 카테고리의 무료 운세를 매일 새롭게 만나보세요.',
  openGraph: {
    title: '포춘쿠키 - 오늘의 운세 | 무료 포춘쿠키 운세',
    description:
      '포춘쿠키를 깨고 오늘의 운세를 확인하세요! 매일 새로운 운세를 무료로 확인하세요.',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
