import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { blogPosts } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: '블로그',
  description:
    '포춘쿠키 블로그 - 운세, 풍수, 꿈 해몽, 행운의 숫자 등 다양한 운세 관련 정보를 만나보세요.',
  keywords: [
    '운세 블로그',
    '포춘쿠키 블로그',
    '풍수지리',
    '꿈 해몽',
    '띠별 운세',
    '사주팔자',
    '행운의 숫자',
  ],
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 pt-14 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-cookie-gold mb-3">블로그</h1>
          <p className="text-text-secondary mb-10">
            운세, 풍수, 꿈 해몽 등 다양한 운세 관련 이야기를 만나보세요.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-bg-card rounded-xl p-6 border border-white/5 hover:border-cookie-gold/30 transition-all duration-300 hover:-translate-y-1"
              >
                <time className="text-xs text-text-muted">{post.date}</time>
                <h2 className="text-lg font-semibold text-text-primary mt-2 mb-3 group-hover:text-cookie-gold transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                  {post.description}
                </p>
                <span className="inline-block mt-4 text-sm text-cookie-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  자세히 읽기 &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
