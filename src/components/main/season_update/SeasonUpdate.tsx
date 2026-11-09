import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutoSave, useSeasonData } from '../../../hooks';
import { applySeasonUpdate, fetchAllUsers, fetchCurrentSeasonMembers } from '../../../services/seasonUpdateService';
import { SheetData } from '../../../types';
import { CurrentSeasonMember, IssueLocation, SeasonApplySummary, UserData } from '../../../types/seasonUpdate';
import {
  applyManualMatch,
  clearRowMatch,
  collectSeasonIssues,
  convertExcelToJson,
  convertToSeasonUpdateData,
  describeMatchFailure,
  getRowMatch,
  hasName,
  matchSheetsWithUsers,
} from '../../../utils';
import { EditableDataTable, FileUpload } from '../../ui';
import { TableFocusTarget } from '../../ui/excel/EditableDataTable';
import ActionButtons from './ActionButtons';
import ApplyModal from './ApplyModal';
import CompletionModal from './CompletionModal';
import IssueNavigator from './IssueNavigator';
import LoadingModal from './LoadingModal';
import ProgressModal from './ProgressModal';
import RematchModal from './RematchModal';
import SeasonDataHeader from './SeasonDataHeader';
import SyncModal from './SyncModal';
import UploadGuide from './UploadGuide';
import UsageGuide from './UsageGuide';
import WarningNotice from './WarningNotice';

/** 매칭에 필요한 기준 데이터 (서버 전체 유저 + 현재 회기 구성원) */
interface ReferenceData {
  allUsers: UserData[];
  currentMembers: CurrentSeasonMember[];
}

const loadReferenceData = async (): Promise<ReferenceData> => {
  const [allUsers, currentMembers] = await Promise.all([fetchAllUsers(), fetchCurrentSeasonMembers()]);
  return { allUsers, currentMembers };
};

