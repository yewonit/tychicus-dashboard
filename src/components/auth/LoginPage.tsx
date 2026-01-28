import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useForm } from '../../hooks';
import { LoginRequest } from '../../types';
import { validationRules } from '../../utils/validation';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 관리
  const form = useForm<LoginRequest>({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: validationRules.email,
      password: validationRules.password,
    },
    onSubmit: async data => {
      try {
        setIsSubmitting(true);
        clearError();
        await login(data);
        // 로그인 성공 시 navigate는 useEffect에서 처리
      } catch (error) {
        console.error('로그인 실패:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // 이미 인증된 경우 대시보드로 리다이렉트 (앱 초기화 완료 후)
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // 로딩 중이면 스피너 표시
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

  return (
    <div className='auth-container'>
      <div className='auth-paper'>
        {/* 헤더 영역 */}
        <div className='header-box'>
          <Typography variant='h4' className='auth-title'>
            로그인
          </Typography>
          <Typography variant='body1' className='auth-subtitle'>
            교회 출석 관리 시스템에 로그인하세요
          </Typography>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <Alert severity='error' className='mb-3' onClose={clearError}>
            {error}
          </Alert>
        )}

        {/* 로그인 폼 */}
        <Box component='form' onSubmit={form.handleSubmit} noValidate>
          <div className='input-group'>
            <TextField
              fullWidth
              type='email'
              label='이메일'
              placeholder='이메일을 입력하세요'
              value={form.values.email}
              onChange={form.handleChange('email')}
              onBlur={form.handleBlur('email')}
              error={form.touched.email && !!form.errors.email}
              helperText={form.touched.email && form.errors.email}
              className='common-textfield'
              disabled={isSubmitting}
              autoComplete='email'
              autoFocus
            />
          </div>

          <div className='input-group'>
            <TextField
              fullWidth
              type='password'
              label='비밀번호'
              placeholder='비밀번호를 입력하세요'
              value={form.values.password}
              onChange={form.handleChange('password')}
              onBlur={form.handleBlur('password')}
              error={form.touched.password && !!form.errors.password}
              helperText={form.touched.password && form.errors.password}
              className='common-textfield'
              disabled={isSubmitting}
              autoComplete='current-password'
            />
          </div>

          <div className='button-group'>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              className='common-button height-56'
              disabled={isSubmitting || !form.isValid}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} className='mr-1' style={{ color: 'white' }} />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>
          </div>
        </Box>

        {/* 추가 정보 */}
        <div className='mt-4 text-center'>
          <Typography variant='body2' className='text-tertiary-color'>
            문제가 있으신가요?{' '}
            <a href='mailto:admin@icoramdeo.com' className='primary-link'>
              관리자에게 문의하세요
            </a>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
