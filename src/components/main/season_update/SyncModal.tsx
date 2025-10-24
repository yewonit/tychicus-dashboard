import React from 'react';
import { Modal } from '../../ui';

interface SyncModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 동기화 진행 상태 */
  isSyncing: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 동기화 확인 핸들러 */
  onConfirm: () => void;
}

/**
 * 정보 동기화 확인 모달
 * 서버 데이터와 엑셀 데이터를 동기화하는 확인 모달
 */
const SyncModal: React.FC<SyncModalProps> = ({ isOpen, isSyncing, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} title='정보 동기화' onClose={onClose} size='medium'>
      <div className='sync-modal-content'>
        <p className='sync-modal-message'>
          서버 데이터를 가져와 현재 엑셀을 업데이트 할까요?
          <br />
          <span className='sync-modal-note'>(이름, 전화번호 기준)</span>
        </p>
        <div className='sync-modal-buttons'>
          <button className='sync-modal-cancel-button' onClick={onClose} disabled={isSyncing}>
            취소
          </button>
          <button className='sync-modal-confirm-button' onClick={onConfirm} disabled={isSyncing}>
            {isSyncing ? '동기화 중...' : '확인'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SyncModal;
