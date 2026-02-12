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
    const zodiacAnimals = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'sheep', 'monkey', 'rooster', 'dog', 'pig'];
    const mbtiTypes = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];

    return [
      ...categories.map((cat) => ({
        loc: `/fortune/${cat}`,
        changefreq: 'daily',
        priority: 0.8,
      })),
      ...zodiacAnimals.map((animal) => ({
        loc: `/fortune/zodiac/${animal}`,
        changefreq: 'daily',
        priority: 0.8,
      })),
      ...mbtiTypes.map((type) => ({
        loc: `/fortune/mbti/${type}`,
        changefreq: 'daily',
        priority: 0.8,
      })),
      { loc: '/compatibility', changefreq: 'weekly', priority: 0.8 },
      { loc: '/collection', changefreq: 'weekly', priority: 0.6 },
      { loc: '/fortune/valentines', changefreq: 'yearly', priority: 0.7 },
      { loc: '/fortune/exam-luck', changefreq: 'yearly', priority: 0.7 },
      { loc: '/fortune/new-year', changefreq: 'yearly', priority: 0.7 },
    ];
  },
};
