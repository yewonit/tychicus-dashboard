import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { SheetData } from '../../../types';
import { EXCEL_TO_API_FIELD_MAPPING, SYNC_IDENTIFIER_FIELDS } from '../../../utils/excelFieldMapping';
import { EditableDataTable, ExcelDownloadButton, FileUpload } from '../../ui';
import ApplyModal from './ApplyModal';
import ProgressModal from './ProgressModal';
import SyncModal from './SyncModal';

/**
 * 회기 변경 관리 컴포넌트
 * 청년회 회기를 변경하고 관리하는 화면
 */
const SeasonUpdate: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<SheetData[] | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgressStep, setSyncProgressStep] = useState(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  /**
   * 컴포넌트 마운트 시 localStorage에서 데이터 불러오기
   */
  useEffect(() => {
    const savedData = localStorage.getItem('seasonUpdateData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as SheetData[];
        setExcelData(parsedData);
      } catch (error) {
        console.error('저장된 데이터 파싱 오류:', error);
        // 파싱 실패 시 localStorage 클리어
        localStorage.removeItem('seasonUpdateData');
      }
    }
  }, []);

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

    // 확인 모달 닫고 진행 모달 시작
    setIsSyncModalOpen(false);
    setIsSyncing(true);
    setSyncProgressStep(1); // 1단계: 데이터 가져오는 중

    try {
      // 1단계: 모든 시트의 데이터에서 이름과 전화번호 추출
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
        setSyncProgressStep(0);
        return;
      }

      // TODO: 서버에 동기화 요청
      // const response = await axiosClient.post('/api/members/sync', identifiers);
      // const serverData = response.data;

      // 임시: 서버 요청 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 임시 응답 데이터 (실제로는 서버에서 받아옴)
      const serverData = identifiers.map(id => ({
        name: id.name,
        phoneNumber: id.phone,
        email: `${id.name}@example.com`,
        genderType: 'M',
        // ... 기타 서버에서 받아온 최신 정보
      }));

      // 2단계: 서버 데이터로 엑셀 데이터 업데이트
      setSyncProgressStep(2); // 2단계: 데이터 적용 중

      // 임시: 데이터 적용 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 800));

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

      // 완료 후 모달 자동 닫기
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgressStep(0);
        alert(`${identifiers.length}건의 데이터가 동기화되었습니다.`);
      }, 500);
    } catch (error) {
      console.error('서버 동기화 오류:', error);
      alert('서버 동기화 중 오류가 발생했습니다.');
      setIsSyncing(false);
      setSyncProgressStep(0);
    }
  };

  /**
   * 회기 변경 적용
   * 현재 엑셀 데이터를 백엔드로 전송하여 새로운 회기 정보 생성/업데이트
   */
  const handleSeasonUpdate = async () => {
    if (!excelData || excelData.length === 0) {
      alert('적용할 데이터가 없습니다.');
      return;
    }

    setIsApplying(true);

    try {
      // JSON 데이터 준비
      const payload = {
        sheets: excelData,
        timestamp: new Date().toISOString(),
      };

      // TODO: 백엔드 API 호출
      // 대용량 JSON 전송을 위한 설정
      // - maxContentLength: Infinity
      // - maxBodyLength: Infinity
      // - timeout: 60000 (60초)
      /*
      const response = await axiosClient.post('/api/season/update', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 60000, // 60초
      });

      if (response.status === 200) {
        alert('회기 변경이 성공적으로 적용되었습니다.');
        // 성공 후 처리 (예: 페이지 이동, 데이터 초기화 등)
      }
      */

      // 임시: 성공 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      // eslint-disable-next-line no-console
      console.log('회기 변경 적용 데이터:', payload);
      alert(
        `회기 변경이 성공적으로 적용되었습니다.\n(총 ${excelData.length}개 시트, ${excelData.reduce((sum, sheet) => sum + sheet.rows.length, 0)}개 행)`
      );

      setIsApplyModalOpen(false);
    } catch (error) {
      console.error('회기 변경 적용 오류:', error);
      alert('회기 변경 적용 중 오류가 발생했습니다.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className='season-update-container'>
      <div className='season-update-header'>
        <h1>회기 변경 관리</h1>
        <p>청년회 회기를 변경하고 관리하세요</p>
      </div>

      <div className='season-update-content'>
        {!excelData ? (
          // 데이터가 없을 때: 엑셀 파일 업로드 화면
          <div className='season-change-section'>
            <h2>엑셀 파일 업로드</h2>
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
        ) : (
          // 데이터가 있을 때: 편집 화면
          <>
            <div className='season-data-section'>
              <div className='season-data-header'>
                <div>
                  <h2>데이터 확인 및 수정</h2>
                  <p className='section-description'>업로드된 데이터를 확인하고 수정할 수 있습니다.</p>
                </div>
                <button
                  className='reset-button'
                  onClick={() => {
                    if (window.confirm('현재 데이터를 삭제하고 새로운 파일을 업로드하시겠습니까?')) {
                      setExcelData(null);
                      setUploadedFile(null);
                      localStorage.removeItem('seasonUpdateData');
                    }
                  }}
                >
                  🔄 새 파일 업로드
                </button>
              </div>

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
                    return window.confirm('현재 데이터를 엑셀 파일로 다운로드하시겠습니까?');
                  }}
                  onAfterDownload={() => {
                    alert('엑셀 파일이 다운로드되었습니다.');
                  }}
                />
              </div>

              <EditableDataTable
                data={excelData}
                onChange={updatedData => {
                  setExcelData(updatedData);
                  localStorage.setItem('seasonUpdateData', JSON.stringify(updatedData));
                }}
              />
            </div>

            <div className='season-apply-section'>
              <h2>회기 변경 적용</h2>
              <p className='section-description'>데이터를 확인한 후 회기 변경을 적용하세요.</p>
              <button className='apply-button' onClick={() => setIsApplyModalOpen(true)}>
                회기 변경 적용
              </button>
            </div>
          </>
        )}
      </div>

      {/* 정보 동기화 확인 모달 */}
      <SyncModal
        isOpen={isSyncModalOpen}
        isSyncing={false}
        onClose={() => setIsSyncModalOpen(false)}
        onConfirm={handleSyncWithServer}
      />

      {/* 정보 동기화 진행 상황 모달 */}
      <ProgressModal isOpen={isSyncing} currentStep={syncProgressStep} totalSteps={2} />

      {/* 회기 변경 적용 확인 모달 */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        isApplying={isApplying}
        excelData={excelData}
        onClose={() => setIsApplyModalOpen(false)}
        onConfirm={handleSeasonUpdate}
      />
    </div>
  );
};

export default SeasonUpdate;
