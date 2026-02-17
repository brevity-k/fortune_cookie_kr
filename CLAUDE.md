# 포춘쿠키 (Fortune Cookie KR)

한국어 포춘쿠키 운세 웹 서비스. 사용자가 다양한 방법으로 쿠키를 깨면 운세 메시지가 나타나는 인터랙티브 페이지.

## 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router, TypeScript) | 16.1.6 |
| 스타일링 | Tailwind CSS | 4 |
| 애니메이션 | Motion (framer-motion 후속) | 12.x |
| 파티클 효과 | canvas-confetti | 1.9.x |
| 사운드 | Howler.js | 2.2.x |
| 한국어 폰트 | Noto Sans KR (next/font) | - |
| 유틸리티 | clsx | 2.x |
| X/Twitter API | twitter-api-v2 | 1.29.x |

## 프로젝트 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx                # 루트 레이아웃 (폰트, GA, AdSense, PWA 메타태그, WebSite JSON-LD)
│   ├── icon.svg                  # 커스텀 파비콘 (골드 쿠키 SVG)
│   ├── page.tsx                  # 메인 페이지 서버 컴포넌트 (메타데이터 export)
│   ├── client.tsx                # 메인 페이지 클라이언트 컴포넌트 (쿠키 인터랙션)
│   ├── error.tsx                 # 글로벌 에러 바운더리 (쿠키 테마 에러 페이지)
│   ├── not-found.tsx             # 커스텀 404 페이지 (쿠키 테마)
│   ├── globals.css               # Tailwind + 커스텀 CSS 애니메이션 + prefers-reduced-motion
│   ├── fortune/[category]/       # 카테고리별 운세 페이지 (6개)
│   │   ├── page.tsx              # 서버 컴포넌트 (메타데이터, SSG)
│   │   └── client.tsx            # 클라이언트 컴포넌트
│   ├── fortune/horoscope/[sign]/  # 별자리 운세 페이지 (12개)
│   │   ├── page.tsx              # 서버 컴포넌트 (메타데이터, SSG)
│   │   └── client.tsx            # 클라이언트 컴포넌트
│   ├── gift/[id]/                # 선물 포춘쿠키
│   │   ├── page.tsx              # 서버 컴포넌트
│   │   └── client.tsx            # 클라이언트 컴포넌트
│   ├── blog/                     # 블로그 목록
│   │   └── [slug]/page.tsx       # 블로그 상세 (SSG, generateStaticParams, BlogPosting JSON-LD)
│   ├── about/page.tsx            # 소개
│   ├── privacy/page.tsx          # 개인정보처리방침
│   ├── terms/page.tsx            # 이용약관
│   ├── contact/page.tsx          # 문의 (ContactForm 포함)
│   └── api/contact/route.ts      # 문의 폼 API (Resend 이메일)
├── components/
│   ├── contact/
│   │   └── ContactForm.tsx       # 문의 폼 (이름/이메일/메시지, 자동 답장)
│   ├── cookie/
│   │   ├── FortuneCookie.tsx     # 메인 쿠키 인터랙션 (핵심 컴포넌트, 결과 자동 스크롤)
│   │   ├── CookieSVG.tsx         # SVG 쿠키 비주얼 (idle/crack/broken 상태)
│   │   ├── FortunePaper.tsx      # 운세 종이 (타자기 효과, 등급, 행운 정보)
│   │   └── InteractionHint.tsx   # 인터랙션 힌트 칩
│   ├── fortune/
│   │   ├── FortuneShare.tsx      # 공유 버튼 (카카오/트위터/웹공유/복사)
│   │   ├── CategorySelector.tsx  # 카테고리 선택 칩
│   │   └── HoroscopeSelector.tsx # 별자리 선택 칩 (12개)
│   ├── layout/
│   │   ├── Header.tsx            # 네비게이션 헤더 (모바일 햄버거 메뉴, safe-area 대응)
│   │   └── Footer.tsx            # 푸터 (카테고리/콘텐츠/법적 링크)
│   ├── ads/AdSense.tsx           # Google AdSense 광고 컴포넌트
│   ├── ui/MuteToggle.tsx         # 사운드 음소거 토글 (safe-area 대응)
│   └── KakaoScript.tsx           # Kakao SDK 로드 + 즉시 초기화 (next/script)
├── scripts/
│   └── utils/
│       ├── retry.ts              # API 호출 재시도 유틸리티 (지수 백오프)
│       ├── json.ts               # Claude 응답 파싱, 상태 파일 I/O, 원자적 파일 쓰기
│       ├── fortune-file.ts       # 운세 파일 읽기/파싱 공유 유틸리티
│       └── constants.ts          # src/types/fortune.ts에서 재export (단일 소스)
├── data/
│   ├── fortunes/                 # 운세 데이터 (총 291개+, 자동 증가)
│   │   ├── index.ts              # 통합 export
│   │   ├── love.ts               # 사랑운 50개
│   │   ├── career.ts             # 재물운 50개
│   │   ├── health.ts             # 건강운 40개
│   │   ├── study.ts              # 학업운 40개
│   │   ├── general.ts            # 총운 60개
│   │   └── relationship.ts       # 대인운 40개
│   └── blog-posts.ts             # 블로그 포스트 10개 (한국어 HTML)
├── hooks/
│   ├── useDailyFortune.ts        # 일일 운세 (날짜 기반 시드, localStorage)
│   ├── useShakeDetection.ts      # 모바일 흔들기 감지 (DeviceMotion API)
│   ├── useSoundEffects.ts        # Howler.js 사운드 관리 + 음소거
│   └── useShareFortune.ts        # 공유 (카카오/웹공유/트위터/클립보드)
├── lib/
│   ├── fortune-selector.ts       # 운세 선택 로직 (시드 해싱, 랜덤, 빈 배열 안전, 띠별/MBTI/별자리 일일운세)
│   ├── date-utils.ts             # 공유 날짜 포맷 (getTodayString, getYesterdayString)
│   ├── storage-keys.ts           # 중앙화된 localStorage 키 상수 (STORAGE_KEYS)
│   ├── analytics.ts              # GA4 이벤트 추적 헬퍼
│   └── utils.ts                  # cn() 유틸리티
└── types/
    ├── fortune.ts                # Fortune, FortuneCategory, CookieState, VALID_COLORS, CATEGORY_LABELS (단일 소스)
    ├── horoscope.ts              # HoroscopeSign 타입, HOROSCOPE_SIGNS (12별자리 데이터)
    └── kakao.d.ts                # Kakao JS SDK 타입 선언
