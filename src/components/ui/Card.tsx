import { Box, BoxProps } from '@mui/material';
import React from 'react';

interface CardProps extends BoxProps {
  /** 호버 효과 여부 */
  hoverable?: boolean;
  /** DUGIGO 스타일 사용 여부 */
  dugigo?: boolean;
  /** 강조 보더 색상 */
  accentColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

/**
 * 공통 카드 컴포넌트
 * 프로젝트 디자인 시스템에 맞는 카드 스타일
 */
export const Card: React.FC<CardProps> = ({
  hoverable = false,
  dugigo = false,
  accentColor,
  className = '',
  children,
  ...props
}) => {
  const getClassName = () => {
    let classes = [];
    
    // 기본 카드 클래스 선택
    if (dugigo) {
      classes.push('dugigo-card');
      if (hoverable) classes.push('dugigo-card-hoverable');
      if (accentColor) classes.push(`dugigo-card-accent-${accentColor}`);
    } else {
      classes.push('common-card');
      if (hoverable) classes.push('hoverable');
    }
    
    return `${classes.join(' ')} ${className}`.trim();
  };

  return (
    <Box {...props} className={getClassName()}>
      {children}
    </Box>
  );
};
