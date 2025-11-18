import React from 'react';
import { SheetData } from '../../../types';
import { Modal } from '../../ui';

interface ApplyModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 적용 진행 상태 */
  isApplying: boolean;
  /** 엑셀 데이터 */
  excelData: SheetData[] | null;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 적용 확인 핸들러 */
  onConfirm: () => void;
}

/**
 * 회기 변경 적용 확인 모달
 * 회기 변경을 백엔드에 적용하는 확인 모달
 */
const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, isApplying, excelData, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} title='회기 변경 적용' onClose={() => !isApplying && onClose()} size='medium'>
      <div className='sync-modal-content'>
        <p className='sync-modal-message'>
          현재 정보로 새로운 회기 정보를 생성 / 업데이트 할까요?
          {excelData && (
            <>
              <br />
              <span className='sync-modal-note'>
                ({excelData.length}개 시트, {excelData.reduce((sum, sheet) => sum + sheet.rows.length, 0)}개 행)
              </span>
            </>
          )}
        </p>
        <div className='sync-modal-buttons'>
          <button className='sync-modal-cancel-button' onClick={onClose} disabled={isApplying}>
            취소
          </button>
          <button className='sync-modal-confirm-button' onClick={onConfirm} disabled={isApplying}>
            {isApplying ? '적용 중...' : '확인'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyModal;
