# AdSense Content Quality Fix - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix AdSense "low-value content" rejection by adding substantive, server-rendered editorial content across all pages.

**Architecture:** Content-only changes - expand SEO data files, server components, and page templates. No new dependencies or architectural changes.

**Tech Stack:** Next.js App Router (TypeScript), Tailwind CSS

---

### Task 1: Expand About Page

**Files:**
- Modify: `src/app/about/page.tsx`

Expand from ~250 words to 800+ words with:
- Service mission and philosophy section
- Content curation process (how fortunes are curated, quality standards)
- Fortune cookie cultural significance (expanded from current 2 paragraphs)
- Trust signals: content count (300+ fortunes, 26+ blog posts), daily updates, 6 categories
- How the interactive experience works (5 methods explained)
- Community and sharing section

---

### Task 2: Expand Home Page Editorial Content

**Files:**
- Modify: `src/app/page.tsx`

Add below the existing "포춘쿠키란?" section:
- "포춘쿠키 이용 가이드" section explaining the 5 interaction methods with descriptions
- "자주 묻는 질문" FAQ section (5 Q&As about the service)
- "오늘의 운세 카테고리 안내" section with brief descriptions of each category
- Expand existing "포춘쿠키란?" from 3 paragraphs to 5

---

### Task 3: Add Server-Rendered Sample Fortunes to Category Pages

**Files:**
- Modify: `src/app/fortune/[category]/page.tsx`
- Modify: `src/data/seo/category-content.ts` (add `sampleMessages` field)

Add `sampleMessages: string[]` to `SEOContent` interface (3 messages per category).
Render these as a "오늘의 운세 미리보기" section on category pages.
This ensures Google crawler sees actual fortune content.

---

### Task 4: Expand All SEO Content Data Files

**Files:**
- Modify: `src/data/seo/category-content.ts` - expand FAQ 3→5, expand descriptions
- Modify: `src/data/seo/horoscope-content.ts` - expand FAQ 3→5
- Modify: `src/data/seo/zodiac-content.ts` - expand FAQ 3→5
- Modify: `src/data/seo/mbti-content.ts` - expand FAQ 3→5

For each entry in all 4 files:
- Add 2 more FAQ items (from 3 → 5)
- Expand descriptions where thin

---

### Task 5: Make First FAQ Item Default-Open + Add Guide Section to SEOContentServer

**Files:**
- Modify: `src/components/seo/SEOContentServer.tsx`

- Make first `<details>` element have `open` attribute
- Add optional `guide` field to SEOContent interface for editorial guide text
- Render guide section between traits and FAQ

---

### Task 6: Add Author to Blog Posts

**Files:**
- Modify: `src/data/blog-posts.ts` (add `author` field to interface + all posts)
- Modify: `src/app/blog/[slug]/page.tsx` (display author byline)

Add `author: string` field defaulting to "포춘쿠키 에디터".
Display author name and role below the post date.
Update JSON-LD author to use post author.

---

### Task 7: Build and Verify

Run `npm run content:validate && npm run build` to ensure no regressions.

---
