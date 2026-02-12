import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/types/fortune";
import { blogPosts } from "@/data/blog-posts";
import { ZODIAC_SIGNS } from "@/lib/horoscopes";

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

  const horoscopeDailyEntries = ZODIAC_SIGNS.map((sign) => ({
    url: `${siteUrl}/horoscope/daily/${sign.key}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const horoscopeWeeklyEntries = ZODIAC_SIGNS.map((sign) => ({
    url: `${siteUrl}/horoscope/weekly/${sign.key}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const horoscopeMonthlyEntries = ZODIAC_SIGNS.map((sign) => ({
    url: `${siteUrl}/horoscope/monthly/${sign.key}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    {
      url: `${siteUrl}/horoscope`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...horoscopeDailyEntries,
    ...horoscopeWeeklyEntries,
    ...horoscopeMonthlyEntries,
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
