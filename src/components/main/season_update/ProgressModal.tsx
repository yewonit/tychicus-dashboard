import React from 'react';
import { Modal } from '../../ui';

interface ProgressModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 현재 진행 단계 (1: 데이터 가져오는 중, 2: 데이터 적용 중) */
  currentStep: number;
  /** 전체 단계 수 */
  totalSteps?: number;
}

/**
 * 진행 상황 표시 모달
 * 정보 동기화 등의 프로세스 진행 상황을 표시
 */
const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, currentStep, totalSteps = 2 }) => {
  const steps = [
    { step: 1, label: '데이터 가져오는 중...' },
    { step: 2, label: '데이터 적용 중...' },
  ];

  return (
    <Modal isOpen={isOpen} title='처리 중' onClose={() => {}} size='medium'>
      <div className='progress-modal-content'>
        <div className='progress-steps'>
          {steps.map(({ step, label }) => (
            <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
              <div className='progress-step-indicator'>
                {currentStep > step ? (
                  <span className='progress-step-check'>✓</span>
                ) : currentStep === step ? (
                  <div className='progress-spinner' />
                ) : (
                  <span className='progress-step-number'>{step}</span>
                )}
              </div>
              <div className='progress-step-label'>{label}</div>
            </div>
          ))}
        </div>

        <div className='progress-info'>
          <p className='progress-message'>
            잠시만 기다려주세요...
            <br />
            <span className='progress-note'>
              ({currentStep}/{totalSteps} 단계)
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ProgressModal;
