/**
 * 저장 상태 표시 컴포넌트
 * 자동 저장 상태를 시각적으로 표시
 */
import React from 'react';

interface SaveStatusProps {
  /** 저장 중 여부 */
  isSaving: boolean;
  /** 저장되지 않은 변경사항 여부 */
  hasUnsavedChanges: boolean;
  /** 마지막 저장 시간 */
  lastSavedTime: Date | null;
}

/**
 * 저장 상태 표시 컴포넌트
 */
const SaveStatus: React.FC<SaveStatusProps> = ({ isSaving, hasUnsavedChanges, lastSavedTime }) => {
  if (isSaving) {
    return (
      <div className='save-status'>
        <span className='status-saving'>💾 저장 중...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className='save-status'>
        <span className='status-unsaved'>⚠️ 저장되지 않은 변경사항</span>
      </div>
    );
  }

  if (lastSavedTime) {
    return (
      <div className='save-status'>
        <span className='status-saved'>
          ✅ 마지막 저장:{' '}
          {lastSavedTime.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      </div>
    );
  }

  return null;
};

export default SaveStatus;
