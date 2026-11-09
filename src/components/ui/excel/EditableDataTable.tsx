import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SheetData } from '../../../types';
import { getCellWarning } from '../../../utils/excel/cellValidation';
import { isInternalField } from '../../../utils/excel/excelFieldMapping';

/** 테이블에서 포커스할 위치 (nonce가 바뀔 때마다 다시 이동) */
export interface TableFocusTarget {
  sheetIndex: number;
  rowIndex: number;
  /** 없으면 행 전체(상태 칸)로 이동 */
  column?: string;
  nonce: number;
}

interface EditableDataTableProps {
  /** 시트 데이터 배열 */
  data: SheetData[];
  /** 데이터 변경 콜백 */
  onChange: (updatedData: SheetData[]) => void;
  /** 현재 시트 (지정하면 제어 컴포넌트로 동작) */
  activeSheetIndex?: number;
  /** 시트 탭 변경 콜백 */
  onActiveSheetChange?: (sheetIndex: number) => void;
  /** 이동·강조할 셀 */
  focusTarget?: TableFocusTarget | null;
  /** 셀을 고칠 때 행을 추가로 가공 (예: 이름이 바뀌면 매칭 결과 초기화) */
  onRowEdit?: (row: Record<string, any>, column: string, newValue: string) => Record<string, any>;
  /** 행 번호 옆에 고정 표시할 상태 칸 */
  renderRowStatus?: (row: Record<string, any>, rowIndex: number) => React.ReactNode;
  /** 상태 칸 헤더 */
  rowStatusHeader?: string;
  /** 행 클래스명 */
  getRowClassName?: (row: Record<string, any>, rowIndex: number) => string;
}

const FLASH_DURATION_MS = 1600;

/**
 * 엑셀 스타일의 편집 가능한 데이터 테이블 컴포넌트
 * - 시트 탭으로 여러 시트 전환
 * - 셀 편집 기능
 * - 형식 검증: 이상한 값은 노란 칸 + 마우스를 올리면 이유 표시
 */
const EditableDataTable: React.FC<EditableDataTableProps> = ({
  data,
  onChange,
  activeSheetIndex: controlledSheetIndex,
  onActiveSheetChange,
  focusTarget,
  onRowEdit,
  renderRowStatus,
  rowStatusHeader = '상태',
  getRowClassName,
}) => {
  const [internalSheetIndex, setInternalSheetIndex] = useState(0);
  const [flashKey, setFlashKey] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const requestedIndex = controlledSheetIndex ?? internalSheetIndex;
  const activeSheetIndex = Math.min(Math.max(requestedIndex, 0), Math.max((data?.length ?? 1) - 1, 0));
  const activeSheet = data?.[activeSheetIndex];

  // 모든 행의 컬럼 합집합 (첫 행에 없는 컬럼도 표시, 내부 필드는 숨김)
  const columns = useMemo(() => {
    const set = new Set<string>();
    activeSheet?.rows.forEach(row => Object.keys(row).forEach(key => !isInternalField(key) && set.add(key)));
    return [...set];
  }, [activeSheet]);

  // 확인이 필요한 위치로 스크롤하고 강조
  useEffect(() => {
    if (!focusTarget || focusTarget.sheetIndex !== activeSheetIndex || !wrapperRef.current) return;
    const key =
      focusTarget.column !== undefined ? `${focusTarget.rowIndex}:${focusTarget.column}` : `${focusTarget.rowIndex}`;
    const selector =
      focusTarget.column !== undefined
        ? `[data-cell-key="${CSS.escape(key)}"]`
        : `[data-row-status="${focusTarget.rowIndex}"]`;
    const element = wrapperRef.current.querySelector<HTMLElement>(selector);
    if (!element) return;

    element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    const focusable = element.querySelector<HTMLElement>('input, button');
    focusable?.focus({ preventScroll: true });
    setFlashKey(`${focusTarget.nonce}:${key}`);
    const timer = window.setTimeout(() => setFlashKey(null), FLASH_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [focusTarget, activeSheetIndex]);

  if (!data || data.length === 0 || !activeSheet) {
    return <div className='editable-table-empty'>데이터가 없습니다.</div>;
  }

  const isFlashing = (key: string) => flashKey !== null && flashKey.endsWith(`:${key}`);

  const handleSheetChange = (index: number) => {
    setInternalSheetIndex(index);
    onActiveSheetChange?.(index);
  };

  /**
   * 셀 값 변경 핸들러
   */
  const handleCellChange = (rowIndex: number, columnName: string, newValue: string) => {
    const updatedData = [...data];
    const updatedRows = [...updatedData[activeSheetIndex].rows];
    const editedRow = { ...updatedRows[rowIndex], [columnName]: newValue };
    updatedRows[rowIndex] = onRowEdit ? onRowEdit(editedRow, columnName, newValue) : editedRow;
    updatedData[activeSheetIndex] = {
      ...updatedData[activeSheetIndex],
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  return (
    <div className='editable-table-container'>
      {/* 데이터 테이블 */}
      <div className='editable-table-wrapper' ref={wrapperRef}>
        <table className='editable-table'>
          <thead>
            <tr>
              <th className='row-number-header'>#</th>
              {renderRowStatus && <th className='row-status-header'>{rowStatusHeader}</th>}
              {columns.map(column => (
                <th key={column} className='editable-table-header'>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeSheet.rows.map((row, rowIndex) => {
              const rowKey = `${rowIndex}`;
              return (
                <tr key={rowIndex} className={getRowClassName?.(row, rowIndex) ?? ''}>
                  <td className='row-number-cell'>{rowIndex + 1}</td>
                  {renderRowStatus && (
                    <td className={`row-status-cell ${isFlashing(rowKey) ? 'flash' : ''}`} data-row-status={rowIndex}>
                      {renderRowStatus(row, rowIndex)}
                    </td>
                  )}
                  {columns.map(column => {
                    const cellValue = row[column];
                    const warning = getCellWarning(column, cellValue, row);
                    const cellKey = `${rowIndex}:${column}`;
                    return (
                      <td
                        key={column}
                        className={`editable-table-cell ${warning ? 'invalid' : ''} ${isFlashing(cellKey) ? 'flash' : ''}`}
                        data-cell-key={cellKey}
                        title={warning ?? undefined}
                      >
                        <input
                          type='text'
                          value={cellValue ?? ''}
                          onChange={e => handleCellChange(rowIndex, column, e.target.value)}
                          className='editable-cell-input'
                          aria-invalid={warning ? true : undefined}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 시트 탭 */}
      <div className='sheet-tabs-container'>
        {data.map((sheet, index) => (
          <button
            key={index}
            className={`sheet-tab ${index === activeSheetIndex ? 'active' : ''}`}
            onClick={() => handleSheetChange(index)}
          >
            {sheet.sheetName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EditableDataTable;
