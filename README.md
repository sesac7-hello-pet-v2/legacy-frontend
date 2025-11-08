# Hello Pet v2 - Legacy Frontend

Next.js 15 기반의 펫케어 커뮤니티 플랫폼 프론트엔드 애플리케이션입니다.

## 📌 개요

Hello Pet v2의 레거시 프론트엔드는 반려동물 관리, 커뮤니티, 공고/신청 시스템을 제공하는 모던 웹 애플리케이션입니다. Next.js 15의 App Router를 사용하여 구축되었으며, TypeScript와 Tailwind CSS로 개발되었습니다.

## 🚀 기술 스택

### Core
- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 18 Alpine
- **Package Manager**: npm

### Frontend Libraries
- **UI Framework**: React 19.0.0
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand 5.0.5
- **HTTP Client**: Axios 1.10.0
- **Authentication**: JWT (jwt-decode 4.0.0)
- **Cookie Management**: js-cookie 3.0.5

### Development Tools
- **Linting**: ESLint 9 with Next.js config
- **Build Tool**: Turbopack (개발 환경)
- **CSS Processing**: PostCSS

## 📁 프로젝트 구조

```
legacy-frontend/
├── app/                        # Next.js App Router
│   ├── (site)/                # 메인 사이트 라우트 그룹
│   │   ├── about/             # 소개 페이지
│   │   ├── announcements/     # 공고 관리
│   │   ├── applications/      # 신청 관리
│   │   ├── boards/            # 게시판
│   │   ├── feed/              # 피드
│   │   ├── me/                # 마이페이지
│   │   ├── my-announcements/  # 내 공고
│   │   ├── notices/           # 공지사항
│   │   ├── pets/              # 반려동물 관리
│   │   └── page.tsx           # 홈페이지
│   ├── _internal/             # 내부 API 라우트
│   ├── actions/               # Server Actions
│   ├── auth/                  # 인증 관련
│   ├── components/            # 공통 컴포넌트
│   │   ├── announcementApplications/
│   │   ├── application/
│   │   ├── boards/
│   │   ├── common/
│   │   └── [기타 컴포넌트들]
│   ├── hooks/                 # Custom Hooks
│   ├── lib/                   # 유틸리티 라이브러리
│   ├── store/                 # Zustand 스토어
│   ├── types/                 # TypeScript 타입 정의
│   └── utils/                 # 유틸리티 함수
├── public/                    # 정적 파일
├── .github/                   # GitHub 설정
├── .next/                     # Next.js 빌드 출력 (gitignored)
├── node_modules/              # 의존성 패키지 (gitignored)
├── Dockerfile                 # Docker 컨테이너 설정
├── amplify.yml               # AWS Amplify 빌드 설정
├── next.config.ts            # Next.js 설정
├── package.json              # 프로젝트 설정
├── tsconfig.json             # TypeScript 설정
└── tailwind.config.js        # Tailwind CSS 설정
```

## 🚦 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd legacy-frontend

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env` 파일 생성:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 개발 서버 실행

```bash
# Turbopack을 사용한 빠른 개발 서버 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📦 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Turbopack을 사용한 개발 서버 실행 (포트 3000) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run build:fast` | 소스맵 없는 빠른 빌드 |
| `npm start` | 프로덕션 서버 실행 (0.0.0.0:3000) |
| `npm run start:docker` | Docker 환경용 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npm run lint:fast` | ESLint 빠른 실행 (경고 무시) |

## 🎯 주요 기능

### 사용자 관리
- 회원가입 및 로그인
- JWT 기반 인증
- 프로필 관리
- 마이페이지

### 반려동물 관리
- 반려동물 등록/수정/삭제
- 이미지 업로드 (드래그 앤 드롭)
- 상세 정보 관리

### 커뮤니티
- 피드 시스템
- 게시판 기능
- 댓글 시스템
- 페이지네이션

### 공고/신청 시스템
- 공고 등록 및 관리
- 신청서 제출
- 신청 상태 추적
- 내 공고 관리

### UI/UX
- 반응형 디자인
- 모달 시스템
- 확인 다이얼로그
- 이미지 캐러셀
- 스마트 이미지 로딩

## 🐳 Docker 배포

### Docker 이미지 빌드

```bash
docker build -t hello-pet-frontend .
```

### Docker 컨테이너 실행

```bash
docker run -p 3000:3000 hello-pet-frontend
```

### Dockerfile 구조
- **Stage 1**: 빌드 환경
  - Node.js 18 Alpine 기반
  - 의존성 설치 및 Next.js 빌드
  - 환경변수: `NEXT_PUBLIC_API_URL=/api`

- **Stage 2**: 프로덕션 환경
  - 최소화된 이미지 크기
  - 필요한 파일만 복사
  - 포트 3000 노출

## ☁️ AWS Amplify 배포

`amplify.yml` 설정:
- **캐싱 전략**:
  - npm 패키지 캐시
  - Next.js 빌드 캐시
  - TypeScript/SWC 캐시
- **빌드 최적화**:
  - 조건부 npm install (해시 기반)
  - 소스맵 비활성화
  - 병렬 TypeScript 타입 체크

## ⚙️ 설정 파일

### next.config.ts
```typescript
- ESLint 에러 무시 (빌드 중)
- TypeScript 빌드 에러 무시
- API 리라이트: /_frontend-api/* → /_internal/*
```

### tsconfig.json
- Strict 모드 활성화
- App Router 경로 별칭 설정
- Next.js 플러그인 포함

## 🔧 개발 가이드

### 컴포넌트 구조
```typescript
// 컴포넌트는 app/components/ 디렉토리에 위치
// 기능별로 하위 디렉토리 구성
app/components/
├── common/          # 공통 컴포넌트
├── boards/          # 게시판 관련
├── application/     # 신청 관련
└── [feature]/       # 기능별 컴포넌트
```

### 상태 관리
```typescript
// Zustand 스토어 사용
// app/store/ 디렉토리에 스토어 정의
```

### API 통신
```typescript
// Axios를 사용한 HTTP 요청
// app/lib/ 또는 app/utils/에 API 클라이언트 정의
```

## 🚀 성능 최적화

- **Turbopack**: 개발 환경에서 빠른 HMR
- **빌드 최적화**: 소스맵 비활성화 옵션
- **이미지 최적화**: Next.js Image 컴포넌트
- **코드 스플리팅**: 자동 코드 분할
- **캐싱 전략**: AWS Amplify 캐시 활용

## 🔒 보안

- JWT 기반 인증
- 쿠키 보안 설정
- API 경로 프록시
- 환경 변수 분리

## 📈 모니터링

- Next.js 빌드 분석
- 런타임 에러 추적
- 성능 메트릭스

## 🐛 문제 해결

### 빌드 에러
```bash
# TypeScript 에러 무시하고 빌드
npm run build:fast
```

### 포트 충돌
```bash
# 다른 포트에서 실행
PORT=3001 npm run dev
```

### 캐시 초기화
```bash
# Next.js 캐시 삭제
rm -rf .next
npm run build
```
