import React, { useState } from 'react';

/**
 * DUGIGO 모바일 접근 제한 오버레이
 * 767px 이하에서 표시되며, 사용자가 선택적으로 우회할 수 있음
 */
export const MobileRestrictionOverlay: React.FC = () => {
  const [allowMobile, setAllowMobile] = useState(() => {
    return localStorage.getItem('allowMobileAccess') === 'true';
  });

  const handleAllowMobile = () => {
    localStorage.setItem('allowMobileAccess', 'true');
    setAllowMobile(true);
  };

  return (
    <div className={`mobile-restriction-overlay ${allowMobile ? 'allow-mobile' : ''}`}>
      <div className='mobile-restriction-content'>
        <h2 className='mobile-restriction-title'>태블릿 이상 권장</h2>
        <p className='mobile-restriction-message'>
          이 애플리케이션은 데이터 관리 및 분석을 위해 설계되어 태블릿 이상의 화면에서 최적화되어 있습니다.
          <br />
          <br />
          더 나은 사용 경험을 위해 태블릿이나 데스크톱에서 접속해 주세요.
        </p>
        <button className='mobile-restriction-button' onClick={handleAllowMobile}>
          모바일에서 계속 사용하기
        </button>
      </div>
    </div>
  );
};