```

## 핵심 기능

### 쿠키 깨기 인터랙션 (5가지)
1. **클릭/탭**: 3번 클릭 → crack-1 → crack-2 → break
2. **드래그 후 던지기**: 속도 300+ 또는 거리 120px+ → break
3. **꾹 누르기**: 1.5초 길게 누르기 → 원형 프로그레스 → break
4. **흔들기**: DeviceMotion API (모바일) → break
5. **더블 탭**: 300ms 이내 더블 클릭 → break

### 운세 시스템
- **일일 운세**: 날짜 기반 시드 해싱 → 하루에 같은 결과 (재방문 유도)
- **랜덤 뽑기**: 다시 뽑기 시 완전 랜덤
- **등급**: 1(흉) ~ 5(대길), 한국식 등급명
- **행운 정보**: 행운의 숫자 (1-99), 행운의 색 (한국어)

### 문의 폼 + 자동 답장 이메일
- **API**: `/api/contact` (POST) — Resend SDK로 이메일 전송 (`Promise.all`로 병렬 발송)
- **입력 검증**: 이름 100자, 이메일 254자, 메시지 5000자 제한 + 이메일 형식 검증
- **알림 메일**: 사이트 운영자(fortune0.kr@gmail.com)에게 문의 내용 전달
- **자동 답장**: 문의자에게 접수 확인 메일 자동 발송
- **발신 주소**: `onboarding@resend.dev` (Resend 무료 티어 기본) → 커스텀 도메인 추가 가능
- **무료 제한**: 하루 100건 (Resend 무료 플랜)
- **설정**: `RESEND_API_KEY` 환경 변수 필요 (https://resend.com 에서 발급)

### 모바일 UX
- **Apple PWA 메타태그**: `viewport-fit: cover`, `apple-mobile-web-app-capable`, `black-translucent` 상태바
- **Safe Area 대응**: Header에 `safe-area-inset-top`, MuteToggle에 `safe-area-inset-bottom/right` 적용 (노치/Dynamic Island/홈 인디케이터)
- **터치 타겟**: 햄버거 메뉴 버튼 44px 최소 크기 (Apple HIG 준수)
- **자동 스크롤**: 쿠키 깨진 후 운세 결과가 화면 중앙으로 자동 스크롤
- **접근성**: `prefers-reduced-motion: reduce` 시 모든 커스텀 애니메이션 비활성화

### 카카오톡 공유
- **SDK 초기화**: `KakaoScript` 컴포넌트가 SDK 로드 즉시 `Kakao.init()` 호출 (공유 클릭 시 지연 없음)
- **공유 이미지**: `/api/fortune-card?w=800&h=400` 컴팩트 가로형 카드 (카카오 피드용)
- **다운로드 이미지**: `/api/fortune-card` 기본 1080x1920 세로형 (인스타 스토리용)
- **fortune-card API**: `w`/`h` 쿼리 파라미터로 크기 조절, `w<=800`이면 컴팩트 레이아웃 자동 적용

### 디자인 테마
- **컨셉**: 한국 야시장 포춘쿠키 노점
- **배경**: 딥 퍼플-블랙 (`#1A0F2E`) + 별 파티클
- **쿠키**: 골드 (`#D4A574`) + 빛나는 효과
- **종이**: 크림색 (`#FFF8E7`) + 종이 질감
- **강조**: 전통 레드 (`#C73E3E`), 골드 반짝임 (`#FFD700`)

