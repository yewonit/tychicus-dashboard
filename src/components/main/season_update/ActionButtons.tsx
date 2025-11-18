/**
 * 액션 버튼 그룹 컴포넌트
 * 정보 동기화, 엑셀 다운로드 버튼 포함
 */
import React from 'react';
import { SheetData } from '../../../types';
import { ExcelDownloadButton } from '../../ui';

interface ActionButtonsProps {
  /** 엑셀 데이터 */
  excelData: SheetData[];
  /** 저장되지 않은 변경사항 여부 */
  hasUnsavedChanges: boolean;
  /** 정보 동기화 핸들러 */
  onSync: () => void;
  /** 수동 저장 함수 */
  saveNow: () => void;
}

/**
 * 액션 버튼 그룹
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ excelData, hasUnsavedChanges, onSync, saveNow }) => {
  /**
   * 엑셀 다운로드 전 처리
   */
  const handleBeforeDownload = (): boolean => {
    // 저장되지 않은 변경사항이 있으면 먼저 저장
    if (hasUnsavedChanges) {
      try {
        saveNow();
      } catch (error) {
        alert('저장 중 오류가 발생했습니다.');
        return false;
      }
    }
    return window.confirm('현재 데이터를 엑셀 파일로 다운로드하시겠습니까?');
  };

  return (
    <div className='action-buttons-wrapper'>
      <button className='sync-button' onClick={onSync}>
        🔄 정보 동기화
      </button>
      <ExcelDownloadButton
        data={excelData}
        fileName='season-update-data'
        buttonText='📥 엑셀 다운로드'
        className='excel-download-button'
        onBeforeDownload={handleBeforeDownload}
      />
    </div>
  );
};

export default ActionButtons;
