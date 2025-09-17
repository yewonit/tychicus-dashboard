# React 교회 출석 관리 시스템 - 커서룰

## 프로젝트 개요

Vue.js에서 React로 마이그레이션하는 교회 출석 관리 시스템입니다. 기존 디자인 시스템의 색상과 타이포그래피를 유지하면서 모바일 최적화된 UI를 구현합니다.

## 기술 스택

- React 18 + TypeScript
- **Material-UI (MUI) 5.13.7** (UI 프레임워크)
- **@emotion/styled** (CSS-in-JS 스타일링)
- React Router v6
- Redux Toolkit (상태 관리)
- Axios (HTTP 클라이언트)

## 권장 버전

| 항목                    | 권장 버전                | 비고                                                |
| ----------------------- | ------------------------ | --------------------------------------------------- |
| **React**               | 18.2.0                   | 최신 안정 버전, Concurrent Mode 등 최신 기능 지원   |
| **TypeScript**          | 5.1.x                    | 최신 안정 버전, 엄격한 타입 체크 권장 (strict 모드) |
| **React Router**        | 6.11.x                   | 최신 버전, 중첩 라우팅 및 `Outlet` 등 기능 개선     |
| **MUI (@mui/material)** | 5.13.x                   | React 18 호환, Emotion 스타일링 사용                |
| **Node.js**             | 16.x 이상                | 최신 라이브러리 호환성 위해 LTS 버전 이상 권장      |
| **npm / yarn**          | npm 9.x, yarn 1.x or 3.x | 최신 안정 버전 사용 권장                            |

## 색상 시스템

기존 Vue 프로젝트의 민트-스카이블루 테마를 Material-UI 테마로 활용:

```typescript
// Material-UI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#4ecdc4', // 민트 그린
      light: '#a6e7e2', // 연한 민트
      dark: '#3aa39b', // 진한 민트
    },
    secondary: {
      main: '#5dade2', // 스카이 블루
      light: '#8cd6ff', // 연한 스카이 블루
      dark: '#0096ee', // 진한 스카이 블루
    },
    success: {
      main: '#66bb6a', // 성공 그린
    },
    warning: {
      main: '#ffa726', // 주황색
    },
    error: {
      main: '#ef5350', // 부드러운 빨강
    },
    info: {
      main: '#85c1e9', // 밝은 하늘색
    },
    background: {
      default: '#f8fdff', // 메인 배경
      paper: '#ffffff', // 카드 배경
    },
    text: {
      primary: '#2c3e50', // 메인 텍스트
      secondary: '#455a64', // 보조 텍스트
      disabled: '#85929e', // 비활성화 텍스트
    },
  },
  typography: {
    fontFamily:
      '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 700 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.2 },
  },
  spacing: 4, // 4px 기반 간격 시스템
  shape: {
    borderRadius: 12, // 기본 border-radius
  },
});
```

## 컴포넌트 구조

Material-UI 기반의 모바일 우선 컴포넌트 설계:

```
src/
├── components/
│   ├── ui/                    # 기본 UI 컴포넌트 (MUI 기반)
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Layout/
│   ├── auth/                  # 인증 관련
│   ├── attendance/            # 출석 관리
│   ├── members/               # 회원 관리
│   └── navigation/            # 네비게이션
├── hooks/                     # 커스텀 훅
├── store/                     # Redux Toolkit 상태 관리
├── utils/                     # 유틸리티
├── types/                     # TypeScript 타입
└── styles/                    # 글로벌 스타일 및 테마
```

## Material-UI 사용 가이드라인

### 컴포넌트 스타일링

```typescript
// 1. styled() API 사용 (권장)
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: "white",
  boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
  },
}));

// 2. sx prop 사용 (간단한 스타일링)
<Button
  sx={{
    borderRadius: 3,
    background: "linear-gradient(135deg, primary.main 0%, secondary.main 100%)",
    color: "white",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  }}
>
  로그인
</Button>;
```

### 반응형 디자인

```typescript
// Material-UI 브레이크포인트 사용
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // 모바일
      sm: 768, // 태블릿
      md: 1024, // 데스크톱
      lg: 1280, // 대형 화면
      xl: 1920, // 초대형 화면
    },
  },
});

// 반응형 스타일링
<Box
  sx={{
    padding: { xs: 2, sm: 3, md: 4 },
    fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
  }}
>
  반응형 컨텐츠
</Box>;
```

## 모바일 최적화 가이드라인

### 터치 인터페이스

- **최소 터치 타겟**: 44px × 44px (Material-UI 기본값)
- **Button 간격**: theme.spacing(1) = 8px 이상
- **터치 피드백**: Material-UI ripple 효과 활용

### 네비게이션 패턴

```typescript
// 하단 탭 네비게이션
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

// 사이드 드로어
import { Drawer, List, ListItem } from '@mui/material';

// 앱바 (헤더)
import { AppBar, Toolbar, IconButton } from '@mui/material';
```

