import React from 'react';
import { Modal } from '../../ui';

interface SyncModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 동기화 확인 핸들러 */
  onConfirm: () => void;
}

/**
 * 정보 동기화 확인 모달
 * 서버 데이터와 엑셀 데이터를 동기화하는 확인 모달
 */
const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} title='정보 동기화' onClose={onClose} size='medium'>
      <div className='sync-modal-content'>
        <p className='sync-modal-message'>
          기존 인원 정보를 가져와 엑셀의 각 행을 기존 인원과 매칭할까요?
          <br />
          <span className='sync-modal-note'>
            (이름으로 찾고, 동명이인은 연락처 → 기수 → 구분 → 현재 소속 순서로 구분해요. 빈 구분·연락처·기수는 기존
            정보로 채워져요.)
          </span>
        </p>
        <div className='sync-modal-buttons'>
          <button className='sync-modal-cancel-button' onClick={onClose}>
            취소
          </button>
          <button className='sync-modal-confirm-button' onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SyncModal;
