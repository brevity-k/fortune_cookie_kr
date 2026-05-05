# 포춘쿠키 (Fortune Cookie KR)

## Developer Identity Policy

**STRICT:** Never disclose the developer's real name, personal email, or any GitHub accounts other than `brevity-k` in any code, commits, comments, PRs, issues, documentation, or AI-generated content related to this project. The only public identity for this project is `brevity-k`. Any references to other accounts or personal identifiers must be redacted. This rule applies to all AI assistants, automation scripts, and contributors.

한국어 포춘쿠키 운세 웹 서비스. 사용자가 다양한 방법으로 쿠키를 깨면 운세 메시지가 나타나는 인터랙티브 페이지.

**Domain:** fortunecookie.ai.kr | **Hosting:** Vercel

## Tech Stack

| 항목 | 기술 |
|---|---|
| Framework | Next.js 16 App Router + TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Motion (framer-motion 후속) |
| Effects | canvas-confetti + Howler.js |
| Font | Noto Sans KR (next/font) |
| Social | twitter-api-v2 + @atproto/api |

## Directory Overview

```
src/
├── app/                      # Next.js routes (server components = page.tsx, client widgets = client.tsx)
│   ├── fortune/              # Category, horoscope, zodiac, MBTI, seasonal pages
│   ├── compatibility/        # 궁합 포춘쿠키
│   ├── collection/           # 포춘쿠키 도감
│   ├── gift/[id]/            # 선물 포춘쿠키 (바이럴 루프)
│   ├── blog/                 # Blog list + [slug] (SSG)
│   └── api/                  # contact + fortune-card edge routes
├── components/
│   ├── cookie/               # FortuneCookie, CookieSVG, FortunePaper, InteractionHint
│   ├── fortune/              # FortuneShare + selectors (server components)
│   ├── layout/               # Header, Footer
│   ├── seo/                  # SEOContentServer (USE THIS), SEOContentSection (legacy)
│   └── ads/                  # AdSense
├── scripts/utils/            # retry, json, fortune-file, constants (re-exports from types/fortune.ts)
├── data/
│   ├── fortunes/             # love, career, health, study, general, relationship (301+ messages)
│   └── blog-posts.ts         # 24+ Korean HTML blog posts
├── hooks/                    # useDailyFortune, useStreak, useShareFortune, useSoundEffects
├── lib/                      # fortune-selector, date-utils, storage-keys, analytics
└── types/                    # fortune.ts (SINGLE SOURCE OF TRUTH), horoscope, mbti, zodiac, kakao
```

See `docs/ARCHITECTURE.md` for the full file-by-file breakdown and `.private/NOTES.md` for deployment/automation history.

## Core Features (Brief)

