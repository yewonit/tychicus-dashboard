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
            <strong>반드시 첫번째 행, 첫번째 열부터 컬럼명이 오게 해주세요.</strong>
            <br />
            <span className='guide-detail'>
              허용되는 컬럼명: <code>국, 그룹, 순, 이름, 구분, 번호, 직분, 기수</code>
            </span>
          </div>
        </li>
        <li className='upload-guide-item'>
          <span className='guide-number'>2</span>
          <div className='guide-content'>
            <strong>컬럼명은 중복되지 않아야 합니다!</strong>
          </div>
        </li>
        <li className='upload-guide-item'>
          <span className='guide-number'>3</span>
          <div className='guide-content'>
            <strong>병합되어 있는 셀이 없어야 합니다!</strong>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default UploadGuide;
