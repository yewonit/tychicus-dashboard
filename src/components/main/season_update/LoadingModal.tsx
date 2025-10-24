import React from 'react';
import { Modal } from '../../ui';

interface LoadingModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 표시할 메시지 */
  message?: string;
}

/**
 * 로딩 표시 모달
 * 작업 진행 중일 때 간단한 로딩 표시
 */
const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, message = '처리 중...' }) => {
  return (
    <Modal isOpen={isOpen} title='잠시만 기다려주세요' onClose={() => {}} size='medium'>
      <div className='loading-modal-content'>
        <div className='loading-spinner-large' />
        <p className='loading-message'>{message}</p>
      </div>
    </Modal>
  );
};

export default LoadingModal;
