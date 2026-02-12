import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { blogPosts } from '@/data/blog-posts';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      locale: 'ko_KR',
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fortunecookie.ai.kr';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: '포춘쿠키',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: '포춘쿠키',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
    inLanguage: 'ko',
  };

  return (
    <div className="star-field min-h-dvh flex flex-col">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 pt-14 px-4 py-12">
        <article className="max-w-2xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-text-muted hover:text-cookie-gold transition-colors mb-8"
          >
            &larr; 블로그 목록으로
          </Link>

          <time className="block text-sm text-text-muted mb-3">
            {post.date}
          </time>
          <h1 className="text-3xl font-bold text-cookie-gold mb-8">
            {post.title}
          </h1>

          <div
            className="prose-blog text-text-secondary leading-relaxed [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-text-primary [&>h2]:mt-8 [&>h2]:mb-3 [&>p]:mb-4 [&>p]:text-text-secondary [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-white/5">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-cookie-gold hover:text-gold-sparkle transition-colors"
            >
              &larr; 다른 글 더 보기
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
