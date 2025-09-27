import React from 'react';

interface TableColumn {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface TableProps {
  /** 테이블 컬럼 정의 */
  columns: TableColumn[];
  /** 테이블 데이터 */
  data: any[];
  /** 로딩 상태 */
  loading?: boolean;
  /** 행 클릭 핸들러 */
  onRowClick?: (record: any, index: number) => void;
  /** 추가 클래스명 */
  className?: string;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
}

/**
 * DUGIGO 테이블 컴포넌트
 * 데이터 중심의 관리용 테이블
 */
export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  onRowClick,
  className = '',
  emptyMessage = '데이터가 없습니다.',
}) => {
  const getTableClassName = () => {
    return `dugigo-table-container ${className}`.trim();
  };

  const getRowClassName = (record: any, index: number) => {
    let classes = ['dugigo-table-row'];
    if (onRowClick) classes.push('dugigo-table-row-clickable');
    return classes.join(' ');
  };

  if (loading) {
    return (
      <div className={getTableClassName()}>
        <div className='dugigo-table-loading'>
          테이블 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={getTableClassName()}>
        <div className='dugigo-table-empty'>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={getTableClassName()}>
      <table className='dugigo-table'>
        <thead className='dugigo-table-header'>
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className={`dugigo-table-header-cell dugigo-table-align-${column.align || 'left'}`}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='dugigo-table-body'>
          {data.map((record, index) => (
            <tr
              key={index}
              className={getRowClassName(record, index)}
              onClick={onRowClick ? () => onRowClick(record, index) : undefined}
            >
              {columns.map(column => (
                <td
                  key={column.key}
                  className={`dugigo-table-cell dugigo-table-align-${column.align || 'left'}`}
                >
                  {column.render ? column.render(record[column.key], record, index) : record[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