## 상태 관리 패턴

Redux Toolkit + React Query 조합:

```typescript
// Redux Toolkit Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetch',
  async (params: AttendanceParams) => {
    const response = await attendanceAPI.getList(params);
    return response.data;
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAttendance.pending, state => {
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});
```

## API 클라이언트 패턴

Axios + 환경별 설정:

```typescript
// axiosClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
});

// 요청 인터셉터
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 토큰 만료 처리
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 폴더 네이밍 컨벤션

- **컴포넌트**: PascalCase (AttendanceCard, LoginForm)
- **훅**: camelCase (useAuth, useAttendance)
- **유틸리티**: camelCase (formatDate, validateEmail)
- **상수**: UPPER_SNAKE_CASE (API_ENDPOINTS, THEME_COLORS)
- **타입**: PascalCase (User, AttendanceRecord)

## TypeScript 사용 규칙

```typescript
// 1. 엄격한 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'leader';
}

// 2. 제네릭 활용
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// 3. 유틸리티 타입 활용
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;

// 4. Material-UI 타입 확장
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradients: {
        primary: string;
        secondary: string;
      };
    };
  }
}
```

## 애니메이션 가이드라인

Material-UI 애니메이션 시스템 활용:

```typescript
import { Fade, Slide, Grow, Collapse } from '@mui/material';

// 페이지 전환
<Fade in={isVisible} timeout={300}>
  <Box>컨텐츠</Box>
</Fade>

// 모바일 슬라이드
<Slide direction="up" in={isOpen}>
  <Dialog>다이얼로그</Dialog>
</Slide>
```

## 접근성 가이드라인

- **색상 대비**: Material-UI 기본 팔레트 사용 (WCAG AA 준수)
- **키보드 네비게이션**: Material-UI 컴포넌트 기본 지원
- **스크린 리더**: aria-label, aria-describedby 적극 활용
- **포커스 관리**: Material-UI focus trap 활용

## 성능 최적화

```typescript
// 1. 컴포넌트 최적화
import { memo, useMemo, useCallback } from "react";

const AttendanceCard = memo(({ attendance }: Props) => {
  const formattedDate = useMemo(
    () => formatDate(attendance.date),
    [attendance.date]
  );

  const handleClick = useCallback(() => {
    onSelect(attendance.id);
  }, [attendance.id, onSelect]);

  return <Card onClick={handleClick}>{formattedDate}</Card>;
});

// 2. 번들 최적화
const LazyDashboard = lazy(() => import("./Dashboard"));

// 3. Material-UI 트리 셰이킹
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// ❌ import * from '@mui/material';
```

## Git 커밋 컨벤션

- **feat**: 새로운 기능 (feat: 출석 입력 기능 추가)
- **fix**: 버그 수정 (fix: 로그인 토큰 만료 처리)
- **style**: UI/스타일 변경 (style: 버튼 디자인 개선)
- **refactor**: 코드 리팩토링 (refactor: API 클라이언트 구조 개선)
- **perf**: 성능 개선 (perf: 목록 렌더링 최적화)

## 환경별 설정

```typescript
const env = {
  production: {
    API_BASE_URL: 'https://attendance.icoramdeo.com/api',
    AUTH_BASE_URL: 'https://attendance.icoramdeo.com/auth',
  },
  development: {
    API_BASE_URL: 'https://attendance-dev.icoramdeo.com/api',
    AUTH_BASE_URL: 'https://attendance-dev.icoramdeo.com/auth',
  },
  local: {
    API_BASE_URL: 'http://localhost:3000/api',
    AUTH_BASE_URL: 'http://localhost:3000/auth',
  },
};
```

## 🔧 코드 품질 관리 규칙

### 필수 체크 규칙

코드를 수정한 후에는 **반드시** 아래 단계를 순서대로 실행해야 합니다:

```bash
# 1. Prettier 자동 포맷팅
npm run format

# 2. ESLint 검사 및 자동 수정
npm run lint

# 3. TypeScript 타입 체크 (선택사항)
npm run type-check
```

### 코드 수정 시 체크리스트

#### ✅ 매번 확인해야 할 사항:

- [ ] **Prettier**: 코드 포맷팅이 일관되게 적용되었는가?
- [ ] **ESLint**: 코딩 규칙을 준수하고 있는가?
- [ ] **Import 정리**: 사용하지 않는 import는 제거되었는가?
- [ ] **타입 안전성**: TypeScript 에러가 없는가?
- [ ] **Console 로그**: 개발용 console.log가 제거되었는가? (에러 로그 제외)

#### 🎯 코드 작성 시 주의사항:

1. **따옴표**: 문자열은 항상 **작은따옴표(`'`)** 사용
2. **세미콜론**: 모든 구문 끝에 **세미콜론(`;`)** 필수
3. **들여쓰기**: **2칸 스페이스** 사용 (탭 금지)
4. **줄바꿈**: 한 줄 최대 **80자** 제한
5. **후행 쉼표**: 객체/배열 마지막 요소 뒤에 **쉼표 추가**

