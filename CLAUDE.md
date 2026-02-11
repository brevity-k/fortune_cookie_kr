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
| 사이트맵 | next-sitemap | 4.2.x |
| 유틸리티 | clsx | 2.x |

## 프로젝트 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx                # 루트 레이아웃 (폰트, GA, AdSense, Kakao SDK)
│   ├── icon.svg                  # 커스텀 파비콘 (골드 쿠키 SVG)
│   ├── page.tsx                  # 메인 포춘쿠키 체험 페이지
│   ├── globals.css               # Tailwind + 커스텀 CSS 애니메이션
│   ├── fortune/[category]/       # 카테고리별 운세 페이지 (6개)
│   │   ├── page.tsx              # 서버 컴포넌트 (메타데이터, SSG)
│   │   └── client.tsx            # 클라이언트 컴포넌트
│   ├── gift/[id]/                # 선물 포춘쿠키
│   │   ├── page.tsx              # 서버 컴포넌트
│   │   └── client.tsx            # 클라이언트 컴포넌트
│   ├── blog/                     # 블로그 목록
│   │   └── [slug]/page.tsx       # 블로그 상세 (SSG, generateStaticParams)
│   ├── about/page.tsx            # 소개
│   ├── privacy/page.tsx          # 개인정보처리방침
│   ├── terms/page.tsx            # 이용약관
│   ├── contact/page.tsx          # 문의 (ContactForm 포함)
│   └── api/contact/route.ts      # 문의 폼 API (Resend 이메일)
├── components/
│   ├── contact/
│   │   └── ContactForm.tsx       # 문의 폼 (이름/이메일/메시지, 자동 답장)
│   ├── cookie/
│   │   ├── FortuneCookie.tsx     # 메인 쿠키 인터랙션 (핵심 컴포넌트)
│   │   ├── CookieSVG.tsx         # SVG 쿠키 비주얼 (idle/crack/broken 상태)
│   │   ├── FortunePaper.tsx      # 운세 종이 (타자기 효과, 등급, 행운 정보)
│   │   └── InteractionHint.tsx   # 인터랙션 힌트 칩
│   ├── fortune/
│   │   ├── FortuneShare.tsx      # 공유 버튼 (카카오/트위터/웹공유/복사)
│   │   └── CategorySelector.tsx  # 카테고리 선택 칩
│   ├── layout/
│   │   ├── Header.tsx            # 네비게이션 헤더 (모바일 햄버거 메뉴)
│   │   └── Footer.tsx            # 푸터 (카테고리/콘텐츠/법적 링크)
│   ├── ads/AdSense.tsx           # Google AdSense 광고 컴포넌트
│   └── ui/MuteToggle.tsx         # 사운드 음소거 토글
├── data/
│   ├── fortunes/                 # 운세 데이터 (총 280개)
│   │   ├── index.ts              # 통합 export
│   │   ├── love.ts               # 사랑운 50개
│   │   ├── career.ts             # 재물운 50개
│   │   ├── health.ts             # 건강운 40개
│   │   ├── study.ts              # 학업운 40개
│   │   ├── general.ts            # 총운 60개
│   │   └── relationship.ts       # 대인운 40개
│   └── blog-posts.ts             # 블로그 포스트 10개 (한국어 HTML)
├── hooks/
│   ├── useFortune.ts             # 운세 뽑기 (랜덤/카테고리)
│   ├── useDailyFortune.ts        # 일일 운세 (날짜 기반 시드, localStorage)
│   ├── useShakeDetection.ts      # 모바일 흔들기 감지 (DeviceMotion API)
│   ├── useSoundEffects.ts        # Howler.js 사운드 관리 + 음소거
│   └── useShareFortune.ts        # 공유 (카카오/웹공유/트위터/클립보드)
├── lib/
│   ├── fortune-selector.ts       # 운세 선택 로직 (시드 해싱, 랜덤)
│   ├── analytics.ts              # GA4 이벤트 추적 헬퍼
│   └── utils.ts                  # cn() 유틸리티
└── types/
    ├── fortune.ts                # Fortune, FortuneCategory, CookieState 등 타입
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
- **API**: `/api/contact` (POST) — Resend SDK로 이메일 전송
- **알림 메일**: 사이트 운영자(brevity1s.wos@gmail.com)에게 문의 내용 전달
- **자동 답장**: 문의자에게 접수 확인 메일 자동 발송
- **발신 주소**: `onboarding@resend.dev` (Resend 무료 티어 기본) → 커스텀 도메인 추가 가능
- **무료 제한**: 하루 100건 (Resend 무료 플랜)
- **설정**: `RESEND_API_KEY` 환경 변수 필요 (https://resend.com 에서 발급)

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
npm run build      # 프로덕션 빌드 + 사이트맵 생성
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
- sitemap.xml 자동 생성 (25개 URL)
- robots.txt 자동 생성

### 4단계: AdSense 신청
- 아래 "AdSense 승인 체크리스트" 참조

### 5단계: 분석 도구 설정 ✅
- GA4 측정 ID: `G-GCVN75X50X` (Vercel 환경변수 설정 완료)
- 이벤트 추적: cookie_break, fortune_reveal, share

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
- [x] 사이트맵(sitemap.xml) 자동 생성
- [x] robots.txt 자동 생성
- [x] ads.txt 파일 준비
- [x] 모바일 반응형 디자인
- [x] 원본 한국어 콘텐츠 (280개 운세 + 10개 블로그)
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
3. 빌드 시 자동으로 SSG 페이지 생성

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

### 콘텐츠 건강 체크

```bash
npm run content:check    # 운세 데이터 + 블로그 품질 점검
npm run content:season   # 시즌별 콘텐츠 확인
```

### 자동 리마인더 스케줄
- **매주 월요일 09:00 KST**: 콘텐츠 건강 체크 실행
- **매월 1일**: 블로그/운세 업데이트 이슈 자동 생성
- **시즌 이벤트 (1월/2월/10월/12월)**: 시즌 콘텐츠 이슈 자동 생성

## 주의사항

- 운세 메시지는 오락 목적이며 실제 미래 예측이 아님을 명시
- AdSense 정책: 쿠키 인터랙션 영역에 광고 배치 금지
- 모바일 흔들기 감지: iOS에서는 DeviceMotion 권한 요청 필요
- localStorage 사용: 일일 운세 저장, 음소거 설정 (개인정보 동의 불필요)
- Kakao SDK: 카카오 개발자 앱에서 JavaScript 키 발급 + **플랫폼키 > JavaScript 키 > JavaScript SDK 도메인**에 웹 도메인 등록 필수 (미등록 시 4019 에러)
- Kakao 도메인 등록 위치 2곳: ① 제품링크관리 > 웹 도메인, ② 플랫폼키 > JavaScript 키 > JavaScript SDK 도메인
