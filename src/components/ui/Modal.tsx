import React from 'react';

interface ModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 제목 */
  title?: string;
  /** 모달 내용 */
  children: React.ReactNode;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 모달 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 추가 클래스명 */
  className?: string;
}

/**
 * DUGIGO 모달 컴포넌트
 * 반투명 오버레이와 중앙 정렬된 카드 형태의 모달
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, size = 'medium', className = '' }) => {
  if (!isOpen) return null;

  const getModalClassName = () => {
    let classes = ['dugigo-modal-overlay'];
    return `${classes.join(' ')} ${className}`.trim();
  };

  const getContentClassName = () => {
    let classes = ['dugigo-modal-content'];
    classes.push(`dugigo-modal-${size}`);
    return classes.join(' ');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={getModalClassName()} onClick={handleOverlayClick}>
      <div className={getContentClassName()} onClick={e => e.stopPropagation()}>
        {title && (
          <div className='dugigo-modal-header'>
            <h3 className='dugigo-modal-title'>{title}</h3>
            <button className='dugigo-modal-close' onClick={onClose}>
              ×
            </button>
          </div>
        )}

        <div className='dugigo-modal-body'>{children}</div>
      </div>
    </div>
  );
};
