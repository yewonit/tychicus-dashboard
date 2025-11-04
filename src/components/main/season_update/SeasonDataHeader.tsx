/**
 * 회기 데이터 편집 화면 헤더 컴포넌트
 * 저장 상태, 저장/초기화 버튼 포함
 */
import React from 'react';
import SaveStatus from './SaveStatus';

interface SeasonDataHeaderProps {
  /** 저장 중 여부 */
  isSaving: boolean;
  /** 저장되지 않은 변경사항 여부 */
  hasUnsavedChanges: boolean;
  /** 마지막 저장 시간 */
  lastSavedTime: Date | null;
  /** 수동 저장 핸들러 */
  onSave: () => void;
  /** 초기화 핸들러 */
  onReset: () => void;
}

/**
 * 회기 데이터 편집 화면 헤더
 */
const SeasonDataHeader: React.FC<SeasonDataHeaderProps> = ({
  isSaving,
  hasUnsavedChanges,
  lastSavedTime,
  onSave,
  onReset,
}) => {
  return (
    <div className='season-data-header'>
      <div className='header-left'>
        <SaveStatus isSaving={isSaving} hasUnsavedChanges={hasUnsavedChanges} lastSavedTime={lastSavedTime} />
      </div>
      <div className='header-right'>
        <button className='save-button' onClick={onSave} disabled={isSaving || !hasUnsavedChanges}>
          💾 저장
        </button>
        <button className='reset-button' onClick={onReset}>
          ❌ 초기화
        </button>
      </div>
    </div>
  );
};

export default SeasonDataHeader;