#### 🚨 자동 수정 불가능한 경우:

- **ESLint 에러**가 발생하면 수동으로 수정 후 다시 체크
- **TypeScript 에러**는 타입 정의를 명확히 한 후 재시도
- **논리적 오류**는 코드 리뷰를 통해 해결

### 에디터 설정 권장사항

#### VS Code 설정 (.vscode/settings.json):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

#### 커밋 전 자동 체크 (Husky + lint-staged):

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["prettier --write", "eslint --fix", "git add"]
  }
}
```

### 팀 협업 규칙

#### 🔄 Pull Request 체크리스트:

- [ ] `npm run format` 실행 완료
- [ ] `npm run lint` 통과
- [ ] `npm run build` 성공
- [ ] 기능 테스트 완료
- [ ] 코드 리뷰 요청

#### 📝 커밋 메시지 규칙:

```bash
# 좋은 예
feat: 이메일 인증 페이지 추가
fix: 로그인 폼 validation 오류 수정
style: Prettier 포맷팅 적용

# 나쁜 예
update code
fix bug
formatting
```

이 규칙들을 준수하여 **높은 품질의 코드**를 유지하고 **팀 생산성**을 향상시키세요! 🚀

---

## 보안 Logger 시스템

### 🔒 보안 원칙

**절대 금지**: `console.log`에 민감한 데이터 출력
**필수 사용**: 보안 Logger 유틸리티 활용

### 📝 Logger 사용법

#### ✅ 올바른 사용법

```typescript
import { logInfo, logError, logUserAction, logApiCall } from '../utils/logger';

// 일반 정보 로그
logInfo('사용자가 대시보드에 접근했습니다', 'Dashboard');

// 사용자 액션 로그
logUserAction('로그인 시도', 'Auth', { timestamp: new Date().toISOString() });

// API 호출 로그
logApiCall('GET', '/api/members', 'MemberService');

// 에러 로그
logError('데이터 로딩 실패', 'Dashboard', { errorCode: 'DATA_LOAD_FAILED' });

// 예외 처리
try {
  // 위험한 작업
} catch (error) {
  logException(error, 'PaymentService', { userId: 'user123' });
}
```

#### ❌ 금지된 사용법

```typescript
// 🚨 절대 금지: 민감한 데이터 노출
console.log('사용자 정보:', { email: 'user@email.com', password: '123456' });
console.log('API 응답:', apiResponse); // 민감한 데이터 포함 가능성
console.log('폼 데이터:', formData); // 개인정보 포함 가능성

// 🚨 절대 금지: 직접적인 console 사용
console.log('디버그 메시지');
console.error('에러 발생');
```

### 🛡️ 자동 데이터 마스킹

Logger는 다음 키워드가 포함된 데이터를 자동으로 마스킹합니다:

- `password`, `token`, `secret`, `key`, `auth`
- `credential`, `session`, `cookie`
- `email`, `phone`, `address`, `personalInfo`
- `birthDate`, `ssn`, `id`

### 🎯 로그 레벨

| 레벨  | 용도                          | 프로덕션 출력 |
| ----- | ----------------------------- | ------------- |
| DEBUG | 개발 디버깅 정보              | ❌            |
| INFO  | 일반 정보 (사용자 액션 등)    | ❌            |
| WARN  | 경고 (성능 이슈, 비정상 상황) | ✅            |
| ERROR | 에러 (시스템 오류, 예외)      | ✅            |

### 📋 Logger 사용 체크리스트

- [ ] `console.log` 대신 `logInfo` 사용
- [ ] `console.error` 대신 `logError` 사용
- [ ] 민감한 데이터 로깅 전 마스킹 확인
- [ ] 적절한 컨텍스트와 메타데이터 제공
- [ ] 사용자 액션은 `logUserAction` 사용
- [ ] API 호출은 `logApiCall` 사용

### ⚠️ 보안 주의사항

1. **개인정보 보호**: 이름, 이메일, 전화번호 등 개인정보 로깅 금지
2. **인증 정보 보호**: 비밀번호, 토큰, 세션 정보 로깅 금지
3. **민감한 비즈니스 데이터**: 출석 데이터, 개인 기록 등 최소한으로 로깅
4. **에러 정보만**: 디버깅에 필요한 최소한의 정보만 포함

### 🔧 설정 방법

```typescript
// 개발 환경에서 디버그 레벨 활성화
if (process.env.NODE_ENV === 'development') {
  logger.setLogLevel(LogLevel.DEBUG);
}

// 프로덕션 환경에서는 WARN 이상만
if (process.env.NODE_ENV === 'production') {
  logger.setLogLevel(LogLevel.WARN);
}
```

이 가이드라인을 따라 Material-UI 기반의 일관성 있고 사용자 친화적인 React 앱을 구축하세요! 🎉
