import React from 'react';
import { SheetData } from '../../../types';
import { SeasonIssues } from '../../../types/seasonUpdate';
import { hasBlockingIssues } from '../../../utils/excel/seasonIssues';
import { Modal } from '../../ui';

interface ApplyModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 적용 진행 상태 */
  isApplying: boolean;
  /** 엑셀 데이터 */
  excelData: SheetData[] | null;
  /** 확인이 필요한 항목 */
  issues: SeasonIssues;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 적용 확인 핸들러 */
  onConfirm: () => void;
  /** 첫 번째로 확인이 필요한 곳으로 이동 */
  onGoToIssue: () => void;
}

/**
 * 회기 변경 적용 확인 모달
 * 매칭 실패·미동기화 행이나 서버가 거절할 값이 남아 있으면 적용을 막고 해당 위치로 안내합니다.
 */
const ApplyModal: React.FC<ApplyModalProps> = ({
  isOpen,
  isApplying,
  excelData,
  issues,
  onClose,
  onConfirm,
  onGoToIssue,
}) => {
  const blocked = hasBlockingIssues(issues);
  const rowCount = excelData?.reduce((sum, sheet) => sum + sheet.rows.length, 0) ?? 0;
  const targetCount = rowCount - issues.namelessCount;
  const optionalWarningCount = issues.valueWarnings.length - issues.blockingWarningCount;

  return (
    <Modal isOpen={isOpen} title='회기 변경 적용' onClose={() => !isApplying && onClose()} size='medium'>
      <div className='sync-modal-content'>
        {blocked ? (
          <>
            <p className='sync-modal-message'>아직 적용할 수 없어요. 아래 항목을 먼저 해결해 주세요.</p>
            <ul className='apply-issue-list'>
              {issues.unverifiedCount > 0 && (
                <li className='blocking'>
                  🔄 정보 동기화를 하지 않은 행 <strong>{issues.unverifiedCount}개</strong> — [정보 동기화]를 눌러 기존
                  인원과 매칭해 주세요.
                </li>
              )}
              {issues.matchFailures.length > 0 && (
                <li className='blocking'>
                  🔴 매칭 실패 <strong>{issues.matchFailures.length}행</strong> — 행 앞의 [재매칭]으로 해결해 주세요.
                </li>
              )}
              {issues.blockingWarningCount > 0 && (
                <li className='blocking'>
                  ⚠️ 국·그룹·순 값 오류 <strong>{issues.blockingWarningCount}칸</strong> — 서버에서 거절되므로 고쳐야
                  해요.
                </li>
              )}
            </ul>
          </>
        ) : (
          <p className='sync-modal-message'>
            현재 정보로 다음 회기 조직을 생성 / 업데이트 할까요?
            <br />
            <span className='sync-modal-note'>
              ({excelData?.length ?? 0}개 시트, {targetCount}명)
            </span>
          </p>
        )}

        {(optionalWarningCount > 0 || issues.namelessCount > 0) && (
          <ul className='apply-issue-list'>
            {optionalWarningCount > 0 && (
              <li>⚠️ 연락처·기수 등 확인 권장 {optionalWarningCount}칸 — 적용에는 영향이 없어요.</li>
            )}
            {issues.namelessCount > 0 && <li>이름이 비어 있는 {issues.namelessCount}개 행은 적용에서 제외돼요.</li>}
          </ul>
        )}

        <div className='sync-modal-buttons'>
          <button className='sync-modal-cancel-button' onClick={onClose} disabled={isApplying}>
            {blocked ? '닫기' : '취소'}
          </button>
          {blocked ? (
            <button className='sync-modal-confirm-button' onClick={onGoToIssue}>
              확인이 필요한 곳으로 이동
            </button>
          ) : (
            <button className='sync-modal-confirm-button' onClick={onConfirm} disabled={isApplying}>
              {isApplying ? '적용 중...' : '확인'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ApplyModal;
