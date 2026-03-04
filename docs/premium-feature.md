# Premium Personalized Fortune System

Branch: `feat/premium-personalized-fortune`

## Overview

A premium subscription feature that delivers daily personalized AI-generated fortunes based on the user's saju (사주) or astro (출생 차트) data. The system **learns about the user** through onboarding questions and daily check-ins, making fortune readings progressively more personal over time.

### Core Concept

```
Free saju/birth-chart analysis → Premium CTA → Sign up → Onboarding questions
  → Daily personalized fortune + optional daily check-in
  → Context accumulates → readings get more personal → user shares more (engagement loop)
```

---

## Manual Prerequisites (Before Going Live)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note the **Project URL** and **Anon Key** from Settings > API

### 2. Run Database Migration

Execute in Supabase SQL Editor (`supabase/migrations/001_premium_schema.sql`):

- Creates 4 tables: `profiles`, `user_charts`, `user_context`, `daily_fortunes`
- Enables Row Level Security (RLS) on all tables
- Granular policies: users can only access own data, subscription fields are write-protected

### 3. Enable Auth Providers in Supabase

In Supabase Dashboard > Authentication > Providers:

- **Google OAuth**: Enable, add Client ID and Secret from Google Cloud Console
- **Email (Magic Link)**: Enable OTP/magic link (no password)
- **Kakao OAuth** (optional): Enable, add Kakao app keys

Add to Supabase Auth > URL Configuration:
- Site URL: `https://fortunecookie.ai.kr`
- Redirect URLs: `https://fortunecookie.ai.kr/auth/callback`

### 4. Set Environment Variables

Add to `.env.local` (local) and Vercel Dashboard (production):

```bash
# Required — Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Required — AI Fortune Generation (already exists)
ANTHROPIC_API_KEY=sk-ant-...

# Recommended — Rate Limiting
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### 5. Subscription Activation (TODO)

Currently no payment integration exists. To grant premium access manually:

```sql
-- In Supabase SQL Editor
UPDATE profiles
SET subscription_tier = 'premium',
    subscription_expires_at = NOW() + INTERVAL '30 days'
WHERE id = '<user-uuid>';
```

Payment integration (Toss Payments / Stripe) will update `profiles.subscription_tier` via webhook.

---

## Architecture

### Authentication Flow

```
User visits /premium or /my-fortune
  → [Unauthenticated] → Redirect to /login?redirect={path}
  → LoginForm: Kakao OAuth | Google OAuth | Email magic link
  → /auth/callback: exchange code for session, validate redirect
  → [Authenticated] → Middleware refreshes session on every request
  → /my-fortune/page.tsx: ensureProfile → subscription check → render dashboard
```

### Fortune Generation Flow

```
User clicks fortune category on /my-fortune
  → POST /api/my-fortune {track, category}
  → Auth check (401) → Subscription check (403) → Rate limit (429)
  → Cache check (daily_fortunes table) → return if cached
  → Fetch user_charts + user_context (last 20 entries)
  → Build prompt (chart + context + date + category)
  → Claude Haiku API (2048 tokens, temp 0.8, 3 retries)
  → Validate + cache result → return fortune JSON
```

### User Learning Loop

```
Day 1: Onboarding (4 optional questions) → 4 context entries
Day 2+: Daily check-in (1 optional prompt) → accumulates over time
Fortune generation: Uses chart + all context entries → increasingly personal readings

