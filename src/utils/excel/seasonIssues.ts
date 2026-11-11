/**
 * 회기 변경 데이터에서 확인이 필요한 부분(매칭 실패 행, 형식이 이상한 칸)을 모읍니다.
 */
import { SheetData } from '../../types';
import { IssueLocation, SeasonIssues } from '../../types/seasonUpdate';
import { getCellWarning, isBlockingColumn } from './cellValidation';
import { isInternalField } from './excelFieldMapping';
import { getRowMatch, hasName } from './seasonMatching';

export function collectSeasonIssues(sheets: SheetData[] | null): SeasonIssues {
  const issues: SeasonIssues = {
    matchFailures: [],
    valueWarnings: [],
    blockingWarningCount: 0,
    unverifiedCount: 0,
    namelessCount: 0,
  };
  if (!sheets) return issues;

  sheets.forEach((sheet, sheetIndex) => {
    sheet.rows.forEach((row, rowIndex) => {
      if (hasName(row)) {
        const match = getRowMatch(row);
        if (!match) issues.unverifiedCount++;
        else if (match.status === 'failed') issues.matchFailures.push({ sheetIndex, rowIndex });
      } else {
        issues.namelessCount++;
      }

      Object.keys(row).forEach(column => {
        if (isInternalField(column) || getCellWarning(column, row[column], row) === null) return;
        const location: IssueLocation = { sheetIndex, rowIndex, column };
        issues.valueWarnings.push(location);
        if (isBlockingColumn(column)) issues.blockingWarningCount++;
      });
    });
  });

  return issues;
}

/** 회기 변경을 적용할 수 없는 상태인지 (매칭 실패·미동기화 행 또는 서버가 거절할 값이 남아 있음) */
export const hasBlockingIssues = (issues: SeasonIssues): boolean =>
  issues.matchFailures.length > 0 || issues.unverifiedCount > 0 || issues.blockingWarningCount > 0;