## 개발

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드 (content:validate 자동 실행 후 next build)
npm run start      # 프로덕션 서버
npm run lint       # ESLint
```

## 환경 변수

로컬 개발: `.env.local`, 프로덕션: Vercel 대시보드 Environment Variables

```bash
NEXT_PUBLIC_GA_ID=G-GCVN75X50X              # Google Analytics 4 측정 ID ✅
NEXT_PUBLIC_ADSENSE_CLIENT=                  # Google AdSense 클라이언트 ID (미설정)
NEXT_PUBLIC_KAKAO_KEY=                       # Kakao JavaScript 앱 키 ✅
NEXT_PUBLIC_SITE_URL=https://fortunecookie.ai.kr  # 사이트 URL ✅
RESEND_API_KEY=                              # Resend API 키 (문의 폼) ✅
X_CONSUMER_KEY=                              # X API Consumer Key ✅
X_SECRET_KEY=                                # X API Consumer Secret ✅
X_ACCESS_TOKEN=                              # X API Access Token ✅
X_ACCESS_TOKEN_SECRET=                       # X API Access Token Secret ✅
```

> **참고**: Google/Naver 인증 코드는 `layout.tsx`의 `metadata.verification`에 직접 하드코딩되어 환경변수 불필요

## 배포 현황 (Vercel) - 완료

### 1단계: Vercel 배포 ✅
- GitHub 리포지토리 연결: `https://github.com/brevity-k/fortune_cookie_kr`
- Vercel 프로젝트: `fortune-cookie-kr`
- 환경 변수 설정 완료 (Vercel 대시보드)
- 프로덕션 URL: `https://fortunecookie.ai.kr`

### 2단계: 도메인 연결 ✅
- 도메인: `fortunecookie.ai.kr`
- DNS 설정 완료, SSL 자동 발급됨

### 3단계: SEO 등록 ✅
- **Google Search Console**: 인증 메타태그 추가 완료 (`0Qs_NRonZJTlJQzm_7gdXWtg4Kgxtwba6UIE71qvgbE`)
- **네이버 서치어드바이저**: 인증 메타태그 추가 완료 (`a559aa985e044be33ec42400206408dc4327ae22`)
- sitemap.xml 동적 생성 (`src/app/sitemap.ts` Next.js 라우트)
- robots.txt 동적 생성 (`src/app/robots.ts` Next.js 라우트)
- **JSON-LD 구조화 데이터**: WebSite 스키마 (`layout.tsx`), BlogPosting 스키마 (`blog/[slug]/page.tsx`)
- **홈페이지 메타데이터**: 서버/클라이언트 분리로 `page.tsx`에서 metadata export 지원

### 4단계: AdSense 신청
- 아래 "AdSense 승인 체크리스트" 참조

### 5단계: 분석 도구 설정 ✅
- GA4 측정 ID: `G-GCVN75X50X` (Vercel 환경변수 설정 완료)
- 이벤트 추적: cookie_break (FortuneCookie), fortune_reveal (FortuneCookie), share (FortuneShare), streak (모든 fortune 페이지)

### 6단계: 파비콘 ✅
- 커스텀 SVG 파비콘: `src/app/icon.svg` (골드 쿠키 + 딥 퍼플 배경)

## AdSense 승인 체크리스트

### 사용자가 준비해야 할 것
1. **Google AdSense 계정 생성**: https://adsense.google.com
2. **AdSense 클라이언트 ID 확인**: `ca-pub-XXXXXXXXXXXXXXXX` 형식
3. **ads.txt 업데이트**: `public/ads.txt`에서 `pub-XXXXXXXXXXXXXXXX`를 실제 ID로 교체
4. **환경 변수 설정**: `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`

### 사이트 요구사항 (이미 충족됨)
- [x] 15개 이상 콘텐츠 페이지 (현재 19개)
- [x] 법적 페이지: 개인정보처리방침, 이용약관
- [x] 소개(about) 및 문의(contact) 페이지
- [x] 사이트맵(sitemap.xml) 동적 생성 (Next.js 라우트)
- [x] robots.txt 동적 생성 (Next.js 라우트)
- [x] ads.txt 파일 준비
- [x] 모바일 반응형 디자인
- [x] 원본 한국어 콘텐츠 (291개+ 운세 + 10개+ 블로그, 자동 증가)
- [x] 사이트 속도 최적화 (Next.js SSG)

### AdSense 승인 후 작업
1. 환경 변수에 클라이언트 ID 설정
2. 광고 슬롯 ID를 AdSense 컴포넌트에 전달
3. 운세 결과 표시 후에만 광고 노출 (UX 보호)

## 사운드 파일

현재 `public/sounds/` 디렉토리에 placeholder 파일이 있음.
실제 사운드 파일로 교체 필요:

| 파일 | 용도 | 권장 |
|------|------|------|
| crack-1.mp3 | 첫 번째 금 | 가벼운 쿠키 금 소리 (~0.3초) |
| crack-2.mp3 | 두 번째 금 | 조금 더 큰 금 소리 (~0.3초) |
| break.mp3 | 쿠키 깨짐 | 쿠키가 부서지는 소리 (~0.5초) |
| paper.mp3 | 종이 펼침 | 종이가 펼쳐지는 소리 (~0.5초) |
| sparkle.mp3 | 반짝임 효과 | 마법/반짝임 소리 (~0.5초) |

무료 사운드 소스: freesound.org, mixkit.co, pixabay.com/sound-effects

## 콘텐츠 업데이트 가이드