The AI never directly references user input — it shifts the fortune's emphasis
to naturally align with the user's life. The user connects the dots themselves.
```

---

## Files Changed

### New Files (16)

| File | Purpose |
|------|---------|
| `src/lib/supabase/client.ts` | Browser Supabase client factory |
| `src/lib/supabase/server.ts` | Server Supabase client (cookie-based session) |
| `src/lib/supabase/middleware.ts` | Session refresh + `/my-fortune` route protection |
| `src/middleware.ts` | Next.js middleware entry point |
| `src/app/auth/callback/route.ts` | OAuth callback with safe redirect validation |
| `src/app/login/page.tsx` | Login page (server component, Suspense boundary) |
| `src/app/login/client.tsx` | Login form: Kakao, Google, email magic link |
| `src/components/auth/AuthButton.tsx` | Auth-aware nav button (login/my-fortune) |
| `src/lib/subscription.ts` | `isSubscribed()`, `ensureProfile()`, `getSubscriptionTier()` |
| `src/app/premium/page.tsx` | Premium landing page with pricing |
| `src/components/premium/OnboardingQuestions.tsx` | 4-step onboarding wizard |
| `src/components/premium/DailyCheckIn.tsx` | Daily optional check-in widget |
| `src/app/my-fortune/page.tsx` | Dashboard server component (auth-gated) |
| `src/app/my-fortune/client.tsx` | Interactive fortune dashboard |
| `src/app/api/my-fortune/route.ts` | Fortune generation API (Claude + caching) |
| `src/lib/premium/prompts.ts` | Saju/astro prompt builders with sanitization |
| `supabase/migrations/001_premium_schema.sql` | Database schema + RLS policies |

### Modified Files (5)

| File | Change |
|------|--------|
| `src/components/layout/Header.tsx` | Added AuthButton to desktop + mobile nav |
| `src/app/saju/client.tsx` | Chart sync to Supabase + premium CTA |
| `src/app/birth-chart/client.tsx` | Chart sync to Supabase + premium CTA |
| `src/lib/rate-limit.ts` | Added `premiumFortuneRatelimit` (30 req/day per user) |
| `src/app/sitemap.ts` | Added `/premium` page entry |

---

## Database Schema

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK, FK auth.users) | |
| subscription_tier | text | `'free'` or `'premium'`, write-protected via RLS |
| subscription_expires_at | timestamptz | NULL = no expiry |
| active_tracks | text[] | `['saju']`, `['astro']`, or both |
| created_at | timestamptz | |

### `user_charts`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| user_id | uuid (FK profiles) | |
| track | text | `'saju'` or `'astro'` |
| chart_data | jsonb | Full chart structure |
| birth_info | jsonb | Birth date, time, location |
| | | UNIQUE(user_id, track) |

### `user_context`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| user_id | uuid (FK profiles) | |
| content | text | Max 1000 chars (DB CHECK) |
| context_type | text | `'onboarding'`, `'daily_check_in'`, `'life_event'`, `'concern'` |
| topic | text | Optional category tag |
| created_at | timestamptz | |

### `daily_fortunes`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| user_id | uuid (FK profiles) | |
| track | text | `'saju'` or `'astro'` |
| fortune_date | date | |
| category | text | `'daily'`, `'love'`, `'career'`, `'health'`, `'monthly'` |
| content | jsonb | `{title, content, luckyElement/luckyPlanet, intensity}` |
| context_snapshot | text[] | user_context IDs used for generation |
| | | UNIQUE(user_id, track, fortune_date, category) |

---

## Security Measures

| Threat | Mitigation |
|--------|-----------|
| Open redirect | `getSafeRedirect()`: blocks `//`, `..`, `@`, cross-host, protocol-relative |
| Subscription bypass | RLS policy prevents client-side writes to `subscription_tier`/`subscription_expires_at` |
| User impersonation | Server-side `supabase.auth.getUser()` in all components and API routes |
| Prompt injection | `sanitizeContent()`: truncate 500 chars + strip control chars; chart data capped at 3000 chars |
| Rate limit abuse | Upstash Redis: 30 req/day per user ID (server-side enforcement) |
| Data isolation | RLS policies: users can only read/modify their own records |
| Session security | Secure HTTP-only cookies via `@supabase/ssr` |

---

## API Reference

### POST `/api/my-fortune`

**Auth Required:** Yes (Supabase session cookie)
**Subscription Required:** Yes (premium tier)
**Rate Limit:** 30 requests/day per user

**Request:**
```json
{
  "track": "saju" | "astro",
  "category": "daily" | "love" | "career" | "health" | "monthly"
}
```

**Response (200):**
```json
{
  "fortune": {
    "title": "변화의 기운",
    "content": "오늘 금(金) 기운이 강하게 작용하고 있어...",
    "luckyElement": "금",
    "intensity": 4
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 401 | 로그인이 필요합니다 |
| 403 | 프리미엄 구독이 필요합니다 |
| 404 | 차트 데이터가 없습니다 |
| 429 | 일일 요청 한도를 초과했습니다 |
| 500 | 운세 생성 중 오류가 발생했습니다 |
| 503 | AI 서비스가 현재 이용 불가합니다 |

---

## Pricing

| Plan | Price | Notes |
|------|-------|-------|
| Monthly | ₩9,900/month | |
| Annual | ₩99,000/year | ~17% discount |
| Free Trial | 7 days | (to be implemented with payment integration) |

---

## Future Enhancements

- Payment integration (Toss Payments + Stripe webhook)
- Logout mechanism
- Push notifications ("오늘의 운세가 도착했습니다")
- 궁합 운세 (compatibility fortunes)
- 연간 운세 (yearly readings)
- 행운의 날 캘린더
- PDF export (formatted fortune report)
- User feedback loop (fortune accuracy ratings)