- **5 cookie-breaking interactions**: click (3x), drag+throw, long-press (1.5s), shake (DeviceMotion), double-tap
- **Daily seeded fortune**: date-hash → same fortune globally per day (재방문 유도)
- **Categories**: 사랑/재물/건강/학업/총운/대인 + 12별자리 + 12띠 + 16 MBTI + 4 시즌
- **Viral loops**: 궁합 (two-person), 선물 (친구에게 전달), 공유 카드 (카카오/X/다운로드)
- **Collection**: 포춘쿠키 도감 with localStorage tracking
- **Auto-content**: 일일 블로그 + 주간 운세 + 일일 X/Bluesky 자동 포스팅 via GitHub Actions + Claude API

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # content:validate 자동 실행 후 next build
npm run start      # production
npm run lint
```

### Content Scripts (Manual)

```bash
npm run blog:preview       # 다음 블로그 주제 미리보기
npm run blog:generate      # Claude API로 블로그 포스트 생성
npm run fortune:preview    # 다음 카테고리 미리보기
npm run fortune:generate   # Claude API로 5개 운세 생성
npm run content:validate   # CI 게이트: 빌드 실패 유발 가능
npm run content:check      # 운세 데이터 + 블로그 품질 점검
npm run twitter:post       # Twitter + Bluesky 수동 포스팅
```

## Environment Variables

로컬: `.env.local` · 프로덕션: Vercel Environment Variables

```bash
NEXT_PUBLIC_GA_ID                # GA4 측정 ID
NEXT_PUBLIC_ADSENSE_CLIENT       # AdSense 클라이언트 ID (ads.txt 참조)
NEXT_PUBLIC_KAKAO_KEY            # Kakao JS 앱 키
NEXT_PUBLIC_SITE_URL             # https://fortunecookie.ai.kr
RESEND_API_KEY                   # 문의 폼 이메일
X_CONSUMER_KEY                   # X API (OAuth 1.0a)
X_SECRET_KEY
X_ACCESS_TOKEN
X_ACCESS_TOKEN_SECRET
BLUESKY_HANDLE                   # Bluesky 핸들
BLUESKY_APP_PASSWORD             # Bluesky 앱 비밀번호
```

> Google/Naver 인증 코드는 `layout.tsx`의 `metadata.verification`에 하드코딩됨 — 환경변수 불필요

## Critical Code Architecture Rules (Summary)

⚠️ **Before modifying any `.tsx` file, read `docs/ARCHITECTURE.md`** — contains the full rule tables. Violating these breaks Google indexing.

**Must-know rules:**

1. **Server/Client separation (Google 인덱싱 필수)** — every fortune page follows `page.tsx` (server) + `client.tsx` (client widget) split.
   - `page.tsx` contains: `Header`, `Footer`, `<h1>`, selectors, SEO content, JSON-LD, FAQ
   - `client.tsx` contains: `FortuneCookie` interaction, `FortuneShare`, hooks, `useState`
   - **NEVER** put Header/Footer/hero/selectors/SEO content in `client.tsx`
   - **Selectors are server components** (Link + static data only, no `'use client'`)
   - **FAQ**: use `SEOContentServer` (`<details>/<summary>`, no JS). `SEOContentSection` is legacy — do not use.

2. **Single source of truth** — all shared constants/types live in `src/types/fortune.ts`. Scripts use `scripts/utils/constants.ts` (re-exports). **Never import from `src/types/` directly in scripts.**

3. **Date format** — `YYYY-M-D` (no zero-padding) in `src/lib/date-utils.ts`. Used in localStorage keys and daily fortune seeds. **Changing this format breaks existing users' state.**

4. **localStorage keys** — all keys centralized in `src/lib/storage-keys.ts` (`STORAGE_KEYS` constant). **New keys must be registered there first.** All localStorage access must be wrapped in try-catch (Safari private mode compatibility).

5. **SEO metadata** — OpenGraph `type: 'website'` and `locale: 'ko_KR'` set at root `layout.tsx`, inherited by children. All indexable pages need `alternates.canonical`. `/api/` and `/gift/` are blocked in `robots.ts`. Never use `new Date()` in `sitemap.ts` lastModified (crawl budget waste).

6. **Validation is a build gate** — `npm run content:validate` runs before every build. Missing required fields, invalid IDs, invalid categories, or out-of-range ratings → build fails. See `docs/ARCHITECTURE.md` for the full field table.

7. **Content generation** — Claude API calls must use `max_tokens: 8192` minimum (Korean token density). Never instruct "always mention site" — AI quality review flags as spam. Conclusion paragraphs are mandatory.

## Cautions

- 운세 메시지는 오락 목적. 실제 미래 예측 아님을 명시.
- AdSense 정책: 쿠키 인터랙션 영역에 광고 배치 금지
- 모바일 흔들기: iOS DeviceMotion 권한 요청 필요
- localStorage: 일일 운세 + 음소거 설정 (개인정보 동의 불필요)
- **Kakao SDK 도메인 등록 2곳 필수** (미등록 시 4019 에러):
  1. 제품링크관리 > 웹 도메인
  2. 플랫폼키 > JavaScript 키 > JavaScript SDK 도메인

## Detailed Documentation

- **`docs/ARCHITECTURE.md`** (committed) — Full code architecture rules: server/client split tables, widget naming, single source of truth, storage keys, SEO rules, validation strictness, state file schemas, failure recovery procedures. **Read before modifying any `.tsx` file.**
- **`.private/NOTES.md`** (gitignored) — Deployment history, AdSense checklist, content update guides, auto-update system (GitHub Actions workflows), automation pipeline self-healing mechanisms, growth strategy, competitive analysis, SEO keyword targets, community seeding, viral principles.
