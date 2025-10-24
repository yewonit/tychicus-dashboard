import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileUpload } from '../ui';

/**
 * 회기 변경 관리 컴포넌트
 * 청년회 회기를 변경하고 관리하는 화면
 */
const SeasonUpdate: React.FC = () => {
  const [currentSeason] = useState('2025-1'); // TODO: API에서 현재 회기 정보 가져오기, setCurrentSeason 추후 사용 예정
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any>(null); // TODO: 타입 정의

  /**
   * 엑셀 파일을 JSON으로 변환
   */
  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // sheets 리스트 안에 object(row) 리스트 형태로 변환
      const sheets = workbook.SheetNames.map(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        return {
          sheetName,
          data: jsonData,
        };
      });

      const jsonResult = { sheets };
      setExcelData(jsonResult);

      // Local Storage에 저장
      localStorage.setItem('seasonUpdateData', JSON.stringify(jsonResult));
    } catch (error) {
      console.error('엑셀 파일 변환 오류:', error);
      alert('엑셀 파일을 읽는 중 오류가 발생했습니다.');
    }
  };

  // TODO: 회기 변경 로직 구현
  const handleSeasonUpdate = () => {
    // eslint-disable-next-line no-console
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

        {/* 1단계: 엑셀 파일 업로드 */}
        <div className='season-change-section'>
          <h2>1. 엑셀 파일 업로드</h2>
          <p className='section-description'>회기 변경에 사용할 엑셀 파일을 업로드하세요.</p>
          <FileUpload onFileSelect={handleFileSelect} />
          {uploadedFile && (
            <div className='file-info'>
              <p>
                ✅ 업로드된 파일: <strong>{uploadedFile.name}</strong>
              </p>
            </div>
          )}
        </div>

        {/* TODO: 2단계 - 데이터 수정 표 */}
        {excelData && (
          <div className='season-data-section'>
            <h2>2. 데이터 확인 및 수정</h2>
            <p className='section-description'>업로드된 데이터를 확인하고 수정할 수 있습니다.</p>
            {/* TODO: 데이터 테이블 컴포넌트 추가 */}
            <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', overflow: 'auto' }}>
              {JSON.stringify(excelData, null, 2)}
            </pre>
          </div>
        )}

        {/* TODO: 3단계 - 회기 변경 적용 */}
        {excelData && (
          <div className='season-apply-section'>
            <h2>3. 회기 변경 적용</h2>
            <p className='section-description'>데이터를 확인한 후 회기 변경을 적용하세요.</p>
            <button className='apply-button' onClick={handleSeasonUpdate}>
              회기 변경 적용
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonUpdate;
