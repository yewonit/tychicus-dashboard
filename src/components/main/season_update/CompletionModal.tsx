import React from 'react';
import { Modal } from '../../ui';

interface CompletionModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 표시할 제목 */
  title?: string;
  /** 표시할 메시지 */
  message?: string;
  /** 확인 버튼 텍스트 */
  confirmButtonText?: string;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void;
}

/**
 * 완료 표시 모달
 * 작업 완료 후 결과를 표시하고 다음 액션으로 이동
 */
const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  title = '완료',
  message = '작업이 완료되었습니다.',
  confirmButtonText = '확인',
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} title={title} onClose={() => {}} size='medium'>
      <div className='completion-modal-content'>
        <div className='completion-icon'>✓</div>
        <p className='completion-message'>{message}</p>
        <button className='completion-confirm-button' onClick={onConfirm}>
          {confirmButtonText}
        </button>
      </div>
    </Modal>
  );
};

export default CompletionModal;
