import React, { useState } from 'react';
import { SheetData } from '../../types';
import { validateCellData } from '../../utils/cellValidation';

interface EditableDataTableProps {
  /** 시트 데이터 배열 */
  data: SheetData[];
  /** 데이터 변경 콜백 */
  onChange: (updatedData: SheetData[]) => void;
}

/**
 * 엑셀 스타일의 편집 가능한 데이터 테이블 컴포넌트
 * - 시트 탭으로 여러 시트 전환
 * - 셀 편집 기능
 * - 형식 검증 및 에러 하이라이트
 */
const EditableDataTable: React.FC<EditableDataTableProps> = ({ data, onChange }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  if (!data || data.length === 0) {
    return <div className='editable-table-empty'>데이터가 없습니다.</div>;
  }

  const activeSheet = data[activeSheetIndex];
  const columns = activeSheet.rows.length > 0 ? Object.keys(activeSheet.rows[0]) : [];

  /**
   * 셀 값 변경 핸들러
   */
  const handleCellChange = (rowIndex: number, columnName: string, newValue: string) => {
    const updatedData = [...data];
    const updatedRows = [...updatedData[activeSheetIndex].rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [columnName]: newValue,
    };
    updatedData[activeSheetIndex] = {
      ...updatedData[activeSheetIndex],
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * 셀 값 검증
   */
  const isCellValid = (columnName: string, value: any): boolean => {
    return validateCellData(columnName, value);
  };

  return (
    <div className='editable-table-container'>
      {/* 데이터 테이블 */}
      <div className='editable-table-wrapper'>
        <table className='editable-table'>
          <thead>
            <tr>
              <th className='row-number-header'>#</th>
              {columns.map((column, index) => (
                <th key={index} className='editable-table-header'>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeSheet.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className='row-number-cell'>{rowIndex + 1}</td>
                {columns.map((column, colIndex) => {
                  const cellValue = row[column];
                  const isValid = isCellValid(column, cellValue);
                  return (
                    <td key={colIndex} className={`editable-table-cell ${!isValid ? 'invalid' : ''}`}>
                      <input
                        type='text'
                        value={cellValue ?? ''}
                        onChange={e => handleCellChange(rowIndex, column, e.target.value)}
                        className='editable-cell-input'
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 시트 탭 */}
      <div className='sheet-tabs-container'>
        {data.map((sheet, index) => (
          <button
            key={index}
            className={`sheet-tab ${index === activeSheetIndex ? 'active' : ''}`}
            onClick={() => setActiveSheetIndex(index)}
          >
            {sheet.sheetName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EditableDataTable;