### 운세 메시지 추가
1. `src/data/fortunes/[category].ts` 파일에 Fortune 객체 추가
2. ID 형식: `{category}_{3자리숫자}` (예: `love_051`)
3. 필수 필드: id, category, message, interpretation, luckyNumber, luckyColor, rating, emoji, shareText

### 블로그 포스트 추가
1. `src/data/blog-posts.ts`의 `blogPosts` 배열에 새 포스트 추가
2. 필수 필드: slug (URL), title, description, date, content (HTML 문자열)
3. **정렬 규칙**: 배열은 반드시 최신순(날짜 내림차순)으로 정렬 — 가장 최근 포스트가 배열 맨 위
4. 빌드 시 자동으로 SSG 페이지 생성

### 시즌별 업데이트
- **설날 (1-2월)**: 신년 특별 운세 추가
- **발렌타인 (2월)**: 사랑운 스페셜
- **수능 시즌 (11월)**: 학업운/시험운 강화
- **크리스마스 (12월)**: 홀리데이 운세

## 자동 업데이트 시스템

GitHub Actions를 통한 자동 콘텐츠 업데이트가 구성되어 있음.

### 자동 블로그 포스트 생성 (일일)

Claude API를 사용하여 매일 자동으로 블로그 포스트를 생성합니다.

**파일 구조:**
- `scripts/blog-topics.ts` - 60+ 주제 큐 (운세/문화/생활/시즌/심리)
- `scripts/generate-blog-post.ts` - 포스트 생성 스크립트
- `scripts/used-topics.json` - 사용된 주제 추적
- `.github/workflows/daily-blog-post.yml` - 매일 자동 실행

**수동 실행:**
```bash
npm run blog:preview     # 다음 주제 미리보기 (파일 수정 없음)
npm run blog:generate    # 다음 주제로 포스트 생성
ANTHROPIC_API_KEY=sk-ant-... npm run blog:generate --topic tarot-card-basics  # 특정 주제
```

**GitHub Actions 설정:**
1. GitHub 리포지토리 Settings → Secrets and variables → Actions → `ANTHROPIC_API_KEY` 시크릿 추가
2. Settings → Actions → General → **"Allow GitHub Actions to create and approve pull requests"** 체크 필수
3. 매일 오전 6시(KST) 자동 실행, PR로 생성되어 리뷰 후 머지

**주제 큐 현황:**
- 총 60개 주제 (10개 사용됨, 50개 남음)
- 카테고리: fortune(13), culture(8), lifestyle(12), seasonal(7), psychology(10)
- 큐가 소진되면 자동 리셋 (순환)

### 자동 운세 메시지 생성 (주간)

Claude API를 사용하여 매주 자동으로 5개의 운세 메시지를 생성합니다.
카테고리는 love → career → health → study → general → relationship 순서로 순환합니다.

**파일 구조:**
- `scripts/generate-fortunes.ts` - 운세 생성 스크립트
- `scripts/fortune-generation-state.json` - 카테고리 순환 상태 추적
- `.github/workflows/weekly-fortune-update.yml` - 매주 일요일 자동 실행

**수동 실행:**
```bash
npm run fortune:preview    # 다음 카테고리 미리보기 (파일 수정 없음)
npm run fortune:generate   # 다음 카테고리로 5개 운세 생성
ANTHROPIC_API_KEY=sk-ant-... npm run fortune:generate --category love  # 특정 카테고리
```

**GitHub Actions 설정:**
- `ANTHROPIC_API_KEY` 시크릿 필요 (블로그 생성과 동일)
- 매주 월요일 오전 6시(KST) 자동 실행, PR로 생성되어 리뷰 후 머지
- 수동 실행 시 카테고리 지정 가능

**생성 프로세스:**
1. 다음 카테고리 결정 (순환 또는 수동 지정)
2. 기존 운세 파일에서 최고 ID 번호 + 기존 메시지 추출
3. Claude API로 5개 Fortune 객체 생성 (기존 스타일 참고, 중복 방지)
4. 유효성 검증 (필수 필드, ID 형식, rating 범위, 중복 체크)
5. 카테고리 파일에 추가 + 상태 파일 업데이트

**블로그/운세 생성 프롬프트 품질 규칙:**
- `max_tokens`는 8192 이상 사용 (한국어는 토큰 밀도가 높아 낮은 값에서 잘림 발생)
- 포춘쿠키/사이트 언급은 "자연스러운 경우에만" 지시 — 강제 삽입 지시 금지 (AI 품질 리뷰에서 스팸으로 감지됨)
- 결론 단락을 반드시 포함하도록 명시 (문장 중간 잘림 방지)

### Twitter/X 자동 포스팅 (일일)

X API (twitter-api-v2)를 사용하여 매일 자동으로 트윗을 게시합니다.
오늘 생성된 블로그 포스트가 있으면 블로그 트윗, 없으면 랜덤 운세 트윗을 게시합니다.

**X 계정**: KR 전용 계정 (fortune0.kr@gmail.com)
- 2개 언어별 계정 전략: KR 계정 (fortune_cookie_kr + lottery_kr), EN 계정 (별도)
- X API 과금: pay-per-use 모델 ($0.01/tweet, $30 충전 = ~3,000 tweets)

