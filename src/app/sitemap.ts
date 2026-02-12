import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/types/fortune";
import { blogPosts } from "@/data/blog-posts";
import { ZODIAC_ANIMALS } from "@/types/zodiac";
import { MBTI_TYPES } from "@/types/mbti";
import { HOROSCOPE_SIGNS } from "@/types/horoscope";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fortunecookie.ai.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryEntries = CATEGORIES.map((cat) => ({
    url: `${siteUrl}/fortune/${cat.key}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const zodiacEntries = ZODIAC_ANIMALS.map((z) => ({
    url: `${siteUrl}/fortune/zodiac/${z.key}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const mbtiEntries = MBTI_TYPES.map((m) => ({
    url: `${siteUrl}/fortune/mbti/${m.key}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const horoscopeEntries = HOROSCOPE_SIGNS.map((s) => ({
    url: `${siteUrl}/fortune/horoscope/${s.key}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    ...zodiacEntries,
    ...mbtiEntries,
    ...horoscopeEntries,
    {
      url: `${siteUrl}/compatibility`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/fortune/new-year`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/fortune/valentines`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/fortune/exam-luck`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogEntries,
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
