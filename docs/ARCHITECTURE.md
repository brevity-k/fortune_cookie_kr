# Code Architecture (Fortune Cookie KR)

**⚠️ This document defines mandatory conventions for Fortune Cookie KR. Read before modifying any `.tsx` file.** Violating these rules breaks Google indexing and/or production stability.

Moved from `CLAUDE.md` on 2026-04-09 to reduce Claude Code session-start token cost. Original content is available via `git show HEAD:CLAUDE.md`.

---

## 서버/클라이언트 분리 원칙 (Google 인덱싱 필수)

모든 운세 페이지는 **서버 컴포넌트(page.tsx)** + **클라이언트 위젯(client.tsx)** 패턴을 따릅니다. Google 크롤러가 JS 실행 없이 핵심 콘텐츠를 볼 수 있어야 합니다.

**page.tsx (서버 컴포넌트)에 포함할 것:**
- `<h1>`, 설명 텍스트, 카테고리/셀렉터 `<a>` 링크
- `Header`, `Footer`, `SEOContentServer` (FAQ)
- JSON-LD 구조화 데이터
- 허브 페이지 네비게이션 링크

**client.tsx (클라이언트 위젯)에 포함할 것:**
- `FortuneCookie` 인터랙션 (쿠키 깨기)
- `FortuneShare` 공유 버튼
- `useStreak`, `useFortuneCollection` 훅
- `useState`, `useCallback` 등 React 훅

**금지 사항:**
- client.tsx에 `Header`, `Footer`, 히어로 섹션, 셀렉터, SEO 콘텐츠를 넣지 말 것
- 새 운세 페이지 추가 시 반드시 이 패턴을 따를 것

**위젯 이름 규칙:**

| 페이지 | 위젯 | 파일 |
|--------|------|------|
| 홈 | `HomeFortuneWidget` | `src/app/client.tsx` |
| 카테고리 | `CategoryFortuneWidget` | `src/app/fortune/[category]/client.tsx` |
| 별자리 | `HoroscopeFortuneWidget` | `src/app/fortune/horoscope/[sign]/client.tsx` |
| 띠별 | `ZodiacFortuneWidget` | `src/app/fortune/zodiac/[animal]/client.tsx` |
| MBTI | `MBTIFortuneWidget` | `src/app/fortune/mbti/[type]/client.tsx` |

**셀렉터 컴포넌트**: `CategorySelector`, `HoroscopeSelector`, `ZodiacSelector`, `MBTISelector`는 모두 **서버 컴포넌트** (Link + 정적 데이터만 사용, `'use client'` 없음)

**FAQ 컴포넌트**: 새 페이지에서는 `SEOContentServer`를 사용할 것 (`<details>/<summary>`, JS 불필요). `SEOContentSection`(useState 기반)은 레거시.

**시즌 페이지**: `CategoryFortuneWidget`을 직접 import하여 사용 (시즌별 히어로 + 카테고리 위젯 조합)

---

## 단일 소스 원칙 (Single Source of Truth)

모든 공유 상수와 타입은 `src/types/fortune.ts`에 정의하고, 스크립트는 `scripts/utils/constants.ts`를 통해 재export하여 사용합니다.

**변경 시 수정할 파일**: `src/types/fortune.ts` (하나만)

| 상수/타입 | 정의 위치 | 사용처 |
|-----------|----------|--------|
| `FortuneCategory` | `src/types/fortune.ts` | src/ 전체 + scripts/ 전체 |
| `Fortune` (interface) | `src/types/fortune.ts` | scripts/ 전체 (생성/검증) |
| `FORTUNE_CATEGORIES` | `src/types/fortune.ts` | scripts/generate-fortunes.ts |
| `VALID_COLORS` | `src/types/fortune.ts` | scripts/ 전체 (검증/생성) |
| `CATEGORIES` | `src/types/fortune.ts` | scripts/validate-content.ts, content-health-check.ts |
| `CATEGORY_LABELS` | `src/types/fortune.ts` (CATEGORIES에서 파생) | scripts/ 전체 |
| `FORTUNE_ID_PATTERN` | `src/types/fortune.ts` | scripts/validate-content.ts, content-health-check.ts |