**파일 구조:**
- `scripts/post-to-twitter.ts` - 트윗 게시 스크립트
- `scripts/twitter-post-state.json` - 게시 상태 추적 (lastPostDate, postedSlugs)
- `.github/workflows/daily-twitter-post.yml` - 매일 자동 실행

**수동 실행:**
```bash
npm run twitter:preview   # 미리보기 (트윗 게시 안 함)
npm run twitter:post      # 트윗 게시
npm run twitter:post -- --type blog     # 블로그 트윗 강제
npm run twitter:post -- --type fortune  # 운세 트윗 강제
```

**GitHub Actions 설정:**
- GitHub Secrets 필요: `X_CONSUMER_KEY`, `X_SECRET_KEY`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`
- 매일 오전 8시(KST) 자동 실행 (블로그 생성 2시간 후)
- 상태 파일 변경은 main에 직접 커밋 (PR 불필요)
- 동시성 그룹: `twitter-posting` (content-generation과 별도)

**트윗 템플릿:**
- 블로그: 제목 + 설명 + 링크 + 해시태그
- 운세: 카테고리 + 메시지 + 행운 정보 + 링크 + 해시태그
- 280자 제한 자동 처리 (설명/메시지 자동 절삭)

**중복 방지:**
- 일일 중복 체크: `lastPostDate`가 오늘이면 게시 스킵 (`--force`로 강제 가능)
- 블로그 중복: `postedSlugs[]`로 이미 트윗한 블로그 슬러그 추적
- 운세 중복: `postedFortuneIds[]`로 이미 트윗한 운세 ID 추적 (전체 소진 시 자동 리셋 + 상태 파일 초기화)

**상태 파일 검증:**
- `isTwitterPostState`: `lastPostDate`가 string, `postedSlugs`가 string 배열, `postedFortuneIds`가 string 배열 (선택적, 하위 호환)

### 콘텐츠 건강 체크

```bash
npm run content:check    # 운세 데이터 + 블로그 품질 점검
npm run content:season   # 시즌별 콘텐츠 확인
```

### 콘텐츠 무결성 검증

```bash
npm run content:validate   # CI용 검증 (오류 시 exit 1)
npm run content:check      # 운세 데이터 + 블로그 품질 점검 (정보용)
npm run content:season     # 시즌별 콘텐츠 확인
```

### 자동 리마인더 스케줄
- **매주 월요일 12:00 KST**: 콘텐츠 건강 체크 실행 + 블로그/운세 신선도 확인 + 자동 트리거
- **매월 1일**: 블로그/운세 업데이트 이슈 자동 생성
- **시즌 이벤트 (1월/2월/10월/12월)**: 시즌 콘텐츠 이슈 자동 생성

## 자동화 파이프라인 (자체 복구)

| 스케줄 | 워크플로우 | 기능 | 자체 복구 |
|--------|-----------|------|----------|
| 매일 06:00 KST | daily-blog-post | 블로그 포스트 생성 + 검증 + PR + 자동 머지 + 배포 확인 | 중복 이슈 + 자동 닫기 |
| 매주 월요일 06:00 KST | weekly-fortune-update | 운세 5개 생성 + 검증 + PR + 자동 머지 + 배포 확인 | 중복 이슈 + 자동 닫기 |
| 매주 월요일 09:00 KST | seasonal-content | 시즌 운세 자동 생성 + 검증 + 배포 확인 | 중복 이슈 + 자동 닫기 |
| 매주 월요일 12:00 KST | content-update | 콘텐츠 신선도 + 무결성 검증 + 자동 트리거 | 스코프드 이슈 + 자동 트리거 |
| 6시간마다 | site-health-check | 사이트 URL 핑 | 이슈 + 자동 닫기 |
| 매일 08:00 KST | daily-twitter-post | 블로그/운세 트윗 자동 게시 + 상태 커밋 | 중복 이슈 + 자동 닫기 |
| 매월 2일 07:00 KST | replenish-topics | 블로그 주제 큐 보충 | 중복 이슈 + 자동 닫기 |

### 자체 복구 메커니즘

1. **프리머지 검증**: validate-first 순서 — `content:validate` → `next build` → PR 생성 (빠른 실패)
2. **머지 결과 검증**: `gh pr merge` 실패 시 즉시 에러 + 디플로이 체크 스킵
3. **포스트 디플로이 헬스체크**: 자동 머지 성공 후 120초 대기 → 사이트 HTTP 상태 확인 → 실패 시 이슈 생성
4. **신선도 감지**: content-update가 블로그/운세 신선도 모니터링 → 14일 이상 미갱신 시 해당 파이프라인 자동 트리거
5. **스코프드 이슈 관리**: 각 워크플로우가 자기 이슈만 닫음 (타이틀 기반 매칭으로 일관성 보장)
6. **중복 방지**: 동일한 실패 이슈가 이미 열려있으면 새로 생성하지 않음 (모든 워크플로우 동일 패턴)
7. **스케줄 분리**: seasonal-content(00:00 UTC)와 content-update(03:00 UTC) 시간 분리로 동시성 충돌 방지
8. **주제 큐 자동 보충**: 블로그 주제 10개 미만 → replenish-topics 자동 트리거
9. **잡 타임아웃**: 모든 워크플로우에 `timeout-minutes` 설정 (생성: 20분, 모니터링: 5-15분)
10. **빌드 타임아웃**: 빌드 스텝에 `timeout-minutes: 10` 추가 설정 (기본 6시간 행 방지)
11. **사전 API 키 검증**: `npm ci` 전에 `ANTHROPIC_API_KEY` 존재 확인 (불필요한 의존성 설치 방지)
12. **동시성 그룹 통합**: replenish-topics는 `content-generation` 그룹 공유 (daily-blog 트리거 시 레이스 컨디션 방지)
13. **워크플로우 트리거 에러 핸들링**: content-update의 자동 트리거에 try-catch 적용 (트리거 실패가 전체 워크플로우를 중단시키지 않음)
14. **원자적 파일 쓰기**: `atomicWriteFile()`이 실패 시 임시 파일 자동 정리 (디스크 오염 방지)
15. **글로벌 에러 바운더리**: `src/app/error.tsx`가 미처리 에러를 쿠키 테마 에러 페이지로 표시 (백지 화면 방지)
16. **빈 배열 안전 가드**: `fortune-selector.ts`의 모든 선택 함수에 빈 배열 체크 + `fallbackFortune` 반환 (런타임 크래시 방지)
17. **운세 트윗 큐 리셋**: `postedFortuneIds` 전체 소진 시 상태 배열 초기화 (무한 증식 방지)
18. **블로그 생성 토큰 여유**: `max_tokens: 8192`로 한국어 콘텐츠 잘림 방지 + 결론 단락 필수 지시

## 코드 아키텍처 원칙

### 단일 소스 원칙 (Single Source of Truth)

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

### 공유 날짜 포맷 (`src/lib/date-utils.ts`)

날짜 문자열 형식 `YYYY-M-D` (제로패딩 없음)는 localStorage 키와 일일 운세 시드에 사용됩니다. 이 형식을 변경하면 기존 사용자의 상태가 깨집니다.

- `getTodayString()`: 오늘 날짜 → `"2026-2-12"` 형식
- `getYesterdayString()`: 어제 날짜

사용처: `useDailyFortune.ts`, `useStreak.ts`, `fortune-selector.ts` (5개 함수)

### 중앙화된 localStorage 키 (`src/lib/storage-keys.ts`)

| 키 | 상수 | 사용 훅 |
|----|------|---------|
| `fortune_cookie_daily` | `STORAGE_KEYS.DAILY_FORTUNE` | `useDailyFortune` |
| `fortune_cookie_streak` | `STORAGE_KEYS.STREAK` | `useStreak` |
| `fortune_cookie_collection` | `STORAGE_KEYS.COLLECTION` | `useFortuneCollection` |
| `fortune_cookie_muted` | `STORAGE_KEYS.MUTED` | `useSoundEffects` |

> **중요**: 새 localStorage 키 추가 시 반드시 `STORAGE_KEYS`에 먼저 등록. 모든 localStorage 접근은 try-catch로 감싸야 함 (Safari 비공개 모드 호환).

### SEO 메타데이터 규칙

- **OpenGraph type/locale**: 루트 `layout.tsx`에서 `type: 'website'`, `locale: 'ko_KR'` 설정 → 자식 페이지에 자동 상속
- **Canonical URL**: 모든 인덱싱 가능한 페이지에 `alternates.canonical` 필수 (상대 경로, `metadataBase`에서 자동 해석)
- **robots.ts**: `/api/`와 `/gift/` 경로 크롤링 차단 (선물 쿠키는 개인 링크)

### 스크립트 유틸리티 (`scripts/utils/`)

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

### 검증 엄격도 (`validate-content.ts`)

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

### 상태 파일 검증 규칙

각 스크립트는 `readStateFile()`의 `validator` 파라미터로 상태 파일 무결성을 검증합니다. 검증 실패 시 기본값으로 폴백합니다.

| 스크립트 | 상태 파일 | 검증 함수 | 검증 내용 |
|---------|----------|----------|----------|
| `generate-fortunes.ts` | `fortune-generation-state.json` | `isGenerationState` | `lastCategoryIndex`가 number 타입 |
| `generate-seasonal-fortunes.ts` | `seasonal-generation-state.json` | `isSeasonalState` | 키가 4자리 연도, 값이 문자열 배열 |
| `generate-blog-post.ts` | `used-topics.json` | `isStringArray` | 배열이고 모든 요소가 string |
| `replenish-blog-topics.ts` | `used-topics.json` | `isStringArray` | 배열이고 모든 요소가 string |
| `post-to-twitter.ts` | `twitter-post-state.json` | `isTwitterPostState` | `lastPostDate`가 string, `postedSlugs`가 string 배열, `postedFortuneIds`가 string 배열 (선택적) |

> **규칙**: 새 상태 파일 추가 시 반드시 타입 검증 함수를 함께 작성할 것. `Array.isArray`만으로는 부족 — 요소 타입도 검증해야 합니다.

### 실패 복구 절차

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

## 성장 전략 (Traffic & Growth Plan)

### 구현 현황: 12/13 기능 완료 (92%)

| Phase | 진행률 | 남은 작업 |
|-------|--------|----------|
| Phase 1: 바이럴 최적화 | 3/4 (75%) | 네이버 블로그 |
| Phase 2: 새 기능 | 5/5 (100%) | - |
| Phase 3: 리텐션 | 2/4 (50%) | 행운 퍼센타일, 타로 스타일 선택 |

### 경쟁 분석 요약

**한국 운세 시장 주요 플레이어:**
- **점신**: 1900만 다운로드, 97만 MAU, 매출 830억 (사주/타로/상담)
- **포스텔러**: 860만 유저, 62만 MAU (심층 사주 분석)
- **신한라이프 운세**: 무료 사주, 매년 신년 바이럴
- **케이테스트(KTestone)**: MBTI+성격 테스트, 바이럴 공유 모델

**우리의 포지셔닝 (Blue Ocean):**
> "가장 재미있는 방식으로 운세를 확인하는 곳"
- "포춘쿠키" 키워드는 경쟁이 매우 낮음 → SEO 블루오션
- 사주/타로 깊이가 아닌 **인터랙티브 체험 + 공유성**으로 차별화
- 쿠키 깨기 인터랙션 (5가지)은 경쟁사에 없는 고유한 UX

### Phase 1: 바이럴 최적화 (3/4 완료, 시즌 페이지 4/4)

| 우선순위 | 기능 | 상태 | 기대 효과 |
|---------|------|------|----------|
| 1 | **선물 포춘쿠키 바이럴 루프 강화** | ✅ 완료 | 매우 높음 |
| 2 | **공유 결과 카드 디자인 개선** | ✅ 완료 | 매우 높음 |
| 3 | **시즌 랜딩 페이지** | ✅ 완료 | 높음 |
| 4 | **네이버 블로그 개설 + 크로스포스팅** | ❌ 미구현 | 높음 |

**선물 바이럴 루프** (`/gift/[id]`) ✅:
- 선물 생성 1탭으로 간소화
- 수신자에게 "○○님이 보낸 포춘쿠키" 표시 + 미개봉 쿠키
- 개봉 후 "나도 포춘쿠키 보내기" CTA 강조
- A→B→C→... 연쇄 공유 루프

**공유 결과 카드** ✅:
- 1080x1920 (인스타 스토리/이미지 다운로드) + 800x400 (카카오톡 피드) 포맷
- 운세 메시지 + 등급 + 행운 숫자/색 + 사이트 워터마크
- `/api/fortune-card` 엣지 함수로 동적 생성 (`w`/`h` 파라미터 지원)
- 카카오 공유 메시지: "나는 '대길' 나왔는데 너는? 🥠"

**시즌 랜딩 페이지** ✅ (4/4):
- `/fortune/new-year` — 신년운세 포춘쿠키 ✅
- `/fortune/valentines` — 발렌타인 사랑운 ✅
- `/fortune/exam-luck` — 수능 합격 운세 ✅
- `/fortune/christmas` — 크리스마스 운세 ✅

### Phase 2: 새 기능 (5/5 완료)

| 우선순위 | 기능 | 상태 | 기대 효과 |
|---------|------|------|----------|
| 5 | **궁합 포춘쿠키** | ✅ 완료 | 매우 높음 |
| 6 | **MBTI별 포춘쿠키** | ✅ 완료 | 높음 |
| 7 | **띠별 오늘의 포춘쿠키** | ✅ 완료 | 높음 |
| 7.5 | **별자리 운세** | ✅ 완료 | 높음 |
| 8 | **연속 방문 스트릭 카운터** | ✅ 완료 | 중간 |

**궁합 포춘쿠키** (`/compatibility`) ✅:
- 두 명이 각자 쿠키를 깨서 궁합 결과 확인
- 본질적으로 바이럴 (상대방이 반드시 참여해야 완성)
- SEO 타겟: "궁합", "연인 궁합", "이름 궁합"

**MBTI별 포춘쿠키** (`/fortune/mbti/[type]`) ✅:
- 16개 MBTI 유형별 전용 페이지
- "ENFP를 위한 오늘의 포춘쿠키"
- 한국의 MBTI 열풍 활용 → SEO 트래픽

**띠별 포춘쿠키** (`/fortune/zodiac/[animal]`) ✅:
- 12띠 동물별 일일 운세 페이지
- 날짜+띠 시드 기반 일일 변경
- SEO 타겟: "쥐띠 오늘의 운세", "띠별운세"

**별자리 운세** (`/fortune/horoscope/[sign]`) ✅:
- 12별자리(양자리~물고기자리) 일일 운세 페이지
- 날짜+별자리 시드 기반 일일 변경, 원소(불/흙/바람/물) 표시
- SEO 타겟: "양자리 운세", "별자리운세", "오늘의 별자리 운세"
- HoroscopeSelector 컴포넌트로 별자리 간 네비게이션

**연속 방문 스트릭 카운터** ✅:
- `useStreak.ts` 훅으로 currentStreak/maxStreak localStorage 추적
- 포춘 카드에 🔥 배지로 연속 방문 일수 표시

### Phase 3: 리텐션 (2/4 완료)

| 우선순위 | 기능 | 상태 | 기대 효과 |
|---------|------|------|----------|
| 9 | **PWA (홈 화면 추가)** | ✅ 완료 | 중간 |
| 10 | **포춘쿠키 도감 (컬렉션)** | ✅ 완료 | 중간 |
| 11 | **오늘의 행운 퍼센타일** | ❌ 미구현 | 중간 |
| 12 | **타로 스타일 쿠키 선택** | ❌ 미구현 | 중간 |

**PWA** ✅:
- `manifest.json` + `sw.js` 서비스 워커 (캐시 전략 + 오프라인 폴백)
- "홈 화면에 추가" → 앱처럼 사용
- 아침 푸시 알림: 미구현 (향후 추가 가능)

**포춘쿠키 도감** (`/collection`) ✅:
- `useFortuneCollection.ts` 훅으로 localStorage 기반 수집 추적
- 카테고리별 진행률 표시 (X/280개)
- 완성 욕구(completionist) 심리로 재방문 유도

**오늘의 행운 퍼센타일** ❌:
- "오늘 당신의 운세는 상위 8%!" → 공유 욕구 자극
- 익명 집계: "오늘 대길 받은 사람: 12.3%"
- 서버 사이드 집계 필요 (백엔드/DB 의존)

**타로 스타일 쿠키 선택** ❌:
- 여러 쿠키 중 하나를 골라 운세 확인
- 선택의 재미 + 타로 감성 추가

### SEO 전략

**타겟 키워드 (우선순위순):**

| 키워드 | 경쟁도 | 볼륨 |
|--------|--------|------|
| 포춘쿠키 | 매우 낮음 (블루오션) | 중간 |
| 포춘쿠키 운세 | 매우 낮음 | 낮음-중간 |
| 오늘의 운세 무료 | 매우 높음 | 매우 높음 |
| 띠별운세 2026 | 높음 | 높음 |
| MBTI 운세 | 중간 | 높음 |
| 별자리 운세 | 중간 | 높음 |
| 궁합 테스트 | 높음 | 매우 높음 |
| 수능 운세 | 낮음 (시즌) | 높음 (11월) |

**블로그 콘텐츠 확장 (자동 생성 활용):**
- 띠별 2026년 운세 (12개 포스트)
- MBTI별 행운의 포춘쿠키 (16개 포스트)
- 꿈해몽 시리즈 (유형별)
- 별자리별 월별 운세 (12개, 월간 갱신)
- → 40+ 신규 SEO 최적화 페이지 확보 가능

**네이버 SEO (한국 검색 필수):**
- 네이버 블로그 개설 → 블로그 포스트 크로스포스팅
- 네이버 서치어드바이저 sitemap 제출 (완료)
- 네이버 카페 (운세/심리테스트/대학생) 자연스러운 공유

### 커뮤니티 시딩 (무료 마케팅)

**타겟 커뮤니티:**
- **에브리타임**: 대학생 → 테스트/운세 콘텐츠 확산 빠름
- **네이버 카페**: 심리테스트, 운세, 재미있는 사이트
- **인스타그램 릴스**: 쿠키 깨기 ASMR 영상 (15-30초)
- **틱톡/유튜브 숏츠**: "포춘쿠키 챌린지 - 대길 나올 때까지"
- **트위터/X**: 운세/성격 테스트 콘텐츠 공유 활발
- **블라인드**: 직장인 "점심시간 포춘쿠키" 공유

**마이크로 인플루언서 (1K-10K):**
- 운세/심리테스트 관련 인플루언서에게 선물 포춘쿠키 링크 전달
- 대학생 인플루언서 타겟 (테스트 공유 빈도 높음)

### 핵심 바이럴 원칙

> **공유 결과 카드 = 마케팅 그 자체**. 사용자가 결과를 공유할 때마다 무료 광고. UX 전체를 "결과가 예쁘고 개인적이어서 공유하고 싶게" 만드는 것에 집중.

**바이럴 루프**: 결과 → 스크린샷/공유 → 호기심 → 방문 → 결과 → 공유

**성공 요소 (케이테스트 모델):**
- 결과 이미지가 시각적으로 아름다울 것
- 결과가 개인 정체성을 표현할 것 ("나는 이런 유형")
- 비교를 유도할 것 ("너는 뭐 나왔어?")
- 진입 장벽 2분 이내
- 카카오톡 공유가 핵심 채널

## 주의사항

- 운세 메시지는 오락 목적이며 실제 미래 예측이 아님을 명시
- AdSense 정책: 쿠키 인터랙션 영역에 광고 배치 금지
- 모바일 흔들기 감지: iOS에서는 DeviceMotion 권한 요청 필요
- localStorage 사용: 일일 운세 저장, 음소거 설정 (개인정보 동의 불필요)
- Kakao SDK: `KakaoScript` 컴포넌트가 SDK 로드 + 즉시 초기화 담당. 카카오 개발자 앱에서 JavaScript 키 발급 + **플랫폼키 > JavaScript 키 > JavaScript SDK 도메인**에 웹 도메인 등록 필수 (미등록 시 4019 에러)
- Kakao 도메인 등록 위치 2곳: ① 제품링크관리 > 웹 도메인, ② 플랫폼키 > JavaScript 키 > JavaScript SDK 도메인
