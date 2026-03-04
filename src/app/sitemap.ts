import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/types/fortune";
import { blogPosts } from "@/data/blog-posts";
import { ZODIAC_ANIMALS } from "@/types/zodiac";
import { MBTI_TYPES } from "@/types/mbti";
import { HOROSCOPE_SIGNS } from "@/types/horoscope";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fortunecookie.ai.kr";
const LAST_CONTENT_UPDATE = new Date("2026-02-23");

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryEntries = CATEGORIES.map((cat) => ({
    url: `${siteUrl}/fortune/${cat.key}`,
    lastModified: LAST_CONTENT_UPDATE,
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
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const mbtiEntries = MBTI_TYPES.map((m) => ({
    url: `${siteUrl}/fortune/mbti/${m.key}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const horoscopeEntries = HOROSCOPE_SIGNS.map((s) => ({
    url: `${siteUrl}/fortune/horoscope/${s.key}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const hubEntries = [
    {
      url: `${siteUrl}/fortune/horoscope`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/fortune/zodiac`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/fortune/mbti`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  return [
    {
      url: siteUrl,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    ...hubEntries,
    ...zodiacEntries,
    ...mbtiEntries,
    ...horoscopeEntries,
    {
      url: `${siteUrl}/saju`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/compatibility`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/collection`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/fortune/new-year`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/fortune/valentines`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/fortune/exam-luck`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/fortune/christmas`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogEntries,
    {
      url: `${siteUrl}/about`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
