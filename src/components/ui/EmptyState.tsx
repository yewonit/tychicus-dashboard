import { Box, Typography } from '@mui/material';
import React from 'react';

interface EmptyStateProps {
  /** 아이콘 (Material-UI 아이콘) */
  icon?: React.ReactNode;
  /** 제목 */
  title: string;
  /** 설명 */
  description?: string;
  /** 액션 버튼 */
  action?: React.ReactNode;
  /** 전체 화면 여부 */
  fullScreen?: boolean;
}

/**
 * 빈 상태 컴포넌트
 * 데이터가 없거나 로딩 중일 때 표시
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  fullScreen = false,
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      {icon && <Box sx={{ mb: 2, color: 'text.secondary' }}>{icon}</Box>}

      <Typography
        variant='h6'
        color='text.primary'
        sx={{ mb: 1, fontWeight: 'medium' }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mb: 3, maxWidth: 300 }}
        >
          {description}
        </Typography>
      )}

      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
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

  return content;
};
