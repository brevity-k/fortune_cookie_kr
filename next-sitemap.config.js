/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://fortunecookie.ai.kr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [],
  },
  additionalPaths: async () => {
    const categories = ['general', 'love', 'career', 'health', 'study', 'relationship'];
    return categories.map((cat) => ({
      loc: `/fortune/${cat}`,
      changefreq: 'daily',
      priority: 0.8,
    }));
  },
};
