# 교회 출석 관리 시스템 (Tychicus Dashboard)

React + TypeScript로 개발된 교회 청년회 출석 관리 시스템입니다.

## 🎯 프로젝트 개요

이 시스템은 교회 청년회의 구성원 관리, 출석 현황, 심방 관리, 포럼 관리 등의 기능을 제공하는 웹 애플리케이션입니다.

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **스타일링**: CSS Modules + Material-UI
- **라우팅**: React Router v6
- **상태 관리**: React Hooks (useState, useEffect, useContext)
- **차트**: Chart.js + Recharts
- **빌드 도구**: Create React App

## 📁 프로젝트 구조

```
src/
├── components/           # React 컴포넌트
│   ├── layouts/         # 레이아웃 컴포넌트
│   │   ├── MainLayout.tsx    # 메인 레이아웃
│   │   └── Sidebar.tsx       # 사이드바
│   ├── main/           # 메인 페이지 컴포넌트
│   │   ├── Dashboard.tsx          # 대시보드
│   │   ├── MembersManagement.tsx  # 구성원 관리
│   │   ├── MemberDetail.tsx       # 구성원 상세
│   │   ├── VisitationManagement.tsx # 심방 관리
│   │   ├── VisitationDetail.tsx    # 심방 상세
│   │   ├── ForumManagement.tsx     # 포럼 관리
│   │   ├── WorshipStatus.tsx      # 예배 현황
│   │   ├── AttendanceChart.tsx    # 출석 차트
│   │   ├── WelcomePage.tsx        # 환영 페이지
│   │   └── TempPage.tsx           # 임시 페이지
│   └── ui/             # 공통 UI 컴포넌트
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── FormField.tsx
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       └── index.ts
├── data/               # 데이터 파일
│   └── mockData.js     # 목업 데이터
├── hooks/              # 커스텀 훅
│   ├── useForm.ts      # 폼 상태 관리
│   ├── useToggle.ts    # 토글 상태 관리
│   ├── useDebounce.ts  # 디바운스
│   ├── useLocalStorage.ts # 로컬 스토리지
│   └── index.ts
├── styles/             # 스타일 파일
│   └── global.css      # 글로벌 스타일
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── utils/              # 유틸리티 함수
│   ├── axiosClient.ts  # API 클라이언트
│   ├── constants.ts    # 상수
│   ├── dateUtils.ts    # 날짜 유틸리티
│   ├── envConfig.ts    # 환경 설정
│   ├── logger.ts       # 로깅
│   ├── validation.ts   # 검증 함수
│   └── index.ts
├── App.tsx             # 메인 앱 컴포넌트
├── index.tsx           # 앱 진입점
└── react-app-env.d.ts  # React 앱 타입 정의
```

## 🎨 디자인 시스템

### 색상 테마

- **Primary**: 민트 그린 (#4ecdc4)
- **Secondary**: 스카이 블루 (#5dade2)
- **Success**: 성공 그린 (#66bb6a)
- **Warning**: 주황색 (#ffa726)
- **Error**: 부드러운 빨강 (#ef5350)

### 타이포그래피

- **Font Family**: Noto Sans KR, Apple System Fonts
- **Font Sizes**: 12px ~ 48px (4px 단위)
- **Font Weights**: 400 (Normal), 500 (Medium), 700 (Bold)

### 간격 시스템

- **Spacing**: 4px 기반 (4px, 8px, 16px, 24px, 32px, 48px)

## 🚀 주요 기능

### 1. 대시보드

- 전체 현황 통계
- 국별/그룹별 출석률 차트
- 최근 활동 내역
- 연속 결석자 정보

### 2. 구성원 관리

- 구성원 목록 조회 및 검색
- 구성원 상세 정보
- 프로필 사진 관리
- 히스토리 관리 (기본이력/영적흐름)

### 3. 심방 관리

- 심방 기록 등록/수정/삭제
- 심방 내역 조회 및 필터링
- 심방 상세 정보
- 통계 및 분석

### 4. 포럼 관리

- 포럼 게시글 관리
- 한줄 기도문 관리
- 구성원별 활동 내역

### 5. 예배 현황

- 예배별 출석 현황
- 출석률 통계
- 결석자 관리

## 📱 반응형 디자인

- **Mobile First** 접근법
- **Breakpoints**: 480px, 768px, 1024px, 1280px, 1920px
- **터치 인터페이스** 최적화
- **하단 탭 네비게이션** 지원

## 🔧 개발 환경 설정

### 필수 요구사항

- Node.js 16.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build
```

### 환경 변수

```bash
# .env 파일 생성
REACT_APP_ENV=local
REACT_APP_USE_MOCK=true
```

## 📋 개발 가이드라인

### 코드 스타일

- **Prettier** 자동 포맷팅 사용
- **ESLint** 린팅 규칙 준수
- **TypeScript** 타입 안정성 확보

### 컴포넌트 구조

- **함수형 컴포넌트** 사용
- **커스텀 훅** 적극 활용
- **CSS 클래스** 기반 스타일링
- **Material-UI** 컴포넌트 활용

### 상태 관리

- **React Hooks** 기반 상태 관리
- **Context API** 필요시 사용
- **로컬 스토리지** 활용

## 🗂️ 라우팅 구조

```
/                    # 환영 페이지
/main/               # 메인 애플리케이션
├── dashboard        # 대시보드
├── worship          # 예배 현황
├── member-management # 구성원 관리
│   └── :id         # 구성원 상세
├── groups           # 소그룹 관리 (임시)
├── attendance       # 출결 관리 (임시)
├── forum            # 포럼 관리
├── visitation       # 심방 관리
│   └── :id         # 심방 상세
├── meeting-records  # 지역모임 관리 (임시)
└── events           # 행사 관리 (임시)
```

## 📊 데이터 구조

### 구성원 데이터

```typescript
interface Member {
  id: number;
  이름: string;
  생일연도: string;
  소속국: string;
  소속그룹: string;
  소속순: string;
  직분: string;
  주일청년예배출석일자: string;
  수요예배출석일자: string;
}
```

### 심방 데이터

```typescript
interface Visitation {
  id: number;
  대상자_이름: string;
  대상자_국: string;
  대상자_그룹: string;
  대상자_순: string;
  심방날짜: string;
  심방방법: string;
  진행자_이름: string;
  심방내용: string;
  작성일시: string;
}
```

## 🔄 향후 계획

### 단기 계획

- [ ] 소그룹 관리 기능 구현
- [ ] 출결 관리 기능 구현
- [ ] 행사 관리 기능 구현
- [ ] 알림 시스템 구현

### 장기 계획

- [ ] 실제 API 연동
- [ ] 사용자 인증 시스템
- [ ] 데이터 백업/복원
- [ ] 모바일 앱 개발

## 📝 라이선스

이 프로젝트는 교회 내부 사용을 위한 프로젝트입니다.

## 👥 기여자

- 개발팀

---

**참고**: 이 프로젝트는 교회 청년회 출석 관리를 위한 시스템입니다. 모든 데이터는 교회 내부에서만 사용됩니다.
