import { CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때
  if (loading) {
    return (
      <div className='auth-loading-container'>
        <CircularProgress size={60} className='primary-color' />
        <Typography variant='body1' className='mt-2 text-secondary-color'>
          인증 상태를 확인하고 있습니다...
        </Typography>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AuthGuard;
