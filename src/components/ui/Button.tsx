import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import React from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /** 버튼 스타일 변형 */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'text';
  /** 크기 */
  size?: 'small' | 'default';
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
  size = 'default',
  className = '',
  loading,
  disabled,
  children,
  ...props
}) => {
  const getClassName = () => {
    let classes = [];

    // DUGIGO 버튼 베이스 클래스
    classes.push('dugigo-button');

    // 변형별 클래스
    switch (variant) {
      case 'primary':
        classes.push('dugigo-button-primary');
        break;
      case 'secondary':
        classes.push('dugigo-button-secondary');
        break;
      case 'success':
        classes.push('dugigo-button-success');
        break;
      case 'danger':
        classes.push('dugigo-button-danger');
        break;
      case 'outline':
        classes.push('dugigo-button-outline');
        break;
      case 'text':
        classes.push('dugigo-button-text');
        break;
      default:
        classes.push('dugigo-button-primary');
    }

    // 크기별 클래스
    if (size === 'small') {
      classes.push('dugigo-button-small');
    }

    return `${classes.join(' ')} ${className}`.trim();
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
