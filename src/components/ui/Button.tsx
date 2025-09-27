import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import React from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /** 버튼 스타일 변형 */
  variant?: 'primary' | 'secondary' | 'text';
  /** 전체 너비 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
}

/**
 * 공통 버튼 컴포넌트
 * 프로젝트 디자인 시스템에 맞는 스타일 적용
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  loading,
  disabled,
  children,
  ...props
}) => {
  const getClassName = () => {
    const baseClass = variant === 'primary' ? 'common-button' : '';
    return `${baseClass} ${className}`.trim();
  };

  return (
    <MuiButton
      {...props}
      className={getClassName()}
      disabled={disabled || loading}
      variant={variant === 'text' ? 'text' : 'contained'}
    >
      {loading ? '처리 중...' : children}
    </MuiButton>
  );
};
