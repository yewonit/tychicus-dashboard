/**
 * 회기 변경 관리 사용 가이드 컴포넌트
 * 단계별 사용 방법 안내
 */
import React from 'react';

/**
 * 사용 가이드 컴포넌트
 */
const UsageGuide: React.FC = () => {
  const steps = [
    { number: 1, text: '회기 변경 엑셀 파일 업로드하기', icon: '📤' },
    { number: 2, text: '정보 동기화로 기존 인원과 매칭하기', icon: '🔄' },
    { number: 3, text: "'남아있는 확인이 필요한 부분'에서 빨간 줄은 재매칭, 노란 칸은 수정하기", icon: '✏️' },
    { number: 4, text: '회기 변경 적용 버튼 누르기', icon: '✅' },
  ];

  return (
    <div className='usage-guide-container'>
      <div className='usage-guide-header'>
        <span className='usage-guide-icon'>📖</span>
        <h3 className='usage-guide-title'>사용 가이드</h3>
      </div>
      <div className='usage-guide-steps'>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className='usage-step'>
              <div className='usage-step-number'>{step.number}</div>
              <div className='usage-step-content'>
                <span className='usage-step-icon'>{step.icon}</span>
                <span className='usage-step-text'>{step.text}</span>
              </div>
            </div>
            {index < steps.length - 1 && <div className='usage-step-connector' />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UsageGuide;
