/**
 * 회기 변경 관리 주의사항 컴포넌트
 * 중요한 경고 메시지 표시
 */
import React from 'react';

/**
 * 주의사항 컴포넌트
 */
const WarningNotice: React.FC = () => {
  return (
    <div className='warning-notice-container'>
      <div className='warning-notice-header'>
        <span className='warning-notice-icon'>⚠️</span>
        <h3 className='warning-notice-title'>주의사항</h3>
      </div>
      <div className='warning-notice-content'>
        <p className='warning-notice-text'>
          새로운 회기가 시작된 후 <strong>'회기 변경 적용'</strong> 버튼을 누르면, 다음 회기 데이터를 만들어버려요 😭
        </p>
        <p className='warning-notice-contact'>12월 이후 생기는 수정사항은 개발팀에 문의해주세요!</p>
      </div>
    </div>
  );
};

export default WarningNotice;
