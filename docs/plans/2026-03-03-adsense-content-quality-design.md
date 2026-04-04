# AdSense Content Quality Fix - Design

## Problem
Google AdSense rejected the site for "low-value content" (가치가 별로 없는 콘텐츠).

## Root Causes
1. Fortune pages render content client-side only - Google crawler sees empty pages
2. About page is ~250 words with no trust signals
3. Home page has minimal editorial content
4. Category/horoscope/zodiac/MBTI pages have thin, repetitive template structure
5. FAQ items are collapsed by default (less visible to crawlers)
6. Blog posts lack author attribution (no E-E-A-T signals)

## Solution: 6 Areas

### 1. About Page Expansion (250 → 800+ words)
- Service mission and philosophy
- Content curation process and quality standards
- Fortune cookie cultural significance
- Trust signals (update frequency, content count)

### 2. Home Page Editorial Content
- Expand "포춘쿠키란?" to 5-6 paragraphs
- Add interaction guide section (5 methods)
- Add FAQ section

### 3. Server-Rendered Sample Fortunes on Category Pages
- Show 3 sample fortune messages as static text per category
- Google crawler sees actual content, not blank JS widget

### 4. SEO Content Expansion (all 4 data files)
- Expand FAQ from 3 → 5 items per entry
- Expand descriptions to ~200 words
- First FAQ item default-open in SEOContentServer

### 5. Horoscope/Zodiac/MBTI Page Content
- Add substantive personality/cultural guide sections
- More descriptive intros above widget

### 6. Blog Author Attribution
- Add `author` field to BlogPost interface
- Display author byline on blog detail pages
