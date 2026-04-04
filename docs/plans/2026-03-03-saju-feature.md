# Saju (사주) Feature - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a free saju (Four Pillars of Destiny) feature to the KR fortune cookie site, porting the calculation engine from the EN site and creating Korean-localized UI components.

**Architecture:** Port `src/lib/saju/` calculation engine as-is from the EN site's `feature/saju-and-natal-chart` branch. Create new Korean UI components matching the KR site's design system (dark purple theme, cookie-gold accents, Tailwind CSS). Skip premium/Stripe/AI features entirely.

**Tech Stack:** Next.js App Router (TypeScript), Tailwind CSS, existing saju calculation library

---

### Task 1: Port Saju Calculation Library

**Files to create (from EN site `fortune_cookie` repo, branch `feature/saju-and-natal-chart`):**
- `src/lib/saju/types.ts`
- `src/lib/saju/constants.ts`
- `src/lib/saju/stems.ts`
- `src/lib/saju/branches.ts`
- `src/lib/saju/year-pillar.ts`
- `src/lib/saju/month-pillar.ts`
- `src/lib/saju/day-pillar.ts`
- `src/lib/saju/hour-pillar.ts`
- `src/lib/saju/solar-terms.ts`
- `src/lib/saju/four-pillars.ts`
- `src/lib/saju/five-elements.ts`
- `src/lib/saju/major-luck.ts`
- `src/lib/saju/current-luck.ts`
- `src/lib/saju/format.ts`
- `src/lib/saju/profile.ts` (localStorage persistence)
- `src/lib/saju/index.ts`

These are pure calculation files - copy as-is, no localization needed.

**Skip:** `premium.ts`, `use-premium.ts`, `prompts.ts` (premium/AI features)

---

### Task 2: Create Korean Saju UI Components

**Files to create:**
- `src/components/saju/SajuOnboarding.tsx` — Birth date input form (Korean labels)
- `src/components/saju/SajuChart.tsx` — Four Pillars visual chart
- `src/components/saju/FiveElementsBar.tsx` — Five Elements balance visualization
- `src/components/saju/MajorLuckTimeline.tsx` — 대운 timeline
- `src/components/saju/SajuInterpretation.tsx` — Basic static interpretation (no AI)

All components use KR site design: dark purple bg, cookie-gold accents, `text-text-primary/secondary/muted` classes. All text in Korean.

---

### Task 3: Create Saju Page

**Files to create:**
- `src/app/saju/page.tsx` — Server component with metadata, SEO content, FAQ JSON-LD
- `src/app/saju/client.tsx` — Client component (SajuDashboard) with onboarding + results

**Page structure:**
1. Hero: "나의 사주팔자" heading + description
2. Client widget: birth date form → four pillars chart → elements → major luck
3. SEO content: educational section about saju (server-rendered, always visible)
4. FAQ section (5+ items about saju)

---

### Task 4: Add SEO Content Data

**Files to create:**
- `src/data/seo/saju-content.ts` — Rich educational content about saju for the page

---

### Task 5: Add Navigation Links

**Files to modify:**
- `src/app/page.tsx` — Add saju link to "더 많은 운세" nav
- `src/app/fortune/[category]/page.tsx` — Add saju link
- `src/app/fortune/horoscope/[sign]/page.tsx` — Add saju link (already has nav)
- `src/components/layout/Header.tsx` — Add saju to navigation menu
- `src/components/layout/Footer.tsx` — Add saju to footer links
- `src/app/sitemap.ts` — Add /saju to sitemap

---

### Task 6: Build and Verify

Run `npm run content:validate && npm run build` to ensure everything works.

---
