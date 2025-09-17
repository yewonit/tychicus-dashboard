import { Box, BoxProps } from '@mui/material';
import React from 'react';

interface CardProps extends BoxProps {
  /** 호버 효과 여부 */
  hoverable?: boolean;
}

/**
 * 공통 카드 컴포넌트
 * 프로젝트 디자인 시스템에 맞는 카드 스타일
 */
export const Card: React.FC<CardProps> = ({
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const getClassName = () => {
    let classes = 'common-card';
    if (hoverable) classes += ' hoverable';
    return `${classes} ${className}`.trim();
  };

  return (
    <Box {...props} className={getClassName()}>
      {children}
    </Box>
  );
};
