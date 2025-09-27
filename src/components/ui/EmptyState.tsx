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
    <div className='empty-state-container'>
      {icon && <div className='empty-state-icon'>{icon}</div>}

      <Typography
        variant='h6'
        color='text.primary'
        className='mb-1 font-medium'
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant='body2'
          className='text-secondary-color mb-3 max-width-300'
        >
          {description}
        </Typography>
      )}

      {action && <div className='empty-state-action'>{action}</div>}
    </div>
  );

  if (fullScreen) {
    return <div className='loading-container'>{content}</div>;
  }

  return content;
};
