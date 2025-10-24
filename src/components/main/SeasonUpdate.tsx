import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { SheetData } from '../../types';
import { EXCEL_TO_API_FIELD_MAPPING, SYNC_IDENTIFIER_FIELDS } from '../../utils/excelFieldMapping';
import { ExcelDownloadButton, FileUpload, Modal } from '../ui';

/**
 * 회기 변경 관리 컴포넌트
 * 청년회 회기를 변경하고 관리하는 화면
 */
const SeasonUpdate: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<SheetData[] | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * 엑셀 파일을 JSON으로 변환
   */
  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // sheets 리스트 안에 object(row) 리스트 형태로 변환
      const sheets: SheetData[] = workbook.SheetNames.map(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];
        return {
          sheetName,
          rows: jsonData, // 'rows'로 키 이름 변경
        };
      });

      setExcelData(sheets); // sheets 배열을 직접 저장

      // Local Storage에 저장
      localStorage.setItem('seasonUpdateData', JSON.stringify(sheets));
    } catch (error) {
      console.error('엑셀 파일 변환 오류:', error);
      alert('엑셀 파일을 읽는 중 오류가 발생했습니다.');
    }
  };

  /**
   * 서버 데이터와 동기화
   * 이름과 전화번호를 기준으로 서버에서 최신 정보를 가져와 엑셀 데이터 업데이트
   */
  const handleSyncWithServer = async () => {
    if (!excelData || excelData.length === 0) {
      alert('동기화할 데이터가 없습니다.');
      return;
    }

    setIsSyncing(true);

    try {
      // 1. 모든 시트의 데이터에서 이름과 전화번호 추출
      const identifiers: Array<{ name: string; phone: string }> = [];

      excelData.forEach(sheet => {
        sheet.rows.forEach(row => {
          const name = row[SYNC_IDENTIFIER_FIELDS.name];
          const phone = row[SYNC_IDENTIFIER_FIELDS.phoneNumber];

          if (name && phone) {
            identifiers.push({ name, phone });
          }
        });
      });

      if (identifiers.length === 0) {
        alert('동기화할 수 있는 데이터가 없습니다. (이름, 전화번호 필수)');
        setIsSyncing(false);
        return;
      }

      // 2. TODO: 서버에 동기화 요청
      // const response = await axiosClient.post('/api/members/sync', identifiers);
      // const serverData = response.data;

      // 임시 응답 데이터 (실제로는 서버에서 받아옴)
      const serverData = identifiers.map(id => ({
        name: id.name,
        phoneNumber: id.phone,
        email: `${id.name}@example.com`,
        genderType: 'M',
        // ... 기타 서버에서 받아온 최신 정보
      }));

      // 3. 서버 데이터로 엑셀 데이터 업데이트
      const updatedExcelData = excelData.map(sheet => {
        const updatedRows = sheet.rows.map(row => {
          const name = row[SYNC_IDENTIFIER_FIELDS.name];
          const phone = row[SYNC_IDENTIFIER_FIELDS.phoneNumber];

          // 서버 데이터에서 해당 행과 일치하는 데이터 찾기
          const matchedServerData = serverData.find(
            serverRow => serverRow.name === name && serverRow.phoneNumber === phone
          );

          if (matchedServerData) {
            // 서버 데이터의 각 필드를 엑셀 컬럼명으로 매핑하여 업데이트
            const updatedRow = { ...row };

            Object.entries(matchedServerData).forEach(([apiField, value]) => {
              // API 필드명을 엑셀 컬럼명으로 변환
              const excelField = Object.entries(EXCEL_TO_API_FIELD_MAPPING).find(
                ([_, mappedApiField]) => mappedApiField === apiField
              )?.[0];

              if (excelField) {
                updatedRow[excelField] = value;
              }
            });

            return updatedRow;
          }

          return row;
        });

        return {
          ...sheet,
          rows: updatedRows,
        };
      });

      setExcelData(updatedExcelData);
      localStorage.setItem('seasonUpdateData', JSON.stringify(updatedExcelData));

      alert(`${identifiers.length}건의 데이터가 동기화되었습니다.`);
      setIsSyncModalOpen(false);
    } catch (error) {
      console.error('서버 동기화 오류:', error);
      alert('서버 동기화 중 오류가 발생했습니다.');
    } finally {
      setIsSyncing(false);
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

            {/* 엑셀 다운로드 및 동기화 버튼 */}
            <div className='action-buttons-wrapper'>
              <button className='sync-button' onClick={() => setIsSyncModalOpen(true)}>
                🔄 정보 동기화
              </button>
              <ExcelDownloadButton
                data={excelData}
                fileName='season-update-data'
                buttonText='📥 엑셀 다운로드'
                className='excel-download-button'
                onBeforeDownload={() => {
                  // 다운로드 전 확인
                  return window.confirm('현재 데이터를 엑셀 파일로 다운로드하시겠습니까?');
                }}
                onAfterDownload={() => {
                  alert('엑셀 파일이 다운로드되었습니다.');
                }}
              />
            </div>

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

      {/* 정보 동기화 확인 모달 */}
      <Modal isOpen={isSyncModalOpen} title='정보 동기화' onClose={() => setIsSyncModalOpen(false)} size='medium'>
        <div className='sync-modal-content'>
          <p className='sync-modal-message'>
            서버 데이터를 가져와 현재 엑셀을 업데이트 할까요?
            <br />
            <span className='sync-modal-note'>(이름, 전화번호 기준)</span>
          </p>
          <div className='sync-modal-buttons'>
            <button className='sync-modal-cancel-button' onClick={() => setIsSyncModalOpen(false)} disabled={isSyncing}>
              취소
            </button>
            <button className='sync-modal-confirm-button' onClick={handleSyncWithServer} disabled={isSyncing}>
              {isSyncing ? '동기화 중...' : '확인'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SeasonUpdate;
