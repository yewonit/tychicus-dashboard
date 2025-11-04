import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutoSave, useSeasonData } from '../../../hooks';
import { applySeasonUpdate, fetchAllUsers } from '../../../services/seasonUpdateService';
import { SheetData } from '../../../types';
import { convertExcelToJson, convertToSeasonUpdateData, syncExcelDataWithUserData } from '../../../utils';
import { EditableDataTable, FileUpload } from '../../ui';
import ActionButtons from './ActionButtons';
import ApplyModal from './ApplyModal';
import CompletionModal from './CompletionModal';
import LoadingModal from './LoadingModal';
import ProgressModal from './ProgressModal';
import SeasonDataHeader from './SeasonDataHeader';
import SyncModal from './SyncModal';

const SeasonUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { data: savedData, saveData, clearData } = useSeasonData();

  // 편집 중인 데이터 (자동 저장 전)
  const [excelData, setExcelData] = useState<SheetData[] | null>(savedData);

  // 자동 저장 기능
  const { isSaving, lastSavedTime, hasUnsavedChanges, saveNow, resetSaveState } = useAutoSave(excelData, {
    onSave: saveData,
    delay: 3000, // 3초 후 자동 저장
    enabled: true,
  });

  // UI 상태 관리
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgressStep, setSyncProgressStep] = useState(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplyComplete, setIsApplyComplete] = useState(false);
  const [errorRows, setErrorRows] = useState<Set<string>>(new Set());

  // savedData 변경 시 excelData 동기화 (localStorage에서 로드될 때)
  React.useEffect(() => {
    if (savedData !== excelData) {
      setExcelData(savedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData]);

  /**
   * 엑셀 파일 선택 핸들러
   * 파일을 JSON으로 변환하고 저장
   */
  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setIsConverting(true);
    setErrorRows(new Set()); // 새 파일 업로드 시 에러 행 초기화

    try {
      const sheets = await convertExcelToJson(file, { minLoadingTime: 500 });
      setExcelData(sheets);
      saveData(sheets); // 즉시 저장
      resetSaveState(); // 저장 상태 초기화
      setIsConverting(false);
    } catch (error) {
      setIsConverting(false);
      alert(error instanceof Error ? error.message : '엑셀 파일 변환 중 오류가 발생했습니다.');
    }
  };

  /**
   * 데이터 편집 핸들러
   * 사용자가 테이블 데이터를 수정할 때 호출 (자동 저장됨)
   */
  const handleDataChange = (updatedData: SheetData[]) => {
    setExcelData(updatedData);
    // 자동 저장은 useAutoSave 훅이 처리
  };

  /**
   * 수동 저장 핸들러
   */
  const handleManualSave = () => {
    try {
      saveNow();
      alert('저장되었습니다.');
    } catch (error) {
      alert(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.');
    }
  };

  /**
   * 서버 데이터와 동기화
   * 이름을 기준으로 서버에서 최신 정보를 가져와 빈칸 채우기
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
      // 1단계: 서버에서 전체 유저 데이터 가져오기
      const allUsers = await fetchAllUsers();

      // 2단계: 데이터 적용
      setSyncProgressStep(2);
      await new Promise(resolve => setTimeout(resolve, 800));

      // 서버 데이터로 엑셀 데이터 업데이트 및 에러 행 수집
      const { updatedData, errorRows: newErrorRows } = syncExcelDataWithUserData(excelData, allUsers);

      setExcelData(updatedData);
      saveData(updatedData); // 동기화 후 즉시 저장
      setErrorRows(newErrorRows);

      // 완료 후 모달 자동 닫기
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgressStep(0);

        // 에러 행이 있으면 알림
        if (newErrorRows.size > 0) {
          alert(
            `동기화 완료! ${newErrorRows.size}개의 행에서 동명이인이 발견되어 '구분' 확인이 필요합니다. (빨간색 표시)`
          );
        } else {
          alert('데이터 동기화가 완료되었습니다.');
        }
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
      // 엑셀 데이터를 API 형식으로 변환 (시트 이름 오름차순으로 정렬)
      const memberData = convertToSeasonUpdateData(excelData);

      const payload = {
        data: memberData,
      };

      // API 요청
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
   * 데이터 초기화 (기존 데이터 삭제 및 업로드 화면으로 복귀)
   */
  const handleResetData = () => {
    if (
      window.confirm(
        '현재 데이터를 삭제하고 새로운 파일을 업로드하시겠습니까?\n저장되지 않은 변경사항이 있다면 삭제됩니다.'
      )
    ) {
      clearData();
      setExcelData(null);
      setUploadedFile(null);
      setErrorRows(new Set());
      resetSaveState();
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
              <SeasonDataHeader
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                lastSavedTime={lastSavedTime}
                onSave={handleManualSave}
                onReset={handleResetData}
              />

              <ActionButtons
                excelData={excelData}
                hasUnsavedChanges={hasUnsavedChanges}
                onSync={() => setIsSyncModalOpen(true)}
                saveNow={saveNow}
              />

              <EditableDataTable data={excelData} onChange={handleDataChange} errorRows={errorRows} />
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
