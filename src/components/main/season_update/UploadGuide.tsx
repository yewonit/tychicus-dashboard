/**
 * 엑셀 파일 업로드 안내 컴포넌트
 * 업로드 전 주의사항을 표시
 */
import React from 'react';

/**
 * 엑셀 업로드 가이드 컴포넌트
 */
const UploadGuide: React.FC = () => {
  return (
    <div className='upload-guide-container'>
      <div className='upload-guide-header'>
        <span className='upload-guide-icon'>💡</span>
        <h3 className='upload-guide-title'>엑셀 파일 업로드 전에 다음 안내 사항을 확인해주세요!</h3>
      </div>
      <ul className='upload-guide-list'>
        <li className='upload-guide-item'>
          <span className='guide-number'>1</span>
          <div className='guide-content'>
            <strong>국에서 받은 원본 양식을 그대로 올려도 돼요.</strong>
            <br />
            <span className='guide-detail'>
              위쪽의 빈 행이나 병합된 제목(예: <code>2026년 소속</code>, <code>2025년 소속</code>)은 자동으로 인식해요.
              연도가 큰 소속은 다음 회기(<code>국, 그룹, 순</code>), 작은 소속은 재매칭에 쓰는 현재 회기(
              <code>현재 국, 현재 그룹, 현재 순</code>)로 읽어요.
            </span>
          </div>
        </li>
        <li className='upload-guide-item'>
          <span className='guide-number'>2</span>
          <div className='guide-content'>
            <strong>컬럼명 행에 이름 컬럼이 있어야 해요.</strong>
            <br />
            <span className='guide-detail'>
              인식하는 컬럼명: <code>국, 그룹, 순, 이름, 구분, 직분(예: 2026년 직분), 기수, 번호(연락처)</code>
            </span>
          </div>
        </li>
        <li className='upload-guide-item'>
          <span className='guide-number'>3</span>
          <div className='guide-content'>
            <strong>연락처·기수 형식은 자동으로 정리돼요.</strong>
            <br />
            <span className='guide-detail'>
              <code>010 1234 5678</code>, <code>1996</code>처럼 형식만 다른 값은 맞춰 드리고, 판단하기 어려운 값은 노란
              칸으로 표시해요.
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default UploadGuide;