> **중요**: 스크립트에서 `src/types/fortune.ts`를 직접 import하지 말 것. 반드시 `scripts/utils/constants.ts`를 통해 사용.

---

## 공유 날짜 포맷 (`src/lib/date-utils.ts`)

날짜 문자열 형식 `YYYY-M-D` (제로패딩 없음)는 localStorage 키와 일일 운세 시드에 사용됩니다. 이 형식을 변경하면 기존 사용자의 상태가 깨집니다.

- `getTodayString()`: 오늘 날짜 → `"2026-2-12"` 형식
- `getYesterdayString()`: 어제 날짜

사용처: `useDailyFortune.ts`, `useStreak.ts`, `fortune-selector.ts` (5개 함수)

---

## 중앙화된 localStorage 키 (`src/lib/storage-keys.ts`)

| 키 | 상수 | 사용 훅 |
|----|------|---------|
| `fortune_cookie_daily` | `STORAGE_KEYS.DAILY_FORTUNE` | `useDailyFortune` |
| `fortune_cookie_streak` | `STORAGE_KEYS.STREAK` | `useStreak` |
| `fortune_cookie_collection` | `STORAGE_KEYS.COLLECTION` | `useFortuneCollection` |
| `fortune_cookie_muted` | `STORAGE_KEYS.MUTED` | `useSoundEffects` |

> **중요**: 새 localStorage 키 추가 시 반드시 `STORAGE_KEYS`에 먼저 등록. 모든 localStorage 접근은 try-catch로 감싸야 함 (Safari 비공개 모드 호환).

---

## SEO 메타데이터 규칙

- **OpenGraph type/locale**: 루트 `layout.tsx`에서 `type: 'website'`, `locale: 'ko_KR'` 설정 → 자식 페이지에 자동 상속
- **Canonical URL**: 모든 인덱싱 가능한 페이지에 `alternates.canonical` 필수 (상대 경로, `metadataBase`에서 자동 해석)
- **robots.ts**: `/api/`와 `/gift/` 경로 크롤링 차단 (선물 쿠키는 개인 링크)
- **SSR 콘텐츠**: h1, 설명, FAQ 답변, 셀렉터 링크는 반드시 서버 컴포넌트에서 렌더링 (Google 크롤러가 JS 없이 볼 수 있어야 함)
- **sitemap.ts**: `lastModified`에 `new Date()` 사용 금지 — `LAST_CONTENT_UPDATE` 상수 또는 블로그 `post.date` 사용 (매 빌드마다 변경되면 크롤 예산 낭비)
- **next.config.ts**: `output: 'standalone'` 사용 금지 (Vercel 배포 시 정적 최적화 방해)

---

## 스크립트 유틸리티 (`scripts/utils/`)

| 유틸리티 | 파일 | 용도 |
|---------|------|------|
| `withRetry()` | `retry.ts` | Claude API 호출 시 지수 백오프 재시도 (3회) |
| `extractTextFromResponse()` | `json.ts` | Claude 응답에서 텍스트 블록 추출 |
| `parseClaudeJSON<T>()` | `json.ts` | 코드 펜스 제거 + 트레일링 콤마 수정 + JSON 파싱 |
| `parseClaudeJSONArray<T>()` | `json.ts` | 위 + 배열 타입 검증 |
| `readStateFile<T>()` | `json.ts` | 상태 파일 읽기 (파일 부재/손상 시 기본값 반환, 선택적 구조 검증) |
| `writeStateFile()` | `json.ts` | 상태 파일 원자적 쓰기 (JSON pretty print) |
| `atomicWriteFile()` | `json.ts` | 임시 파일 → rename 패턴으로 원자적 쓰기 (실패 시 임시 파일 자동 정리) |
| `readExistingFortunes()` | `fortune-file.ts` | 카테고리 파일에서 기존 메시지/최고 ID 추출 |
| `getSampleFortunes()` | `fortune-file.ts` | 스타일 참고용 샘플 운세 추출 (빈 결과 시 경고) |
| `getCategoryFilePath()` | `fortune-file.ts` | 카테고리 → 파일 경로 변환 |