const formatApplySummary = (summary: SeasonApplySummary | null): string => {
  if (!summary) return '회기 변경이 성공적으로 적용되었습니다.';
  const { organizations: o, userRoles: r } = summary;
  return [
    '회기 변경이 성공적으로 적용되었습니다.',
    `조직: 기존 ${o.reused}개 유지 · 새로 ${o.created}개 생성 · ${o.deleted}개 삭제`,
    `직분: ${r.kept}명 유지 · ${r.updated}명 변경 · ${r.created}명 추가 · ${r.deleted}명 제외`,
  ].join('\n');
};

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
  const [applyResultMessage, setApplyResultMessage] = useState<string | null>(null);

  // 테이블 이동/재매칭 상태
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [focusTarget, setFocusTarget] = useState<TableFocusTarget | null>(null);
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);
  const [isLoadingReference, setIsLoadingReference] = useState(false);
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [rematchTarget, setRematchTarget] = useState<{ sheetIndex: number; rowIndex: number } | null>(null);

  // savedData 변경 시 excelData 동기화 (localStorage에서 로드될 때)
  React.useEffect(() => {
    if (savedData !== excelData) {
      setExcelData(savedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedData]);

  const issues = useMemo(() => collectSeasonIssues(excelData), [excelData]);
  const hasMatchResult = useMemo(
    () => !!excelData?.some(sheet => sheet.rows.some(row => getRowMatch(row) !== undefined)),
    [excelData]
  );

  /** 표의 값을 바꾸고 바로 저장 */
  const updateData = useCallback(
    (updated: SheetData[]) => {
      setExcelData(updated);
      saveData(updated);
    },
    [saveData]
  );

  /**
   * 엑셀 파일 선택 핸들러
   * 파일을 JSON으로 변환하고 저장
   */
  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setIsConverting(true);

    try {
      const sheets = await convertExcelToJson(file, { minLoadingTime: 500 });
      setActiveSheetIndex(0);
      setFocusTarget(null);
      updateData(sheets); // 즉시 저장
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

  /** 이름을 고치면 다른 사람이 되므로 매칭 결과를 지움 (정보 동기화나 재매칭으로 다시 확인) */
  const handleRowEdit = useCallback(
    (row: Record<string, any>, column: string) => (column === '이름' ? clearRowMatch(row) : row),
    []
  );

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

  /** 확인이 필요한 위치로 이동 (다른 시트면 탭도 전환) */
  const handleNavigate = useCallback((location: IssueLocation) => {
    setActiveSheetIndex(location.sheetIndex);
    setFocusTarget({ ...location, nonce: Date.now() });
  }, []);

  /**
   * 서버 데이터와 동기화
   * 각 행을 기존 인원과 매칭하고 빈칸(구분/번호/기수)을 채움
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
      // 1단계: 서버에서 전체 유저 + 현재 회기 구성원 가져오기
      const reference = await loadReferenceData();
      setReferenceData(reference);
      setReferenceError(null);

      // 2단계: 매칭 적용
      setSyncProgressStep(2);
      await new Promise(resolve => setTimeout(resolve, 500));

      const { sheets, summary } = matchSheetsWithUsers(excelData, reference.allUsers, reference.currentMembers);
      updateData(sheets); // 동기화 후 즉시 저장
      resetSaveState();

      const nextIssues = collectSeasonIssues(sheets);

      // 완료 후 모달 자동 닫기
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgressStep(0);

        const lines = [
          '정보 동기화가 완료되었습니다.',
          `• 자동 매칭 ${summary.matched}명${summary.keptManual > 0 ? ` (직접 매칭 ${summary.keptManual}명 유지)` : ''}`,
          `• 매칭 실패 ${summary.failed}명`,
        ];
        if (summary.failed > 0) {
          lines.push('', "'남아있는 확인이 필요한 부분'의 🔴 매칭 실패 버튼으로 빨간 줄로 이동해 [재매칭]해 주세요.");
        }
        alert(lines.join('\n'));

        if (nextIssues.matchFailures.length > 0) handleNavigate(nextIssues.matchFailures[0]);
      }, 300);
    } catch (error) {
      // 보안: 에러 객체 전체를 출력하지 않고 메시지만 기록
      console.error('서버 동기화 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
      alert(error instanceof Error ? error.message : '서버 동기화 중 오류가 발생했습니다.');
      setIsSyncing(false);
      setSyncProgressStep(0);
    }
  };

  /** 재매칭 다이얼로그용 기준 데이터를 (없으면) 불러옴 — 새로고침 후 동기화 없이 재매칭할 때 */
  const ensureReferenceData = useCallback(async () => {
    if (referenceData || isLoadingReference) return;
    setIsLoadingReference(true);
    setReferenceError(null);
    try {
      setReferenceData(await loadReferenceData());
    } catch (error) {
      setReferenceError(error instanceof Error ? error.message : '기존 인원 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoadingReference(false);
    }
  }, [referenceData, isLoadingReference]);

  const openRematch = (sheetIndex: number, rowIndex: number) => {
    setRematchTarget({ sheetIndex, rowIndex });
    ensureReferenceData();
  };

  /** 재매칭 확정: 고른 사람으로 행을 연결 */
  const handleRematchConfirm = (user: UserData) => {
    if (!excelData || !rematchTarget) return;
    const { sheetIndex, rowIndex } = rematchTarget;
    const updated = excelData.map((sheet, si) =>
      si !== sheetIndex
        ? sheet
        : { ...sheet, rows: sheet.rows.map((row, ri) => (ri === rowIndex ? applyManualMatch(row, user) : row)) }
    );
    updateData(updated);
    setRematchTarget(null);
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
      // 엑셀 데이터를 API 형식으로 변환 (시트 이름 오름차순, 매칭된 행은 userId 포함)
      const summary = await applySeasonUpdate({ data: convertToSeasonUpdateData(excelData) });

      // 로딩 모달 닫고 완료 모달 표시
      setIsApplying(false);
      setApplyResultMessage(formatApplySummary(summary));
    } catch (error) {
      // 보안: 에러 객체 전체를 출력하지 않고 메시지만 기록
      console.error('회기 변경 적용 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
      setIsApplying(false);
      alert(error instanceof Error ? error.message : '회기 변경 적용 중 오류가 발생했습니다.');
    }
  };

  /** 적용 모달에서 첫 번째로 확인이 필요한 곳으로 이동 */
  const handleGoToFirstIssue = () => {
    setIsApplyModalOpen(false);
    const first = issues.matchFailures[0] ?? issues.valueWarnings[0];
    if (first) {
      handleNavigate(first);
      return;
    }
    if (issues.unverifiedCount > 0) setIsSyncModalOpen(true);
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
      setActiveSheetIndex(0);
      setFocusTarget(null);
      resetSaveState();
    }
  };

  /** 행 앞의 매칭 상태 칸 */
  const renderRowStatus = (row: Record<string, any>, rowIndex: number) => {
    if (!hasName(row)) return <span className='row-status-none'>-</span>;
    const match = getRowMatch(row);
    if (!match) {
      return (
        <span className='row-status-none' title='정보 동기화 전이에요'>
          미확인
        </span>
      );
    }
    if (match.status === 'failed') {
      return (
        <button
          type='button'
          className='rematch-button'
          title={describeMatchFailure(match.reason, match.candidateCount)}
          onClick={() => openRematch(activeSheetIndex, rowIndex)}
        >
          🔍 재매칭
        </button>
      );
    }
    return (
      <button
        type='button'
        className={`row-status-matched ${match.source}`}
        title={`${match.source === 'manual' ? '직접 매칭' : '자동 매칭'}됨 — 눌러서 다른 사람으로 바꿀 수 있어요`}
        onClick={() => openRematch(activeSheetIndex, rowIndex)}
      >
        ✓ {match.source === 'manual' ? '직접' : '매칭'}
      </button>
    );
  };

  const rematchRow =
    rematchTarget && excelData ? (excelData[rematchTarget.sheetIndex]?.rows[rematchTarget.rowIndex] ?? null) : null;

  return (
    <div className='season-update-container'>
      <div className='season-update-header'>
        <h1>회기 변경 관리</h1>
      </div>

      <div className='season-update-content'>
        {!excelData ? (
          // 데이터가 없을 때: 엑셀 파일 업로드 화면
          <div className='season-change-section'>
            <div className='guides-wrapper'>
              <UsageGuide />
              <UploadGuide />
            </div>
            <WarningNotice />
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

              <IssueNavigator issues={issues} hasMatchResult={hasMatchResult} onNavigate={handleNavigate} />

              <EditableDataTable
                data={excelData}
                onChange={handleDataChange}
                activeSheetIndex={activeSheetIndex}
                onActiveSheetChange={setActiveSheetIndex}
                focusTarget={focusTarget}
                onRowEdit={handleRowEdit}
                renderRowStatus={renderRowStatus}
                rowStatusHeader='매칭'
                getRowClassName={row => (getRowMatch(row)?.status === 'failed' ? 'error-row' : '')}
              />
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

      {/* 재매칭 모달 */}
      <RematchModal
        isOpen={rematchRow !== null}
        row={rematchRow}
        sheetName={rematchTarget && excelData ? (excelData[rematchTarget.sheetIndex]?.sheetName ?? '') : ''}
        rowNumber={(rematchTarget?.rowIndex ?? 0) + 1}
        allUsers={referenceData?.allUsers ?? null}
        currentMembers={referenceData?.currentMembers ?? null}
        isLoading={isLoadingReference}
        loadError={referenceError}
        onRetryLoad={ensureReferenceData}
        onClose={() => setRematchTarget(null)}
        onConfirm={handleRematchConfirm}
      />

      {/* 회기 변경 적용 확인 모달 */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        isApplying={false}
        excelData={excelData}
        issues={issues}
        onClose={() => setIsApplyModalOpen(false)}
        onConfirm={handleSeasonUpdate}
        onGoToIssue={handleGoToFirstIssue}
      />

      {/* 엑셀 변환 중 로딩 모달 */}
      <LoadingModal isOpen={isConverting} message='데이터 변환 중...' />

      {/* 회기 변경 적용 중 로딩 모달 */}
      <LoadingModal isOpen={isApplying} message='회기 변경 적용 중...' />

      {/* 회기 변경 완료 모달 */}
      <CompletionModal
        isOpen={applyResultMessage !== null}
        title='회기 변경 완료'
        message={applyResultMessage ?? ''}
        confirmButtonText='대시보드로 이동'
        onConfirm={handleApplyComplete}
      />
    </div>
  );
};

export default SeasonUpdate;
