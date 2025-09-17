import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface LoadingSpinnerProps {
  /** 로딩 메시지 */
  message?: string;
  /** 크기 */
  size?: number;
  /** 전체 화면 중앙 정렬 여부 */
  fullScreen?: boolean;
}

/**
 * 공통 로딩 스피너 컴포넌트
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '로딩 중...',
  size = 40,
  fullScreen = false,
}) => {
  const content = (
    <>
      <CircularProgress size={size} sx={{ color: 'var(--primary)' }} />
      {message && (
        <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
      }}
    >
      {content}
    </Box>
  );
};
