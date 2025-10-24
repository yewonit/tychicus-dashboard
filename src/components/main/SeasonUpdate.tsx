import React, { useState } from 'react';

/**
 * 회기 변경 관리 컴포넌트
 * 청년회 회기를 변경하고 관리하는 화면
 */
const SeasonUpdate: React.FC = () => {
  const [currentSeason, setCurrentSeason] = useState('2025-1'); // TODO: API에서 현재 회기 정보 가져오기

  // TODO: 회기 변경 로직 구현
  const handleSeasonUpdate = () => {
    console.log('회기 변경 처리');
  };

  return (
    <div className='season-update-container'>
      <div className='season-update-header'>
        <h1>회기 변경 관리</h1>
        <p>청년회 회기를 변경하고 관리하세요</p>
      </div>

      <div className='season-update-content'>
        <div className='current-season-section'>
          <h2>현재 회기</h2>
          <div className='current-season-display'>
            <span className='season-label'>현재 회기:</span>
            <span className='season-value'>{currentSeason}</span>
          </div>
        </div>

        {/* TODO: 회기 변경 폼 구현 */}
        <div className='season-change-section'>
          <h2>회기 변경</h2>
          <p className='section-description'>새로운 회기로 변경하시겠습니까?</p>
          {/* 회기 변경 폼 추가 예정 */}
        </div>

        {/* TODO: 회기 이력 테이블 구현 */}
        <div className='season-history-section'>
          <h2>회기 변경 이력</h2>
          <p className='section-description'>과거 회기 변경 기록을 확인할 수 있습니다.</p>
          {/* 회기 이력 테이블 추가 예정 */}
        </div>
      </div>
    </div>
  );
};

export default SeasonUpdate;