---

## 검증 엄격도 (`validate-content.ts`)

`npm run content:validate`는 모든 콘텐츠 파이프라인의 프리머지 게이트입니다. ERROR는 빌드를 중단시키고, WARNING은 정보 제공용입니다.

| 필드 | ERROR (빌드 실패) | WARNING (정보) |
|------|-------------------|----------------|
| `id` | 형식 불일치, 중복 | - |
| `category` | 유효하지 않은 카테고리 | - |
| `message` | 비어있음, 5자 미만 | 200자 초과, 중복 |
| `interpretation` | 누락 | - |
| `rating` | 타입 오류, 범위 초과 (1-5) | - |
| `luckyNumber` | 타입 오류, 범위 이상 (1-99) | - |
| `luckyColor` | 유효하지 않은 값 | 누락 |
| `emoji` | 누락 | - |
| `shareText` | 누락 | - |

---

## 상태 파일 검증 규칙

각 스크립트는 `readStateFile()`의 `validator` 파라미터로 상태 파일 무결성을 검증합니다. 검증 실패 시 기본값으로 폴백합니다.

| 스크립트 | 상태 파일 | 검증 함수 | 검증 내용 |
|---------|----------|----------|----------|
| `generate-fortunes.ts` | `fortune-generation-state.json` | `isGenerationState` | `lastCategoryIndex`가 number 타입 |
| `generate-seasonal-fortunes.ts` | `seasonal-generation-state.json` | `isSeasonalState` | 키가 4자리 연도, 값이 문자열 배열 |
| `generate-blog-post.ts` | `used-topics.json` | `isStringArray` | 배열이고 모든 요소가 string |
| `replenish-blog-topics.ts` | `used-topics.json` | `isStringArray` | 배열이고 모든 요소가 string |
| `post-to-twitter.ts` | `twitter-post-state.json` | `isTwitterPostState` | `lastPostDate`가 string, `postedSlugs`가 string 배열, `postedFortuneIds`가 string 배열 (선택적) |
| `post-to-bluesky.ts` | `bsky-post-state.json` | `isBlueskyPostState` | `lastPostDate`가 string, `postedSlugs`가 string 배열, `postedFortuneIds`가 string 배열 (선택적) |

> **규칙**: 새 상태 파일 추가 시 반드시 타입 검증 함수를 함께 작성할 것. `Array.isArray`만으로는 부족 — 요소 타입도 검증해야 합니다.

---

## 실패 복구 절차

| 실패 유형 | 자동 복구 | 수동 복구 |
|----------|----------|----------|
| 콘텐츠 검증 실패 | 빌드 중단, PR 미생성 | 해당 스크립트 재실행 (`--category`/`--topic` 지정) |
| 상태 파일 손상 | 기본값 폴백, 스크립트 계속 실행 | 상태 파일 삭제 후 재실행 (자동 재생성) |
| PR 머지 실패 | 이슈 자동 생성 | GitHub PR 수동 확인 후 머지 |
| 배포 헬스체크 실패 | 3회 재시도 (30초 간격), 실패 시 이슈 생성 | Vercel 대시보드 확인, 이전 배포로 롤백 |
| API 키 미설정 | `npm ci` 전 조기 종료 | GitHub Secrets에 `ANTHROPIC_API_KEY` 설정 |
| 주제 큐 소진 | `replenish-topics` 워크플로우 자동 트리거 | `npm run blog:generate -- --topic <slug>` 수동 지정 |
| 시즌 운세 중복 생성 | 상태 파일에서 연도별 체크, 자동 스킵 | 상태 파일 수정 후 재실행 |
| X API 크레딧 소진 | 402 에러 + 이슈 생성 | developer.x.com에서 크레딧 충전 |
| X API 키 미설정 | 4개 키 사전 검증 → 조기 종료 | GitHub Secrets에 X_* 키 4개 설정 |
