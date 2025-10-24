import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeasonData } from '../../../hooks';
import { applySeasonUpdate, syncWithServer } from '../../../services/seasonUpdateService';
import { SheetData } from '../../../types';
import { convertExcelToJson, extractSyncIdentifiers, syncExcelDataWithServer } from '../../../utils';
import { EditableDataTable, ExcelDownloadButton, FileUpload } from '../../ui';
import ApplyModal from './ApplyModal';
import CompletionModal from './CompletionModal';
import LoadingModal from './LoadingModal';
import ProgressModal from './ProgressModal';
import SyncModal from './SyncModal';

const SeasonUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { data: excelData, saveData, clearData } = useSeasonData();

  // UI 상태 관리
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgressStep, setSyncProgressStep] = useState(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplyComplete, setIsApplyComplete] = useState(false);

  /**
   * 엑셀 파일 선택 핸들러
   * 파일을 JSON으로 변환하고 저장
   */
  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setIsConverting(true);

    try {
      const sheets = await convertExcelToJson(file, { minLoadingTime: 500 });
      saveData(sheets);
      setIsConverting(false);
    } catch (error) {
      setIsConverting(false);
      alert(error instanceof Error ? error.message : '엑셀 파일 변환 중 오류가 발생했습니다.');
    }
  };

  /**
   * 데이터 편집 핸들러
   * 사용자가 테이블 데이터를 수정할 때 호출
   */
  const handleDataChange = (updatedData: SheetData[]) => {
    saveData(updatedData);
  };

  /**
   * 서버 데이터와 동기화
   * 이름과 전화번호를 기준으로 서버에서 최신 정보를 가져와 업데이트
   */
  const handleSyncWithServer = async () => {
    if (!excelData || excelData.length === 0) {
      alert('동기화할 데이터가 없습니다.');
      return;
    }

    // 확인 모달 닫고 진행 모달 시작
    setIsSyncModalOpen(false);
    setIsSyncing(true);
    setSyncProgressStep(1);

    try {
      // 1단계: 동기화용 식별자 추출
      const identifiers = extractSyncIdentifiers(excelData);

      if (identifiers.length === 0) {
        alert('동기화할 수 있는 데이터가 없습니다. (이름, 전화번호 필수)');
        setIsSyncing(false);
        setSyncProgressStep(0);
        return;
      }

      // 서버에서 데이터 가져오기
      const serverData = await syncWithServer(identifiers);

      // 2단계: 서버 데이터로 엑셀 데이터 업데이트
      setSyncProgressStep(2);
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedExcelData = syncExcelDataWithServer(excelData, serverData);
      saveData(updatedExcelData);

      // 완료 후 모달 자동 닫기
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgressStep(0);
        alert(`${identifiers.length}건의 데이터가 동기화되었습니다.`);
      }, 500);
    } catch (error) {
      console.error('서버 동기화 오류:', error);
      alert(error instanceof Error ? error.message : '서버 동기화 중 오류가 발생했습니다.');
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

    // 확인 모달 닫고 로딩 모달 시작
    setIsApplyModalOpen(false);
    setIsApplying(true);

    try {
      const payload = {
        sheets: excelData,
        timestamp: new Date().toISOString(),
      };

      await applySeasonUpdate(payload);

      // 로딩 모달 닫고 완료 모달 표시
      setIsApplying(false);
      setIsApplyComplete(true);
    } catch (error) {
      console.error('회기 변경 적용 오류:', error);
      setIsApplying(false);
      alert(error instanceof Error ? error.message : '회기 변경 적용 중 오류가 발생했습니다.');
    }
  };

  /**
   * 회기 변경 완료 후 대시보드로 이동
   */
  const handleApplyComplete = () => {
    clearData();
    navigate('/main/dashboard');
  };

  /**
   * 새 파일 업로드 (기존 데이터 초기화)
   */
  const handleResetData = () => {
    if (window.confirm('현재 데이터를 삭제하고 새로운 파일을 업로드하시겠습니까?')) {
      clearData();
      setUploadedFile(null);
    }
  };

  return (
    <div className='season-update-container'>
      <div className='season-update-header'>
        <h1>회기 변경 관리</h1>
      </div>

      <div className='season-update-content'>
        {!excelData ? (
          // 데이터가 없을 때: 엑셀 파일 업로드 화면
          <div className='season-change-section'>
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
                <button className='reset-button' onClick={handleResetData}>
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
                />
              </div>

              <EditableDataTable data={excelData} onChange={handleDataChange} />
            </div>

            <div className='season-apply-section'>
              <button className='apply-button' onClick={() => setIsApplyModalOpen(true)}>
                회기 변경 적용
              </button>
            </div>
          </>
        )}
      </div>

      {/* 정보 동기화 확인 모달 */}
      <SyncModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} onConfirm={handleSyncWithServer} />

      {/* 정보 동기화 진행 상황 모달 */}
      <ProgressModal isOpen={isSyncing} currentStep={syncProgressStep} totalSteps={2} />

      {/* 회기 변경 적용 확인 모달 */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        isApplying={false}
        excelData={excelData}
        onClose={() => setIsApplyModalOpen(false)}
        onConfirm={handleSeasonUpdate}
      />

      {/* 엑셀 변환 중 로딩 모달 */}
      <LoadingModal isOpen={isConverting} message='데이터 변환 중...' />

      {/* 회기 변경 적용 중 로딩 모달 */}
      <LoadingModal isOpen={isApplying} message='회기 변경 적용 중...' />

      {/* 회기 변경 완료 모달 */}
      <CompletionModal
        isOpen={isApplyComplete}
        title='회기 변경 완료'
        message='회기 변경이 성공적으로 적용되었습니다.'
        confirmButtonText='대시보드로 이동'
        onConfirm={handleApplyComplete}
      />
    </div>
  );
};

export default SeasonUpdate;
