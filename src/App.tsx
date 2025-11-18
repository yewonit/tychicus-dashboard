import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthGuard, LoginPage } from './components/auth';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './components/main/Dashboard';
import ForumManagement from './components/main/ForumManagement';
import MemberDetail from './components/main/MemberDetail';
import MembersManagement from './components/main/MembersManagement';
import { SeasonUpdate } from './components/main/season_update';
import TempPage from './components/main/TempPage';
import VisitationDetail from './components/main/VisitationDetail';
import VisitationManagement from './components/main/VisitationManagement';
import WelcomePage from './components/main/WelcomePage';
import WorshipStatus from './components/main/WorshipStatus';
import { MobileRestrictionOverlay } from './components/ui';

// Material-UI 테마 설정 - DUGIGO 색상 적용
const theme = createTheme({
  palette: {
    primary: {
      main: '#263A99', // --royal-blue
      light: '#97B4DE', // --dark-sky-blue
      dark: '#1a2c6b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#97B4DE', // --dark-sky-blue
      light: '#b5c9e8',
      dark: '#7a9bd1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F0EBE5', // --alabaster-white
      paper: '#ffffff',
    },
    text: {
      primary: '#2A2829', // --charleston-green
      secondary: '#6c757d', // --text-secondary-dugigo
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ffa726',
    },
    success: {
      main: '#66bb6a',
    },
    info: {
      main: '#85c1e9',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MobileRestrictionOverlay />
      <Router>
        <Routes>
          {/* 로그인 페이지 - 인증 불필요 */}
          <Route path='/login' element={<LoginPage />} />

          {/* 루트 경로 - 대시보드로 리다이렉트 */}
          <Route path='/' element={<Navigate to='/dashboard' replace />} />

          {/* 환영 페이지 - 인증 필요 */}
          <Route
            path='/welcome'
            element={
              <AuthGuard>
                <WelcomePage />
              </AuthGuard>
            }
          />

          {/* 대시보드 직접 접근 - 인증 필요 */}
          <Route
            path='/dashboard'
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>

          {/* 메인 애플리케이션 - 사이드바 포함, 인증 필요 */}
          <Route
            path='/main'
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            {/* 기본 리다이렉트 */}
            <Route index element={<Navigate to='dashboard' replace />} />
            {/* 대시보드 섹션 */}
            {/* 전체 현황 */}
            <Route path='dashboard' element={<Dashboard />} />
            {/* 예배 현황 */}
            <Route path='worship' element={<WorshipStatus />} />
            {/* 조직 관리 섹션 */}
            {/* 구성원 관리 */}
            <Route path='member-management' element={<MembersManagement />} />
            {/* 구성원 상세 */}
            <Route path='member-management/:id' element={<MemberDetail />} />
            {/* 소그룹 관리 */}
            <Route
              path='groups'
              element={<TempPage title='소그룹 관리' description='지역별, 연령별 소그룹을 관리하세요' />}
            />
            {/* 회기 변경 관리 */}
            <Route path='season-update' element={<SeasonUpdate />} />
            {/* 활동 관리 섹션 */}
            <Route
              path='attendance'
              element={<TempPage title='출결 관리' description='청년회 출결 현황을 관리하세요' />}
            />
            {/* 출결 관리 */}
            <Route path='forum' element={<ForumManagement />} />
            {/* 포럼 관리 */}
            <Route path='visitation' element={<VisitationManagement />} />
            {/* 심방 관리 */}
            <Route path='visitation/:id' element={<VisitationDetail />} />
            {/* 심방 상세 */}
            <Route
              path='meeting-records'
              element={<TempPage title='지역모임 관리' description='지역모임 기록을 관리하세요' />}
            />
            {/* 지역모임 관리 */}
            <Route
              path='events'
              element={<TempPage title='행사 관리' description='청년회 행사와 활동을 관리하세요' />}
            />
            {/* 행사 관리 */}
            {/* 커뮤니케이션 섹션 */}
            <Route
              path='notifications'
              element={<TempPage title='공지사항' description='청년회 공지사항을 관리하세요' />}
            />
            {/* 공지사항 */}
            <Route
              path='messages'
              element={<TempPage title='메시지 관리' description='구성원 간 메시지를 관리하세요' />}
            />
            {/* 메시지 관리 */}
            <Route
              path='announcements'
              element={<TempPage title='알림 관리' description='청년회 알림 시스템을 관리하세요' />}
            />
            {/* 알림 관리 */}
            {/* 데이터 관리 섹션 */}
            <Route
              path='data-export'
              element={<TempPage title='데이터 내보내기' description='청년회 데이터를 다양한 형식으로 내보내세요' />}
            />
            {/* 데이터 내보내기 */}
            <Route
              path='backup'
              element={<TempPage title='데이터 백업' description='청년회 데이터를 백업하고 복원하세요' />}
            />
            {/* 데이터 백업 */}
            <Route path='settings' element={<TempPage title='시스템 설정' description='시스템 설정을 관리하세요' />} />
            {/* 시스템 설정 */}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
