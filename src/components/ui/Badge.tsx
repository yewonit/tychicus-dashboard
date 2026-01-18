import React from 'react';

interface BadgeProps {
  /** 배지 내용 */
  children: React.ReactNode;
  /** 배지 변형 */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  /** 크기 */
  size?: 'small' | 'default' | 'large';
  /** 추가 클래스명 */
  className?: string;
}

/**
 * DUGIGO 배지 컴포넌트
 * 상태/카테고리 표시용 라운드 배지
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'default', className = '' }) => {
  const getClassName = () => {
    let classes = ['dugigo-badge'];

    // 변형별 클래스
    classes.push(`dugigo-badge-${variant}`);

    // 크기별 클래스
    if (size !== 'default') {
      classes.push(`dugigo-badge-${size}`);
    }

    return `${classes.join(' ')} ${className}`.trim();
  };

  return <span className={getClassName()}>{children}</span>;
};
